import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requireRole, HttpError } from "@/lib/rbac";
import { currentOrgHasFeature } from "@/lib/feature-flags";

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
  "image/gif",
  "text/plain",
]);

const MAX_SIZE = 100 * 1024 * 1024;

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const profile = await requireProfile();
    await requireRole(["owner", "admin", "member", "onboarder", "reviewer"]);
    const orgId = profile.org_id;
    if (!orgId) return err(400, "No organization");

    const form = await req.formData().catch(() => null);
    if (!form) return err(400, "Invalid form data");

    const file = form.get("file");
    if (!(file instanceof File)) return err(400, "Missing file");
    if (file.size > MAX_SIZE) return err(400, "File too large (max 25MB)");

    const mimeType = file.type || "application/octet-stream";
    if (!ALLOWED_MIME_TYPES.has(mimeType)) return err(400, `Unsupported file type: ${mimeType}`);

    const admin = supabaseAdmin();
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "clientenforce-uploads";

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
    const path = `org_${orgId}/board/${eventId}/${Date.now()}_${safeName}`;

    const { error: uploadErr } = await admin.storage.from(bucket).upload(path, file, {
      upsert: false,
      contentType: mimeType,
    });

    if (uploadErr) return err(500, uploadErr.message);

    return NextResponse.json({ file_path: `${bucket}:${path}`, file_name: file.name });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Upload failed");
  }
}
