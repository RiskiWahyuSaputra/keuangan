"use client";

import { useMemo, useState } from "react";

import MonthlySummary from "@/components/dashboard/MonthlySummary";
import SavingsGoals from "@/components/dashboard/SavingsGoals";
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
          title="Target & Celengan"
          description="Kelola batas budget bulanan dan wujudkan rencana tabungan impianmu."
        />
        <LoadingState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Target & Celengan"
        description="Kelola batas budget bulanan dan pantau perkembangan celengan impianmu."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Kolom Kiri: Target Budget Bulanan dengan Activity Ring */}
        <div className="space-y-4">
          <MonthlySummary
            monthKey={activeMonth}
            months={monthOptions}
            income={monthlyIncome}
            expense={monthlyExpense}
            balance={monthlyBalance}
            onMonthChange={setSelectedMonth}
          />
        </div>

        {/* Kolom Kanan: Celengan Impian / Savings Goals */}
        <div className="space-y-4">
          <SavingsGoals />
        </div>
      </div>
    </div>
  );
}
