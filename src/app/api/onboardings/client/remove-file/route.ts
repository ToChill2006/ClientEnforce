// Feature 4: Remove a single file from a multi-file upload requirement.
// Takes the specific "bucket:path" string to remove from the file_paths array.

import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";

function jsonError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

const Payload = z.object({
  token: z.string().min(8),
  requirement_id: z.string().uuid(),
  // The exact "bucket:path" string to remove — must match an entry in file_paths
  file_path: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Payload.safeParse(body);
  if (!parsed.success) return jsonError(400, "Invalid payload");

  const { token, requirement_id, file_path: pathToRemove } = parsed.data;

  const admin = supabaseAdmin();

  // Resolve onboarding from token
  const { data: onboarding, error: oErr } = await admin
    .from("onboardings")
    .select("id, org_id, status, locked_at")
    .eq("client_token", token)
    .single();

  if (oErr || !onboarding) return jsonError(404, "Invalid link");
  if (Boolean(onboarding.locked_at) || onboarding.status === "locked") return jsonError(423, "Onboarding is locked");

  // Fetch the requirement and verify ownership
  const { data: reqRow, error: rErr } = await admin
    .from("onboarding_requirements")
    .select("id, onboarding_id, type, file_path, file_paths")
    .eq("id", requirement_id)
    .eq("onboarding_id", onboarding.id)
    .single();

  if (rErr || !reqRow) return jsonError(404, "Requirement not found");

  const type = String((reqRow as any).type || "").toLowerCase();
  if (!(type === "file" || type === "upload")) return jsonError(400, "Not a file requirement");

  // Build the updated file list
  const existing: string[] = Array.isArray((reqRow as any).file_paths)
    ? (reqRow as any).file_paths as string[]
    : (reqRow as any).file_path ? [(reqRow as any).file_path as string] : [];

  const remaining = existing.filter((p) => p !== pathToRemove);

  // If the path wasn't found, return early (idempotent)
  if (remaining.length === existing.length) {
    return NextResponse.json({ ok: true, file_paths: existing, completed: existing.length > 0 });
  }

  const nowIso = new Date().toISOString();
  const isComplete = remaining.length > 0;

  const { error: updErr } = await admin
    .from("onboarding_requirements")
    .update({
      file_paths: remaining,
      // Keep file_path pointing to the last remaining file (or null if all removed)
      file_path: remaining[remaining.length - 1] ?? null,
      completed_at: isComplete ? (reqRow as any).completed_at : null,
      updated_at: nowIso,
    })
    .eq("id", requirement_id)
    .eq("onboarding_id", onboarding.id);

  if (updErr) {
    // Graceful fallback when file_paths column doesn't exist yet
    const msg = String(updErr.message || "");
    if (msg.includes("file_paths") || msg.includes("schema cache") || msg.includes("does not exist")) {
      await admin
        .from("onboarding_requirements")
        .update({ file_path: null, completed_at: null, updated_at: nowIso })
        .eq("id", requirement_id)
        .eq("onboarding_id", onboarding.id);
      return NextResponse.json({ ok: true, file_paths: [], completed: false });
    }
    return jsonError(400, updErr.message);
  }

  await admin.from("onboardings").update({ updated_at: nowIso }).eq("id", onboarding.id);

  return NextResponse.json({ ok: true, file_paths: remaining, completed: isComplete });
}
