import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type MemberRole = "owner" | "admin" | "member" | "onboarder" | "reviewer" | "external_viewer";

type ProfileRow = {
  user_id: string;
  org_id: string;
  email: string;
  full_name: string | null;
  created_at?: string;
};

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function requireUser() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new HttpError(401, error.message);
  if (!data.user) throw new HttpError(401, "Unauthorized");
  return data.user;
}

async function seedStarterTemplateIfEmpty(admin: ReturnType<typeof supabaseAdmin>, orgId: string) {
  try {
    // Only seed if the org truly has no templates yet
    const { count } = await admin.from("templates").select("id", { count: "exact", head: true }).eq("org_id", orgId);
    if ((count ?? 0) > 0) return;

    const definition = {
      requirements: [
        { type: "heading",         label: "Welcome",                             is_required: false, sort_order: 0 },
        { type: "signature",       label: "Client Agreement",                    is_required: true,  sort_order: 1 },
        { type: "file",            label: "Proof of ID",                         is_required: true,  sort_order: 2 },
        { type: "text",            label: "Business Name",                        is_required: true,  sort_order: 3 },
        { type: "text",            label: "Contact Phone Number",                is_required: true,  sort_order: 4 },
        { type: "multiple_choice", label: "How did you hear about us?",          is_required: false, sort_order: 5, options: ["Google", "Referral", "Social media", "Other"] },
        { type: "checkbox",        label: "I agree to the terms and conditions", is_required: true,  sort_order: 6 },
      ],
    };

    const { error } = await admin.from("templates").insert({ org_id: orgId, name: "Standard Client Onboarding", definition });
    if (error) {
      if (/column .*definition.* does not exist/i.test(error.message)) {
        const { error: err2 } = await admin.from("templates").insert({ org_id: orgId, name: "Standard Client Onboarding", definition_json: definition });
        if (err2) console.error("[seed] starter template insert (definition_json) failed", err2);
      } else {
        console.error("[seed] starter template insert failed", error);
      }
    }
  } catch (e) {
    console.error("[seed] starter template error", e);
  }
}

async function createOrgIfMissing(userId: string, fallbackName: string) {
  const admin = supabaseAdmin();

  // If they already have a membership, reuse its org.
  const { data: existingMembership, error: memErr } = await admin
    .from("memberships")
    .select("org_id, role, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (memErr) throw new Error(memErr.message);
  if (existingMembership?.org_id) {
    await seedStarterTemplateIfEmpty(admin, existingMembership.org_id);
    return { orgId: existingMembership.org_id, role: existingMembership.role as MemberRole };
  }

  // Create a new org and make the user the owner.
  const { data: org, error: orgErr } = await admin
    .from("organizations")
    .insert({
      name: fallbackName,
      owner_user_id: userId,
    })
    .select("id")
    .single();

  if (orgErr) throw new Error(orgErr.message);

  const { error: ownerErr } = await admin.from("memberships").insert({
    org_id: org.id,
    user_id: userId,
    role: "owner",
  });

  if (ownerErr) throw new Error(ownerErr.message);

  await seedStarterTemplateIfEmpty(admin, org.id);

  return { orgId: org.id, role: "owner" as MemberRole };
}

export async function requireProfile() {
  const user = await requireUser();
  const supabase = await supabaseServer();

  // Avoid `.single()` so we never throw on historical duplicates.
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, org_id, email, full_name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);

  // If profile exists with a valid org, return it immediately.
  if (data && (data as any).org_id) {
    const { created_at: _createdAt, ...profile } = data as ProfileRow;
    return profile as { user_id: string; org_id: string; email: string; full_name: string | null };
  }

  // Self-heal: profile missing or org_id is null (new signup flow sets org_id: null).
  const email = (user.email ?? "").toLowerCase();
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    null;

  const fallbackOrgName = fullName ? `${fullName}'s workspace` : "My workspace";
  const { orgId } = await createOrgIfMissing(user.id, fallbackOrgName);

  const admin = supabaseAdmin();

  const { data: created, error: upErr } = await admin
    .from("profiles")
    .upsert(
      {
        user_id: user.id,
        org_id: orgId,
        email,
        full_name: fullName,
      },
      { onConflict: "user_id" }
    )
    .select("user_id, org_id, email, full_name")
    .single();

  if (upErr) throw new Error(upErr.message);

  return created as { user_id: string; org_id: string; email: string; full_name: string | null };
}

export async function requireRole(allowedRoles?: MemberRole[]): Promise<MemberRole> {
  const user = await requireUser();
  const profile = await requireProfile();
  const supabase = await supabaseServer();

  // Use maybeSingle to avoid hard-crashing if bad historical dupes exist.
  const { data, error } = await supabase
    .from("memberships")
    .select("role, created_at")
    .eq("org_id", profile.org_id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);

  let role: MemberRole | null = data ? (data.role as MemberRole) : null;

  // Self-heal memberships when a user has a profile but no membership row
  // (or when they are the org owner but the role is wrong).
  if (!role) {
    const admin = supabaseAdmin();
    const { data: org, error: orgErr } = await admin
      .from("organizations")
      .select("id, owner_user_id")
      .eq("id", profile.org_id)
      .maybeSingle();

    if (orgErr) throw new Error(orgErr.message);
    if (!org) throw new HttpError(403, "Forbidden");

    const healedRole: MemberRole = org.owner_user_id === user.id ? "owner" : "member";

    const { error: insErr } = await admin.from("memberships").insert({
      org_id: org.id,
      user_id: user.id,
      role: healedRole,
    });

    if (insErr) throw new Error(insErr.message);

    role = healedRole;
  } else {
    // If the user is the org owner but their membership says otherwise, upgrade.
    const admin = supabaseAdmin();
    const { data: org, error: orgErr } = await admin
      .from("organizations")
      .select("owner_user_id")
      .eq("id", profile.org_id)
      .maybeSingle();

    if (orgErr) throw new Error(orgErr.message);

    if (org?.owner_user_id === user.id && role !== "owner") {
      const { error: upErr } = await admin
        .from("memberships")
        .update({ role: "owner" })
        .eq("org_id", profile.org_id)
        .eq("user_id", user.id);

      if (upErr) throw new Error(upErr.message);
      role = "owner";
    }
  }

  if (!role) throw new HttpError(403, "Forbidden");

  if (allowedRoles && !allowedRoles.includes(role)) {
    throw new HttpError(403, "Forbidden");
  }

  return role;
}

export function isAdmin(role: MemberRole) {
  return role === "owner" || role === "admin";
}

export async function requireAdmin() {
  return requireRole(["owner", "admin"]);
}

import { roleHasPermission, type PermissionKey } from "@/lib/permissions";

export async function requirePermission(permission: PermissionKey): Promise<MemberRole> {
  const role = await requireRole();
  if (!roleHasPermission(role as any, permission)) {
    throw new HttpError(403, "Forbidden");
  }
  return role;
}

export async function getOrgId(): Promise<string | null> {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("user_id", data.user.id)
    .single();
  return (profile?.org_id as string) ?? null;
}