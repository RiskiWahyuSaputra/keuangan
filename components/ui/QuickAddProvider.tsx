"use client";

import { createContext, useContext, useState, useMemo } from "react";
import TransactionForm from "@/components/transactions/TransactionForm";
import { useTransactions } from "@/hooks/useTransactions";
import type { TransactionInput } from "@/types/transaction";

interface QuickAddContextValue {
  openQuickAdd: () => void;
}

const QuickAddContext = createContext<QuickAddContextValue | null>(null);

export function QuickAddProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { addTransaction } = useTransactions();

  const openQuickAdd = () => setIsOpen(true);
  const closeQuickAdd = () => setIsOpen(false);

  const handleSubmit = (input: TransactionInput) => {
    addTransaction(input);
    setIsOpen(false);
  };

  const value = useMemo(() => ({ openQuickAdd }), []);

  return (
    <QuickAddContext.Provider value={value}>
      {children}
      <TransactionForm
        open={isOpen}
        transaction={null}
        onClose={closeQuickAdd}
        onSubmit={handleSubmit}
      />
    </QuickAddContext.Provider>
  );
}

export function useQuickAdd(): QuickAddContextValue {
  const ctx = useContext(QuickAddContext);
  if (!ctx) {
    throw new Error("useQuickAdd must be used within QuickAddProvider");
  }
  return ctx;
}
