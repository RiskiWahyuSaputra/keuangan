"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { useToast } from "@/components/ui/ToastProvider";
import {
  addTransactionToStore,
  clearFinanceStore,
  deleteTransactionFromStore,
  dismissStoreError,
  getFinanceSnapshot,
  getServerFinanceSnapshot,
  importTransactionsToStore,
  subscribeToFinanceStore,
  updateTransactionInStore,
  type ImportMode,
} from "@/lib/transactionStore";
import type { Transaction, TransactionInput } from "@/types/transaction";

export type { ImportMode };

export interface UseTransactionsResult {
  transactions: Transaction[];
  /** false selama server render & hydration, supaya markup awal tetap sama. */
  isLoaded: boolean;
  /** true bila browser ini benar-benar bisa menyimpan data. */
  isPersistent: boolean;
  storageError: string | null;
  clearStorageError: () => void;
  addTransaction: (input: TransactionInput) => void;
  updateTransaction: (id: string, input: TransactionInput) => void;
  deleteTransaction: (id: string) => void;
  clearAllTransactions: () => void;
  importTransactions: (transactions: Transaction[], mode: ImportMode) => number;
}

/**
 * Sumber kebenaran data transaksi.
 * Data dibaca dari LocalStorage lewat useSyncExternalStore sehingga aman
 * untuk SSR/hydration dan tetap sinkron antar komponen maupun antar tab.
 */
export function useTransactions(): UseTransactionsResult {
  const { toast } = useToast();
  const snapshot = useSyncExternalStore(
    subscribeToFinanceStore,
    getFinanceSnapshot,
    getServerFinanceSnapshot,
  );

  const addTransaction = useCallback(
    (input: TransactionInput) => {
      addTransactionToStore(input);
      toast("Transaksi baru berhasil disimpan", "success");
    },
    [toast],
  );

  const updateTransaction = useCallback(
    (id: string, input: TransactionInput) => {
      updateTransactionInStore(id, input);
      toast("Perubahan transaksi disimpan", "success");
    },
    [toast],
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      deleteTransactionFromStore(id);
      toast("Transaksi berhasil dihapus", "delete");
    },
    [toast],
  );

  const clearAllTransactions = useCallback(() => {
    clearFinanceStore();
    toast("Semua data transaksi berhasil dihapus.");
  }, [toast]);

  const importTransactions = useCallback(
    (incoming: Transaction[], mode: ImportMode): number => {
      const addedCount = importTransactionsToStore(incoming, mode);
      toast(
        mode === "replace"
          ? `Data berhasil di-import (${incoming.length} transaksi).`
          : `Data berhasil di-import (${addedCount} transaksi baru).`,
      );
      return addedCount;
    },
    [toast],
  );

  const clearStorageError = useCallback(() => dismissStoreError(), []);

  return useMemo<UseTransactionsResult>(
    () => ({
      transactions: snapshot.transactions,
      isLoaded: snapshot.isLoaded,
      isPersistent: snapshot.isPersistent,
      storageError: snapshot.storageError,
      clearStorageError,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      clearAllTransactions,
      importTransactions,
    }),
    [
      snapshot,
      clearStorageError,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      clearAllTransactions,
      importTransactions,
    ],
  );
}
