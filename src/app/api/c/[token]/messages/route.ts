import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendOrgEmail } from "@/lib/send-email";
import { renderClientEnforceEmail } from "@/lib/email-template";
import { loadWhiteLabelForOrg } from "@/lib/white-label";
import { appOrigin } from "@/lib/app-url";

export const runtime = "nodejs";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

const PostSchema = z.object({
  body: z.string().min(1).max(4000),
  sender_name: z.string().optional(),
  sender_email: z.string().email().optional(),
});

async function resolveOnboarding(token: string) {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("onboardings")
    .select("id, org_id, title, client_full_name, client_email, client_token")
    .eq("client_token", token)
    .maybeSingle();
  if (error || !data) return null;
  return data as {
    id: string;
    org_id: string;
    title: string | null;
    client_full_name: string | null;
    client_email: string | null;
    client_token: string;
  };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const ob = await resolveOnboarding(token);
  if (!ob) return json(404, { error: "Not found" });

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("onboarding_messages")
    .select("id, sender_type, sender_name, body, created_at")
    .eq("onboarding_id", ob.id)
    .order("created_at", { ascending: true });

  if (error) return json(400, { error: error.message });
  return json(200, { messages: data ?? [] });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const ob = await resolveOnboarding(token);
  if (!ob) return json(404, { error: "Not found" });

  const body = await req.json().catch(() => null);
  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) return json(400, { error: "Invalid message" });

  const senderName = parsed.data.sender_name || ob.client_full_name || "Client";
  const senderEmail = parsed.data.sender_email || ob.client_email || null;

  const admin = supabaseAdmin();
  const { data: msg, error: insertErr } = await admin
    .from("onboarding_messages")
    .insert({
      onboarding_id: ob.id,
      org_id: ob.org_id,
      sender_type: "client",
      sender_name: senderName,
      sender_email: senderEmail,
      body: parsed.data.body,
    })
    .select("id, sender_type, sender_name, body, created_at")
    .single();

  if (insertErr) return json(400, { error: insertErr.message });

  // Email org admins (non-blocking)
  const { data: admins } = await admin
    .from("memberships")
    .select("user_id")
    .eq("org_id", ob.org_id)
    .in("role", ["owner", "admin"]);

  if (admins && admins.length > 0) {
    const userIds = admins.map((m: any) => m.user_id);
    const { data: profiles } = await admin
      .from("profiles")
      .select("email, full_name")
      .in("user_id", userIds);

    const wl = await loadWhiteLabelForOrg(ob.org_id).catch(() => ({} as any));
    const dashboardUrl = `${appOrigin()}/dashboard/onboardings/${ob.id}`;

    for (const p of profiles ?? []) {
      if (!(p as any).email) continue;
      const { html, text: emailText } = renderClientEnforceEmail({
        branding: wl,
        title: `New message from ${senderName}`,
        intro: `Hi ${(p as any).full_name || "there"},`,
        paragraphs: [
          `${senderName} sent a message about "${ob.title || "an onboarding"}":`,
          `"${parsed.data.body}"`,
        ],
        primaryCta: { label: "Reply in dashboard", href: dashboardUrl },
      });

      sendOrgEmail(ob.org_id, {
        to: (p as any).email,
        subject: `Message from ${senderName} — ${ob.title || "Onboarding"}`,
        html,
        text: emailText,
      }).catch(() => {});
    }
  }

  return json(201, { message: msg });
}
