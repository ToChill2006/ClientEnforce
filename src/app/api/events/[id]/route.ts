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

const UpdateEvent = z.object({
  name: z.string().min(1).max(200).optional(),
  end_date: z.string().optional().nullable(),
  start_date: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  status: z.enum(["planning", "active", "closed", "archived"]).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const { id } = await params;
    const supabase = await supabaseServer();
    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");

    const role = await requireRole();
    if (role === "external_viewer") return err(404, "Not found");
    if (!roleHasPermission(role as any, "events_write")) return err(403, "Forbidden");

    const body = await req.json().catch(() => null);
    const parsed = UpdateEvent.safeParse(body);
    if (!parsed.success) return err(400, "Invalid payload");

    const { data, error } = await supabase
      .from("events")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("org_id", org_id)
      .select("*")
      .single();

    if (error) return err(400, error.message);
    return NextResponse.json({ event: data });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const { id } = await params;
    const supabase = await supabaseServer();
    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");

    const role = await requireRole();
    if (role === "external_viewer") return err(404, "Not found");
    if (!roleHasPermission(role as any, "events_write")) return err(403, "Forbidden");

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)
      .eq("org_id", org_id);

    if (error) return err(400, error.message);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const { id } = await params;
    const supabase = await supabaseServer();
    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");

    const role = await requireRole();
    const isExternalViewer = role === "external_viewer";
    if (!isExternalViewer && !roleHasPermission(role as any, "events_view")) return err(403, "Forbidden");

    if (isExternalViewer) {
      const { data: { user } } = await supabase.auth.getUser();
      const scopedIds = await getExternalViewerEventIds(user!.id, org_id);
      if (!scopedIds.includes(id)) return err(404, "Not found");
    }

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .eq("org_id", org_id)
      .single();

    if (error) return err(404, "Event not found");
    return NextResponse.json({ event: data });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}
