import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireRole } from "@/lib/rbac";

export async function GET() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();

  // Only members can view members list; admins will use it for assignment.
  const { data: memberships, error: memErr } = await supabase
    .from("memberships")
    .select("user_id, role, created_at")
    .eq("org_id", profile.org_id)
    .order("created_at", { ascending: true });

  if (memErr) return NextResponse.json({ error: memErr.message }, { status: 400 });

  const userIds = Array.from(new Set((memberships ?? []).map((m: any) => m.user_id).filter(Boolean)));

  let profilesByUserId = new Map<string, { email: string | null; full_name: string | null }>();

  if (userIds.length > 0) {
    // Pull profiles separately (avoids needing a FK relationship for PostgREST embedding)
    const { data: profs, error: profErr } = await supabase
      .from("profiles")
      .select("user_id, email, full_name")
      .eq("org_id", profile.org_id)
      .in("user_id", userIds);

    if (profErr) return NextResponse.json({ error: profErr.message }, { status: 400 });

    for (const p of profs ?? []) {
      profilesByUserId.set(String((p as any).user_id), {
        email: (p as any).email ?? null,
        full_name: (p as any).full_name ?? null,
      });
    }
  }

  const items = (memberships ?? []).map((m: any) => {
    const p = profilesByUserId.get(String(m.user_id));
    return {
      user_id: m.user_id,
      role: m.role,
      email: p?.email ?? null,
      full_name: p?.full_name ?? null,
    };
  });

  return NextResponse.json({ members: items });
}