import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole, getOrgId } from "@/lib/rbac";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await supabaseServer();
  const org_id = await getOrgId();
  if (!org_id) return json(401, { error: "Unauthorized" });

  await requireRole(["owner", "admin", "member", "onboarder", "reviewer"]);

  // Load template — verify it belongs to this org
  const { data: template, error } = await supabase
    .from("templates")
    .select("id, name, definition, definition_json")
    .eq("id", id)
    .maybeSingle();

  if (error) return json(400, { error: error.message });
  if (!template) return json(404, { error: "Template not found" });

  const def = (template as any).definition ?? (template as any).definition_json ?? {};
  const requirements: any[] = Array.isArray(def?.requirements) ? def.requirements : [];

  return json(200, { requirements });
}
