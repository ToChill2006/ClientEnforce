import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole, getOrgId, HttpError, requireProfile } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { currentOrgHasFeature } from "@/lib/feature-flags";
import { logAudit } from "@/lib/audit";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

const CreateClientType = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional().nullable(),
  default_template_id: z.string().uuid().optional().nullable(),
});

export async function GET() {
  try {
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const supabase = await supabaseServer();
    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");
    await requireRole();

    const { data, error } = await supabase
      .from("client_types")
      .select("*, templates(id, name)")
      .eq("org_id", org_id)
      .order("name", { ascending: true });

    if (error) return err(400, error.message);
    return NextResponse.json({ client_types: data ?? [] });
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
    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organization");

    const role = await requireRole();
    if (!roleHasPermission(role as any, "client_types_write")) return err(403, "Forbidden");

    const profile = await requireProfile();
    const body = await req.json().catch(() => null);
    const parsed = CreateClientType.safeParse(body);
    if (!parsed.success) return err(400, "Invalid payload");

    const { data, error } = await supabase
      .from("client_types")
      .insert({
        org_id,
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        default_template_id: parsed.data.default_template_id ?? null,
      })
      .select("*")
      .single();

    if (error) {
      if (error.message.toLowerCase().includes("unique")) return err(409, "A client type with that name already exists");
      return err(400, error.message);
    }
    logAudit({
      org_id: profile.org_id,
      actor_user_id: profile.user_id,
      actor_email: profile.email,
      actor_role: role,
      action: "client_type.created",
      entity_type: "client_type",
      entity_id: (data as any).id,
    });
    return NextResponse.json({ client_type: data }, { status: 201 });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}
