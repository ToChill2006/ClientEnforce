import { NextResponse } from "next/server";
import { requireProfile } from "@/lib/rbac";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { appOrigin } from "@/lib/app-url";

export const runtime = "nodejs";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

// GET — initiate Stripe Connect OAuth flow
export async function GET() {
  const clientId = process.env.STRIPE_CONNECT_CLIENT_ID;
  if (!clientId) {
    return json(503, { error: "Stripe Connect not configured" });
  }

  let profile: { org_id: string };
  try {
    profile = await requireProfile();
  } catch (e: any) {
    return json(401, { error: "Unauthorised" });
  }

  const origin = appOrigin();
  const redirectUri = `${origin}/api/stripe/connect/callback`;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: "read_write",
    state: profile.org_id,
    redirect_uri: redirectUri,
  });

  const oauthUrl = `https://connect.stripe.com/oauth/authorize?${params.toString()}`;

  return NextResponse.redirect(oauthUrl);
}

// PATCH — disconnect Stripe account
export async function PATCH(req: Request) {
  let profile: { org_id: string };
  try {
    profile = await requireProfile();
  } catch (e: any) {
    return json(401, { error: "Unauthorised" });
  }

  const body = await req.json().catch(() => null);
  if (!body?.disconnect) {
    return json(400, { error: "Expected { disconnect: true }" });
  }

  const admin = supabaseAdmin();
  const { error } = await admin
    .from("organizations")
    .update({ stripe_account_id: null })
    .eq("id", profile.org_id);

  if (error) {
    return json(500, { error: error.message });
  }

  return json(200, { ok: true });
}
