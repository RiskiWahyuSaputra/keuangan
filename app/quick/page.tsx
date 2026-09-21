"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";

import { useTransactions } from "@/hooks/useTransactions";
import { parseBankText } from "@/lib/bankParser";
import { formatNumberID } from "@/lib/formatCurrency";
import { haptic } from "@/lib/haptic";

function QuickContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addTransaction, isLoaded } = useTransactions();
  const [status, setStatus] = useState<"processing" | "success" | "empty">("processing");
  const [resultText, setResultText] = useState("");

  useEffect(() => {
    if (!isLoaded) return;

    const rawText = searchParams.get("text") || searchParams.get("q");

    if (!rawText || !rawText.trim()) {
      setStatus("empty");
      return;
    }

    const parsed = parseBankText(rawText);

    if (parsed.amount > 0) {
      addTransaction({
        type: parsed.type,
        amount: parsed.amount,
        category: parsed.category,
        description: parsed.description,
        date: parsed.date,
      });

      haptic.success();
      setStatus("success");
      setResultText(
        `${parsed.description} (${parsed.type === "expense" ? "-" : "+"}Rp ${formatNumberID(parsed.amount)})`,
      );

      // Kembali ke dashboard dalam 1.2 detik
      const timeout = setTimeout(() => {
        router.replace("/");
      }, 1200);

      return () => clearTimeout(timeout);
    } else {
      setStatus("empty");
    }
  }, [isLoaded, searchParams, addTransaction, router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl ios-glass-modal p-6 text-center shadow-2xl border border-white/50 dark:border-white/10 space-y-4 animate-scale-in">
        {status === "processing" && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Mencatat Transaksi...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sedang memproses nominal dan kategori
              </p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Tercatat Otomatis!
              </h3>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {resultText}
              </p>
            </div>
          </>
        )}

        {status === "empty" && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Tidak ada data yang diproses.
            </p>
            <button
              onClick={() => router.replace("/")}
              className="w-full rounded-2xl bg-blue-600 py-2.5 text-sm font-semibold text-white"
            >
              Kembali ke Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuickPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <QuickContent />
    </Suspense>
  );
}
