import { redirect, notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import { PrintToolbar } from "./print-toolbar";
import "./print.css";

export const dynamic = "force-dynamic";

type Requirement = {
  type:
    | "text"
    | "file"
    | "signature"
    | "multiple_choice"
    | "checkbox"
    | "heading"
    | "payment"
    | "info";
  label: string;
  is_required: boolean;
  sort_order: number;
  phase_number?: number;
  options?: string[];
  allow_multi_select?: boolean;
  include_other?: boolean;
  multiline?: boolean;
  info_content?: string | null;
  payment_amount?: number | null;
  payment_currency?: string | null;
  payment_description?: string | null;
};

type PhaseDef = {
  number: number;
  name: string;
  deadline?: string | null;
  default_deadline_offset_days?: number;
};

type TemplateDefinition = {
  requirements?: Requirement[];
  phases?: PhaseDef[];
};

type TemplateRow = {
  id: string;
  org_id: string;
  name: string;
  definition: TemplateDefinition | null;
  created_at: string;
  updated_at: string;
};

const TYPE_LABEL: Record<Requirement["type"], string> = {
  text: "Text response",
  file: "File upload",
  signature: "Signature",
  multiple_choice: "Multiple choice",
  checkbox: "Acknowledgement",
  heading: "Section heading",
  payment: "Payment",
  info: "Information",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function groupByPhase(requirements: Requirement[], phases: PhaseDef[]) {
  const phaseMap = new Map<number, PhaseDef>();
  phases.forEach((p) => phaseMap.set(p.number, p));
  const sorted = [...requirements].sort((a, b) => a.sort_order - b.sort_order);
  const groups = new Map<number, Requirement[]>();
  sorted.forEach((r) => {
    const num = r.phase_number ?? 1;
    if (!groups.has(num)) groups.set(num, []);
    groups.get(num)!.push(r);
  });
  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([num, reqs]) => ({
      number: num,
      name: phaseMap.get(num)?.name ?? `Phase ${num}`,
      deadline: phaseMap.get(num)?.deadline ?? null,
      requirements: reqs,
    }));
}

export default async function TemplatePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await supabaseServer();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect(`/login?next=/templates/${id}/print`);

  const { data, error } = await supabase
    .from("templates")
    .select("id, org_id, name, definition, created_at, updated_at")
    .eq("id", id)
    .single();

  if (error || !data) notFound();
  const template = data as TemplateRow;

  // Org name for the header
  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", template.org_id)
    .single();
  const orgName = (org as { name?: string } | null)?.name ?? "ClientEnforce";

  const requirements = template.definition?.requirements ?? [];
  const phases = template.definition?.phases ?? [];
  const grouped = groupByPhase(requirements, phases);
  const totalRequired = requirements.filter((r) => r.is_required).length;

  return (
    <div className="print-root">
      <PrintToolbar templateName={template.name} />

      <article className="print-page">
        <header className="print-header">
          <div className="print-org">{orgName}</div>
          <div className="print-meta">
            Due diligence template
            <span aria-hidden> · </span>
            Generated {formatDate(new Date().toISOString())}
          </div>
        </header>

        <h1 className="print-title">{template.name}</h1>

        <dl className="print-summary">
          <div>
            <dt>Phases</dt>
            <dd>{phases.length || 1}</dd>
          </div>
          <div>
            <dt>Requirements</dt>
            <dd>{requirements.length}</dd>
          </div>
          <div>
            <dt>Required items</dt>
            <dd>{totalRequired}</dd>
          </div>
          <div>
            <dt>Last updated</dt>
            <dd>{formatDate(template.updated_at)}</dd>
          </div>
        </dl>

        {grouped.length === 0 ? (
          <p className="print-empty">
            This template has no requirements yet.
          </p>
        ) : (
          grouped.map((phase) => (
            <section key={phase.number} className="print-phase">
              <header className="print-phase-header">
                <div className="print-phase-number">Phase {phase.number}</div>
                <h2 className="print-phase-name">{phase.name}</h2>
                {phase.deadline ? (
                  <div className="print-phase-deadline">
                    Deadline: {formatDate(phase.deadline)}
                  </div>
                ) : null}
              </header>

              <ol className="print-req-list">
                {phase.requirements.map((req, i) => (
                  <li key={i} className="print-req">
                    <div className="print-req-row">
                      <span className="print-req-index" aria-hidden>
                        {i + 1}.
                      </span>
                      <div className="print-req-body">
                        <div className="print-req-label">
                          {req.label || "(untitled)"}
                          {req.is_required ? (
                            <span className="print-req-required" aria-label="Required">
                              Required
                            </span>
                          ) : (
                            <span className="print-req-optional">Optional</span>
                          )}
                        </div>
                        <div className="print-req-type">{TYPE_LABEL[req.type]}</div>

                        {req.type === "info" && req.info_content ? (
                          <p className="print-req-info">{req.info_content}</p>
                        ) : null}

                        {req.type === "multiple_choice" && req.options?.length ? (
                          <ul className="print-req-options">
                            {req.options.map((opt, idx) => (
                              <li key={idx}>
                                <span className="print-checkbox" aria-hidden />
                                {opt}
                              </li>
                            ))}
                            {req.include_other ? (
                              <li>
                                <span className="print-checkbox" aria-hidden />
                                Other: ______________________
                              </li>
                            ) : null}
                          </ul>
                        ) : null}

                        {req.type === "text" ? (
                          <div
                            className={`print-text-area ${
                              req.multiline ? "print-text-area-lg" : ""
                            }`}
                            aria-hidden
                          />
                        ) : null}

                        {req.type === "signature" ? (
                          <div className="print-signature">
                            <div className="print-signature-line" aria-hidden />
                            <div className="print-signature-caption">
                              Signature &amp; date
                            </div>
                          </div>
                        ) : null}

                        {req.type === "file" ? (
                          <div className="print-file">File attachment expected</div>
                        ) : null}

                        {req.type === "payment" ? (
                          <div className="print-payment">
                            {req.payment_currency} {req.payment_amount?.toFixed(2)}
                            {req.payment_description ? (
                              <span className="print-payment-desc">
                                {" "}
                                — {req.payment_description}
                              </span>
                            ) : null}
                          </div>
                        ) : null}

                        {req.type === "checkbox" ? (
                          <div className="print-ack">
                            <span className="print-checkbox" aria-hidden /> I acknowledge
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))
        )}

        <footer className="print-footer">
          Generated by ClientEnforce · clientenforce.com
        </footer>
      </article>
    </div>
  );
}
