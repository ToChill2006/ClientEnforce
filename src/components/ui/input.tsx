"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

const inputBase =
  "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] " +
  "text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] " +
  "transition-[border-color,box-shadow] duration-[var(--dur-fast)] ease-[var(--ease-standard)] " +
  "focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)] " +
  "disabled:bg-[var(--color-bg-subtle)] disabled:text-[var(--color-text-muted)] disabled:cursor-not-allowed";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function Input({ className = "", invalid, ...props }: InputProps) {
  return (
    <input
      className={cn(
        inputBase,
        "h-9 px-3",
        invalid && "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger-subtle)]",
        className
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function Textarea({ className = "", invalid, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        inputBase,
        "min-h-[80px] px-3 py-2 resize-y",
        invalid && "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger-subtle)]",
        className
      )}
      aria-invalid={invalid || undefined}
      {...props}
    />
  );
}

export function Select({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          inputBase,
          "h-9 pl-3 pr-8 cursor-pointer appearance-none",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 8l4 4 4-4" />
      </svg>
    </div>
  );
}

export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Checkbox({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "h-4 w-4 shrink-0 cursor-pointer rounded-[4px] border border-[var(--color-border-strong)] bg-[var(--color-panel)]",
          "accent-[var(--color-accent)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-subtle)]",
          className
        )}
        {...props}
      />
    );
  }
);
