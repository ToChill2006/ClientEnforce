"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RejectionBanner } from "@/components/ui/rejection-banner";
import { PageHeader } from "@/components/ui/page-header";

type Org = {
  tier?: string | null;
  seats_limit?: number | null;
  stripe_subscription_status?: string | null;
  stripe_account_id?: string | null;
  feature_flags?: Record<string, unknown> | null;
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
  return "inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-secondary)]";
}

function inviteEmailOf(i: Invite) {
  return (i.email ?? i.invite_email ?? i.to_email ?? "").toString();
}

type PlanTier = "free" | "pro" | "business" | "agency";

function normalizeTier(t?: string | null): PlanTier {
  const v = (t ?? "free").toString().trim().toLowerCase();
  if (v === "pro" || v === "business" || v === "free" || v === "agency") return v;
  // Some older values: "starter", "basic" etc. Treat as free.
  return "free";
}

type WhiteLabelSettings = {
  brand_name: string;
  support_email: string;
  portal_tagline: string;
  accent_color: string;
  heading_color: string;
  logo_url: string;
  remove_branding: boolean;
  custom_domain: string;
};

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
  const [inviteRole, setInviteRole] = React.useState<"admin" | "onboarder" | "reviewer" | "external_viewer">("onboarder");
  const [inviting, setInviting] = React.useState(false);

  // External viewer event scopes
  const [availableEvents, setAvailableEvents] = React.useState<Array<{ id: string; name: string }>>([]);
  const [selectedEventIds, setSelectedEventIds] = React.useState<string[]>([]);
  const [eventsLoaded, setEventsLoaded] = React.useState(false);

  // Per-member scope state for display and editing
  const [memberScopes, setMemberScopes] = React.useState<Record<string, string[]>>({});
  const [editScopeUserId, setEditScopeUserId] = React.useState<string | null>(null);
  const [editScopeEventIds, setEditScopeEventIds] = React.useState<string[]>([]);
  const [savingScopes, setSavingScopes] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [stripeConnectBusy, setStripeConnectBusy] = React.useState(false);

  // White-label state
  const [wl, setWl] = React.useState<WhiteLabelSettings>({
    brand_name: "", support_email: "", portal_tagline: "",
    accent_color: "", heading_color: "", logo_url: "", remove_branding: false, custom_domain: "",
  });
  const [wlLoading, setWlLoading] = React.useState(false);
  const [wlSaving, setWlSaving] = React.useState(false);
  const [wlLoaded, setWlLoaded] = React.useState(false);
  const [logoUploading, setLogoUploading] = React.useState(false);
  const [logoError, setLogoError] = React.useState<string | null>(null);
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const [domainStatus, setDomainStatus] = React.useState<{
    verified: boolean;
    cname: string | null;
    verificationRecord: { type: string; domain: string; value: string } | null;
  } | null>(null);
  const [domainChecking, setDomainChecking] = React.useState(false);
  const [domainCheckError, setDomainCheckError] = React.useState<string | null>(null);

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

  async function loadWhiteLabel() {
    setWlLoading(true);
    try {
      const res = await fetch("/api/white-label", { cache: "no-store" });
      if (!res.ok) return; // not on agency plan — silently skip
      const json = await res.json().catch(() => null);
      if (json?.settings) {
        setWl({
          brand_name: json.settings.brand_name ?? "",
          support_email: json.settings.support_email ?? "",
          portal_tagline: json.settings.portal_tagline ?? "",
          accent_color: json.settings.accent_color ?? "",
          heading_color: json.settings.heading_color ?? "",
          logo_url: json.settings.logo_url ?? "",
          remove_branding: Boolean(json.settings.remove_branding),
          custom_domain: json.settings.custom_domain ?? "",
        });
        setWlLoaded(true);
      }
    } finally {
      setWlLoading(false);
    }
  }

  async function saveWhiteLabel() {
    setWlSaving(true);
    setPageError(null);
    setPageSuccess(null);
    try {
      const res = await fetch("/api/white-label", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(wl),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Failed to save white-label settings");
      setDomainStatus(null); // reset so they re-verify after domain change
      setPageSuccess(json?.domainWarning
        ? `Settings saved. Domain warning: ${json.domainWarning}`
        : "White-label settings saved.");
    } catch (e: any) {
      setPageError(e?.message ?? "Save failed");
    } finally {
      setWlSaving(false);
    }
  }

  async function uploadLogo(file: File) {
    setLogoUploading(true);
    setLogoError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/white-label/logo", { method: "POST", body: form });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Upload failed");
      setWl((v) => ({ ...v, logo_url: json.logo_url }));
      setPageSuccess("Logo uploaded.");
    } catch (e: any) {
      setLogoError(e?.message ?? "Upload failed");
    } finally {
      setLogoUploading(false);
    }
  }

  async function checkDomain() {
    setDomainChecking(true);
    setDomainCheckError(null);
    setDomainStatus(null);
    try {
      const res = await fetch("/api/white-label/domain");
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Failed to check domain");
      setDomainStatus({ verified: json.verified, cname: json.cname, verificationRecord: json.verificationRecord });
    } catch (e: any) {
      setDomainCheckError(e?.message ?? "Check failed");
    } finally {
      setDomainChecking(false);
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

  // Load scopes for external_viewer members whenever members list changes
  React.useEffect(() => {
    const externalViewerIds = members
      .filter((m) => (m.role ?? "") === "external_viewer")
      .map((m) => (m.user_id ?? m.id ?? ""))
      .filter(Boolean);
    if (externalViewerIds.length > 0) {
      loadMemberScopes(externalViewerIds);
    }
  }, [members]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load events when external_viewer role is selected
  React.useEffect(() => {
    if (inviteRole === "external_viewer") {
      loadEvents();
    }
  }, [inviteRole]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    load();
    loadWhiteLabel();

    // If Stripe redirected back with success params, poll briefly until webhook updates DB.
    const params = new URLSearchParams(window.location.search);

    // Handle Stripe Connect return
    const stripeParam = params.get("stripe");
    if (stripeParam === "connected") {
      setPageSuccess("Stripe connected successfully.");
      void load();
    } else if (stripeParam === "error") {
      const msg = params.get("message") ?? "Stripe connection failed.";
      setPageError(msg);
    }

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

  async function loadEvents() {
    if (eventsLoaded) return;
    try {
      const res = await fetch("/api/events", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json().catch(() => null);
      const evts = Array.isArray(json?.events) ? json.events : [];
      setAvailableEvents(evts.map((e: any) => ({ id: e.id, name: e.name })));
      setEventsLoaded(true);
    } catch {
      // ignore — events feature may not be enabled
    }
  }

  async function loadMemberScopes(userIds: string[]) {
    const results: Record<string, string[]> = {};
    await Promise.all(
      userIds.map(async (uid) => {
        try {
          const res = await fetch(`/api/team/external-viewer-scopes?user_id=${uid}`, { cache: "no-store" });
          if (!res.ok) return;
          const json = await res.json().catch(() => null);
          results[uid] = Array.isArray(json?.event_ids) ? json.event_ids : [];
        } catch {
          // ignore
        }
      })
    );
    setMemberScopes((prev) => ({ ...prev, ...results }));
  }

  async function saveScopes(userId: string, eventIds: string[]) {
    setSavingScopes(true);
    setPageError(null);
    try {
      const res = await fetch("/api/team/external-viewer-scopes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user_id: userId, event_ids: eventIds }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Failed to save scopes");
      setMemberScopes((prev) => ({ ...prev, [userId]: eventIds }));
      setEditScopeUserId(null);
      setEditScopeEventIds([]);
      setPageSuccess("Access scopes updated.");
    } catch (e: any) {
      setPageError(e?.message ?? "Failed to save scopes");
    } finally {
      setSavingScopes(false);
    }
  }

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

    if (inviteRole === "external_viewer" && selectedEventIds.length === 0) {
      setPageError("Select at least one event for this external viewer.");
      setPageSuccess(null);
      return;
    }

    setInviting(true);
    setPageError(null);
    setPageSuccess(null);

    try {
      const { res, json } = await postJson("/api/team/invite", { email, role: inviteRole });

      if (!res.ok) {
        if (res.status === 403) {
          setCanInviteMembers(false);
          setPageError(json?.error || "Permission required: You do not have access to invite team members.");
          setPageSuccess(null);
          return;
        }
        throw new Error(json?.error || res.statusText || "Invite failed");
      }

      setCanInviteMembers(true);
      setInviteEmail("");
      setInviteRole("onboarder");
      setSelectedEventIds([]);
      setPageSuccess("Invite sent — they'll receive an email with a link to join.");
      await load();
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

  async function startUpgrade(plan: "pro" | "business" | "agency", interval: "monthly" | "yearly" = "monthly") {
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

  async function disconnectStripe() {
    setStripeConnectBusy(true);
    setPageError(null);
    setPageSuccess(null);
    try {
      const res = await fetch("/api/stripe/connect", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ disconnect: true }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Failed to disconnect Stripe");
      setOrg((prev) => prev ? { ...prev, stripe_account_id: null } : prev);
      setPageSuccess("Stripe account disconnected.");
    } catch (e: any) {
      setPageError(e?.message ?? "Disconnect failed");
    } finally {
      setStripeConnectBusy(false);
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
      <PageHeader
        title="Settings"
        description="Organization settings, billing, and team invites."
        actions={
          <Button variant="outline" size="sm" onClick={logout} disabled={loggingOut}>
            {loggingOut ? "Logging out…" : "Log out"}
          </Button>
        }
      />

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
        <div className="rounded-[var(--radius-sm)] border border-[var(--color-success-subtle)] bg-[var(--color-success-subtle)] px-4 py-3 text-sm text-[var(--color-success)]">
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
        <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-3 text-sm text-[var(--color-text-primary)]">
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
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Tier</div>
            <div className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">{org?.tier ?? "—"}</div>
          </div>

          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Seats</div>
            <div className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">{seatsText}</div>
          </div>

          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] p-4">
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
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-8">
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
                    : currentTier === "business"
                      ? "You're currently on Business."
                      : "You're currently on Agency Pro."}
                {!canManageBilling ? " Billing changes are restricted for your role." : ""}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
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
                    <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
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
                    className="inline-flex h-10 w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-bg-subtle)] disabled:opacity-60"
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
              <div className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-panel)] p-5 shadow-[var(--shadow-sm)]">
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
                    <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
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
                    disabled={!canManageBilling || currentTier === "business" || currentTier === "agency"}
                  >
                    {currentTier === "business" ? "Current plan" : "Subscribe monthly"}
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => startUpgrade("business", "yearly")}
                    disabled={!canManageBilling || currentTier === "business" || currentTier === "agency"}
                  >
                    {currentTier === "business" ? "Current plan" : "Subscribe yearly"}
                  </Button>
                </div>
              </div>

              {/* Agency Pro */}
              <div className="flex flex-col rounded-[var(--radius-lg)] border-2 border-[var(--color-accent)] bg-[var(--color-panel)] p-5 shadow-[var(--shadow-sm)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-[var(--color-text-primary)]">Agency Pro</div>
                      <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">White Label</span>
                    </div>
                    <div className="mt-1 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
                      £149<span className="text-base font-semibold text-[var(--color-text-muted)]">/mo</span>
                    </div>
                    <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      £1,430.40 yearly <span className="text-[var(--color-text-muted)]">(20% off)</span>
                    </div>
                    <div className="mt-1 text-sm text-[var(--color-text-secondary)]">For agencies delivering a branded client experience.</div>
                  </div>
                  {currentTier === "agency" ? (
                    <span className={pill()}>Current</span>
                  ) : null}
                </div>

                <ul className="mt-4 flex-1 space-y-2 text-sm text-[var(--color-text-secondary)]">
                  <li>• Everything in Business</li>
                  <li>• Up to 25 users</li>
                  <li>• Unlimited onboardings</li>
                  <li className="font-semibold text-[var(--color-text-primary)]">• White-label client portals</li>
                  <li className="font-semibold text-[var(--color-text-primary)]">• Custom portal domain</li>
                  <li className="font-semibold text-[var(--color-text-primary)]">• Your logo + brand colours</li>
                  <li className="font-semibold text-[var(--color-text-primary)]">• Remove "Powered by ClientEnforce"</li>
                  <li>• Dedicated account support</li>
                </ul>

                <div className="mt-6 grid gap-2">
                  {currentTier === "agency" ? (
                    <Button className="w-full" disabled>Current plan</Button>
                  ) : (
                    <>
                      <Button
                        className="w-full"
                        onClick={() => startUpgrade("agency", "monthly")}
                        disabled={!canManageBilling}
                      >
                        Subscribe monthly
                      </Button>
                      <Button
                        className="w-full"
                        variant="secondary"
                        onClick={() => startUpgrade("agency", "yearly")}
                        disabled={!canManageBilling}
                      >
                        Subscribe yearly
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>


      {/* White Label */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>White Label</CardTitle>
            {currentTier !== "agency" ? (
              <span className="rounded-full border border-[var(--color-accent)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                Agency Pro
              </span>
            ) : null}
          </div>
          <CardDescription>
            {currentTier === "agency"
              ? "Customise your client portal with your own brand, colours, and domain."
              : "Upgrade to Agency Pro to white-label your client portals, remove all ClientEnforce branding, and serve clients under your own domain."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {currentTier !== "agency" ? (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-6 text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] text-lg">🏷️</div>
              <div className="text-sm font-medium text-[var(--color-text-primary)]">White-label features are locked</div>
              <div className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Upgrade to Agency Pro to apply your logo, brand colours, custom domain, and remove all ClientEnforce branding from every client portal.
              </div>
              <div className="mt-4 flex flex-col items-center gap-2">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm text-left max-w-md w-full">
                  {[
                    "Your logo on every client portal",
                    "Custom accent colour",
                    "Remove \"Powered by ClientEnforce\"",
                    "Custom portal domain",
                    "Brand name + support email",
                    "Custom portal tagline",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                      <span className="text-[var(--color-success)]">✓</span> {f}
                    </div>
                  ))}
                </div>
                <Button className="mt-4" onClick={() => startUpgrade("agency", "monthly")} disabled={!canManageBilling}>
                  Upgrade to Agency Pro
                </Button>
              </div>
            </div>
          ) : wlLoading ? (
            <div className="text-sm text-[var(--color-text-secondary)]">Loading white-label settings…</div>
          ) : (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="wl_brand_name">Brand name</Label>
                  <Input
                    id="wl_brand_name"
                    value={wl.brand_name}
                    onChange={(e) => setWl((v) => ({ ...v, brand_name: e.target.value }))}
                    placeholder="Acme Agency"
                  />
                  <p className="text-xs text-[var(--color-text-muted)]">Displayed in the client portal header.</p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="wl_support_email">Support email</Label>
                  <Input
                    id="wl_support_email"
                    type="email"
                    value={wl.support_email}
                    onChange={(e) => setWl((v) => ({ ...v, support_email: e.target.value }))}
                    placeholder="hello@youragency.com"
                  />
                  <p className="text-xs text-[var(--color-text-muted)]">Shown on the client portal footer.</p>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="wl_tagline">Portal tagline</Label>
                  <Input
                    id="wl_tagline"
                    value={wl.portal_tagline}
                    onChange={(e) => setWl((v) => ({ ...v, portal_tagline: e.target.value }))}
                    placeholder="Let's get you onboarded. We're excited to work with you."
                  />
                  <p className="text-xs text-[var(--color-text-muted)]">Appears below the brand name on the client portal.</p>
                </div>

                <div className="space-y-2">
                  <Label>Logo</Label>
                  {/* Upload button */}
                  <div className="flex items-center gap-2">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadLogo(file);
                        e.target.value = "";
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={logoUploading}
                      onClick={() => logoInputRef.current?.click()}
                    >
                      {logoUploading ? "Uploading…" : "Upload logo"}
                    </Button>
                    <span className="text-xs text-[var(--color-text-muted)]">PNG, JPEG, WebP, or SVG · max 2 MB</span>
                  </div>
                  {logoError && <p className="text-xs text-red-600">{logoError}</p>}
                  {/* Manual URL fallback */}
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--color-text-muted)]">Or paste a public URL:</p>
                    <Input
                      id="wl_logo_url"
                      value={wl.logo_url}
                      onChange={(e) => setWl((v) => ({ ...v, logo_url: e.target.value }))}
                      placeholder="https://youragency.com/logo.png"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="wl_accent">Button & link colour</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="wl_accent"
                      type="color"
                      value={wl.accent_color || "#000000"}
                      onChange={(e) => setWl((v) => ({ ...v, accent_color: e.target.value }))}
                      className="h-10 w-14 cursor-pointer rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] p-1"
                    />
                    <Input
                      value={wl.accent_color}
                      onChange={(e) => setWl((v) => ({ ...v, accent_color: e.target.value }))}
                      placeholder="#2563eb"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">Controls buttons, progress bars, checkboxes, and interactive highlights in the client portal.</p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="wl_heading">Section heading colour</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="wl_heading"
                      type="color"
                      value={wl.heading_color || "#000000"}
                      onChange={(e) => setWl((v) => ({ ...v, heading_color: e.target.value }))}
                      className="h-10 w-14 cursor-pointer rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)] p-1"
                    />
                    <Input
                      value={wl.heading_color}
                      onChange={(e) => setWl((v) => ({ ...v, heading_color: e.target.value }))}
                      placeholder="Defaults to button colour"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">Controls section header strips and phase title text. Leave blank to inherit the button colour.</p>
                </div>

                <div className="space-y-3 sm:col-span-2">
                  <div className="space-y-1">
                    <Label htmlFor="wl_domain">Custom domain</Label>
                    <Input
                      id="wl_domain"
                      value={wl.custom_domain}
                      onChange={(e) => { setWl((v) => ({ ...v, custom_domain: e.target.value })); setDomainStatus(null); }}
                      placeholder="onboard.youragency.com"
                    />
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Enter your subdomain, save settings, then follow the DNS instructions below.
                    </p>
                  </div>

                  {wl.custom_domain && wlLoaded && (
                    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 space-y-3">
                      <div className="text-sm font-medium text-[var(--color-text-primary)]">DNS setup</div>

                      <div className="space-y-1">
                        <p className="text-xs text-[var(--color-text-muted)]">Add this CNAME record with your DNS provider:</p>
                        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-panel)] p-3 text-xs font-mono">
                          <span className="text-[var(--color-text-muted)]">Name</span>
                          <span className="text-[var(--color-text-primary)] break-all">{wl.custom_domain}</span>
                          <span className="text-[var(--color-text-muted)]">Type</span>
                          <span className="text-[var(--color-text-primary)]">CNAME</span>
                          <span className="text-[var(--color-text-muted)]">Value</span>
                          <span className="text-[var(--color-text-primary)]">cname.vercel-dns.com</span>
                          <span className="text-[var(--color-text-muted)]">TTL</span>
                          <span className="text-[var(--color-text-primary)]">Auto</span>
                        </div>
                      </div>

                      {domainStatus?.verificationRecord && (
                        <div className="space-y-1">
                          <p className="text-xs text-[var(--color-text-muted)]">Also add this TXT record to prove domain ownership:</p>
                          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-panel)] p-3 text-xs font-mono">
                            <span className="text-[var(--color-text-muted)]">Name</span>
                            <span className="text-[var(--color-text-primary)] break-all">{domainStatus.verificationRecord.domain}</span>
                            <span className="text-[var(--color-text-muted)]">Type</span>
                            <span className="text-[var(--color-text-primary)]">TXT</span>
                            <span className="text-[var(--color-text-muted)]">Value</span>
                            <span className="text-[var(--color-text-primary)] break-all">{domainStatus.verificationRecord.value}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <Button type="button" variant="secondary" onClick={checkDomain} disabled={domainChecking}>
                          {domainChecking ? "Checking…" : "Verify domain"}
                        </Button>
                        {domainStatus && (
                          domainStatus.verified
                            ? <span className="text-xs font-medium text-green-600">✓ Verified — domain is live</span>
                            : <span className="text-xs text-[var(--color-text-muted)]">Not verified yet — DNS changes can take up to 48 hours.</span>
                        )}
                        {domainCheckError && <span className="text-xs text-red-600">{domainCheckError}</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3">
                <input
                  id="wl_remove_branding"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer"
                  checked={wl.remove_branding}
                  onChange={(e) => setWl((v) => ({ ...v, remove_branding: e.target.checked }))}
                />
                <div>
                  <label htmlFor="wl_remove_branding" className="cursor-pointer text-sm font-medium text-[var(--color-text-primary)]">
                    Remove "Powered by ClientEnforce" branding
                  </label>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                    When checked, the ClientEnforce footer badge is hidden from all client portals in your organisation.
                  </p>
                </div>
              </div>

              {wl.logo_url ? (
                <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Logo preview</div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={wl.logo_url} alt="Brand logo" className="max-h-12 max-w-[200px] object-contain" />
                </div>
              ) : null}

              <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)]">
                <Button onClick={saveWhiteLabel} disabled={wlSaving}>
                  {wlSaving ? "Saving…" : "Save white-label settings"}
                </Button>
                {wlLoaded ? (
                  <Button variant="secondary" onClick={loadWhiteLabel} disabled={wlLoading}>
                    Reload
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payments — enterprise only */}
      {org?.feature_flags?.enterprise_onboarding === true && (
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>
            Connect your Stripe account to accept payments directly from exhibitors during onboarding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!process.env.NEXT_PUBLIC_STRIPE_CONNECT_CLIENT_ID && !org?.stripe_account_id ? (
            // No STRIPE_CONNECT_CLIENT_ID env var — show graceful note
            // We check the public env var here; the real check happens server-side
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm text-[var(--color-text-muted)]">
              Stripe Connect not configured. Add <code className="font-mono text-xs">STRIPE_CONNECT_CLIENT_ID</code> to your environment to enable payments.
            </div>
          ) : org?.stripe_account_id ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--color-success)]">✓ Stripe connected</span>
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-2 py-0.5 font-mono text-xs text-[var(--color-text-muted)]">
                  {org.stripe_account_id.length > 20
                    ? `${org.stripe_account_id.slice(0, 10)}…${org.stripe_account_id.slice(-6)}`
                    : org.stripe_account_id}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Refunds must be processed directly in your Stripe dashboard.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={disconnectStripe}
                disabled={stripeConnectBusy}
              >
                {stripeConnectBusy ? "Disconnecting…" : "Disconnect"}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Connect Stripe to accept payments from exhibitors directly into your account.
              </p>
              <Button
                onClick={() => { window.location.href = "/api/stripe/connect"; }}
                disabled={stripeConnectBusy}
              >
                Connect Stripe →
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      )}

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
              <Select
                id="inviteRole"
                value={inviteRole}
                disabled={!canInviteMembers}
                onChange={(e) => setInviteRole(e.target.value as any)}
              >
                <option value="admin">Admin — full access, manage team &amp; settings</option>
                <option value="onboarder">Onboarder — create &amp; send onboardings, manage templates</option>
                <option value="reviewer">Reviewer — review &amp; approve submissions</option>
                {org?.feature_flags?.enterprise_onboarding === true && (
                  <option value="external_viewer">Guest Viewer — read-only access to specific events</option>
                )}
              </Select>
            </div>
          </div>

          {inviteRole === "external_viewer" && org?.feature_flags?.enterprise_onboarding === true && (
            <div className="space-y-2">
              <Label>Which events can this person see? <span className="text-red-500">*</span></Label>
              {availableEvents.length === 0 ? (
                <p className="text-sm text-[var(--color-text-muted)]">
                  {eventsLoaded ? "No events available." : "Loading events…"}
                </p>
              ) : (
                <div className="max-h-48 overflow-y-auto rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3 space-y-2">
                  {availableEvents.map((ev) => (
                    <label key={ev.id} className="flex items-center gap-2 cursor-pointer text-sm text-[var(--color-text-primary)]">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={selectedEventIds.includes(ev.id)}
                        onChange={(e) => {
                          setSelectedEventIds((prev) =>
                            e.target.checked ? [...prev, ev.id] : prev.filter((id) => id !== ev.id)
                          );
                        }}
                      />
                      {ev.name}
                    </label>
                  ))}
                </div>
              )}
              {selectedEventIds.length === 0 && (
                <p className="text-xs text-[var(--color-text-muted)]">At least one event must be selected.</p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {canInviteMembers ? (
              <Button
                onClick={createInvite}
                disabled={
                  inviting ||
                  (inviteRole === "external_viewer" && selectedEventIds.length === 0)
                }
              >
                {inviting ? "Creating…" : "Create invite"}
              </Button>
            ) : null}
          </div>

          <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-panel)]">
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
                          <Button size="xs" variant="secondary" onClick={() => copyInviteLink(i.token)}>
                            Copy link
                          </Button>
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
