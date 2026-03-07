import { NextResponse } from "next/server";
import { HttpError, requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { supabaseAdmin } from "@/lib/supabase-admin";

type StorageItem = {
  id: string;
  onboarding_id?: string | null;
  onboarding_title?: string | null;
  type: "file" | "signature";
  bucket: string;
  path: string;
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
  size?: number | null;
  mimetype?: string | null;
};

const UPLOAD_BUCKET = "clientenforce-uploads";
const SIGNATURE_BUCKET = "clientenforce-signatures";

async function listOrgObjects(bucket: string, orgPrefix: string, orgId: string): Promise<StorageItem[]> {
  const admin = supabaseAdmin();
  const storage = admin.storage.from(bucket);

  const items: StorageItem[] = [];

  // Helper to normalize an object into our output shape
  const pushObj = (obj: any, fullPath: string) => {
    const meta = obj?.metadata ?? {};
    const match = fullPath.match(/onboarding_([^/]+)/);
    let onboardingId: string | null = match ? match[1] : null;

    // For signatures, the folder structure is often:
    //   org_<orgId>/<onboardingId>/<file>
    // or legacy:
    //   <orgId>/<onboardingId>/<file>
    // so if we didn't match onboarding_*, infer from the 2nd path segment.
    if (!onboardingId) {
      const parts = fullPath.split("/").filter(Boolean);
      const first = parts[0] || "";
      const second = parts[1] || "";

      const isOrgPrefix = first === `org_${orgId}` || first === orgId;
      // very loose UUID-ish check
      const looksUuid = (s: string) => s.length >= 32 && s.includes("-");

      if (isOrgPrefix && looksUuid(second)) {
        onboardingId = second;
      } else {
        // last resort: some very old signatures were stored as <orgId>/<onboardingId>.png
        const maybeFile = parts[parts.length - 1] || "";
        const base = maybeFile.split(".")[0];
        if (first === orgId && looksUuid(base)) {
          onboardingId = base;
        }
      }
    }

    items.push({
      id: `${bucket}:${fullPath}`,
      onboarding_id: onboardingId,
      onboarding_title: null,
      type: bucket === SIGNATURE_BUCKET ? "signature" : "file",
      bucket,
      path: fullPath,
      name: obj?.name ?? fullPath.split("/").pop() ?? fullPath,
      created_at: (obj?.created_at as string) ?? null,
      updated_at: (obj?.updated_at as string) ?? null,
      size: (meta?.size as number) ?? (obj?.metadata?.size as number) ?? null,
      mimetype: (meta?.mimetype as string) ?? (meta?.contentType as string) ?? null,
    });
  };

  const looksLikeFile = (entry: any) => {
    // Supabase Storage list() returns folders as items with only a name.
    // Files generally have metadata (and often id/updated_at).
    return !!entry?.metadata && Object.keys(entry.metadata).length > 0;
  };

  // Recursive listing because your structure can be:
  // org_<orgId>/onboarding_<id>/<date>/<filename>
  // or deeper.
  const listRecursive = async (prefix: string, depth: number) => {
    // prevent accidental infinite recursion
    if (depth > 4) return;

    const { data, error } = await storage.list(prefix, {
      limit: 200,
      sortBy: { column: "updated_at", order: "desc" },
    });

    if (error) {
      // skip this branch rather than failing the whole request
      return;
    }

    for (const entry of data ?? []) {
      const entryName = entry?.name;
      if (!entryName) continue;

      if (looksLikeFile(entry)) {
        pushObj(entry, `${prefix}/${entryName}`);
      } else {
        // folder
        await listRecursive(`${prefix}/${entryName}`, depth + 1);
      }
    }
  };

  // Start at org root prefix
  await listRecursive(orgPrefix, 0);

  // newest first
  items.sort((a, b) => (b.updated_at ?? b.created_at ?? "").localeCompare(a.updated_at ?? a.created_at ?? ""));

  return items;
}

export async function GET(_req: Request) {
  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "storage_list")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const orgId = profile.org_id;
  if (!orgId) return NextResponse.json({ error: "No organization" }, { status: 400 });

  // Uploads are stored under: org_<orgId>/onboarding_<id>/...
  const uploadsPrefix = `org_${orgId}`;

  // Signatures (older + current) have been stored under different prefixes over time.
  // We support both:
  // - org_<orgId>/... (newer)
  // - <orgId>/...     (older)
  const signaturesPrefixes = [`org_${orgId}`, `${orgId}`];

  try {
    const uploadsPromise = listOrgObjects(UPLOAD_BUCKET, uploadsPrefix, orgId);

    const signaturesPromise = Promise.all(
      signaturesPrefixes.map((p) => listOrgObjects(SIGNATURE_BUCKET, p, orgId))
    ).then((lists) => lists.flat());

    const [uploads, signatures] = await Promise.all([uploadsPromise, signaturesPromise]);

    // De-dupe by id (bucket:path)
    const byId = new Map<string, StorageItem>();
    for (const it of [...uploads, ...signatures]) {
      byId.set(it.id, it);
    }

    const items = Array.from(byId.values())
      .sort((a, b) => (b.updated_at ?? b.created_at ?? "").localeCompare(a.updated_at ?? a.created_at ?? ""))
      .slice(0, 500);

    // Attach onboarding titles (so UI can display title under the name)
    const admin = supabaseAdmin();
    const ids = Array.from(new Set(items.map((i) => i.onboarding_id).filter(Boolean))) as string[];

    if (ids.length) {
      const { data: onboardings } = await admin
        .from("onboardings")
        .select("id,title")
        .eq("org_id", orgId)
        .in("id", ids);

      const titleById = new Map<string, string>();
      for (const o of onboardings ?? []) {
        if (o?.id) titleById.set(o.id, o.title ?? "");
      }

      for (const it of items) {
        if (it.onboarding_id) {
          it.onboarding_title = titleById.get(it.onboarding_id) ?? null;
        }
      }
    }

    return NextResponse.json({ items });
  } catch (e: any) {
    if (e instanceof HttpError) {
      return NextResponse.json(
        { error: e.message },
        { status: e.status }
      );
    }

    const status = typeof e?.status === "number" ? e.status : 500;
    return NextResponse.json(
      { error: e?.message ?? "Failed to list storage" },
      { status }
    );
  }
}