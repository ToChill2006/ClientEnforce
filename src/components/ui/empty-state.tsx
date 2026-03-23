import * as React from "react";
import { Button } from "./button";

export function EmptyState({
  icon,
  heading,
  subtext,
  action,
}: {
  icon: React.ReactNode;
  heading: string;
  subtext?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-[var(--color-text-primary)]">{heading}</h3>
      {subtext && (
        <p className="mt-1.5 max-w-xs text-sm text-[var(--color-text-muted)]">{subtext}</p>
      )}
      {action && (
        <Button className="mt-5" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
