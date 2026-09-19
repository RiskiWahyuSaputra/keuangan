"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import MonthlySummary from "@/components/dashboard/MonthlySummary";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import SummaryCards from "@/components/dashboard/SummaryCards";
import PageHeader from "@/components/layout/PageHeader";
import TopExpenseCategories from "@/components/statistics/TopExpenseCategories";
import DeleteDialog from "@/components/transactions/DeleteDialog";
import TransactionForm from "@/components/transactions/TransactionForm";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import LoadingState from "@/components/ui/LoadingState";
import StorageAlert from "@/components/ui/StorageAlert";
import { useTransactions } from "@/hooks/useTransactions";
import {
  calculateBalance,
  calculateExpenseByCategoryForMonth,
  calculateMonthlyBalance,
  calculateMonthlyExpense,
  calculateMonthlyIncome,
  calculateTotalExpense,
  calculateTotalIncome,
  filterByMonth,
  getAvailableMonths,
  sortTransactions,
} from "@/lib/calculations";
import { formatMonthLabel, getCurrentMonthKey } from "@/lib/date";
import type { Transaction, TransactionInput } from "@/types/transaction";

const RECENT_LIMIT = 5;

export default function DashboardView() {
  const {
    transactions,
    isLoaded,
    storageError,
    clearStorageError,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState<Transaction | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const currentMonthKey = useMemo(() => getCurrentMonthKey(), []);
  const months = useMemo(() => getAvailableMonths(transactions), [transactions]);
  const monthOptions = useMemo(
    () => (months.includes(currentMonthKey) ? months : [currentMonthKey, ...months]),
    [months, currentMonthKey],
  );

  const activeMonth = selectedMonth ?? currentMonthKey;

  const totalIncome = useMemo(() => calculateTotalIncome(transactions), [transactions]);
  const totalExpense = useMemo(() => calculateTotalExpense(transactions), [transactions]);
  const balance = useMemo(() => calculateBalance(transactions), [transactions]);

  const monthlyIncome = useMemo(
    () => calculateMonthlyIncome(transactions, activeMonth),
    [transactions, activeMonth],
  );
  const monthlyExpense = useMemo(
    () => calculateMonthlyExpense(transactions, activeMonth),
    [transactions, activeMonth],
  );
  const monthlyBalance = useMemo(
    () => calculateMonthlyBalance(transactions, activeMonth),
    [transactions, activeMonth],
  );
  const monthlyCategories = useMemo(
    () => calculateExpenseByCategoryForMonth(transactions, activeMonth),
    [transactions, activeMonth],
  );

  const recentTransactions = useMemo(
    () => sortTransactions(transactions).slice(0, RECENT_LIMIT),
    [transactions],
  );

  const monthTransactionCount = useMemo(
    () => filterByMonth(transactions, activeMonth).length,
    [transactions, activeMonth],
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

  return (
    <>
      <PageHeader
        title="Selamat Datang"
        description="Ringkasan kondisi keuangan pribadimu."
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
      ) : (
        <div className="space-y-5">
          <SummaryCards balance={balance} income={totalIncome} expense={totalExpense} />

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentTransactions
                transactions={recentTransactions}
                totalCount={transactions.length}
                onAdd={openAddForm}
                onEdit={openEditForm}
                onDelete={setDeleting}
              />
            </div>

            <div className="space-y-5">
              <MonthlySummary
                monthKey={activeMonth}
                months={monthOptions}
                income={monthlyIncome}
                expense={monthlyExpense}
                balance={monthlyBalance}
                onMonthChange={setSelectedMonth}
              />

              <Card className="overflow-hidden">
                <CardHeader
                  title="Pengeluaran Terbesar"
                  description={`${formatMonthLabel(activeMonth)} · ${monthTransactionCount} transaksi`}
                />
                <TopExpenseCategories
                  categories={monthlyCategories}
                  totalExpense={monthlyExpense}
                />
              </Card>
            </div>
          </div>
        </div>
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
