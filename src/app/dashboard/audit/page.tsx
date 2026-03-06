"use client";
import * as React from "react";

type AuditEvent = {
  id: string;
  action: string;
  entity_type?: string | null;
  entity_id?: string | null;
  onboarding_id?: string | null;
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
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setEvents(json.events ?? []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load audit log");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Audit</h1>
          <p className="mt-1 text-sm text-zinc-500">All actions performed across your workspace.</p>
        </div>
        <button
          onClick={load}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        {err ? (
          <div className="p-4">
            <div className="text-sm font-medium text-zinc-900">Could not load audit</div>
            <div className="mt-1 text-sm text-zinc-500">{err}</div>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full">
            <thead className="bg-zinc-50">
              <tr className="border-b border-zinc-200">
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-zinc-500">When</th>
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Action</th>
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Actor</th>
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Entity</th>
                <th className="px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-zinc-500">Details</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 rounded bg-zinc-100" /></td></tr>
                ))
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10">
                    <div className="text-sm font-medium text-zinc-900">No activity yet</div>
                    <div className="mt-1 text-sm text-zinc-500">Once you create onboardings, upload files, send links, etc. it’ll show up here.</div>
                  </td>
                </tr>
              ) : (
                events.map((e) => (
                  <tr key={e.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 text-sm text-zinc-700 tabular-nums">{formatWhen(e.created_at)}</td>
                    <td className="px-4 py-3 text-sm text-zinc-900 font-medium">{labelAction(e.action)}</td>
                    <td className="px-4 py-3 text-sm text-zinc-700">
                      <div className="truncate">{e.actor_email || "—"}</div>
                      <div className="text-xs text-zinc-500">{e.actor_role || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-700">
                      <div className="truncate">{e.entity_type || "—"}</div>
                      <div className="text-xs text-zinc-500 truncate">{e.entity_id || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-700">
                      <pre className="whitespace-pre-wrap break-words text-xs text-zinc-500">
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