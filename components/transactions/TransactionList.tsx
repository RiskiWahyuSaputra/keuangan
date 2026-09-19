"use client";

import TransactionCardList from "@/components/transactions/TransactionCard";
import TransactionTable from "@/components/transactions/TransactionTable";
import type { Transaction } from "@/types/transaction";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  return (
    <>
      <TransactionTable transactions={transactions} onEdit={onEdit} onDelete={onDelete} />
      <TransactionCardList transactions={transactions} onEdit={onEdit} onDelete={onDelete} />
    </>
  );
}
