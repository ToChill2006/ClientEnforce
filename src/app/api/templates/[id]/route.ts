import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requireRole } from "@/lib/rbac";
import { TemplateDefinitionSchema } from "@/lib/onboarding-schema";

async function writeAudit(
  admin: ReturnType<typeof supabaseAdmin>,
  row: {
    org_id: string;
    actor_user_id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    metadata?: any;
  }
) {
  // Different environments/migrations have used different audit tables.
  // We never want audit logging to break core CRUD.
  try {
    const r1 = await admin.from("audit_events").insert(row);
    if (!(r1 as any)?.error) return;
  } catch {}
  try {
    await admin.from("audit_logs").insert(row);
  } catch {}
}

function isMissingColumn(err: any, col: string) {
  const msg = String(err?.message || "");
  return msg.toLowerCase().includes("does not exist") && msg.includes(col);
}

async function selectTemplateById(
  supa: any,
  id: string
): Promise<{ item: any | null; error: any | null }> {
  // Try the newer schema first, then fallback.
  const primary = await supa
    .from("templates")
    .select("id, org_id, name, definition, created_at, updated_at")
    .eq("id", id)
    .single();
  if (!(primary as any)?.error) return { item: (primary as any).data ?? null, error: null };

  const e = (primary as any).error;
  if (isMissingColumn(e, "definition")) {
    const fallback = await supa
      .from("templates")
      .select("id, org_id, name, definition_json, created_at, updated_at")
      .eq("id", id)
      .single();
    if (!(fallback as any)?.error) {
      const d = (fallback as any).data ?? null;
      // normalize onto `definition`
      if (d && d.definition_json && !d.definition) (d as any).definition = (d as any).definition_json;
      return { item: d, error: null };
    }
    return { item: null, error: (fallback as any).error };
  }

  return { item: null, error: e };
}

async function updateTemplateById(
  admin: any,
  id: string,
  patch: { name: string; definition: any; updated_at?: string }
): Promise<{ item: any | null; error: any | null }> {
  // First attempt: `definition`
  const attempt1 = await admin
    .from("templates")
    .update({
      name: patch.name,
      definition: patch.definition,
      updated_at: patch.updated_at,
    })
    .eq("id", id)
    .select("id, name, definition, created_at, updated_at")
    .single();

  if (!(attempt1 as any)?.error) return { item: (attempt1 as any).data ?? null, error: null };

  const e1 = (attempt1 as any).error;
  // Fallback: `definition_json`
  if (isMissingColumn(e1, "definition")) {
    const attempt2 = await admin
      .from("templates")
      .update({
        name: patch.name,
        definition_json: patch.definition,
        updated_at: patch.updated_at,
      })
      .eq("id", id)
      .select("id, name, definition_json, created_at, updated_at")
      .single();

    if (!(attempt2 as any)?.error) {
      const d = (attempt2 as any).data ?? null;
      if (d && d.definition_json && !d.definition) (d as any).definition = (d as any).definition_json;
      return { item: d, error: null };
    }
    return { item: null, error: (attempt2 as any).error };
  }

  return { item: null, error: e1 };
}

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

  const { item, error } = await selectTemplateById(supabase, id);

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (item.org_id !== profile.org_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({ item });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await requireRole(["owner", "admin"]);
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

  const { item: updated, error } = await updateTemplateById(admin, id, {
    name: parsed.data.name,
    definition: parsed.data.definition,
    updated_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!updated) return NextResponse.json({ error: "Update failed" }, { status: 400 });

  await writeAudit(admin, {
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
    await requireRole(["owner", "admin"]);
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

  // Prefer soft-delete so existing onboardings can still resolve the old template name.
  // If the project hasn't been migrated to include `deleted_at`, fall back to hard delete.
  const now = new Date().toISOString();

  const soft = await admin
    .from("templates")
    .update({ deleted_at: now, updated_at: now })
    .eq("id", id)
    .eq("org_id", profile.org_id)
    .select("id")
    .single();

  if ((soft as any)?.error) {
    const softErr = (soft as any).error;

    // If `deleted_at` doesn't exist in this environment, fall back to hard delete.
    if (isMissingColumn(softErr, "deleted_at")) {
      const hard = await admin.from("templates").delete().eq("id", id).eq("org_id", profile.org_id);
      if ((hard as any)?.error) {
        return NextResponse.json({ error: (hard as any).error.message }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: softErr.message }, { status: 400 });
    }
  }

  await writeAudit(admin, {
    org_id: profile.org_id,
    actor_user_id: profile.user_id,
    action: "template.deleted",
    entity_type: "template",
    entity_id: id,
    metadata: { name: existing.name, soft_deleted: true },
  });

  return NextResponse.json({ ok: true });
}