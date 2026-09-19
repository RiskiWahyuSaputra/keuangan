"use client";

import { Database, Download, HardDrive, ShieldCheck, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Card, { CardHeader } from "@/components/ui/Card";
import LoadingState from "@/components/ui/LoadingState";
import Modal from "@/components/ui/Modal";
import StorageAlert from "@/components/ui/StorageAlert";
import { useToast } from "@/components/ui/ToastProvider";
import { useTransactions, type ImportMode } from "@/hooks/useTransactions";
import { todayISO } from "@/lib/date";
import {
  downloadJsonFile,
  parseTransactionsJson,
  serializeTransactions,
} from "@/lib/storage";
import type { Transaction } from "@/types/transaction";

type ResetStep = 0 | 1 | 2;

export default function SettingsView() {
  const {
    transactions,
    isLoaded,
    isPersistent,
    storageError,
    clearStorageError,
    clearAllTransactions,
    importTransactions,
  } = useTransactions();
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<Transaction[] | null>(null);
  const [resetStep, setResetStep] = useState<ResetStep>(0);

  const handleExport = () => {
    if (transactions.length === 0) {
      toast("Belum ada transaksi yang bisa di-export.", "error");
      return;
    }
    downloadJsonFile(
      `keuangan-backup-${todayISO()}.json`,
      serializeTransactions(transactions),
    );
    toast("Data berhasil di-export.");
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    let raw: string;
    try {
      raw = await file.text();
    } catch {
      toast("File tidak dapat dibaca.", "error");
      return;
    }

    const result = parseTransactionsJson(raw);
    if (!result.ok) {
      toast(result.error ?? "File tidak valid atau format data rusak.", "error");
      return;
    }
    if (result.transactions.length === 0) {
      toast("File tidak berisi transaksi.", "error");
      return;
    }

    setPendingImport(result.transactions);
  };

  const handleImport = (mode: ImportMode) => {
    if (!pendingImport) return;
    importTransactions(pendingImport, mode);
    setPendingImport(null);
  };

  const handleResetAll = () => {
    clearAllTransactions();
    setResetStep(0);
  };

  return (
    <>
      <PageHeader
        title="Pengaturan"
        description="Kelola cadangan data dan informasi penyimpanan aplikasi."
      />

      {storageError ? (
        <StorageAlert message={storageError} onDismiss={clearStorageError} />
      ) : null}

      {!isLoaded ? (
        <LoadingState cards={2} />
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Cadangan & Pemulihan"
              description="Cadangkan, pulihkan, atau bersihkan data transaksi di browser ini."
            />
            <div className="divide-y divide-white/40 dark:divide-white/10">
              <SettingRow
                icon={Download}
                title="Export Data"
                description="Unduh seluruh transaksi sebagai file JSON untuk backup."
                meta={`${transactions.length} transaksi siap di-export`}
              >
                <Button variant="secondary" onClick={handleExport}>
                  <Download aria-hidden="true" className="h-4 w-4" />
                  Export Data
                </Button>
              </SettingRow>

              <SettingRow
                icon={Upload}
                title="Import Data"
                description="Pulihkan transaksi dari file JSON hasil export sebelumnya."
                meta="Format yang didukung: .json"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={handleFileSelected}
                  className="sr-only"
                  id="import-file-input"
                />
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  <Upload aria-hidden="true" className="h-4 w-4" />
                  Import Data
                </Button>
              </SettingRow>

              <SettingRow
                icon={Trash2}
                title="Hapus Semua Data"
                description="Menghapus seluruh transaksi yang tersimpan di browser ini."
                meta={isPersistent ? "Tidak dapat dikembalikan" : "Penyimpanan tidak tersedia"}
                danger
              >
                <Button
                  variant="danger"
                  onClick={() => setResetStep(1)}
                  disabled={transactions.length === 0}
                >
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                  Hapus Semua Data
                </Button>
              </SettingRow>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Informasi Penyimpanan"
              description="Status penyimpanan lokal browser"
              action={
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border backdrop-blur-sm shadow-xs ${
                    isPersistent
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                  }`}
                >
                  <Database aria-hidden="true" className="h-3.5 w-3.5" />
                  {isPersistent ? "LocalStorage aktif" : "LocalStorage tidak tersedia"}
                </span>
              }
            />
            <div className="space-y-4 px-6 py-5">
              <p className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <HardDrive aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                <span>
                  Data transaksi disimpan di LocalStorage browser. Data tidak dikirim ke server atau
                  database.
                </span>
              </p>
              <p className="flex items-start gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>
                  Data disimpan secara lokal di browser ini. Menghapus data browser atau menggunakan
                  perangkat/browser lain tidak akan membawa data ini.
                </span>
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Import */}
      <Modal
        open={pendingImport !== null}
        onClose={() => setPendingImport(null)}
        title="Import Transaksi"
        description="Pilih bagaimana data baru akan digabungkan dengan transaksi yang ada saat ini."
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Ditemukan <span className="font-semibold text-slate-900 dark:text-slate-100">{pendingImport?.length ?? 0}</span> transaksi pada file cadangan.
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end border-t border-white/50 dark:border-white/10 pt-4">
            <Button variant="secondary" onClick={() => handleImport("merge")}>
              Gabungkan (Merge)
            </Button>
            <Button variant="danger" onClick={() => handleImport("replace")}>
              Ganti Seluruh Data (Replace)
            </Button>
          </div>
        </div>
      </Modal>

      {/* Dialog Hapus Semua Data */}
      <Modal
        open={resetStep > 0}
        onClose={() => setResetStep(0)}
        title="Hapus Semua Data?"
        description="Seluruh catatan transaksi akan terhapus secara permanen dari browser ini."
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Tindakan ini tidak dapat dibatalkan. Pastikan kamu sudah melakukan export data jika ingin menyimpannya.
          </p>
          <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end border-t border-white/50 dark:border-white/10 pt-4">
            <Button variant="secondary" onClick={() => setResetStep(0)}>
              Batal
            </Button>
            <Button variant="danger" onClick={handleResetAll}>
              Ya, Hapus Semua
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

interface SettingRowProps {
  icon: React.ElementType;
  title: string;
  description: string;
  meta?: string;
  danger?: boolean;
  children: React.ReactNode;
}

function SettingRow({
  icon: Icon,
  title,
  description,
  meta,
  danger = false,
  children,
}: SettingRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-white/30 dark:hover:bg-white/5">
      <div className="flex items-start gap-3.5">
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl border backdrop-blur-md shadow-xs ${
            danger
              ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
              : "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
          }`}
        >
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
          {meta ? <p className="mt-0.5 text-2xs text-slate-400 dark:text-slate-500 font-medium">{meta}</p> : null}
        </div>
      </div>
      <div className="sm:shrink-0">{children}</div>
    </div>
  );
}
