import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile } from "@/lib/rbac";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await supabaseServer();
  const admin = supabaseAdmin();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();

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

export async function POST(req: Request) {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const emailRaw = (body?.email ?? body?.to_email ?? body?.invitee_email ?? body?.invited_email ?? "") as string;
  const email = String(emailRaw).trim().toLowerCase();
  const role = String(body?.role ?? "member").trim();

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
      role,
      token,
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