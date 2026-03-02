"use client";

import * as React from "react";

export function Progress({
  value,
  className = "",
}: {
  value: number; // 0..100
  className?: string;
}) {
  const v = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;

  return (
    <div
      className={[
        "h-2 w-full overflow-hidden rounded-full bg-zinc-100",
        "border border-zinc-200",
        className,
      ].join(" ")}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full bg-zinc-900" style={{ width: `${v}%` }} />
    </div>
  );
}