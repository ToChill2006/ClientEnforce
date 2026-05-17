import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { permissionDenied, selectOrganizationTier } from "@/lib/plan-enforcement";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const BUCKET = "org-logos";
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

async function ensureBucket(admin: ReturnType<typeof supabaseAdmin>) {
  const { data: buckets, error } = await admin.storage.listBuckets();
  if (error) throw new Error(error.message);
  if ((buckets ?? []).some((b) => b.name === BUCKET)) return;
  const { error: createErr } = await admin.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_BYTES,
    allowedMimeTypes: ALLOWED_TYPES,
  });
  if (createErr) throw new Error(createErr.message);
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin"]);

  if (!roleHasPermission(role, "invites_create")) {
    return NextResponse.json({ error: permissionDenied("Only owners and admins can update white-label settings.") }, { status: 403 });
  }

  const admin = supabaseAdmin();
  const { tier, error: tierErr } = await selectOrganizationTier(admin, profile.org_id);
  if (tierErr) return NextResponse.json({ error: tierErr.message }, { status: 400 });
  if (tier !== "agency") {
    return NextResponse.json({ error: "White-label features require the Agency Pro plan." }, { status: 403 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });

  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing file" }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "File must be PNG, JPEG, WebP, or SVG." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be under 2 MB." }, { status: 400 });
  }

  try {
    await ensureBucket(admin);
  } catch (e: any) {
    return NextResponse.json({ error: `Storage error: ${e?.message}` }, { status: 500 });
  }

  const ext = file.type === "image/svg+xml" ? "svg" : file.type.split("/")[1];
  const path = `${profile.org_id}/logo.${ext}`;

  const { error: uploadErr } = await admin.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  });

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 500 });

  const { data: publicData } = admin.storage.from(BUCKET).getPublicUrl(path);
  const logoUrl = publicData.publicUrl;

  // Persist immediately into white_label_settings
  const { data: existing } = await admin
    .from("organizations")
    .select("white_label_settings")
    .eq("id", profile.org_id)
    .single();

  const merged = { ...((existing as any)?.white_label_settings ?? {}), logo_url: logoUrl };
  await admin.from("organizations").update({ white_label_settings: merged } as any).eq("id", profile.org_id);

  logAudit({
    org_id: profile.org_id,
    actor_user_id: profile.user_id,
    actor_email: profile.email,
    actor_role: role,
    action: "white_label.logo_uploaded",
    entity_type: "org",
  });
  return NextResponse.json({ ok: true, logo_url: logoUrl });
}
