"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

function daysUntil(deadline: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(deadline);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / 86400000);
}

type DeadlineBadgeProps = {
  deadline: string | null | undefined;
  className?: string;
  showLabel?: boolean; // prepend "Due: " label
};

export function DeadlineBadge({ deadline, className, showLabel = false }: DeadlineBadgeProps) {
  if (!deadline) return null;

  const days = daysUntil(deadline);
  const dateStr = new Date(deadline).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  let text: string;
  let colorClass: string;

  if (days < 0) {
    text = `Overdue by ${-days}d`;
    colorClass = "text-red-600 dark:text-red-400 font-semibold";
  } else if (days === 0) {
    text = "Due today";
    colorClass = "text-red-600 dark:text-red-400 font-semibold";
  } else if (days <= 3) {
    text = `${days}d left`;
    colorClass = "text-amber-600 dark:text-amber-400 font-medium";
  } else if (days <= 7) {
    text = `${days}d left`;
    colorClass = "text-yellow-600 dark:text-yellow-400";
  } else {
    text = `${days}d left`;
    colorClass = "text-[var(--color-text-muted)]";
  }

  return (
    <span
      className={cn("inline-flex items-center gap-1 text-xs tabular-nums", colorClass, className)}
      title={dateStr}
    >
      {showLabel && <span className="font-normal text-[var(--color-text-muted)]">Due</span>}
      <span>{dateStr}</span>
      <span className="opacity-70">·</span>
      <span>{text}</span>
    </span>
  );
}

// Pill variant — for use in cards/badges
export function DeadlinePill({ deadline, className }: { deadline: string | null | undefined; className?: string }) {
  if (!deadline) return null;

  const days = daysUntil(deadline);
  const dateStr = new Date(deadline).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  let pillClass: string;
  let text: string;

  if (days < 0) {
    pillClass = "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800";
    text = `Overdue · ${dateStr}`;
  } else if (days === 0) {
    pillClass = "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800";
    text = `Due today`;
  } else if (days <= 3) {
    pillClass = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
    text = `${dateStr} · ${days}d left`;
  } else if (days <= 7) {
    pillClass = "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-800";
    text = `${dateStr} · ${days}d left`;
  } else {
    pillClass = "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border-[var(--color-border)]";
    text = `${dateStr} · ${days}d left`;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        pillClass,
        className
      )}
    >
      {text}
    </span>
  );
}
