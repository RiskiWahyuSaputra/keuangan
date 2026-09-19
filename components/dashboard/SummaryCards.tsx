"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, TrendingDown, TrendingUp, Wallet, ShieldCheck, type LucideIcon } from "lucide-react";

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
      navigator.vibrate(25);
    }
  };

  const maskValue = (amount: number) => {
    if (!mounted) return formatCurrency(amount);
    return hideBalance ? "Rp ••••••••" : formatCurrency(amount);
  };

  return (
    <div className="space-y-4">
      {/* 1. Apple Wallet / Titanium Virtual Card Utama */}
      <div className="relative overflow-hidden rounded-[2.25rem] p-6 sm:p-7 text-white shadow-2xl transition-all duration-300 hover:shadow-blue-500/20 border border-white/20 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 dark:from-slate-950 dark:via-blue-950/80 dark:to-slate-900">
        {/* Specular Light & Mesh Glow Background */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />

        {/* Baris Atas: Logo & Toggle Privasi */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-xl bg-white/10 p-1.5 backdrop-blur-md border border-white/20 shadow-inner flex items-center justify-center">
              <Image
                src="/logo-icon.png"
                alt="DompetQ"
                width={28}
                height={28}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-bold tracking-widest text-blue-200/80 uppercase">
                DompetQ Platinum
              </span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <ShieldCheck className="h-3 w-3" />
                <span>Penyimpanan Lokal Aktif</span>
              </div>
            </div>
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
                <span className="hidden sm:inline">Tampilkan</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sembunyikan</span>
              </>
            )}
          </button>
        </div>

        {/* EMV Chip Visual Simbolik */}
        <div className="relative z-10 mt-6 flex items-center gap-4">
          <div className="h-8 w-11 rounded-lg bg-gradient-to-tr from-amber-400/80 via-yellow-200/90 to-amber-500/80 p-1 shadow-sm border border-yellow-200/50 flex flex-col justify-between">
            <div className="h-1.5 w-full border-b border-amber-800/20" />
            <div className="h-1.5 w-full border-b border-amber-800/20" />
          </div>
          <span className="text-[11px] font-mono tracking-wider text-slate-300/80">
            •••• •••• •••• 2026
          </span>
        </div>

        {/* Saldo Utama */}
        <div className="relative z-10 mt-5">
          <span className="text-xs font-semibold tracking-wider uppercase text-blue-200/80">
            Saldo Saat Ini
          </span>
          <p className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums drop-shadow-sm">
            {maskValue(balance)}
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
