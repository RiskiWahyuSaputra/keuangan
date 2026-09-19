import { TrendingDown, TrendingUp, Wallet, type LucideIcon } from "lucide-react";

import { formatCurrency } from "@/lib/formatCurrency";

interface SummaryCardsProps {
  balance: number;
  income: number;
  expense: number;
}

type Tone = "brand" | "income" | "expense";

const TONE_STYLES: Record<Tone, { icon: string; iconBg: string; value: string; glow: string }> = {
  brand: {
    icon: "text-blue-600",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    value: "text-slate-900",
    glow: "from-blue-500/5 to-transparent",
  },
  income: {
    icon: "text-emerald-600",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    value: "text-emerald-600",
    glow: "from-emerald-500/5 to-transparent",
  },
  expense: {
    icon: "text-rose-600",
    iconBg: "bg-rose-500/10 border-rose-500/20",
    value: "text-rose-600",
    glow: "from-rose-500/5 to-transparent",
  },
};

export default function SummaryCards({ balance, income, expense }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryCard
        label="Saldo Saat Ini"
        value={balance}
        icon={Wallet}
        tone={balance < 0 ? "expense" : "brand"}
        hint={balance < 0 ? "Pengeluaran melebihi pemasukan" : "Pemasukan dikurangi pengeluaran"}
      />
      <SummaryCard
        label="Total Pemasukan"
        value={income}
        icon={TrendingUp}
        tone="income"
        hint="Seluruh transaksi pemasukan"
      />
      <SummaryCard
        label="Total Pengeluaran"
        value={expense}
        icon={TrendingDown}
        tone="expense"
        hint="Seluruh transaksi pengeluaran"
      />
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: Tone;
  hint: string;
}

function SummaryCard({ label, value, icon: Icon, tone, hint }: SummaryCardProps) {
  const styles = TONE_STYLES[tone];
  return (
    <article className="group relative overflow-hidden rounded-3xl ios-glass-card p-5 sm:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/5">
      <div className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-bl ${styles.glow} blur-xl`} />
      
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</h2>
        <span className={`grid h-10 w-10 place-items-center rounded-2xl border backdrop-blur-md shadow-sm ${styles.iconBg}`}>
          <Icon aria-hidden="true" className={`h-5 w-5 ${styles.icon}`} />
        </span>
      </div>
      <p
        className={`mt-4 break-words text-2xl sm:text-3xl font-bold tabular-nums tracking-tight ${styles.value}`}
      >
        {formatCurrency(value)}
      </p>
      <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
    </article>
  );
}
