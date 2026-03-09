import { getPlanEntitlements, normalizePlanTier, type PlanTier } from "@/lib/billing-plans";

export type OrgTier = PlanTier;

export function normalizeTier(raw: unknown): OrgTier {
  return normalizePlanTier(typeof raw === "string" ? raw : String(raw ?? "free"));
}

export async function selectOrganizationTier(
  client: any,
  orgId: string
): Promise<{ tier: OrgTier; data: any | null; error: any | null }> {
  const primary = await client
    .from("organizations")
    .select("tier, plan_tier")
    .eq("id", orgId)
    .single();

  if (!(primary as any)?.error) {
    const data = (primary as any).data ?? null;
    return { tier: normalizeTier(data?.tier ?? data?.plan_tier), data, error: null };
  }

  const error = (primary as any).error;
  const msg = String(error?.message || "").toLowerCase();

  if (msg.includes("plan_tier") && (msg.includes("does not exist") || msg.includes("schema cache") || msg.includes("could not find"))) {
    const fallback = await client
      .from("organizations")
      .select("tier")
      .eq("id", orgId)
      .single();

    if (!(fallback as any)?.error) {
      const data = (fallback as any).data ?? null;
      return { tier: normalizeTier(data?.tier), data, error: null };
    }

    return { tier: "free", data: null, error: (fallback as any).error ?? error };
  }

  if (msg.includes("tier") && (msg.includes("does not exist") || msg.includes("schema cache") || msg.includes("could not find"))) {
    const fallback = await client
      .from("organizations")
      .select("plan_tier")
      .eq("id", orgId)
      .single();

    if (!(fallback as any)?.error) {
      const data = (fallback as any).data ?? null;
      return { tier: normalizeTier(data?.plan_tier), data, error: null };
    }

    return { tier: "free", data: null, error: (fallback as any).error ?? error };
  }

  return { tier: "free", data: null, error };
}

export function maxAdminsForTier(tier: OrgTier) {
  return getPlanEntitlements(tier).maxAdmins;
}

export function maxTemplatesForTier(tier: OrgTier) {
  return getPlanEntitlements(tier).maxTemplates;
}

export function maxActiveOnboardingsForTier(tier: OrgTier) {
  return getPlanEntitlements(tier).maxActiveOnboardings;
}

export function followupsEnabledForTier(tier: OrgTier) {
  return getPlanEntitlements(tier).remindersEnabled;
}

export function auditEnabledForTier(tier: OrgTier) {
  return getPlanEntitlements(tier).auditEnabled;
}

export function exportsEnabledForTier(tier: OrgTier) {
  return getPlanEntitlements(tier).exportEvidenceEnabled;
}

export function teamInvitesEnabledForTier(tier: OrgTier) {
  return tier !== "free";
}

export function billingPortalEnabledForTier(tier: OrgTier) {
  return tier !== "free";
}

export function permissionDenied(action: string) {
  return `Permission required: ${action}`;
}

export function templateLimitMessage(tier: OrgTier, limit: number) {
  if (tier === "free") {
    return "Plan upgrade required: Your current plan allows 1 template. Upgrade to Pro to create more templates.";
  }
  if (tier === "pro") {
    return `Plan upgrade required: Your current plan allows up to ${limit} templates. Upgrade to Business for unlimited templates.`;
  }
  return `Plan upgrade required: Your current plan allows up to ${limit} templates.`;
}

export function onboardingLimitMessage(tier: OrgTier, limit: number) {
  if (tier === "free") {
    return "Plan upgrade required: Your current plan allows up to 5 active onboardings. Upgrade to Pro to create more.";
  }
  if (tier === "pro") {
    return "Plan upgrade required: Your current plan allows up to 50 active onboardings. Upgrade to Business to create more.";
  }
  return `Plan upgrade required: Your current plan allows up to ${limit} active onboardings.`;
}

export function followupsUnavailableMessage(action: "view" | "update" | "run" | "configure" = "view") {
  if (action === "configure") {
    return "Plan upgrade required: Follow-up automation is not included in your current plan. Upgrade to Pro to change automated reminder settings.";
  }
  if (action === "update") {
    return "Plan upgrade required: Follow-up automation is not included in your current plan. Upgrade to Pro to update reminder jobs.";
  }
  if (action === "run") {
    return "Plan upgrade required: Follow-up automation is not included in your current plan. Upgrade to Pro to run reminders.";
  }
  return "Plan upgrade required: Follow-up automation is not included in your current plan. Upgrade to Pro to view reminders.";
}

export function auditUnavailableMessage() {
  return "Plan upgrade required: Audit log is not included in your current plan. Upgrade to Pro to access audit history.";
}

export function exportUnavailableMessage() {
  return "Plan upgrade required: Evidence exports are not included in your current plan. Upgrade to Pro to export onboarding evidence packs.";
}

export function teamInviteUnavailableMessage() {
  return "Plan upgrade required: Team invites are not included in the Free plan. Upgrade to Pro to add team members.";
}

export function adminLimitMessage(tier: OrgTier, maxAdmins: number) {
  if (tier === "free") {
    return "Plan upgrade required: Your current plan allows 1 admin user. Upgrade to Pro to add more admins.";
  }
  if (tier === "pro") {
    return "Plan upgrade required: Your current plan allows up to 5 admin users. Upgrade to Business to add more admins.";
  }
  return `Plan upgrade required: Your current plan allows up to ${maxAdmins} admin users.`;
}

export function billingPortalUnavailableMessage() {
  return "Plan upgrade required: Billing portal management is only available on Pro and Business plans.";
}
