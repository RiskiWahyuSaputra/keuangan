import type { Metadata } from "next";
import TargetsView from "@/components/targets/TargetsView";

export const metadata: Metadata = {
  title: "Target Budget",
  description: "Kelola dan pantau batas pengeluaran bulananmu.",
};

export default function TargetsPage() {
  return <TargetsView />;
}
