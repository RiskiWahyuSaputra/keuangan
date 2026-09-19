import type { Metadata } from "next";

import TransactionsView from "@/components/transactions/TransactionsView";

export const metadata: Metadata = {
  title: "Transaksi",
};

export default function TransactionsPage() {
  return <TransactionsView />;
}
