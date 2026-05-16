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
    .select("id, org_id, title, client_token, client_id")
    .eq("client_token", token)
    .maybeSingle();
  if (error || !data) return null;
  return data as {
    id: string;
    org_id: string;
    title: string | null;
    client_token: string;
    client_id: string | null;
  };
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const markRead = new URL(req.url).searchParams.get("mark_read") === "1";
  const ob = await resolveOnboarding(token);
  if (!ob) return json(404, { error: "Not found" });

  const admin = supabaseAdmin();
  const [{ data, error }, { data: reads }] = await Promise.all([
    admin
      .from("onboarding_messages")
      .select("id, sender_type, sender_name, body, created_at")
      .eq("onboarding_id", ob.id)
      .order("created_at", { ascending: true }),
    admin
      .from("onboarding_chat_reads")
      .select("side, last_read_at")
      .eq("onboarding_id", ob.id),
  ]);

  if (error) return json(400, { error: error.message });

  const myLastReadAt = (reads as any[])?.find((r) => r.side === "client")?.last_read_at ?? null;
  const theirLastReadAt = (reads as any[])?.find((r) => r.side === "admin")?.last_read_at ?? null;

  if (markRead) {
    await admin.from("onboarding_chat_reads").upsert(
      { onboarding_id: ob.id, side: "client", last_read_at: new Date().toISOString() },
      { onConflict: "onboarding_id,side" }
    );
  }

  return json(200, { messages: data ?? [], my_last_read_at: myLastReadAt, their_last_read_at: theirLastReadAt });
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

  // Look up client name/email from clients table if needed
  let clientName = "Client";
  let clientEmail: string | null = null;
  if (ob.client_id) {
    const adminLookup = supabaseAdmin();
    const { data: client } = await adminLookup
      .from("clients")
      .select("full_name, email")
      .eq("id", ob.client_id)
      .maybeSingle();
    if (client) {
      clientName = (client as any).full_name || "Client";
      clientEmail = (client as any).email || null;
    }
  }
  const senderName = parsed.data.sender_name || clientName;
  const senderEmail = parsed.data.sender_email || clientEmail || null;

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
