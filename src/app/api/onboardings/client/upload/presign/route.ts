import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";

const Schema = z.object({
  token: z.string().min(16).max(128),
  requirement_id: z.string().uuid(),
  filename: z.string().min(1).max(512),
  content_type: z.string().min(1).max(256),
  size: z.number().int().positive().max(25 * 1024 * 1024),
});

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/heic",
  "image/heif",
  "application/zip",
  "application/x-zip-compressed",
]);

function isSafeFilename(name: string): boolean {
  if (name.includes("..") || name.includes("/") || name.includes("\\")) return false;
  const dangerous = /\.(exe|bat|cmd|sh|ps1|msi|dll|com|scr|vbs|jar|php|asp|aspx|jsp|py|rb|pl|node|cgi|htaccess|htpasswd)$/i;
  return !dangerous.test(name);
}

function jsonError(status: number, message: string, details?: unknown) {
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

  const body = await req.json().catch(() => null);
  if (!body) return jsonError(400, "Invalid JSON");

  const parsed = Schema.safeParse(body);
  if (!parsed.success) return jsonError(400, "Invalid payload", parsed.error.flatten());

  const { token, requirement_id, filename, content_type, size } = parsed.data;

  const mimeType = content_type.toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return jsonError(400, `Unsupported file type: ${mimeType || "unknown"}.`);
  }

  if (!isSafeFilename(filename)) return jsonError(400, "Invalid file name.");

  const { data: onboarding, error: onboardingErr } = await admin
    .from("onboardings")
    .select("id, org_id, status, locked_at")
    .eq("client_token", token)
    .single();

  if (onboardingErr || !onboarding) return jsonError(404, "Invalid token");
  if (onboarding.locked_at || onboarding.status === "locked") return jsonError(423, "Onboarding is locked");
  if (onboarding.status === "submitted") return jsonError(409, "Onboarding is already submitted");

  const { data: reqRow, error: reqErr } = await admin
    .from("onboarding_requirements")
    .select("id, onboarding_id, type")
    .eq("id", requirement_id)
    .single();

  if (reqErr || !reqRow) return jsonError(400, reqErr?.message || "Requirement not found");
  if (reqRow.onboarding_id !== onboarding.id) return jsonError(403, "Forbidden");

  const type = String((reqRow as any).type || "").toLowerCase();
  if (!(type === "file" || type === "upload")) return jsonError(400, "Not a file requirement");

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "clientenforce-uploads";

  try {
    await ensureBucket(admin, bucket);
  } catch (e: any) {
    return jsonError(500, "Storage bucket error", e?.message || String(e));
  }

  const now = new Date();
  const yyyy = String(now.getUTCFullYear());
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const safeName = filename.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const path = `org_${onboarding.org_id}/onboarding_${onboarding.id}/${yyyy}-${mm}-${dd}/${reqRow.id}/${Date.now()}_${safeName}`;

  const { data: signedData, error: signErr } = await admin.storage
    .from(bucket)
    .createSignedUploadUrl(path);

  if (signErr || !signedData) return jsonError(500, signErr?.message || "Could not create signed URL");

  return NextResponse.json({
    signed_url: signedData.signedUrl,
    path: `${bucket}:${path}`,
  });
}
