// FILE: src/app/dashboard/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

type MetricsResponse = {
  clients?: number;
  templates?: number;

  // total onboardings
  onboardings?: number;
  onboardings_total?: number;
  onboardings_count?: number;

  // followups due
  followups_due?: number;
  followups_due_count?: number;
  followupsDueCount?: number;
  followupsDue?: number;
  followupsDueTotal?: number;

  // status counts can come back under various keys
  status_counts?: Record<string, number>;
  onboardings_by_status?: Record<string, number>;
  onboardings_by_status_raw?: Record<string, number>;
  onboarding_status?: Record<string, number>;
  onboardingStatus?: Record<string, number>;
  onboardingStatusCounts?: Record<string, number>;

  recent_onboardings?: Array<{
    id: string;
    title?: string | null;
    name?: string | null;
    onboarding_title?: string | null;
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
  if (s === "locked") return "Submitted";
  return raw!;
}

function statusPillClasses(raw?: string | null) {
  const s = (raw || "").toLowerCase();
  if (s === "submitted" || s === "locked")
    return "bg-[var(--color-success-subtle)] text-[var(--color-success)] border-[var(--color-success-subtle)]";
  if (s === "in_progress" || s === "in progress")
    return "bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border-[var(--color-accent-subtle)]";
  if (s === "sent")
    return "bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)]";
  return "bg-white text-[var(--color-text-muted)] border-[var(--color-border)]";
}

function normalizeOnboardingStatus(metrics: MetricsResponse | null) {
  const by =
    metrics?.onboardings_by_status ??
    metrics?.onboardingStatusCounts ??
    metrics?.onboarding_status ??
    metrics?.onboardingStatus ??
    metrics?.status_counts ??
    {};

  const raw = metrics?.onboardings_by_status_raw ?? {};

  const pickNum = (...vals: any[]) => {
    for (const v of vals) {
      if (typeof v === "number" && Number.isFinite(v)) return v;
    }
    return 0;
  };

  const draft = pickNum((raw as any).draft, (by as any).draft, (by as any)["Draft"]);
  const sent = pickNum((raw as any).sent, (by as any).sent, (by as any)["Sent"]);

  const in_progress = pickNum(
    (raw as any).in_progress,
    (by as any).in_progress,
    (by as any).inProgress,
    (by as any).inprogress,
    (by as any)["In progress"],
    (by as any)["In Progress"],
    (by as any)["in progress"],
    (by as any)["in-progress"]
  );

  const locked = pickNum((raw as any).locked, (by as any).locked, (by as any)["Locked"]);
  const submitted = pickNum((raw as any).submitted, (by as any).submitted, (by as any)["Submitted"]) || locked;

  return { draft, sent, in_progress, submitted, locked };
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
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">{label}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{value}</div>
      {hint ? <div className="mt-1 text-xs text-[var(--color-text-muted)]">{hint}</div> : null}
    </div>
  );

  if (!href) return inner;

  return (
    <Link href={href} className="card-lift block rounded-[var(--radius-lg)] focus:outline-none">
      {inner}
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
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition active:scale-[0.98]",
        variant === "primary"
          ? "bg-[var(--color-accent)] text-white shadow-[var(--shadow-sm)] hover:bg-[var(--color-accent-hover)]"
          : "border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)]"
      )}
    >
      {children}
    </Link>
  );
}

function AnimatedNumber({ value, loading }: { value: number; loading: boolean }) {
  const [display, setDisplay] = React.useState(0);
  const last = React.useRef(0);

  React.useEffect(() => {
    if (loading) {
      setDisplay(0);
      last.current = 0;
      return;
    }

    const start = last.current;
    const end = Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
    const duration = 520;
    const t0 = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = Math.round(start + (end - start) * eased);
      setDisplay(next);
      if (p < 1) raf = window.requestAnimationFrame(tick);
      else last.current = end;
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [loading, value]);

  return loading ? <Skeleton className="mt-2 h-8 w-16" /> : <>{display}</>;
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-12 gap-3 px-4 py-3">
      <div className="col-span-4 h-4 rounded-full bg-[var(--color-bg-muted)]" />
      <div className="col-span-3 h-4 rounded-full bg-[var(--color-bg-muted)]" />
      <div className="col-span-2 h-4 rounded-full bg-[var(--color-bg-muted)]" />
      <div className="col-span-3 h-4 rounded-full bg-[var(--color-bg-muted)]" />
    </div>
  );
}

export default function DashboardPage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [metrics, setMetrics] = React.useState<MetricsResponse | null>(null);
  const [feedbackRating, setFeedbackRating] = React.useState<number | null>(null);
  const [feedbackText, setFeedbackText] = React.useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = React.useState(false);

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

  async function submitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (feedbackRating === null) {
      toast({
        title: "Select a rating first",
        description: "Choose a score from 1 to 5 before sending feedback.",
        variant: "error",
      });
      return;
    }

    setFeedbackSubmitting(true);

    try {
      const res = await fetch("/api/dashboard/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          rating: feedbackRating,
          feedback: feedbackText.trim() || null,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Could not send feedback.");
      }

      toast({
        title: "Feedback received",
        description: "Thanks. This helps us improve the dashboard experience.",
        variant: "success",
      });
      setFeedbackRating(null);
      setFeedbackText("");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Please try again.";
      toast({
        title: "Feedback was not sent",
        description: message,
        variant: "error",
      });
    } finally {
      setFeedbackSubmitting(false);
    }
  }

  const clients = metrics?.clients ?? 0;
  const templates = metrics?.templates ?? 0;
  const onboardings = metrics?.onboardings ?? metrics?.onboardings_total ?? metrics?.onboardings_count ?? 0;
  const followups =
    metrics?.followups_due ??
    metrics?.followups_due_count ??
    metrics?.followupsDueCount ??
    metrics?.followupsDue ??
    metrics?.followupsDueTotal ??
    0;

  const status = normalizeOnboardingStatus(metrics);
  const recent = metrics?.recent_onboardings ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">A compact overview of your workspace.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ActionLink href="/dashboard/onboardings" variant="primary">
            View onboardings
          </ActionLink>
          <ActionLink href="/dashboard/settings" variant="secondary">
            Settings
          </ActionLink>
        </div>
      </div>

      {/* Error banner */}
      {error ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4">
          <div className="text-sm font-semibold text-[var(--color-text-primary)]">Could not load dashboard</div>
          <div className="mt-1 text-sm text-[var(--color-text-secondary)]">{error}</div>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => location.reload()}
              className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
            >
              Retry
            </button>
          </div>
        </div>
      ) : null}

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Clients"
          value={<AnimatedNumber value={clients} loading={loading} />}
          href="/dashboard/clients"
        />
        <MetricCard
          label="Templates"
          value={<AnimatedNumber value={templates} loading={loading} />}
          href="/dashboard/templates"
        />
        <MetricCard
          label="Onboardings"
          value={<AnimatedNumber value={onboardings} loading={loading} />}
          href="/dashboard/onboardings"
        />
        <MetricCard
          label="Follow-ups due"
          value={<AnimatedNumber value={followups} loading={loading} />}
          href="/dashboard/followups"
        />
      </div>

      {/* Two-column: Status + Recent */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Status breakdown */}
        <section className="lg:col-span-4">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--color-border)] px-5 py-4">
              <div className="text-sm font-semibold text-[var(--color-text-primary)]">Onboarding status</div>
              <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">Distribution across lifecycle.</div>
            </div>

            <div className="px-5 py-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 rounded-full bg-[var(--color-bg-muted)]" style={{ width: `${50 + i * 10}%` }} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { key: "draft", label: "Draft" },
                    { key: "sent", label: "Sent" },
                    { key: "in_progress", label: "In progress" },
                    { key: "submitted", label: "Submitted" },
                  ].map((row) => (
                    <div key={row.key} className="flex items-center justify-between gap-3">
                      <div className="text-sm text-[var(--color-text-secondary)]">{row.label}</div>
                      <div className="text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">
                        {(status as any)[row.key] ?? 0}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5">
                <ActionLink href="/dashboard/onboardings" variant="secondary">
                  Open onboardings
                </ActionLink>
              </div>
            </div>
          </div>
        </section>

        {/* Recent onboardings */}
        <section className="lg:col-span-8">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--color-border)] px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-[var(--color-text-primary)]">Recent onboardings</div>
                  <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">Latest activity across your workspace.</div>
                </div>
                <Link
                  href="/dashboard/onboardings"
                  className="text-sm font-semibold text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)]"
                >
                  View all
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[560px]">
                <div className="grid grid-cols-12 gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                  <div className="col-span-4">Client</div>
                  <div className="col-span-4">Title</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Updated</div>
                </div>

                {loading ? (
                  <div className="divide-y divide-[var(--color-border)]">
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </div>
                ) : recent.length === 0 ? (
                  <div className="px-5 py-10">
                    <div className="text-sm font-semibold text-[var(--color-text-primary)]">No onboardings yet</div>
                    <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      Create your first onboarding to start tracking progress and follow-ups.
                    </div>
                    <div className="mt-4">
                      <ActionLink href="/dashboard/onboardings" variant="primary">
                        New onboarding
                      </ActionLink>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--color-border)]">
                    {recent.slice(0, 6).map((o) => (
                      <Link
                        key={o.id}
                        href={`/dashboard/onboardings/${o.id}`}
                        className="block transition hover:bg-[var(--color-bg-subtle)]"
                      >
                        <div className="grid grid-cols-12 items-center gap-3 px-5 py-3">
                          <div className="col-span-4 min-w-0">
                            <div className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                              {o.client_name || "—"}
                            </div>
                            <div className="truncate text-xs text-[var(--color-text-muted)]">{o.client_email || "—"}</div>
                          </div>

                          <div className="col-span-4 min-w-0">
                            <div className="truncate text-sm text-[var(--color-text-secondary)]">
                              {o.title ?? (o as any).name ?? (o as any).onboarding_title ?? "—"}
                            </div>
                          </div>

                          <div className="col-span-2">
                            <span
                              className={cx(
                                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                                statusPillClasses(o.status)
                              )}
                            >
                              {statusLabel(o.status)}
                            </span>
                          </div>

                          <div className="col-span-2 text-right text-xs tabular-nums text-[var(--color-text-muted)]">
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
              <div className="border-t border-[var(--color-border)] px-5 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-[var(--color-text-muted)]">Showing latest {Math.min(6, recent.length)} items</div>
                  <ActionLink href="/dashboard/onboardings" variant="secondary">
                    View all
                  </ActionLink>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {/* Feedback */}
      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
        <div className="border-b border-[var(--color-border)] px-5 py-4">
          <div className="text-sm font-semibold text-[var(--color-text-primary)]">Rate your dashboard experience</div>
          <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">
            Share quick feedback so we can improve ClientEnforce.
          </div>
        </div>

        <form onSubmit={submitFeedback} className="space-y-4 px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFeedbackRating(value)}
                aria-pressed={feedbackRating === value}
                className={cx(
                  "inline-flex h-9 min-w-[36px] items-center justify-center rounded-full border px-3 text-sm font-semibold transition active:scale-[0.98] focus:outline-none",
                  feedbackRating === value
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                    : "border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
                )}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="text-xs text-[var(--color-text-muted)]">1 = Needs work, 5 = Excellent</div>

          <div>
            <label htmlFor="dashboard-feedback" className="text-sm font-medium text-[var(--color-text-primary)]">
              Feedback (optional)
            </label>
            <textarea
              id="dashboard-feedback"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              maxLength={2000}
              placeholder="What would make your dashboard experience better?"
              className="mt-1.5 min-h-24 w-full resize-y rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
            />
            <div className="mt-1 text-right text-xs text-[var(--color-text-muted)]">{feedbackText.length}/2000</div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={feedbackSubmitting || feedbackRating === null}
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98] disabled:opacity-50"
            >
              {feedbackSubmitting ? "Sending..." : "Send feedback"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
