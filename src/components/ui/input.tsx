"use client";

import * as React from "react";

const inputBase = [
  "w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white",
  "text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]",
  "transition-colors duration-150",
  "focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)] focus:ring-offset-0",
  "disabled:bg-[var(--color-bg-subtle)] disabled:text-[var(--color-text-muted)] disabled:cursor-not-allowed",
].join(" ");

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[inputBase, "h-9 px-3", className].join(" ")}
      {...props}
    />
  );
}

export function Textarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={[inputBase, "px-3 py-2 min-h-[80px] resize-y", className].join(" ")}
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
    <select
      className={[inputBase, "h-9 px-3 pr-8 cursor-pointer appearance-none", className].join(" ")}
      {...props}
    >
      {children}
    </select>
  );
}
