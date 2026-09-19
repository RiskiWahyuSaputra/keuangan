"use client";

import { AlertTriangle, CheckCircle2, Info, Sparkles, Trash2, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ToastVariant = "success" | "error" | "info" | "delete";

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 3200;
const MAX_VISIBLE_TOASTS = 3;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);
  const timersRef = useRef<number[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      counterRef.current += 1;
      const id = `toast-${counterRef.current}`;
      setToasts((current) => [...current, { id, message, variant }].slice(-MAX_VISIBLE_TOASTS));
      const timer = window.setTimeout(() => dismiss(id), TOAST_DURATION_MS);
      timersRef.current.push(timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const value = useMemo<ToastContextValue>(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Alert Melayang di Bagian Atas (Dynamic Island Capsule Style) */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 top-3 z-[80] flex flex-col items-center gap-2.5 px-4 pt-[env(safe-area-inset-top,0px)]"
      >
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const isDelete = item.variant === "delete" || item.message.toLowerCase().includes("hapus");
  const isSuccess = item.variant === "success" && !isDelete;
  const isError = item.variant === "error";

  return (
    <div
      role="status"
      className="pointer-events-auto group relative flex items-center gap-3 rounded-full px-4 py-2.5 shadow-2xl backdrop-blur-2xl transition-all active:scale-95 animate-island-toast border border-white/40 dark:border-white/15 bg-white/85 dark:bg-slate-900/90 max-w-sm sm:max-w-md w-auto"
      style={{
        boxShadow: isSuccess
          ? "0 12px 36px -4px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.15) inset"
          : isDelete
          ? "0 12px 36px -4px rgba(239, 68, 68, 0.25), 0 0 0 1px rgba(239, 68, 68, 0.15) inset"
          : isError
          ? "0 12px 36px -4px rgba(244, 63, 94, 0.25), 0 0 0 1px rgba(244, 63, 94, 0.15) inset"
          : "0 12px 36px -4px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.15) inset",
      }}
    >
      {/* Icon Capsule Pill */}
      <div
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-white shadow-sm ${
          isSuccess
            ? "bg-gradient-to-tr from-emerald-600 to-teal-400"
            : isDelete
            ? "bg-gradient-to-tr from-red-600 to-rose-400"
            : isError
            ? "bg-gradient-to-tr from-rose-600 to-pink-500"
            : "bg-gradient-to-tr from-blue-600 to-indigo-400"
        }`}
      >
        {isSuccess ? (
          <Sparkles aria-hidden="true" className="h-4 w-4 stroke-[2.5]" />
        ) : isDelete ? (
          <Trash2 aria-hidden="true" className="h-3.5 w-3.5 stroke-[2.5]" />
        ) : isError ? (
          <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5 stroke-[2.5]" />
        ) : (
          <Info aria-hidden="true" className="h-3.5 w-3.5 stroke-[2.5]" />
        )}
      </div>

      <div className="flex flex-col min-w-0 pr-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {isSuccess ? "Berhasil" : isDelete ? "Dihapus" : isError ? "Perhatian" : "Info"}
        </span>
        <p className="text-xs sm:text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100 truncate">
          {item.message}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Tutup notifikasi"
        className="-mr-1 ml-1 grid h-6 w-6 place-items-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
      >
        <X aria-hidden="true" className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast harus dipakai di dalam ToastProvider.");
  }
  return context;
}
