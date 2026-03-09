import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { permissionDenied } from "@/lib/plan-enforcement";

function jsonError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

function isMissingColumnError(err: unknown, column: string) {
  const msg = String((err as { message?: string } | undefined)?.message || err || "");
  const lower = msg.toLowerCase();
  const col = column.toLowerCase();
  return (
    (lower.includes("does not exist") && lower.includes(col)) ||
    (lower.includes("schema cache") && lower.includes(col)) ||
    lower.includes(`could not find the '${col}' column`)
  );
}

async function getOrgIdForUser(supabase: Awaited<ReturnType<typeof supabaseServer>>) {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return { user: null, org_id: null as string | null };

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("user_id", user.id)
    .single();

  if (error || !profile?.org_id) return { user, org_id: null as string | null };
  return { user, org_id: profile.org_id as string };
}

const PatchSchema = z.object({
  status: z.enum(["archived"]),
});

type ResponseError = { message?: string | null };
type PatchItem = { id: string; status?: string | null; updated_at?: string | null };
type MaybeSingleResult<T> = { data: T | null; error: ResponseError | null };

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await supabaseServer();
  const { user, org_id } = await getOrgIdForUser(supabase);
  if (!user) return jsonError(401, "Unauthorized");
  if (!org_id) return jsonError(403, "No organization");

  const role = await requireRole(["owner", "admin", "member"]);
  if (!roleHasPermission(role, "onboardings_delete")) {
    return jsonError(403, permissionDenied("You do not have access to archive onboardings."));
  }

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return jsonError(400, "Invalid payload");

  const now = new Date().toISOString();
  let update = (await supabase
    .from("onboardings")
    .update({ status: parsed.data.status, updated_at: now })
    .eq("org_id", org_id)
    .eq("id", id)
    .select("id, status, updated_at")
    .maybeSingle()) as MaybeSingleResult<PatchItem>;

  if (update.error && isMissingColumnError(update.error, "updated_at")) {
    update = (await supabase
      .from("onboardings")
      .update({ status: parsed.data.status })
      .eq("org_id", org_id)
      .eq("id", id)
      .select("id, status")
      .maybeSingle()) as MaybeSingleResult<PatchItem>;
  }

  const item = update.data ?? null;
  const error = update.error ?? null;
  if (error) return jsonError(400, error.message || "Failed to archive onboarding");
  if (!item) return jsonError(404, "Onboarding not found");

  return NextResponse.json({ ok: true, item });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await supabaseServer();
  const { user, org_id } = await getOrgIdForUser(supabase);
  if (!user) return jsonError(401, "Unauthorized");
  if (!org_id) return jsonError(403, "No organization");

  const role = await requireRole(["owner", "admin", "member"]);
  if (!roleHasPermission(role, "onboardings_delete")) {
    return jsonError(403, permissionDenied("You do not have access to delete onboardings."));
  }

  const deleted = (await supabase
    .from("onboardings")
    .delete()
    .eq("org_id", org_id)
    .eq("id", id)
    .select("id")
    .maybeSingle()) as MaybeSingleResult<{ id: string }>;

  const item = deleted.data ?? null;
  const error = deleted.error ?? null;
  if (error) return jsonError(400, error.message || "Failed to delete onboarding");
  if (!item) return jsonError(404, "Onboarding not found");

  return NextResponse.json({ ok: true });
}
