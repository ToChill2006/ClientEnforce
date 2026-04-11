import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { permissionDenied } from "@/lib/plan-enforcement";
import { sendOrgEmail } from "@/lib/send-email";
import { renderClientEnforceEmail } from "@/lib/email-template";

export const runtime = "nodejs";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

export async function POST() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return json(401, { error: "Unauthorized" });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "templates_write")) {
    return json(403, { error: permissionDenied("You do not have access to test email settings.") });
  }

  const toEmail = (profile as any).email ?? userData.user.email;
  if (!toEmail) {
    return json(400, { error: "No email address found on your profile." });
  }

  const emailTemplate = renderClientEnforceEmail({
    preheader: "Your email provider is working correctly.",
    eyebrow: "Email settings",
    title: "Test email",
    subtitle: "Email provider test",
    paragraphs: [
      "If you received this email, your email provider is configured correctly.",
      "You can dismiss this message.",
    ],
    footerNote: "This is a test email from ClientEnforce.",
  });

  try {
    await sendOrgEmail(profile.org_id, {
      to: toEmail,
      subject: "Test email from ClientEnforce",
      html: emailTemplate.html,
      text: emailTemplate.text,
    });
  } catch (e: any) {
    return json(400, { error: e?.message ?? "Failed to send test email" });
  }

  return json(200, { ok: true, to: toEmail });
}
