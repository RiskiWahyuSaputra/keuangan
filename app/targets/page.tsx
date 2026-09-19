import type { Metadata } from "next";
import TargetsView from "@/components/targets/TargetsView";

export const metadata: Metadata = {
  title: "Target & Celengan",
  description: "Kelola budget bulanan dan wujudkan impian finansialmu.",
};

export default function TargetsPage() {
  return <TargetsView />;
}
