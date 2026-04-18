"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Crumb[];
  meta?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  meta,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={cn("mb-6 border-b border-[var(--color-border)] pb-5", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-3 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
          {breadcrumbs.map((c, i) => {
            const last = i === breadcrumbs.length - 1;
            return (
              <React.Fragment key={i}>
                {c.href && !last ? (
                  <Link
                    href={c.href}
                    className="rounded-[var(--radius-xs)] px-1 py-0.5 hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className={last ? "text-[var(--color-text-primary)]" : ""}>{c.label}</span>
                )}
                {!last && <ChevronRight className="h-3 w-3 opacity-60" />}
              </React.Fragment>
            );
          })}
        </nav>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h1
            className="truncate text-xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h1>
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-[var(--color-text-secondary)]">{description}</p>
          )}
          {meta && <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div>}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        )}
      </div>
    </header>
  );
}
