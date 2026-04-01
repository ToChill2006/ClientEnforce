import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

function basename(p: string) {
  const clean = p.split("?")[0].replace(/^\/+/, "");
  const parts = clean.split("/").filter(Boolean);
  return parts[parts.length - 1] || "file";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const requirement_id = url.searchParams.get("requirement_id");

  if (!token || token.length < 8) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  if (!requirement_id) {
    return NextResponse.json({ error: "Missing requirement_id" }, { status: 400 });
  }

  const admin = supabaseAdmin();

  // Resolve onboarding by client token
  const { data: onboarding, error: oErr } = await admin
    .from("onboardings")
    .select("id, org_id")
    .eq("client_token", token)
    .single();

  if (oErr || !onboarding) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  // Verify the requirement belongs to this onboarding and has an attachment_path
  const { data: reqRow, error: rErr } = await admin
    .from("onboarding_requirements")
    .select("id, onboarding_id, attachment_path")
    .eq("id", requirement_id)
    .single();

  if (rErr || !reqRow) {
    return NextResponse.json({ error: "Requirement not found" }, { status: 404 });
  }
  if (reqRow.onboarding_id !== onboarding.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const attachmentPath: string | null = (reqRow as any).attachment_path ?? null;
  if (!attachmentPath) {
    return NextResponse.json({ error: "No attachment on this requirement" }, { status: 404 });
  }

  // Parse bucket:path
  const colonIdx = attachmentPath.indexOf(":");
  const bucket = colonIdx > 0 ? attachmentPath.slice(0, colonIdx) : "clientenforce-uploads";
  const objectPath = colonIdx > 0 ? attachmentPath.slice(colonIdx + 1).replace(/^\/+/, "") : attachmentPath;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Missing Supabase env vars" }, { status: 500 });
  }

  const filename = basename(objectPath);
  const objectUrl = `${supabaseUrl.replace(/\/+$/, "")}/storage/v1/object/${encodeURIComponent(bucket)}/${objectPath}`;

  const res = await fetch(`${objectUrl}?download=${encodeURIComponent(filename)}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json({ error: "Failed to fetch attachment", detail: text.slice(0, 300) }, { status: 500 });
  }

  const contentType = res.headers.get("content-type") || "application/octet-stream";
  const buf = await res.arrayBuffer();

  // Audit log the client download
  await admin.from("audit_logs").insert({
    org_id: onboarding.org_id,
    actor_user_id: null,
    action: "onboarding.client_attachment_downloaded",
    entity_type: "onboarding_requirement",
    entity_id: requirement_id,
    metadata: { onboarding_id: onboarding.id, attachment_path: attachmentPath },
  });

  return new Response(buf, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
