"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RejectionBanner } from "@/components/ui/rejection-banner";

type Org = {
  tier?: string | null;
  seats_limit?: number | null;
  stripe_subscription_status?: string | null;
};

type Invite = {
  id: string;
  // API field names have changed across iterations; support common variants.
  email?: string | null;
  invite_email?: string | null;
  to_email?: string | null;
  role: "member" | "admin" | "owner";
  token: string;
  expires_at: string | null;
  accepted_at: string | null;
  created_at: string;
};

type Member = {
  id?: string;
  user_id?: string;
  email?: string | null;
  full_name?: string | null;
  role?: "member" | "admin" | "owner" | string;
  created_at?: string | null;
};

function fmtDate(s?: string | null) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

function pill() {
  return "inline-flex items-center rounded-full border border-[var(--color-border)] bg-white px-2 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]";
}

function inviteEmailOf(i: Invite) {
  return (i.email ?? i.invite_email ?? i.to_email ?? "").toString();
}

function normalizeTier(t?: string | null) {
  const v = (t ?? "free").toString().trim().toLowerCase();
  if (v === "pro" || v === "business" || v === "free") return v as "free" | "pro" | "business";
  // Some older values: "starter", "basic" etc. Treat as free.
  return "free" as const;
}

async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  return { res, json };
}

export default function SettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [org, setOrg] = React.useState<Org | null>(null);
  const [invites, setInvites] = React.useState<Invite[]>([]);
  const [members, setMembers] = React.useState<Member[]>([]);
  const [seatsUsed, setSeatsUsed] = React.useState(0);

  // Invite form
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<"member" | "admin">("member");
  const [inviting, setInviting] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);

  // Inline banners (no toast dependency)
  const [pageError, setPageError] = React.useState<string | null>(null);
  const [pageSuccess, setPageSuccess] = React.useState<string | null>(null);
  // When returning from Stripe, we may need to wait a moment for the webhook to update DB.
  const [syncingBilling, setSyncingBilling] = React.useState(false);
  const [canManageBilling, setCanManageBilling] = React.useState(true);
  const [canInviteMembers, setCanInviteMembers] = React.useState(true);
  const attemptedBackgroundBillingSync = React.useRef(false);

  async function load() {
    setLoading(true);
    setPageError(null);
    try {
      const res = await fetch("/api/team", { cache: "no-store" });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Failed to load settings");

      setOrg(json?.org ?? null);

      const members = Array.isArray(json?.members) ? json.members : [];
      setMembers(members);
      setSeatsUsed(members.length);

      const inv = Array.isArray(json?.invites) ? json.invites : [];
      // only show pending (not accepted) and with an email
      setInvites(inv.filter((i: Invite) => !i.accepted_at && !!inviteEmailOf(i)));
    } catch (e: any) {
      setPageError(e?.message ?? "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  async function syncBillingFromStripe() {
    try {
      const res = await fetch("/api/stripe/sync", { method: "POST" });
      if (!res.ok) return false;
      return true;
    } catch {
      return false;
    }
  }

  React.useEffect(() => {
    load();

    // If Stripe redirected back with success params, poll briefly until webhook updates DB.
    const params = new URLSearchParams(window.location.search);
    const billingParam = String(params.get("billing") ?? "").toLowerCase();
    const sessionId = String(params.get("session_id") ?? "").trim();
    const returnedFromStripe =
      params.has("billing_success") ||
      params.has("checkout_success") ||
      params.has("session_id") ||
      billingParam === "success" ||
      params.has("success") ||
      params.has("stripe");

    if (!returnedFromStripe) return;

    let cancelled = false;
    let attempts = 0;
    const shouldConfirmCheckout =
      !!sessionId &&
      (billingParam === "success" || params.has("checkout_success") || params.has("billing_success"));

    setSyncingBilling(true);

    const confirmCheckoutSession = async () => {
      if (!shouldConfirmCheckout) return;
      try {
        await fetch("/api/stripe/checkout/confirm", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
      } catch {
        // webhook sync will still run server-side; avoid noisy client error here
      }
    };

    const tick = async () => {
      attempts += 1;
      try {
        if (attempts === 1) {
          await confirmCheckoutSession();
          await syncBillingFromStripe();
        }
        await load();
      } finally {
        queueMicrotask(() => {
          if (cancelled) return;
          if (attempts >= 15) {
            setSyncingBilling(false);
            return;
          }
          setTimeout(tick, 2000);
        });
      }
    };

    const t = setTimeout(tick, 1200);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  React.useEffect(() => {
    if (loading) return;
    if (attemptedBackgroundBillingSync.current) return;

    const currentTier = normalizeTier(org?.tier);
    const stripeStatus = String(org?.stripe_subscription_status ?? "").trim().toLowerCase();
    const needsRecoverySync =
      currentTier === "free" &&
      stripeStatus !== "active" &&
      stripeStatus !== "trialing";

    if (!needsRecoverySync) return;
    attemptedBackgroundBillingSync.current = true;

    (async () => {
      const synced = await syncBillingFromStripe();
      if (synced) await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, org?.tier, org?.stripe_subscription_status]);

  async function createInvite() {
    const email = inviteEmail.trim().toLowerCase();

    // Seats gating (if your plan enforces a limit)
    if (seatsLimit > 0 && seatsUsed >= seatsLimit) {
      setPageError(`Plan upgrade required: Seat limit reached (${seatsLimit}). Upgrade to add more team members.`);
      setPageSuccess(null);
      return;
    }

    if (!email) {
      setPageError("Email is required.");
      setPageSuccess(null);
      return;
    }

    setInviting(true);
    setPageError(null);
    setPageSuccess(null);

    try {
      // Try a few common endpoints (your repo has evolved; this keeps it robust)
      const candidates = ["/api/invites", "/api/team/invite", "/api/team/invites"];

      let lastErr = "Invite failed";
      for (const url of candidates) {
        const { res, json } = await postJson(url, { email, role: inviteRole });
        if (res.status === 404) continue;
        if (!res.ok) {
          if (res.status === 403) {
            setCanInviteMembers(false);
            setPageError("Permission required: You do not have access to invite team members.");
            setPageSuccess(null);
            return;
          }
          lastErr = json?.error || res.statusText || "Invite failed";
          break;
        }

        setCanInviteMembers(true);
        setInviteEmail("");
        setInviteRole("member");
        setPageSuccess("Invite created.");
        await load();
        return;
      }

      throw new Error(lastErr);
    } catch (e: any) {
      setPageError(e?.message ?? "Invite failed");
      setPageSuccess(null);
    } finally {
      setInviting(false);
    }
  }

  async function copyInviteLink(token: string) {
    try {
      const url = `${window.location.origin}/invite/${token}`;
      await navigator.clipboard.writeText(url);
      setPageSuccess("Invite link copied.");
      setPageError(null);
    } catch {
      setPageError("Could not copy invite link.");
      setPageSuccess(null);
    }
  }

  async function openBillingPortal() {
    setPageError(null);
    setPageSuccess(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        if (res.status === 403) {
          setCanManageBilling(false);
          throw new Error("Permission required: You do not have access to manage billing.");
        }
        throw new Error(json?.error || "Failed to open billing portal");
      }
      setCanManageBilling(true);
      if (!json?.url) throw new Error("Billing portal URL missing");
      window.location.href = json.url;
    } catch (e: any) {
      setPageError(e?.message ?? "Billing portal failed");
    }
  }

  async function startUpgrade(plan: "pro" | "business", interval: "monthly" | "yearly" = "monthly") {
    setPageError(null);
    setPageSuccess(null);

    try {
      // Prefer a checkout endpoint if present; fall back to /pricing if not.
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tier: plan, // checkout expects `tier`: "pro" | "business"
          interval,
          return_url: `${window.location.origin}/dashboard/settings`,
        }),
      });
      const json = await res.json().catch(() => null);

      if (res.status === 404) {
        window.location.href = "/pricing";
        return;
      }

      if (!res.ok) {
        if (res.status === 403) {
          setCanManageBilling(false);
          throw new Error("Permission required: You do not have access to manage billing.");
        }
        throw new Error(json?.error || "Failed to start upgrade");
      }
      setCanManageBilling(true);
      if (!json?.url) throw new Error("Checkout URL missing");
      window.location.href = json.url;
    } catch (e: any) {
      setPageError(e?.message ?? "Upgrade failed");
    }
  }

  async function startDowngrade(plan: "free" | "pro", interval: "monthly" | "yearly" = "monthly") {
    setPageError(null);
    setPageSuccess(null);

    try {
      const res = await fetch("/api/stripe/downgrade", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tier: plan,
          interval,
        }),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 403) {
          setCanManageBilling(false);
          throw new Error("Permission required: You do not have access to manage billing.");
        }
        throw new Error(json?.error || "Failed to schedule downgrade");
      }

      setCanManageBilling(true);
      setPageSuccess(json?.message || `Downgrade to ${plan} scheduled.`);
      await load();
    } catch (e: any) {
      setPageError(e?.message ?? "Downgrade failed");
    }
  }

  async function logout() {
    setLoggingOut(true);
    setPageError(null);
    setPageSuccess(null);

    try {
      // Try a few common sign-out endpoints across iterations.
      const candidates = ["/api/auth/logout", "/api/logout", "/auth/signout", "/api/auth/signout"];

      let didRequest = false;
      for (const url of candidates) {
        const res = await fetch(url, { method: "POST" });
        if (res.status === 404) continue;
        didRequest = true;
        if (!res.ok) {
          const json = await res.json().catch(() => null);
          throw new Error(json?.error || res.statusText || "Logout failed");
        }
        break;
      }

      // If no endpoint exists, still redirect (some apps clear session via middleware/cookies).
      if (!didRequest) {
        // noop
      }

      window.location.href = "/";
    } catch (e: any) {
      setPageError(e?.message ?? "Logout failed");
    } finally {
      setLoggingOut(false);
    }
  }
  const seatsLimit = org?.seats_limit ?? 0;
  const seatsText = seatsLimit > 0 ? `${seatsUsed} / ${seatsLimit} seats used` : `${seatsUsed} seat(s) used`;
  const currentTier = normalizeTier(org?.tier);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Settings</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Organization settings, billing, and team invites.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" className="w-full sm:w-auto" onClick={logout} disabled={loggingOut}>
            {loggingOut ? "Logging out…" : "Log out"}
          </Button>
        </div>
      </div>

      {pageError ? (
        <RejectionBanner
          kind={
            /plan|upgrade|tier|seat limit|template limit|active onboarding limit/i.test(pageError)
              ? "plan"
              : /permission|access|forbidden/i.test(pageError)
                ? "permission"
                : "error"
          }
          message={pageError}
          onDismiss={() => setPageError(null)}
        />
      ) : null}

      {pageSuccess ? (
        <div className="rounded-[var(--radius-sm)] border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-medium">Success</div>
              <div className="mt-0.5">{pageSuccess}</div>
            </div>
            <button
              className="text-green-700/70 hover:text-green-900"
              onClick={() => setPageSuccess(null)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}

      {syncingBilling ? (
        <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-primary)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-medium">Updating subscription…</div>
              <div className="mt-0.5 text-[var(--color-text-secondary)]">We&apos;re syncing your Stripe subscription. This can take a few seconds.</div>
            </div>
            <button
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              onClick={() => setSyncingBilling(false)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}

      {/* Organization */}
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Plan, seat usage, and subscription status.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Tier</div>
            <div className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">{org?.tier ?? "—"}</div>
          </div>

          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Seats</div>
            <div className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">{seatsText}</div>
          </div>

          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Subscription</div>
            <div className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">
              {org?.stripe_subscription_status ?? "—"}
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 md:col-span-3 flex flex-wrap gap-2">
            {canManageBilling ? <Button onClick={openBillingPortal}>Manage billing</Button> : null}
            <Button variant="secondary" onClick={load} disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </Button>
          </div>
        </CardContent>
      </Card>


      {/* Upgrade */}
      <Card>
        <CardHeader>
          <CardTitle>Upgrade</CardTitle>
          <CardDescription>Unlock more seats, automation, and advanced controls.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6 md:p-8">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>Plans</h3>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Choose the plan that fits your onboarding volume. Upgrade any time.
                </p>
              </div>
              <div className="text-xs text-[var(--color-text-muted)]">
                {currentTier === "free"
                  ? "You're currently on Free."
                  : currentTier === "pro"
                    ? "You're currently on Pro."
                    : "You're currently on Business."}
                {!canManageBilling ? " Billing changes are restricted for your role." : ""}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Starter */}
              <div className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-[var(--color-text-primary)]">Free</div>
                    <div className="mt-1 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">£0</div>
                    <div className="mt-1 text-sm text-[var(--color-text-secondary)]">For solo use and early onboarding workflows.</div>
                  </div>
                  {currentTier === "free" ? (
                    <span className={pill()}>Current</span>
                  ) : (
                    <span className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                      Free
                    </span>
                  )}
                </div>

                <ul className="mt-4 flex-1 space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li>• 1 admin user</li>
                  <li>• Up to 5 active onboardings</li>
                  <li>• 1 onboarding template</li>
                  <li>• Client portal links</li>
                  <li>• Basic progress tracking</li>
                  <li>• File uploads + signature collection</li>
                  <li>• Manual follow-ups only</li>
                  <li>• Basic client directory and settings</li>
                </ul>

                <div className="mt-6 grid gap-2">
                  <button
                    type="button"
                    className="inline-flex h-10 w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] disabled:opacity-60"
                    disabled={currentTier === "free"}
                    onClick={() => startDowngrade("free", "monthly")}
                  >
                    {currentTier === "free" ? "Current plan" : "Downgrade to Free"}
                  </button>
                  {currentTier !== "free" ? (
                    <div className="text-xs text-[var(--color-text-muted)]">
                      Your current paid plan will remain active until the end of the billing period, then downgrade to Free.
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Pro */}
              <div className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-white p-5 shadow-[var(--shadow-sm)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-[var(--color-text-primary)]">Pro</div>
                    <div className="mt-1 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                      £29<span className="text-base font-semibold text-[var(--color-text-muted)]">/mo</span>
                    </div>
                    <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      £278.40 yearly <span className="text-[var(--color-text-muted)]">(20% off)</span>
                    </div>
                    <div className="mt-1 text-sm text-[var(--color-text-secondary)]">For solo operators + small teams who want automation.</div>
                  </div>
                  <span className="rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-medium text-white">Most popular</span>
                </div>

                <ul className="mt-4 flex-1 space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li>• Everything in Free</li>
                  <li>• Up to 5 admin/team users</li>
                  <li>• Up to 10 templates</li>
                  <li>• Up to 50 active onboardings</li>
                  <li>• Automated follow-ups</li>
                  <li>• Activity timeline + audit log</li>
                  <li>• Evidence pack / PDF export</li>
                  <li>• Team management + billing management</li>
                  <li>• Better reporting + priority support</li>
                </ul>

                <div className="mt-6 grid gap-2">
                  {currentTier === "business" ? (
                    <>
                      <Button
                        className="w-full"
                        onClick={() => startDowngrade("pro", "monthly")}
                        disabled={!canManageBilling}
                      >
                        Downgrade to Pro monthly
                      </Button>
                      <Button
                        className="w-full"
                        variant="secondary"
                        onClick={() => startDowngrade("pro", "yearly")}
                        disabled={!canManageBilling}
                      >
                        Downgrade to Pro yearly
                      </Button>
                      <div className="text-xs text-[var(--color-text-muted)]">
                        Your Business plan will stay active until the end of the billing period, then downgrade to Pro.
                      </div>
                    </>
                  ) : (
                    <>
                      <Button
                        className="w-full"
                        onClick={() => startUpgrade("pro", "monthly")}
                        disabled={!canManageBilling || currentTier === "pro"}
                      >
                        {currentTier === "pro" ? "Current plan" : "Subscribe monthly"}
                      </Button>
                      <Button
                        className="w-full"
                        variant="secondary"
                        onClick={() => startUpgrade("pro", "yearly")}
                        disabled={!canManageBilling || currentTier === "pro"}
                      >
                        {currentTier === "pro" ? "Current plan" : "Subscribe yearly"}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Business */}
              <div className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-[var(--color-text-primary)]">Business</div>
                    <div className="mt-1 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                      £89<span className="text-base font-semibold text-[var(--color-text-muted)]">/mo</span>
                    </div>
                    <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      £854.40 yearly <span className="text-[var(--color-text-muted)]">(20% off)</span>
                    </div>
                    <div className="mt-1 text-sm text-[var(--color-text-secondary)]">For teams onboarding clients at scale.</div>
                  </div>
                  {currentTier === "business" ? (
                    <span className={pill()}>Current</span>
                  ) : (
                    <span className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                      Scale
                    </span>
                  )}
                </div>

                <ul className="mt-4 flex-1 space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li>• Everything in Pro</li>
                  <li>• Up to 15 users by default</li>
                  <li>• Up to 200 active onboardings</li>
                  <li>• Unlimited templates</li>
                  <li>• Advanced team permissions</li>
                  <li>• Full automation controls</li>
                  <li>• Full audit history</li>
                  <li>• Reporting / analytics</li>
                  <li>• Compliance-ready exports</li>
                  <li>• Advanced billing controls</li>
                  <li>• Priority / premium support</li>
                </ul>

                <div className="mt-6 grid gap-2">
                  <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => startUpgrade("business", "monthly")}
                    disabled={!canManageBilling || currentTier === "business"}
                  >
                    {currentTier === "business" ? "Current plan" : "Subscribe monthly"}
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => startUpgrade("business", "yearly")}
                    disabled={!canManageBilling || currentTier === "business"}
                  >
                    {currentTier === "business" ? "Current plan" : "Subscribe yearly"}
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>


      {/* Invite */}
      <Card>
        <CardHeader>
          <CardTitle>Invite members</CardTitle>
          <CardDescription>
            {canInviteMembers
              ? "Create an invite link for a teammate. Admins can invite and assign roles."
              : "You can view team information, but only admins and owners can invite teammates."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            <div className="sm:col-span-1 space-y-1">
              <Label htmlFor="inviteEmail">Email</Label>
              <Input
                id="inviteEmail"
                value={inviteEmail}
                disabled={!canInviteMembers}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teammate@company.com"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="inviteRole">Role</Label>
              <select
                id="inviteRole"
                className="h-10 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-3 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-subtle)]"
                value={inviteRole}
                disabled={!canInviteMembers}
                onChange={(e) => setInviteRole(e.target.value as any)}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {canInviteMembers ? (
              <Button onClick={createInvite} disabled={inviting || !inviteEmail.trim() || (seatsLimit > 0 && seatsUsed >= seatsLimit)}>
                {inviting ? "Creating…" : "Create invite"}
              </Button>
            ) : null}
          </div>

          <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white">
            <table className="w-full min-w-[840px] text-sm">
              <thead className="border-b border-[var(--color-border)] text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                <tr>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Created</th>
                  <th className="px-4 py-2 text-left">Expires</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-[var(--color-text-secondary)]">
                      Loading…
                    </td>
                  </tr>
                ) : invites.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-[var(--color-text-secondary)]">
                      No pending invites.
                    </td>
                  </tr>
                ) : (
                  invites.map((i) => (
                    <tr key={i.id} className="hover:bg-[var(--color-bg-subtle)]">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[var(--color-text-primary)]">{inviteEmailOf(i) || "—"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={pill()}>{i.role}</span>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-secondary)]">{fmtDate(i.created_at)}</td>
                      <td className="px-4 py-3 text-[var(--color-text-secondary)]">{fmtDate(i.expires_at)}</td>
                      <td className="px-4 py-3 text-[var(--color-text-secondary)]">{i.accepted_at ? "Accepted" : "Pending"}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-2 py-1 text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)]"
                            onClick={() => copyInviteLink(i.token)}
                          >
                            Copy link
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-[var(--color-text-muted)]">
            Invite links are for adding teammates to your workspace.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
