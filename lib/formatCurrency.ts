import type { TransactionType } from "@/types/transaction";

const numberFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 1,
});

function toSafeNumber(value: number): number {
  return Number.isFinite(value) ? Math.round(value) : 0;
}

/** 10000 -> "10.000" (tanpa simbol mata uang). */
export function formatNumberID(value: number): string {
  return numberFormatter.format(toSafeNumber(value));
}

/** 10000 -> "Rp 10.000" (-5000 -> "-Rp 5.000"). */
export function formatCurrency(amount: number): string {
  const safe = toSafeNumber(amount);
  const sign = safe < 0 ? "-" : "";
  return `${sign}Rp ${numberFormatter.format(Math.abs(safe))}`;
}

/** income -> "+ Rp 5.000.000", expense -> "- Rp 25.000". */
export function formatSignedCurrency(amount: number, type: TransactionType): string {
  const prefix = type === "income" ? "+" : "-";
  return `${prefix} ${formatCurrency(Math.abs(amount))}`;
}

/** Versi ringkas untuk label sumbu grafik: 5250000 -> "5,3 jt". */
export function formatCurrencyShort(amount: number): string {
  const safe = toSafeNumber(amount);
  const sign = safe < 0 ? "-" : "";
  const abs = Math.abs(safe);
  if (abs >= 1_000_000_000) return `${sign}${trimDecimal(abs / 1_000_000_000)} m`;
  if (abs >= 1_000_000) return `${sign}${trimDecimal(abs / 1_000_000)} jt`;
  if (abs >= 1_000) return `${sign}${trimDecimal(abs / 1_000)} rb`;
  return `${sign}${abs}`;
}

/** 12.5 -> "12,5%". */
export function formatPercentage(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${percentFormatter.format(safe)}%`;
}

function trimDecimal(value: number): string {
  return percentFormatter.format(Number(value.toFixed(1)));
}
