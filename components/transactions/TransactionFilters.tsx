"use client";

import { RotateCcw, Search } from "lucide-react";

import Button from "@/components/ui/Button";
import { formatMonthLabel } from "@/lib/date";
import { hasActiveFilter, SORT_OPTIONS, type SortOption, type TransactionFilter } from "@/lib/calculations";
import { TYPE_FILTER_OPTIONS } from "@/types/transaction";

interface TransactionFiltersProps {
  filter: TransactionFilter;
  sort: SortOption;
  months: string[];
  categories: string[];
  resultCount: number;
  onFilterChange: (patch: Partial<TransactionFilter>) => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
}

const CONTROL_CLASSES =
  "w-full rounded-2xl ios-glass-input px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none transition-all";
const LABEL_CLASSES = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400";

export default function TransactionFilters({
  filter,
  sort,
  months,
  categories,
  resultCount,
  onFilterChange,
  onSortChange,
  onReset,
}: TransactionFiltersProps) {
  const active = hasActiveFilter(filter) || sort !== "date-desc";

  return (
    <section
      aria-label="Filter transaksi"
      className="mb-6 rounded-3xl ios-glass-card p-5 sm:p-6"
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-w-0 lg:col-span-2">
          <label htmlFor="transaction-search" className={LABEL_CLASSES}>
            Cari transaksi
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              id="transaction-search"
              type="search"
              value={filter.search}
              onChange={(event) => onFilterChange({ search: event.target.value })}
              placeholder="Cari transaksi..."
              className={`${CONTROL_CLASSES} pl-10`}
            />
          </div>
        </div>

        <div className="min-w-0 lg:col-span-2">
          <span className={LABEL_CLASSES}>Jenis</span>
          <div
            role="group"
            aria-label="Filter jenis transaksi"
            className="flex w-full flex-wrap gap-1 rounded-2xl ios-segmented p-1 sm:w-auto sm:flex-nowrap"
          >
            {TYPE_FILTER_OPTIONS.map((option) => {
              const selected = filter.type === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onFilterChange({ type: option.value })}
                  aria-pressed={selected}
                  className={`min-w-[6rem] flex-1 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:flex-none ${
                    selected
                      ? "bg-white dark:bg-slate-700/90 text-blue-600 dark:text-blue-400 shadow-sm shadow-slate-900/10"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0">
          <label htmlFor="transaction-month" className={LABEL_CLASSES}>
            Bulan
          </label>
          <select
            id="transaction-month"
            value={filter.month}
            onChange={(event) => onFilterChange({ month: event.target.value })}
            className={CONTROL_CLASSES}
          >
            <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Semua Bulan</option>
            {months.map((month) => (
              <option key={month} value={month} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                {formatMonthLabel(month)}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label htmlFor="transaction-category" className={LABEL_CLASSES}>
            Kategori
          </label>
          <select
            id="transaction-category"
            value={filter.category}
            onChange={(event) => onFilterChange({ category: event.target.value })}
            className={CONTROL_CLASSES}
          >
            <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category} value={category} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/50 dark:border-white/10 pt-4">
        <div className="flex items-center gap-3">
          <label htmlFor="transaction-sort" className="sr-only">
            Urutkan transaksi
          </label>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Urutkan:</span>
          <select
            id="transaction-sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className="rounded-xl ios-glass-input px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-100 focus-visible:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {resultCount} transaksi ditemukan
          </span>
          {active ? (
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              Reset Filter
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
