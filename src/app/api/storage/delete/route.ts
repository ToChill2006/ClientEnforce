import { NextResponse } from "next/server";
import { z } from "zod";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const BodySchema = z.object({
  path: z.string().min(1),
  bucket: z.string().trim().min(1).optional(),
  type: z.enum(["file", "signature"]).optional(),
});

function parseBucketAndObjectPath(pathParam: string, bucketParam?: string | null): { bucket: string; objectPath: string; invalid?: boolean } {
  const raw = decodeURIComponent(pathParam).trim();

  // Block path traversal and dangerous characters
  if (raw.includes("..") || raw.includes("//") || /[<>|*?]/.test(raw)) {
    return { bucket: "", objectPath: "", invalid: true };
  }

  const objectMarker = "/storage/v1/object/";
  if (raw.includes(objectMarker)) {
    const after = raw.split(objectMarker)[1] || "";
    const parts = after.split("/").filter(Boolean);
    const bucket = parts.shift() || "";
    const objectPath = parts.join("/");
    return { bucket, objectPath };
  }

  const colonIdx = raw.indexOf(":");
  if (colonIdx > 0) {
    const bucket = raw.slice(0, colonIdx);
    const objectPath = raw.slice(colonIdx + 1).replace(/^\/+/, "");
    return { bucket, objectPath };
  }

  const knownBuckets = ["clientenforce-uploads", "clientenforce-signatures"];
  for (const b of knownBuckets) {
    if (raw.startsWith(b + "/")) {
      return { bucket: b, objectPath: raw.slice(b.length + 1) };
    }
  }

  return {
    bucket: bucketParam || "clientenforce-uploads",
    objectPath: raw.replace(/^\/+/, ""),
  };
}

function canAccessObject(params: {
  orgIdRaw: string;
  bucket: string;
  objectPath: string;
}) {
  const expectedOrgPrefix = `org_${params.orgIdRaw}/`;
  const expectedLegacySigPrefix = `${params.orgIdRaw}/`;

  return (
    params.objectPath.startsWith(expectedOrgPrefix) ||
    (params.bucket === "clientenforce-signatures" &&
      (params.objectPath.startsWith(expectedLegacySigPrefix) ||
        params.objectPath.startsWith(expectedOrgPrefix)))
  );
}

function inferKind(params: {
  explicitType?: "file" | "signature";
  bucket: string;
  objectPath: string;
  orgIdRaw: string;
}): "file" | "signature" {
  if (params.explicitType) return params.explicitType;
  if (params.bucket === "clientenforce-signatures") return "signature";
  if (params.objectPath.startsWith(`${params.orgIdRaw}/`)) return "signature";
  return "file";
}

export async function POST(req: Request) {
  try {
    const profile = await requireProfile();
    const role = await requireRole(["owner", "admin", "member"]);
    if (!roleHasPermission(role, "storage_delete")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const orgId = String((profile as any)?.org_id ?? "").trim();
    if (!orgId) {
      return NextResponse.json({ error: "No organization found for current user." }, { status: 400 });
    }

    const bodyRaw = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(bodyRaw);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
    }

    const orgIdRaw = orgId.startsWith("org_") ? orgId.slice("org_".length) : orgId;
    const parsed2 = parseBucketAndObjectPath(parsed.data.path, parsed.data.bucket);
    if (parsed2.invalid) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }
    const { bucket: parsedBucket, objectPath } = parsed2;
    let bucket = parsedBucket;

    if (!parsed.data.bucket && bucket === "clientenforce-uploads" && objectPath.startsWith(`${orgIdRaw}/`)) {
      bucket = "clientenforce-signatures";
    }

    if (bucket !== "clientenforce-uploads" && bucket !== "clientenforce-signatures") {
      return NextResponse.json({ error: "Unsupported bucket." }, { status: 400 });
    }

    if (!canAccessObject({ orgIdRaw, bucket, objectPath })) {
      return NextResponse.json({ error: "Forbidden path", bucket, objectPath }, { status: 403 });
    }

    const admin = supabaseAdmin();
    const kind = inferKind({
      explicitType: parsed.data.type,
      bucket,
      objectPath,
      orgIdRaw,
    });

    const fullRef = `${bucket}:${objectPath}`;
    const altRef = `${bucket}/${objectPath}`;
    const matchRefs = [fullRef, objectPath, altRef];
    const nowIso = new Date().toISOString();

    const column = kind === "signature" ? "signature_path" : "file_path";
    const selectColumns = "id,file_path,signature_path,value_text,completed_at,completed_by";

    const { data: reqRows, error: reqErr } = await admin
      .from("onboarding_requirements")
      .select(selectColumns)
      .eq("org_id", orgId)
      .in(column, matchRefs);

    if (reqErr) {
      return NextResponse.json({ error: reqErr.message }, { status: 400 });
    }

    for (const row of reqRows ?? []) {
      const nextFilePath = kind === "file" ? null : (row as any).file_path ?? null;
      const nextSignaturePath = kind === "signature" ? null : (row as any).signature_path ?? null;
      const nextValueText = ((row as any).value_text ?? "").toString().trim();
      const hasRemainingValue = !!nextFilePath || !!nextSignaturePath || nextValueText.length > 0;

      const patch: Record<string, any> = {
        file_path: nextFilePath,
        signature_path: nextSignaturePath,
        completed_at: hasRemainingValue ? (row as any).completed_at ?? nowIso : null,
        completed_by: hasRemainingValue ? (row as any).completed_by ?? null : null,
        updated_at: nowIso,
      };

      const { error: updErr } = await admin
        .from("onboarding_requirements")
        .update(patch)
        .eq("id", (row as any).id)
        .eq("org_id", orgId);

      if (updErr) {
        return NextResponse.json({ error: updErr.message }, { status: 400 });
      }
    }

    const { error: removeErr } = await admin.storage.from(bucket).remove([objectPath]);
    if (removeErr) {
      return NextResponse.json({ error: removeErr.message }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      kind,
      deleted: {
        bucket,
        path: objectPath,
      },
      cleared_requirements: (reqRows ?? []).length,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Delete failed" }, { status: 500 });
  }
}
