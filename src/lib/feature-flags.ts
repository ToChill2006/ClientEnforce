import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export type FeatureFlag = "enterprise_onboarding";

export async function orgHasFeature(orgId: string, flag: FeatureFlag): Promise<boolean> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("organizations")
    .select("feature_flags")
    .eq("id", orgId)
    .single();
  if (error || !data) return false;
  const flags = (data.feature_flags as Record<string, unknown>) ?? {};
  return flags[flag] === true;
}

// Use this in unauthenticated contexts (client portal) where there is no session cookie.
export async function orgHasFeatureAdmin(orgId: string, flag: FeatureFlag): Promise<boolean> {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("organizations")
    .select("feature_flags")
    .eq("id", orgId)
    .single();
  if (error || !data) return false;
  const flags = (data.feature_flags as Record<string, unknown>) ?? {};
  return flags[flag] === true;
}

export async function currentOrgHasFeature(flag: FeatureFlag): Promise<boolean> {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("user_id", userData.user.id)
    .single();
  if (!profile?.org_id) return false;
  return orgHasFeature(profile.org_id as string, flag);
}
