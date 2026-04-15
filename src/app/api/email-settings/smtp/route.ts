import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { permissionDenied } from "@/lib/plan-enforcement";

const PASSWORD_MASK = "••••••••";

const PatchSchema = z.object({
  email_provider: z.enum(["clientenforce", "smtp"]),
  smtp_host: z.string().max(253).nullable().optional(),
  smtp_port: z.number().int().min(1).max(65535).nullable().optional(),
  smtp_secure: z.boolean().nullable().optional(),
  smtp_username: z.string().max(320).nullable().optional(),
  smtp_password: z.string().max(500).nullable().optional(),
  smtp_from_email: z.string().max(320).nullable().optional(),
  smtp_from_name: z.string().max(100).nullable().optional(),
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
    .select(
      "id, email_provider, smtp_host, smtp_port, smtp_secure, smtp_username, smtp_password, smtp_from_email, smtp_from_name"
    )
    .eq("id", profile.org_id)
    .single();

  if (error && isMissingColumnError(error)) {
    return json(200, {
      settings: {
        email_provider: "clientenforce",
        smtp_host: null, smtp_port: null, smtp_secure: null,
        smtp_username: null, smtp_password: "", smtp_from_email: null, smtp_from_name: null,
      },
    });
  }

  if (error) return json(400, { error: error.message });

  // Mask the raw password — never return it to the client
  return json(200, {
    settings: { ...org, smtp_password: org?.smtp_password ? PASSWORD_MASK : "" },
  });
}

export async function PATCH(req: Request) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return json(401, { error: "Unauthorized" });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "templates_write")) {
    return json(403, { error: permissionDenied("You do not have access to change email provider settings.") });
  }

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return json(400, { error: "Invalid payload", details: parsed.error.flatten() });
  }

  // Build update — skip smtp_password if blank, the mask placeholder, or absent
  const updatePayload: Record<string, any> = { ...parsed.data };
  if (
    !updatePayload.smtp_password ||
    updatePayload.smtp_password === PASSWORD_MASK ||
    updatePayload.smtp_password === undefined
  ) {
    delete updatePayload.smtp_password;
  }

  const { error } = await supabase
    .from("organizations")
    .update(updatePayload)
    .eq("id", profile.org_id);

  if (error && isMissingColumnError(error)) {
    return json(200, { ok: true, warning: "SMTP columns not yet migrated." });
  }

  if (error) return json(400, { error: error.message });
  return json(200, { ok: true });
}
