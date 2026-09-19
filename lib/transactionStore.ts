import type { Transaction, TransactionInput } from "@/types/transaction";
import {
  STORAGE_KEY,
  clearStoredTransactions,
  createTransactionId,
  isStorageAvailable,
  loadTransactions,
  mergeTransactions,
  saveTransactions,
} from "./storage";

export type ImportMode = "replace" | "merge";

export interface FinanceSnapshot {
  transactions: Transaction[];
  /** false hanya saat server render / hydration, sebelum data dibaca dari browser. */
  isLoaded: boolean;
  isPersistent: boolean;
  storageError: string | null;
}

const STORAGE_UNAVAILABLE_MESSAGE =
  "LocalStorage tidak tersedia di browser ini, jadi transaksi tidak akan tersimpan setelah halaman ditutup.";

/**
 * Dipakai saat server render dan saat hydration, sehingga markup pertama di
 * browser selalu sama dengan HTML dari server (tidak ada hydration mismatch).
 */
const SERVER_SNAPSHOT: FinanceSnapshot = {
  transactions: [],
  isLoaded: false,
  isPersistent: true,
  storageError: null,
};

let snapshot: FinanceSnapshot | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function readFromStorage(): FinanceSnapshot {
  if (!isStorageAvailable()) {
    return {
      transactions: [],
      isLoaded: true,
      isPersistent: false,
      storageError: STORAGE_UNAVAILABLE_MESSAGE,
    };
  }

  const result = loadTransactions();
  return {
    transactions: result.transactions,
    isLoaded: true,
    isPersistent: true,
    storageError: result.error,
  };
}

/** Snapshot harus stabil (tidak dibuat ulang) agar React tidak render tanpa henti. */
export function getFinanceSnapshot(): FinanceSnapshot {
  if (snapshot === null) snapshot = readFromStorage();
  return snapshot;
}

export function getServerFinanceSnapshot(): FinanceSnapshot {
  return SERVER_SNAPSHOT;
}

function setSnapshot(next: FinanceSnapshot): void {
  snapshot = next;
  emit();
}

/** Menyimpan perubahan ke LocalStorage lalu memperbarui seluruh subscriber. */
function commitTransactions(transactions: Transaction[]): void {
  const current = getFinanceSnapshot();
  const result =
    transactions.length === 0 ? clearStoredTransactions() : saveTransactions(transactions);

  setSnapshot({
    ...current,
    transactions,
    isLoaded: true,
    storageError: result.ok ? null : result.error,
  });
}

function handleStorageEvent(event: StorageEvent): void {
  // key null berarti seluruh LocalStorage dibersihkan.
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  snapshot = readFromStorage();
  emit();
}

/** Sinkronisasi antar tab pada browser yang sama. */
export function subscribeToFinanceStore(listener: () => void): () => void {
  listeners.add(listener);

  if (typeof window !== "undefined" && listeners.size === 1) {
    window.addEventListener("storage", handleStorageEvent);
  }

  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined" && listeners.size === 0) {
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

export function addTransactionToStore(input: TransactionInput): void {
  const transaction: Transaction = {
    ...input,
    id: createTransactionId(),
    createdAt: new Date().toISOString(),
  };
  commitTransactions([transaction, ...getFinanceSnapshot().transactions]);
}

export function updateTransactionInStore(id: string, input: TransactionInput): void {
  commitTransactions(
    getFinanceSnapshot().transactions.map((transaction) =>
      transaction.id === id ? { ...transaction, ...input } : transaction,
    ),
  );
}

export function deleteTransactionFromStore(id: string): void {
  commitTransactions(
    getFinanceSnapshot().transactions.filter((transaction) => transaction.id !== id),
  );
}

/** Mengosongkan seluruh data, termasuk menghapus key di LocalStorage. */
export function clearFinanceStore(): void {
  commitTransactions([]);
}

/** Mengembalikan jumlah transaksi baru yang benar-benar disimpan. */
export function importTransactionsToStore(
  incoming: Transaction[],
  mode: ImportMode,
): number {
  const current = getFinanceSnapshot().transactions;

  if (mode === "replace") {
    commitTransactions(incoming);
    return incoming.length;
  }

  const merged = mergeTransactions(current, incoming);
  commitTransactions(merged);
  return merged.length - current.length;
}

export function dismissStoreError(): void {
  const current = getFinanceSnapshot();
  if (current.storageError === null) return;
  setSnapshot({ ...current, storageError: null });
}
