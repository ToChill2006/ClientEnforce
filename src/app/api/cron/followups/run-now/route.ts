import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole, requireProfile } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import {
  followupsEnabledForTier,
  followupsUnavailableMessage,
  permissionDenied,
  selectOrganizationTier,
} from "@/lib/plan-enforcement";
import { appOrigin } from "@/lib/app-url";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let role;
  try {
    role = await requireRole(["owner", "admin", "member"]);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!roleHasPermission(role, "followups_run")) {
    return NextResponse.json({ error: permissionDenied("You do not have access to run follow-ups manually.") }, { status: 403 });
  }

  const profile = await requireProfile();

  const { tier, error: orgError } = await selectOrganizationTier(supabase, profile.org_id);

  if (orgError) {
    return NextResponse.json({ error: orgError.message }, { status: 400 });
  }

  if (!followupsEnabledForTier(tier)) {
    return NextResponse.json(
      { error: followupsUnavailableMessage("run") },
      { status: 403 }
    );
  }

  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET is not set" }, { status: 500 });

  const reqUrl = new URL(req.url);
  const base = process.env.NODE_ENV === "production" ? appOrigin() : reqUrl.origin;
  const res = await fetch(`${base}/api/cron/followups/run`, {
    method: "POST",
    headers: { authorization: `Bearer ${secret}` },
  });

  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}
