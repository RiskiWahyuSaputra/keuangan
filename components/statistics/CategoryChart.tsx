"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { getChartColor } from "@/lib/categories";
import { formatCurrency, formatPercentage } from "@/lib/formatCurrency";
import type { CategorySummary } from "@/lib/calculations";

interface CategoryChartProps {
  data: CategorySummary[];
  total: number;
}

interface TooltipPayloadItem {
  value?: number;
  payload?: CategorySummary;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function CategoryTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-lg shadow-slate-900/5">
      <p className="text-xs font-medium text-slate-500">{item.category}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-slate-900">
        {formatCurrency(item.total)}
      </p>
      <p className="text-xs text-slate-400">{item.count} transaksi</p>
    </div>
  );
}

export default function CategoryChart({ data, total }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <p className="px-5 py-12 text-center text-sm text-slate-500">
        Belum ada pengeluaran pada periode ini.
      </p>
    );
  }

  const chartData = data.map((item, index) => ({
    ...item,
    fill: getChartColor(index),
  }));

  return (
    <div className="grid gap-4 p-5 lg:grid-cols-2 lg:items-center">
      <div className="relative">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="category"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
              stroke="none"
            >
              {chartData.map((item) => (
                <Cell key={item.category} fill={item.fill} />
              ))}
            </Pie>
            <Tooltip content={<CategoryTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-slate-500">Total</span>
          <span className="max-w-[7.5rem] truncate text-sm font-semibold tabular-nums text-slate-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <ul className="space-y-2.5">
        {chartData.map((item) => {
          const percentage = total > 0 ? (item.total / total) * 100 : 0;
          return (
            <li key={item.category} className="flex items-center gap-3 text-sm">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="min-w-0 flex-1 truncate text-slate-700">{item.category}</span>
              <span className="shrink-0 font-medium tabular-nums text-slate-900">
                {formatCurrency(item.total)}
              </span>
              <span className="w-12 shrink-0 text-right text-xs tabular-nums text-slate-500">
                {formatPercentage(percentage)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
