import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import {
  adminLimitMessage,
  permissionDenied,
  selectOrganizationTier,
  teamInviteUnavailableMessage,
  teamInvitesEnabledForTier,
} from "@/lib/plan-enforcement";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await supabaseServer();
  const admin = supabaseAdmin();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();

  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "team_members_view")) {
    return NextResponse.json({ error: permissionDenied("You do not have access to view team members.") }, { status: 403 });
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

  const { tier, error: tierErr } = await selectOrganizationTier(admin, profile.org_id);
  if (tierErr) return NextResponse.json({ error: tierErr.message }, { status: 400 });

  const { data: orgMeta, error: oErr } = await admin
    .from("organizations")
    .select("seats_limit, stripe_subscription_status")
    .eq("id", profile.org_id)
    .single();

  if (oErr) return NextResponse.json({ error: oErr.message }, { status: 400 });

  const org = {
    ...(orgMeta ?? {}),
    tier,
  };

  return NextResponse.json({ members: members ?? [], invites: invites ?? [], org });
}

function makeInviteToken() {
  // URL-safe token
  return crypto.randomBytes(32).toString("base64url");
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();

  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "invites_create")) {
    return NextResponse.json({ error: permissionDenied("You do not have access to invite team members.") }, { status: 403 });
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

  const { tier, error: tierError } = await selectOrganizationTier(admin, profile.org_id);
  if (tierError) return NextResponse.json({ error: tierError.message }, { status: 400 });

  const { data: orgLimits, error: orgLimitErr } = await admin
    .from("organizations")
    .select("seats_limit")
    .eq("id", profile.org_id)
    .single();
  if (orgLimitErr) return NextResponse.json({ error: orgLimitErr.message }, { status: 400 });

  const maxAdmins = tier === "business" ? 15 : tier === "pro" ? 5 : 1;

  if (!teamInvitesEnabledForTier(tier)) {
    return NextResponse.json({ error: teamInviteUnavailableMessage() }, { status: 403 });
  }

  const seatsLimit =
    typeof orgLimits?.seats_limit === "number" && Number.isFinite(orgLimits.seats_limit)
      ? orgLimits.seats_limit
      : 0;

  const [{ count: memberCount, error: memberCountErr }, { count: inviteCount, error: inviteCountErr }] = await Promise.all([
    admin
      .from("memberships")
      .select("*", { count: "exact", head: true })
      .eq("org_id", profile.org_id),
    admin
      .from("invites")
      .select("*", { count: "exact", head: true })
      .eq("org_id", profile.org_id)
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString()),
  ]);

  if (memberCountErr) return NextResponse.json({ error: memberCountErr.message }, { status: 400 });
  if (inviteCountErr) return NextResponse.json({ error: inviteCountErr.message }, { status: 400 });

  const seatsUsed = (memberCount || 0) + (inviteCount || 0);
  if (seatsLimit > 0 && seatsUsed >= seatsLimit) {
    return NextResponse.json(
      { error: `Plan upgrade required: Seat limit reached (${seatsLimit}). Upgrade to add more team members.` },
      { status: 409 }
    );
  }

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
          error: adminLimitMessage(tier, maxAdmins),
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
