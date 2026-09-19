"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChartPie,
  LayoutDashboard,
  Menu,
  ReceiptText,
  Settings,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";

import ThemeToggle from "@/components/ui/ThemeToggle";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: readonly NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transaksi", icon: ReceiptText },
  { href: "/statistics", label: "Statistik", icon: ChartPie },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 ios-glass-nav border-b border-white/60 dark:border-white/10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-2xl p-1 transition-transform active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25 border border-white/30">
            <Wallet aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-base">
            DompetQ
          </span>
        </Link>

        {/* iOS Styled Segmented Pill Navigation */}
        <nav aria-label="Navigasi utama" className="hidden items-center rounded-full ios-segmented p-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} active={isActivePath(pathname, item.href)} />
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            className="grid h-10 w-10 place-items-center rounded-2xl border border-white/70 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-700 dark:text-slate-200 shadow-sm transition-all hover:bg-white/80 dark:hover:bg-slate-800 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:hidden"
          >
            {menuOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="menu-mobile"
          aria-label="Navigasi utama"
          className="border-t border-white/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl px-4 py-3 md:hidden shadow-lg"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1.5">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isActivePath(pathname, item.href)}
                block
                onNavigate={closeMenu}
              />
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}

interface NavLinkProps {
  item: NavItem;
  active: boolean;
  block?: boolean;
  onNavigate?: () => void;
}

function NavLink({ item, active, block = false, onNavigate }: NavLinkProps) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
        block ? "w-full justify-start rounded-xl px-3 py-2.5" : ""
      } ${
        active
          ? "bg-white dark:bg-slate-700/90 text-blue-600 dark:text-blue-400 shadow-sm shadow-slate-900/5 font-semibold"
          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10"
      }`}
    >
      <Icon
        aria-hidden="true"
        className={`h-4 w-4 transition-transform group-active:scale-95 ${
          active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
        }`}
      />
      <span>{item.label}</span>
    </Link>
  );
}
