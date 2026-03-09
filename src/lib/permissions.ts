export type Role = "owner" | "admin" | "member";

export const Permissions = {
  // Recommended canonical keys
  dashboard_read: ["owner", "admin", "member"],
  clients_read: ["owner", "admin", "member"],
  clients_write: ["owner", "admin", "member"],
  clients_delete: ["owner", "admin"],

  templates_read: ["owner", "admin", "member"],
  templates_write: ["owner", "admin"],
  templates_delete: ["owner", "admin"],

  onboardings_read: ["owner", "admin", "member"],
  onboardings_write: ["owner", "admin", "member"],
  onboardings_send: ["owner", "admin", "member"],
  onboardings_lock: ["owner", "admin"],
  onboardings_delete: ["owner", "admin"],

  followups_read: ["owner", "admin", "member"],
  followups_write: ["owner", "admin"],
  followups_run: ["owner", "admin"],

  team_read: ["owner", "admin", "member"],
  team_invite: ["owner", "admin"],
  team_manage_roles: ["owner"],

  settings_read: ["owner", "admin", "member"],
  settings_write: ["owner", "admin"],

  billing_read: ["owner"],
  billing_write: ["owner"],

  audit_read: ["owner", "admin"],
  exports_read: ["owner", "admin"],

  // Existing app capabilities still used by current routes/components
  storage_list: ["owner", "admin", "member"],
  storage_download: ["owner", "admin", "member"],

  team_tasks_view: ["owner", "admin", "member"],
  team_tasks_create: ["owner", "admin"],
  team_tasks_update_any: ["owner", "admin"],
  team_tasks_update_own: ["owner", "admin", "member"],
  team_tasks_delete: ["owner", "admin"],
} as const;

const LegacyPermissionAlias = {
  dashboard_view: "dashboard_read",
  clients_view: "clients_read",
  templates_view: "templates_read",
  onboardings_view: "onboardings_read",
  followups_view: "followups_read",
  followups_settings_write: "followups_write",
  audit_view: "audit_read",
  team_members_view: "team_read",
  invites_create: "team_invite",
  roles_manage: "team_manage_roles",
  billing_manage: "billing_write",
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
