import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { permissionDenied, selectOrganizationTier } from "@/lib/plan-enforcement";

export const runtime = "nodejs";

export type WhiteLabelSettings = {
  brand_name: string | null;
  support_email: string | null;
  portal_tagline: string | null;
  accent_color: string | null;
  logo_url: string | null;
  remove_branding: boolean;
  custom_domain: string | null;
};

const DEFAULT_SETTINGS: WhiteLabelSettings = {
  brand_name: null,
  support_email: null,
  portal_tagline: null,
  accent_color: null,
  logo_url: null,
  remove_branding: false,
  custom_domain: null,
};

export async function GET() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin", "member"]);

  if (!roleHasPermission(role, "team_members_view")) {
    return NextResponse.json({ error: permissionDenied("You do not have access to these settings.") }, { status: 403 });
  }

  const admin = supabaseAdmin();
  const { tier, error: tierErr } = await selectOrganizationTier(admin, profile.org_id);
  if (tierErr) return NextResponse.json({ error: tierErr.message }, { status: 400 });

  if (tier !== "agency") {
    return NextResponse.json({ error: "White-label features require the Agency Pro plan." }, { status: 403 });
  }

  const { data: org, error } = await admin
    .from("organizations")
    .select("white_label_settings")
    .eq("id", profile.org_id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const settings: WhiteLabelSettings = {
    ...DEFAULT_SETTINGS,
    ...((org as any)?.white_label_settings ?? {}),
  };

  return NextResponse.json({ settings });
}

export async function PATCH(req: Request) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin"]);

  if (!roleHasPermission(role, "invites_create")) {
    return NextResponse.json({ error: permissionDenied("Only owners and admins can update white-label settings.") }, { status: 403 });
  }

  const admin = supabaseAdmin();
  const { tier, error: tierErr } = await selectOrganizationTier(admin, profile.org_id);
  if (tierErr) return NextResponse.json({ error: tierErr.message }, { status: 400 });

  if (tier !== "agency") {
    return NextResponse.json({ error: "White-label features require the Agency Pro plan." }, { status: 403 });
  }

  let body: Partial<WhiteLabelSettings> = {};
  try { body = await req.json(); } catch { /* ok */ }

  // Sanitize and validate incoming fields
  const patch: Partial<WhiteLabelSettings> = {};
  if ("brand_name" in body) patch.brand_name = typeof body.brand_name === "string" ? body.brand_name.trim() || null : null;
  if ("support_email" in body) patch.support_email = typeof body.support_email === "string" ? body.support_email.trim().toLowerCase() || null : null;
  if ("portal_tagline" in body) patch.portal_tagline = typeof body.portal_tagline === "string" ? body.portal_tagline.trim() || null : null;
  if ("logo_url" in body) patch.logo_url = typeof body.logo_url === "string" ? body.logo_url.trim() || null : null;
  if ("custom_domain" in body) patch.custom_domain = typeof body.custom_domain === "string" ? body.custom_domain.trim().toLowerCase() || null : null;
  if ("remove_branding" in body) patch.remove_branding = Boolean(body.remove_branding);
  if ("accent_color" in body) {
    const c = typeof body.accent_color === "string" ? body.accent_color.trim() : "";
    patch.accent_color = /^#[0-9a-f]{3,6}$/i.test(c) ? c : null;
  }

  // Read existing, merge, and write back
  const { data: existing, error: readErr } = await admin
    .from("organizations")
    .select("white_label_settings")
    .eq("id", profile.org_id)
    .single();

  if (readErr) return NextResponse.json({ error: readErr.message }, { status: 400 });

  const merged: WhiteLabelSettings = {
    ...DEFAULT_SETTINGS,
    ...((existing as any)?.white_label_settings ?? {}),
    ...patch,
  };

  const { error: writeErr } = await admin
    .from("organizations")
    .update({ white_label_settings: merged } as any)
    .eq("id", profile.org_id);

  if (writeErr) return NextResponse.json({ error: writeErr.message }, { status: 400 });

  return NextResponse.json({ ok: true, settings: merged });
}
