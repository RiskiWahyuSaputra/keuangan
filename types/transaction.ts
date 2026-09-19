export type TransactionType = "income" | "expense";

/** Filter tipe pada daftar transaksi: "all" berarti tanpa filter tipe. */
export type TypeFilter = "all" | TransactionType;

export interface Transaction {
  id: string;
  type: TransactionType;
  /** Nominal positif tanpa format Rupiah, contoh: 100000 */
  amount: number;
  category: string;
  description: string;
  /** Format YYYY-MM-DD */
  date: string;
  /** ISO string, dipakai sebagai tie-breaker saat sorting */
  createdAt: string;
}

/** Payload dari form (id & createdAt dibuat oleh aplikasi). */
export type TransactionInput = Omit<Transaction, "id" | "createdAt">;

export const TRANSACTION_TYPES: readonly TransactionType[] = ["income", "expense"];

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  income: "Pemasukan",
  expense: "Pengeluaran",
};

export const TYPE_FILTER_OPTIONS: readonly { value: TypeFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "income", label: "Pemasukan" },
  { value: "expense", label: "Pengeluaran" },
];
