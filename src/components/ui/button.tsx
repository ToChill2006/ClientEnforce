"use client";

import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const base =
  "button-polish inline-flex items-center justify-center rounded-md font-medium transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const sizes: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-sm",
};

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800 border border-transparent",
  secondary: "bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50",
  ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100",
  danger: "bg-red-600 text-white hover:bg-red-500 border border-transparent",
};

export function Button({ className = "", variant = "primary", size = "md", ...props }: Props) {
  return <button className={[base, sizes[size], variants[variant], className].join(" ")} {...props} />;
}
