import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { permissionDenied } from "@/lib/plan-enforcement";

const CreateTask = z.object({
  assigned_to: z.string().uuid(),
  title: z.string().min(1).max(140),
  description: z.string().max(2000).optional().nullable(),
  due_at: z.string().datetime().optional().nullable(),
});

const UpdateTask = z.object({
  id: z.string().uuid(),
  status: z.enum(["open", "in_progress", "done", "archived"]).optional(),
  title: z.string().min(1).max(140).optional(),
  description: z.string().max(2000).optional().nullable(),
  due_at: z.string().datetime().optional().nullable(),
});

export async function GET(req: Request) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "team_tasks_view")) {
    return NextResponse.json({ error: permissionDenied("You do not have access to view team tasks.") }, { status: 403 });
  }
  const url = new URL(req.url);
  const status = (url.searchParams.get("status") || "").trim();

  let q = supabase
    .from("team_tasks")
    .select("id, org_id, created_by, assigned_to, title, description, status, due_at, created_at, updated_at")
    .eq("org_id", profile.org_id)
    .order("updated_at", { ascending: false });

  if (status) q = q.eq("status", status);

  const { data: tasks, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ tasks: tasks ?? [] });
}

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "team_tasks_create")) {
    return NextResponse.json({ error: permissionDenied("You do not have access to assign team tasks.") }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const parsed = CreateTask.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });

  const { assigned_to, title, description, due_at } = parsed.data;

  const { data: inserted, error } = await supabase
    .from("team_tasks")
    .insert({
      org_id: profile.org_id,
      created_by: data.user.id,
      assigned_to,
      title,
      description: description ?? null,
      due_at: due_at ?? null,
      status: "open",
    })
    .select("id, org_id, created_by, assigned_to, title, description, status, due_at, created_at, updated_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true, id: inserted.id, item: inserted });
}

export async function PATCH(req: Request) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "team_tasks_update_any") && !roleHasPermission(role, "team_tasks_update_own")) {
    return NextResponse.json({ error: permissionDenied("You do not have access to update this task.") }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const parsed = UpdateTask.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });

  const { id, ...patch } = parsed.data;

  const { data: updated, error } = await supabase
    .from("team_tasks")
    .update(patch)
    .eq("org_id", profile.org_id)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!updated) return NextResponse.json({ error: "Task not found or not permitted" }, { status: 404 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "team_tasks_delete")) {
    return NextResponse.json({ error: permissionDenied("You do not have access to delete team tasks.") }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const id = String(json?.id ?? "").trim();
  const uuidOk = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  if (!uuidOk) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const { data: deleted, error } = await supabase
    .from("team_tasks")
    .delete()
    .eq("org_id", profile.org_id)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!deleted) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
