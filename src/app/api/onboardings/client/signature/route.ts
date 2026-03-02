import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ClientSignatureSchema } from "@/lib/onboarding-schema";
import { randomUUID } from "crypto";

function dataUrlToBytes(dataUrl: string) {
  const b64 = dataUrl.split(",")[1] || "";
  const buf = Buffer.from(b64, "base64");
  return new Uint8Array(buf);
}

async function ensureBucket(admin: ReturnType<typeof supabaseAdmin>, bucket: string) {
  const { data: buckets, error } = await admin.storage.listBuckets();
  if (error) throw new Error(error.message);

  const exists = (buckets ?? []).some((b) => b.name === bucket);
  if (exists) return;

  const { error: createErr } = await admin.storage.createBucket(bucket, {
    public: false,
    fileSizeLimit: 5 * 1024 * 1024,
  });

  if (createErr) throw new Error(createErr.message);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ClientSignatureSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const admin = supabaseAdmin();

  const { data: onboarding, error: onboardingErr } = await admin
    .from("onboardings")
    .select("id, org_id, status, locked_at")
    .eq("client_token", parsed.data.token)
    .single();

  if (onboardingErr) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (onboarding.locked_at || onboarding.status === "locked") {
    return NextResponse.json({ error: "Onboarding is locked" }, { status: 423 });
  }

  const { data: reqRow, error: reqErr } = await admin
    .from("onboarding_requirements")
    .select("id, onboarding_id, type")
    .eq("id", parsed.data.requirement_id)
    .single();

  if (reqErr) return NextResponse.json({ error: reqErr.message }, { status: 400 });
  if (reqRow.onboarding_id !== onboarding.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (reqRow.type !== "signature") return NextResponse.json({ error: "Not a signature requirement" }, { status: 400 });

  const bucket = process.env.SUPABASE_SIGNATURE_BUCKET || "clientenforce-signatures";

  try {
    await ensureBucket(admin, bucket);
  } catch (e: any) {
    return NextResponse.json({ error: "Storage bucket error", details: e?.message || String(e) }, { status: 500 });
  }

  const path = `${onboarding.org_id}/${onboarding.id}/${reqRow.id}/${randomUUID()}.png`;
  const bytes = dataUrlToBytes(parsed.data.data_url);

  const { error: uploadErr } = await admin.storage.from(bucket).upload(path, bytes, {
    contentType: "image/png",
    upsert: false,
  });

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 400 });

  const now = new Date().toISOString();
  const { error: updErr } = await admin
    .from("onboarding_requirements")
    .update({
      signature_path: `${bucket}:${path}`,
      completed_at: now,
      completed_by: "client",
    })
    .eq("id", reqRow.id);

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 });

  if (onboarding.status === "sent") {
    await admin.from("onboardings").update({ status: "in_progress" }).eq("id", onboarding.id);
    await admin.from("audit_logs").insert({
      org_id: onboarding.org_id,
      actor_user_id: null,
      action: "onboarding.client_started",
      entity_type: "onboarding",
      entity_id: onboarding.id,
      metadata: {},
    });
  }

  return NextResponse.json({ ok: true, signature_path: `${bucket}:${path}` });
}