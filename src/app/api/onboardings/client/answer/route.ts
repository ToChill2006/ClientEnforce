import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

const Payload = z.object({
  token: z.string().min(8),
  requirement_id: z.string().min(1),
  // one of these will typically be present depending on requirement type
  value_text: z.string().optional().nullable(),
  file_path: z.string().optional().nullable(),
  signature_path: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Payload.safeParse(body);
  if (!parsed.success) return json(400, { error: "Invalid payload", details: parsed.error.flatten() });

  const { token, requirement_id, value_text, file_path, signature_path } = parsed.data;

  const admin = supabaseAdmin();

  // Resolve onboarding by token
  const { data: onboarding, error: oErr } = await admin
    .from("onboardings")
    .select("id, org_id, status, locked_at")
    .eq("client_token", token)
    .single();

  if (oErr || !onboarding) return json(404, { error: "Invalid link" });

  const locked = Boolean(onboarding.locked_at) || onboarding.status === "locked";
  if (locked) return json(423, { error: "Onboarding is locked" });

  // Ensure requirement belongs to this onboarding
  const { data: reqRow, error: rErr } = await admin
    .from("onboarding_requirements")
    .select("id, onboarding_id, is_required")
    .eq("id", requirement_id)
    .eq("onboarding_id", onboarding.id)
    .single();

  if (rErr || !reqRow) return json(404, { error: "Requirement not found" });

  // Determine completion: any non-empty value/file/signature counts as completed.
  const hasText = typeof value_text === "string" && value_text.trim().length > 0;
  const hasFile = typeof file_path === "string" && file_path.trim().length > 0;
  const hasSig = typeof signature_path === "string" && signature_path.trim().length > 0;
  const isComplete = hasText || hasFile || hasSig;

  const now = new Date().toISOString();

  const update: Record<string, any> = {
    value_text: value_text ?? null,
    file_path: file_path ?? null,
    signature_path: signature_path ?? null,
    completed_at: isComplete ? now : null,
    updated_at: now,
  };

  const { data: updated, error: uErr } = await admin
    .from("onboarding_requirements")
    .update(update)
    .eq("id", requirement_id)
    .eq("onboarding_id", onboarding.id)
    .select("id,onboarding_id,type,label,is_required,sort_order,completed_at,value_text,file_path,signature_path,updated_at")
    .single();

  if (uErr || !updated) return json(400, { error: uErr?.message || "Update failed" });

  if (isComplete && onboarding.status === "sent") {
    await admin
      .from("onboardings")
      .update({ status: "in_progress", updated_at: now })
      .eq("id", onboarding.id)
      .eq("org_id", onboarding.org_id);

    await admin.from("audit_logs").insert({
      org_id: onboarding.org_id,
      actor_user_id: null,
      action: "onboarding.client_started",
      entity_type: "onboarding",
      entity_id: onboarding.id,
      metadata: { requirement_id },
    });
  } else {
    // Touch onboarding updated_at (optional but makes lists look correct)
    await admin.from("onboardings").update({ updated_at: now }).eq("id", onboarding.id).eq("org_id", onboarding.org_id);
  }

  return json(200, { ok: true, requirement: updated });
}
