import { ReceiptText } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export default function EmptyState({ title, description, action, compact = false }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${compact ? "px-5 py-10" : "px-6 py-14"}`}
    >
      <span className="grid h-14 w-14 place-items-center rounded-3xl bg-white/70 border border-white/90 shadow-sm text-blue-500 backdrop-blur-md">
        <ReceiptText aria-hidden="true" className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
