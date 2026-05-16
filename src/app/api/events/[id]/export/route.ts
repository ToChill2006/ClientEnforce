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

function safeColName(s: string): string {
  return s.replace(/[,"]/g, "");
}

function eventSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
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

  if (type === "file") return ""; // handled separately
  if (type === "signature") return req.signature_path ? "[signature captured]" : "";

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

    const { id: eventId } = await params;
    const org_id = await getOrgId();
    if (!org_id) return err(403, "No organisation");

    const role = await requireRole();
    if (!roleHasPermission(role as any, "events_view")) return err(403, "Forbidden");

    const supabase = supabaseAdmin();

    // Verify event belongs to caller's org
    const { data: event, error: eventErr } = await supabase
      .from("events")
      .select("id, name, org_id")
      .eq("id", eventId)
      .eq("org_id", org_id)
      .maybeSingle();

    if (eventErr) return err(400, eventErr.message);
    if (!event) return err(404, "Event not found");

    // Fetch all onboardings for this event
    const { data: onboardings, error: obErr } = await supabase
      .from("onboardings")
      .select("id, title, status, client_id, template_id, owner_id")
      .eq("event_id", eventId)
      .eq("org_id", org_id);

    if (obErr) return err(400, obErr.message);
    if (!onboardings || onboardings.length === 0) {
      // Return empty CSV
      const filename = `${eventSlug(event.name as string)}_${new Date().toISOString().slice(0, 10)}.csv`;
      return new Response("client_name,client_email,company_name,template_name,owner_email,overall_status\n", {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    const onboardingIds = onboardings.map((o) => o.id as string);
    const clientIds = [...new Set(onboardings.map((o) => o.client_id as string).filter(Boolean))];
    const templateIds = [...new Set(onboardings.map((o) => o.template_id as string).filter(Boolean))];
    const ownerIds = [...new Set(onboardings.map((o) => o.owner_id as string).filter(Boolean))];

    // Batch fetch clients
    const { data: clients } = await supabase
      .from("clients")
      .select("id, full_name, email, company_name")
      .in("id", clientIds.length > 0 ? clientIds : ["00000000-0000-0000-0000-000000000000"]);

    const clientMap = new Map<string, { full_name: string; email: string; company_name: string }>();
    for (const c of clients ?? []) {
      clientMap.set(c.id as string, {
        full_name: (c.full_name as string) ?? "",
        email: (c.email as string) ?? "",
        company_name: (c.company_name as string) ?? "",
      });
    }

    // Batch fetch templates
    const { data: templates } = await supabase
      .from("templates")
      .select("id, name")
      .in("id", templateIds.length > 0 ? templateIds : ["00000000-0000-0000-0000-000000000000"]);

    const templateMap = new Map<string, string>();
    for (const t of templates ?? []) {
      templateMap.set(t.id as string, (t.name as string) ?? "");
    }

    // Batch fetch team members (for owner emails)
    const { data: members } = await supabase
      .from("memberships")
      .select("user_id, profiles(email)")
      .eq("org_id", org_id)
      .in("user_id", ownerIds.length > 0 ? ownerIds : ["00000000-0000-0000-0000-000000000000"]);

    const ownerEmailMap = new Map<string, string>();
    for (const m of members ?? []) {
      const email = (m as any)?.profiles?.email ?? "";
      ownerEmailMap.set(m.user_id as string, email);
    }

    // Batch fetch requirements
    const { data: allRequirements, error: reqErr } = await supabase
      .from("onboarding_requirements")
      .select("*")
      .in("onboarding_id", onboardingIds)
      .order("phase_number", { ascending: true })
      .order("sort_order", { ascending: true });

    if (reqErr) return err(400, reqErr.message);

    // Batch fetch phases
    const { data: allPhases } = await supabase
      .from("onboarding_phases")
      .select("onboarding_id, phase_number, name, status, deadline")
      .in("onboarding_id", onboardingIds)
      .order("phase_number", { ascending: true });

    // Build phase map: onboardingId -> phaseNumber -> phase info
    const phasesByOnboarding = new Map<string, Map<number, { name: string; status: string; deadline: string }>>();
    for (const p of allPhases ?? []) {
      const oid = p.onboarding_id as string;
      if (!phasesByOnboarding.has(oid)) phasesByOnboarding.set(oid, new Map());
      phasesByOnboarding.get(oid)!.set(p.phase_number as number, {
        name: (p.name as string) ?? "",
        status: (p.status as string) ?? "",
        deadline: (p.deadline as string) ?? "",
      });
    }

    // Build requirements map: onboardingId -> list of requirements
    const reqsByOnboarding = new Map<string, Record<string, unknown>[]>();
    for (const r of allRequirements ?? []) {
      const oid = r.onboarding_id as string;
      if (!reqsByOnboarding.has(oid)) reqsByOnboarding.set(oid, []);
      reqsByOnboarding.get(oid)!.push(r as Record<string, unknown>);
    }

    // Collect all unique requirement columns: (templateName, phaseNumber, label)
    // Key format: {templateName}__{phaseNumber}__{label}
    const colKeySet = new Map<string, { templateName: string; phaseNumber: number; label: string }>();
    const colKeyOrder: string[] = [];

    for (const ob of onboardings) {
      const tName = templateMap.get(ob.template_id as string) ?? "";
      const reqs = reqsByOnboarding.get(ob.id as string) ?? [];
      for (const r of reqs) {
        if (r.type === "heading") continue;
        const key = safeColName(`${tName}__${r.phase_number}__${r.label}`);
        if (!colKeySet.has(key)) {
          colKeySet.set(key, {
            templateName: tName,
            phaseNumber: r.phase_number as number,
            label: r.label as string,
          });
          colKeyOrder.push(key);
        }
      }
    }

    // Fixed columns
    const fixedCols = [
      "client_name",
      "client_email",
      "company_name",
      "template_name",
      "owner_email",
      "overall_status",
      "phase_1_status",
      "phase_1_deadline",
      "phase_2_status",
      "phase_2_deadline",
      "phase_3_status",
      "phase_3_deadline",
    ];

    const header = csvRow([...fixedCols, ...colKeyOrder]);
    const rows: string[] = [header];

    for (const ob of onboardings) {
      const client = clientMap.get(ob.client_id as string) ?? { full_name: "", email: "", company_name: "" };
      const tName = templateMap.get(ob.template_id as string) ?? "";
      const ownerEmail = ownerEmailMap.get(ob.owner_id as string) ?? "";
      const phases = phasesByOnboarding.get(ob.id as string) ?? new Map();

      const p1 = phases.get(1);
      const p2 = phases.get(2);
      const p3 = phases.get(3);

      const reqs = reqsByOnboarding.get(ob.id as string) ?? [];

      // Build a lookup for this onboarding's requirements by column key
      const reqValueMap = new Map<string, string>();

      for (const r of reqs) {
        if (r.type === "heading") continue;
        const key = safeColName(`${tName}__${r.phase_number}__${r.label}`);

        let cellValue: string;
        if (r.type === "file") {
          cellValue = await resolveFileUrls(
            supabase,
            (r.file_path as string | null) ?? null,
            r.file_paths
          );
        } else {
          cellValue = formatAnswer(r);
        }

        reqValueMap.set(key, cellValue);
      }

      const dynCells = colKeyOrder.map((key) => reqValueMap.get(key) ?? "");

      rows.push(
        csvRow([
          client.full_name,
          client.email,
          client.company_name,
          tName,
          ownerEmail,
          ob.status ?? "",
          p1?.status ?? "",
          p1?.deadline ?? "",
          p2?.status ?? "",
          p2?.deadline ?? "",
          p3?.status ?? "",
          p3?.deadline ?? "",
          ...dynCells,
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
          subject_kind: "event",
          subject_id: eventId,
          context: { event_id: eventId, event_name: event.name },
        });
      }
    } catch { /* best-effort */ }

    const today = new Date().toISOString().slice(0, 10);
    const filename = `${eventSlug(event.name as string)}_${today}.csv`;

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
