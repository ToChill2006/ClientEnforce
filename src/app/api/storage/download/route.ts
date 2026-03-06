import { NextResponse } from "next/server";
import { requireProfile } from "@/lib/rbac";

export const runtime = "nodejs";

function basename(p: string) {
  const clean = p.split("?")[0].replace(/^\/+/, "");
  const parts = clean.split("/").filter(Boolean);
  return parts[parts.length - 1] || "file";
}

function parseBucketAndObjectPath(pathParam: string, bucketParam?: string | null) {
  const raw = decodeURIComponent(pathParam).trim();

  // Full URL support: http(s)://.../storage/v1/object/<bucket>/<objectPath>
  const objectMarker = "/storage/v1/object/";
  if (raw.includes(objectMarker)) {
    const after = raw.split(objectMarker)[1] || "";
    const parts = after.split("/").filter(Boolean);
    const bucket = parts.shift() || "";
    const objectPath = parts.join("/");
    return { bucket, objectPath };
  }

  // bucket:objectPath support
  const colonIdx = raw.indexOf(":");
  if (colonIdx > 0) {
    const bucket = raw.slice(0, colonIdx);
    const objectPath = raw.slice(colonIdx + 1).replace(/^\/+/, "");
    return { bucket, objectPath };
  }

  // bucket/objectPath support (known buckets)
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

export async function GET(req: Request) {
  try {
    const profile = await requireProfile();
    const orgId = (profile as any).org_id as string | undefined;
    if (!orgId) return NextResponse.json({ error: "No org_id on profile" }, { status: 401 });

    const url = new URL(req.url);
    const pathParam = url.searchParams.get("path");
    const bucketParam = url.searchParams.get("bucket");

    if (!pathParam) {
      return NextResponse.json({ error: "Missing ?path=" }, { status: 400 });
    }

    const { bucket, objectPath } = parseBucketAndObjectPath(pathParam, bucketParam);

    // If the caller didn't specify a bucket and the path looks like legacy signatures
    // (<orgId>/...), default to the signatures bucket.
    let resolvedBucket = bucket;
    if (!bucketParam && resolvedBucket === "clientenforce-uploads" && objectPath.startsWith(`${orgId}/`)) {
      resolvedBucket = "clientenforce-signatures";
    }

    // Org scoping:
    // - uploads bucket: org_<orgId>/...
    // - signatures bucket: legacy <orgId>/... OR newer org_<orgId>/...
    const expectedOrgPrefix = `org_${orgId}/`;
    const expectedLegacySigPrefix = `${orgId}/`;

    const allowed =
      objectPath.startsWith(expectedOrgPrefix) ||
      (resolvedBucket === "clientenforce-signatures" &&
        (objectPath.startsWith(expectedLegacySigPrefix) || objectPath.startsWith(expectedOrgPrefix)));

    if (!allowed) {
      return NextResponse.json({ error: "Forbidden path", bucket: resolvedBucket, objectPath }, { status: 403 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Missing Supabase env vars", hasUrl: !!supabaseUrl, hasServiceKey: !!serviceKey },
        { status: 500 }
      );
    }

    // Use REST object endpoint directly (more reliable than supabase-js in app routes)
    const filename = basename(objectPath);
    const objectUrl = `${supabaseUrl.replace(/\/+$/, "")}/storage/v1/object/${encodeURIComponent(
      resolvedBucket
    )}/${objectPath}`;

    // Supabase supports `?download` to force attachment. Using `download=<filename>` helps naming.
    const res = await fetch(`${objectUrl}?download=${encodeURIComponent(filename)}`, {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        {
          error: "Failed to download",
          status: res.status,
          bucket: resolvedBucket,
          objectPath,
          body: text.slice(0, 500),
        },
        { status: 500 }
      );
    }

    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const buf = await res.arrayBuffer();

    return new Response(buf, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename=\"${filename}\"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Download failed" }, { status: 500 });
  }
}