import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

const Payload = z.object({
  token: z.string().min(8),
  requirement_id: z.string().min(1),
  // One of these will be present depending on requirement type
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
    .select("id, onboarding_id, is_required, type, options, metadata")
    .eq("id", requirement_id)
    .eq("onboarding_id", onboarding.id)
    .single();

  if (rErr || !reqRow) return json(404, { error: "Requirement not found" });

  const reqType = String((reqRow as any).type || "").toLowerCase();

  // Headings are display-only — they cannot be answered
  if (reqType === "heading") {
    return json(400, { error: "Section headings cannot be answered." });
  }

  // Unpack per-type config from the snapshotted metadata column
  const meta = (reqRow as any).metadata ?? {};
  const allowMultiSelect = Boolean(meta?.allow_multi_select);
  const includeOther = Boolean(meta?.include_other);

  // ── Validate multiple_choice answers ──────────────────────────────────────

  if (reqType === "multiple_choice" && value_text) {
    const opts: string[] | null = Array.isArray((reqRow as any).options) ? (reqRow as any).options : null;

    if (opts && opts.length > 0) {
      if (allowMultiSelect) {
        // Feature 2: value_text is a JSON-encoded array of selected option strings
        let selected: unknown;
        try {
          selected = JSON.parse(value_text);
        } catch {
          return json(400, { error: "Multi-select value must be a valid JSON array." });
        }
        if (!Array.isArray(selected)) {
          return json(400, { error: "Multi-select value must be a JSON array." });
        }
        // Validate each selected item
        for (const item of selected as string[]) {
          if (!opts.includes(item)) {
            if (!includeOther) {
              return json(400, { error: `"${item}" is not a valid option.` });
            }
            // Feature 3: if includeOther is enabled, free-text entries not in options are valid
            // — only ONE other entry is expected (the last non-option item)
          }
        }
      } else {
        // Single-select: value_text is the chosen option string (or "Other" free text)
        const isInOptions = opts.includes(value_text);
        if (!isInOptions && !includeOther) {
          return json(400, { error: "Selected value is not a valid option." });
        }
        // If includeOther is true, any text not in options is allowed as a free-text "Other" answer
      }
    }
  }

  // ── Determine completion ───────────────────────────────────────────────────

  const hasText = typeof value_text === "string" && value_text.trim().length > 0;
  const hasFile = typeof file_path === "string" && file_path.trim().length > 0;
  const hasSig = typeof signature_path === "string" && signature_path.trim().length > 0;

  // Feature 2: an empty JSON array "[]" should NOT count as completed
  let multiSelectIsEmpty = false;
  if (reqType === "multiple_choice" && allowMultiSelect && value_text) {
    try {
      const arr = JSON.parse(value_text);
      if (Array.isArray(arr) && arr.length === 0) multiSelectIsEmpty = true;
    } catch { /* ignore parse error */ }
  }

  // Feature 6: checkbox is completed only when value_text === "true"
  let isComplete: boolean;
  if (reqType === "checkbox") {
    isComplete = value_text === "true";
  } else {
    isComplete = (hasText && !multiSelectIsEmpty) || hasFile || hasSig;
  }

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

  // Auto-transition onboarding to in_progress on first completion
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
    await admin.from("onboardings").update({ updated_at: now }).eq("id", onboarding.id).eq("org_id", onboarding.org_id);
  }

  return json(200, { ok: true, requirement: updated });
}
