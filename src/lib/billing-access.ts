import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile } from "@/lib/rbac";
import { getPlanEntitlements, normalizePlanTier } from "@/lib/billing-plans";

export async function getCurrentOrgPlan() {
  const supabase = await supabaseServer();
  const profile = await requireProfile();

  const { data: org, error } = await supabase
    .from("organizations")
    .select("id, tier, stripe_subscription_status")
    .eq("id", profile.org_id)
    .single();

  if (error) throw new Error(error.message);

  const tier = normalizePlanTier(org?.tier);
  const entitlements = getPlanEntitlements(tier);

  return {
    org,
    tier,
    entitlements,
  };
}