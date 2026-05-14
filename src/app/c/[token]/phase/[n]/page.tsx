import * as React from "react";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { orgHasFeature } from "@/lib/feature-flags";
import { loadWhiteLabelForOrg } from "@/lib/white-label";
import PhasePortalClient from "./PhasePortalClient";

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
    .select("id, title, status, org_id, client_id, client_token, event_id, client_type_id, events(id, name), clients(id, full_name, email)")
    .eq("client_token", token)
    .maybeSingle();

  if (obErr || !onboarding) return notFound();

  const orgId = (onboarding as any).org_id as string;

  // Verify enterprise flag
  const hasFlag = await orgHasFeature(orgId, "enterprise_onboarding").catch(() => false);
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
      .select("id, type, label, is_required, sort_order, value_text, value_json, file_path, signature_path, options, phase_number, review_status, reviewer_comment, metadata")
      .eq("onboarding_id", (onboarding as any).id)
      .order("sort_order", { ascending: true });
    if (!error) {
      requirements = data;
    } else {
      // Fallback: drop columns that may not exist in the schema
      const { data: fallback } = await admin
        .from("onboarding_requirements")
        .select("id, type, label, is_required, sort_order, value_text, file_path, signature_path, options, phase_number, review_status, reviewer_comment")
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

  return (
    <PhasePortalClient
      token={token}
      onboardingId={(onboarding as any).id}
      clientName={clientName}
      eventName={eventName}
      phases={phases as any[]}
      currentPhase={currentPhase}
      requirements={phaseReqs}
      whiteLabel={whiteLabel}
    />
  );
}
