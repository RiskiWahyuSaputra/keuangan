"use client";

import { useState } from "react";
import { Clipboard, Send, Sparkles } from "lucide-react";

import { useToast } from "@/components/ui/ToastProvider";
import { useTransactions } from "@/hooks/useTransactions";
import { parseBankText } from "@/lib/bankParser";
import { formatNumberID } from "@/lib/formatCurrency";
import { haptic } from "@/lib/haptic";

export default function QuickMagicInput() {
  const [inputText, setInputText] = useState("");
  const { addTransaction } = useTransactions();
  const { toast } = useToast();

  const handleProcess = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    const parsed = parseBankText(text);

    if (!parsed.amount || parsed.amount <= 0) {
      haptic.warning();
      toast("Nominal tidak terdeteksi. Contoh: '150rb seabank' atau '35k kopi'", "error");
      return;
    }

    // Tambahkan transaksi
    addTransaction({
      type: parsed.type,
      amount: parsed.amount,
      category: parsed.category,
      description: parsed.description,
      date: parsed.date,
    });

    haptic.success();
    toast(
      `⚡ Berhasil! ${parsed.description} (${parsed.type === "expense" ? "-" : "+"}Rp ${formatNumberID(parsed.amount)})`,
      "success",
    );
    setInputText("");
  };

  const handlePasteFromClipboard = async () => {
    haptic.light();
    try {
      if (!navigator.clipboard) {
        toast("Clipboard tidak didukung di browser ini", "info");
        return;
      }
      const text = await navigator.clipboard.readText();
      if (!text || text.trim() === "") {
        toast("Tidak ada teks yang disalin", "info");
        return;
      }
      handleProcess(text);
    } catch {
      toast("Izin membaca clipboard ditolak. Ketik manual saja di kolom.", "info");
    }
  };

  return (
    <div className="rounded-3xl ios-glass-card p-3 sm:p-4 shadow-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleProcess(inputText);
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-blue-500 dark:text-blue-400">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Catat kilat: misal '150rb seabank' atau '25k kopi'..."
            className="w-full rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        {/* Tombol Tempel Clipboard */}
        <button
          type="button"
          onClick={handlePasteFromClipboard}
          title="Tempel teks bukti transfer dari DANA / SeaBank"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all active:scale-90"
        >
          <Clipboard className="h-4 w-4" />
        </button>

        {/* Tombol Kirim / Catat */}
        <button
          type="submit"
          disabled={!inputText.trim()}
          aria-label="Catat Transaksi"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/30 transition-all active:scale-90 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
