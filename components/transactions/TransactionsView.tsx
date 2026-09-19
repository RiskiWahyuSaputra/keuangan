"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import PageHeader from "@/components/layout/PageHeader";
import DeleteDialog from "@/components/transactions/DeleteDialog";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionList from "@/components/transactions/TransactionList";
import Button, { buttonStyles } from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import StorageAlert from "@/components/ui/StorageAlert";
import { useTransactions } from "@/hooks/useTransactions";
import {
  EMPTY_FILTER,
  filterTransactions,
  getAvailableCategories,
  getAvailableMonths,
  hasActiveFilter,
  sortTransactions,
  type SortOption,
  type TransactionFilter,
} from "@/lib/calculations";
import type { Transaction, TransactionInput } from "@/types/transaction";

export default function TransactionsView() {
  const {
    transactions,
    isLoaded,
    storageError,
    clearStorageError,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const [filter, setFilter] = useState<TransactionFilter>(EMPTY_FILTER);
  const [sort, setSort] = useState<SortOption>("date-desc");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);

  const months = useMemo(() => getAvailableMonths(transactions), [transactions]);
  const categories = useMemo(() => getAvailableCategories(transactions), [transactions]);
  const visibleTransactions = useMemo(
    () => sortTransactions(filterTransactions(transactions, filter), sort),
    [transactions, filter, sort],
  );

  const openAddForm = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEditForm = (transaction: Transaction) => {
    setEditing(transaction);
    setFormOpen(true);
  };

  const handleSubmit = (input: TransactionInput) => {
    if (editing) {
      updateTransaction(editing.id, input);
    } else {
      addTransaction(input);
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleConfirmDelete = () => {
    if (deleting) deleteTransaction(deleting.id);
    setDeleting(null);
  };

  const handleReset = () => {
    setFilter(EMPTY_FILTER);
    setSort("date-desc");
  };

  return (
    <>
      <PageHeader
        title="Transaksi"
        description="Kelola seluruh catatan pemasukan dan pengeluaranmu."
        action={
          <Button variant="primary" onClick={openAddForm}>
            <Plus aria-hidden="true" className="h-4 w-4" />
            Tambah Transaksi
          </Button>
        }
      />

      {storageError ? (
        <StorageAlert message={storageError} onDismiss={clearStorageError} />
      ) : null}

      {!isLoaded ? (
        <LoadingState />
      ) : transactions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.03]">
          <EmptyState
            title="Belum ada transaksi"
            description="Mulai catat pemasukan atau pengeluaran untuk melihat kondisi keuanganmu."
            action={
              <Button variant="primary" onClick={openAddForm}>
                <Plus aria-hidden="true" className="h-4 w-4" />
                Tambah Transaksi
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <TransactionFilters
            filter={filter}
            sort={sort}
            months={months}
            categories={categories}
            resultCount={visibleTransactions.length}
            onFilterChange={(patch) => setFilter((current) => ({ ...current, ...patch }))}
            onSortChange={setSort}
            onReset={handleReset}
          />

          {visibleTransactions.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.03]">
              <EmptyState
                title="Tidak ada transaksi yang sesuai."
                description="Coba ubah kata kunci pencarian atau reset filter yang sedang aktif."
                compact
                action={
                  hasActiveFilter(filter) || sort !== "date-desc" ? (
                    <button type="button" onClick={handleReset} className={buttonStyles("secondary")}>
                      Reset filter
                    </button>
                  ) : null
                }
              />
            </div>
          ) : (
            <TransactionList
              transactions={visibleTransactions}
              onEdit={openEditForm}
              onDelete={setDeleting}
            />
          )}
        </>
      )}

      <TransactionForm
        open={formOpen}
        transaction={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        transaction={deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
