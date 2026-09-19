import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-2xl font-medium tracking-tight transition-all active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs sm:text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm sm:text-base",
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "ios-button-primary text-white",
  secondary: "ios-button-secondary text-slate-700 hover:text-slate-900",
  danger: "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-md shadow-red-500/25 border border-white/20 hover:from-red-600 hover:to-red-700",
  ghost: "text-slate-600 hover:bg-white/50 hover:text-slate-900",
};

export function buttonStyles(variant: ButtonVariant = "primary", size: ButtonSize = "md"): string {
  return `${BASE_CLASSES} ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonStyles(variant, size)} ${className}`.trim()}
      {...props}
    />
  );
}
