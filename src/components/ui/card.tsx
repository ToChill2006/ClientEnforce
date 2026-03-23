"use client";

import * as React from "react";

export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]", className].join(" ")}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["px-5 pt-5", className].join(" ")} {...props} />;
}

export function CardTitle({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={["text-sm font-semibold text-[var(--color-text-primary)]", className].join(" ")} {...props} />;
}

export function CardDescription({ className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={["mt-1 text-xs text-[var(--color-text-muted)]", className].join(" ")} {...props} />;
}

export function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["px-5 pb-5", className].join(" ")} {...props} />;
}
