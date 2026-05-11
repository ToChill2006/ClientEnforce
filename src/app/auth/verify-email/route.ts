import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (!token_hash || type !== "magiclink") {
    return NextResponse.redirect(new URL("/dashboard?verified=error", request.url));
  }

  const supabase = await supabaseServer();
  const { error } = await supabase.auth.verifyOtp({ token_hash, type: "magiclink" });

  if (error) {
    return NextResponse.redirect(new URL("/dashboard?verified=error", request.url));
  }

  // Mark the profile as verified
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    const admin = supabaseAdmin();
    await admin
      .from("profiles")
      .update({ email_verified: true, updated_at: new Date().toISOString() })
      .eq("user_id", data.user.id);
  }

  return NextResponse.redirect(new URL("/dashboard?verified=1", request.url));
}
