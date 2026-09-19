import {
  Briefcase,
  Car,
  CircleDollarSign,
  Coffee,
  GraduationCap,
  HeartPulse,
  Home,
  Receipt,
  ShoppingBag,
  Sparkles,
  Utensils,
  type LucideIcon,
} from "lucide-react";

interface CategoryMeta {
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const CATEGORY_ICONS: Record<string, CategoryMeta> = {
  "Makan & Minum": {
    icon: Utensils,
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-500/15 border-amber-500/20",
  },
  Transportasi: {
    icon: Car,
    color: "text-sky-500 dark:text-sky-400",
    bg: "bg-sky-500/15 border-sky-500/20",
  },
  Belanja: {
    icon: ShoppingBag,
    color: "text-purple-500 dark:text-purple-400",
    bg: "bg-purple-500/15 border-purple-500/20",
  },
  Tagihan: {
    icon: Receipt,
    color: "text-rose-500 dark:text-rose-400",
    bg: "bg-rose-500/15 border-rose-500/20",
  },
  Hiburan: {
    icon: Coffee,
    color: "text-pink-500 dark:text-pink-400",
    bg: "bg-pink-500/15 border-pink-500/20",
  },
  Kesehatan: {
    icon: HeartPulse,
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-500/15 border-red-500/20",
  },
  Pendidikan: {
    icon: GraduationCap,
    color: "text-indigo-500 dark:text-indigo-400",
    bg: "bg-indigo-500/15 border-indigo-500/20",
  },
  Tempat: {
    icon: Home,
    color: "text-orange-500 dark:text-orange-400",
    bg: "bg-orange-500/15 border-orange-500/20",
  },
  Gaji: {
    icon: CircleDollarSign,
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-500/15 border-emerald-500/20",
  },
  Investasi: {
    icon: Briefcase,
    color: "text-teal-500 dark:text-teal-400",
    bg: "bg-teal-500/15 border-teal-500/20",
  },
  Lainnya: {
    icon: Sparkles,
    color: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-500/15 border-blue-500/20",
  },
};

export function getCategoryMeta(categoryName: string): CategoryMeta {
  return (
    CATEGORY_ICONS[categoryName] || {
      icon: Sparkles,
      color: "text-blue-500 dark:text-blue-400",
      bg: "bg-blue-500/15 border-blue-500/20",
    }
  );
}
