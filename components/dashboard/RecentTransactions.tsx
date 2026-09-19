"use client";

import Link from "next/link";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";

import Card, { CardHeader } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import TypeBadge from "@/components/ui/TypeBadge";
import { buttonStyles } from "@/components/ui/Button";
import { formatDateID } from "@/lib/date";
import { formatNumberID } from "@/lib/formatCurrency";
import type { Transaction } from "@/types/transaction";

interface RecentTransactionsProps {
  transactions: Transaction[];
  totalCount: number;
  onAdd: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function RecentTransactions({
  transactions,
  totalCount,
  onAdd,
  onEdit,
  onDelete,
}: RecentTransactionsProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Transaksi Terbaru"
        description={
          totalCount > transactions.length
            ? `Menampilkan ${transactions.length} dari ${totalCount} transaksi`
            : "Transaksi paling akhir yang kamu catat"
        }
        action={
          totalCount > 0 ? (
            <Link href="/transactions" className={buttonStyles("secondary", "sm")}>
              Lihat semua
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          ) : null
        }
      />

      {transactions.length === 0 ? (
        <EmptyState
          title="Belum ada transaksi"
          description="Mulai catat pemasukan atau pengeluaran untuk melihat kondisi keuanganmu."
          action={
            <button type="button" onClick={onAdd} className={buttonStyles("primary")}>
              Tambah Transaksi
            </button>
          }
        />
      ) : (
        <ul className="divide-y divide-white/40">
          {transactions.map((transaction) => {
            const isIncome = transaction.type === "income";
            const label = `${transaction.description || transaction.category} sebesar Rp ${formatNumberID(transaction.amount)}`;
            return (
              <li
                key={transaction.id}
                className="group flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3.5 transition-colors hover:bg-white/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {transaction.description || transaction.category}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{formatDateID(transaction.date)}</span>
                    <span aria-hidden="true" className="text-slate-300">
                      ·
                    </span>
                    <span>{transaction.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <TypeBadge type={transaction.type} />
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      isIncome ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {isIncome ? "+" : "-"} Rp {formatNumberID(transaction.amount)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(transaction)}
                      aria-label={`Edit transaksi ${label}`}
                      title="Edit"
                      className="grid h-8 w-8 place-items-center rounded-xl text-slate-500 transition-all hover:bg-white/80 hover:text-blue-600 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(transaction)}
                      aria-label={`Hapus transaksi ${label}`}
                      title="Hapus"
                      className="grid h-8 w-8 place-items-center rounded-xl text-slate-500 transition-all hover:bg-white/80 hover:text-rose-600 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
