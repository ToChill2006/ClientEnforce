import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const Schema = z.object({
  token: z.string().uuid(),
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const admin = supabaseAdmin();

  const { data: invite, error: invErr } = await admin
    .from("invites")
    .select("id, org_id, email, role, expires_at, accepted_at")
    .eq("token", parsed.data.token)
    .single();

  if (invErr) return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  if (invite.accepted_at) return NextResponse.json({ error: "Invite already accepted" }, { status: 409 });
  if (new Date(invite.expires_at).getTime() < Date.now()) return NextResponse.json({ error: "Invite expired" }, { status: 410 });

  // Seat check again at acceptance time
  const { data: org, error: orgErr } = await admin
    .from("organizations")
    .select("seats_limit")
    .eq("id", invite.org_id)
    .single();
  if (orgErr) return NextResponse.json({ error: orgErr.message }, { status: 400 });

  const [{ count: memberCount, error: mcErr }, { count: inviteCount, error: icErr }] = await Promise.all([
    admin.from("memberships").select("*", { count: "exact", head: true }).eq("org_id", invite.org_id),
    admin
      .from("invites")
      .select("*", { count: "exact", head: true })
      .eq("org_id", invite.org_id)
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString()),
  ]);

  if (mcErr) return NextResponse.json({ error: mcErr.message }, { status: 400 });
  if (icErr) return NextResponse.json({ error: icErr.message }, { status: 400 });

  // When accepting, this invite will become accepted; we count seats as memberships only.
  if ((memberCount || 0) >= org.seats_limit) {
    return NextResponse.json({ error: `Seat limit reached (${org.seats_limit}). Upgrade to join.` }, { status: 409 });
  }

  // Add membership (idempotent)
  const { data: existing, error: exErr } = await admin
    .from("memberships")
    .select("user_id")
    .eq("org_id", invite.org_id)
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (exErr) return NextResponse.json({ error: exErr.message }, { status: 400 });

  if (!existing?.user_id) {
    const { error: insErr } = await admin.from("memberships").insert({
      org_id: invite.org_id,
      user_id: userData.user.id,
      role: invite.role,
    });
    if (insErr) return NextResponse.json({ error: insErr.message }, { status: 400 });
  }

  // Update profile to org if your schema supports multi-org? If single-org, set profile.org_id to invite.org_id.
  // This project uses single-org per user, so we set it.
  const { error: profErr } = await admin
    .from("profiles")
    .update({ org_id: invite.org_id })
    .eq("user_id", userData.user.id);

  if (profErr) return NextResponse.json({ error: profErr.message }, { status: 400 });

  // Mark invite accepted
  const now = new Date().toISOString();
  const { error: updErr } = await admin
    .from("invites")
    .update({ accepted_at: now, accepted_by_user_id: userData.user.id })
    .eq("id", invite.id);

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 });

  await admin.from("audit_logs").insert({
    org_id: invite.org_id,
    actor_user_id: userData.user.id,
    action: "team.invite_accepted",
    entity_type: "invite",
    entity_id: invite.id,
    metadata: { email: invite.email, role: invite.role },
  });

  return NextResponse.json({ ok: true });
}