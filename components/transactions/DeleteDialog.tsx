"use client";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatDateID } from "@/lib/date";
import { formatCurrency } from "@/lib/formatCurrency";
import { haptic } from "@/lib/haptic";
import type { Transaction } from "@/types/transaction";

interface DeleteDialogProps {
  transaction: Transaction | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteDialog({
  transaction,
  onCancel,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <ConfirmDialog
      open={transaction !== null}
      title="Hapus transaksi?"
      description="Transaksi ini akan dihapus secara permanen dari browser."
      confirmLabel="Hapus"
      cancelLabel="Batal"
      confirmVariant="danger"
      onCancel={onCancel}
      onConfirm={() => {
        haptic.warning();
        onConfirm();
      }}
    >
      {transaction ? (
        <dl className="rounded-2xl border border-white/60 dark:border-white/10 bg-white/50 dark:bg-slate-800/60 p-4 text-sm backdrop-blur-sm shadow-xs">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500 dark:text-slate-400">Keterangan</dt>
            <dd className="text-right font-medium text-slate-900 dark:text-slate-100">
              {transaction.description || transaction.category}
            </dd>
          </div>
          <div className="mt-2.5 flex justify-between gap-4 border-t border-white/40 dark:border-white/5 pt-2.5">
            <dt className="text-slate-500 dark:text-slate-400">Tanggal</dt>
            <dd className="text-right text-slate-900 dark:text-slate-100">{formatDateID(transaction.date)}</dd>
          </div>
          <div className="mt-2.5 flex justify-between gap-4 border-t border-white/40 dark:border-white/5 pt-2.5">
            <dt className="text-slate-500 dark:text-slate-400">Nominal</dt>
            <dd className="text-right font-bold tabular-nums text-rose-600 dark:text-rose-400">
              {formatCurrency(transaction.amount)}
            </dd>
          </div>
        </dl>
      ) : null}
    </ConfirmDialog>
  );
}
