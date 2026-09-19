import { ALL_CATEGORIES } from "./categories";
import { formatMonthShort, getMonthKey } from "./date";
import type { Transaction, TypeFilter } from "@/types/transaction";

export interface TransactionFilter {
  type: TypeFilter;
  /** "" berarti semua bulan, selain itu format YYYY-MM. */
  month: string;
  /** "" berarti semua kategori. */
  category: string;
  search: string;
}

export type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

export const SORT_OPTIONS: readonly { value: SortOption; label: string }[] = [
  { value: "date-desc", label: "Tanggal terbaru" },
  { value: "date-asc", label: "Tanggal terlama" },
  { value: "amount-desc", label: "Nominal terbesar" },
  { value: "amount-asc", label: "Nominal terkecil" },
];

export const EMPTY_FILTER: TransactionFilter = {
  type: "all",
  month: "",
  category: "",
  search: "",
};

export interface CategorySummary {
  category: string;
  total: number;
  count: number;
}

export interface MonthlySummaryRow {
  monthKey: string;
  income: number;
  expense: number;
  balance: number;
}

export interface MonthlyChartDatum {
  monthKey: string;
  label: string;
  income: number;
  expense: number;
}

export function calculateTotalIncome(transactions: Transaction[]): number {
  return transactions.reduce(
    (total, transaction) => (transaction.type === "income" ? total + transaction.amount : total),
    0,
  );
}

export function calculateTotalExpense(transactions: Transaction[]): number {
  return transactions.reduce(
    (total, transaction) => (transaction.type === "expense" ? total + transaction.amount : total),
    0,
  );
}

export function calculateBalance(transactions: Transaction[]): number {
  return calculateTotalIncome(transactions) - calculateTotalExpense(transactions);
}

export function filterByMonth(transactions: Transaction[], monthKey: string): Transaction[] {
  if (!monthKey) return transactions;
  return transactions.filter((transaction) => getMonthKey(transaction.date) === monthKey);
}

export function filterByType(transactions: Transaction[], type: TypeFilter): Transaction[] {
  if (type === "all") return transactions;
  return transactions.filter((transaction) => transaction.type === type);
}

export function calculateMonthlyIncome(transactions: Transaction[], monthKey: string): number {
  return calculateTotalIncome(filterByMonth(transactions, monthKey));
}

export function calculateMonthlyExpense(transactions: Transaction[], monthKey: string): number {
  return calculateTotalExpense(filterByMonth(transactions, monthKey));
}

export function calculateMonthlyBalance(transactions: Transaction[], monthKey: string): number {
  return calculateMonthlyIncome(transactions, monthKey) - calculateMonthlyExpense(transactions, monthKey);
}

export function calculateExpenseByCategory(transactions: Transaction[]): CategorySummary[] {
  return groupByCategory(transactions, "expense");
}

export function calculateIncomeByCategory(transactions: Transaction[]): CategorySummary[] {
  return groupByCategory(transactions, "income");
}

export function calculateExpenseByCategoryForMonth(
  transactions: Transaction[],
  monthKey: string,
): CategorySummary[] {
  return calculateExpenseByCategory(filterByMonth(transactions, monthKey));
}

export function getTopExpenseCategories(
  transactions: Transaction[],
  limit = 5,
): CategorySummary[] {
  return calculateExpenseByCategory(transactions).slice(0, limit);
}

function groupByCategory(
  transactions: Transaction[],
  type: "income" | "expense",
): CategorySummary[] {
  const grouped = new Map<string, CategorySummary>();
  for (const transaction of transactions) {
    if (transaction.type !== type) continue;
    const existing = grouped.get(transaction.category);
    if (existing) {
      existing.total += transaction.amount;
      existing.count += 1;
    } else {
      grouped.set(transaction.category, {
        category: transaction.category,
        total: transaction.amount,
        count: 1,
      });
    }
  }
  return [...grouped.values()].sort((a, b) => b.total - a.total);
}

/** Daftar bulan (YYYY-MM) yang memiliki transaksi, terbaru lebih dulu. */
export function getAvailableMonths(transactions: Transaction[]): string[] {
  const months = new Set<string>();
  for (const transaction of transactions) {
    const monthKey = getMonthKey(transaction.date);
    if (monthKey) months.add(monthKey);
  }
  return [...months].sort((a, b) => b.localeCompare(a));
}

/** Kategori bawaan digabung dengan kategori yang benar-benar dipakai user. */
export function getAvailableCategories(transactions: Transaction[]): string[] {
  const categories = new Set<string>(ALL_CATEGORIES);
  for (const transaction of transactions) categories.add(transaction.category);
  return [...categories].sort((a, b) => a.localeCompare(b, "id"));
}

export function sortTransactions(
  transactions: Transaction[],
  sort: SortOption = "date-desc",
): Transaction[] {
  const sorted = [...transactions];
  sorted.sort((a, b) => {
    switch (sort) {
      case "date-asc": {
        const byDate = a.date.localeCompare(b.date);
        return byDate !== 0 ? byDate : a.createdAt.localeCompare(b.createdAt);
      }
      case "amount-desc":
        return b.amount - a.amount || b.date.localeCompare(a.date);
      case "amount-asc":
        return a.amount - b.amount || b.date.localeCompare(a.date);
      case "date-desc":
      default: {
        const byDate = b.date.localeCompare(a.date);
        return byDate !== 0 ? byDate : b.createdAt.localeCompare(a.createdAt);
      }
    }
  });
  return sorted;
}

export function filterTransactions(
  transactions: Transaction[],
  filter: TransactionFilter,
): Transaction[] {
  return filterByMonth(filterByType(transactions, filter.type), filter.month).filter(
    (transaction) => {
      if (filter.category && transaction.category !== filter.category) return false;
      const keyword = filter.search.trim().toLowerCase();
      if (!keyword) return true;
      return `${transaction.description} ${transaction.category}`
        .toLowerCase()
        .includes(keyword);
    },
  );
}

export function hasActiveFilter(filter: TransactionFilter): boolean {
  return filter.type !== "all" || filter.month !== "" || filter.category !== "" || filter.search.trim() !== "";
}

export function getMonthlySummaryRows(transactions: Transaction[]): MonthlySummaryRow[] {
  return getAvailableMonths(transactions).map((monthKey) => {
    const scoped = filterByMonth(transactions, monthKey);
    const income = calculateTotalIncome(scoped);
    const expense = calculateTotalExpense(scoped);
    return { monthKey, income, expense, balance: income - expense };
  });
}

/**
 * Data grafik pemasukan vs pengeluaran.
 * Bila periode dipilih, hanya bulan tersebut yang ditampilkan.
 */
export function getMonthlyChartData(
  transactions: Transaction[],
  scopeMonth: string,
  limit = 6,
): MonthlyChartDatum[] {
  const months = scopeMonth
    ? [scopeMonth]
    : getAvailableMonths(transactions).slice(0, limit).reverse();

  return months.map((monthKey) => ({
    monthKey,
    label: formatMonthShort(monthKey),
    income: calculateMonthlyIncome(transactions, monthKey),
    expense: calculateMonthlyExpense(transactions, monthKey),
  }));
}
