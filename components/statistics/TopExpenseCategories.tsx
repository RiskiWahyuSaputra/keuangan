import { formatCurrency, formatPercentage } from "@/lib/formatCurrency";
import type { CategorySummary } from "@/lib/calculations";

interface TopExpenseCategoriesProps {
  categories: CategorySummary[];
  /** Total pengeluaran seluruh kategori, dipakai untuk menghitung persentase. */
  totalExpense: number;
  limit?: number;
}

export default function TopExpenseCategories({
  categories,
  totalExpense,
  limit = 5,
}: TopExpenseCategoriesProps) {
  const visible = categories.slice(0, limit);

  if (visible.length === 0) {
    return (
      <p className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Belum ada pengeluaran pada periode ini.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-white/40 dark:divide-white/10">
      {visible.map((item, index) => {
        const percentage = totalExpense > 0 ? (item.total / totalExpense) * 100 : 0;
        return (
          <li key={item.category} className="px-6 py-3.5">
            <div className="flex items-baseline justify-between gap-4">
              <p className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-slate-900 dark:text-slate-100">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-xl bg-white/70 dark:bg-slate-800/80 border border-white/80 dark:border-white/10 shadow-xs text-xs font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
                  {index + 1}
                </span>
                <span className="truncate">{item.category}</span>
              </p>
              <p className="shrink-0 text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {formatCurrency(item.total)}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div
                className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200/50 dark:bg-slate-700/50 p-0.5"
                role="presentation"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-500 shadow-xs"
                  style={{ width: `${Math.max(percentage, 3)}%` }}
                />
              </div>
              <span className="w-12 shrink-0 text-right text-xs font-medium tabular-nums text-slate-500 dark:text-slate-400">
                {formatPercentage(percentage)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
