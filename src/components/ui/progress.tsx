"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Size = "xs" | "sm" | "md";
type Tone = "auto" | "accent" | "success" | "warning" | "danger";

const sizeMap: Record<Size, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
};

export function Progress({
  value,
  className = "",
  size = "sm",
  tone = "auto",
  animate = true,
  showLabel = false,
  label,
}: {
  value: number;
  className?: string;
  size?: Size;
  tone?: Tone;
  animate?: boolean;
  showLabel?: boolean;
  label?: React.ReactNode;
}) {
  const v = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;

  const resolvedTone =
    tone === "auto"
      ? v >= 100
        ? "success"
        : "accent"
      : tone;
  const fillColor = {
    accent: "var(--color-accent)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    danger: "var(--color-danger)",
  }[resolvedTone];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]",
          sizeMap[size]
        )}
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${v}%`,
            backgroundColor: fillColor,
            transition: animate ? "width 450ms var(--ease-emphasized)" : "none",
          }}
        />
      </div>
      {(showLabel || label) && (
        <span className="shrink-0 text-[11px] tabular-nums text-[var(--color-text-muted)]">
          {label ?? `${Math.round(v)}%`}
        </span>
      )}
    </div>
  );
}
