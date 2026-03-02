import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile } from "@/lib/rbac";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await supabaseServer();
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
    const { data: profs, error: pErr } = await supabase
      .from("profiles")
      .select("user_id, full_name, email")
      .eq("org_id", profile.org_id)
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
    return {
      user_id: m.user_id,
      role: m.role,
      created_at: m.created_at,
      full_name: profileData?.full_name ?? null,
      email: profileData?.email ?? null,
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

  const { data: org, error: oErr } = await supabase
    .from("organizations")
    .select("tier, seats_limit, stripe_subscription_status")
    .eq("id", profile.org_id)
    .single();

  if (oErr) return NextResponse.json({ error: oErr.message }, { status: 400 });

  return NextResponse.json({ members: members ?? [], invites: invites ?? [], org });
}