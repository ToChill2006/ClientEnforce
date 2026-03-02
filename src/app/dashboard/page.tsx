// FILE: src/app/dashboard/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";

type MetricsResponse = {
  clients?: number;
  templates?: number;
  onboardings?: number;
  followups_due?: number;

  // Optional shapes (dashboard still works if your API doesn’t return these)
  status_counts?: Record<string, number>;
  recent_onboardings?: Array<{
    id: string;
    title?: string | null;
    client_name?: string | null;
    client_email?: string | null;
    status?: string | null;
    updated_at?: string | null;
  }>;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function statusLabel(raw?: string | null) {
  const s = (raw || "").toLowerCase();
  if (!s) return "Unknown";
  if (s === "draft") return "Draft";
  if (s === "sent") return "Sent";
  if (s === "in_progress" || s === "in progress") return "In progress";
  if (s === "submitted") return "Submitted";
  return raw!;
}

function statusPillClasses(raw?: string | null) {
  const s = (raw || "").toLowerCase();
  // neutral + subtle accents (no bright colors)
  if (s === "submitted") return "bg-zinc-900 text-white border-zinc-900";
  if (s === "in_progress" || s === "in progress") return "bg-white text-zinc-900 border-zinc-300";
  if (s === "sent") return "bg-zinc-50 text-zinc-900 border-zinc-200";
  if (s === "draft") return "bg-white text-zinc-700 border-zinc-200";
  return "bg-white text-zinc-700 border-zinc-200";
}

function MetricCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[12px] font-medium uppercase tracking-wider text-zinc-500">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">{value}</div>
          {hint ? <div className="mt-1 text-sm text-zinc-500">{hint}</div> : null}
        </div>
        <div className="mt-0.5 h-9 w-9 rounded-lg border border-zinc-200 bg-zinc-50" aria-hidden="true" />
      </div>
    </div>
  );

  if (!href) return inner;

  return (
    <Link href={href} className="block focus:outline-none focus:ring-2 focus:ring-zinc-200 rounded-xl">
      <div className="transition hover:border-zinc-300">{inner}</div>
    </Link>
  );
}

function ActionLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-zinc-200",
        variant === "primary"
          ? "bg-zinc-900 text-white hover:bg-zinc-800"
          : "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
      )}
    >
      {children}
    </Link>
  );
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-12 gap-3 px-4 py-3">
      <div className="col-span-4 h-4 rounded bg-zinc-100" />
      <div className="col-span-3 h-4 rounded bg-zinc-100" />
      <div className="col-span-2 h-4 rounded bg-zinc-100" />
      <div className="col-span-3 h-4 rounded bg-zinc-100" />
    </div>
  );
}

export default function DashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [metrics, setMetrics] = React.useState<MetricsResponse | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/dashboard/metrics", {
          method: "GET",
          headers: { "content-type": "application/json" },
          cache: "no-store",
        });

        if (!res.ok) {
          const t = await res.text().catch(() => "");
          throw new Error(t || `Failed to load metrics (${res.status})`);
        }

        const json = (await res.json()) as MetricsResponse;
        if (!cancelled) setMetrics(json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const clients = metrics?.clients ?? 0;
  const templates = metrics?.templates ?? 0;
  const onboardings = metrics?.onboardings ?? 0;
  const followups = metrics?.followups_due ?? 0;

  const statusCounts = metrics?.status_counts ?? {};
  const recent = metrics?.recent_onboardings ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">A compact overview of your workspace.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ActionLink href="/dashboard/onboardings" variant="primary">
            View onboardings
          </ActionLink>
          <ActionLink href="/dashboard/onboardings" variant="secondary">
            New onboarding
          </ActionLink>
          <ActionLink href="/dashboard/settings" variant="secondary">
            Billing &amp; settings
          </ActionLink>
        </div>
      </div>

      {/* Error banner */}
      {error ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="text-sm font-medium text-zinc-900">Could not load dashboard</div>
          <div className="mt-1 text-sm text-zinc-500">{error}</div>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => location.reload()}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200"
            >
              Retry
            </button>
          </div>
        </div>
      ) : null}

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Clients" value={loading ? "—" : clients} href="/dashboard/clients" />
        <MetricCard label="Templates" value={loading ? "—" : templates} href="/dashboard/templates" />
        <MetricCard label="Onboardings" value={loading ? "—" : onboardings} href="/dashboard/onboardings" />
        <MetricCard label="Follow-ups due" value={loading ? "—" : followups} href="/dashboard/settings" />
      </div>

      {/* Two-column: Status + Recent */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Status */}
        <section className="lg:col-span-5">
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-4 py-3">
              <div className="text-sm font-semibold text-zinc-900">Onboarding status</div>
              <div className="mt-0.5 text-sm text-zinc-500">Distribution across lifecycle.</div>
            </div>

            <div className="px-4 py-3">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-4 w-2/3 rounded bg-zinc-100" />
                  <div className="h-4 w-1/2 rounded bg-zinc-100" />
                  <div className="h-4 w-3/5 rounded bg-zinc-100" />
                  <div className="h-4 w-1/3 rounded bg-zinc-100" />
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    { key: "draft", label: "Draft" },
                    { key: "sent", label: "Sent" },
                    { key: "in_progress", label: "In progress" },
                    { key: "submitted", label: "Submitted" },
                  ].map((row) => (
                    <div key={row.key} className="flex items-center justify-between gap-3">
                      <div className="text-sm text-zinc-700">{row.label}</div>
                      <div className="text-sm font-semibold tabular-nums text-zinc-900">
                        {statusCounts[row.key] ?? 0}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <ActionLink href="/dashboard/onboardings" variant="secondary">
                  Open onboardings
                </ActionLink>
              </div>
            </div>
          </div>
        </section>

        {/* Recent onboardings */}
        <section className="lg:col-span-7">
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">Recent onboardings</div>
                  <div className="mt-0.5 text-sm text-zinc-500">Latest activity across your workspace.</div>
                </div>
                <Link
                  href="/dashboard/onboardings"
                  className="text-sm font-medium text-zinc-900 hover:underline"
                >
                  View all
                </Link>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-12 gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-zinc-500">
                  <div className="col-span-4">Client</div>
                  <div className="col-span-4">Title</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Updated</div>
                </div>

                {loading ? (
                  <div className="divide-y divide-zinc-100">
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </div>
                ) : recent.length === 0 ? (
                  <div className="px-4 py-10">
                    <div className="text-sm font-medium text-zinc-900">No onboardings yet</div>
                    <div className="mt-1 text-sm text-zinc-500">
                      Create your first onboarding to start tracking progress and follow-ups.
                    </div>
                    <div className="mt-4">
                      <ActionLink href="/dashboard/onboardings" variant="primary">
                        New onboarding
                      </ActionLink>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100">
                    {recent.slice(0, 6).map((o) => (
                      <Link
                        key={o.id}
                        href={`/dashboard/onboardings/${o.id}`}
                        className="block hover:bg-zinc-50"
                      >
                        <div className="grid grid-cols-12 items-center gap-3 px-4 py-3">
                          <div className="col-span-4 min-w-0">
                            <div className="truncate text-sm font-medium text-zinc-900">
                              {o.client_name || "—"}
                            </div>
                            <div className="truncate text-sm text-zinc-500">{o.client_email || "—"}</div>
                          </div>

                          <div className="col-span-4 min-w-0">
                            <div className="truncate text-sm text-zinc-900">{o.title || "—"}</div>
                          </div>

                          <div className="col-span-2">
                            <span
                              className={cx(
                                "inline-flex items-center rounded-full border px-2 py-0.5 text-[12px] font-medium",
                                statusPillClasses(o.status)
                              )}
                            >
                              {statusLabel(o.status)}
                            </span>
                          </div>

                          <div className="col-span-2 text-right text-sm tabular-nums text-zinc-500">
                            {formatDate(o.updated_at)}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {!loading && recent.length > 0 ? (
              <div className="border-t border-zinc-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-zinc-500">Showing latest {Math.min(6, recent.length)} items</div>
                  <ActionLink href="/dashboard/onboardings" variant="secondary">
                    View all
                  </ActionLink>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}