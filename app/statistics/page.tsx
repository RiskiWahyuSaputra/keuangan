import type { Metadata } from "next";

import StatisticsView from "@/components/statistics/StatisticsView";

export const metadata: Metadata = {
  title: "Statistik",
};

export default function StatisticsPage() {
  return <StatisticsView />;
}
