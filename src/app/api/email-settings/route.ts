import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { permissionDenied } from "@/lib/plan-enforcement";

const PatchSchema = z.object({
  email_subject_template: z.string().max(200).nullable().optional(),
  email_heading: z.string().max(200).nullable().optional(),
  email_body: z.string().max(2000).nullable().optional(),
  email_cta_label: z.string().max(100).nullable().optional(),
});

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

function isMissingColumnError(err: any) {
  const msg = String(err?.message || err || "");
  return (
    msg.includes("schema cache") ||
    msg.includes("does not exist") ||
    msg.includes("Could not find")
  );
}

export async function GET() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return json(401, { error: "Unauthorized" });

  const profile = await requireProfile();

  const { data: org, error } = await supabase
    .from("organizations")
    .select("id, email_subject_template, email_heading, email_body, email_cta_label")
    .eq("id", profile.org_id)
    .single();

  // If columns don't exist yet, return defaults
  if (error && isMissingColumnError(error)) {
    return json(200, { settings: { email_subject_template: null, email_heading: null, email_body: null, email_cta_label: null } });
  }

  if (error) return json(400, { error: error.message });
  return json(200, { settings: org });
}

export async function PATCH(req: Request) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return json(401, { error: "Unauthorized" });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "templates_write")) {
    return json(403, { error: permissionDenied("You do not have access to change email settings.") });
  }

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return json(400, { error: "Invalid payload", details: parsed.error.flatten() });
  }

  const { error } = await supabase
    .from("organizations")
    .update(parsed.data)
    .eq("id", profile.org_id);

  if (error && isMissingColumnError(error)) {
    // Columns don't exist yet — silently succeed so the UI doesn't break.
    return json(200, { ok: true, warning: "Email template columns not yet migrated." });
  }

  if (error) return json(400, { error: error.message });
  return json(200, { ok: true });
}
