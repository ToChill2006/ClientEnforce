import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";

const BodySchema = z.object({
  id: z.string().uuid(),
});

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Resolve org + role from profile/memberships
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("id, org_id")
    .eq("user_id", auth.user.id)
    .single();

  if (profileErr || !profile?.org_id) {
    return NextResponse.json({ error: "Profile not found" }, { status: 403 });
  }

  const { data: membership, error: membershipErr } = await supabase
    .from("memberships")
    .select("role")
    .eq("org_id", profile.org_id)
    .eq("profile_id", profile.id)
    .single();

  if (membershipErr || !membership?.role) {
    return NextResponse.json({ error: "Membership not found" }, { status: 403 });
  }

  if (membership.role !== "owner" && membership.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Lock the onboarding: mark submission locked + status locked + timestamp
  // (Assumes these columns exist per your onboarding engine requirements)
  const { data: updated, error: updErr } = await supabase
    .from("onboardings")
    .update({
      submission_locked: true,
      locked_at: new Date().toISOString(),
      status: "locked",
      updated_at: new Date().toISOString(),
    })
    .eq("org_id", profile.org_id)
    .eq("id", parsed.data.id)
    .select("id")
    .single();

  if (updErr || !updated) {
    return NextResponse.json(
      { error: updErr?.message || "Failed to lock onboarding" },
      { status: 400 }
    );
  }

  // Audit log
  await supabase.from("audit_logs").insert({
    org_id: profile.org_id,
    actor_profile_id: profile.id,
    action: "onboarding.locked",
    entity_type: "onboarding",
    entity_id: parsed.data.id,
    meta: { source: "api", route: "/api/onboardings/lock" },
  });

  return NextResponse.json({ ok: true, id: parsed.data.id });
}