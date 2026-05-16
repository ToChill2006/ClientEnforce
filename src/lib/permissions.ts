export type Role = "owner" | "admin" | "member" | "onboarder" | "reviewer" | "external_viewer";

// ─── Role display names (for UI) ────────────────────────────────────────────
// owner     → shown as "Admin" (owner is an internal distinction for billing)
// admin     → "Admin"
// member    → treated as "Onboarder" (legacy, kept for backward compat)
// onboarder → "Onboarder"
// reviewer  → "Reviewer"
// external_viewer → "Guest Viewer"

export const ROLE_LABELS: Record<Role, string> = {
  owner:           "Admin",
  admin:           "Admin",
  member:          "Onboarder",     // legacy alias — maps to Onboarder permissions
  onboarder:       "Onboarder",
  reviewer:        "Reviewer",
  external_viewer: "Guest Viewer",
};

// Roles that appear in the invite / role-change picker (owner is not assignable)
export const ASSIGNABLE_ROLES = ["admin", "onboarder", "reviewer", "external_viewer"] as const;
export type AssignableRole = typeof ASSIGNABLE_ROLES[number];

export const Permissions = {
  // ── Dashboard ──────────────────────────────────────────────────────────────
  dashboard_read: ["owner", "admin", "member", "onboarder", "reviewer", "external_viewer"],

  // ── Clients ────────────────────────────────────────────────────────────────
  clients_read:   ["owner", "admin", "member", "onboarder", "reviewer"],
  clients_write:  ["owner", "admin", "member", "onboarder"],
  clients_delete: ["owner", "admin"],

  // ── Templates ─────────────────────────────────────────────────────────────
  templates_read:   ["owner", "admin", "member", "onboarder", "reviewer"],
  templates_write:  ["owner", "admin", "member", "onboarder"],
  templates_delete: ["owner", "admin"],

  // ── Onboardings ───────────────────────────────────────────────────────────
  onboardings_read:   ["owner", "admin", "member", "onboarder", "reviewer"],
  onboardings_write:  ["owner", "admin", "member", "onboarder"],
  onboardings_send:   ["owner", "admin", "member", "onboarder"],
  onboardings_lock:   ["owner", "admin", "reviewer"],
  onboardings_delete: ["owner", "admin"],
  onboardings_review: ["owner", "admin", "reviewer"],

  // ── Events (Enterprise) ───────────────────────────────────────────────────
  events_view:        ["owner", "admin", "member", "onboarder", "reviewer"],
  events_view_scoped: ["external_viewer"],
  events_write:       ["owner", "admin", "member", "onboarder"],
  client_types_write: ["owner", "admin"],

  // ── Follow-ups ────────────────────────────────────────────────────────────
  followups_read:  ["owner", "admin", "member", "onboarder"],
  followups_write: ["owner", "admin"],
  followups_run:   ["owner", "admin"],

  // ── Team ──────────────────────────────────────────────────────────────────
  team_read:         ["owner", "admin", "member", "onboarder", "reviewer"],
  team_invite:       ["owner", "admin"],
  team_manage_roles: ["owner"],

  // ── Settings ──────────────────────────────────────────────────────────────
  settings_read:  ["owner", "admin", "member", "onboarder"],
  settings_write: ["owner", "admin"],

  // ── Billing ───────────────────────────────────────────────────────────────
  billing_read:  ["owner"],
  billing_write: ["owner"],

  // ── Audit & Exports ───────────────────────────────────────────────────────
  audit_read:   ["owner", "admin"],
  exports_read: ["owner", "admin", "member", "onboarder", "reviewer"],

  // ── Storage ───────────────────────────────────────────────────────────────
  storage_list:     ["owner", "admin", "member", "onboarder", "reviewer"],
  storage_download: ["owner", "admin", "member", "onboarder", "reviewer"],
  storage_delete:   ["owner", "admin"],

  // ── Team tasks (internal) ─────────────────────────────────────────────────
  team_tasks_view:       ["owner", "admin", "member", "onboarder"],
  team_tasks_create:     ["owner", "admin"],
  team_tasks_update_any: ["owner", "admin"],
  team_tasks_update_own: ["owner", "admin", "member", "onboarder"],
  team_tasks_delete:     ["owner", "admin"],

  // ── Email & Reminder settings ─────────────────────────────────────────────
  email_settings_write:   ["owner", "admin"],
  reminder_rules_write:   ["owner", "admin"],
} as const;

const LegacyPermissionAlias = {
  dashboard_view:          "dashboard_read",
  clients_view:            "clients_read",
  templates_view:          "templates_read",
  onboardings_view:        "onboardings_read",
  followups_view:          "followups_read",
  followups_settings_write:"followups_write",
  audit_view:              "audit_read",
  team_members_view:       "team_read",
  invites_create:          "team_invite",
  roles_manage:            "team_manage_roles",
  billing_manage:          "billing_write",
} as const;

export type PermissionKey = keyof typeof Permissions | keyof typeof LegacyPermissionAlias;

function resolvePermission(permission: PermissionKey): keyof typeof Permissions {
  const mapped = (LegacyPermissionAlias as Partial<Record<PermissionKey, keyof typeof Permissions>>)[permission];
  if (mapped) return mapped;
  return permission as keyof typeof Permissions;
}

export function roleHasPermission(role: Role, permission: PermissionKey): boolean {
  const key = resolvePermission(permission);
  const allowed = Permissions[key] as readonly Role[];
  return allowed.includes(role);
}

export function assertPermission(role: Role, permission: PermissionKey) {
  if (!roleHasPermission(role, permission)) {
    throw new Error("Forbidden");
  }
}
