import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";

const FormSchema = z.object({
  token: z.string().min(8),
  requirement_id: z.string().uuid(),
});

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

  const { data: onboarding, error: onboardingErr } = await admin
    .from("onboardings")
    .select("id, org_id, status, locked_at")
    .eq("client_token", parsed.data.token)
    .single();

  if (onboardingErr || !onboarding) return jsonError(404, "Invalid token");
  if (onboarding.locked_at || onboarding.status === "locked") return jsonError(423, "Onboarding is locked");
  if (onboarding.status === "submitted") return jsonError(409, "Onboarding is already submitted");

  const { data: reqRow, error: reqErr } = await admin
    .from("onboarding_requirements")
    .select("id, onboarding_id, type")
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

  const { data: updated, error: updErr } = await admin
    .from("onboarding_requirements")
    .update({
      file_path: `${bucket}:${path}`,
      completed_at: nowIso,
      completed_by: "client",
      updated_at: nowIso,
    })
    .eq("id", reqRow.id)
    .select("id, file_path, completed_at")
    .single();

  if (updErr) return jsonError(400, updErr.message);

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

  return NextResponse.json({ ok: true, file_path: updated.file_path, requirement: updated });
}
