"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Edit3, Target } from "lucide-react";

import Card, { CardHeader } from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { formatCurrency, formatNumberID } from "@/lib/formatCurrency";
import { formatMonthLabel } from "@/lib/date";
import { haptic } from "@/lib/haptic";

interface MonthlySummaryProps {
  monthKey: string;
  months: string[];
  income: number;
  expense: number;
  balance: number;
  onMonthChange?: (monthKey: string) => void;
}

const BUDGET_STORAGE_KEY = "dompetq_monthly_budgets";

export default function MonthlySummary({
  monthKey,
  months,
  income,
  expense,
  balance,
  onMonthChange,
}: MonthlySummaryProps) {
  const [budget, setBudget] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempBudgetInput, setTempBudgetInput] = useState("");

  // Baca budget spesifik untuk bulan aktif dari LocalStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(BUDGET_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setBudget(parsed[monthKey] ?? 0);
      } else {
        setBudget(0);
      }
    } catch {
      setBudget(0);
    }
  }, [monthKey]);

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const newBudget = Number(tempBudgetInput.replace(/\D/g, "")) || 0;
    setBudget(newBudget);
    try {
      const raw = localStorage.getItem(BUDGET_STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : {};
      data[monthKey] = newBudget;
      localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(data));
    } catch {}
    haptic.medium();
    setIsModalOpen(false);
  };

  const openBudgetModal = () => {
    setTempBudgetInput(budget > 0 ? String(budget) : "");
    setIsModalOpen(true);
    haptic.light();
  };

  // Kalkulasi persentase dan stroke lingkaran SVG
  const percentUsed = budget > 0 ? Math.min(Math.round((expense / budget) * 100), 100) : 0;
  const isOverBudget = budget > 0 && expense > budget;
  const remainingBudget = Math.max(0, budget - expense);

  // SVG Ring Calculations (Radius: 36, Circumference: ~226.19)
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentUsed / 100) * circumference;

  return (
    <>
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
                      <option
                        key={month}
                        value={month}
                        className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      >
                        {formatMonthLabel(month)}
                      </option>
                    ))
                  )}
                </select>
              </div>
            ) : null
          }
        />

        {/* Apple Watch Style Activity Ring Budget Widget */}
        <div className="px-6 py-4 border-b border-white/40 dark:border-white/10">
          <div className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/40 dark:bg-slate-800/40 p-4 backdrop-blur-md shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  Target Budget Bulanan
                </span>
              </div>
              <button
                type="button"
                onClick={openBudgetModal}
                className="flex items-center gap-1 rounded-xl px-2 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 active:scale-95 transition-all"
              >
                <Edit3 className="h-3 w-3" />
                <span>{budget > 0 ? "Ubah" : "Atur"}</span>
              </button>
            </div>

            {budget === 0 ? (
              <div
                onClick={openBudgetModal}
                className="cursor-pointer rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-3 text-center transition-all hover:bg-white/60 dark:hover:bg-slate-700/40"
              >
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Belum ada batas budget. <span className="font-semibold text-blue-600 dark:text-blue-400">Klik di sini</span> untuk pasang target pengeluaran.
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                {/* Visual Circle Activity Ring */}
                <div className="relative h-20 w-20 shrink-0">
                  <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 88 88">
                    {/* Ring Latar Belakang */}
                    <circle
                      cx="44"
                      cy="44"
                      r={radius}
                      className="stroke-slate-200 dark:stroke-slate-700/60"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    {/* Ring Progress Indikator Berwarna */}
                    <circle
                      cx="44"
                      cy="44"
                      r={radius}
                      stroke={
                        isOverBudget
                          ? "#ef4444"
                          : percentUsed > 80
                          ? "#f59e0b"
                          : "#10b981"
                      }
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={`text-xs font-extrabold tabular-nums ${
                        isOverBudget
                          ? "text-rose-600 dark:text-rose-400"
                          : percentUsed > 80
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {percentUsed}%
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400">terpakai</span>
                  </div>
                </div>

                {/* Rincian Angka Budget */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Batas:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(budget)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      {isOverBudget ? "Lebih:" : "Sisa:"}
                    </span>
                    <span
                      className={`font-bold tabular-nums ${
                        isOverBudget
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {isOverBudget
                        ? `+${formatCurrency(expense - budget)}`
                        : formatCurrency(remainingBudget)}
                    </span>
                  </div>
                  {/* Status Bar Indicator Ringkas */}
                  <div className="pt-1">
                    {isOverBudget ? (
                      <p className="flex items-center gap-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>Melebihi budget bulanan</span>
                      </p>
                    ) : percentUsed > 80 ? (
                      <p className="flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>Mendekati limit budget</span>
                      </p>
                    ) : (
                      <p className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3 shrink-0" />
                        <span>Pengeluaran terkendali</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <dl className="divide-y divide-white/40 dark:divide-white/10 px-6 text-sm">
          <div className="flex items-center justify-between gap-4 py-3.5">
            <dt className="text-slate-500 dark:text-slate-400 font-medium">Pemasukan</dt>
            <dd className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {formatCurrency(income)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3.5">
            <dt className="text-slate-500 dark:text-slate-400 font-medium">Pengeluaran</dt>
            <dd className="font-semibold tabular-nums text-rose-600 dark:text-rose-400">
              {formatCurrency(expense)}
            </dd>
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

      {/* Modal Atur Budget Bulanan */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Batas Budget Bulanan"
        description={`Atur batas maksimal pengeluaran untuk ${formatMonthLabel(monthKey)}.`}
        size="sm"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <div>
            <label htmlFor="budget-amount" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Nominal Budget (Rp)
            </label>
            <input
              id="budget-amount"
              type="text"
              inputMode="numeric"
              value={tempBudgetInput ? formatNumberID(Number(tempBudgetInput.replace(/\D/g, ""))) : ""}
              onChange={(e) => setTempBudgetInput(e.target.value)}
              placeholder="Contoh: 3.000.000"
              className="w-full rounded-2xl ios-glass-input px-3.5 py-2.5 text-base font-semibold tabular-nums text-slate-900 dark:text-slate-100 focus-visible:outline-none"
              autoFocus
            />
          </div>

          {/* Quick Presets Budget */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[1000000, 2000000, 3000000, 5000000, 10000000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  haptic.light();
                  setTempBudgetInput(String(val));
                }}
                className="rounded-xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 transition-all"
              >
                {val / 1000000} Juta
              </button>
            ))}
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-3 border-t border-white/40 dark:border-white/10">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Simpan Budget
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
