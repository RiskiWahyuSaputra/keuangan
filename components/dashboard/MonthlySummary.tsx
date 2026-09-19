"use client";

import Card, { CardHeader } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatMonthLabel } from "@/lib/date";

interface MonthlySummaryProps {
  monthKey: string;
  months: string[];
  income: number;
  expense: number;
  balance: number;
  onMonthChange?: (monthKey: string) => void;
}

export default function MonthlySummary({
  monthKey,
  months,
  income,
  expense,
  balance,
  onMonthChange,
}: MonthlySummaryProps) {
  return (
    <Card>
      <CardHeader
        title="Ringkasan Bulan"
        description={formatMonthLabel(monthKey)}
        action={
          onMonthChange ? (
            <div className="w-full sm:w-44">
              <label htmlFor="monthly-summary-month" className="sr-only">
                Pilih bulan ringkasan
              </label>
              <select
                id="monthly-summary-month"
                value={monthKey}
                onChange={(event) => onMonthChange(event.target.value)}
                className="w-full rounded-2xl ios-glass-input px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 focus-visible:outline-none transition-all cursor-pointer"
              >
                {months.length === 0 ? (
                  <option value={monthKey}>{formatMonthLabel(monthKey)}</option>
                ) : (
                  months.map((month) => (
                    <option key={month} value={month} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                      {formatMonthLabel(month)}
                    </option>
                  ))
                )}
              </select>
            </div>
          ) : null
        }
      />
      <dl className="divide-y divide-white/40 dark:divide-white/10 px-6 text-sm">
        <div className="flex items-center justify-between gap-4 py-3.5">
          <dt className="text-slate-500 dark:text-slate-400 font-medium">Pemasukan</dt>
          <dd className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">{formatCurrency(income)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-3.5">
          <dt className="text-slate-500 dark:text-slate-400 font-medium">Pengeluaran</dt>
          <dd className="font-semibold tabular-nums text-rose-600 dark:text-rose-400">{formatCurrency(expense)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-3.5">
          <dt className="font-semibold text-slate-900 dark:text-slate-100">Saldo Bulan Ini</dt>
          <dd
            className={`text-base font-bold tabular-nums ${
              balance < 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-slate-100"
            }`}
          >
            {formatCurrency(balance)}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
