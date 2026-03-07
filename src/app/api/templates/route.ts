import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { TemplateDefinitionSchema } from "@/lib/onboarding-schema";

const CreateSchema = z.object({
  name: z.string().min(2).max(80),
  definition: TemplateDefinitionSchema,
});

function normalizeTier(raw: unknown): "free" | "pro" | "business" {
  const value = String(raw ?? "free").trim().toLowerCase();
  if (value === "business") return "business";
  if (value === "pro") return "pro";
  if (value === "starter") return "free";
  return "free";
}

function maxTemplatesForTier(tier: "free" | "pro" | "business") {
  if (tier === "business") return Number.POSITIVE_INFINITY;
  if (tier === "pro") return 10;
  return 1;
}

async function selectOrganizationTier(admin: any, orgId: string) {
  let result = await admin
    .from("organizations")
    .select("tier, plan_tier")
    .eq("id", orgId)
    .single();

  if (result.error && /column .*plan_tier.* does not exist/i.test(result.error.message)) {
    const retry = await admin
      .from("organizations")
      .select("tier")
      .eq("id", orgId)
      .single();

    return { data: retry.data, error: retry.error };
  }

  if (result.error && /column .*tier.* does not exist/i.test(result.error.message)) {
    const retry = await admin
      .from("organizations")
      .select("plan_tier")
      .eq("id", orgId)
      .single();

    return { data: retry.data, error: retry.error };
  }

  return { data: result.data, error: result.error };
}

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
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
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
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const profile = await requireProfile();
  const admin = supabaseAdmin();

  const { data: org, error: orgError } = await selectOrganizationTier(admin, profile.org_id);

  if (orgError) {
    console.warn("[templates.post] tier lookup failed, defaulting to free", {
      orgId: profile.org_id,
      error: orgError.message,
    });
  }

  const tier = normalizeTier((org as any)?.tier ?? (org as any)?.plan_tier ?? "free");
  const maxTemplates = maxTemplatesForTier(tier);

  if (Number.isFinite(maxTemplates)) {
    const countWithDeletedAt = await admin
      .from("templates")
      .select("*", { count: "exact", head: true })
      .eq("org_id", profile.org_id)
      .is("deleted_at", null);

    let templateCount = countWithDeletedAt.count ?? 0;
    let countError = countWithDeletedAt.error;

    if (countError && /column .*deleted_at.* does not exist/i.test(countError.message)) {
      const countWithoutDeletedAt = await admin
        .from("templates")
        .select("*", { count: "exact", head: true })
        .eq("org_id", profile.org_id);

      templateCount = countWithoutDeletedAt.count ?? 0;
      countError = countWithoutDeletedAt.error;
    }

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 400 });
    }

    if (templateCount >= maxTemplates) {
      return NextResponse.json(
        {
          error:
            tier === "free"
              ? "Your current plan allows 1 template. Upgrade to Pro to create more templates."
              : `Your current plan allows up to ${maxTemplates} templates. Upgrade to Business for unlimited templates.`,
        },
        { status: 403 }
      );
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
      error: error.message,
    });
    return NextResponse.json({ error: error.message }, { status: 400 });
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

  return NextResponse.json({ item: template }, { status: 201 });
}