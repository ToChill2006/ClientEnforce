export type Role = "owner" | "admin" | "member";

export const Permissions = {
  dashboard_view: ["owner", "admin", "member"],
  clients_view: ["owner", "admin", "member"],
  clients_write: ["owner", "admin", "member"],
  clients_delete: ["owner", "admin"],

  templates_view: ["owner", "admin", "member"],
  templates_write: ["owner", "admin"],
  templates_delete: ["owner", "admin"],

  onboardings_view: ["owner", "admin", "member"],
  onboardings_write: ["owner", "admin", "member"],
  onboardings_delete: ["owner", "admin"],

  followups_view: ["owner", "admin", "member"],
  followups_settings_write: ["owner", "admin"],
  followups_run: ["owner", "admin"],

  audit_view: ["owner", "admin"],

  storage_list: ["owner", "admin", "member"],
  storage_download: ["owner", "admin", "member"],

  team_members_view: ["owner", "admin", "member"],

  team_tasks_view: ["owner", "admin", "member"],
  team_tasks_create: ["owner", "admin"],
  team_tasks_update_any: ["owner", "admin"],
  team_tasks_update_own: ["owner", "admin", "member"],
  team_tasks_delete: ["owner", "admin"],

  invites_create: ["owner", "admin"],
  roles_manage: ["owner", "admin"],
  billing_manage: ["owner"],
} as const;

export type PermissionKey = keyof typeof Permissions;

export function roleHasPermission(role: Role, permission: PermissionKey): boolean {
  const allowed = Permissions[permission] as readonly Role[];
  return allowed.includes(role);
}

export function assertPermission(role: Role, permission: PermissionKey) {
  if (!roleHasPermission(role, permission)) {
    throw new Error("Forbidden");
  }
}