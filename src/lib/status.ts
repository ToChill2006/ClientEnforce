export type OnboardingStatus =
  | "draft"
  | "sent"
  | "in_progress"
  | "awaiting_review"
  | "approved"
  | "rejected"
  | "completed"
  | "submitted"
  | "locked"
  | "archived";

export type StatusTone = "neutral" | "info" | "accent" | "success" | "warning" | "danger";

export type StatusConfig = {
  label: string;
  tone: StatusTone;
  hint: string;
};

export const STATUS_CONFIG: Record<OnboardingStatus, StatusConfig> = {
  draft: {
    label: "Draft",
    tone: "neutral",
    hint: "Created — not yet sent to client.",
  },
  sent: {
    label: "Sent",
    tone: "neutral",
    hint: "Invite sent — client hasn't started yet.",
  },
  in_progress: {
    label: "In progress",
    tone: "accent",
    hint: "Client is actively filling out.",
  },
  awaiting_review: {
    label: "Awaiting review",
    tone: "warning",
    hint: "Client submitted — waiting for your review.",
  },
  approved: {
    label: "Approved",
    tone: "success",
    hint: "Phase approved — next phase unlocked.",
  },
  rejected: {
    label: "Rejected",
    tone: "danger",
    hint: "Sent back for revision.",
  },
  completed: {
    label: "Completed",
    tone: "success",
    hint: "All phases approved — onboarding complete.",
  },
  submitted: {
    label: "Awaiting review",
    tone: "warning",
    hint: "Client submitted — waiting for your review.",
  },
  locked: {
    label: "Locked",
    tone: "success",
    hint: "Submission locked — no further client edits.",
  },
  archived: {
    label: "Archived",
    tone: "neutral",
    hint: "Hidden from active list.",
  },
};

export function normalizeStatus(raw: unknown): OnboardingStatus {
  const v = String(raw ?? "").toLowerCase().replace(" ", "_");
  const valid: OnboardingStatus[] = ["draft", "sent", "in_progress", "awaiting_review", "approved", "rejected", "completed", "submitted", "locked", "archived"];
  if (valid.includes(v as OnboardingStatus)) return v as OnboardingStatus;
  if (v === "complete") return "completed";
  return "draft";
}

/**
 * Compute the display status the same way the events page does —
 * phase status takes precedence over raw onboarding status.
 */
export function computeDisplayStatus(
  onboardingStatus: string | null | undefined,
  phases: Array<{ status: string; phase_number: number }> | null | undefined
): OnboardingStatus {
  const ob = String(onboardingStatus ?? "").toLowerCase();

  if (ob === "sent") return "sent";
  if (ob === "completed") return "completed";

  if (phases && phases.length > 0) {
    // Find the most relevant active phase (same logic as events API)
    const active =
      phases.find((p) => p.status === "in_progress" || p.status === "rejected") ??
      phases.find((p) => p.status === "awaiting_review") ??
      phases.find((p) => p.status === "approved");

    if (active) return normalizeStatus(active.status);
  }

  return normalizeStatus(ob);
}

export const STATUS_ORDER: OnboardingStatus[] = [
  "draft",
  "sent",
  "in_progress",
  "awaiting_review",
  "approved",
  "rejected",
  "completed",
  "locked",
  "archived",
];
