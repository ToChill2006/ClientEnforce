"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type FormFieldProps = {
  label?: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  description?: React.ReactNode;
  error?: React.ReactNode;
  hint?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function FormField({
  label,
  htmlFor,
  required,
  description,
  error,
  hint,
  className = "",
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-1 text-xs font-medium text-[var(--color-text-secondary)]"
        >
          <span>{label}</span>
          {required && <span className="text-[var(--color-danger)]">*</span>}
        </label>
      )}
      {description && (
        <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
      )}
      {children}
      {error ? (
        <p className="text-xs text-[var(--color-danger)]" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}

export function FormGrid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 sm:grid-cols-2", className)}>{children}</div>;
}
