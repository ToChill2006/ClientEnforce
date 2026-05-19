import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requireRole, HttpError } from "@/lib/rbac";
import { currentOrgHasFeature } from "@/lib/feature-flags";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

const VALID_PRIORITIES = new Set(["normal", "high", "urgent"]);
const VALID_TYPES = new Set(["note", "alert", "decision", "file"]);

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const profile = await requireProfile();
    await requireRole(["owner", "admin", "member", "onboarder", "reviewer"]);
    const orgId = profile.org_id;
    if (!orgId) return err(400, "No organization");

    const admin = supabaseAdmin();
    // Pinned first, then newest
    const { data, error } = await admin
      .from("event_board_posts")
      .select("*")
      .eq("event_id", eventId)
      .eq("org_id", orgId)
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) return err(500, error.message);
    return NextResponse.json({ posts: data ?? [] });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message ?? "Failed");
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const profile = await requireProfile();
    await requireRole(["owner", "admin", "member", "onboarder", "reviewer"]);
    const orgId = profile.org_id;
    if (!orgId) return err(400, "No organization");

    const body = await req.json().catch(() => ({}));
    const postBody: string | null = body.body?.trim() || null;
    const filePath: string | null = body.file_path?.trim() || null;
    const fileName: string | null = body.file_name?.trim() || null;
    const priority: string = VALID_PRIORITIES.has(body.priority) ? body.priority : "normal";
    const postType: string = VALID_TYPES.has(body.post_type) ? body.post_type : "note";

    if (!postBody && !filePath) return err(400, "body or file_path required");

    const authorName = profile.full_name || profile.email || null;

    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from("event_board_posts")
      .insert({
        event_id: eventId,
        org_id: orgId,
        author_id: profile.user_id,
        author_name: authorName,
        body: postBody,
        file_path: filePath,
        file_name: fileName,
        priority,
        post_type: postType,
        pinned: false,
      })
      .select()
      .single();

    if (error) return err(500, error.message);
    return NextResponse.json({ post: data }, { status: 201 });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message ?? "Failed");
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const profile = await requireProfile();
    const role = await requireRole(["owner", "admin", "member", "onboarder", "reviewer"]);
    const orgId = profile.org_id;
    if (!orgId) return err(400, "No organization");

    const url = new URL(req.url);
    const postId = url.searchParams.get("post_id");
    if (!postId) return err(400, "post_id required");

    const body = await req.json().catch(() => ({}));
    const updates: Record<string, unknown> = {};
    if (typeof body.pinned === "boolean") updates.pinned = body.pinned;
    if (VALID_PRIORITIES.has(body.priority)) updates.priority = body.priority;
    if (Object.keys(updates).length === 0) return err(400, "No valid fields to update");

    // Only owners/admins can pin; others can only update their own posts
    const isPrivileged = role === "owner" || role === "admin";
    const admin = supabaseAdmin();
    let q = admin
      .from("event_board_posts")
      .update(updates)
      .eq("id", postId)
      .eq("event_id", eventId)
      .eq("org_id", orgId);

    if (!isPrivileged) (q as any).eq("author_id", profile.user_id);

    const { data, error } = await (q as any).select().single();
    if (error) return err(500, error.message);
    return NextResponse.json({ post: data });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message ?? "Failed");
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const profile = await requireProfile();
    const role = await requireRole(["owner", "admin", "member", "onboarder", "reviewer"]);
    const orgId = profile.org_id;
    if (!orgId) return err(400, "No organization");

    const url = new URL(req.url);
    const postId = url.searchParams.get("post_id");
    if (!postId) return err(400, "post_id required");

    const admin = supabaseAdmin();
    const isPrivileged = role === "owner" || role === "admin";
    const q = admin
      .from("event_board_posts")
      .delete()
      .eq("id", postId)
      .eq("event_id", eventId)
      .eq("org_id", orgId);

    if (!isPrivileged) (q as any).eq("author_id", profile.user_id);

    const { error } = await q;
    if (error) return err(500, error.message);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message ?? "Failed");
  }
}
