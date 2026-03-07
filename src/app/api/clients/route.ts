import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";

export async function GET(req: Request) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "clients_view")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();

  let query = supabase
    .from("clients")
    .select("id, email, full_name, created_at, updated_at")
    .eq("org_id", profile.org_id)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (q) {
    query = query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`);
  }

  const { data: items, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Normalize shape for frontend (always expose `name`)
  const normalized = (items ?? []).map((c: any) => ({
    ...c,
    name: c.full_name ?? null,
  }));

  return NextResponse.json({ items: normalized });
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "clients_write")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const full_name = String(body?.full_name ?? body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();

  if (!full_name) {
    return NextResponse.json({ error: "Client name is required" }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "Client email is required" }, { status: 400 });
  }

  const { data: created, error } = await supabase
    .from("clients")
    .insert({
      org_id: profile.org_id,
      full_name,
      email,
    })
    .select("id, email, full_name, created_at, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message || "Failed to create client" }, { status: 400 });
  }

  return NextResponse.json(
    {
      item: {
        ...created,
        name: created.full_name ?? null,
      },
    },
    { status: 201 }
  );
}

export async function DELETE(req: Request) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "clients_delete")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const id = String(body?.id ?? "").trim();
  // basic UUID v4-ish check (good enough to avoid accidental broad deletes)
  const uuidOk = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  if (!uuidOk) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  // Delete scoped to org to prevent cross-tenant deletes.
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("org_id", profile.org_id)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}