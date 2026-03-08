import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireRole, requireProfile } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { resend } from "@/lib/resend";

const Schema = z.object({
  email: z.string().email(),
  role: z.enum(["member", "admin"]),
});
// NOTE: In this project the `invites` table stores the recipient email in `invited_email`.
// If you rename the column in SQL, update this constant.
const INVITE_EMAIL_COL = "invited_email" as const;

function makeInviteToken() {
  // URL-safe, random token (required by NOT NULL constraint on invites.token)
  return crypto.randomBytes(32).toString("base64url");
}

function normalizeTier(raw: unknown): "free" | "pro" | "business" {
  const value = String(raw ?? "free").trim().toLowerCase();
  if (value === "business") return "business";
  if (value === "pro") return "pro";
  if (value === "starter") return "free";
  return "free";
}

function maxAdminsForTier(tier: "free" | "pro" | "business") {
  if (tier === "business") return 15;
  if (tier === "pro") return 5;
  return 1;
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let profile;
  let parsed;
  let admin: any;

  try {
    const role = await requireRole(["owner", "admin", "member"]);
    if (!roleHasPermission(role, "invites_create")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    profile = await requireProfile();

    const body = await req.json().catch(() => null);
    parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    admin = supabaseAdmin() as any;
  } catch (e: any) {
    const msg = e?.message ?? "Forbidden";
    // If requireAdmin/requireProfile throws, treat as forbidden.
    return NextResponse.json({ error: msg }, { status: 403 });
  }

  // Seat check: memberships + pending invites <= seats_limit
  const primaryOrg = await (admin as any)
    .from("organizations")
    .select("seats_limit, tier, plan_tier")
    .eq("id", profile!.org_id)
    .single();

  let org = primaryOrg.data as any;
  let orgErr = primaryOrg.error as any;

  if (orgErr && /plan_tier/i.test(String(orgErr?.message || ""))) {
    const fallbackOrg = await (admin as any)
      .from("organizations")
      .select("seats_limit, tier")
      .eq("id", profile!.org_id)
      .single();
    org = fallbackOrg.data as any;
    orgErr = fallbackOrg.error as any;
  }

  if (orgErr) return NextResponse.json({ error: orgErr.message }, { status: 400 });

  const [{ count: memberCount, error: mcErr }, { count: inviteCount, error: icErr }] = await Promise.all([
    (admin as any).from("memberships").select("*", { count: "exact", head: true }).eq("org_id", profile!.org_id),
    (admin as any)
      .from("invites")
      .select("*", { count: "exact", head: true })
      .eq("org_id", profile!.org_id)
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString()),
  ]);

  if (mcErr) return NextResponse.json({ error: mcErr.message }, { status: 400 });
  if (icErr) return NextResponse.json({ error: icErr.message }, { status: 400 });

  const used = (memberCount || 0) + (inviteCount || 0);
  const seatsLimit =
    typeof (org as any)?.seats_limit === "number" && Number.isFinite((org as any).seats_limit)
      ? (org as any).seats_limit
      : 0;

  if (seatsLimit > 0 && used >= seatsLimit) {
    return NextResponse.json({ error: `Seat limit reached (${seatsLimit}). Upgrade to add more seats.` }, { status: 409 });
  }

  const tier = normalizeTier((org as any)?.tier ?? (org as any)?.plan_tier);
  const maxAdmins = maxAdminsForTier(tier);

  if (parsed!.data.role === "admin") {
    const [{ count: currentAdminCount, error: adminCountErr }, { count: pendingAdminInviteCount, error: adminInviteCountErr }] = await Promise.all([
      (admin as any)
        .from("memberships")
        .select("*", { count: "exact", head: true })
        .eq("org_id", profile!.org_id)
        .in("role", ["owner", "admin"]),
      (admin as any)
        .from("invites")
        .select("*", { count: "exact", head: true })
        .eq("org_id", profile!.org_id)
        .eq("role", "admin")
        .is("accepted_at", null)
        .gt("expires_at", new Date().toISOString()),
    ]);

    if (adminCountErr) return NextResponse.json({ error: adminCountErr.message }, { status: 400 });
    if (adminInviteCountErr) return NextResponse.json({ error: adminInviteCountErr.message }, { status: 400 });

    const totalAdmins = (currentAdminCount || 0) + (pendingAdminInviteCount || 0);
    if (totalAdmins >= maxAdmins) {
      return NextResponse.json(
        {
          error:
            tier === "free"
              ? "Your current plan allows 1 admin user. Upgrade to Pro to add more admins."
              : tier === "pro"
                ? "Your current plan allows up to 5 admin users. Upgrade to Business to add more admins."
                : `Your current plan allows up to ${maxAdmins} admin users.`,
        },
        { status: 403 }
      );
    }
  }

  // Prevent duplicate invite for same email (active)
  const email = parsed!.data.email.toLowerCase();
  const { data: existing, error: existingErr } = await (admin as any)
    .from("invites")
    .select("id")
    .eq("org_id", profile!.org_id)
    .eq(INVITE_EMAIL_COL, email)
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (existingErr) {
    return NextResponse.json({ error: existingErr.message }, { status: 400 });
  }

  if (existing?.id) {
    return NextResponse.json({ error: "An active invite already exists for this email." }, { status: 409 });
  }

  const insertPayload: Record<string, any> = {
    org_id: profile!.org_id,
    role: parsed!.data.role,
    invited_by_user_id: userData.user.id,
    token: makeInviteToken(),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
  insertPayload[INVITE_EMAIL_COL] = email;

  const { data: invite, error: inviteErr } = await (admin as any)
    .from("invites")
    .insert(insertPayload)
    // Select all to avoid schema-cache issues if the column name differs.
    .select("*")
    .single();

  if (inviteErr) return NextResponse.json({ error: inviteErr.message }, { status: 400 });

  try {
    await (admin as any).from("audit_logs").insert({
      org_id: profile!.org_id,
      actor_user_id: userData.user.id,
      action: "team.invited",
      entity_type: "invite",
      entity_id: invite.id,
      metadata: { email: (invite as any)[INVITE_EMAIL_COL], role: invite.role },
    });
  } catch (e: any) {
    console.error("audit_logs insert failed", e);
  }

  // Build an invite URL safely (do not crash if env is missing)
  const envAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  const xfProto = req.headers.get("x-forwarded-proto");
  const xfHost = req.headers.get("x-forwarded-host");
  const host = xfHost || req.headers.get("host");
  const proto = xfProto || "http";
  const origin = req.headers.get("origin") || (host ? `${proto}://${host}` : undefined);
  const appUrl = envAppUrl || origin || "";
  // If we don't know the absolute origin, fall back to a relative URL.
  const inviteUrl = appUrl
    ? `${appUrl.replace(/\/$/, "")}/dashboard/settings?invite=${invite.token}`
    : `/dashboard/settings?invite=${invite.token}`;

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const fromName = process.env.RESEND_FROM_NAME || "ClientEnforce";
  const from = `${fromName} <${fromEmail}>`;

  if (process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from,
        to: [(invite as any)[INVITE_EMAIL_COL]],
        subject: "You’ve been invited to ClientEnforce",
        html: `
          <div style="font-family: ui-sans-serif, system-ui; line-height: 1.5;">
            <p>You’ve been invited to join a team on ClientEnforce.</p>
            <p><a href="${inviteUrl}">${inviteUrl}</a></p>
            <p>This invite expires on ${new Date(invite.expires_at).toLocaleString()}.</p>
          </div>
        `,
      });
    } catch (e: any) {
      // Email failures should not block invite creation.
      console.error("Resend invite email failed", e);
    }
  }

  return NextResponse.json({
    invite: {
      id: invite.id,
      email: (invite as any)[INVITE_EMAIL_COL],
      role: invite.role,
      token: invite.token,
      expires_at: invite.expires_at,
    },
    inviteUrl,
  });
}
