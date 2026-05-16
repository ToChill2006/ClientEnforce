import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole, requireProfile } from "@/lib/rbac";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

const SetScopesSchema = z.object({
  user_id: z.string().uuid(),
  event_ids: z.array(z.string().uuid()),
});

// GET /api/team/external-viewer-scopes?user_id=xxx
export async function GET(req: Request) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return err(401, "Unauthorized");

    const profile = await requireProfile();
    const role = await requireRole(["owner", "admin", "member", "onboarder", "reviewer", "external_viewer"]);
    if (role !== "owner" && role !== "admin") {
      return err(403, "Forbidden");
    }

    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    if (!user_id) return err(400, "user_id is required");

    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from("external_viewer_scopes")
      .select("event_id")
      .eq("user_id", user_id)
      .eq("org_id", profile.org_id);

    if (error) return err(400, error.message);

    const event_ids = (data ?? []).map((r: any) => r.event_id as string);
    return NextResponse.json({ event_ids });
  } catch (e: any) {
    return err(500, e?.message || "Internal error");
  }
}

// POST /api/team/external-viewer-scopes
export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return err(401, "Unauthorized");

    const profile = await requireProfile();
    const role = await requireRole(["owner", "admin"]);
    if (role !== "owner" && role !== "admin") {
      return err(403, "Forbidden");
    }

    const body = await req.json().catch(() => null);
    const parsed = SetScopesSchema.safeParse(body);
    if (!parsed.success) return err(422, "Invalid payload");

    const { user_id, event_ids } = parsed.data;

    const admin = supabaseAdmin();

    // Delete existing scopes for this user+org
    const { error: delError } = await admin
      .from("external_viewer_scopes")
      .delete()
      .eq("user_id", user_id)
      .eq("org_id", profile.org_id);

    if (delError) return err(400, delError.message);

    // Insert new scopes if any
    if (event_ids.length > 0) {
      const inserts = event_ids.map((event_id) => ({
        user_id,
        org_id: profile.org_id,
        event_id,
        created_by: userData.user!.id,
      }));

      const { error: insError } = await admin
        .from("external_viewer_scopes")
        .insert(inserts);

      if (insError) return err(400, insError.message);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return err(500, e?.message || "Internal error");
  }
}
