import { TRANSACTION_TYPE_LABELS, type TransactionType } from "@/types/transaction";

const BADGE_CLASSES: Record<TransactionType, string> = {
  income: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25",
  expense: "bg-rose-500/15 text-rose-700 border-rose-500/25",
};

export default function TypeBadge({ type }: { type: TransactionType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border backdrop-blur-sm shadow-sm ${BADGE_CLASSES[type]}`}
    >
      {TRANSACTION_TYPE_LABELS[type]}
    </span>
  );
}
