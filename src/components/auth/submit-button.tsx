"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Submit button for auth pages. Uses `useFormStatus` so it shows a spinner
 * while the enclosing server-action `<form>` is pending.
 */
export function AuthSubmitButton({ children, className }: Props) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className={className ?? "w-full"} size="lg">
      {children}
    </Button>
  );
}
