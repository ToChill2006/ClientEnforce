export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requirePermission, HttpError } from "@/lib/rbac";
import { currentOrgHasFeature } from "@/lib/feature-flags";
import { logAudit } from "@/lib/audit";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

const CreateSchema = z.object({
  template_id: z.string().uuid().optional().nullable(),
  phase_number: z.number().int().positive().optional().nullable(),
  rule_type: z.enum(["deadline_based", "inactivity_based", "missing_item_based"]).default("deadline_based"),
  trigger_offset_days: z.number().int().min(0).max(365),
  subject: z.string().min(1).max(500),
  body: z.string().min(1),
  is_active: z.boolean().default(true),
});

export async function GET() {
  try {
    const hasEnterprise = await currentOrgHasFeature("enterprise_onboarding");
    if (!hasEnterprise) return err(403, "Enterprise feature not enabled");

    const profile = await requireProfile();
    const admin = supabaseAdmin();

    const { data: rules, error } = await admin
      .from("reminder_rules")
      .select("*")
      .eq("org_id", profile.org_id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) return err(400, error.message);
    return NextResponse.json({ rules: rules ?? [] });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message ?? "Internal error");
  }
}

export async function POST(req: Request) {
  try {
    const hasEnterprise = await currentOrgHasFeature("enterprise_onboarding");
    if (!hasEnterprise) return err(403, "Enterprise feature not enabled");

    const profile = await requireProfile();
    await requirePermission("reminder_rules_write");

    const body = await req.json().catch(() => null);
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) return err(400, JSON.stringify(parsed.error.flatten()));

    const admin = supabaseAdmin();
    const now = new Date().toISOString();

    const { data: rule, error } = await admin
      .from("reminder_rules")
      .insert({
        org_id: profile.org_id,
        template_id: parsed.data.template_id ?? null,
        phase_number: parsed.data.phase_number ?? null,
        rule_type: parsed.data.rule_type,
        trigger_offset_days: parsed.data.trigger_offset_days,
        subject: parsed.data.subject,
        body: parsed.data.body,
        is_active: parsed.data.is_active,
        created_at: now,
        updated_at: now,
      })
      .select("*")
      .single();

    if (error) return err(400, error.message);
    logAudit({
      org_id: profile.org_id,
      actor_user_id: profile.user_id,
      actor_email: profile.email,
      action: "reminder_rule.created",
      entity_type: "reminder_rule",
      entity_id: (rule as any).id,
      metadata: { rule_type: parsed.data.rule_type, trigger_offset_days: parsed.data.trigger_offset_days },
    });
    return NextResponse.json({ rule }, { status: 201 });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message ?? "Internal error");
  }
}
