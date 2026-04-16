export type PlanTier = "free" | "pro" | "business" | "agency";

export type PlanEntitlements = {
  maxUsers: number;
  maxAdmins: number;
  maxTemplates: number;
  maxActiveOnboardings: number;
  auditEnabled: boolean;
  remindersEnabled: boolean;
  exportEvidenceEnabled: boolean;
  teamRolesEnabled: boolean;
  advancedReportingEnabled: boolean;
  advancedReportingLevel: "none" | "limited" | "full";
  prioritySupport: boolean;
  whiteLabelEnabled: boolean;
  customDomainEnabled: boolean;
  dedicatedSupport: boolean;
};

export const PLAN_ENTITLEMENTS: Record<PlanTier, PlanEntitlements> = {
  free: {
    maxUsers: 1,
    maxAdmins: 1,
    maxTemplates: 1,
    maxActiveOnboardings: 5,
    auditEnabled: false,
    remindersEnabled: false,
    exportEvidenceEnabled: false,
    teamRolesEnabled: false,
    advancedReportingEnabled: false,
    advancedReportingLevel: "none",
    prioritySupport: false,
    whiteLabelEnabled: false,
    customDomainEnabled: false,
    dedicatedSupport: false,
  },
  pro: {
    maxUsers: 5,
    maxAdmins: 5,
    maxTemplates: 10,
    maxActiveOnboardings: 50,
    auditEnabled: true,
    remindersEnabled: true,
    exportEvidenceEnabled: true,
    teamRolesEnabled: true,
    advancedReportingEnabled: true,
    advancedReportingLevel: "limited",
    prioritySupport: true,
    whiteLabelEnabled: false,
    customDomainEnabled: false,
    dedicatedSupport: false,
  },
  business: {
    maxUsers: 15,
    maxAdmins: 15,
    maxTemplates: Infinity,
    maxActiveOnboardings: 200,
    auditEnabled: true,
    remindersEnabled: true,
    exportEvidenceEnabled: true,
    teamRolesEnabled: true,
    advancedReportingEnabled: true,
    advancedReportingLevel: "full",
    prioritySupport: true,
    whiteLabelEnabled: false,
    customDomainEnabled: false,
    dedicatedSupport: false,
  },
  agency: {
    maxUsers: 25,
    maxAdmins: 25,
    maxTemplates: Infinity,
    maxActiveOnboardings: Infinity,
    auditEnabled: true,
    remindersEnabled: true,
    exportEvidenceEnabled: true,
    teamRolesEnabled: true,
    advancedReportingEnabled: true,
    advancedReportingLevel: "full",
    prioritySupport: true,
    whiteLabelEnabled: true,
    customDomainEnabled: true,
    dedicatedSupport: true,
  },
};

export function normalizePlanTier(t?: string | null): PlanTier {
  const v = (t ?? "free").toLowerCase().trim();
  if (v === "pro" || v === "business" || v === "free" || v === "agency") return v;
  if (v === "starter") return "free";
  return "free";
}

export function getPlanEntitlements(tier?: string | null) {
  return PLAN_ENTITLEMENTS[normalizePlanTier(tier)];
}
