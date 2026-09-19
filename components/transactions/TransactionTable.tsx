"use client";

import { Pencil, Trash2 } from "lucide-react";

import TypeBadge from "@/components/ui/TypeBadge";
import { formatDateID } from "@/lib/date";
import { formatNumberID } from "@/lib/formatCurrency";
import { getCategoryMeta } from "@/lib/categoryIcons";
import type { Transaction } from "@/types/transaction";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function TransactionTable({
  transactions,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-3xl ios-glass-card md:block">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">Riwayat transaksi keuangan</caption>
        <thead>
          <tr className="border-b border-white/60 dark:border-white/10 bg-white/40 dark:bg-white/5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 backdrop-blur-sm">
            <th scope="col" className="px-5 py-3.5">
              Tanggal
            </th>
            <th scope="col" className="px-5 py-3.5">
              Keterangan
            </th>
            <th scope="col" className="px-5 py-3.5">
              Kategori
            </th>
            <th scope="col" className="px-5 py-3.5">
              Jenis
            </th>
            <th scope="col" className="px-5 py-3.5 text-right">
              Nominal
            </th>
            <th scope="col" className="px-5 py-3.5 text-right">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/40 dark:divide-white/10">
          {transactions.map((transaction) => {
            const isIncome = transaction.type === "income";
            const label = `${transaction.description || transaction.category} sebesar Rp ${formatNumberID(transaction.amount)}`;
            const meta = getCategoryMeta(transaction.category);
            const Icon = meta.icon;

            return (
              <tr key={transaction.id} className="transition-colors hover:bg-white/50 dark:hover:bg-white/5">
                <td className="whitespace-nowrap px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                  {formatDateID(transaction.date)}
                </td>
                <td className="max-w-[16rem] px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl border ${meta.bg} shadow-2xs`}>
                      <Icon className={`h-4 w-4 ${meta.color}`} />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate font-medium text-slate-900 dark:text-slate-100">
                        {transaction.description || transaction.category}
                      </span>
                      {transaction.description ? (
                        <span className="mt-0.5 block truncate text-xs text-slate-400 dark:text-slate-400">
                          {transaction.category}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center rounded-xl bg-white/60 dark:bg-slate-800/80 border border-white/80 dark:border-white/10 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs">
                    {transaction.category}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <TypeBadge type={transaction.type} />
                </td>
                <td
                  className={`whitespace-nowrap px-5 py-3.5 text-right font-semibold tabular-nums ${
                    isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {isIncome ? "+" : "-"} Rp {formatNumberID(transaction.amount)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(transaction)}
                      aria-label={`Edit transaksi ${label}`}
                      title="Edit"
                      className="grid h-8 w-8 place-items-center rounded-xl text-slate-500 dark:text-slate-400 transition-all hover:bg-white/80 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      <Pencil aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(transaction)}
                      aria-label={`Hapus transaksi ${label}`}
                      title="Hapus"
                      className="grid h-8 w-8 place-items-center rounded-xl text-slate-500 dark:text-slate-400 transition-all hover:bg-white/80 dark:hover:bg-white/10 hover:text-rose-600 dark:hover:text-rose-400 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      <Trash2 aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
