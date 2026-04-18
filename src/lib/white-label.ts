import { supabaseAdmin } from "@/lib/supabase-admin";
import { selectOrganizationTier } from "@/lib/plan-enforcement";

export type WhiteLabel = {
  brand_name: string | null;
  support_email: string | null;
  portal_tagline: string | null;
  accent_color: string | null;
  logo_url: string | null;
  remove_branding: boolean;
  custom_domain: string | null;
};

export const EMPTY_WHITE_LABEL: WhiteLabel = {
  brand_name: null,
  support_email: null,
  portal_tagline: null,
  accent_color: null,
  logo_url: null,
  remove_branding: false,
  custom_domain: null,
};

/**
 * Load an organisation's white-label settings, gated on the Agency Pro plan.
 * Returns EMPTY_WHITE_LABEL when the org is not Agency, settings are missing,
 * or the column hasn't been migrated yet — so callers can always spread safely.
 */
export async function loadWhiteLabelForOrg(orgId: string): Promise<WhiteLabel> {
  if (!orgId) return EMPTY_WHITE_LABEL;

  const admin = supabaseAdmin();

  try {
    const { tier } = await selectOrganizationTier(admin as any, orgId);
    if (tier !== "agency") return EMPTY_WHITE_LABEL;
  } catch {
    return EMPTY_WHITE_LABEL;
  }

  try {
    const { data, error } = await admin
      .from("organizations")
      .select("white_label_settings")
      .eq("id", orgId)
      .single();

    if (error || !data) return EMPTY_WHITE_LABEL;

    const raw = (data as any).white_label_settings ?? {};
    return { ...EMPTY_WHITE_LABEL, ...raw };
  } catch {
    return EMPTY_WHITE_LABEL;
  }
}

export type EmailBranding = {
  brand_name: string | null;
  logo_url: string | null;
  accent_color: string | null;
  support_email: string | null;
  custom_domain: string | null;
  remove_branding: boolean;
};

export function emailBrandingFromWhiteLabel(wl: WhiteLabel): EmailBranding {
  return {
    brand_name: wl.brand_name?.trim() || null,
    logo_url: wl.logo_url?.trim() || null,
    accent_color: wl.accent_color?.trim() || null,
    support_email: wl.support_email?.trim() || null,
    custom_domain: wl.custom_domain?.trim() || null,
    remove_branding: Boolean(wl.remove_branding),
  };
}
