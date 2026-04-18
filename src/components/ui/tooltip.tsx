"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: "top" | "bottom";
  className?: string;
  delayMs?: number;
};

export function Tooltip({ content, children, side = "top", className = "", delayMs = 350 }: TooltipProps) {
  const [show, setShow] = React.useState(false);
  const timer = React.useRef<number | null>(null);

  const open = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShow(true), delayMs);
  };
  const close = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setShow(false);
  };

  const trigger = React.cloneElement(children as any, {
    onMouseEnter: (e: React.MouseEvent) => {
      (children.props as any).onMouseEnter?.(e);
      open();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      (children.props as any).onMouseLeave?.(e);
      close();
    },
    onFocus: (e: React.FocusEvent) => {
      (children.props as any).onFocus?.(e);
      open();
    },
    onBlur: (e: React.FocusEvent) => {
      (children.props as any).onBlur?.(e);
      close();
    },
  });

  return (
    <span className="relative inline-flex">
      {trigger}
      {show && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-1 text-[11px] font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-md)]",
            side === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5",
            className
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
