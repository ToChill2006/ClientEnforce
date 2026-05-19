import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requireRole, HttpError } from "@/lib/rbac";

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

export async function GET(_req: Request) {
  try {
    const profile = await requireProfile();
    await requireRole(["owner", "admin", "member", "onboarder", "reviewer"]);
    const orgId = profile.org_id;
    if (!orgId) return err(400, "No organization");

    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from("team_messages")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: true })
      .limit(200);

    if (error) return err(500, error.message);
    return NextResponse.json({ messages: data ?? [] });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message ?? "Failed");
  }
}

export async function POST(req: Request) {
  try {
    const profile = await requireProfile();
    await requireRole(["owner", "admin", "member", "onboarder", "reviewer"]);
    const orgId = profile.org_id;
    if (!orgId) return err(400, "No organization");

    const body = await req.json().catch(() => ({}));
    const text: string = (body.body ?? "").trim();
    if (!text) return err(400, "body required");

    const senderName = profile.full_name || profile.email || "Team member";

    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from("team_messages")
      .insert({
        org_id: orgId,
        user_id: profile.user_id,
        sender_name: senderName,
        body: text,
      })
      .select()
      .single();

    if (error) return err(500, error.message);
    return NextResponse.json({ message: data }, { status: 201 });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message ?? "Failed");
  }
}
