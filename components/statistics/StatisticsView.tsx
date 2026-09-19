"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import PageHeader from "@/components/layout/PageHeader";
import CategoryChart from "@/components/statistics/CategoryChart";
import IncomeExpenseChart from "@/components/statistics/IncomeExpenseChart";
import TopExpenseCategories from "@/components/statistics/TopExpenseCategories";
import { buttonStyles } from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import StorageAlert from "@/components/ui/StorageAlert";
import { useTransactions } from "@/hooks/useTransactions";
import {
  calculateBalance,
  calculateExpenseByCategory,
  calculateTotalExpense,
  calculateTotalIncome,
  filterByMonth,
  getAvailableMonths,
  getMonthlyChartData,
  getMonthlySummaryRows,
} from "@/lib/calculations";
import { formatMonthLabel } from "@/lib/date";
import { formatCurrency, formatNumberID } from "@/lib/formatCurrency";

const ALL_MONTHS = "all";

export default function StatisticsView() {
  const { transactions, isLoaded, storageError, clearStorageError } = useTransactions();
  const [scope, setScope] = useState<string>(ALL_MONTHS);

  const months = useMemo(() => getAvailableMonths(transactions), [transactions]);

  const activeScope = scope !== ALL_MONTHS && !months.includes(scope) ? ALL_MONTHS : scope;

  const scopedTransactions = useMemo(
    () => (activeScope === ALL_MONTHS ? transactions : filterByMonth(transactions, activeScope)),
    [transactions, activeScope],
  );

  const income = useMemo(() => calculateTotalIncome(scopedTransactions), [scopedTransactions]);
  const expense = useMemo(() => calculateTotalExpense(scopedTransactions), [scopedTransactions]);
  const balance = useMemo(() => calculateBalance(scopedTransactions), [scopedTransactions]);
  const categories = useMemo(
    () => calculateExpenseByCategory(scopedTransactions),
    [scopedTransactions],
  );
  const chartData = useMemo(
    () => getMonthlyChartData(transactions, activeScope === ALL_MONTHS ? "" : activeScope),
    [transactions, activeScope],
  );
  const monthlyRows = useMemo(() => getMonthlySummaryRows(transactions), [transactions]);

  const scopeLabel =
    activeScope === ALL_MONTHS ? "Semua Waktu" : formatMonthLabel(activeScope);

  return (
    <>
      <PageHeader
        title="Statistik"
        description="Analisis pemasukan dan pengeluaran berdasarkan data yang tersimpan di browser ini."
        action={
          months.length > 0 ? (
            <div className="w-full sm:w-52">
              <label htmlFor="statistics-scope" className="sr-only">
                Pilih periode statistik
              </label>
              <select
                id="statistics-scope"
                value={activeScope}
                onChange={(event) => setScope(event.target.value)}
                className="w-full rounded-2xl ios-glass-input px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 focus-visible:outline-none transition-all cursor-pointer"
              >
                <option value={ALL_MONTHS}>Semua Waktu</option>
                {months.map((monthKey) => (
                  <option key={monthKey} value={monthKey}>
                    {formatMonthLabel(monthKey)}
                  </option>
                ))}
              </select>
            </div>
          ) : null
        }
      />

      {storageError ? (
        <StorageAlert message={storageError} onDismiss={clearStorageError} />
      ) : null}

      {!isLoaded ? (
        <LoadingState />
      ) : transactions.length === 0 ? (
        <div className="rounded-3xl ios-glass-card">
          <EmptyState
            title="Belum ada transaksi"
            description="Mulai catat transaksi untuk melihat grafik perbandingan dan kategori pengeluaran."
            action={
              <Link href="/transactions" className={buttonStyles("primary")}>
                <Plus aria-hidden="true" className="h-4 w-4" />
                Catat Transaksi Pertama
              </Link>
            }
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* iOS-styled Highlights */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl ios-glass-card p-5 sm:p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pemasukan ({scopeLabel})
              </span>
              <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-600">
                {formatCurrency(income)}
              </p>
            </div>
            <div className="rounded-3xl ios-glass-card p-5 sm:p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pengeluaran ({scopeLabel})
              </span>
              <p className="mt-2 text-2xl font-bold tabular-nums text-rose-600">
                {formatCurrency(expense)}
              </p>
            </div>
            <div className="rounded-3xl ios-glass-card p-5 sm:p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Selisih ({scopeLabel})
              </span>
              <p
                className={`mt-2 text-2xl font-bold tabular-nums ${
                  balance < 0 ? "text-rose-600" : "text-slate-900"
                }`}
              >
                {formatCurrency(balance)}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader
                title="Pemasukan vs Pengeluaran"
                description="Perbandingan tren bulanan"
              />
              <IncomeExpenseChart data={chartData} />
            </Card>

            <Card>
              <CardHeader
                title="Kategori Pengeluaran"
                description={`Distribusi pengeluaran ${scopeLabel.toLowerCase()}`}
              />
              <CategoryChart data={categories} total={expense} />
            </Card>
          </div>

          <Card>
            <CardHeader
              title="Kategori Terbesar"
              description={`Pengeluaran terbesar pada periode ${scopeLabel.toLowerCase()}`}
            />
            <TopExpenseCategories categories={categories} totalExpense={expense} limit={8} />
          </Card>

          {monthlyRows.length > 0 ? (
            <Card className="overflow-hidden">
              <CardHeader
                title="Rekap per Bulan"
                description="Rincian total pemasukan, pengeluaran, dan saldo per bulan"
              />
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <caption className="sr-only">Rekap bulanan keuangan</caption>
                  <thead>
                    <tr className="border-b border-white/60 bg-white/40 text-xs font-semibold uppercase tracking-wider text-slate-500 backdrop-blur-sm">
                      <th scope="col" className="px-5 py-3.5">
                        Bulan
                      </th>
                      <th scope="col" className="px-5 py-3.5 text-right">
                        Pemasukan
                      </th>
                      <th scope="col" className="px-5 py-3.5 text-right">
                        Pengeluaran
                      </th>
                      <th scope="col" className="px-5 py-3.5 text-right">
                        Saldo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                    {monthlyRows.map((row) => (
                      <tr key={row.monthKey} className="transition-colors hover:bg-white/50">
                        <td className="whitespace-nowrap px-5 py-3.5 font-medium text-slate-900">
                          {formatMonthLabel(row.monthKey)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-right font-semibold tabular-nums text-emerald-600">
                          Rp {formatNumberID(row.income)}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-right font-semibold tabular-nums text-rose-600">
                          Rp {formatNumberID(row.expense)}
                        </td>
                        <td
                          className={`whitespace-nowrap px-5 py-3.5 text-right font-bold tabular-nums ${
                            row.balance < 0 ? "text-rose-600" : "text-slate-900"
                          }`}
                        >
                          Rp {formatNumberID(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : null}
        </div>
      )}
    </>
  );
}
