"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, FileText, Users, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Kbd, useModifierLabel } from "@/components/ui/kbd";
import { supabaseBrowser } from "@/lib/supabase";

export type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  href?: string;
  onSelect?: () => void;
  keywords?: string[];
  icon?: React.ReactNode;
  shortcut?: string;
};

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  registerItems: (key: string, items: CommandItem[]) => () => void;
};

const CommandCtx = React.createContext<Ctx | null>(null);

// Session-level cache for recent domain items, populated once per page session.
type DomainCache = {
  loaded: boolean;
  loading: Promise<void> | null;
  onboardings: CommandItem[];
  clients: CommandItem[];
};
const domainCache: DomainCache = {
  loaded: false,
  loading: null,
  onboardings: [],
  clients: [],
};

async function loadDomainCache() {
  if (domainCache.loaded) return;
  if (domainCache.loading) return domainCache.loading;
  domainCache.loading = (async () => {
    try {
      const sb = supabaseBrowser();
      const [onRes, clRes] = await Promise.all([
        sb
          .from("onboardings")
          .select("id,title,client_name,client_email,status,updated_at")
          .order("updated_at", { ascending: false })
          .limit(10),
        sb
          .from("clients")
          .select("id,name,email,company,updated_at")
          .order("updated_at", { ascending: false })
          .limit(10),
      ]);
      domainCache.onboardings = (onRes.data ?? []).map((r: any) => ({
        id: `ob:${r.id}`,
        label: r.title || "Untitled onboarding",
        hint: r.client_name || r.client_email || undefined,
        group: "Onboardings",
        href: `/dashboard/onboardings/${r.id}`,
        keywords: [r.client_name, r.client_email, r.status].filter(Boolean) as string[],
        icon: <FileText className="h-3.5 w-3.5" />,
      }));
      domainCache.clients = (clRes.data ?? []).map((r: any) => ({
        id: `cl:${r.id}`,
        label: r.name || r.email || "Untitled client",
        hint: r.company || r.email || undefined,
        group: "Clients",
        href: `/dashboard/clients?id=${r.id}`,
        keywords: [r.email, r.company].filter(Boolean) as string[],
        icon: <Users className="h-3.5 w-3.5" />,
      }));
      domainCache.loaded = true;
    } catch {
      // leave as empty; allow retry on next open
    } finally {
      domainCache.loading = null;
    }
  })();
  return domainCache.loading;
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [groups, setGroups] = React.useState<Record<string, CommandItem[]>>({});

  const registerItems = React.useCallback((key: string, items: CommandItem[]) => {
    setGroups((prev) => ({ ...prev, [key]: items }));
    return () => {
      setGroups((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    };
  }, []);

  // Global shortcut Cmd/Ctrl+K
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items = React.useMemo(() => {
    const all: CommandItem[] = [];
    for (const k of Object.keys(groups)) all.push(...groups[k]);
    return all;
  }, [groups]);

  return (
    <CommandCtx.Provider value={{ open, setOpen, registerItems }}>
      {children}
      <CommandPaletteUI open={open} onClose={() => setOpen(false)} items={items} />
    </CommandCtx.Provider>
  );
}

export function useCommandPalette() {
  const ctx = React.useContext(CommandCtx);
  if (!ctx) throw new Error("useCommandPalette must be inside CommandPaletteProvider");
  return ctx;
}

/** Register a set of commands while the component is mounted. */
export function useRegisterCommands(key: string, items: CommandItem[]) {
  const ctx = React.useContext(CommandCtx);
  React.useEffect(() => {
    if (!ctx) return;
    return ctx.registerItems(key, items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, JSON.stringify(items.map((i) => ({ id: i.id, label: i.label, href: i.href })))]);
}

function CommandPaletteUI({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
}) {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [cursor, setCursor] = React.useState(0);
  const [domainLoading, setDomainLoading] = React.useState(false);
  const [domainTick, setDomainTick] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Load recent onboardings + clients once per session on first open
  React.useEffect(() => {
    if (!open) return;
    if (domainCache.loaded) {
      setDomainTick((t) => t + 1);
      return;
    }
    let cancelled = false;
    setDomainLoading(true);
    loadDomainCache()?.finally(() => {
      if (cancelled) return;
      setDomainLoading(false);
      setDomainTick((t) => t + 1);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const matches = React.useCallback((it: CommandItem, q: string) => {
    if (!q) return true;
    const hay = [it.label, it.hint, it.group, ...(it.keywords ?? [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  }, []);

  const combined = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const actionItems = items
      .filter((it) => matches(it, q))
      .map((it) => ({ ...it, group: it.group ?? "Actions" }));
    const onboardingItems = domainCache.onboardings.filter((it) => matches(it, q));
    const clientItems = domainCache.clients.filter((it) => matches(it, q));
    return [...actionItems, ...onboardingItems, ...clientItems];
    // domainTick forces recompute when cache populates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, query, matches, domainTick]);

  const grouped = React.useMemo(() => {
    const out: Record<string, CommandItem[]> = {};
    for (const it of combined) {
      const g = it.group ?? "Actions";
      (out[g] ??= []).push(it);
    }
    return out;
  }, [combined]);

  const flat = combined;

  React.useEffect(() => {
    if (cursor > flat.length - 1) setCursor(0);
  }, [flat.length, cursor]);

  const select = (item: CommandItem) => {
    onClose();
    if (item.onSelect) return item.onSelect();
    if (item.href) router.push(item.href);
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[10vh]">
      <div className="fixed inset-0 bg-[var(--color-overlay)] animate-overlay-in" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-xl overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-panel)] shadow-[var(--shadow-xl)] animate-dialog-in"
      >
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-3">
          <Search className="h-4 w-4 text-[var(--color-text-muted)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(flat.length - 1, c + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(0, c - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                const it = flat[cursor];
                if (it) select(it);
              } else if (e.key === "Escape") {
                onClose();
              }
            }}
            placeholder="Search or run a command…"
            className="h-12 flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
          />
          <Kbd>ESC</Kbd>
        </div>
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-1.5">
          {flat.length === 0 && !domainLoading ? (
            <div className="px-4 py-10 text-center text-xs text-[var(--color-text-muted)]">
              No results
            </div>
          ) : flat.length === 0 && domainLoading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-10 text-xs text-[var(--color-text-muted)]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching…
            </div>
          ) : (
            (() => {
              const order = ["Actions", "Navigate", "Onboardings", "Clients"];
              const extras = Object.keys(grouped).filter((k) => !order.includes(k));
              return [...order, ...extras]
                .filter((g) => grouped[g] && grouped[g].length > 0)
                .map((group) => [group, grouped[group]] as [string, CommandItem[]]);
            })().map(([group, groupItems]) => (
              <div key={group} className="mb-1.5">
                <div className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  {group}
                </div>
                {groupItems.map((it) => {
                  const globalIndex = flat.indexOf(it);
                  const active = globalIndex === cursor;
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onMouseEnter={() => setCursor(globalIndex)}
                      onClick={() => select(it)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-2.5 py-2 text-left text-sm",
                        active ? "bg-[var(--color-bg-hover)]" : "hover:bg-[var(--color-bg-hover)]"
                      )}
                    >
                      <span className="shrink-0 text-[var(--color-text-muted)]">
                        {it.icon ?? <ArrowRight className="h-3.5 w-3.5" />}
                      </span>
                      <span className="flex-1 truncate">
                        <span className="font-medium text-[var(--color-text-primary)]">{it.label}</span>
                        {it.hint && (
                          <span className="ml-2 text-xs text-[var(--color-text-muted)]">{it.hint}</span>
                        )}
                      </span>
                      {it.shortcut && (
                        <span className="shrink-0 text-[10px] text-[var(--color-text-muted)]">{it.shortcut}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-[var(--color-border)] px-3 py-2 text-[10px] text-[var(--color-text-muted)]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <Kbd>↵</Kbd>
              <span>select</span>
            </span>
          </div>
          <span>Command palette</span>
        </div>
      </div>
    </div>,
    document.body
  );
}

/** Convenience — renders the Cmd+K trigger button used in the top bar. */
export function CommandPaletteTrigger({ className = "" }: { className?: string }) {
  const { setOpen } = useCommandPalette();
  const mod = useModifierLabel();
  return (
    <button
      onClick={() => setOpen(true)}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-2.5 text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]",
        className
      )}
    >
      <Search className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Search</span>
      <span className="hidden rounded-[var(--radius-xs)] border border-[var(--color-border)] bg-[var(--color-bg-muted)] px-1.5 py-px text-[10px] font-medium sm:inline-block">
        {mod}K
      </span>
    </button>
  );
}
