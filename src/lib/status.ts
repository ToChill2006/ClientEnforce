export type OnboardingStatus =
  | "draft"
  | "sent"
  | "in_progress"
  | "submitted"
  | "locked"
  | "archived";

export type StatusTone = "neutral" | "info" | "accent" | "success" | "warning" | "danger";

export type StatusConfig = {
  label: string;
  tone: StatusTone;
  /** Short description used in tooltips or empty-state copy. */
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
    tone: "info",
    hint: "Link shared with client.",
  },
  in_progress: {
    label: "In progress",
    tone: "accent",
    hint: "Client has started completing the onboarding.",
  },
  submitted: {
    label: "Submitted",
    tone: "success",
    hint: "Client submitted all required fields.",
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
  const v = String(raw ?? "").toLowerCase();
  if (v === "draft" || v === "sent" || v === "in_progress" || v === "submitted" || v === "locked" || v === "archived") return v;
  if (v === "complete" || v === "completed") return "submitted";
  return "draft";
}

export const STATUS_ORDER: OnboardingStatus[] = [
  "draft",
  "sent",
  "in_progress",
  "submitted",
  "locked",
  "archived",
];
