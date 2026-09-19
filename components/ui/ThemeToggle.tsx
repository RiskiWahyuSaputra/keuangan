"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center rounded-full ios-segmented p-0.5">
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Mode Terang"
        title="Mode Terang"
        className={`grid h-7 w-7 place-items-center rounded-full transition-all ${
          theme === "light"
            ? "bg-white text-amber-500 shadow-xs"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        }`}
      >
        <Sun aria-hidden="true" className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Mode Gelap"
        title="Mode Gelap"
        className={`grid h-7 w-7 place-items-center rounded-full transition-all ${
          theme === "dark"
            ? "bg-white/90 text-blue-500 shadow-xs dark:bg-slate-700/80 dark:text-blue-400"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        }`}
      >
        <Moon aria-hidden="true" className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        aria-label="Ikuti Sistem"
        title="Ikuti Sistem"
        className={`grid h-7 w-7 place-items-center rounded-full transition-all ${
          theme === "system"
            ? "bg-white text-blue-600 shadow-xs dark:bg-slate-700/80 dark:text-blue-400"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        }`}
      >
        <Laptop aria-hidden="true" className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
