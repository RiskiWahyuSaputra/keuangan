import type { TransactionType } from "@/types/transaction";

export const INCOME_CATEGORIES = [
  "Gaji",
  "Uang Saku",
  "Bonus",
  "Penjualan",
  "Freelance",
  "Hadiah",
  "Lainnya",
] as const;

export const EXPENSE_CATEGORIES = [
  "Makanan",
  "Transportasi",
  "Belanja",
  "Tagihan",
  "Pulsa & Internet",
  "Pendidikan",
  "Hiburan",
  "Kesehatan",
  "Kos",
  "Lainnya",
] as const;

/** Gabungan kategori pemasukan & pengeluaran, unik dan terurut. */
export const ALL_CATEGORIES: readonly string[] = [...new Set<string>([
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
])].sort((a, b) => a.localeCompare(b, "id"));

export function getCategories(type: TransactionType): readonly string[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function isKnownCategory(category: string): boolean {
  return ALL_CATEGORIES.includes(category);
}

/** Palet warna untuk grafik kategori (dipakai bergiliran). */
export const CHART_COLORS = [
  "#2563eb",
  "#f97316",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#0ea5e9",
  "#f59e0b",
  "#ec4899",
  "#14b8a6",
  "#64748b",
] as const;

export function getChartColor(index: number): string {
  const color = CHART_COLORS[index % CHART_COLORS.length];
  return color ?? "#64748b";
}
