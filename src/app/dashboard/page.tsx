"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Settings as SettingsIcon, Users, LayoutTemplate, ClipboardList, Bell, ArrowRight, CalendarDays, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";
import { normalizeStatus, type OnboardingStatus } from "@/lib/status";
import { cn } from "@/lib/cn";
import { DeadlineBadge } from "@/components/ui/deadline-badge";

type RecentOnboarding = {
  id: string;
  title?: string | null;
  name?: string | null;
  onboarding_title?: string | null;
  client_name?: string | null;
  client_email?: string | null;
  status?: string | null;
  updated_at?: string | null;
};

type EventSummary = {
  id: string;
  name: string;
  end_date: string | null;
  submission_deadline?: string | null;
  location: string | null;
  status: string;
  exhibitor_count: number;
  phase_status_counts: Record<string, number>;
};

type MetricsResponse = {
  clients?: number;
  templates?: number;
  onboardings?: number;
  onboardings_total?: number;
  onboardings_count?: number;
  followups_due?: number;
  followups_due_count?: number;
  followupsDueCount?: number;
  followupsDue?: number;
  followupsDueTotal?: number;
  status_counts?: Record<string, number>;
  onboardings_by_status?: Record<string, number>;
  onboardings_by_status_raw?: Record<string, number>;
  onboarding_status?: Record<string, number>;
  onboardingStatus?: Record<string, number>;
  onboardingStatusCounts?: Record<string, number>;
  recent_onboardings?: RecentOnboarding[];
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
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
  const pick = (...vals: any[]) => {
    for (const v of vals) if (typeof v === "number" && Number.isFinite(v)) return v;
    return 0;
  };
  const draft = pick((raw as any).draft, (by as any).draft, (by as any)["Draft"]);
  const sent = pick((raw as any).sent, (by as any).sent, (by as any)["Sent"]);
  const in_progress = pick(
    (raw as any).in_progress,
    (by as any).in_progress,
    (by as any).inProgress,
    (by as any)["In progress"]
  );
  const locked = pick((raw as any).locked, (by as any).locked);
  const submitted = pick((raw as any).submitted, (by as any).submitted) || locked;
  return { draft, sent, in_progress, submitted };
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
      setDisplay(Math.round(start + (end - start) * eased));
      if (p < 1) raf = window.requestAnimationFrame(tick);
      else last.current = end;
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [loading, value]);

  if (loading) return <Skeleton className="h-8 w-16" />;
  return <>{display.toLocaleString()}</>;
}

function MetricCard({
  label,
  value,
  href,
  icon: Icon,
  loading,
  delta,
}: {
  label: string;
  value: number;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  loading: boolean;
  delta?: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4 transition hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-sm)]"
    >
      <div className="flex items-start justify-between">
        <div className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </div>
        <Icon className="h-4 w-4 text-[var(--color-text-muted)] transition group-hover:text-[var(--color-accent)]" />
      </div>
      <div
        className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] tabular-nums"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <AnimatedNumber value={value} loading={loading} />
      </div>
      {delta && <div className="mt-1 text-[11px] text-[var(--color-text-muted)]">{delta}</div>}
    </Link>
  );
}

function StatusBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-[var(--color-text-secondary)]">{label}</span>
        <span className="tabular-nums text-[var(--color-text-primary)]">
          <span className="font-semibold">{count}</span>
          <span className="ml-1.5 text-xs text-[var(--color-text-muted)]">{pct}%</span>
        </span>
      </div>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
        <div
          className="h-full rounded-full bg-[var(--color-accent)]"
          style={{ width: `${pct}%`, transition: "width 420ms var(--ease-emphasized)" }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [metrics, setMetrics] = React.useState<MetricsResponse | null>(null);
  const [events, setEvents] = React.useState<EventSummary[]>([]);
  const [feedbackRating, setFeedbackRating] = React.useState<number | null>(null);
  const [feedbackText, setFeedbackText] = React.useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        setError(null);
        const [metricsRes, eventsRes] = await Promise.all([
          fetch("/api/dashboard/metrics", { cache: "no-store" }),
          fetch("/api/events", { cache: "no-store" }),
        ]);
        if (!metricsRes.ok) {
          const t = await metricsRes.text().catch(() => "");
          throw new Error(t || `Failed to load metrics (${metricsRes.status})`);
        }
        const json = (await metricsRes.json()) as MetricsResponse;
        if (!cancelled) setMetrics(json);
        if (eventsRes.ok) {
          const evJson = await eventsRes.json();
          if (!cancelled) setEvents(evJson.events ?? []);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, []);

  async function submitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (feedbackRating === null) {
      toast({ title: "Select a rating first", variant: "error" });
      return;
    }
    setFeedbackSubmitting(true);
    try {
      const res = await fetch("/api/dashboard/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rating: feedbackRating, feedback: feedbackText.trim() || null }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Could not send feedback.");
      }
      toast({ title: "Feedback received", description: "Thanks — this helps us improve.", variant: "success" });
      setFeedbackRating(null);
      setFeedbackText("");
    } catch (e: unknown) {
      toast({
        title: "Feedback was not sent",
        description: e instanceof Error ? e.message : "Please try again.",
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
  const statusTotal = status.draft + status.sent + status.in_progress + status.submitted;
  const recent = metrics?.recent_onboardings ?? [];

  const recentColumns: Column<RecentOnboarding>[] = [
    {
      key: "client",
      header: "Client",
      render: (row) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-[var(--color-text-primary)]">
            {row.client_name || "—"}
          </div>
          <div className="truncate text-xs text-[var(--color-text-muted)]">{row.client_email || "—"}</div>
        </div>
      ),
      sortValue: (row) => (row.client_name || "").toLowerCase(),
    },
    {
      key: "title",
      header: "Title",
      hideOnMobile: true,
      render: (row) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {row.title ?? row.name ?? row.onboarding_title ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "120px",
      render: (row) => <StatusBadge status={normalizeStatus(row.status) as OnboardingStatus} />,
    },
    {
      key: "updated",
      header: "Updated",
      hideOnMobile: true,
      width: "120px",
      align: "right",
      render: (row) => (
        <span className="text-xs tabular-nums text-[var(--color-text-muted)]">{formatDate(row.updated_at)}</span>
      ),
      sortValue: (row) => (row.updated_at ? new Date(row.updated_at).getTime() : 0),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Your workspace at a glance — onboardings, events, and activity."
        actions={
          <>
            <Button variant="outline" iconLeft={<SettingsIcon className="h-3.5 w-3.5" />} onClick={() => router.push("/dashboard/settings")}>
              Settings
            </Button>
            <Button iconLeft={<Plus className="h-3.5 w-3.5" />} onClick={() => router.push("/dashboard/onboardings?new=1")}>
              New onboarding
            </Button>
          </>
        }
      />

      {error && (
        <Card>
          <CardContent className="py-4">
            <div className="text-sm font-semibold text-[var(--color-text-primary)]">Could not load dashboard</div>
            <div className="mt-1 text-sm text-[var(--color-text-secondary)]">{error}</div>
            <div className="mt-3">
              <Button variant="outline" size="sm" onClick={() => location.reload()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Clients" value={clients} href="/dashboard/clients" icon={Users} loading={loading} />
        <MetricCard label="Templates" value={templates} href="/dashboard/templates" icon={LayoutTemplate} loading={loading} />
        <MetricCard label="Onboardings" value={onboardings} href="/dashboard/onboardings" icon={ClipboardList} loading={loading} />
        <MetricCard label="Follow-ups due" value={followups} href="/dashboard/followups" icon={Bell} loading={loading} />
      </div>

      {/* Active Events */}
      {(events.length > 0 || loading) && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[var(--color-accent)]" />
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Active Events</h2>
            </div>
            <Link href="/dashboard/onboardings" className="text-xs text-[var(--color-accent)] hover:underline">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((i) => <div key={i} className="h-28 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((ev) => {
                const counts = ev.phase_status_counts ?? {};
                const total = ev.exhibitor_count;
                const completed = (counts.approved ?? 0) + (counts.completed ?? 0);
                const awaitingReview = counts.awaiting_review ?? 0;
                const inProgress = counts.in_progress ?? 0;
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                return (
                  <Link
                    key={ev.id}
                    href={`/dashboard/events/${ev.id}`}
                    className="group block rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4 transition hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-sm)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]">{ev.name}</div>
                        <div className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                          {ev.location && <span>{ev.location} · </span>}
                          {ev.end_date && new Date(ev.end_date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                      </div>
                      <span className="shrink-0 rounded bg-[var(--color-bg-subtle)] px-2 py-0.5 text-[10px] font-medium capitalize text-[var(--color-text-muted)]">{ev.status}</span>
                    </div>
                    {ev.submission_deadline && (
                      <div className="mt-1.5 text-xs">
                        <span className="text-[var(--color-text-muted)]">Deadline: </span>
                        <DeadlineBadge deadline={ev.submission_deadline} />
                      </div>
                    )}
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                        <span>{total} exhibitor{total !== 1 ? "s" : ""}</span>
                        <span className="font-medium text-[var(--color-accent)]">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                        <div className="h-full rounded-full bg-[var(--color-accent)] transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="mt-1.5 flex gap-3 text-[10px] text-[var(--color-text-muted)]">
                        {inProgress > 0 && <span className="text-blue-600">{inProgress} in progress</span>}
                        {awaitingReview > 0 && <span className="text-amber-600">{awaitingReview} needs review</span>}
                        {completed > 0 && <span className="text-green-600">{completed} done</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Two column */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Lifecycle</CardTitle>
            <CardDescription>Distribution across onboarding stages.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="mt-2 h-1 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <StatusBar label="Draft" count={status.draft} total={statusTotal} />
                <StatusBar label="Sent" count={status.sent} total={statusTotal} />
                <StatusBar label="In progress" count={status.in_progress} total={statusTotal} />
                <StatusBar label="Submitted" count={status.submitted} total={statusTotal} />
              </div>
            )}
            <div className="mt-5">
              <Link
                href="/dashboard/onboardings"
                className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-accent)] hover:underline"
              >
                Open onboardings <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden lg:col-span-8">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle>Recent onboardings</CardTitle>
              <CardDescription>Latest activity across your workspace.</CardDescription>
            </div>
            <Link
              href="/dashboard/onboardings"
              className="shrink-0 text-xs font-medium text-[var(--color-accent)] hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <div className="px-5 pb-5">
            <DataTable<RecentOnboarding>
              columns={recentColumns}
              data={recent.slice(0, 6)}
              getRowId={(r) => r.id}
              rowHref={(r) => `/dashboard/onboardings/${r.id}`}
              loading={loading}
              empty={
                <div className="py-10 text-center">
                  <div className="text-sm font-semibold text-[var(--color-text-primary)]">No onboardings yet</div>
                  <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Create your first onboarding to start tracking progress.
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Button iconLeft={<Plus className="h-3.5 w-3.5" />} onClick={() => router.push("/dashboard/onboardings?new=1")}>
                      New onboarding
                    </Button>
                  </div>
                </div>
              }
            />
          </div>
        </Card>
      </div>

      {/* Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>How are we doing?</CardTitle>
          <CardDescription>Quick feedback helps us prioritize what to build next.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitFeedback} className="space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFeedbackRating(value)}
                  aria-pressed={feedbackRating === value}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border text-sm font-semibold transition",
                    feedbackRating === value
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                      : "border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
                  )}
                >
                  {value}
                </button>
              ))}
              <span className="ml-2 self-center text-xs text-[var(--color-text-muted)]">1 needs work → 5 excellent</span>
            </div>

            <FormField label="Anything to add?" hint={`${feedbackText.length}/2000`}>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                maxLength={2000}
                placeholder="What would make your dashboard experience better?"
              />
            </FormField>

            <div className="flex justify-end">
              <Button type="submit" loading={feedbackSubmitting} disabled={feedbackRating === null}>
                Send feedback
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
