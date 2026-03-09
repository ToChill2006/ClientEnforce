import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { permissionDenied } from "@/lib/plan-enforcement";

const BodySchema = z.object({
  id: z.string().uuid(),
});

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = await requireRole(["owner", "admin", "member"]);
  if (!roleHasPermission(role, "onboardings_lock")) {
    return NextResponse.json({ error: permissionDenied("You do not have access to lock onboardings.") }, { status: 403 });
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

  const profile = await requireProfile();

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
  const baseAudit = {
    org_id: profile.org_id,
    action: "onboarding.locked",
    entity_type: "onboarding",
    entity_id: parsed.data.id,
  };

  let auditResult = await supabase.from("audit_logs").insert({
    ...baseAudit,
    actor_user_id: auth.user.id,
    metadata: { source: "api", route: "/api/onboardings/lock" },
  });

  if ((auditResult as any)?.error) {
    auditResult = await supabase.from("audit_logs").insert({
      ...baseAudit,
      actor_profile_id: (profile as any).id ?? null,
      meta: { source: "api", route: "/api/onboardings/lock" },
    } as any);
  }

  return NextResponse.json({ ok: true, id: parsed.data.id });
}
