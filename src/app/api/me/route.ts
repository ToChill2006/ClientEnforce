import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await supabaseServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profileRows } = await supabase
    .from("profiles")
    .select("full_name,email")
    .eq("user_id", user.id)
    .limit(1);

  const profile = Array.isArray(profileRows) && profileRows.length > 0 ? profileRows[0] : null;

  const fullName =
    profile?.full_name?.trim() ||
    (typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "") ||
    (typeof user.user_metadata?.name === "string" ? user.user_metadata.name.trim() : "") ||
    null;

  const email =
    profile?.email?.trim() ||
    user.email ||
    null;

  return NextResponse.json({
    user: {
      id: user.id,
      full_name: fullName,
      email,
    },
  });
}