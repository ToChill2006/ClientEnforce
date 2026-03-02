import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin, requireProfile } from "@/lib/rbac";
import { resend } from "@/lib/resend";

const Schema = z.object({
  email: z.string().email(),
  role: z.enum(["member", "admin"]),
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Forbidden" }, { status: 403 });
  }

  const profile = await requireProfile();
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const admin = supabaseAdmin();

  // Seat check: memberships + pending invites <= seats_limit
  const { data: org, error: orgErr } = await admin
    .from("organizations")
    .select("seats_limit")
    .eq("id", profile.org_id)
    .single();
  if (orgErr) return NextResponse.json({ error: orgErr.message }, { status: 400 });

  const [{ count: memberCount, error: mcErr }, { count: inviteCount, error: icErr }] = await Promise.all([
    admin.from("memberships").select("*", { count: "exact", head: true }).eq("org_id", profile.org_id),
    admin
      .from("invites")
      .select("*", { count: "exact", head: true })
      .eq("org_id", profile.org_id)
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString()),
  ]);

  if (mcErr) return NextResponse.json({ error: mcErr.message }, { status: 400 });
  if (icErr) return NextResponse.json({ error: icErr.message }, { status: 400 });

  const used = (memberCount || 0) + (inviteCount || 0);
  if (used >= org.seats_limit) {
    return NextResponse.json({ error: `Seat limit reached (${org.seats_limit}). Upgrade to add more seats.` }, { status: 409 });
  }

  // Prevent duplicate invite for same email (active)
  const email = parsed.data.email.toLowerCase();
  const { data: existing } = await admin
    .from("invites")
    .select("id")
    .eq("org_id", profile.org_id)
    .eq("email", email)
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (existing?.id) {
    return NextResponse.json({ error: "An active invite already exists for this email." }, { status: 409 });
  }

  const { data: invite, error: inviteErr } = await admin
    .from("invites")
    .insert({
      org_id: profile.org_id,
      email,
      role: parsed.data.role,
      invited_by_user_id: userData.user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select("id, email, role, token, expires_at")
    .single();

  if (inviteErr) return NextResponse.json({ error: inviteErr.message }, { status: 400 });

  await admin.from("audit_logs").insert({
    org_id: profile.org_id,
    actor_user_id: userData.user.id,
    action: "team.invited",
    entity_type: "invite",
    entity_id: invite.id,
    metadata: { email: invite.email, role: invite.role },
  });

  // Email invite link (Resend)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const inviteUrl = `${appUrl}/dashboard/settings?invite=${invite.token}`;

  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const fromName = process.env.RESEND_FROM_NAME || "ClientEnforce";
  const from = `${fromName} <${fromEmail}>`;

  if (process.env.RESEND_API_KEY) {
    await resend.emails.send({
      from,
      to: [invite.email],
      subject: "You’ve been invited to ClientEnforce",
      html: `
        <div style="font-family: ui-sans-serif, system-ui; line-height: 1.5;">
          <p>You’ve been invited to join a team on ClientEnforce.</p>
          <p><a href="${inviteUrl}">${inviteUrl}</a></p>
          <p>This invite expires on ${new Date(invite.expires_at).toLocaleString()}.</p>
        </div>
      `,
    });
  }

  return NextResponse.json({ invite, inviteUrl });
}