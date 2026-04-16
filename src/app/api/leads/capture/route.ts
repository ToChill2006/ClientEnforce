import { NextResponse } from "next/server";
import { z } from "zod";
import { resend } from "@/lib/resend";
import { renderClientEnforceEmail } from "@/lib/email-template";
import { canonicalSiteOrigin } from "@/lib/app-url";

const NOTIFY_TO = process.env.LEAD_NOTIFY_EMAIL ?? "info@clientenforce.com";
const FROM = "ClientEnforce <info@clientenforce.com>";

const schema = z.object({
  firstName: z.string().max(100).optional().default(""),
  email: z.string().email().max(320),
  companyType: z.string().max(100).optional().default(""),
  asset: z.string().min(1).max(200),
  /** Optional — which vertical page triggered the capture */
  vertical: z.string().max(100).optional().default(""),
});

/** Asset slug → human label + view URL */
const assetMeta: Record<string, { label: string; viewPath: string }> = {
  "client-onboarding-checklist": {
    label: "Free Client Onboarding Checklist Template",
    viewPath: "/downloads/client-onboarding-checklist/view",
  },
  "fleet-account-onboarding-checklist": {
    label: "The Multi-Location Fleet Account Onboarding Checklist",
    viewPath: "/downloads/fleet-account-onboarding-checklist/view",
  },
  "agency-onboarding-checklist": {
    label: "The Agency Client Onboarding Checklist",
    viewPath: "/resources/agency-onboarding-checklist",
  },
  "consultant-intake-checklist": {
    label: "The Consultant Client Intake Checklist",
    viewPath: "/resources/consultant-intake-checklist",
  },
};

function getAssetMeta(asset: string) {
  return assetMeta[asset] ?? { label: asset, viewPath: "/" };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data", issues: parsed.error.issues }, { status: 422 });
  }

  const { firstName, email, companyType, asset, vertical } = parsed.data;
  const { label: assetLabel, viewPath } = getAssetMeta(asset);
  const viewUrl = `${canonicalSiteOrigin()}${viewPath}`;

  try {
    // ── 1. Notify info@clientenforce.com ──────────────────────────────────
    const notifyTemplate = renderClientEnforceEmail({
      preheader: `New lead: ${firstName} — ${assetLabel}`,
      eyebrow: "New lead capture",
      title: `New download lead: ${firstName}`,
      paragraphs: [
        `<strong>Name:</strong> ${firstName}`,
        `<strong>Email:</strong> ${email}`,
        `<strong>Company type:</strong> ${companyType || "—"}`,
        `<strong>Asset downloaded:</strong> ${assetLabel}`,
        `<strong>Vertical:</strong> ${vertical || "—"}`,
      ],
      primaryCta: {
        label: "Open Apollo to enrich",
        href: "https://app.apollo.io/#/people",
      },
      footerNote: "Sent automatically by ClientEnforce lead capture.",
    });

    await resend.emails.send({
      from: FROM,
      to: [NOTIFY_TO],
      replyTo: email,
      subject: `New lead: ${firstName} — ${assetLabel}`,
      html: notifyTemplate.html,
      text: notifyTemplate.text,
    });

    // ── 2. Confirmation email to lead ─────────────────────────────────────
    const confirmTemplate = renderClientEnforceEmail({
      preheader: `Your ${assetLabel} is ready`,
      eyebrow: "Free resource",
      title: firstName ? `Here's your checklist, ${firstName}` : "Your checklist is ready",
      subtitle: assetLabel,
      paragraphs: [
        "Click the button below to view and print your checklist. It opens in your browser — use Cmd/Ctrl + P to save as PDF.",
        "If you want to see how top service businesses enforce this checklist automatically (without the manual follow-up), take a look at ClientEnforce.",
      ],
      primaryCta: { label: "View your checklist →", href: viewUrl },
      secondaryCta: { label: "See how ClientEnforce automates this", href: `${canonicalSiteOrigin()}/client-onboarding-software` },
      footerNote: "You're receiving this because you requested a free resource from ClientEnforce. No spam — ever.",
    });

    await resend.emails.send({
      from: FROM,
      to: [email],
      subject: `Your ${assetLabel} — ClientEnforce`,
      html: confirmTemplate.html,
      text: confirmTemplate.text,
    });
  } catch (err) {
    console.error("[leads/capture] email send failed:", err);
    // Still return success — form UX shouldn't fail just because email errors
    return NextResponse.json({ ok: true, emailError: true });
  }

  return NextResponse.json({ ok: true, viewUrl });
}
