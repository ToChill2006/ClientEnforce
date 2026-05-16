export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendOrgEmail } from "@/lib/send-email";
import { renderClientEnforceEmail } from "@/lib/email-template";
import { loadWhiteLabelForOrg } from "@/lib/white-label";
import { appOrigin } from "@/lib/app-url";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

const PostSchema = z.object({
  body: z.string().min(1).max(4000),
});

async function resolveOnboarding(onboardingId: string, userId: string) {
  const admin = supabaseAdmin();
  const { data: ob } = await admin
    .from("onboardings")
    .select("id, org_id, title, client_full_name, client_email, client_token")
    .eq("id", onboardingId)
    .maybeSingle();
  if (!ob) return null;

  // Verify the user is a member of this org
  const { data: membership } = await admin
    .from("memberships")
    .select("role")
    .eq("org_id", (ob as any).org_id)
    .eq("user_id", userId)
    .maybeSingle();

  if (!membership) return null;
  return ob as {
    id: string;
    org_id: string;
    title: string | null;
    client_full_name: string | null;
    client_email: string | null;
    client_token: string | null;
  };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json(401, { error: "Unauthorized" });

  const ob = await resolveOnboarding(id, user.id);
  if (!ob) return json(404, { error: "Not found" });

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("onboarding_messages")
    .select("id, sender_type, sender_name, sender_email, body, created_at")
    .eq("onboarding_id", id)
    .order("created_at", { ascending: true });

  if (error) return json(400, { error: error.message });
  return json(200, { messages: data ?? [] });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return json(401, { error: "Unauthorized" });

  const ob = await resolveOnboarding(id, user.id);
  if (!ob) return json(404, { error: "Not found" });

  const body = await req.json().catch(() => null);
  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) return json(400, { error: "Invalid message" });

  // Get sender's display name
  const admin = supabaseAdmin();
  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, email")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: msg, error: insertErr } = await admin
    .from("onboarding_messages")
    .insert({
      onboarding_id: id,
      org_id: ob.org_id,
      sender_type: "admin",
      sender_name: (profile as any)?.full_name || user.email || "Team",
      sender_email: user.email,
      body: parsed.data.body,
    })
    .select("id, sender_type, sender_name, sender_email, body, created_at")
    .single();

  if (insertErr) return json(400, { error: insertErr.message });

  // Email the client (non-blocking)
  const clientEmail = ob.client_email;
  const clientName = ob.client_full_name || "there";
  const clientToken = ob.client_token;

  if (clientEmail) {
    const wl = await loadWhiteLabelForOrg(ob.org_id).catch(() => ({} as any));
    const brand = wl.brand_name || "ClientEnforce";
    const senderName = (profile as any)?.full_name || brand;
    const portalUrl = clientToken ? `${appOrigin()}/c/${clientToken}` : null;

    const { html, text: emailText } = renderClientEnforceEmail({
      branding: wl,
      title: `New message from ${senderName}`,
      intro: `Hi ${clientName},`,
      paragraphs: [
        `${senderName} sent you a message about your onboarding:`,
        `"${parsed.data.body}"`,
      ],
      primaryCta: portalUrl ? { label: "View & reply", href: portalUrl } : null,
      footerNote: `Reply by visiting your onboarding portal.`,
    });

    sendOrgEmail(ob.org_id, {
      to: clientEmail,
      subject: `New message from ${senderName} — ${ob.title || "Your onboarding"}`,
      html,
      text: emailText,
    }).catch(() => {});
  }

  return json(201, { message: msg });
}
