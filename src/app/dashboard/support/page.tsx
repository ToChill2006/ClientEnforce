"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, MessageSquare, Star, Shield, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlanTier, PlanEntitlements } from "@/lib/billing-plans";

type PlanData = {
  tier: PlanTier;
  entitlements: PlanEntitlements;
};

const SUPPORT_EMAIL = "support@clientenforce.com";
const PRIORITY_SUBJECT = encodeURIComponent("Priority Support Request");
const STANDARD_SUBJECT = encodeURIComponent("Support Request");

function supportEmailHref(priority: boolean) {
  const subject = priority ? PRIORITY_SUBJECT : STANDARD_SUBJECT;
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}`;
}

const tierLabel: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  business: "Business",
  agency: "Agency",
};

export default function SupportPage() {
  const [plan, setPlan] = React.useState<PlanData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard/plan", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => { if (!cancelled) setPlan(json); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const tier = plan?.tier ?? "free";
  const entitlements = plan?.entitlements;
  const isPriority = entitlements?.prioritySupport ?? false;
  const isDedicated = entitlements?.dedicatedSupport ?? false;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Help & Support"
        description="Get help from the ClientEnforce team."
        actions={
          loading ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]">
              {isPriority && <Star className="h-3 w-3 text-amber-500" />}
              {tierLabel[tier] ?? "Free"} plan
            </span>
          )
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Email support card — plan-aware */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)]">
                <Mail className="h-4 w-4 text-[var(--color-accent)]" />
              </div>
              {isPriority && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <Star className="h-3 w-3" />
                  Priority
                </span>
              )}
            </div>
            <CardTitle className="mt-2 text-base">
              {isDedicated ? "Dedicated account support" : isPriority ? "Priority email support" : "Email support"}
            </CardTitle>
            <CardDescription>
              {isDedicated
                ? "Your Agency plan includes a dedicated account manager. Email us and we'll connect you with your account contact."
                : isPriority
                  ? "Your plan includes priority support. Emails tagged as priority are reviewed first — typical response within one business day."
                  : "Email our support team. We review all requests and respond as quickly as we can."}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <a
              href={supportEmailHref(isPriority)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-hover)]"
            >
              <Mail className="h-4 w-4" />
              {isDedicated ? "Contact your account manager" : isPriority ? "Send priority support email" : "Send support email"}
            </a>
            {!isPriority && (
              <p className="mt-3 text-center text-xs text-[var(--color-text-muted)]">
                Priority support is available on Pro and above.{" "}
                <Link href="/pricing" className="text-[var(--color-accent)] hover:underline">Upgrade</Link>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Docs / self-serve */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)]">
              <MessageSquare className="h-4 w-4 text-[var(--color-accent)]" />
            </div>
            <CardTitle className="mt-2 text-base">Book a walkthrough</CardTitle>
            <CardDescription>
              Not sure how to set something up? Book a short call and we will walk you through it live.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <a
              href="https://cal.com/clientenforce/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-hover)]"
            >
              <ExternalLink className="h-4 w-4" />
              Book a call
            </a>
          </CardContent>
        </Card>

        {/* Plan info / upgrade prompt */}
        {!isPriority ? (
          <Card className="flex flex-col border-[var(--color-border)] bg-[var(--color-accent-subtle)]">
            <CardHeader>
              <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-white/60 dark:bg-black/20">
                <Shield className="h-4 w-4 text-[var(--color-accent)]" />
              </div>
              <CardTitle className="mt-2 text-base">Get priority support</CardTitle>
              <CardDescription>
                Upgrade to Pro to have your support requests reviewed first — ahead of the standard queue.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Link
                href="/pricing"
                className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
              >
                View plans
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)]">
                <Shield className="h-4 w-4 text-[var(--color-accent)]" />
              </div>
              <CardTitle className="mt-2 text-base">Your support coverage</CardTitle>
              <CardDescription>
                {isDedicated
                  ? "Agency plan: dedicated account support, priority routing, and a named account contact."
                  : "Pro/Business plan: priority support queue — your requests are reviewed ahead of standard."}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3 text-xs text-[var(--color-text-secondary)]">
                <p className="font-medium text-[var(--color-text-primary)]">
                  {isDedicated ? "Dedicated account" : "Priority queue"}
                </p>
                <p className="mt-1">
                  {isDedicated
                    ? "Emails to support@clientenforce.com from your account are routed to your dedicated account manager."
                    : "Emails with subject 'Priority Support Request' are flagged and reviewed first — typically within one business day."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
