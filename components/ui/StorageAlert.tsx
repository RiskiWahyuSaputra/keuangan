"use client";

import { AlertTriangle, X } from "lucide-react";

interface StorageAlertProps {
  message: string;
  onDismiss: () => void;
}

export default function StorageAlert({ message, onDismiss }: StorageAlertProps) {
  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3"
    >
      <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
      <p className="flex-1 text-sm leading-6 text-amber-900">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Tutup peringatan"
        className="-m-1 rounded-lg p-1 text-amber-700 transition-colors hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}
