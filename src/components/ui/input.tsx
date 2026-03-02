"use client";

import * as React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: Props) {
  return (
    <input
      className={[
        "h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900",
        "placeholder:text-zinc-400",
        "focus:outline-none focus:ring-2 focus:ring-zinc-200",
        "disabled:bg-zinc-50 disabled:text-zinc-500 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
      {...props}
    />
  );
}