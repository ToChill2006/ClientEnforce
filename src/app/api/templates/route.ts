import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { TemplateDefinitionSchema } from "@/lib/onboarding-schema";
import {
  maxTemplatesForTier,
  permissionDenied,
  selectOrganizationTier,
  templateLimitMessage,
} from "@/lib/plan-enforcement";

const CreateSchema = z.object({
  name: z.string().min(2).max(80),
  definition: TemplateDefinitionSchema,
});

export async function GET() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let profile;
  try {
    profile = await requireProfile();
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Forbidden" }, { status: 403 });
  }

  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "templates_view")) {
    return NextResponse.json({ error: permissionDenied("You do not have access to view templates.") }, { status: 403 });
  }

  const fetchWith = async (includeDeletedAt: boolean) => {
    let query = supabase
      .from("templates")
      .select(includeDeletedAt ? "id, name, created_at, updated_at, deleted_at" : "id, name, created_at, updated_at")
      .eq("org_id", profile.org_id)
      .order("updated_at", { ascending: false });

    if (includeDeletedAt) {
      query = query.is("deleted_at", null);
    }

    return query;
  };

  let { data: templates, error } = await fetchWith(true);

  if (error && /column .*deleted_at.* does not exist/i.test(error.message)) {
    const retry = await fetchWith(false);
    templates = retry.data;
    error = retry.error;
  }

  // Safety filter: ensure soft-deleted templates never appear in API response
  if (templates) {
    templates = (templates as any[]).filter((t) => {
      if ("deleted_at" in t) return t.deleted_at === null;
      return true;
    }) as any;
  }
  if (error) {
    console.error("[templates.get] failed", { error });
    return NextResponse.json(
      { error: error?.message || error?.details || error?.hint || "Failed to load templates" },
      { status: 400 }
    );
  }
  return NextResponse.json({ items: templates ?? [] });
}

export async function POST(req: Request) {
  let role;
  try {
    role = await requireRole(["owner", "admin", "member"]);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Forbidden" }, { status: 403 });
  }

  if (!roleHasPermission(role, "templates_write")) {
    return NextResponse.json({ error: permissionDenied("You do not have access to create templates.") }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const profile = await requireProfile();
  const admin = supabaseAdmin();

  const { tier, error: orgError } = await selectOrganizationTier(admin, profile.org_id);

  if (orgError) {
    console.warn("[templates.post] tier lookup failed, defaulting to free", {
      orgId: profile.org_id,
      error: orgError.message,
    });
  }

  const maxTemplates = maxTemplatesForTier(tier);

  if (Number.isFinite(maxTemplates)) {
    const listWithDeletedAt = await admin
      .from("templates")
      .select("id, deleted_at")
      .eq("org_id", profile.org_id);

    let templateRows = listWithDeletedAt.data as any[] | null;
    let listError = listWithDeletedAt.error as any;

    if (listError && /deleted_at/i.test(String(listError?.message || ""))) {
      const listWithoutDeletedAt = await admin
        .from("templates")
        .select("id")
        .eq("org_id", profile.org_id);

      templateRows = listWithoutDeletedAt.data as any[] | null;
      listError = listWithoutDeletedAt.error as any;
    }

    if (listError) {
      console.error("[templates.post] template list failed", {
        orgId: profile.org_id,
        error: listError,
      });
    } else {
      const activeTemplateCount = (templateRows ?? []).filter((row: any) => {
        if (row && typeof row === "object" && "deleted_at" in row) {
          return row.deleted_at == null;
        }
        return true;
      }).length;

      if (activeTemplateCount >= maxTemplates) {
        return NextResponse.json(
          {
            error: templateLimitMessage(tier, maxTemplates),
          },
          { status: 403 }
        );
      }
    }
  }

  console.log("[templates.post] creating template", {
    orgId: profile.org_id,
    tier,
    maxTemplates,
    templateName: parsed.data.name,
  });

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

  if (error) {
    console.error("[templates.post] insert failed", {
      orgId: profile.org_id,
      error,
    });
    return NextResponse.json(
      { error: error?.message || error?.details || error?.hint || "Failed to create template" },
      { status: 400 }
    );
  }
  const template = created as { id: string; name: string; created_at: string; updated_at: string };

  try {
    await admin.from("audit_logs").insert({
      org_id: profile.org_id,
      actor_user_id: profile.user_id,
      action: "template.created",
      entity_type: "template",
      entity_id: template.id,
      metadata: { name: template.name },
    });
  } catch (auditError: any) {
    console.warn("[templates.post] audit insert failed", {
      orgId: profile.org_id,
      templateId: template.id,
      error: auditError?.message ?? String(auditError),
    });
  }

  return NextResponse.json(
    {
      item: {
        ...template,
        // Ensure clients can render requirements immediately after create.
        definition: parsed.data.definition,
      },
    },
    { status: 201 }
  );
}
