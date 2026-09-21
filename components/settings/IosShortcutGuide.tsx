"use client";

import { useState } from "react";
import { Copy, Check, Sparkles, Smartphone, ArrowRight, ShieldCheck } from "lucide-react";
import Card, { CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { haptic } from "@/lib/haptic";

export default function IosShortcutGuide() {
  const [copied, setCopied] = useState(false);
  const [testText, setTestText] = useState(
    "m-BCA: Pembayaran QRIS Rp 35.000 ke KOPI KENANGAN BERHASIL. 19/09 14:20",
  );
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const curlExample = `curl -X POST "${typeof window !== "undefined" ? window.location.origin : "https://domain-kamu.com"}/api/webhook/transaction" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Isi pesan SMS Bank atau QRIS di sini"}'`;

  const copyUrl = () => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/api/webhook/transaction`;
    navigator.clipboard.writeText(url);
    haptic.success();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulate = async () => {
    if (!testText.trim()) return;
    setTestLoading(true);
    setTestResult(null);
    haptic.medium();

    try {
      const res = await fetch("/api/webhook/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: testText }),
      });
      const data = await res.json();
      if (data.ok) {
        haptic.success();
        setTestResult(
          `✅ Berhasil Terdeteksi! ${data.transaction.description} (${data.transaction.category}) - Rp ${data.transaction.amount.toLocaleString("id-ID")}`,
        );
      } else {
        setTestResult(`❌ Gagal: ${data.error}`);
      }
    } catch (e) {
      setTestResult("❌ Gagal terhubung ke server");
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-blue-500/20 shadow-xl">
      <CardHeader
        title="Otomasi iOS & Apple Shortcuts"
        description="Hubungkan notifikasi SMS Bank atau Action Button iPhone untuk pencatatan otomatis."
      />
      <div className="p-6 space-y-5 pt-4">
        {/* Banner Penjelasan */}
        <div className="rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 p-4 border border-blue-200/50 dark:border-blue-800/30 flex items-start gap-3">
          <div className="rounded-xl bg-blue-600 text-white p-2.5 shadow-sm shrink-0">
            <Smartphone className="h-5 w-5" />
          </div>
          <div className="text-sm space-y-1">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              Bagaimana Cara Kerjanya di iPhone?
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
              iPhone memiliki fitur bawaan <strong>Shortcuts (Pintasan) ➔ Automasi Pribadi</strong>. Setiap kali Anda menerima SMS transaksi dari bank (BCA, Mandiri, BRI, dll.) atau menyelesaikan QRIS, iPhone otomatis mengirimkan teksnya ke endpoint DompetQ di bawah ini tanpa perlu membuka aplikasi.
            </p>
          </div>
        </div>

        {/* Webhook URL Field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Webhook URL DompetQ Kamu:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={
                typeof window !== "undefined"
                  ? `${window.location.origin}/api/webhook/transaction`
                  : "/api/webhook/transaction"
              }
              className="flex-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/50 px-3.5 py-2.5 text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-200 select-all"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={copyUrl}
              className="shrink-0 flex items-center gap-1.5 py-2.5 px-3 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Salin URL</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 3 Langkah Pengaturan di iPhone */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Cara Setup di iPhone (Pilih Salah Satu):
          </h4>

          {/* Opsi A: Ketuk Punggung iPhone (Back Tap) */}
          <div className="rounded-2xl border border-indigo-200/80 dark:border-indigo-800/40 bg-indigo-50/40 dark:bg-indigo-950/20 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs sm:text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Metode 1: Ketuk Punggung iPhone 2x (Paling Cepat untuk DANA / SeaBank)</span>
            </div>
            <ol className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-decimal pl-4 leading-relaxed">
              <li>
                Buka aplikasi <strong>Shortcuts (Pintasan)</strong> ➔ tab <strong>Pintasan</strong> ➔ buat pintasan baru dengan nama <strong>"Catat DompetQ"</strong>.
              </li>
              <li>
                Tambahkan tindakan 1: <strong>Minta Input (Ask for Input)</strong> ➔ tipe teks dengan pertanyaan <em>"Nominal & Keperluan?"</em>
              </li>
              <li>
                Tambahkan tindakan 2: <strong>Dapatkan Konten URL (Get Contents of URL)</strong> ➔ Masukkan Webhook URL di atas, Metode: <strong>POST</strong>, Request Body: JSON <code>{`{ "text": Disediakan Input }`}</code>.
              </li>
              <li>
                Masuk ke <strong>Pengaturan iPhone ➔ Aksesibilitas ➔ Sentuh ➔ Ketuk Bagian Belakang (Back Tap)</strong> ➔ pilih Ketuk 2x ➔ pilih pintasan <strong>"Catat DompetQ"</strong>.
              </li>
              <li className="text-emerald-600 dark:text-emerald-400 font-medium">
                Selesai! Sekarang setelah bayar di DANA/SeaBank, tinggal ketuk punggung iPhone 2x, lalu ketik singkat: misal <code>150rb seabank</code> atau <code>35k kopi</code>. Langsung otomatis tercatat!
              </li>
            </ol>
          </div>

          {/* Opsi B: Otomasi SMS */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/60 p-4 space-y-2">
            <h5 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
              Metode 2: Otomasi SMS Notifikasi Bank (BCA / Mandiri / BRI)
            </h5>
            <ol className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 list-decimal pl-4 leading-relaxed">
              <li>Di Shortcuts ➔ tab <strong>Automasi</strong> ➔ buat <strong>Automasi Pribadi</strong> ➔ pilih <strong>Pesan (Message)</strong>.</li>
              <li>Isi pengirim Bank ➔ centang <strong>Jalankan Segera (Run Immediately)</strong>.</li>
              <li>Tambahkan <strong>Dapatkan Konten URL</strong> ke Webhook URL DompetQ dengan metode POST.</li>
            </ol>
          </div>
        </div>

        {/* Simulator / Uji Coba Cepat */}
        <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Simulasi Uji Coba Otomasi (Test Parser):
            </span>
          </div>

          <div className="space-y-2">
            <textarea
              rows={2}
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Ketik atau tempel contoh teks SMS Bank / QRIS di sini..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="primary"
                onClick={handleSimulate}
                disabled={testLoading}
                className="text-xs py-2 px-3.5 flex items-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" />
                <span>{testLoading ? "Mendeteksi..." : "Kirim Simulasi Transaksi"}</span>
              </Button>
            </div>

            {testResult && (
              <div className="mt-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 p-3 text-xs font-medium text-slate-800 dark:text-slate-200 animate-fade-in border border-slate-200/50 dark:border-slate-700/50">
                {testResult}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
