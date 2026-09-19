"use client";

import SavingsGoals from "@/components/dashboard/SavingsGoals";
import PageHeader from "@/components/layout/PageHeader";

export default function SavingsView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Celengan Impian"
        description="Kelola pos tabungan, pantau progres setoran, dan wujudkan barang atau target impianmu."
      />

      <div className="max-w-4xl mx-auto">
        <SavingsGoals />
      </div>
    </div>
  );
}
