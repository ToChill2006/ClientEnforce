"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "default" | "success" | "error" | "info";

type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  variant?: Variant;
};

type ToastContextValue = {
  toast: (t: Omit<ToastItem, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const tones: Record<Variant, { bar: string; icon: React.ReactNode | null }> = {
  default: { bar: "bg-[var(--color-text-muted)]", icon: null },
  success: {
    bar: "bg-[var(--color-success)]",
    icon: <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" />,
  },
  error: {
    bar: "bg-[var(--color-danger)]",
    icon: <AlertCircle className="h-4 w-4 text-[var(--color-danger)]" />,
  },
  info: {
    bar: "bg-[var(--color-info)]",
    icon: <Info className="h-4 w-4 text-[var(--color-info)]" />,
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const toast = React.useCallback((t: Omit<ToastItem, "id">) => {
    const id = (typeof crypto !== "undefined" && "randomUUID" in crypto)
      ? crypto.randomUUID()
      : String(Math.random());
    const item: ToastItem = { id, variant: t.variant ?? "default", title: t.title, description: t.description };
    setItems((prev) => [item, ...prev].slice(0, 4));
    window.setTimeout(() => dismiss(id), 3800);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[200] flex w-[340px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {items.map((t) => {
          const tone = tones[t.variant ?? "default"];
          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto relative overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] p-3 pl-4 shadow-[var(--shadow-md)]"
              )}
              role="status"
            >
              <span className={cn("absolute inset-y-0 left-0 w-1", tone.bar)} />
              <div className="flex items-start gap-2.5">
                {tone.icon && <div className="mt-0.5 shrink-0">{tone.icon}</div>}
                <div className="min-w-0 flex-1">
                  {t.title && (
                    <div className="text-xs font-semibold text-[var(--color-text-primary)]">{t.title}</div>
                  )}
                  {t.description && (
                    <div className="mt-0.5 text-xs text-[var(--color-text-secondary)]">{t.description}</div>
                  )}
                </div>
                <button
                  aria-label="Dismiss"
                  onClick={() => dismiss(t.id)}
                  className="shrink-0 rounded-[var(--radius-xs)] p-0.5 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    return {
      toast: (t: Omit<ToastItem, "id">) => {
        console.warn("useToast called outside ToastProvider", t);
      },
    };
  }
  return ctx;
}
