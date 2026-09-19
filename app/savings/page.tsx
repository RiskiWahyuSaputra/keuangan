import type { Metadata } from "next";
import SavingsView from "@/components/savings/SavingsView";

export const metadata: Metadata = {
  title: "Celengan Impian",
  description: "Wujudkan berbagai rencana dan target tabungan impianmu.",
};

export default function SavingsPage() {
  return <SavingsView />;
}
