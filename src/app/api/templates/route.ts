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
    .select("id, name, created_at, updated_at")
    .eq("org_id", profile.org_id)
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

  const { data: template, error } = await admin
    .from("templates")
    .insert({
      org_id: profile.org_id,
      name: parsed.data.name,
      definition: parsed.data.definition,
    })
    .select("id, name, created_at, updated_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

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