"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success" | "outline";
type Size = "xs" | "sm" | "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  asChild?: false;
};

const base =
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[var(--radius-md)] font-medium whitespace-nowrap select-none " +
  "transition-[background-color,border-color,color,box-shadow] duration-[var(--dur-fast)] ease-[var(--ease-standard)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  xs: "h-7 px-2 text-xs gap-1",
  sm: "h-8 px-2.5 text-xs",
  md: "h-9 px-3.5 text-sm",
  lg: "h-10 px-5 text-sm",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-xs)]",
  secondary:
    "bg-[var(--color-panel)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] hover:border-[var(--color-border-strong)]",
  outline:
    "bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]",
  ghost:
    "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]",
  danger:
    "bg-[var(--color-danger)] text-white hover:brightness-95 shadow-[var(--shadow-xs)]",
  success:
    "bg-[var(--color-success)] text-white hover:brightness-95 shadow-[var(--shadow-xs)]",
};

function Spinner() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 animate-spin-slow"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M21 12a9 9 0 0 1-9 9" />
    </svg>
  );
}

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  loading = false,
  iconLeft,
  iconRight,
  children,
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}

export function IconButton({
  className = "",
  variant = "ghost",
  size = "md",
  ...props
}: Omit<Props, "iconLeft" | "iconRight" | "children"> & {
  children: React.ReactNode;
  "aria-label": string;
}) {
  const sqSizes: Record<Size, string> = {
    xs: "h-7 w-7",
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-10 w-10",
  };
  return (
    <button
      className={cn(
        base,
        sqSizes[size],
        "p-0",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
