// FILE: src/app/dashboard/onboardings/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RejectionBanner } from "@/components/ui/rejection-banner";

type OnboardingRow = {
  id: string;
  title?: string | null;
  status?: string | null;

  client_name?: string | null;
  client_email?: string | null;

  template_title?: string | null;

  // optional — if your API already returns a link/token, we'll use it
  client_link?: string | null;
  client_token?: string | null;
  token?: string | null;

  owner_id?: string | null;
  owner_name?: string | null;

  updated_at?: string | null;
  created_at?: string | null;
};

type TeamMember = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
};

type ListResponse =
  | { onboardings: OnboardingRow[] }
  | { data: OnboardingRow[] }
  | OnboardingRow[];

// Progress endpoint may return either:
//  - { [onboardingId]: number }
//  - { [onboardingId]: { percent: number, ... } }
//  - wrapped in { progress: ... } or { data: ... }
type ProgressValue = number | { percent?: number | string } | null;
type ProgressResponse = Record<string, ProgressValue>;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function toLocaleDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function statusLabel(raw?: string | null) {
  const s = (raw || "").toLowerCase();
  if (!s) return "Draft";
  if (s === "draft") return "Draft";
  if (s === "sent") return "Sent";
  if (s === "in_progress" || s === "in progress") return "In progress";
  if (s === "submitted") return "Submitted";
  if (s === "locked") return "Submitted";
  if (s === "archived") return "Archived";
  return raw!;
}

function statusKeyForFilter(raw?: string | null) {
  const s = (raw || "").toLowerCase().trim();
  if (!s) return "draft";
  if (s === "in progress") return "in_progress";
  return s;
}

function statusPillClasses(raw?: string | null) {
  const s = (raw || "").toLowerCase();
  // subtle, enterprise
  if (s === "submitted") return "border-[var(--color-success-subtle)] bg-[var(--color-success-subtle)] text-[var(--color-success)]";
  if (s === "locked") return "border-[var(--color-success-subtle)] bg-[var(--color-success-subtle)] text-[var(--color-success)]";
  if (s === "archived") return "border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]";
  if (s === "in_progress" || s === "in progress") return "border-[var(--color-accent-subtle)] bg-[var(--color-accent-subtle)] text-[var(--color-accent)]";
  if (s === "sent") return "border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)]";
  return "border-[var(--color-border)] bg-white text-[var(--color-text-muted)]";
}

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-28 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
        <div className="h-full bg-[var(--color-accent)]" style={{ width: `${v}%` }} />
      </div>
      <div className="w-10 text-right text-xs tabular-nums text-[var(--color-text-secondary)]">{v}%</div>
    </div>
  );
}

function SmallButton({
  children,
  onClick,
  disabled,
  variant = "secondary",
  title,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] px-2.5 py-1 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-subtle)] disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-sm)]",
        variant === "secondary" && "border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] shadow-[var(--shadow-sm)]",
        variant === "ghost" && "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]",
        variant === "danger" && "border border-red-200 bg-white text-red-700 hover:bg-red-50 shadow-[var(--shadow-sm)]"
      )}
    >
      {children}
    </button>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-lg)] max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4 shrink-0">
          <div className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-md)] p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default function OnboardingsPage() {
  const [rows, setRows] = React.useState<OnboardingRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [progress, setProgress] = React.useState<Record<string, number>>({});
  const [progressLoading, setProgressLoading] = React.useState(false);

  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "draft" | "sent" | "in_progress" | "submitted"
  >("all");
  const [ownerFilter, setOwnerFilter] = React.useState<string>("all");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [createErr, setCreateErr] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState("");
  const [clientEmail, setClientEmail] = React.useState("");
  const [clientName, setClientName] = React.useState("");

  const [templates, setTemplates] = React.useState<Array<{ id: string; name: string }>>([]);
  const [clients, setClients] = React.useState<
    Array<{ id: string; email: string; full_name?: string | null; name?: string | null }>
  >([]);
  const [members, setMembers] = React.useState<TeamMember[]>([]);

  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("");
  const [useExistingClient, setUseExistingClient] = React.useState<boolean>(false);
  const [selectedClientId, setSelectedClientId] = React.useState<string>("");
  const [selectedOwnerId, setSelectedOwnerId] = React.useState<string>("");

  const [rowBusy, setRowBusy] = React.useState<Record<string, boolean>>({});
  const [rowAction, setRowAction] = React.useState<Record<string, "copy" | "send" | "lock" | "delete" | null>>({});
  const [banner, setBanner] = React.useState<{ kind: "success" | "error"; msg: string } | null>(null);

  async function load() {
    try {
      setLoading(true);
      setLoadError(null);

      const res = await fetch("/api/onboardings", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Failed to load onboardings (${res.status})`);
      }

      const json = (await res.json()) as any;
      const list: OnboardingRow[] = Array.isArray(json)
        ? json
        : (json.onboardings ?? json.data ?? []) as OnboardingRow[];

      setRows(list);
    } catch (e: any) {
      setLoadError(e?.message || "Failed to load onboardings.");
    } finally {
      setLoading(false);
    }
  }

  async function loadProgress(ids: string[]) {
    const unique = Array.from(new Set(ids.filter(Boolean)));
    if (!unique.length) return;

    try {
      setProgressLoading(true);

      // Do not double-encode commas; Next will decode query params.
      const q = unique.join(",");
      const res = await fetch(`/api/onboardings/progress?ids=${encodeURIComponent(q)}`, {
        cache: "no-store",
      });

      if (!res.ok) return;

      const json = (await res.json().catch(() => null)) as any;
      if (!json) return;

      // Accept multiple shapes:
      // 1) { [id]: number }
      // 2) { progress: { [id]: number } }
      // 3) { data: { [id]: number } }
      const raw: any =
        (json && typeof json === "object" && !Array.isArray(json) && (json.progress ?? json.data)) || json;

      if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;

      const normalized: Record<string, number> = {};
      for (const [k, v] of Object.entries(raw)) {
        // Support: number, string, or object with { percent }
        let candidate: any = v as any;
        if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
          candidate = (candidate as any).percent;
        }

        const n =
          typeof candidate === "number" ? candidate : typeof candidate === "string" ? Number(candidate) : NaN;

        if (!Number.isNaN(n)) normalized[k] = n;
      }

      if (Object.keys(normalized).length) {
        setProgress((prev) => ({ ...prev, ...normalized }));
        setRows((prev) =>
          prev.map((row) => {
            const pct = normalized[row.id];
            if (typeof pct !== "number") return row;
            const key = statusKeyForFilter(row.status);
            if (key === "locked") return row;

            if (pct >= 100 && key !== "submitted") {
              return { ...row, status: "submitted", updated_at: new Date().toISOString() };
            }

            if (pct > 0 && (key === "draft" || key === "sent")) {
              return { ...row, status: "in_progress", updated_at: new Date().toISOString() };
            }

            return row;
          })
        );
      }
    } finally {
      setProgressLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    async function loadMeta() {
      try {
        const [tRes, cRes, mRes] = await Promise.all([
          fetch("/api/templates", { cache: "no-store" }),
          fetch("/api/clients", { cache: "no-store" }),
          fetch("/api/team/members", { cache: "no-store" }),
        ]);

        if (tRes.ok) {
          const tJson = (await tRes.json().catch(() => null)) as any;
          const list = Array.isArray(tJson?.templates)
            ? tJson.templates
            : Array.isArray(tJson?.items)
              ? tJson.items
              : Array.isArray(tJson)
                ? tJson
                : [];

          if (!cancelled) {
            setTemplates(list);
            if (!selectedTemplateId && list?.[0]?.id) setSelectedTemplateId(list[0].id);
          }
        }

        if (cRes.ok) {
          const cJson = (await cRes.json().catch(() => null)) as any;
          const list = Array.isArray(cJson?.clients)
            ? cJson.clients
            : Array.isArray(cJson?.items)
              ? cJson.items
              : Array.isArray(cJson)
                ? cJson
                : [];
          if (!cancelled) setClients(list);
        }

        if (mRes.ok) {
          const mJson = (await mRes.json().catch(() => null)) as any;
          const list = Array.isArray(mJson?.members) ? mJson.members : [];
          if (!cancelled) setMembers(list);
        }
      } catch {
        // ignore – manual entry still works
      }
    }

    loadMeta();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preserve client-side progress fetching logic: GET /api/onboardings/progress?ids=...
  React.useEffect(() => {
    const ids = rows.map((r) => r.id).filter(Boolean);
    if (!ids.length) return;

    loadProgress(ids);

    const t = window.setInterval(() => loadProgress(ids), 30_000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.map((r) => r.id).join(",")]);

  const list = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const filtered = rows.filter((r) => {
      const sk = statusKeyForFilter(r.status);
      const statusOk = statusFilter === "all" ? true : sk === statusFilter;
      const ownerOk = ownerFilter === "all" ? true : (ownerFilter === "unassigned" ? !r.owner_id : r.owner_id === ownerFilter);
      if (!q) return statusOk && ownerOk;
      const hay = [
        r.title ?? "",
        r.client_name ?? "",
        r.client_email ?? "",
        r.template_title ?? "",
        r.owner_name ?? "",
        statusLabel(r.status),
      ]
        .join(" ")
        .toLowerCase();
      return statusOk && ownerOk && hay.includes(q);
    });
    return filtered.sort((a, b) => {
      const ta = new Date(a.updated_at || a.created_at || 0).getTime();
      const tb = new Date(b.updated_at || b.created_at || 0).getTime();
      return tb - ta;
    });
  }, [rows, debouncedQuery, statusFilter, ownerFilter]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateErr(null);

    const t = title.trim();
    const em = clientEmail.trim();
    const nm = clientName.trim();

    if (!t) {
      setCreateErr("Title is required.");
      return;
    }

    if (useExistingClient) {
      if (!selectedClientId) {
        setCreateErr("Select an existing client.");
        return;
      }

      // Name is now required. If the selected client has no name, block creation.
      if (!nm) {
        setCreateErr("Selected client is missing a name. Add a name or choose a different client.");
        return;
      }
    } else {
      if (!em) {
        setCreateErr("Client email is required.");
        return;
      }

      if (!nm) {
        setCreateErr("Client full name is required.");
        return;
      }
    }

    try {
      setCreating(true);

      const res = await fetch("/api/onboardings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: t,
          template_id: selectedTemplateId || null,
          owner_id: selectedOwnerId || null,
          client: useExistingClient
            ? { id: selectedClientId }
            : { email: em, full_name: nm || null },
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Create failed (${res.status})`);
      }

      const json = await res.json().catch(() => null) as any;

      setCreateOpen(false);
      setTitle("");
      setClientEmail("");
      setClientName("");
      setUseExistingClient(false);
      setSelectedClientId("");
      setSelectedOwnerId("");
      // keep selectedTemplateId so the next onboarding uses the same template

      const created = (json?.item ?? json?.onboarding ?? null) as OnboardingRow | null;

      if (created?.id) {
        setRows((prev) => {
          const next = [created, ...prev.filter((x) => x.id !== created.id)];
          return next;
        });
        if (created.id) void loadProgress([created.id]);
      } else {
        await load();
      }

      setBanner({ kind: "success", msg: "Onboarding created." });
    } catch (err: any) {
      setCreateErr(err?.message || "Failed to create onboarding.");
    } finally {
      setCreating(false);
    }
  }

  function getClientLink(row: OnboardingRow): string | null {
    // client_link is now built server-side with the correct custom domain
    if (row.client_link) return row.client_link;
    if (row.client_token) return `${window.location.origin}/c/${row.client_token}`;
    if (row.token) return `${window.location.origin}/c/${row.token}`;
    return null;
  }

  async function copyLink(row: OnboardingRow) {
    setRowBusy((p) => ({ ...p, [row.id]: true }));
    setRowAction((p) => ({ ...p, [row.id]: "copy" }));
    try {
      const link = await getClientLink(row);
      if (!link) throw new Error("Client link not available on this onboarding record.");
      await navigator.clipboard.writeText(link);
      setBanner({ kind: "success", msg: "Client link copied." });
    } catch (e: any) {
      setBanner({ kind: "error", msg: e?.message || "Copy failed." });
    } finally {
      setRowBusy((p) => ({ ...p, [row.id]: false }));
      setRowAction((p) => ({ ...p, [row.id]: null }));
    }
  }

  async function sendEmail(row: OnboardingRow) {
    setRowBusy((p) => ({ ...p, [row.id]: true }));
    setRowAction((p) => ({ ...p, [row.id]: "send" }));
    try {
      const res = await fetch("/api/onboardings/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ onboarding_id: row.id, id: row.id }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Send failed (${res.status})`);
      }

      await res.json().catch(() => null);
      setRows((prev) =>
        prev.map((x) =>
          x.id === row.id
            ? {
                ...x,
                status: "sent",
                updated_at: new Date().toISOString(),
              }
            : x
        )
      );
      setBanner({ kind: "success", msg: "Email sent." });
    } catch (e: any) {
      setBanner({ kind: "error", msg: e?.message || "Send failed." });
    } finally {
      setRowBusy((p) => ({ ...p, [row.id]: false }));
      setRowAction((p) => ({ ...p, [row.id]: null }));
    }
  }

  async function lock(row: OnboardingRow) {
    setRowBusy((p) => ({ ...p, [row.id]: true }));
    setRowAction((p) => ({ ...p, [row.id]: "lock" }));
    try {
      const res = await fetch("/api/onboardings/lock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: row.id }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Lock failed (${res.status})`);
      }

      await res.json().catch(() => null);
      setRows((prev) =>
        prev.map((x) =>
          x.id === row.id
            ? {
                ...x,
                status: "locked",
                updated_at: new Date().toISOString(),
              }
            : x
        )
      );
      setBanner({ kind: "success", msg: "Onboarding locked." });
    } catch (e: any) {
      setBanner({ kind: "error", msg: e?.message || "Lock failed." });
    } finally {
      setRowBusy((p) => ({ ...p, [row.id]: false }));
      setRowAction((p) => ({ ...p, [row.id]: null }));
    }
  }


  async function deleteOnboarding(row: OnboardingRow) {
    const ok = window.confirm(
      `Delete onboarding "${row.title || "Untitled"}"? This cannot be undone.`
    );
    if (!ok) return;

    setRowBusy((p) => ({ ...p, [row.id]: true }));
    setRowAction((p) => ({ ...p, [row.id]: "delete" }));
    try {
      const res = await fetch(`/api/onboardings/${encodeURIComponent(row.id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Delete failed (${res.status})`);
      }

      setRows((prev) => prev.filter((x) => x.id !== row.id));
      setBanner({ kind: "success", msg: "Onboarding deleted." });
    } catch (e: any) {
      setBanner({ kind: "error", msg: e?.message || "Delete failed." });
    } finally {
      setRowBusy((p) => ({ ...p, [row.id]: false }));
      setRowAction((p) => ({ ...p, [row.id]: null }));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Onboardings</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Create, track, and send client onboarding links. Progress updates automatically.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <SmallButton variant="primary" onClick={() => setCreateOpen(true)}>
            New onboarding
          </SmallButton>
          <SmallButton variant="secondary" onClick={() => load()} disabled={loading}>
            Refresh
          </SmallButton>
        </div>
      </div>

      {banner ? (
        banner.kind === "success" ? (
          <div className="rounded-[var(--radius-lg)] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <div className="flex items-start justify-between gap-3">
              <div>{banner.msg}</div>
              <button
                type="button"
                onClick={() => setBanner(null)}
                className="rounded-md px-2 py-1 text-emerald-700 hover:bg-emerald-100"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <RejectionBanner
            kind={
              /plan|upgrade/i.test(banner.msg)
                ? "plan"
                : /permission|required/i.test(banner.msg)
                  ? "permission"
                  : "error"
            }
            message={banner.msg}
            onDismiss={() => setBanner(null)}
            className="rounded-[var(--radius-lg)]"
          />
        )
      ) : null}

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-3 shadow-[var(--shadow-sm)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                Search
              </label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, client name/email, template…"
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] shadow-[var(--shadow-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
              />
            </div>

            <div className="w-full sm:w-44">
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="in_progress">In progress</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>

            <div className="w-full sm:w-44">
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                Owner
              </label>
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
              >
                <option value="all">All owners</option>
                <option value="unassigned">Unassigned</option>
                {members.map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {(m.full_name || m.email || m.user_id).trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <div className="text-sm text-[var(--color-text-muted)]">
              {loading ? "Loading…" : `${list.length} onboarding${list.length === 1 ? "" : "s"}`}
              {progressLoading ? <span className="ml-2 text-xs text-[var(--color-text-muted)]">Updating progress…</span> : null}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile card list — visible below sm breakpoint */}
      <div className="sm:hidden divide-y divide-[var(--color-border)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)] overflow-hidden">
        {loadError ? (
          <div className="px-4 py-8">
            <div className="text-sm font-medium text-[var(--color-text-primary)]">Could not load onboardings</div>
            <div className="mt-1 text-sm text-[var(--color-text-muted)]">{loadError}</div>
            <div className="mt-3">
              <SmallButton variant="secondary" onClick={() => load()}>Retry</SmallButton>
            </div>
          </div>
        ) : loading ? (
          <div className="space-y-0 divide-y divide-[var(--color-border)]">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-4 py-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="px-4 py-10">
            <div className="text-sm font-medium text-[var(--color-text-primary)]">No onboardings found</div>
            <div className="mt-1 text-sm text-[var(--color-text-muted)]">
              Create a new onboarding to start collecting requirements, uploads, and signatures.
            </div>
            <div className="mt-4">
              <SmallButton variant="primary" onClick={() => setCreateOpen(true)}>Create onboarding</SmallButton>
            </div>
          </div>
        ) : (
          list.map((r) => {
            const pct = progress[r.id] ?? 0;
            const busy = !!rowBusy[r.id];
            const action = rowAction[r.id] ?? null;
            const sKey = statusKeyForFilter(r.status);
            return (
              <div key={r.id} className="px-4 py-4 space-y-2">
                {/* Top row: client name + status badge */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                      {r.client_name || "—"}
                    </div>
                    {r.client_email ? (
                      <div className="truncate text-xs text-[var(--color-text-muted)]">{r.client_email}</div>
                    ) : null}
                  </div>
                  <span
                    className={cx(
                      "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                      statusPillClasses(r.status)
                    )}
                  >
                    {statusLabel(r.status)}
                  </span>
                </div>

                {/* Onboarding title */}
                <div className="truncate text-sm text-[var(--color-text-secondary)]">
                  {r.title || "—"}
                </div>

                {/* Owner */}
                {r.owner_name ? (
                  <div className="truncate text-xs text-[var(--color-text-muted)]">
                    Owner: {r.owner_name}
                  </div>
                ) : null}

                {/* Progress bar */}
                <ProgressBar value={pct} />

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Link
                    href={`/dashboard/onboardings/${r.id}`}
                    prefetch={false}
                    className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-2.5 py-1.5 text-sm font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-bg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
                  >
                    View
                  </Link>
                  <SmallButton variant="secondary" onClick={() => copyLink(r)} disabled={busy} title="Copy link">
                    {busy && action === "copy" ? "Copying..." : "Copy link"}
                  </SmallButton>
                  {sKey !== "submitted" && sKey !== "locked" ? (
                    <SmallButton variant="secondary" onClick={() => sendEmail(r)} disabled={busy} title="Send email">
                      {busy && action === "send" ? "Sending..." : "Send"}
                    </SmallButton>
                  ) : null}
                  {sKey === "submitted" ? (
                    <SmallButton variant="secondary" onClick={() => lock(r)} disabled={busy} title="Lock submission">
                      {busy && action === "lock" ? "Locking..." : "Lock"}
                    </SmallButton>
                  ) : null}
                  <SmallButton variant="danger" onClick={() => deleteOnboarding(r)} disabled={busy} title="Delete onboarding">
                    {busy && action === "delete" ? "Deleting..." : "Delete"}
                  </SmallButton>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop table — hidden on mobile */}
      <div className="hidden sm:block overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full border-collapse">
            <thead className="bg-[var(--color-bg-subtle)]">
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Client
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Template
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Owner
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Progress
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Updated
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--color-border)]">
              {loadError ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8">
                    <div className="text-sm font-medium text-[var(--color-text-primary)]">Could not load onboardings</div>
                    <div className="mt-1 text-sm text-[var(--color-text-muted)]">{loadError}</div>
                    <div className="mt-3">
                      <SmallButton variant="secondary" onClick={() => load()}>
                        Retry
                      </SmallButton>
                    </div>
                  </td>
                </tr>
              ) : loading ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={8} className="px-4 py-3">
                        <div className="grid grid-cols-12 gap-3">
                          <Skeleton className="col-span-3 h-4 w-full" />
                          <Skeleton className="col-span-2 h-4 w-full" />
                          <Skeleton className="col-span-2 h-4 w-full" />
                          <Skeleton className="col-span-1 h-4 w-full" />
                          <Skeleton className="col-span-2 h-4 w-full" />
                          <Skeleton className="col-span-2 h-4 w-full" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : list.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10">
                    <div className="text-sm font-medium text-[var(--color-text-primary)]">No onboardings found</div>
                    <div className="mt-1 text-sm text-[var(--color-text-muted)]">
                      Create a new onboarding to start collecting requirements, uploads, and signatures.
                    </div>
                    <div className="mt-4">
                      <SmallButton variant="primary" onClick={() => setCreateOpen(true)}>
                        Create onboarding
                      </SmallButton>
                    </div>
                  </td>
                </tr>
              ) : (
                list.map((r) => {
                  const pct = progress[r.id] ?? 0;
                  const busy = !!rowBusy[r.id];
                  const action = rowAction[r.id] ?? null;
                  const sKey = statusKeyForFilter(r.status);

                  return (
                    <tr key={r.id} className="transition-colors duration-150 hover:bg-[var(--color-bg-subtle)]">
                      <td className="px-4 py-4 align-middle">
                        <div className="min-w-0">
                          <div className="truncate text-sm text-[var(--color-text-secondary)] max-w-[260px]">{r.title || "—"}</div>
                        </div>
                      </td>

                      <td className="px-4 py-4 align-middle">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                            {r.client_name || "—"}
                          </div>
                          <div className="truncate text-xs text-[var(--color-text-muted)] mt-0.5">{r.client_email || "—"}</div>
                        </div>
                      </td>

                      <td className="px-4 py-4 align-middle">
                        <div className="truncate text-sm text-[var(--color-text-secondary)]">{r.template_title || "Default"}</div>
                      </td>

                      <td className="px-4 py-4 align-middle">
                        <div className="truncate text-sm text-[var(--color-text-secondary)]">
                          {r.owner_name || "—"}
                        </div>
                      </td>

                      <td className="px-4 py-4 align-middle">
                        <span
                          className={cx(
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                            statusPillClasses(r.status)
                          )}
                        >
                          {statusLabel(r.status)}
                        </span>
                      </td>

                      <td className="px-4 py-4 align-middle">
                        <ProgressBar value={pct} />
                      </td>

                      <td className="px-4 py-4 align-middle text-right text-xs tabular-nums text-[var(--color-text-muted)]">
                        {toLocaleDate(r.updated_at || r.created_at)}
                      </td>

                      <td className="px-4 py-4 align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/dashboard/onboardings/${r.id}`}
                            prefetch
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-bg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
                          >
                            View
                          </Link>

                          <SmallButton variant="secondary" onClick={() => copyLink(r)} disabled={busy} title="Copy link">
                            {busy && action === "copy" ? "Copying..." : "Copy link"}
                          </SmallButton>

                          {sKey !== "submitted" && sKey !== "locked" ? (
                            <SmallButton variant="secondary" onClick={() => sendEmail(r)} disabled={busy} title="Send email">
                              {busy && action === "send" ? "Sending..." : "Send"}
                            </SmallButton>
                          ) : null}

                          {sKey === "submitted" ? (
                            <SmallButton variant="secondary" onClick={() => lock(r)} disabled={busy} title="Lock submission">
                              {busy && action === "lock" ? "Locking..." : "Lock"}
                            </SmallButton>
                          ) : null}

                          <SmallButton variant="danger" onClick={() => deleteOnboarding(r)} disabled={busy} title="Delete onboarding">
                            {busy && action === "delete" ? "Deleting..." : "Delete"}
                          </SmallButton>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && !loadError ? (
          <div className="flex items-center justify-end border-t border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
            <div className="flex items-center gap-2">
              <SmallButton variant="secondary" onClick={() => load()} disabled={loading}>
                Refresh list
              </SmallButton>
              <SmallButton variant="primary" onClick={() => setCreateOpen(true)}>
                New onboarding
              </SmallButton>
            </div>
          </div>
        ) : null}
      </div>{/* end hidden sm:block desktop table wrapper */}

      {/* Floating action button — mobile only */}
      <div className="fixed bottom-4 right-4 z-20 sm:hidden">
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-lg transition hover:bg-[var(--color-accent-hover)]"
          aria-label="New onboarding"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New onboarding">
        <form onSubmit={handleCreate} className="space-y-4">
          {/* Template */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]">Template</label>
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
            >
              {templates.length === 0 ? (
                <option value="" disabled>
                  No templates
                </option>
              ) : (
                templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Owner */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]">Owner</label>
            <select
              value={selectedOwnerId}
              onChange={(e) => setSelectedOwnerId(e.target.value)}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
            >
              <option value="">Unassigned</option>
              {members.map((m) => {
                const label = (m.full_name || m.email || m.user_id).trim();
                return (
                  <option key={m.user_id} value={m.user_id}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Existing client toggle */}
          <div className="flex items-center gap-2">
            <input
              id="useExistingClient"
              type="checkbox"
              className="h-4 w-4"
              checked={useExistingClient}
              onChange={(e) => {
                const on = e.target.checked;
                setUseExistingClient(on);
                if (!on) setSelectedClientId("");
              }}
            />
            <label htmlFor="useExistingClient" className="text-sm text-[var(--color-text-primary)]">
              Use existing client
            </label>
          </div>

          {useExistingClient ? (
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]">Client</label>
              <select
                value={selectedClientId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedClientId(id);
                  const c = clients.find((x) => x.id === id);
                  if (c) {
                    const nm = ((c.full_name ?? c.name ?? "") as string).trim();
                    setClientEmail(c.email);
                    // Keep empty if missing so validation can catch it (name is required)
                    setClientName(nm);
                  }
                }}
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
              >
                <option value="">Select a client</option>
                {clients.map((c) => {
                  const nm = ((c.full_name ?? c.name ?? "") as string).trim();
                  const label = `${nm || "Unnamed"} — ${c.email}`;
                  return (
                    <option key={c.id} value={c.id}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : null}

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ACME — March onboarding"
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] shadow-[var(--shadow-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]">Client email</label>
            <input
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@company.com"
              inputMode="email"
              required={!useExistingClient}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] shadow-[var(--shadow-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
              disabled={useExistingClient}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-text-primary)]">Client full name</label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Jane Doe"
              required={!useExistingClient}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] shadow-[var(--shadow-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
              disabled={useExistingClient}
            />
          </div>

          {createErr ? (
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2 text-sm text-[var(--color-text-primary)]">
              {createErr}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <SmallButton variant="secondary" onClick={() => setCreateOpen(false)} disabled={creating}>
              Cancel
            </SmallButton>
            <SmallButton variant="primary" type="submit" disabled={creating}>
              {creating ? "Creating…" : "Create onboarding"}
            </SmallButton>
          </div>
        </form>
      </Modal>

    </div>
  );
}
