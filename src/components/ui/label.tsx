"use client";

import * as React from "react";

type Props = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className = "", ...props }: Props) {
  return (
    <label
      className={["text-xs font-medium text-zinc-700", className].join(" ")}
      {...props}
    />
  );
}