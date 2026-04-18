"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "./button";
import { cn } from "@/lib/cn";

type Action =
  | { label: string; onClick: () => void; href?: never }
  | { label: string; href: string; onClick?: never };

export function EmptyState({
  icon,
  heading,
  subtext,
  action,
  secondaryAction,
  className = "",
  compact = false,
}: {
  icon?: React.ReactNode;
  heading: string;
  subtext?: React.ReactNode;
  action?: Action;
  secondaryAction?: Action;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-10 px-6" : "py-16 px-6",
        className
      )}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]">
          {icon}
        </div>
      )}
      <h3 className={cn("text-sm font-semibold text-[var(--color-text-primary)]", icon ? "mt-4" : "")}>
        {heading}
      </h3>
      {subtext && (
        <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-[var(--color-text-muted)]">{subtext}</p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {action && (action.href ? (
            <Link
              href={action.href}
              className="inline-flex h-9 items-center rounded-[var(--radius-md)] bg-[var(--color-accent)] px-3.5 text-sm font-medium text-white shadow-[var(--shadow-xs)] hover:bg-[var(--color-accent-hover)]"
            >
              {action.label}
            </Link>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          ))}
          {secondaryAction && (secondaryAction.href ? (
            <Link
              href={secondaryAction.href}
              className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-3.5 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]"
            >
              {secondaryAction.label}
            </Link>
          ) : (
            <Button variant="secondary" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>
          ))}
        </div>
      )}
    </div>
  );
}
