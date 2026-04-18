"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type MenuProps = {
  trigger: React.ReactElement;
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
};

/**
 * Lightweight menu — opens on trigger click, dismisses on outside click / Escape.
 * Positioned absolutely relative to the trigger wrapper. Good enough for row actions
 * and contextual menus. Not a full combobox.
 */
export function Menu({ trigger, children, align = "end", className = "" }: MenuProps) {
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const clonedTrigger = React.cloneElement(trigger as any, {
    onClick: (e: React.MouseEvent) => {
      (trigger.props as any).onClick?.(e);
      e.preventDefault();
      e.stopPropagation();
      setOpen((v) => !v);
    },
    "aria-haspopup": "menu",
    "aria-expanded": open,
  });

  return (
    <div ref={wrapperRef} className="relative inline-block">
      {clonedTrigger}
      {open && (
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute z-50 mt-1 min-w-[180px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] p-1 shadow-[var(--shadow-lg)]",
            align === "end" ? "right-0" : "left-0",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

type MenuItemProps = {
  children: React.ReactNode;
  onSelect?: () => void;
  href?: string;
  destructive?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  shortcut?: React.ReactNode;
};

export function MenuItem({ children, onSelect, href, destructive, disabled, iconLeft, shortcut }: MenuItemProps) {
  const className = cn(
    "flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-xs",
    "transition-colors duration-[var(--dur-fast)]",
    disabled
      ? "cursor-not-allowed text-[var(--color-text-muted)]"
      : destructive
      ? "text-[var(--color-danger)] hover:bg-[var(--color-danger-subtle)]"
      : "text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]"
  );
  const inner = (
    <>
      {iconLeft && <span className="shrink-0 text-[var(--color-text-muted)]">{iconLeft}</span>}
      <span className="flex-1 truncate">{children}</span>
      {shortcut && <span className="shrink-0 text-[10px] text-[var(--color-text-muted)]">{shortcut}</span>}
    </>
  );
  if (href && !disabled) {
    return (
      <Link href={href} role="menuitem" className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={() => !disabled && onSelect?.()}
      className={className}
    >
      {inner}
    </button>
  );
}

export function MenuDivider() {
  return <div className="my-1 h-px bg-[var(--color-border)]" />;
}

export function MenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
      {children}
    </div>
  );
}
