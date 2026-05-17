"use client";

import * as React from "react";

type RejectionKind = "plan" | "permission" | "error";

function titleForKind(kind: RejectionKind) {
  if (kind === "plan") return "Plan Upgrade Required";
  if (kind === "permission") return "Permission Required";
  return "Action Rejected";
}

export function RejectionBanner({
  kind,
  message,
  onDismiss,
  className = "",
}: {
  kind: RejectionKind;
  message: string;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <div className={`rounded-[var(--radius-md)] border border-[var(--color-danger-subtle)] bg-[var(--color-danger-subtle)] px-4 py-3 text-[var(--color-danger)] ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{titleForKind(kind)}</div>
          <div className="mt-1 text-sm opacity-90">{message}</div>
        </div>
        {onDismiss ? (
          <button
            type="button"
            className="shrink-0 rounded px-1.5 py-1 text-xs opacity-60 hover:opacity-100"
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}
