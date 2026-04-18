"use client";

import * as React from "react";
import { Mail, Calendar, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import type { PlanTier, PlanEntitlements } from "@/lib/billing-plans";

type PlanData = {
  tier: PlanTier;
  entitlements: PlanEntitlements;
};

const SUPPORT_EMAIL = "thomas@clientenforce.com";
const CALENDAR_URL = "https://calendar.app.google/QfkFs4hWUoCbKupj7";

export default function SupportPage() {
  const [plan, setPlan] = React.useState<PlanData | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard/plan", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => { if (!cancelled) setPlan(json); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const isPriority = plan?.entitlements?.prioritySupport ?? false;
  const isDedicated = plan?.entitlements?.dedicatedSupport ?? false;

  const emailSubject = isPriority
    ? encodeURIComponent("Priority Support Request")
    : encodeURIComponent("Support Request");

  return (
    <div className="space-y-8">
      <PageHeader title="Help & Support" description="Get help from the ClientEnforce team." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl">
        {/* Email */}
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=${emailSubject}`}
          className="group flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 transition hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-sm)]"
        >
          <div className="flex items-center justify-between">
            <Mail className="h-5 w-5 text-[var(--color-accent)]" />
            {isPriority && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <Star className="h-3 w-3" />
                Priority
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {isDedicated ? "Dedicated support" : isPriority ? "Priority email support" : "Email support"}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {isDedicated
                ? "Emails are routed to your dedicated account contact."
                : isPriority
                  ? "Priority requests reviewed first — typically within one business day."
                  : "Email us and we'll get back to you as quickly as we can."}
            </p>
          </div>
          <span className="mt-auto text-xs font-medium text-[var(--color-accent)] group-hover:underline">
            {SUPPORT_EMAIL} →
          </span>
        </a>

        {/* Book a walkthrough */}
        <a
          href={CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)] p-5 transition hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-sm)]"
        >
          <Calendar className="h-5 w-5 text-[var(--color-accent)]" />
          <div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Book a walkthrough</p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Not sure how to set something up? Book a short call and we will walk you through it live.
            </p>
          </div>
          <span className="mt-auto text-xs font-medium text-[var(--color-accent)] group-hover:underline">
            Open Google Calendar →
          </span>
        </a>
      </div>

      {!isPriority && plan && (
        <p className="text-xs text-[var(--color-text-muted)]">
          Priority support — where your requests skip the queue — is available on Pro and above.{" "}
          <a href="/pricing" className="text-[var(--color-accent)] hover:underline">View plans</a>
        </p>
      )}
    </div>
  );
}
