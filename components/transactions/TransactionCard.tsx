"use client";

import { Pencil, Trash2 } from "lucide-react";

import TypeBadge from "@/components/ui/TypeBadge";
import { formatDateID } from "@/lib/date";
import { formatNumberID } from "@/lib/formatCurrency";
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
        return (
          <li
            key={transaction.id}
            className="rounded-3xl ios-glass-card p-4 sm:p-5 transition-all"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs text-slate-500">{formatDateID(transaction.date)}</p>
              <p
                className={`text-sm font-semibold tabular-nums ${
                  isIncome ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {isIncome ? "+" : "-"} Rp {formatNumberID(transaction.amount)}
              </p>
            </div>

            <p className="mt-2 break-words text-sm font-medium text-slate-900">
              {transaction.description || transaction.category}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-xl bg-white/60 border border-white/80 px-2 py-1 text-xs font-medium text-slate-700">
                {transaction.category}
              </span>
              <TypeBadge type={transaction.type} />
            </div>

            <div className="mt-3.5 flex gap-2 border-t border-white/50 pt-3">
              <button
                type="button"
                onClick={() => onEdit(transaction)}
                aria-label={`Edit transaksi ${label}`}
                className="ios-button-secondary flex flex-1 items-center justify-center gap-2 rounded-2xl py-2 text-xs sm:text-sm font-medium text-slate-700"
              >
                <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(transaction)}
                aria-label={`Hapus transaksi ${label}`}
                className="ios-button-secondary flex flex-1 items-center justify-center gap-2 rounded-2xl py-2 text-xs sm:text-sm font-medium text-rose-600 hover:text-rose-700"
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
