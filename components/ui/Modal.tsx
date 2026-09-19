"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md";
}

const SIZE_CLASSES = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
} as const;

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  // State untuk mengontrol animasi unmount (smooth exit)
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // Biarkan frame browser render dulu agar animasi transition masuk berjalan mulus
      const frame = requestAnimationFrame(() => {
        setVisible(true);
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setVisible(false);
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300); // Sinkron dengan durasi animasi exit 300ms
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      const active = document.activeElement;
      if (event.shiftKey) {
        if (active === first || !panel.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!mounted) return;
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted, handleKeyDown]);

  useEffect(() => {
    if (!visible) return;
    const target = panelRef.current?.querySelector<HTMLElement>(
      "[data-autofocus], input, select, textarea, button",
    );
    target?.focus();
  }, [visible]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 transition-all duration-300 ease-out ${
        visible
          ? "bg-slate-900/40 dark:bg-black/60 backdrop-blur-md opacity-100"
          : "bg-transparent backdrop-blur-none opacity-0 pointer-events-none"
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`max-h-[85vh] sm:max-h-[90vh] w-full flex flex-col rounded-t-[2rem] sm:rounded-3xl ios-glass-modal shadow-2xl ${SIZE_CLASSES[size]} transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-full sm:translate-y-6 sm:scale-95 opacity-0"
        }`}
      >
        {/* iOS Handlebar Indicator untuk tampilan mobile */}
        <div className="flex justify-center pt-3 pb-1 shrink-0 sm:hidden">
          <div className="h-1.5 w-10 rounded-full bg-slate-300 dark:bg-slate-600/70" />
        </div>

        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-white/60 dark:border-white/10 bg-white/50 dark:bg-slate-900/60 px-6 py-4 backdrop-blur-md">
          <div>
            <h2 id={titleId} className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors hover:bg-white/60 dark:hover:bg-white/10 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto overscroll-contain flex-1 pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] sm:pb-6">{children}</div>
      </div>
    </div>
  );
}
