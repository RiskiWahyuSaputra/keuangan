"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartPie,
  LayoutDashboard,
  Plus,
  ReceiptText,
  Settings,
  Target,
  type LucideIcon,
} from "lucide-react";
import { useQuickAdd } from "@/components/ui/QuickAddProvider";
import { haptic } from "@/lib/haptic";

interface TabItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const LEFT_TABS: readonly TabItem[] = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/transactions", label: "Transaksi", icon: ReceiptText },
];

const RIGHT_TABS: readonly TabItem[] = [
  { href: "/targets", label: "Target", icon: Target },
  { href: "/statistics", label: "Statistik", icon: ChartPie },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileTabBar() {
  const pathname = usePathname();
  const { openQuickAdd } = useQuickAdd();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-1 md:hidden pointer-events-none">
      <nav
        aria-label="Navigasi Bawah Mobile"
        className="pointer-events-auto mx-auto max-w-md rounded-3xl ios-glass-modal px-2 py-1.5 shadow-2xl flex items-center justify-around"
      >
        {/* Sisi Kiri: Dashboard & Transaksi */}
        {LEFT_TABS.map((tab) => {
          const active = isActivePath(pathname, tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => haptic.light()}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[3.75rem] rounded-2xl transition-all active:scale-90 ${
                active
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <span className={`grid h-6 w-6 place-items-center relative`}>
                <Icon className="h-5 w-5" />
                {active && (
                  <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </span>
              <span className="mt-1 text-[10px] tracking-tight">{tab.label}</span>
            </Link>
          );
        })}

        {/* Tombol Plus Tengah: Tambah Transaksi */}
        <div className="relative -top-3 px-1">
          <button
            type="button"
            onClick={() => {
              haptic.medium();
              openQuickAdd();
            }}
            aria-label="Tambah Transaksi Baru"
            className="group relative flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/40 border-2 border-white dark:border-slate-800 transition-transform active:scale-90 hover:shadow-xl hover:shadow-blue-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus className="h-6 w-6 stroke-[2.5] transition-transform duration-200 group-hover:rotate-90" />
          </button>
        </div>

        {/* Sisi Kanan: Target & Statistik */}
        {RIGHT_TABS.map((tab) => {
          const active = isActivePath(pathname, tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => haptic.light()}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[3.75rem] rounded-2xl transition-all active:scale-90 ${
                active
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <span className={`grid h-6 w-6 place-items-center relative`}>
                <Icon className="h-5 w-5" />
                {active && (
                  <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </span>
              <span className="mt-1 text-[10px] tracking-tight">{tab.label}</span>
            </Link>
          );
        })}

        {/* Tab Pengaturan di Mobile */}
        <Link
          href="/settings"
          onClick={() => haptic.light()}
          className={`flex flex-col items-center justify-center py-1 px-2.5 min-w-[3.5rem] rounded-2xl transition-all active:scale-90 ${
            isActivePath(pathname, "/settings")
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <span className="grid h-6 w-6 place-items-center relative">
            <Settings className="h-5 w-5" />
            {isActivePath(pathname, "/settings") && (
              <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
          </span>
          <span className="mt-1 text-[10px] tracking-tight">Opsi</span>
        </Link>
      </nav>
    </div>
  );
}
