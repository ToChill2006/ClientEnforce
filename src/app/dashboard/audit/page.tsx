"use client";
import * as React from "react";
import { RejectionBanner } from "@/components/ui/rejection-banner";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-bg-muted)]/70 ${className}`} />;
}

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
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function labelAction(a: string) {
  // keep readable
  return a.replaceAll("_", " ").replaceAll(".", " → ");
}

export default function AuditPage() {
  const [events, setEvents] = React.useState<AuditEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

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

  React.useEffect(() => { load(); }, []);

  return (
    <div className="space-y-5 px-4 sm:px-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Audit</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">All actions performed across your workspace.</p>
        </div>
        <button
          onClick={load}
          className="rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-bg-subtle)]"
        >
          Refresh
        </button>
      </div>

      {/* Mobile card list — visible below sm */}
      <div className="flex flex-col gap-3 sm:hidden">
        {err ? (
          <div className="p-4">
            <RejectionBanner
              kind={/plan|upgrade/i.test(err) ? "plan" : /permission|access/i.test(err) ? "permission" : "error"}
              message={err}
            />
          </div>
        ) : null}

        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)]">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))
        ) : err ? (
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)]">
            <div className="text-sm text-[var(--color-text-muted)]">Audit events are unavailable for this workspace.</div>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)]">
            <div className="text-sm font-medium text-[var(--color-text-primary)]">No activity yet</div>
            <div className="mt-1 text-sm text-[var(--color-text-muted)]">Once you create onboardings, upload files, send links, etc. it'll show up here.</div>
          </div>
        ) : (
          events.map((e) => (
            <div key={e.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)]">
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-medium text-[var(--color-text-primary)]">{labelAction(e.action)}</div>
                <div className="shrink-0 text-xs tabular-nums text-[var(--color-text-muted)]">{formatWhen(e.created_at)}</div>
              </div>
              <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
                <span>{e.actor || e.actor_email || "—"}</span>
                {e.actor_role ? <span className="ml-2 text-xs text-[var(--color-text-muted)]">{e.actor_role}</span> : null}
              </div>
              {(e.entity_type || e.entity_id) ? (
                <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                  {e.entity_type || ""}
                  {e.entity_id ? <span className="ml-1 font-mono">{e.entity_id}</span> : null}
                </div>
              ) : null}
              {e.meta ? (
                <pre className="mt-2 whitespace-pre-wrap break-words rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] p-2 text-xs text-[var(--color-text-muted)]">
                  {JSON.stringify(e.meta, null, 2)}
                </pre>
              ) : null}
            </div>
          ))
        )}
      </div>

      {/* Desktop table — hidden below sm */}
      <div className="hidden sm:block overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
        {err ? (
          <div className="p-4">
            <RejectionBanner
              kind={/plan|upgrade/i.test(err) ? "plan" : /permission|access/i.test(err) ? "permission" : "error"}
              message={err}
            />
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full">
            <thead className="bg-[var(--color-bg-subtle)]">
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">When</th>
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Action</th>
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Actor</th>
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Entity</th>
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))
              ) : err ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10">
                    <div className="text-sm text-[var(--color-text-muted)]">Audit events are unavailable for this workspace.</div>
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10">
                    <div className="text-sm font-medium text-[var(--color-text-primary)]">No activity yet</div>
                    <div className="mt-1 text-sm text-[var(--color-text-muted)]">Once you create onboardings, upload files, send links, etc. it'll show up here.</div>
                  </td>
                </tr>
              ) : (
                events.map((e) => (
                  <tr key={e.id} className="hover:bg-[var(--color-bg-subtle)]">
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] tabular-nums">{formatWhen(e.created_at)}</td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-primary)] font-medium">{labelAction(e.action)}</td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                      <div className="truncate">{e.actor || e.actor_email || "—"}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">{e.actor_role || e.actor_email || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                      <div className="truncate">{e.entity_type || "—"}</div>
                      <div className="text-xs text-[var(--color-text-muted)] truncate">{e.entity_id || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                      <pre className="whitespace-pre-wrap break-words text-xs text-[var(--color-text-muted)]">
                        {e.meta ? JSON.stringify(e.meta, null, 2) : ""}
                      </pre>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
