"use client";

import * as React from "react";

type Props = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className = "", ...props }: Props) {
  return (
    <label
      className={["text-xs font-medium text-[var(--color-text-secondary)]", className].join(" ")}
      {...props}
    />
  );
}