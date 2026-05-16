import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requirePermission, HttpError } from "@/lib/rbac";
import { currentOrgHasFeature } from "@/lib/feature-flags";

const PatchSchema = z.object({
  phase_number: z.number().int().positive().nullable().optional(),
  rule_type: z.enum(["deadline_based", "inactivity_based", "missing_item_based"]).optional(),
  trigger_offset_days: z.number().int().optional(),
  subject: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const hasEnterprise = await currentOrgHasFeature("enterprise_onboarding");
    if (!hasEnterprise) {
      return NextResponse.json({ error: "Enterprise feature not enabled" }, { status: 403 });
    }

    const profile = await requireProfile();
    await requirePermission("reminder_rules_write");

    const body = await req.json().catch(() => null);
    const parsed = PatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
    }

    const admin = supabaseAdmin();

    // Verify this rule belongs to the user's org
    const { data: existing, error: eErr } = await admin
      .from("reminder_rules")
      .select("id, org_id")
      .eq("id", id)
      .eq("org_id", profile.org_id)
      .maybeSingle();

    if (eErr) return NextResponse.json({ error: eErr.message }, { status: 400 });
    if (!existing) return NextResponse.json({ error: "Rule not found" }, { status: 404 });

    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (parsed.data.phase_number !== undefined) patch.phase_number = parsed.data.phase_number;
    if (parsed.data.rule_type !== undefined) patch.rule_type = parsed.data.rule_type;
    if (parsed.data.trigger_offset_days !== undefined) patch.trigger_offset_days = parsed.data.trigger_offset_days;
    if (parsed.data.subject !== undefined) patch.subject = parsed.data.subject;
    if (parsed.data.body !== undefined) patch.body = parsed.data.body;
    if (parsed.data.is_active !== undefined) patch.is_active = parsed.data.is_active;

    const { data: rule, error } = await admin
      .from("reminder_rules")
      .update(patch)
      .eq("id", id)
      .eq("org_id", profile.org_id)
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ rule });
  } catch (e: any) {
    if (e instanceof HttpError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const hasEnterprise = await currentOrgHasFeature("enterprise_onboarding");
    if (!hasEnterprise) {
      return NextResponse.json({ error: "Enterprise feature not enabled" }, { status: 403 });
    }

    const profile = await requireProfile();
    await requirePermission("reminder_rules_write");

    const admin = supabaseAdmin();

    // Verify this rule belongs to the user's org
    const { data: existing, error: eErr } = await admin
      .from("reminder_rules")
      .select("id, org_id")
      .eq("id", id)
      .eq("org_id", profile.org_id)
      .maybeSingle();

    if (eErr) return NextResponse.json({ error: eErr.message }, { status: 400 });
    if (!existing) return NextResponse.json({ error: "Rule not found" }, { status: 404 });

    // Soft delete — set is_active = false
    const { error } = await admin
      .from("reminder_rules")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("org_id", profile.org_id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e instanceof HttpError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
  }
}
