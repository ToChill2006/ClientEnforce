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
    <div className={`rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-900 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{titleForKind(kind)}</div>
          <div className="mt-1 text-sm">{message}</div>
        </div>
        {onDismiss ? (
          <button
            type="button"
            className="rounded px-1.5 py-1 text-xs text-red-700 hover:bg-red-100"
            onClick={onDismiss}
            aria-label="Dismiss rejection message"
          >
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}
