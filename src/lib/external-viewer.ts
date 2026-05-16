import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getExternalViewerEventIds(userId: string, orgId: string): Promise<string[]> {
  const { data } = await supabaseAdmin()
    .from("external_viewer_scopes")
    .select("event_id")
    .eq("user_id", userId)
    .eq("org_id", orgId);
  return (data ?? []).map((r: any) => r.event_id as string);
}

/** Returns all onboarding IDs the external viewer is allowed to access via their event scopes. */
export async function getExternalViewerOnboardingIds(userId: string, orgId: string): Promise<string[]> {
  const eventIds = await getExternalViewerEventIds(userId, orgId);
  if (eventIds.length === 0) return [];

  const { data } = await supabaseAdmin()
    .from("onboardings")
    .select("id")
    .eq("org_id", orgId)
    .in("event_id", eventIds);

  return (data ?? []).map((r: any) => r.id as string);
}

/** Extracts the onboarding UUID from a storage path like org_<orgId>/onboarding_<uuid>/... */
export function onboardingIdFromStoragePath(path: string): string | null {
  const match = path.match(/onboarding_([0-9a-f-]{36})/i);
  return match?.[1] ?? null;
}
