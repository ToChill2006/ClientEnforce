import { NextResponse } from "next/server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { supabaseAdmin } from "@/lib/supabase-admin";

function getAdminClient() {
  return typeof supabaseAdmin === "function"
    ? (supabaseAdmin as any)()
    : (supabaseAdmin as any);
}

export async function GET(req: Request) {
  const profile = await requireProfile();
  await requireRole(["owner", "admin"]);

  const url = new URL(req.url);
  const ref = url.searchParams.get("ref"); // ref can be "bucket:path" or "path"
  const download = url.searchParams.get("download") === "1";

  if (!ref) return NextResponse.json({ error: "Missing ref" }, { status: 400 });

  // Accept either:
  //  - "clientenforce-uploads:org_x/.../file.png"
  //  - "org_x/.../file.png" (defaults to uploads bucket)
  const [maybeBucket, ...rest] = ref.split(":");
  const hasBucket = rest.length > 0;

  const bucket = hasBucket ? maybeBucket : "clientenforce-uploads";
  const path = hasBucket ? rest.join(":") : ref;

  const admin = getAdminClient();

  const { data, error } = await admin.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 10, download ? { download: true } : undefined);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ url: data?.signedUrl });
}