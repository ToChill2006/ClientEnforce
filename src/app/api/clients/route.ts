import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";

function isMissingColumnError(err: any, column: string) {
  const msg = String(err?.message || err || "").toLowerCase();
  return (
    (msg.includes("does not exist") || msg.includes("schema cache") || msg.includes("could not find")) &&
    msg.includes(column.toLowerCase())
  );
}

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
  const q = (url.searchParams.get("q") || "").trim().toLowerCase().slice(0, 200);

  const buildQuery = (sel: string) => {
    let query = supabase
      .from("clients")
      .select(sel)
      .eq("org_id", profile.org_id)
      .order("updated_at", { ascending: false })
      .limit(50);
    if (q) query = query.or(`email.ilike.%${q}%,full_name.ilike.%${q}%`);
    return query;
  };

  let result = await buildQuery("id, email, full_name, company_name, created_at, updated_at");
  if (result.error && isMissingColumnError(result.error, "company_name")) {
    result = await buildQuery("id, email, full_name, created_at, updated_at") as any;
  }

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 });

  const normalized = ((result.data as any[]) ?? []).map((c: any) => ({
    ...c,
    company_name: c.company_name ?? null,
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
  const company_name = String(body?.company_name ?? "").trim() || null;

  if (!full_name) {
    return NextResponse.json({ error: "Client name is required" }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "Client email is required" }, { status: 400 });
  }

  const insertPayload: Record<string, any> = { org_id: profile.org_id, full_name, email };
  if (company_name) insertPayload.company_name = company_name;

  // Try with company_name first; fall back without it if column doesn't exist
  let result = await supabase
    .from("clients")
    .insert(insertPayload)
    .select("id, email, full_name, company_name, created_at, updated_at")
    .single();

  if ((result as any).error && isMissingColumnError((result as any).error, "company_name")) {
    const { company_name: _dropped, ...payloadWithout } = insertPayload;
    result = await supabase
      .from("clients")
      .insert(payloadWithout)
      .select("id, email, full_name, created_at, updated_at")
      .single() as any;
  }

  if ((result as any).error) {
    return NextResponse.json({ error: (result as any).error.message || "Failed to create client" }, { status: 400 });
  }

  const created = (result as any).data;
  logAudit({
    org_id: profile.org_id,
    actor_user_id: profile.user_id,
    actor_email: profile.email,
    actor_role: role,
    action: "client.created",
    entity_type: "client",
    entity_id: created.id,
    metadata: { email: created.email, full_name: created.full_name, company_name: created.company_name ?? null },
  });
  return NextResponse.json(
    { item: { ...created, company_name: created.company_name ?? null, name: created.full_name ?? null } },
    { status: 201 }
  );
}

export async function PUT(req: Request) {
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

  const id = String(body?.id ?? "").trim();
  const full_name = String(body?.full_name ?? body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const company_name = body?.company_name !== undefined ? (String(body.company_name).trim() || null) : undefined;

  const uuidOk = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  if (!uuidOk) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  if (!full_name) {
    return NextResponse.json({ error: "Client name is required" }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "Client email is required" }, { status: 400 });
  }

  const updatePayload: Record<string, any> = { full_name, email, updated_at: new Date().toISOString() };
  if (company_name !== undefined) updatePayload.company_name = company_name;

  // Try with company_name first; fall back without it if column doesn't exist
  let result = await supabase
    .from("clients")
    .update(updatePayload)
    .eq("org_id", profile.org_id)
    .eq("id", id)
    .select("id, email, full_name, company_name, created_at, updated_at")
    .single();

  if ((result as any).error && isMissingColumnError((result as any).error, "company_name")) {
    const { company_name: _dropped, ...payloadWithout } = updatePayload;
    result = await supabase
      .from("clients")
      .update(payloadWithout)
      .eq("org_id", profile.org_id)
      .eq("id", id)
      .select("id, email, full_name, created_at, updated_at")
      .single() as any;
  }

  if ((result as any).error) {
    return NextResponse.json({ error: (result as any).error.message || "Failed to update client" }, { status: 400 });
  }

  const updated = (result as any).data;
  logAudit({
    org_id: profile.org_id,
    actor_user_id: profile.user_id,
    actor_email: profile.email,
    actor_role: role,
    action: "client.updated",
    entity_type: "client",
    entity_id: id,
    metadata: { email: updated.email, full_name: updated.full_name },
  });
  return NextResponse.json({
    item: { ...updated, company_name: updated.company_name ?? null, name: updated.full_name ?? null },
  });
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

  logAudit({
    org_id: profile.org_id,
    actor_user_id: profile.user_id,
    actor_email: profile.email,
    actor_role: role,
    action: "client.deleted",
    entity_type: "client",
    entity_id: id,
  });
  return NextResponse.json({ ok: true });
}
