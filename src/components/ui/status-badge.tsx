"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { STATUS_CONFIG, normalizeStatus, type OnboardingStatus, type StatusTone } from "@/lib/status";

const toneClasses: Record<StatusTone, string> = {
  neutral:
    "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] border-[var(--color-border)]",
  info:
    "bg-[var(--color-info-subtle)] text-[var(--color-info)] border-[color-mix(in_oklab,var(--color-info)_25%,transparent)]",
  accent:
    "bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border-[color-mix(in_oklab,var(--color-accent)_25%,transparent)]",
  success:
    "bg-[var(--color-success-subtle)] text-[var(--color-success)] border-[color-mix(in_oklab,var(--color-success)_25%,transparent)]",
  warning:
    "bg-[var(--color-warning-subtle)] text-[var(--color-warning)] border-[color-mix(in_oklab,var(--color-warning)_25%,transparent)]",
  danger:
    "bg-[var(--color-danger-subtle)] text-[var(--color-danger)] border-[color-mix(in_oklab,var(--color-danger)_25%,transparent)]",
};

const dotClasses: Record<StatusTone, string> = {
  neutral: "bg-[var(--color-text-muted)]",
  info: "bg-[var(--color-info)]",
  accent: "bg-[var(--color-accent)]",
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  danger: "bg-[var(--color-danger)]",
};

type Size = "sm" | "md";
const sizeClasses: Record<Size, string> = {
  sm: "h-5 px-1.5 text-[11px] gap-1",
  md: "h-6 px-2 text-xs gap-1.5",
};

export function StatusBadge({
  status,
  size = "sm",
  showDot = true,
  className = "",
}: {
  status: OnboardingStatus | string;
  size?: Size;
  showDot?: boolean;
  className?: string;
}) {
  const normalized = normalizeStatus(status);
  const cfg = STATUS_CONFIG[normalized] ?? STATUS_CONFIG["draft"];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-full)] border font-medium",
        sizeClasses[size],
        toneClasses[cfg.tone],
        className
      )}
      title={cfg.hint}
    >
      {showDot && <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[cfg.tone])} />}
      {cfg.label}
    </span>
  );
}

/** Generic tone-based tag for non-status uses (roles, plan tiers, etc.). */
export function Tag({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: StatusTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--radius-full)] border px-2 py-0.5 text-[11px] font-medium",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
