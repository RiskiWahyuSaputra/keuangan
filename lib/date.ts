const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

const MONTH_SHORT_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
] as const;

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH_PATTERN = /^(\d{4})-(\d{2})$/;

interface DateParts {
  year: number;
  month: number;
  day: number;
}

function parseDateParts(date: string): DateParts | null {
  const match = DATE_PATTERN.exec(date);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

/** Memvalidasi format sekaligus keberadaan tanggal (mis. 2026-02-30 ditolak). */
export function isValidDateString(date: string): boolean {
  const parts = parseDateParts(date);
  if (!parts) return false;
  const candidate = new Date(parts.year, parts.month - 1, parts.day);
  return (
    candidate.getFullYear() === parts.year &&
    candidate.getMonth() === parts.month - 1 &&
    candidate.getDate() === parts.day
  );
}

export function isValidMonthKey(monthKey: string): boolean {
  const match = MONTH_PATTERN.exec(monthKey);
  if (!match) return false;
  const month = Number(match[2]);
  return month >= 1 && month <= 12;
}

/** Tanggal hari ini (zona waktu lokal) dalam format YYYY-MM-DD. */
export function todayISO(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/** "2026-09-18" -> "2026-09". */
export function getMonthKey(date: string): string {
  const parts = parseDateParts(date);
  if (!parts) return "";
  return `${parts.year}-${String(parts.month).padStart(2, "0")}`;
}

export function getCurrentMonthKey(): string {
  return getMonthKey(todayISO());
}

/** "2026-09-18" -> "18 Sep 2026". */
export function formatDateID(date: string): string {
  const parts = parseDateParts(date);
  if (!parts) return date;
  return `${parts.day} ${MONTH_SHORT_NAMES[parts.month - 1]} ${parts.year}`;
}

/** "2026-09" -> "September 2026". */
export function formatMonthLabel(monthKey: string): string {
  const match = MONTH_PATTERN.exec(monthKey);
  if (!match) return monthKey;
  const monthIndex = Number(match[2]) - 1;
  const name = MONTH_NAMES[monthIndex];
  if (!name) return monthKey;
  return `${name} ${match[1]}`;
}

/** "2026-09" -> "Sep" (label ringkas untuk sumbu grafik). */
export function formatMonthShort(monthKey: string): string {
  const match = MONTH_PATTERN.exec(monthKey);
  if (!match) return monthKey;
  const name = MONTH_SHORT_NAMES[Number(match[2]) - 1];
  return name ?? monthKey;
}

/** Menggeser bulan, mis. shiftMonthKey("2026-01", -1) -> "2025-12". */
export function shiftMonthKey(monthKey: string, delta: number): string {
  const match = MONTH_PATTERN.exec(monthKey);
  if (!match) return monthKey;
  const date = new Date(Number(match[1]), Number(match[2]) - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
