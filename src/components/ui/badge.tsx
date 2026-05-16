import * as React from "react";

type BadgeVariant = "complete" | "in-progress" | "pending" | "blocked" | "info" | "default" | "warning";

interface BadgeProps {
  variant?: BadgeVariant;
  outline?: boolean;
  className?: string;
  children: React.ReactNode;
}

const filledStyles: Record<BadgeVariant, string> = {
  complete:      "bg-[var(--color-success-subtle)] text-[var(--color-success)] border border-green-300",
  "in-progress": "bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-blue-300",
  pending:       "bg-[var(--color-warning-subtle)] text-[var(--color-warning)] border border-amber-400",
  blocked:       "bg-[var(--color-danger-subtle)] text-[var(--color-danger)] border border-red-300",
  info:          "bg-[var(--color-info-subtle)] text-[var(--color-info)] border border-cyan-300",
  warning:       "bg-[var(--color-warning-subtle)] text-[var(--color-warning)] border border-amber-400",
  default:       "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)] border border-[var(--color-border)]",
};

export function Badge({
  variant = "default",
  className = "",
  children,
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold leading-none whitespace-nowrap",
        filledStyles[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

/** Map a raw status string to a Badge variant */
export function statusToBadgeVariant(status: string): BadgeVariant {
  switch (status?.toLowerCase()) {
    case "complete":
    case "completed":
      return "complete";
    case "in_progress":
    case "in-progress":
    case "active":
      return "in-progress";
    case "pending":
    case "not_started":
      return "pending";
    case "blocked":
    case "rejected":
      return "blocked";
    case "overdue":
      return "blocked";
    default:
      return "default";
  }
}
