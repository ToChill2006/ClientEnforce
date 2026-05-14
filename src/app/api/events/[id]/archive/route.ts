import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole, getOrgId, HttpError } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { currentOrgHasFeature } from "@/lib/feature-flags";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

export async function POST(
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
    if (!roleHasPermission(role as any, "events_write")) return err(403, "Forbidden");

    const { data, error } = await supabase
      .from("events")
      .update({ status: "archived", updated_at: new Date().toISOString() })
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
