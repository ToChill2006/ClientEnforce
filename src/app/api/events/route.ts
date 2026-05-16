import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole, getOrgId, HttpError } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { currentOrgHasFeature } from "@/lib/feature-flags";
import { getExternalViewerEventIds } from "@/lib/external-viewer";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

const CreateEvent = z.object({
  name: z.string().min(1).max(200),
  end_date: z.string().min(1),
  start_date: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const supabase = await supabaseServer();
    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");

    const role = await requireRole();
    const isExternalViewer = role === "external_viewer";
    if (!isExternalViewer && !roleHasPermission(role as any, "events_view")) return err(403, "Forbidden");
    if (isExternalViewer && !roleHasPermission(role as any, "events_view_scoped")) return err(403, "Forbidden");

    let eventsQuery = supabase
      .from("events")
      .select("*")
      .eq("org_id", org_id)
      .order("created_at", { ascending: false });

    if (isExternalViewer) {
      const { data: { user } } = await supabase.auth.getUser();
      const scopedIds = await getExternalViewerEventIds(user!.id, org_id);
      eventsQuery = (eventsQuery as any).in("id", scopedIds.length > 0 ? scopedIds : ["00000000-0000-0000-0000-000000000000"]);
    }

    const { data: events, error } = await eventsQuery;

    if (error) return err(400, error.message);

    // Enrich each event with exhibitor counts
    const eventIds = (events ?? []).map((e: any) => e.id);
    let countsByEvent: Record<string, { total: number; by_status: Record<string, number> }> = {};

    if (eventIds.length > 0) {
      const { data: phases } = await supabase
        .from("onboarding_phases")
        .select("onboarding_id, status, onboardings!inner(event_id)")
        .in("onboardings.event_id", eventIds);

      const { data: onboardings } = await supabase
        .from("onboardings")
        .select("id, event_id")
        .in("event_id", eventIds);

      if (onboardings) {
        for (const o of onboardings as any[]) {
          if (!countsByEvent[o.event_id]) countsByEvent[o.event_id] = { total: 0, by_status: {} };
          countsByEvent[o.event_id].total++;
        }
      }
      if (phases) {
        for (const p of phases as any[]) {
          const eventId = (p as any).onboardings?.event_id;
          if (!eventId) continue;
          if (!countsByEvent[eventId]) countsByEvent[eventId] = { total: 0, by_status: {} };
          const s = p.status;
          countsByEvent[eventId].by_status[s] = (countsByEvent[eventId].by_status[s] ?? 0) + 1;
        }
      }
    }

    const enriched = (events ?? []).map((e: any) => ({
      ...e,
      exhibitor_count: countsByEvent[e.id]?.total ?? 0,
      phase_status_counts: countsByEvent[e.id]?.by_status ?? {},
    }));

    return NextResponse.json({ events: enriched });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}

export async function POST(req: Request) {
  try {
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return err(401, "Unauthorized");

    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");

    const role = await requireRole();
    if (!roleHasPermission(role as any, "events_write")) return err(403, "Forbidden");

    const body = await req.json().catch(() => null);
    const parsed = CreateEvent.safeParse(body);
    if (!parsed.success) return err(400, "Invalid payload");

    const { data, error } = await supabase
      .from("events")
      .insert({
        org_id,
        name: parsed.data.name,
        end_date: parsed.data.end_date,
        start_date: parsed.data.start_date ?? null,
        location: parsed.data.location ?? null,
        created_by_user_id: userData.user.id,
      })
      .select("*")
      .single();

    if (error) return err(400, error.message);
    return NextResponse.json({ event: data }, { status: 201 });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}
