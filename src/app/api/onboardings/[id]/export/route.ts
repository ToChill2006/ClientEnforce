import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { supabaseServer } from "@/lib/supabase-server";
import { requireRole, getOrgId, HttpError } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { currentOrgHasFeature } from "@/lib/feature-flags";

export const maxDuration = 300;

function err(status: number, msg: string) {
  return NextResponse.json({ error: msg }, { status });
}

function csvEscape(v: unknown): string {
  if (v == null) return "";
  const s = String(v).replace(/"/g, '""');
  if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s}"`;
  return s;
}

function csvRow(cells: unknown[]): string {
  return cells.map(csvEscape).join(",");
}

function safeFilename(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

async function resolveFileUrls(
  supabase: ReturnType<typeof supabaseAdmin>,
  filePath: string | null,
  filePaths: unknown
): Promise<string> {
  const defaultBucket = "onboarding-files";

  async function signOne(ref: string): Promise<string> {
    const colonIdx = ref.indexOf(":");
    let bucket: string;
    let path: string;
    if (colonIdx > 0) {
      bucket = ref.slice(0, colonIdx);
      path = ref.slice(colonIdx + 1);
    } else {
      bucket = defaultBucket;
      path = ref;
    }
    const { data } = await supabase.storage.from(bucket).createSignedUrl(path, 86400);
    return data?.signedUrl ?? ref;
  }

  const urls: string[] = [];

  if (filePath) {
    urls.push(await signOne(filePath));
  }

  if (Array.isArray(filePaths)) {
    for (const fp of filePaths) {
      if (typeof fp === "string" && fp) {
        urls.push(await signOne(fp));
      }
    }
  } else if (typeof filePaths === "string" && filePaths) {
    try {
      const parsed = JSON.parse(filePaths);
      if (Array.isArray(parsed)) {
        for (const fp of parsed) {
          if (typeof fp === "string" && fp) {
            urls.push(await signOne(fp));
          }
        }
      }
    } catch {
      urls.push(await signOne(filePaths));
    }
  }

  return urls.join(";");
}

function formatAnswer(req: Record<string, unknown>): string {
  const type = req.type as string | null;

  // "Not applicable" overrides any stored draft answer in every export.
  const meta = req.metadata as { na?: boolean } | null | undefined;
  if (meta && typeof meta === "object" && meta.na) return "N/A";

  if (type === "file") return ""; // handled separately
  if (type === "signature") return ""; // handled separately

  if (type === "checkbox") {
    return req.value_boolean != null ? String(req.value_boolean) : "";
  }

  if (type === "payment") {
    if (req.is_paid) {
      return `[paid ${req.payment_amount ?? ""} ${req.payment_currency ?? ""}]`.trim();
    }
    return "";
  }

  if (req.value_text != null && req.value_text !== "") {
    const vt = req.value_text as string;
    // Try to expand JSON array (for select/multiple_choice)
    if (vt.startsWith("[")) {
      try {
        const parsed = JSON.parse(vt);
        if (Array.isArray(parsed)) return parsed.join(", ");
      } catch { /* fall through */ }
    }
    return vt;
  }

  return "";
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const flagOn = await currentOrgHasFeature("enterprise_onboarding");
    if (!flagOn) return err(404, "Not found");

    const { id: onboardingId } = await params;
    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organisation");

    const role = await requireRole();
    if (!roleHasPermission(role as any, "events_view")) return err(403, "Forbidden");

    const supabase = supabaseAdmin();

    // Verify onboarding belongs to caller's org + fetch core data
    const { data: onboarding, error: obErr } = await supabase
      .from("onboardings")
      .select("id, org_id, title, status, client_id, template_id, event_id")
      .eq("id", onboardingId)
      .eq("org_id", org_id)
      .maybeSingle();

    if (obErr) return err(400, obErr.message);
    if (!onboarding) return err(404, "Onboarding not found");

    // Fetch client
    const { data: client } = await supabase
      .from("clients")
      .select("full_name, email, company_name")
      .eq("id", onboarding.client_id)
      .maybeSingle();

    // Fetch event name
    let eventName = "";
    if (onboarding.event_id) {
      const { data: event } = await supabase
        .from("events")
        .select("name")
        .eq("id", onboarding.event_id)
        .maybeSingle();
      eventName = event?.name ?? "";
    }

    // Fetch template name
    let templateName = "";
    if (onboarding.template_id) {
      const { data: template } = await supabase
        .from("templates")
        .select("name")
        .eq("id", onboarding.template_id)
        .maybeSingle();
      templateName = template?.name ?? "";
    }

    // Fetch requirements
    const { data: requirements, error: reqErr } = await supabase
      .from("onboarding_requirements")
      .select("*")
      .eq("onboarding_id", onboardingId)
      .order("phase_number", { ascending: true })
      .order("sort_order", { ascending: true });

    if (reqErr) return err(400, reqErr.message);

    // Fetch phases for phase name lookup
    const { data: phases } = await supabase
      .from("onboarding_phases")
      .select("phase_number, name, status, deadline")
      .eq("onboarding_id", onboardingId)
      .order("phase_number", { ascending: true });

    const phaseMap = new Map<number, { name: string; status: string }>();
    for (const p of phases ?? []) {
      phaseMap.set(p.phase_number as number, {
        name: (p.name as string) ?? "",
        status: (p.status as string) ?? "",
      });
    }

    const clientName = (client as any)?.full_name ?? "";
    const clientEmail = (client as any)?.email ?? "";
    const companyName = (client as any)?.company_name ?? "";

    const header = csvRow([
      "client_name",
      "client_email",
      "company_name",
      "event_name",
      "template_name",
      "phase_number",
      "phase_name",
      "requirement_label",
      "requirement_type",
      "is_required",
      "answer",
      "file_urls",
      "submitted_at",
      "review_status",
      "reviewer_comment",
      "ad_hoc",
    ]);

    const rows: string[] = [header];

    for (const req of requirements ?? []) {
      const r = req as Record<string, unknown>;

      // Skip non-interactive rows
      if (r.type === "heading" || r.type === "info") continue;

      const phaseNumber = r.phase_number as number;
      const phaseInfo = phaseMap.get(phaseNumber);

      const metaNa = !!(r.metadata && typeof r.metadata === "object" && (r.metadata as { na?: boolean }).na);
      const answer = formatAnswer(r);
      const signatureOutput =
        !metaNa && r.type === "signature" ? (r.signature_path ? "[signature captured]" : "") : "";
      // N/A hides any preserved file/signature so exports never surface a withdrawn answer.
      const fileUrls =
        !metaNa && r.type === "file"
          ? await resolveFileUrls(supabase, (r.file_path as string | null) ?? null, r.file_paths)
          : "";

      const answerCell = metaNa ? "N/A" : r.type === "signature" ? signatureOutput : answer;

      rows.push(
        csvRow([
          clientName,
          clientEmail,
          companyName,
          eventName,
          templateName,
          phaseNumber,
          phaseInfo?.name ?? "",
          r.label,
          r.type,
          r.is_required ? "true" : "false",
          answerCell,
          fileUrls,
          r.submitted_at ?? "",
          r.review_status ?? "",
          r.reviewer_comment ?? "",
          r.is_ad_hoc ? "true" : "false",
        ])
      );
    }

    const csv = rows.join("\n");

    // Log activity — best effort
    try {
      const serverSupabase = await supabaseServer();
      const { data: userData } = await serverSupabase.auth.getUser();
      if (userData?.user) {
        await supabase.from("team_activity").insert({
          org_id,
          actor_user_id: userData.user.id,
          actor_kind: "user",
          verb: "exported",
          subject_kind: "onboarding",
          subject_id: onboardingId,
          context: { onboarding_id: onboardingId, client_name: clientName },
        });
      }
    } catch { /* best-effort */ }

    const today = new Date().toISOString().slice(0, 10);
    const filename = `${safeFilename(clientName)}_${safeFilename(templateName)}_${today}.csv`;

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e: any) {
    if (e instanceof HttpError) return err(e.status, e.message);
    return err(500, e?.message || "Internal error");
  }
}
