import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { permissionDenied } from "@/lib/plan-enforcement";

const FeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  feedback: z.string().max(2000).optional().nullable(),
});

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) return NextResponse.json({ error: userErr.message }, { status: 401 });
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await requireRole(["owner", "admin", "member"]);
  if (!roleHasPermission(role, "dashboard_view")) {
    return NextResponse.json({ error: permissionDenied("You do not have access to submit dashboard feedback.") }, { status: 403 });
  }

  const profile = await requireProfile();

  const body = await req.json().catch(() => null);
  const parsed = FeedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const feedback = parsed.data.feedback?.trim() || null;

  const { error: insertErr } = await supabaseAdmin()
    .from("audit_events")
    .insert({
      org_id: profile.org_id,
      actor_user_id: userData.user.id,
      actor_email: profile.email ?? userData.user.email ?? null,
      actor_role: role,
      action: "dashboard.feedback_submitted",
      entity_type: "dashboard",
      meta: {
        rating: parsed.data.rating,
        feedback,
        source: "dashboard",
        user_agent: req.headers.get("user-agent") || null,
      },
    });

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
