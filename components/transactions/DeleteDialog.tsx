"use client";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { formatDateID } from "@/lib/date";
import { formatCurrency } from "@/lib/formatCurrency";
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
      onConfirm={onConfirm}
    >
      {transaction ? (
        <dl className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Keterangan</dt>
            <dd className="text-right font-medium text-slate-900">
              {transaction.description || transaction.category}
            </dd>
          </div>
          <div className="mt-2 flex justify-between gap-4">
            <dt className="text-slate-500">Tanggal</dt>
            <dd className="text-right text-slate-900">{formatDateID(transaction.date)}</dd>
          </div>
          <div className="mt-2 flex justify-between gap-4">
            <dt className="text-slate-500">Nominal</dt>
            <dd className="text-right font-semibold tabular-nums text-slate-900">
              {formatCurrency(transaction.amount)}
            </dd>
          </div>
        </dl>
      ) : null}
    </ConfirmDialog>
  );
}
