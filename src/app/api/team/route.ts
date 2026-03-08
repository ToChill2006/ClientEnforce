import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await supabaseServer();
  const admin = supabaseAdmin();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();

  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "team_members_view")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch memberships without embedded relationship
  const { data: memberships, error: mErr } = await supabase
    .from("memberships")
    .select("user_id, role, created_at")
    .eq("org_id", profile.org_id)
    .order("created_at", { ascending: true });

  if (mErr) return NextResponse.json({ error: mErr.message }, { status: 400 });

  const userIds = Array.from(
    new Set((memberships ?? []).map((m: any) => m.user_id).filter(Boolean).map(String))
  );

  let profilesByUserId = new Map<string, { full_name: string | null; email: string | null }>();

  if (userIds.length > 0) {
    const { data: profs, error: pErr } = await admin
      .from("profiles")
      .select("user_id, full_name, email")
      .in("user_id", userIds);

    if (pErr) return NextResponse.json({ error: pErr.message }, { status: 400 });

    for (const p of profs ?? []) {
      profilesByUserId.set(String((p as any).user_id), {
        full_name: (p as any).full_name ?? null,
        email: (p as any).email ?? null,
      });
    }
  }

  const members = (memberships ?? []).map((m: any) => {
    const profileData = profilesByUserId.get(String(m.user_id));
    const full_name = profileData?.full_name ?? null;
    const email = profileData?.email ?? null;
    return {
      user_id: m.user_id,
      role: m.role,
      created_at: m.created_at,
      full_name,
      email,
      display_name: full_name || email || String(m.user_id),
    };
  });

  const { data: invitesRaw, error: iErr } = await supabase
    .from("invites")
    .select("*")
    .eq("org_id", profile.org_id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (iErr) return NextResponse.json({ error: iErr.message }, { status: 400 });

  const invites = (invitesRaw ?? []).map((r: any) => ({
    id: r.id,
    email:
      r.email ??
      r.to_email ??
      r.invitee_email ??
      r.invited_email ??
      r.recipient_email ??
      r.user_email ??
      null,
    role: r.role ?? "member",
    token: r.token ?? null,
    expires_at: r.expires_at ?? null,
    accepted_at: r.accepted_at ?? null,
    created_at: r.created_at ?? null,
  }));

  const { data: org, error: oErr } = await admin
    .from("organizations")
    .select("tier, seats_limit, stripe_subscription_status")
    .eq("id", profile.org_id)
    .single();

  if (oErr) return NextResponse.json({ error: oErr.message }, { status: 400 });

  return NextResponse.json({ members: members ?? [], invites: invites ?? [], org });
}

function makeInviteToken() {
  // URL-safe token
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

export async function POST(req: Request) {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();

  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "invites_create")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const emailRaw = (body?.email ?? body?.to_email ?? body?.invitee_email ?? body?.invited_email ?? "") as string;
  const email = String(emailRaw).trim().toLowerCase();
  const inviteRole = String(body?.role ?? "member").trim();

  const admin = supabaseAdmin();

  const primaryOrg = await admin
    .from("organizations")
    .select("tier, plan_tier")
    .eq("id", profile.org_id)
    .single();

  let org = primaryOrg.data as any;
  let orgErr = primaryOrg.error as any;

  if (orgErr && /plan_tier/i.test(String(orgErr?.message || ""))) {
    const fallbackOrg = await admin
      .from("organizations")
      .select("tier")
      .eq("id", profile.org_id)
      .single();
    org = fallbackOrg.data as any;
    orgErr = fallbackOrg.error as any;
  }

  if (orgErr) return NextResponse.json({ error: orgErr.message }, { status: 400 });

  const tier = normalizeTier((org as any)?.tier ?? (org as any)?.plan_tier);
  const maxAdmins = maxAdminsForTier(tier);

  if (inviteRole === "admin") {
    const [{ count: currentAdmins, error: adminErr }, { count: pendingAdminInvites, error: inviteErr }] = await Promise.all([
      admin
        .from("memberships")
        .select("*", { count: "exact", head: true })
        .eq("org_id", profile.org_id)
        .in("role", ["owner", "admin"]),
      admin
        .from("invites")
        .select("*", { count: "exact", head: true })
        .eq("org_id", profile.org_id)
        .eq("role", "admin")
        .is("accepted_at", null)
        .gt("expires_at", new Date().toISOString()),
    ]);

    if (adminErr) return NextResponse.json({ error: adminErr.message }, { status: 400 });
    if (inviteErr) return NextResponse.json({ error: inviteErr.message }, { status: 400 });

    const totalAdmins = (currentAdmins || 0) + (pendingAdminInvites || 0);

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

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const token = makeInviteToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  // IMPORTANT: the column is `invited_email` (not `email` / `invite_email`).
  const { data: invite, error } = await supabase
    .from("invites")
    .insert({
      org_id: profile.org_id,
      invited_email: email,
      role: inviteRole,
      status: "pending",
      expires_at: expiresAt,
      invited_by_user_id: userData.user.id,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ invite });
}
