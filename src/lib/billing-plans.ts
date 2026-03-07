export type PlanTier = "free" | "pro" | "business";

export type PlanEntitlements = {
  maxAdmins: number;
  maxTemplates: number;
  maxActiveOnboardings: number;
  auditEnabled: boolean;
  remindersEnabled: boolean;
  exportEvidenceEnabled: boolean;
  teamRolesEnabled: boolean;
  advancedReportingEnabled: boolean;
  prioritySupport: boolean;
};

export const PLAN_ENTITLEMENTS: Record<PlanTier, PlanEntitlements> = {
  free: {
    maxAdmins: 1,
    maxTemplates: 1,
    maxActiveOnboardings: 5,
    auditEnabled: false,
    remindersEnabled: false,
    exportEvidenceEnabled: false,
    teamRolesEnabled: false,
    advancedReportingEnabled: false,
    prioritySupport: false,
  },
  pro: {
    maxAdmins: 5,
    maxTemplates: 10,
    maxActiveOnboardings: 50,
    auditEnabled: true,
    remindersEnabled: true,
    exportEvidenceEnabled: true,
    teamRolesEnabled: true,
    advancedReportingEnabled: false,
    prioritySupport: false,
  },
  business: {
    maxAdmins: 15,
    maxTemplates: Infinity,
    maxActiveOnboardings: 200,
    auditEnabled: true,
    remindersEnabled: true,
    exportEvidenceEnabled: true,
    teamRolesEnabled: true,
    advancedReportingEnabled: true,
    prioritySupport: true,
  },
};

export function normalizePlanTier(t?: string | null): PlanTier {
  const v = (t ?? "free").toLowerCase().trim();
  if (v === "pro" || v === "business" || v === "free") return v;
  if (v === "starter") return "free";
  return "free";
}

export function getPlanEntitlements(tier?: string | null) {
  return PLAN_ENTITLEMENTS[normalizePlanTier(tier)];
}