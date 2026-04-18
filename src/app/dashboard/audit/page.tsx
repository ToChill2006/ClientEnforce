"use client";
import * as React from "react";
import { RefreshCw, Search } from "lucide-react";
import { RejectionBanner } from "@/components/ui/rejection-banner";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Tag } from "@/components/ui/status-badge";
import type { StatusTone } from "@/lib/status";

type AuditEvent = {
  id: string;
  action: string;
  entity_type?: string | null;
  entity_id?: string | null;
  onboarding_id?: string | null;
  actor?: string | null;
  actor_email?: string | null;
  actor_role?: string | null;
  meta?: any;
  created_at: string;
};

function formatWhen(v: string) {
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function labelAction(a: string) {
  return a.replaceAll("_", " ").replaceAll(".", " → ");
}

function actionTone(a: string): StatusTone {
  const s = a.toLowerCase();
  if (/delete|remove|revoke|lock/.test(s)) return "danger";
  if (/create|add|invite|new/.test(s)) return "success";
  if (/update|edit|change|rename/.test(s)) return "info";
  if (/send|email|notify/.test(s)) return "accent";
  if (/login|auth|signin/.test(s)) return "warning";
  return "neutral";
}

export default function AuditPage() {
  const [events, setEvents] = React.useState<AuditEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [actionFilter, setActionFilter] = React.useState<string>("all");

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/audit?limit=200", { cache: "no-store" });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const message = String(json?.error ?? "");
        if (res.status === 403) {
          const isPlanRestriction = /current plan|upgrade|not included/i.test(message);
          if (isPlanRestriction) {
            setErr(message || "Audit log is not included in your current plan.");
            setEvents([]);
            return;
          }
          setErr("You do not have permission to view the audit log.");
          setEvents([]);
          return;
        }
        throw new Error(message || "Failed to load audit log");
      }

      setEvents(json?.events ?? []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load audit log");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  const actionOptions = React.useMemo(() => {
    const set = new Set<string>();
    for (const e of events) if (e.action) set.add(e.action);
    return Array.from(set).sort();
  }, [events]);

  const filtered = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return events.filter((e) => {
      if (actionFilter !== "all" && e.action !== actionFilter) return false;
      if (!q) return true;
      const hay = [
        e.action,
        e.actor ?? "",
        e.actor_email ?? "",
        e.entity_type ?? "",
        e.entity_id ?? "",
        e.meta ? JSON.stringify(e.meta) : "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [events, debouncedQuery, actionFilter]);

  const columns: Column<AuditEvent>[] = [
    {
      key: "when",
      header: "When",
      width: "170px",
      sortValue: (r) => new Date(r.created_at).getTime(),
      render: (r) => (
        <span className="text-xs tabular-nums text-[var(--color-text-muted)]">
          {formatWhen(r.created_at)}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      width: "200px",
      sortValue: (r) => r.action,
      render: (r) => <Tag tone={actionTone(r.action)}>{labelAction(r.action)}</Tag>,
    },
    {
      key: "actor",
      header: "Actor",
      hideOnMobile: true,
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm text-[var(--color-text-primary)]">
            {r.actor || r.actor_email || "—"}
          </div>
          {r.actor_role && (
            <div className="truncate text-xs text-[var(--color-text-muted)]">{r.actor_role}</div>
          )}
        </div>
      ),
    },
    {
      key: "entity",
      header: "Entity",
      hideOnMobile: true,
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm text-[var(--color-text-secondary)]">
            {r.entity_type || "—"}
          </div>
          {r.entity_id && (
            <div className="truncate font-mono text-xs text-[var(--color-text-muted)]">
              {r.entity_id}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "details",
      header: "Details",
      hideOnMobile: true,
      render: (r) =>
        r.meta ? (
          <pre className="max-w-md overflow-hidden whitespace-pre-wrap break-words text-xs text-[var(--color-text-muted)]">
            {JSON.stringify(r.meta, null, 2)}
          </pre>
        ) : (
          <span className="text-xs text-[var(--color-text-muted)]">—</span>
        ),
    },
  ];

  const toolbar = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search actions, actors, entities…"
          className="pl-9"
        />
      </div>
      <Select
        value={actionFilter}
        onChange={(e) => setActionFilter(e.target.value)}
        className="sm:w-56"
      >
        <option value="all">All actions</option>
        {actionOptions.map((a) => (
          <option key={a} value={a}>
            {labelAction(a)}
          </option>
        ))}
      </Select>
      <div className="text-xs text-[var(--color-text-muted)] sm:ml-2">
        {loading ? "Loading…" : `${filtered.length} event${filtered.length === 1 ? "" : "s"}`}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit"
        description="All actions performed across your workspace."
        actions={
          <Button
            variant="outline"
            size="sm"
            iconLeft={<RefreshCw className="h-3.5 w-3.5" />}
            onClick={load}
            disabled={loading}
          >
            Refresh
          </Button>
        }
      />

      {err ? (
        <RejectionBanner
          kind={
            /plan|upgrade/i.test(err)
              ? "plan"
              : /permission|access/i.test(err)
              ? "permission"
              : "error"
          }
          message={err}
        />
      ) : (
        <DataTable<AuditEvent>
          columns={columns}
          data={filtered}
          getRowId={(r) => r.id}
          loading={loading}
          toolbar={toolbar}
          defaultSort={{ key: "when", dir: "desc" }}
          csvExport={{ filename: "audit-log" }}
          empty={
            <div className="py-12 text-center">
              <div className="text-sm font-semibold text-[var(--color-text-primary)]">
                No activity yet
              </div>
              <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Once you create onboardings, upload files, send links, etc. it&apos;ll show up here.
              </div>
            </div>
          }
        />
      )}
    </div>
  );
}
