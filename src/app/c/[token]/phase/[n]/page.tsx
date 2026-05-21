import * as React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { orgHasFeatureAdmin } from "@/lib/feature-flags";
import { loadWhiteLabelForOrg } from "@/lib/white-label";
import PhasePortalClient from "./PhasePortalClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string; n: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const admin = supabaseAdmin();
  const { data: onboarding } = await admin
    .from("onboardings")
    .select("org_id")
    .eq("client_token", token)
    .maybeSingle();
  if (!onboarding?.org_id) return {};
  const wl = await loadWhiteLabelForOrg(String(onboarding.org_id)).catch(() => null);
  const logoUrl = wl?.logo_url?.trim() || null;
  const brandName = wl?.brand_name?.trim() || undefined;
  return {
    title: brandName,
    icons: logoUrl ? [{ rel: "icon", url: logoUrl }, { rel: "apple-touch-icon", url: logoUrl }] : undefined,
  };
}

export default async function PhasePortalPage({
  params,
}: {
  params: Promise<{ token: string; n: string }>;
}) {
  const { token, n } = await params;
  const phaseNumber = parseInt(n, 10);
  if (isNaN(phaseNumber) || phaseNumber < 1) return notFound();

  const admin = supabaseAdmin();

  // Load onboarding by token
  const { data: onboarding, error: obErr } = await admin
    .from("onboardings")
    .select("id, title, status, org_id, client_id, client_token, event_id, client_type_id, events(id, name, submission_deadline, exhibitor_guide), clients(id, full_name, email, company_name)")
    .eq("client_token", token)
    .maybeSingle();

  if (obErr || !onboarding) return notFound();

  const orgId = (onboarding as any).org_id as string;

  // Verify enterprise flag
  const hasFlag = await orgHasFeatureAdmin(orgId, "enterprise_onboarding").catch(() => false);
  if (!hasFlag) return notFound();

  // Load all phases
  const { data: phases } = await admin
    .from("onboarding_phases")
    .select("*")
    .eq("onboarding_id", (onboarding as any).id)
    .order("phase_number", { ascending: true });

  if (!phases || phases.length === 0) return notFound();

  const currentPhase = (phases as any[]).find((p) => p.phase_number === phaseNumber);
  if (!currentPhase) return notFound();

  // Load requirements for this phase — try with all columns first, fall back to core columns
  let requirements: any[] | null = null;
  {
    const { data, error } = await admin
      .from("onboarding_requirements")
      .select("id, type, label, is_required, sort_order, value_text, file_path, file_paths, signature_path, options, phase_number, review_status, reviewer_comment, metadata, payment_amount, payment_currency, payment_description, payment_status, payment_paid_at, payment_stripe_payment_intent_id")
      .eq("onboarding_id", (onboarding as any).id)
      .order("sort_order", { ascending: true });
    if (!error) {
      requirements = data;
    } else {
      // Fallback: drop columns that may not exist in the schema
      const { data: fallback } = await admin
        .from("onboarding_requirements")
        .select("id, type, label, is_required, sort_order, value_text, file_path, signature_path, options, phase_number, review_status, reviewer_comment, metadata")
        .eq("onboarding_id", (onboarding as any).id)
        .order("sort_order", { ascending: true });
      requirements = fallback;
    }
  }

  const phaseReqs = ((requirements ?? []) as any[]).filter(
    (r) => r.phase_number === phaseNumber || (r.phase_number == null && phaseNumber === 1)
  );

  // White label
  const whiteLabel = await loadWhiteLabelForOrg(orgId).catch(() => null);

  const clientName = (onboarding as any).clients?.full_name ?? "Exhibitor";
  const eventName = (onboarding as any).events?.name ?? null;
  const eventDeadline = (onboarding as any).events?.submission_deadline ?? null;
  const companyName = (onboarding as any).clients?.company_name ?? null;
  const eventId = (onboarding as any).event_id ?? null;
  const exhibitorGuide = (onboarding as any).events?.exhibitor_guide ?? null;
  const hasGuide = exhibitorGuide && Array.isArray(exhibitorGuide.sections) && exhibitorGuide.sections.length > 0;

  return (
    <PhasePortalClient
      token={token}
      onboardingId={(onboarding as any).id}
      clientName={clientName}
      companyName={companyName}
      eventName={eventName}
      eventDeadline={eventDeadline}
      phases={phases as any[]}
      currentPhase={currentPhase}
      requirements={phaseReqs}
      whiteLabel={whiteLabel}
      guideUrl={hasGuide && eventId ? `/guide/${eventId}` : null}
      guideTitle={hasGuide ? (exhibitorGuide.title ?? "Exhibitor Guide") : null}
    />
  );
}
