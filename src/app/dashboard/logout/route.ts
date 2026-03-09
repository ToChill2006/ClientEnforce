import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { appOrigin } from "@/lib/app-url";

export async function POST() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", appOrigin()), {
    status: 303,
  });
}
