"use client";

import * as React from "react";
import Link from "next/link";
import { BarChart2, TrendingUp, CheckCircle2, Clock, Users, LayoutTemplate, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
// Button imported for potential future use in error state
import type { PlanTier, PlanEntitlements } from "@/lib/billing-plans";

type MetricsData = {
  clients: number;
  templates: number;
  onboardings: number;
  onboardings_by_status_raw?: Record<string, number>;
  followups_due: number;
};

type PlanData = {
  tier: PlanTier;
  entitlements: PlanEntitlements;
};

function pct(n: number, total: number) {
  if (total === 0) return 0;
  return Math.round((n / total) * 100);
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  loading: boolean;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-5">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">{label}</p>
        <Icon className="h-4 w-4 text-[var(--color-text-muted)]" />
      </div>
      <div className="mt-3 text-3xl font-semibold tabular-nums text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
        {loading ? <Skeleton className="h-8 w-16" /> : value}
      </div>
      {sub && !loading && <p className="mt-1 text-xs text-[var(--color-text-muted)]">{sub}</p>}
    </div>
  );
}

function FunnelBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const p = pct(count, total);
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-[var(--color-text-secondary)]">{label}</span>
        <span className="tabular-nums">
          <span className="font-semibold text-[var(--color-text-primary)]">{count}</span>
          <span className="ml-1.5 text-xs text-[var(--color-text-muted)]">{p}%</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${p}%`, transition: "width 500ms cubic-bezier(0.4,0,0.2,1)" }}
        />
      </div>
    </div>
  );
}

function UpgradeGate({ tier }: { tier: PlanTier }) {
  const isOnFree = tier === "free";
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-subtle)]">
        <Lock className="h-5 w-5 text-[var(--color-accent)]" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)]">
        {isOnFree ? "Reporting is a Pro feature" : "Full reporting requires Business"}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-[var(--color-text-secondary)]">
        {isOnFree
          ? "Upgrade to Pro to access onboarding analytics and reporting — completion rates, funnel breakdown, and workspace metrics."
          : "Upgrade to Business to unlock full reporting — all metrics with richer breakdowns across your workspace."}
      </p>
      <div className="mt-6">
        <Link
          href="/pricing"
          className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
        >
          View plans
        </Link>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [metrics, setMetrics] = React.useState<MetricsData | null>(null);
  const [plan, setPlan] = React.useState<PlanData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [metricsRes, planRes] = await Promise.all([
          fetch("/api/dashboard/metrics", { cache: "no-store" }),
          fetch("/api/dashboard/plan", { cache: "no-store" }),
        ]);

        if (!metricsRes.ok || !planRes.ok) {
          throw new Error("Failed to load reporting data");
        }

        const [metricsJson, planJson] = await Promise.all([metricsRes.json(), planRes.json()]);
        if (!cancelled) {
          setMetrics(metricsJson);
          setPlan(planJson);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load reports");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const tier = plan?.tier ?? "free";
  const entitlements = plan?.entitlements;
  const reportingLevel = entitlements?.advancedReportingLevel ?? "none";

  const raw = metrics?.onboardings_by_status_raw ?? {};
  const draft = raw.draft ?? 0;
  const sent = raw.sent ?? 0;
  const in_progress = raw.in_progress ?? 0;
  const submitted = (raw.submitted ?? 0) + (raw.locked ?? 0);
  const totalOnboardings = draft + sent + in_progress + submitted;
  const completionRate = totalOnboardings > 0 ? pct(submitted, totalOnboardings) : 0;
  const clients = metrics?.clients ?? 0;
  const templates = metrics?.templates ?? 0;
  const followupsDue = metrics?.followups_due ?? 0;

  const tierLabel: Record<string, string> = {
    free: "Free",
    pro: "Pro",
    business: "Business",
    agency: "Agency",
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        description="Analytics and reporting across your workspace."
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]">
              {tierLabel[tier] ?? "Free"} plan
            </span>
            {reportingLevel === "full" && (
              <span className="inline-flex items-center rounded-full bg-[var(--color-accent)] px-2.5 py-0.5 text-xs font-medium text-white">
                Full analytics
              </span>
            )}
            {reportingLevel === "limited" && (
              <span className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]">
                Limited analytics
              </span>
            )}
          </div>
        }
      />

      {error && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-[var(--color-text-secondary)]">{error}</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && reportingLevel === "none" && <UpgradeGate tier={tier} />}

      {(loading || reportingLevel !== "none") && (
        <>
          {/* Summary metrics */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Total clients" value={clients} icon={Users} loading={loading} />
            <StatCard label="Total onboardings" value={totalOnboardings} icon={BarChart2} loading={loading} />
            <StatCard
              label="Completion rate"
              value={`${completionRate}%`}
              sub={`${submitted} of ${totalOnboardings} submitted`}
              icon={CheckCircle2}
              loading={loading}
            />
            <StatCard label="Follow-ups due" value={followupsDue} icon={Clock} loading={loading} />
          </div>

          {/* Funnel + breakdown */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Onboarding funnel</CardTitle>
                <CardDescription>How clients move through each stage across your workspace.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i}>
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="mt-2 h-2 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-5">
                    <FunnelBar label="Draft" count={draft} total={totalOnboardings} color="bg-[var(--color-text-muted)]" />
                    <FunnelBar label="Sent" count={sent} total={totalOnboardings} color="bg-blue-400" />
                    <FunnelBar label="In progress" count={in_progress} total={totalOnboardings} color="bg-amber-400" />
                    <FunnelBar label="Submitted" count={submitted} total={totalOnboardings} color="bg-[var(--color-accent)]" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workspace summary</CardTitle>
                <CardDescription>Key counts across your account.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[0, 1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--color-border)]">
                    {[
                      { label: "Active clients", value: clients, icon: Users },
                      { label: "Templates in use", value: templates, icon: LayoutTemplate },
                      { label: "Onboardings in progress", value: in_progress + sent, icon: TrendingUp },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 text-[var(--color-text-muted)]" />
                          <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>
                        </div>
                        <span className="text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Completion insight */}
          {!loading && (
            <Card>
              <CardHeader>
                <CardTitle>Completion insight</CardTitle>
                <CardDescription>How effectively onboardings are reaching completion.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-[var(--color-accent)] text-2xl font-bold text-[var(--color-text-primary)] tabular-nums">
                    {completionRate}%
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {completionRate >= 70
                        ? "Strong completion rate"
                        : completionRate >= 40
                          ? "Room to improve"
                          : totalOnboardings === 0
                            ? "No onboardings yet"
                            : "Low completion — review required steps"}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {submitted} of {totalOnboardings} onboardings reached submitted status.
                      {followupsDue > 0 && ` ${followupsDue} follow-up${followupsDue === 1 ? "" : "s"} are due to push clients forward.`}
                    </p>
                    {reportingLevel === "limited" && (
                      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                        Date-range filtering and segmentation by template are available on the{" "}
                        <Link href="/pricing" className="text-[var(--color-accent)] hover:underline">Business plan</Link>.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
