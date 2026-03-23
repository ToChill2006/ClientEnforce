"use client";

import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
};

const base = [
  "inline-flex items-center justify-center gap-1.5 rounded-full font-semibold select-none",
  "transition-all duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2",
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  "active:scale-[0.98]",
].join(" ");

const sizes: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-8 px-3.5 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-6 text-sm",
};

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary:   "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-sm)]",
  secondary: "bg-white text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)]",
  ghost:     "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text-primary)]",
  danger:    "bg-[var(--color-danger)] text-white hover:bg-red-700 shadow-[var(--shadow-sm)]",
  success:   "bg-[var(--color-success)] text-white hover:bg-green-700 shadow-[var(--shadow-sm)]",
};

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  return (
    <button
      className={[base, sizes[size], variants[variant], className].join(" ")}
      {...props}
    />
  );
}
