import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/rbac";

export const runtime = "nodejs";

export async function POST() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET is not set" }, { status: 500 });

  const base = process.env.NEXT_PUBLIC_APP_URL!;
  const res = await fetch(`${base}/api/cron/followups/run`, {
    method: "POST",
    headers: { authorization: `Bearer ${secret}` },
  });

  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}