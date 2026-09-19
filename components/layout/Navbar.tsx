"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChartPie,
  LayoutDashboard,
  ReceiptText,
  Settings,
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled
          ? "border-b border-white/60 dark:border-white/10 ios-glass-nav py-0 shadow-sm"
          : "border-b border-transparent bg-transparent py-1.5"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 ${
          scrolled
            ? "py-2.5 sm:py-3 -translate-y-1 sm:translate-y-0"
            : "py-3 sm:py-3.5 translate-y-0"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-2xl p-1 transition-transform active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl shadow-sm">
            <Image
              src="/logo-icon.png"
              alt="Logo DompetQ"
              width={36}
              height={36}
              className="h-full w-full object-contain drop-shadow-xs"
              priority
            />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-lg">
            DompetQ
          </span>
        </Link>

        {/* Desktop Styled Segmented Pill Navigation */}
        <nav aria-label="Navigasi utama" className="hidden items-center rounded-full ios-segmented p-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} active={isActivePath(pathname, item.href)} />
          ))}
        </nav>

        {/* Theme Toggle di kanan atas */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}

function NavLink({ item, active, onNavigate }: NavLinkProps) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
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
