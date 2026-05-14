import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole, getOrgId, HttpError } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { currentOrgHasFeature } from "@/lib/feature-flags";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

const UpdateClientType = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional().nullable(),
  default_template_id: z.string().uuid().optional().nullable(),
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
    if (!roleHasPermission(role as any, "client_types_write")) return err(403, "Forbidden");

    const body = await req.json().catch(() => null);
    const parsed = UpdateClientType.safeParse(body);
    if (!parsed.success) return err(400, "Invalid payload");

    const { data, error } = await supabase
      .from("client_types")
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("org_id", org_id)
      .select("*")
      .single();

    if (error) return err(400, error.message);
    return NextResponse.json({ client_type: data });
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
    if (!roleHasPermission(role as any, "client_types_write")) return err(403, "Forbidden");

    // Check for references
    const { count: obCount } = await supabase
      .from("onboardings")
      .select("id", { count: "exact", head: true })
      .eq("client_type_id", id)
      .eq("org_id", org_id);

    const { count: clientCount } = await supabase
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("default_client_type_id", id)
      .eq("org_id", org_id);

    if ((obCount ?? 0) > 0 || (clientCount ?? 0) > 0) {
      return err(409, "Cannot delete: client type is still referenced by onboardings or clients");
    }

    const { error } = await supabase
      .from("client_types")
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
