"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { formatCurrency } from "@/lib/formatCurrency";

interface SummaryCardsProps {
  balance: number;
  income: number;
  expense: number;
}

const STORAGE_KEY = "dompetq_hide_balance";

export default function SummaryCards({ balance, income, expense }: SummaryCardsProps) {
  const [hideBalance, setHideBalance] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "true") setHideBalance(true);
  }, []);

  const toggleHideBalance = () => {
    const next = !hideBalance;
    setHideBalance(next);
    localStorage.setItem(STORAGE_KEY, String(next));
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  const maskValue = (amount: number) => {
    if (!mounted) return formatCurrency(amount);
    return hideBalance ? "Rp ••••••••" : formatCurrency(amount);
  };

  return (
    <div className="space-y-4">
      {/* 1. Kartu Saldo Utama Glassmorphism iOS yang Bersih & Elegan */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 text-white shadow-xl transition-all duration-300 border border-white/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 dark:from-slate-950 dark:via-blue-950/80 dark:to-slate-900">
        {/* Glow Ambient Halus di Latar Belakang */}
        <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-blue-500/25 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-52 w-52 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_70%)] pointer-events-none" />

        {/* Baris Atas: Label & Tombol Mode Privasi */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xs">
              <Wallet className="h-4 w-4 text-blue-300" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200/90">
              Saldo Saat Ini
            </span>
          </div>

          <button
            type="button"
            onClick={toggleHideBalance}
            aria-label={hideBalance ? "Tampilkan Saldo" : "Sembunyikan Saldo"}
            title={hideBalance ? "Tampilkan Saldo" : "Sembunyikan Saldo"}
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-md border border-white/20 text-blue-100 hover:bg-white/20 active:scale-95 transition-all shadow-sm"
          >
            {hideBalance ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span className="text-xs">Tampilkan</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                <span className="text-xs">Sembunyikan</span>
              </>
            )}
          </button>
        </div>

        {/* Nominal Saldo Utama */}
        <div className="relative z-10 mt-5">
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums drop-shadow-sm">
            {maskValue(balance)}
          </p>
          <p className="mt-1 text-xs text-blue-200/70">
            {balance < 0 ? "Pengeluaran melebihi pemasukan" : "Pemasukan dikurangi pengeluaran"}
          </p>
        </div>
      </div>

      {/* 2. Kartu Sub-Ringkasan: Pemasukan & Pengeluaran */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Pemasukan */}
        <div className="group relative overflow-hidden rounded-3xl ios-glass-card p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/5">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-bl from-emerald-500/10 dark:from-emerald-500/20 to-transparent blur-xl" />
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Pemasukan
            </h2>
            <span className="grid h-10 w-10 place-items-center rounded-2xl border backdrop-blur-md shadow-sm bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-500/20 dark:border-emerald-500/30">
              <TrendingUp aria-hidden="true" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </span>
          </div>
          <p className="mt-4 break-words text-2xl sm:text-3xl font-bold tabular-nums tracking-tight text-emerald-600 dark:text-emerald-400">
            {maskValue(income)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Seluruh transaksi pemasukan</p>
        </div>

        {/* Pengeluaran */}
        <div className="group relative overflow-hidden rounded-3xl ios-glass-card p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-500/5">
          <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-bl from-rose-500/10 dark:from-rose-500/20 to-transparent blur-xl" />
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Pengeluaran
            </h2>
            <span className="grid h-10 w-10 place-items-center rounded-2xl border backdrop-blur-md shadow-sm bg-rose-500/10 border-rose-500/20 dark:bg-rose-500/20 dark:border-rose-500/30">
              <TrendingDown aria-hidden="true" className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </span>
          </div>
          <p className="mt-4 break-words text-2xl sm:text-3xl font-bold tabular-nums tracking-tight text-rose-600 dark:text-rose-400">
            {maskValue(expense)}
          </p>
          <p className="mt-1 text-xs text-slate-400">Seluruh transaksi pengeluaran</p>
        </div>
      </div>
    </div>
  );
}
