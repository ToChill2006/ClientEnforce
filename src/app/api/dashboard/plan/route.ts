import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { getPlanEntitlements, normalizePlanTier } from "@/lib/billing-plans";
import { selectOrganizationTier } from "@/lib/plan-enforcement";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await requireProfile();
    const role = await requireRole(["owner", "admin", "member"]);

    if (!roleHasPermission(role, "dashboard_view")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const admin = supabaseAdmin();
    const { tier } = await selectOrganizationTier(admin, profile.org_id);
    const entitlements = getPlanEntitlements(tier);

    return NextResponse.json({ tier, entitlements });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
  }
}
