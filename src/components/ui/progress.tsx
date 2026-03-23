"use client";

import * as React from "react";

export function Progress({
  value,
  className = "",
  animate = true,
}: {
  value: number;
  className?: string;
  animate?: boolean;
}) {
  const v = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;

  const fillColor =
    v === 100 ? "var(--color-complete)" :
    v >= 60   ? "var(--color-in-progress)" :
    v >= 30   ? "var(--color-pending)" :
                "var(--color-blocked)";

  return (
    <div
      className={["h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]", className].join(" ")}
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
          transition: animate ? "width 600ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
        }}
      />
    </div>
  );
}
