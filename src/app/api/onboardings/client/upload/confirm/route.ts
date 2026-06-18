import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";

const Schema = z.object({
  token: z.string().min(16).max(128),
  requirement_id: z.string().uuid(),
  // "bucket:path" format produced by the presign step
  path: z.string().min(1).max(1024),
});

function jsonError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  const admin = supabaseAdmin();

  const body = await req.json().catch(() => null);
  if (!body) return jsonError(400, "Invalid JSON");

  const parsed = Schema.safeParse(body);
  if (!parsed.success) return jsonError(400, "Invalid payload");

  const { token, requirement_id, path: filePath } = parsed.data;

  // Verify the path looks like "bucket:org_<id>/..." to prevent arbitrary path injection
  if (!filePath.includes(":") || !filePath.includes("/")) {
    return jsonError(400, "Invalid path format");
  }

  const { data: onboarding, error: onboardingErr } = await admin
    .from("onboardings")
    .select("id, org_id, status, locked_at")
    .eq("client_token", token)
    .single();

  if (onboardingErr || !onboarding) return jsonError(404, "Invalid token");
  if (onboarding.locked_at || onboarding.status === "locked") return jsonError(423, "Onboarding is locked");
  if (onboarding.status === "submitted") return jsonError(409, "Onboarding is already submitted");

  // Verify path belongs to this org
  const [bucket, ...pathParts] = filePath.split(":");
  const storagePath = pathParts.join(":");
  if (!storagePath.startsWith(`org_${onboarding.org_id}/`)) {
    return jsonError(403, "Forbidden");
  }

  const { data: reqRow, error: reqErr } = await admin
    .from("onboarding_requirements")
    .select("id, onboarding_id, type, file_paths, review_status")
    .eq("id", requirement_id)
    .single();

  if (reqErr || !reqRow) return jsonError(400, reqErr?.message || "Requirement not found");
  if (reqRow.onboarding_id !== onboarding.id) return jsonError(403, "Forbidden");

  const nowIso = new Date().toISOString();

  const existingPaths: string[] = Array.isArray((reqRow as any).file_paths)
    ? (reqRow as any).file_paths as string[]
    : [];
  const isRevision = (reqRow as any).review_status === "needs_revision";
  const updatedPaths = isRevision ? [filePath] : [...existingPaths, filePath];

  const { data: updated, error: updErr } = await admin
    .from("onboarding_requirements")
    .update({
      file_path: filePath,
      file_paths: updatedPaths,
      completed_at: nowIso,
      completed_by: "client",
      updated_at: nowIso,
    })
    .eq("id", reqRow.id)
    .select("id, file_path, file_paths, completed_at")
    .single();

  if (updErr) {
    const msg = String(updErr.message || "");
    if (msg.includes("file_paths") || msg.includes("schema cache") || msg.includes("does not exist")) {
      const { data: fallback, error: fallbackErr } = await admin
        .from("onboarding_requirements")
        .update({ file_path: filePath, completed_at: nowIso, completed_by: "client", updated_at: nowIso })
        .eq("id", reqRow.id)
        .select("id, file_path, completed_at")
        .single();
      if (fallbackErr) return jsonError(400, fallbackErr.message);
      return NextResponse.json({ ok: true, file_path: filePath, requirement: fallback });
    }
    return jsonError(400, updErr.message);
  }

  if (onboarding.status === "sent") {
    await admin.from("onboardings").update({ status: "in_progress", updated_at: nowIso }).eq("id", onboarding.id);
    await admin.from("audit_logs").insert({
      org_id: onboarding.org_id,
      actor_user_id: null,
      action: "onboarding.client_started",
      entity_type: "onboarding",
      entity_id: onboarding.id,
      metadata: { requirement_id: reqRow.id },
    });
  } else {
    await admin.from("onboardings").update({ updated_at: nowIso }).eq("id", onboarding.id);
  }

  await admin.from("audit_logs").insert({
    org_id: onboarding.org_id,
    actor_user_id: null,
    action: "onboarding.client_file_uploaded",
    entity_type: "onboarding_requirement",
    entity_id: reqRow.id,
    metadata: { onboarding_id: onboarding.id, requirement_id: reqRow.id, storage: { bucket, path: storagePath } },
  });

  return NextResponse.json({ ok: true, file_path: filePath, requirement: updated });
}
