import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type DowngradeTier = "free" | "pro";
type DowngradeInterval = "monthly" | "yearly";

function json(status: number, body: Record<string, any>) {
  return NextResponse.json(body, { status });
}

function seatsForTier(tier: DowngradeTier) {
  if (tier === "pro") return 5;
  return 1;
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return json(401, { error: "Unauthorized" });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "billing_manage")) {
    return json(403, { error: "Forbidden" });
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const tier = String(body?.tier ?? "").trim().toLowerCase() as DowngradeTier;
  const interval = String(body?.interval ?? "monthly").trim().toLowerCase() as DowngradeInterval;

  if (tier !== "free" && tier !== "pro") {
    return json(400, { error: "Downgrade tier must be 'free' or 'pro'." });
  }

  if (interval !== "monthly" && interval !== "yearly") {
    return json(400, { error: "Interval must be 'monthly' or 'yearly'." });
  }

  const admin = typeof supabaseAdmin === "function" ? (supabaseAdmin as any)() : (supabaseAdmin as any);

  const { data: org, error: orgError } = await admin
    .from("organizations")
    .select(
      "id, name, tier, stripe_customer_id, stripe_subscription_id, stripe_subscription_status, seats_limit, pending_tier, pending_interval"
    )
    .eq("id", profile.org_id)
    .single();

  if (orgError) return json(400, { error: orgError.message });
  if (!org) return json(404, { error: "Organization not found" });

  const currentTier = String((org as any).tier ?? "free").trim().toLowerCase();

  if (currentTier === "free") {
    return json(400, { error: "Your organization is already on the free plan." });
  }

  if (currentTier === tier) {
    return json(400, { error: `Your organization is already on ${tier}.` });
  }

  const subscriptionId = String((org as any).stripe_subscription_id ?? "").trim();

  if (!subscriptionId) {
    if (tier === "free") {
      const { error: updateError } = await admin
        .from("organizations")
        .update({
          tier: "free",
          seats_limit: seatsForTier("free"),
          stripe_subscription_status: "none",
          pending_tier: null,
          pending_interval: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.org_id);

      if (updateError) return json(400, { error: updateError.message });

      return json(200, {
        ok: true,
        mode: "immediate",
        message: "Downgraded to Free.",
      });
    }

    return json(400, {
      error: "No active Stripe subscription found to downgrade from.",
    });
  }

  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  } catch (e: any) {
    const message = String(e?.message || "Failed to schedule downgrade");
    return json(400, { error: message });
  }

  const pendingSeats = seatsForTier(tier);

  const { error: updateError } = await admin
    .from("organizations")
    .update({
      pending_tier: tier,
      pending_interval: interval,
      pending_seats_limit: pendingSeats,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.org_id);

  if (updateError) {
    return json(400, { error: updateError.message });
  }

  return json(200, {
    ok: true,
    mode: "period_end",
    message:
      tier === "free"
        ? "Your paid plan will remain active until the end of the billing period, then downgrade to Free."
        : `Your current plan will remain active until the end of the billing period, then downgrade to ${tier}.`,
    pending_tier: tier,
    pending_interval: interval,
  });
}
