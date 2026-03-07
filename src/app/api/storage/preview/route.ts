import { NextResponse } from "next/server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { supabaseAdmin as supabaseAdminExport } from "@/lib/supabase-admin";

type AdminClient = {
  storage: {
    from: (bucket: string) => {
      download: (path: string) => Promise<{ data: Blob | null; error: any }>;
    };
  };
};

async function getAdmin(): Promise<AdminClient> {
  // Supports either:
  // export const supabaseAdmin = createClient(...)
  // OR
  // export async function supabaseAdmin() { return createClient(...) }
  const maybeFn: any = supabaseAdminExport as any;
  const client = typeof maybeFn === "function" ? await maybeFn() : maybeFn;

  if (!client?.storage?.from) {
    throw new Error(
      "supabaseAdmin is not a Supabase client. Expected .storage.from(...). Check src/lib/supabase-admin.ts export."
    );
  }

  return client as AdminClient;
}

function guessContentType(filename: string) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".txt")) return "text/plain; charset=utf-8";
  if (lower.endsWith(".csv")) return "text/csv; charset=utf-8";
  if (lower.endsWith(".json")) return "application/json; charset=utf-8";
  return "application/octet-stream";
}

function basename(p: string) {
  const clean = p.split("?")[0].replace(/^\/+/, "");
  const parts = clean.split("/").filter(Boolean);
  return parts[parts.length - 1] || "file";
}

function parseBucketAndObjectPath(pathParam: string, bucketParam?: string | null) {
  const raw = decodeURIComponent(pathParam).trim();

  // If they passed a full storage URL (signed or not), parse: /storage/v1/object/<bucket>/<path>
  const objectMarker = "/storage/v1/object/";
  if (raw.includes(objectMarker)) {
    const after = raw.split(objectMarker)[1] || "";
    const parts = after.split("/").filter(Boolean);
    const bucket = parts.shift() || "";
    const objectPath = parts.join("/");
    return { bucket, objectPath };
  }

  // If they passed "bucket:path"
  const colonIdx = raw.indexOf(":");
  if (colonIdx > 0) {
    const bucket = raw.slice(0, colonIdx);
    const objectPath = raw.slice(colonIdx + 1).replace(/^\/+/, "");
    return { bucket, objectPath };
  }

  // If they passed "bucket/..." directly
  const knownBuckets = ["clientenforce-uploads", "clientenforce-signatures"];
  for (const b of knownBuckets) {
    if (raw.startsWith(b + "/")) {
      return { bucket: b, objectPath: raw.slice(b.length + 1) };
    }
  }

  // Fallback: use explicit bucket param or default uploads
  return {
    bucket: bucketParam || "clientenforce-uploads",
    objectPath: raw.replace(/^\/+/, ""),
  };
}

export async function GET(req: Request) {
  try {
    const profile = await requireProfile();
    const role = await requireRole(["owner", "admin", "member"]);

    if (!roleHasPermission(role, "storage_download")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const orgId = (profile as any).org_id as string | undefined;
    if (!orgId) return NextResponse.json({ error: "No org_id on profile" }, { status: 401 });

    const url = new URL(req.url);
    const pathParam = url.searchParams.get("path");
    const bucketParam = url.searchParams.get("bucket");

    if (!pathParam) {
      return NextResponse.json({ error: "Missing ?path=" }, { status: 400 });
    }

    let { bucket, objectPath } = parseBucketAndObjectPath(pathParam, bucketParam);

    // Normalize org id:
    // In this app, org_id often looks like "org_<uuid>".
    // Some legacy signature paths are stored as "<uuid>/..." (without the "org_" prefix).
    const orgIdRaw = orgId.startsWith("org_") ? orgId.slice("org_".length) : orgId;

    // If bucket is not provided and the path looks like a legacy signatures prefix,
    // assume the signatures bucket.
    if (!bucketParam && objectPath.startsWith(`${orgIdRaw}/`)) {
      bucket = "clientenforce-signatures";
    }

    // basic org scoping:
    // - uploads bucket uses: org_<uuid>/...
    // - signatures bucket may use: org_<uuid>/... OR <uuid>/... (legacy)
    const expectedUploadsPrefix = `org_${orgIdRaw}/`;
    const expectedOrgPrefix = `org_${orgIdRaw}/`;
    const expectedLegacySigPrefix = `${orgIdRaw}/`;

    const allowed =
      // uploads-style paths
      objectPath.startsWith(expectedUploadsPrefix) ||
      // signatures bucket supports both styles
      (bucket === "clientenforce-signatures" &&
        (objectPath.startsWith(expectedOrgPrefix) || objectPath.startsWith(expectedLegacySigPrefix)));

    if (!allowed) {
      return NextResponse.json({ error: "Forbidden path", bucket, objectPath }, { status: 403 });
    }

    const admin = await getAdmin();
    const { data, error } = await admin.storage.from(bucket).download(objectPath);

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || "Failed to download", bucket, objectPath },
        { status: 500 }
      );
    }

    const filename = basename(objectPath);
    const contentType = guessContentType(filename);

    return new Response(data as any, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Preview failed" }, { status: 500 });
  }
}