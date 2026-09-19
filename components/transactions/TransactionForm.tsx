"use client";

import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { getCategories } from "@/lib/categories";
import { isValidDateString, todayISO } from "@/lib/date";
import { formatNumberID } from "@/lib/formatCurrency";
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
  type Transaction,
  type TransactionInput,
  type TransactionType,
} from "@/types/transaction";

interface TransactionFormProps {
  open: boolean;
  /** null berarti mode tambah data baru. */
  transaction: Transaction | null;
  onClose: () => void;
  onSubmit: (input: TransactionInput) => void;
}

interface FormErrors {
  amount?: string;
  category?: string;
  date?: string;
}

const MAX_AMOUNT_DIGITS = 15;
const FIELD_CLASSES =
  "w-full rounded-2xl ios-glass-input px-3.5 py-2.5 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus-visible:outline-none transition-all";
const LABEL_CLASSES = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400";
const ERROR_CLASSES = "mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400";

/**
 * Modal form transaksi.
 */
export default function TransactionForm({
  open,
  transaction,
  onClose,
  onSubmit,
}: TransactionFormProps) {
  const isEditing = transaction !== null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Transaksi" : "Tambah Transaksi"}
      description={
        isEditing
          ? "Ubah detail transaksi lalu simpan kembali."
          : "Catat pemasukan atau pengeluaran baru."
      }
    >
      <TransactionFields transaction={transaction} onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  );
}

interface TransactionFieldsProps {
  transaction: Transaction | null;
  onClose: () => void;
  onSubmit: (input: TransactionInput) => void;
}

function TransactionFields({ transaction, onClose, onSubmit }: TransactionFieldsProps) {
  const [type, setType] = useState<TransactionType>(transaction?.type ?? "expense");
  const [amountDigits, setAmountDigits] = useState(
    transaction ? String(transaction.amount) : "",
  );
  const [category, setCategory] = useState(transaction?.category ?? "");
  const [date, setDate] = useState(transaction?.date ?? todayISO());
  const [description, setDescription] = useState(transaction?.description ?? "");
  const [errors, setErrors] = useState<FormErrors>({});

  const categories = useMemo(() => {
    const base = getCategories(type);
    return category && !base.includes(category) ? [...base, category] : [...base];
  }, [type, category]);

  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType);
    setCategory((current) => (getCategories(nextType).includes(current) ? current : ""));
    setErrors((current) => ({ ...current, category: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    const parsedAmount = Number(amountDigits);
    if (!amountDigits || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      nextErrors.amount = "Nominal harus lebih besar dari 0";
    }

    if (!category.trim()) {
      nextErrors.category = "Kategori wajib dipilih";
    }

    if (!date || !isValidDateString(date)) {
      nextErrors.date = "Tanggal tidak valid";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      type,
      amount: parsedAmount,
      category: category.trim(),
      date,
      description: description.trim(),
    });
  };

  const handleAmountChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, MAX_AMOUNT_DIGITS);
    setAmountDigits(digits);
    setErrors((current) => ({ ...current, amount: undefined }));
  };

  const formattedAmountPreview = amountDigits
    ? `Rp ${formatNumberID(Number(amountDigits))}`
    : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* iOS Segmented Type Switcher */}
      <div>
        <span className={LABEL_CLASSES}>Jenis Transaksi</span>
        <div
          role="radiogroup"
          aria-label="Jenis transaksi"
          className="grid grid-cols-2 gap-1 rounded-2xl ios-segmented p-1"
        >
          {TRANSACTION_TYPES.map((t) => {
            const selected = type === t;
            const Icon = t === "income" ? ArrowUpCircle : ArrowDownCircle;
            return (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => handleTypeChange(t)}
                className={`flex items-center justify-center gap-2 rounded-xl py-2 text-xs sm:text-sm font-semibold transition-all ${
                  selected
                    ? t === "income"
                      ? "bg-white dark:bg-slate-700/90 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-slate-900/10"
                      : "bg-white dark:bg-slate-700/90 text-rose-600 dark:text-rose-400 shadow-sm shadow-slate-900/10"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                <span>{TRANSACTION_TYPE_LABELS[t]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="form-amount" className={LABEL_CLASSES}>
          Nominal (Rp)
        </label>
        <div className="relative">
          <input
            id="form-amount"
            type="text"
            inputMode="numeric"
            value={amountDigits}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0"
            className={`${FIELD_CLASSES} text-base font-semibold tabular-nums`}
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={errors.amount ? "amount-error" : undefined}
          />
        </div>
        {formattedAmountPreview ? (
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{formattedAmountPreview}</p>
        ) : null}
        {errors.amount ? (
          <p id="amount-error" className={ERROR_CLASSES}>
            {errors.amount}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="form-category" className={LABEL_CLASSES}>
          Kategori
        </label>
        <select
          id="form-category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setErrors((current) => ({ ...current, category: undefined }));
          }}
          className={FIELD_CLASSES}
          aria-invalid={Boolean(errors.category)}
          aria-describedby={errors.category ? "category-error" : undefined}
        >
          <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">Pilih kategori...</option>
          {categories.map((cat) => (
            <option key={cat} value={cat} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
              {cat}
            </option>
          ))}
        </select>
        {errors.category ? (
          <p id="category-error" className={ERROR_CLASSES}>
            {errors.category}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="form-date" className={LABEL_CLASSES}>
          Tanggal
        </label>
        <input
          id="form-date"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setErrors((current) => ({ ...current, date: undefined }));
          }}
          className={FIELD_CLASSES}
          aria-invalid={Boolean(errors.date)}
          aria-describedby={errors.date ? "date-error" : undefined}
        />
        {errors.date ? (
          <p id="date-error" className={ERROR_CLASSES}>
            {errors.date}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="form-description" className={LABEL_CLASSES}>
          Keterangan (Opsional)
        </label>
        <textarea
          id="form-description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Catatan kecil..."
          className={`${FIELD_CLASSES} resize-none`}
        />
      </div>

      <div className="flex flex-col-reverse gap-2.5 pt-3 sm:flex-row sm:justify-end border-t border-white/40 dark:border-white/10">
        <Button variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button variant="primary" type="submit">
          {transaction ? "Perbarui" : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
