import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole, getOrgId, HttpError } from "@/lib/rbac";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

export async function GET(req: Request) {
  try {
    const supabase = await supabaseServer();
    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");
    await requireRole();

    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 200);
    const offset = Number(url.searchParams.get("offset") ?? 0);

    const { data, error } = await supabase
      .from("team_activity")
      .select("*")
      .eq("org_id", org_id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return err(500, error.message);

    // Enrich actor names from profiles
    const admin = (await import("@/lib/supabase-admin")).supabaseAdmin();
    const actorIds = Array.from(new Set((data ?? []).map((i: any) => i.actor_user_id).filter(Boolean)));
    const profileMap = new Map<string, string>();
    if (actorIds.length > 0) {
      const { data: profiles } = await admin.from("profiles").select("user_id, full_name, email").in("user_id", actorIds);
      for (const p of profiles ?? []) profileMap.set(p.user_id, p.full_name || p.email || "Someone");
    }

    const items = (data ?? []).map((item: any) => {
      const actorName = (item.actor_user_id ? profileMap.get(item.actor_user_id) : null) || "Someone";
      const ctx = item.context ?? {};

      let message = "";
      const verb = item.verb;
      const kind = item.subject_kind;
      const actorLabel = item.actor_kind === "exhibitor" ? (ctx.exhibitor_name ?? "An exhibitor") : actorName;

      if (verb === "approved" && kind === "phase") {
        message = `${actorLabel} approved Phase ${ctx.phase_number ?? ""} for ${ctx.client_name ?? "an exhibitor"}`;
      } else if (verb === "rejected" && kind === "phase") {
        message = `${actorLabel} sent Phase ${ctx.phase_number ?? ""} back for revision (${ctx.client_name ?? "an exhibitor"})`;
      } else if (verb === "submitted" && kind === "phase") {
        message = `${actorLabel} submitted Phase ${ctx.phase_number ?? ""} for review`;
      } else if (verb === "invited" && kind === "event") {
        message = `${actorLabel} sent invites to ${ctx.count ?? ""} exhibitors in ${ctx.event_name ?? "an event"}`;
      } else if (verb === "created" && kind === "onboarding") {
        message = `${actorLabel} created an onboarding for ${ctx.client_name ?? "a client"}`;
      } else {
        message = `${actorLabel} ${verb} a ${kind}`;
      }

      return {
        id: item.id,
        message,
        created_at: item.created_at,
        verb: item.verb,
        subject_kind: item.subject_kind,
        context: item.context,
      };
    });

    return NextResponse.json({ items });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}
