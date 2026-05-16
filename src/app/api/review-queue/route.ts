import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole, getOrgId, HttpError } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { currentOrgHasFeature } from "@/lib/feature-flags";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

export async function GET() {
  try {
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const supabase = await supabaseServer();
    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");

    const role = await requireRole();
    if (!roleHasPermission(role as any, "onboardings_review")) return err(403, "Forbidden");

    const { data: phases, error } = await supabase
      .from("onboarding_phases")
      .select(`
        id, phase_number, name, deadline, status, updated_at,
        onboardings!inner(
          id, title, client_id, event_id, template_id,
          events(id, name),
          clients(id, full_name, email),
          templates(id, name)
        )
      `)
      .eq("org_id", org_id)
      .eq("status", "awaiting_review")
      .order("deadline", { ascending: true, nullsFirst: false })
      .order("updated_at", { ascending: false });

    if (error) return err(400, error.message);

    const today = new Date();
    const enriched = (phases ?? []).map((p: any) => {
      const ob = p.onboardings ?? {};
      const deadline = p.deadline ? new Date(p.deadline) : null;
      const daysUntilDeadline = deadline
        ? Math.ceil((deadline.getTime() - today.getTime()) / 86400000)
        : null;

      return {
        phase_id: p.id,
        phase_number: p.phase_number,
        phase_name: p.name,
        deadline: p.deadline,
        days_until_deadline: daysUntilDeadline,
        updated_at: p.updated_at,
        onboarding_id: ob.id,
        onboarding_title: ob.title,
        client_name: ob.clients?.full_name ?? null,
        client_email: ob.clients?.email ?? null,
        event_id: ob.event_id,
        event_name: ob.events?.name ?? null,
        template_name: ob.templates?.name ?? null,
      };
    });

    return NextResponse.json({ phases: enriched });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}
