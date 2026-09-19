"use client";

import { useMemo, useState } from "react";

import MonthlySummary from "@/components/dashboard/MonthlySummary";
import PageHeader from "@/components/layout/PageHeader";
import LoadingState from "@/components/ui/LoadingState";
import { useTransactions } from "@/hooks/useTransactions";
import {
  calculateMonthlyBalance,
  calculateMonthlyExpense,
  calculateMonthlyIncome,
  getAvailableMonths,
} from "@/lib/calculations";
import { getCurrentMonthKey } from "@/lib/date";

export default function TargetsView() {
  const { transactions, isLoaded } = useTransactions();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const currentMonthKey = useMemo(() => getCurrentMonthKey(), []);
  const months = useMemo(() => getAvailableMonths(transactions), [transactions]);
  const monthOptions = useMemo(
    () => (months.includes(currentMonthKey) ? months : [currentMonthKey, ...months]),
    [months, currentMonthKey],
  );
  const activeMonth = selectedMonth ?? currentMonthKey;

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

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Target Budget"
          description="Pantau batas pengeluaran bulanan dan jaga keuangan tetap sehat."
        />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Target Budget"
        description="Kelola dan pantau batas pengeluaran bulanan dengan Activity Ring interaktif."
      />

      <div className="max-w-xl mx-auto">
        <MonthlySummary
          monthKey={activeMonth}
          months={monthOptions}
          income={monthlyIncome}
          expense={monthlyExpense}
          balance={monthlyBalance}
          onMonthChange={setSelectedMonth}
        />
      </div>
    </div>
  );
}
