import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin, requireProfile } from "@/lib/rbac";
import { TemplateDefinitionSchema } from "@/lib/onboarding-schema";

const CreateSchema = z.object({
  name: z.string().min(2).max(80),
  definition: TemplateDefinitionSchema,
});

export async function GET() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();

  const { data: templates, error } = await supabase
    .from("templates")
    .select("id, name, created_at, updated_at, deleted_at")
    .eq("org_id", profile.org_id)
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ items: templates });
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const profile = await requireProfile();
  const admin = supabaseAdmin();

  const insertWith = async (definitionColumn: "definition" | "definition_json") => {
    const payload: any = {
      org_id: profile.org_id,
      name: parsed.data.name,
      [definitionColumn]: parsed.data.definition,
    };

    return admin
      .from("templates")
      .insert(payload)
      .select("id, name, created_at, updated_at")
      .single();
  };

  // Try the most likely column first
  let { data: created, error } = await insertWith("definition");

  // If the column doesn't exist, retry with the alternate column name
  if (error && /column .*definition.* does not exist/i.test(error.message)) {
    const retry = await insertWith("definition_json");
    created = retry.data as any;
    error = retry.error as any;
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const template = created as { id: string; name: string; created_at: string; updated_at: string };

  await admin.from("audit_logs").insert({
    org_id: profile.org_id,
    actor_user_id: profile.user_id,
    action: "template.created",
    entity_type: "template",
    entity_id: template.id,
    metadata: { name: template.name },
  });

  return NextResponse.json({ item: template }, { status: 201 });
}