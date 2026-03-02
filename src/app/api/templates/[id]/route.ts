import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireAdmin, requireProfile } from "@/lib/rbac";
import { TemplateDefinitionSchema } from "@/lib/onboarding-schema";

const UpdateSchema = z.object({
  name: z.string().min(2).max(80),
  definition: TemplateDefinitionSchema,
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();

  const { data: item, error } = await supabase
    .from("templates")
    .select("id, org_id, name, definition, created_at, updated_at")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  if (item.org_id !== profile.org_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({ item });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Forbidden" }, { status: 403 });
  }

  const profile = await requireProfile();
  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const admin = supabaseAdmin();

  const { data: existing, error: eErr } = await admin
    .from("templates")
    .select("id, org_id")
    .eq("id", id)
    .single();

  if (eErr) return NextResponse.json({ error: eErr.message }, { status: 404 });
  if (existing.org_id !== profile.org_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: updated, error } = await admin
    .from("templates")
    .update({
      name: parsed.data.name,
      definition: parsed.data.definition,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, name, definition, created_at, updated_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await admin.from("audit_logs").insert({
    org_id: profile.org_id,
    actor_user_id: profile.user_id,
    action: "template.updated",
    entity_type: "template",
    entity_id: id,
    metadata: { name: parsed.data.name },
  });

  return NextResponse.json({ item: updated });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await requireAdmin();
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Forbidden" }, { status: 403 });
  }

  const profile = await requireProfile();
  const admin = supabaseAdmin();

  const { data: existing, error: eErr } = await admin
    .from("templates")
    .select("id, org_id, name")
    .eq("id", id)
    .single();

  if (eErr) return NextResponse.json({ error: eErr.message }, { status: 404 });
  if (existing.org_id !== profile.org_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error } = await admin.from("templates").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await admin.from("audit_logs").insert({
    org_id: profile.org_id,
    actor_user_id: profile.user_id,
    action: "template.deleted",
    entity_type: "template",
    entity_id: id,
    metadata: { name: existing.name },
  });

  return NextResponse.json({ ok: true });
}