import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile } from "@/lib/rbac";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();

  // Counts by org
  const [
    clientsRes,
    templatesRes,
    onboardingsRes,
    followupsDueRes,
    orgRes,
  ] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact", head: true }).eq("org_id", profile.org_id),
    supabase.from("templates").select("id", { count: "exact", head: true }).eq("org_id", profile.org_id),
    supabase.from("onboardings").select("id,status", { count: "exact" }).eq("org_id", profile.org_id),
    supabase
      .from("followup_jobs")
      .select("id", { count: "exact", head: true })
      .eq("org_id", profile.org_id)
      .eq("status", "queued")
      .lte("due_at", new Date().toISOString()),
    supabase
      .from("organizations")
      .select("tier,seats_limit,stripe_subscription_status")
      .eq("id", profile.org_id)
      .single(),
  ]);

  if (clientsRes.error) return NextResponse.json({ error: clientsRes.error.message }, { status: 400 });
  if (templatesRes.error) return NextResponse.json({ error: templatesRes.error.message }, { status: 400 });
  if (onboardingsRes.error) return NextResponse.json({ error: onboardingsRes.error.message }, { status: 400 });
  if (followupsDueRes.error) return NextResponse.json({ error: followupsDueRes.error.message }, { status: 400 });
  if (orgRes.error) return NextResponse.json({ error: orgRes.error.message }, { status: 400 });

  const onboardings = onboardingsRes.data || [];
  const totalOnboardings = onboardingsRes.count ?? 0;
  const byStatus = onboardings.reduce(
    (acc: Record<string, number>, o: any) => {
      const s = String(o.status || "unknown");
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {}
  );

  return NextResponse.json({
    clients: clientsRes.count ?? 0,
    templates: templatesRes.count ?? 0,
    onboardings_total: totalOnboardings,
    onboardings_by_status: byStatus,
    followups_due: followupsDueRes.count ?? 0,
    org: orgRes.data,
  });
}