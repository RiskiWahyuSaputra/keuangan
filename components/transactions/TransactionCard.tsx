"use client";

import { Pencil, Trash2 } from "lucide-react";

import TypeBadge from "@/components/ui/TypeBadge";
import { formatDateID } from "@/lib/date";
import { formatNumberID } from "@/lib/formatCurrency";
import { getCategoryMeta } from "@/lib/categoryIcons";
import type { Transaction } from "@/types/transaction";

interface TransactionCardListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function TransactionCardList({
  transactions,
  onEdit,
  onDelete,
}: TransactionCardListProps) {
  return (
    <ul className="space-y-3 md:hidden">
      {transactions.map((transaction) => {
        const isIncome = transaction.type === "income";
        const label = `${transaction.description || transaction.category} sebesar Rp ${formatNumberID(transaction.amount)}`;
        const meta = getCategoryMeta(transaction.category);
        const Icon = meta.icon;

        return (
          <li
            key={transaction.id}
            className="rounded-3xl ios-glass-card p-4 sm:p-5 transition-all"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl border ${meta.bg} shadow-xs`}>
                  <Icon className={`h-5 w-5 ${meta.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {transaction.description || transaction.category}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatDateID(transaction.date)}</p>
                </div>
              </div>

              <p
                className={`text-sm sm:text-base font-bold tabular-nums shrink-0 ${
                  isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {isIncome ? "+" : "-"} Rp {formatNumberID(transaction.amount)}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-xl bg-white/60 dark:bg-slate-800/80 border border-white/80 dark:border-white/10 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                {transaction.category}
              </span>
              <TypeBadge type={transaction.type} />
            </div>

            <div className="mt-3.5 flex gap-2 border-t border-white/50 dark:border-white/10 pt-3">
              <button
                type="button"
                onClick={() => onEdit(transaction)}
                aria-label={`Edit transaksi ${label}`}
                className="ios-button-secondary flex flex-1 items-center justify-center gap-2 rounded-2xl py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(transaction)}
                aria-label={`Hapus transaksi ${label}`}
                className="ios-button-secondary flex flex-1 items-center justify-center gap-2 rounded-2xl py-2 text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300"
              >
                <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                Hapus
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
