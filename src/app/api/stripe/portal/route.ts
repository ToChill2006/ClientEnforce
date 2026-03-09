import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import {
  billingPortalEnabledForTier,
  billingPortalUnavailableMessage,
  permissionDenied,
  selectOrganizationTier,
} from "@/lib/plan-enforcement";
import { appOrigin } from "@/lib/app-url";

export const runtime = "nodejs";

function safeSameOriginUrl(input: unknown, origin: string): string | null {
  if (typeof input !== "string") return null;
  const value = input.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.origin !== origin) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await requireRole(["owner", "admin", "member"]);
  if (!roleHasPermission(role, "billing_manage")) {
    return NextResponse.json({ error: permissionDenied("You do not have access to manage billing.") }, { status: 403 });
  }

  const { data: profile, error: pErr } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("user_id", userData.user.id)
    .single();

  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 400 });

  const { data: org, error: oErr } = await supabase
    .from("organizations")
    .select("stripe_customer_id")
    .eq("id", profile.org_id)
    .single();

  if (oErr) return NextResponse.json({ error: oErr.message }, { status: 400 });

  const { tier, error: tierErr } = await selectOrganizationTier(supabase, profile.org_id);
  if (tierErr) return NextResponse.json({ error: tierErr.message }, { status: 400 });
  if (!billingPortalEnabledForTier(tier)) {
    return NextResponse.json({ error: billingPortalUnavailableMessage() }, { status: 403 });
  }

  if (!org.stripe_customer_id) {
    return NextResponse.json({ error: "No Stripe customer yet. Upgrade first." }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const bodyReturnUrl = typeof body?.return_url === "string" ? body.return_url : null;
  const origin = appOrigin();

  const returnUrl = safeSameOriginUrl(bodyReturnUrl, origin) ||
    safeSameOriginUrl(process.env.STRIPE_PORTAL_RETURN_URL, origin) ||
    `${origin}/dashboard/settings`;

  const portal = await stripe.billingPortal.sessions.create({
    customer: org.stripe_customer_id,
    return_url: returnUrl,
  });

  return NextResponse.json({ url: portal.url });
}
