import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
]);

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

function jsonError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

async function ensureBucket(admin: ReturnType<typeof supabaseAdmin>, bucket: string) {
  try {
    const { data: buckets } = await admin.storage.listBuckets();
    const exists = (buckets ?? []).some((b) => b.name === bucket);
    if (!exists) {
      await admin.storage.createBucket(bucket, { public: false, fileSizeLimit: MAX_SIZE });
    }
  } catch {
    // Bucket likely already exists; proceed
  }
}

export async function POST(req: Request) {
  try {
    const profile = await requireProfile();
    const role = await requireRole(["owner", "admin", "member"]);

    if (!roleHasPermission(role, "templates_write")) {
      return jsonError(403, "Forbidden");
    }

    const orgId = (profile as any).org_id as string | undefined;
    if (!orgId) return jsonError(401, "No org_id on profile");

    const form = await req.formData().catch(() => null);
    if (!form) return jsonError(400, "Invalid form data");

    const file = form.get("file");
    if (!(file instanceof File)) return jsonError(400, "Missing file");

    if (file.size > MAX_SIZE) return jsonError(400, "File too large (max 25MB)");

    const mimeType = file.type || "application/octet-stream";
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return jsonError(400, `Unsupported file type: ${mimeType}`);
    }

    const admin = supabaseAdmin();
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "clientenforce-uploads";
    await ensureBucket(admin, bucket);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const path = `org_${orgId}/templates/${Date.now()}_${safeName}`;

    const { error: uploadErr } = await admin.storage.from(bucket).upload(path, file, {
      upsert: false,
      contentType: mimeType,
    });

    if (uploadErr) return jsonError(500, uploadErr.message);

    const attachment_path = `${bucket}:${path}`;

    await admin.from("audit_logs").insert({
      org_id: orgId,
      actor_user_id: (profile as any).user_id ?? null,
      action: "template.attachment_uploaded",
      entity_type: "template",
      entity_id: null,
      metadata: { storage: { bucket, path }, filename: file.name },
    });

    return NextResponse.json({ ok: true, attachment_path });
  } catch (e: any) {
    return jsonError(500, e?.message || "Upload failed");
  }
}
