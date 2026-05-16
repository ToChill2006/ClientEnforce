import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile } from "@/lib/rbac";
import { requirePermission, HttpError } from "@/lib/rbac";
import { currentOrgHasFeature } from "@/lib/feature-flags";

const CreateSchema = z.object({
  phase_number: z.number().int().positive().nullable().optional(),
  rule_type: z.enum(["deadline_based", "inactivity_based", "missing_item_based"]),
  trigger_offset_days: z.number().int(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: templateId } = await params;

  try {
    const hasEnterprise = await currentOrgHasFeature("enterprise_onboarding");
    if (!hasEnterprise) {
      return NextResponse.json({ error: "Enterprise feature not enabled" }, { status: 403 });
    }

    const profile = await requireProfile();
    await requirePermission("reminder_rules_write");

    const admin = supabaseAdmin();

    // Verify the template belongs to the org
    const { data: template, error: tErr } = await admin
      .from("templates")
      .select("id, org_id")
      .eq("id", templateId)
      .eq("org_id", profile.org_id)
      .maybeSingle();

    if (tErr) return NextResponse.json({ error: tErr.message }, { status: 400 });
    if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

    const { data: rules, error } = await admin
      .from("reminder_rules")
      .select("*")
      .eq("template_id", templateId)
      .eq("org_id", profile.org_id)
      .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ rules: rules ?? [] });
  } catch (e: any) {
    if (e instanceof HttpError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: templateId } = await params;

  try {
    const hasEnterprise = await currentOrgHasFeature("enterprise_onboarding");
    if (!hasEnterprise) {
      return NextResponse.json({ error: "Enterprise feature not enabled" }, { status: 403 });
    }

    const profile = await requireProfile();
    await requirePermission("reminder_rules_write");

    const body = await req.json().catch(() => null);
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const admin = supabaseAdmin();

    // Verify the template belongs to the org
    const { data: template, error: tErr } = await admin
      .from("templates")
      .select("id, org_id")
      .eq("id", templateId)
      .eq("org_id", profile.org_id)
      .maybeSingle();

    if (tErr) return NextResponse.json({ error: tErr.message }, { status: 400 });
    if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

    const { data: rule, error } = await admin
      .from("reminder_rules")
      .insert({
        org_id: profile.org_id,
        template_id: templateId,
        phase_number: parsed.data.phase_number ?? null,
        rule_type: parsed.data.rule_type,
        trigger_offset_days: parsed.data.trigger_offset_days,
        subject: parsed.data.subject,
        body: parsed.data.body,
        is_active: true,
      })
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ rule }, { status: 201 });
  } catch (e: any) {
    if (e instanceof HttpError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
  }
}
