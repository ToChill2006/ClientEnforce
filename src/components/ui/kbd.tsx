"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export function Kbd({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <kbd className={cn(className)}>{children}</kbd>;
}

export function KbdGroup({ keys, className = "" }: { keys: string[]; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {keys.map((k) => (
        <Kbd key={k}>{k}</Kbd>
      ))}
    </span>
  );
}

/** Returns the platform-appropriate modifier symbol ⌘ or Ctrl for display. */
export function useModifierLabel(): string {
  const [mac, setMac] = React.useState(false);
  React.useEffect(() => {
    setMac(/Mac|iPhone|iPad|iPod/i.test(navigator.platform));
  }, []);
  return mac ? "⌘" : "Ctrl";
}
