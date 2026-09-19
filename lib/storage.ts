import type { Transaction, TransactionType } from "@/types/transaction";
import { isValidDateString } from "./date";

export const STORAGE_KEY = "personal_finance_transactions";

/** Key cadangan: data rusak diselamatkan ke sini sebelum ditimpa. */
export const CORRUPT_BACKUP_KEY = "personal_finance_transactions_corrupt_backup";

export const INVALID_IMPORT_MESSAGE = "File tidak valid atau format data rusak.";

export interface StorageResult {
  ok: boolean;
  error: string | null;
}

export interface LoadResult {
  transactions: Transaction[];
  error: string | null;
}

export interface ImportParseResult {
  ok: boolean;
  transactions: Transaction[];
  error: string | null;
}

const TYPE_VALUES = ["income", "expense"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTransactionType(value: unknown): value is TransactionType {
  return typeof value === "string" && (TYPE_VALUES as readonly string[]).includes(value);
}

export function createTransactionId(): string {
  const suffix = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${Date.now()}${suffix}`;
}

/**
 * Mengubah data mentah menjadi Transaction yang valid.
 * Mengembalikan null bila field wajib tidak valid, sehingga data rusak
 * tidak pernah masuk ke dalam state aplikasi.
 */
export function normalizeTransaction(value: unknown): Transaction | null {
  if (!isRecord(value)) return null;

  const { id, type, amount, category, description, date, createdAt } = value;

  if (!isTransactionType(type)) return null;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) return null;
  if (typeof category !== "string" || category.trim() === "") return null;
  if (typeof date !== "string" || !isValidDateString(date)) return null;

  const normalizedId =
    typeof id === "string" && id.trim() !== "" ? id : createTransactionId();
  const normalizedDescription = typeof description === "string" ? description : "";
  const normalizedCreatedAt =
    typeof createdAt === "string" && !Number.isNaN(Date.parse(createdAt))
      ? createdAt
      : new Date(`${date}T00:00:00.000Z`).toISOString();

  return {
    id: normalizedId,
    type,
    amount: Math.round(amount),
    category: category.trim(),
    description: normalizedDescription,
    date,
    createdAt: normalizedCreatedAt,
  };
}

/** Mengembalikan null bila value bukan array transaksi yang seluruhnya valid. */
export function parseTransactionArray(value: unknown): Transaction[] | null {
  if (!Array.isArray(value)) return null;
  const result: Transaction[] = [];
  for (const item of value) {
    const transaction = normalizeTransaction(item);
    if (!transaction) return null;
    result.push(transaction);
  }
  return result;
}

/** Menerima file export berupa array transaksi atau objek { transactions: [...] }. */
export function parseTransactionsJson(raw: string): ImportParseResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, transactions: [], error: INVALID_IMPORT_MESSAGE };
  }

  const candidate = isRecord(parsed) && "transactions" in parsed ? parsed.transactions : parsed;
  const transactions = parseTransactionArray(candidate);

  if (!transactions) {
    return { ok: false, transactions: [], error: INVALID_IMPORT_MESSAGE };
  }

  return { ok: true, transactions, error: null };
}

export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const probe = "__finance_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

/**
 * Membaca data dari LocalStorage. Data yang rusak tidak pernah membuat
 * aplikasi crash: isinya dipindahkan ke key cadangan lalu state dikosongkan.
 */
export function loadTransactions(): LoadResult {
  if (typeof window === "undefined") return { transactions: [], error: null };

  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return {
      transactions: [],
      error: "LocalStorage tidak dapat diakses. Data transaksi tidak akan tersimpan.",
    };
  }

  if (raw === null || raw.trim() === "") return { transactions: [], error: null };

  const parsed = parseTransactionsJson(raw);
  if (!parsed.ok) {
    backupCorruptData(raw);
    return {
      transactions: [],
      error:
        "Data transaksi yang tersimpan tidak dapat dibaca karena formatnya rusak. Data lama sudah dicadangkan ke LocalStorage.",
    };
  }

  return { transactions: parsed.transactions, error: null };
}

function backupCorruptData(raw: string): void {
  try {
    window.localStorage.setItem(CORRUPT_BACKUP_KEY, raw);
  } catch {
    // Bila pencadangan gagal, aplikasi tetap berjalan dengan kondisi kosong.
  }
}

export function saveTransactions(transactions: Transaction[]): StorageResult {
  if (typeof window === "undefined") return { ok: true, error: null };
  try {
    window.localStorage.setItem(STORAGE_KEY, serializeTransactions(transactions));
    return { ok: true, error: null };
  } catch {
    return {
      ok: false,
      error:
        "Gagal menyimpan data ke LocalStorage. Penyimpanan browser mungkin penuh atau diblokir.",
    };
  }
}

export function clearStoredTransactions(): StorageResult {
  if (typeof window === "undefined") return { ok: true, error: null };
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return { ok: true, error: null };
  } catch {
    return { ok: false, error: "Gagal menghapus data dari LocalStorage." };
  }
}

export function serializeTransactions(transactions: Transaction[]): string {
  return JSON.stringify(transactions, null, 2);
}

/** Memicu unduhan file JSON di browser. */
export function downloadJsonFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Menggabungkan transaksi hasil import ke data lama.
 * Transaksi dengan id yang sudah ada dilewati agar tidak terjadi duplikat.
 */
export function mergeTransactions(
  existing: Transaction[],
  incoming: Transaction[],
): Transaction[] {
  const knownIds = new Set(existing.map((transaction) => transaction.id));
  const merged = [...existing];
  for (const transaction of incoming) {
    if (knownIds.has(transaction.id)) continue;
    knownIds.add(transaction.id);
    merged.push(transaction);
  }
  return merged;
}
