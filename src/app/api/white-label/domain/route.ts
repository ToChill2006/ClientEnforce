import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { requireProfile, requireRole } from "@/lib/rbac";
import { permissionDenied, selectOrganizationTier } from "@/lib/plan-enforcement";
import { roleHasPermission } from "@/lib/permissions";
import { getDomainStatus } from "@/lib/vercel-domains";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await requireProfile();
  const role = await requireRole(["owner", "admin"]);

  if (!roleHasPermission(role, "invites_create")) {
    return NextResponse.json({ error: permissionDenied("Only owners and admins can manage white-label settings.") }, { status: 403 });
  }

  const admin = supabaseAdmin();
  const { tier, error: tierErr } = await selectOrganizationTier(admin, profile.org_id);
  if (tierErr) return NextResponse.json({ error: tierErr.message }, { status: 400 });
  if (tier !== "agency") {
    return NextResponse.json({ error: "White-label features require the Agency Pro plan." }, { status: 403 });
  }

  const { data: org } = await admin
    .from("organizations")
    .select("white_label_settings")
    .eq("id", profile.org_id)
    .single();

  const domain: string | null = (org as any)?.white_label_settings?.custom_domain ?? null;
  if (!domain) return NextResponse.json({ error: "No custom domain configured." }, { status: 400 });

  try {
    const status = await getDomainStatus(domain);
    return NextResponse.json({ domain, ...status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to check domain status" }, { status: 500 });
  }
}
