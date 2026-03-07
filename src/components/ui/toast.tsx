"use client";

import * as React from "react";

type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "error";
};

type ToastContextValue = {
  toast: (t: Omit<ToastItem, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

function tone(variant: ToastItem["variant"]) {
  switch (variant) {
    case "success":
      return "border-emerald-200 bg-white text-zinc-900";
    case "error":
      return "border-red-200 bg-white text-zinc-900";
    default:
      return "border-zinc-200 bg-white text-zinc-900";
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((t: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    const item: ToastItem = { id, variant: t.variant ?? "default", title: t.title, description: t.description };
    setItems((prev) => [item, ...prev].slice(0, 4));
    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, 3800);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed right-4 top-4 z-[100] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={[
              "rounded-xl border p-3 shadow-sm",
              tone(t.variant),
            ].join(" ")}
          >
            {t.title ? <div className="text-sm font-semibold">{t.title}</div> : null}
            {t.description ? <div className="mt-1 text-xs text-zinc-600">{t.description}</div> : null}
          </div>
        ))}
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