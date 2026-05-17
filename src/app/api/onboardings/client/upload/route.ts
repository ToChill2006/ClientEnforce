import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";

const FormSchema = z.object({
  token: z.string().min(8),
  requirement_id: z.string().uuid(),
});

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const ALLOWED_MIME_TYPES = new Set([
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/heic",
  "image/heif",
  // Archives
  "application/zip",
  "application/x-zip-compressed",
]);

function isSafeFilename(name: string): boolean {
  // Reject path traversal and dangerous extensions
  if (name.includes("..") || name.includes("/") || name.includes("\\")) return false;
  const dangerous = /\.(exe|bat|cmd|sh|ps1|msi|dll|com|scr|vbs|jar|php|py|rb|pl)$/i;
  return !dangerous.test(name);
}

function jsonError(status: number, message: string, details?: any) {
  return NextResponse.json({ error: message, details }, { status });
}

async function ensureBucket(admin: ReturnType<typeof supabaseAdmin>, bucket: string) {
  const { data: buckets, error } = await admin.storage.listBuckets();
  if (error) throw new Error(error.message);

  const exists = (buckets ?? []).some((b) => b.name === bucket);
  if (exists) return;

  const { error: createErr } = await admin.storage.createBucket(bucket, {
    public: false,
    fileSizeLimit: 25 * 1024 * 1024,
  });
  if (createErr) throw new Error(createErr.message);
}

export async function POST(req: Request) {
  const admin = supabaseAdmin();

  const form = await req.formData().catch(() => null);
  if (!form) return jsonError(400, "Invalid form data");

  const token = String(form.get("token") || "");
  const requirement_id = String(form.get("requirement_id") || "");
  const file = form.get("file");

  const parsed = FormSchema.safeParse({ token, requirement_id });
  if (!parsed.success) {
    return jsonError(400, "Invalid payload", parsed.error.flatten());
  }

  if (!(file instanceof File)) {
    return jsonError(400, "Missing file");
  }

  if (file.size > MAX_FILE_SIZE) {
    return jsonError(400, `File too large. Maximum size is 25 MB.`);
  }

  const mimeType = (file.type || "").toLowerCase();
  if (!mimeType || !ALLOWED_MIME_TYPES.has(mimeType)) {
    return jsonError(400, `Unsupported file type: ${mimeType || "unknown"}. Please upload a PDF, image, or Office document.`);
  }

  if (!isSafeFilename(file.name)) {
    return jsonError(400, "Invalid file name.");
  }

  const { data: onboarding, error: onboardingErr } = await admin
    .from("onboardings")
    .select("id, org_id, status, locked_at")
    .eq("client_token", parsed.data.token)
    .single();

  if (onboardingErr || !onboarding) return jsonError(404, "Invalid token");
  if (onboarding.locked_at || onboarding.status === "locked") return jsonError(423, "Onboarding is locked");
  if (onboarding.status === "submitted") return jsonError(409, "Onboarding is already submitted");

  // Fetch the requirement row — include file_paths so we can append to it
  const { data: reqRow, error: reqErr } = await admin
    .from("onboarding_requirements")
    .select("id, onboarding_id, type, file_paths, review_status")
    .eq("id", parsed.data.requirement_id)
    .single();

  if (reqErr || !reqRow) return jsonError(400, reqErr?.message || "Requirement not found");
  if (reqRow.onboarding_id !== onboarding.id) return jsonError(403, "Forbidden");

  const type = String((reqRow as any).type || "").toLowerCase();
  if (!(type === "file" || type === "upload")) {
    return jsonError(400, "Not a file requirement");
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "clientenforce-uploads";

  try {
    await ensureBucket(admin, bucket);
  } catch (e: any) {
    return jsonError(500, "Storage bucket error", e?.message || String(e));
  }

  // Build a unique storage path
  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const path = `org_${onboarding.org_id}/onboarding_${onboarding.id}/${yyyy}-${mm}-${dd}/${reqRow.id}/${Date.now()}_${safeName}`;

  const { error: uploadErr } = await admin.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || "application/octet-stream",
  });

  if (uploadErr) return jsonError(400, uploadErr.message);

  const nowIso = new Date().toISOString();
  const newFilePath = `${bucket}:${path}`;

  // On revision (needs_revision), replace all previous files — the client is submitting a corrected version.
  // On initial upload, append so multiple files can be attached.
  const existingPaths: string[] = Array.isArray((reqRow as any).file_paths)
    ? (reqRow as any).file_paths as string[]
    : [];
  const isRevision = (reqRow as any).review_status === "needs_revision";
  const updatedPaths = isRevision ? [newFilePath] : [...existingPaths, newFilePath];

  const { data: updated, error: updErr } = await admin
    .from("onboarding_requirements")
    .update({
      file_path: newFilePath,          // backward-compat: most recent file
      file_paths: updatedPaths,        // Feature 4: full list
      completed_at: nowIso,
      completed_by: "client",
      updated_at: nowIso,
    })
    .eq("id", reqRow.id)
    .select("id, file_path, file_paths, completed_at")
    .single();

  if (updErr) {
    // If file_paths column doesn't exist yet (migration not run), fall back gracefully
    const msg = String(updErr.message || "");
    if (msg.includes("file_paths") || msg.includes("schema cache") || msg.includes("does not exist")) {
      const { data: fallback, error: fallbackErr } = await admin
        .from("onboarding_requirements")
        .update({ file_path: newFilePath, completed_at: nowIso, completed_by: "client", updated_at: nowIso })
        .eq("id", reqRow.id)
        .select("id, file_path, completed_at")
        .single();
      if (fallbackErr) return jsonError(400, fallbackErr.message);
      return NextResponse.json({ ok: true, file_path: newFilePath, requirement: fallback });
    }
    return jsonError(400, updErr.message);
  }

  // Auto-transition onboarding status
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
    metadata: { onboarding_id: onboarding.id, requirement_id: reqRow.id, storage: { bucket, path } },
  });

  return NextResponse.json({ ok: true, file_path: newFilePath, requirement: updated });
}
