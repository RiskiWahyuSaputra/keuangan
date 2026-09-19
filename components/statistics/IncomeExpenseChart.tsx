"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatMonthLabel } from "@/lib/date";
import { formatCurrency, formatCurrencyShort } from "@/lib/formatCurrency";
import type { MonthlyChartDatum } from "@/lib/calculations";

interface IncomeExpenseChartProps {
  data: MonthlyChartDatum[];
}

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  color?: string;
  dataKey?: string | number;
  payload?: MonthlyChartDatum;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function MonthlyTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const monthKey = payload[0]?.payload?.monthKey;

  return (
    <div className="rounded-2xl ios-glass-modal px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        {monthKey ? formatMonthLabel(monthKey) : "Ringkasan"}
      </p>
      <ul className="mt-1.5 space-y-1">
        {payload.map((item) => (
          <li
            key={String(item.dataKey)}
            className="flex items-center justify-between gap-5 text-xs"
          >
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="font-bold tabular-nums text-slate-900 dark:text-slate-100">
              {formatCurrency(Number(item.value ?? 0))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <div className="px-2 py-4 sm:px-4">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={70}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            tickFormatter={(value) => formatCurrencyShort(Number(value))}
          />
          <Tooltip content={<MonthlyTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.08)" }} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
          <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={28} />
          <Bar dataKey="expense" name="Pengeluaran" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
