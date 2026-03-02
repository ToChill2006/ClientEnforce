import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireAdmin } from "@/lib/rbac";

export async function GET() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const profile = await requireProfile();

  const { data: items, error } = await supabase
    .from("followup_jobs")
    .select("id, onboarding_id, to_email, subject, due_at, status, last_error, created_at, updated_at, sent_at")
    .eq("org_id", profile.org_id)
    .order("due_at", { ascending: true })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ items });
}