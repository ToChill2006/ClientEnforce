import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { appOrigin } from "@/lib/app-url";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const orgId = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const origin = appOrigin();

  if (error) {
    const desc = url.searchParams.get("error_description") ?? error;
    return NextResponse.redirect(`${origin}/dashboard/settings?stripe=error&message=${encodeURIComponent(desc)}`);
  }

  if (!code || !orgId) {
    return NextResponse.redirect(`${origin}/dashboard/settings?stripe=error&message=Missing+parameters`);
  }

  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const tokenRes = await fetch("https://connect.stripe.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${secretKey}`,
      },
      body: new URLSearchParams({ grant_type: "authorization_code", code }),
    });

    const response = await tokenRes.json();
    if (!tokenRes.ok) {
      throw new Error(response?.error_description ?? response?.error ?? "OAuth token exchange failed");
    }

    const stripeUserId: string = response.stripe_user_id;
    if (!stripeUserId) {
      throw new Error("No stripe_user_id in OAuth response");
    }

    const admin = supabaseAdmin();
    const { error: dbErr } = await admin
      .from("organizations")
      .update({ stripe_account_id: stripeUserId })
      .eq("id", orgId);

    if (dbErr) throw new Error(dbErr.message);

    return NextResponse.redirect(`${origin}/dashboard/settings?stripe=connected`);
  } catch (e: any) {
    console.error("[stripe-connect-callback] failed", e?.message ?? e);
    return NextResponse.redirect(
      `${origin}/dashboard/settings?stripe=error&message=${encodeURIComponent(e?.message ?? "Connection failed")}`
    );
  }
}
