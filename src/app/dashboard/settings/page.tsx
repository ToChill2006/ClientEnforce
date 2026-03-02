"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

function pill(text: string) {
  return "inline-flex items-center rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs font-medium text-zinc-700";
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

  // Inline banners (no toast dependency)
  const [pageError, setPageError] = React.useState<string | null>(null);
  const [pageSuccess, setPageSuccess] = React.useState<string | null>(null);
  // When returning from Stripe, we may need to wait a moment for the webhook to update DB.
  const [syncingBilling, setSyncingBilling] = React.useState(false);

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

  React.useEffect(() => {
    load();

    // If Stripe redirected back with success params, poll briefly until webhook updates DB.
    const params = new URLSearchParams(window.location.search);
    const returnedFromStripe =
      params.has("billing_success") ||
      params.has("checkout_success") ||
      params.has("session_id") ||
      params.has("success") ||
      params.has("stripe");

    if (!returnedFromStripe) return;

    let cancelled = false;
    let attempts = 0;

    setSyncingBilling(true);

    const tick = async () => {
      attempts += 1;
      try {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createInvite() {
    const email = inviteEmail.trim().toLowerCase();

    // Seats gating (if your plan enforces a limit)
    if (seatsLimit > 0 && seatsUsed >= seatsLimit) {
      setPageError("You’ve reached your seat limit. Upgrade your plan or remove a member to invite someone new.");
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
          lastErr = json?.error || res.statusText || "Invite failed";
          break;
        }

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
      if (!res.ok) throw new Error(json?.error || "Failed to open billing portal");
      if (!json?.url) throw new Error("Billing portal URL missing");
      window.location.href = json.url;
    } catch (e: any) {
      setPageError(e?.message ?? "Billing portal failed");
    }
  }

  async function startUpgrade(plan: "pro" | "business") {
    setPageError(null);
    setPageSuccess(null);

    try {
      // Prefer a checkout endpoint if present; fall back to /pricing if not.
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          tier: plan, // checkout expects `tier`: "pro" | "business"
          return_url: `${window.location.origin}/dashboard/settings`,
        }),
      });
      const json = await res.json().catch(() => null);

      if (res.status === 404) {
        window.location.href = "/pricing";
        return;
      }

      if (!res.ok) throw new Error(json?.error || "Failed to start upgrade");
      if (!json?.url) throw new Error("Checkout URL missing");
      window.location.href = json.url;
    } catch (e: any) {
      setPageError(e?.message ?? "Upgrade failed");
    }
  }

  const seatsLimit = org?.seats_limit ?? 0;
  const seatsText = seatsLimit > 0 ? `${seatsUsed} / ${seatsLimit} seats used` : `${seatsUsed} seat(s) used`;
  const currentTier = normalizeTier(org?.tier);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">Settings</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Organization settings, billing, and team invites.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={load} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </Button>
          <Link className="text-sm text-zinc-600 hover:text-zinc-900" href="/dashboard/team">
            Team
          </Link>
        </div>
      </div>

      {pageError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-medium">Error</div>
              <div className="mt-0.5">{pageError}</div>
            </div>
            <button
              className="text-red-700/70 hover:text-red-900"
              onClick={() => setPageError(null)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}

      {pageSuccess ? (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
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
        <div className="rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-medium">Updating subscription…</div>
              <div className="mt-0.5 text-zinc-600">We’re syncing your Stripe subscription. This can take a few seconds.</div>
            </div>
            <button
              className="text-zinc-500 hover:text-zinc-800"
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
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Tier</div>
            <div className="mt-1 text-sm font-medium text-zinc-900">{org?.tier ?? "—"}</div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Seats</div>
            <div className="mt-1 text-sm font-medium text-zinc-900">{seatsText}</div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Subscription</div>
            <div className="mt-1 text-sm font-medium text-zinc-900">
              {org?.stripe_subscription_status ?? "—"}
            </div>
          </div>

          <div className="md:col-span-3 flex flex-wrap gap-2">
            <Button onClick={openBillingPortal}>Manage billing</Button>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade */}
      <Card>
        <CardHeader>
          <CardTitle>Upgrade</CardTitle>
          <CardDescription>Unlock more seats, automation, and advanced controls.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-900">Free</div>
              {currentTier === "free" ? <span className={pill("Free")}>Current</span> : null}
            </div>
            <ul className="mt-3 space-y-1 text-sm text-zinc-700">
              <li>• 1 seat</li>
              <li>• Basic onboarding</li>
              <li>• Limited automation</li>
            </ul>
            <div className="mt-4 text-xs text-zinc-500">
              {currentTier === "free" ? "You’re currently on the free tier." : "You’re on a paid plan."}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-900">Pro</div>
              {currentTier === "pro" ? <span className={pill("Pro")}>Current</span> : null}
            </div>
            <ul className="mt-3 space-y-1 text-sm text-zinc-700">
              <li>• More seats</li>
              <li>• Follow-ups & reminders</li>
              <li>• Better reporting</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => startUpgrade("pro")} disabled={currentTier === "pro" || currentTier === "business"}>
                {currentTier === "pro" ? "Current plan" : currentTier === "business" ? "Already on Business" : "Upgrade to Pro"}
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-900">Business</div>
              {currentTier === "business" ? <span className={pill("Business")}>Current</span> : null}
            </div>
            <ul className="mt-3 space-y-1 text-sm text-zinc-700">
              <li>• Higher seat limits</li>
              <li>• Advanced permissions</li>
              <li>• Priority support</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => startUpgrade("business")} disabled={currentTier === "business"}>
                {currentTier === "business" ? "Current plan" : "Upgrade to Business"}
              </Button>
            </div>
          </div>

          <div className="md:col-span-3 text-xs text-zinc-500">
            If you’ve just upgraded, it may take a few seconds to reflect here. Hit Refresh if it doesn’t update.
          </div>
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team members</CardTitle>
          <CardDescription>Who has access to this workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-zinc-700">{seatsText}</div>
            {seatsLimit > 0 && seatsUsed >= seatsLimit ? (
              <div className="text-xs text-amber-700">Seat limit reached</div>
            ) : null}
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-zinc-600">
                      Loading…
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-zinc-600">
                      No members found.
                    </td>
                  </tr>
                ) : (
                  members.map((m, idx) => {
                    const email = (m.email ?? "").toString();
                    const name = (m.full_name ?? "").toString().trim();
                    const label = name ? `${name} — ${email}` : email || `Member ${idx + 1}`;
                    return (
                      <tr key={m.user_id ?? m.id ?? `${idx}`} className="hover:bg-zinc-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-zinc-900">{label}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={pill((m.role as string) || "member")}>{(m.role as string) || "member"}</span>
                        </td>
                        <td className="px-4 py-3 text-zinc-700">{fmtDate(m.created_at)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-zinc-500">
            To remove members or change roles, go to the Team page.
          </div>
        </CardContent>
      </Card>

      {/* Invite */}
      <Card>
        <CardHeader>
          <CardTitle>Invite members</CardTitle>
          <CardDescription>
            Create an invite link for a teammate. Admins can invite and assign roles.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="md:col-span-2 space-y-1">
              <Label htmlFor="inviteEmail">Email</Label>
              <Input
                id="inviteEmail"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="teammate@company.com"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="inviteRole">Role</Label>
              <select
                id="inviteRole"
                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={createInvite} disabled={inviting || !inviteEmail.trim() || (seatsLimit > 0 && seatsUsed >= seatsLimit)}>
              {inviting ? "Creating…" : "Create invite"}
            </Button>
            <Link href="/dashboard/team" className="inline-flex">
              <Button variant="secondary">Manage team</Button>
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
            <table className="w-full min-w-[840px] text-sm">
              <thead className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Created</th>
                  <th className="px-4 py-2 text-left">Expires</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-zinc-600">
                      Loading…
                    </td>
                  </tr>
                ) : invites.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-zinc-600">
                      No pending invites.
                    </td>
                  </tr>
                ) : (
                  invites.map((i) => (
                    <tr key={i.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-zinc-900">{inviteEmailOf(i) || "—"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={pill(i.role)}>{i.role}</span>
                      </td>
                      <td className="px-4 py-3 text-zinc-700">{fmtDate(i.created_at)}</td>
                      <td className="px-4 py-3 text-zinc-700">{fmtDate(i.expires_at)}</td>
                      <td className="px-4 py-3 text-zinc-700">{i.accepted_at ? "Accepted" : "Pending"}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
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

          <div className="text-xs text-zinc-500">
            Invite links are used for onboarding internal team members. Client invitations remain in the Onboardings flow.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}