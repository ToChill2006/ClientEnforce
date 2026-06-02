import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase-server";
import { loadWhiteLabelForOrg } from "@/lib/white-label";
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

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateMonthYear(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
  });
}

function makeVersion(updatedAt: string) {
  const d = new Date(updatedAt);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
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
  // Ensure all declared phases appear even if empty
  phases.forEach((p) => {
    if (!groups.has(p.number)) groups.set(p.number, []);
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await supabaseServer();
  const { data } = await supabase
    .from("templates")
    .select("name")
    .eq("id", id)
    .single();
  const name = (data as { name?: string } | null)?.name ?? "Template";
  return {
    title: `${name} · Due Diligence Template`,
    robots: { index: false, follow: false },
  };
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

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", template.org_id)
    .single();
  const orgRecordName = (org as { name?: string } | null)?.name ?? null;

  const whiteLabel = await loadWhiteLabelForOrg(template.org_id);
  const orgName = whiteLabel.brand_name || orgRecordName || "ClientEnforce";
  const logoUrl = whiteLabel.logo_url;

  const requirements = template.definition?.requirements ?? [];
  const phases = template.definition?.phases ?? [];
  const grouped = groupByPhase(requirements, phases);
  const totalRequired = requirements.filter((r) => r.is_required).length;
  const totalOptional = requirements.length - totalRequired;
  const generatedDate = formatDateLong(new Date().toISOString());
  const version = makeVersion(template.updated_at);

  return (
    <div className="print-root">
      <PrintToolbar templateName={template.name} />

      {/* Named strings drive the print header/footer on every page */}
      <span className="pdf-string-title" aria-hidden style={{ display: "none" }}>
        {template.name}
      </span>
      <span className="pdf-string-org" aria-hidden style={{ display: "none" }}>
        {orgName}
      </span>
      <span className="pdf-string-date" aria-hidden style={{ display: "none" }}>
        {generatedDate}
      </span>

      <div className="pdf-doc">
        {/* ───────── Cover ───────── */}
        <section className="pdf-page pdf-cover" aria-label="Cover">
          <div className="pdf-cover-top">
            {logoUrl ? (
              // Org-uploaded logo on Agency Pro
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={`${orgName} logo`} className="pdf-cover-logo" />
            ) : (
              <span className="pdf-cover-brand">{orgName}</span>
            )}
            <span className="pdf-cover-rule" aria-hidden />
            <span className="pdf-cover-brand">{version}</span>
          </div>

          <div className="pdf-cover-body">
            <div className="pdf-cover-eyebrow">Due Diligence Questionnaire</div>
            <h1 className="pdf-cover-title">{template.name}</h1>
            <p className="pdf-cover-subtitle">
              This document defines the information, documents and acknowledgements
              required to complete due diligence. Please respond to each section in
              order. Items marked Required must be answered to submit.
            </p>

            <dl className="pdf-cover-stats" aria-label="Document summary">
              <div>
                <dt className="pdf-cover-stat-label">Phases</dt>
                <dd className="pdf-cover-stat-value">{grouped.length}</dd>
              </div>
              <div>
                <dt className="pdf-cover-stat-label">Items</dt>
                <dd className="pdf-cover-stat-value">{requirements.length}</dd>
              </div>
              <div>
                <dt className="pdf-cover-stat-label">Required</dt>
                <dd className="pdf-cover-stat-value">{totalRequired}</dd>
              </div>
              <div>
                <dt className="pdf-cover-stat-label">Optional</dt>
                <dd className="pdf-cover-stat-value">{totalOptional}</dd>
              </div>
            </dl>

            <dl className="pdf-cover-meta">
              <div>
                <dt>Prepared by</dt>
                <dd>{orgName}</dd>
              </div>
              <div>
                <dt>Generated</dt>
                <dd>{generatedDate}</dd>
              </div>
              <div>
                <dt>Version</dt>
                <dd>{version}</dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd>{formatDateMonthYear(template.updated_at)}</dd>
              </div>
            </dl>
          </div>

          <div className="pdf-cover-footer">
            <span className="pdf-cover-confidential">Confidential</span>
            <span>For intended recipient only · Do not redistribute</span>
          </div>
        </section>

        {/* ───────── Contents ───────── */}
        {grouped.length > 0 ? (
          <section className="pdf-page" aria-label="Contents">
            <div className="pdf-contents-eyebrow">Contents</div>
            <h2 className="pdf-contents-title">In this document</h2>
            <ol className="pdf-contents-list">
              {grouped.map((p) => (
                <li key={p.number} className="pdf-contents-row">
                  <span className="pdf-contents-num">
                    Phase {String(p.number).padStart(2, "0")}
                  </span>
                  <span className="pdf-contents-name">{p.name}</span>
                  <span className="pdf-contents-count">
                    {p.requirements.length} item{p.requirements.length === 1 ? "" : "s"}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {/* ───────── Phases ───────── */}
        {grouped.length === 0 ? (
          <section className="pdf-page">
            <p className="pdf-resp-info">This template has no requirements yet.</p>
          </section>
        ) : (
          grouped.map((phase) => (
            <section
              key={phase.number}
              className="pdf-page pdf-phase"
              aria-label={`Phase ${phase.number}: ${phase.name}`}
            >
              <header className="pdf-phase-header">
                <div className="pdf-phase-eyebrow">
                  <span className="pdf-phase-eyebrow-bar" aria-hidden />
                  Phase {phase.number} of {grouped.length}
                </div>
                <h2 className="pdf-phase-name">{phase.name}</h2>
                {phase.deadline ? (
                  <div className="pdf-phase-deadline">
                    <span className="pdf-phase-deadline-label">Deadline</span>
                    {formatDateLong(phase.deadline)}
                  </div>
                ) : null}
              </header>

              {phase.requirements.length === 0 ? (
                <p className="pdf-resp-info">No requirements in this phase.</p>
              ) : (
                <ol className="pdf-req-list">
                  {phase.requirements.map((req, i) => {
                    if (req.type === "heading") {
                      return (
                        <li key={i} className="pdf-req-heading">
                          <div className="pdf-req-heading-eyebrow">Section</div>
                          <h3 className="pdf-req-heading-title">
                            {req.label || "(untitled section)"}
                          </h3>
                        </li>
                      );
                    }
                    return (
                      <li key={i} className="pdf-req">
                        <div className="pdf-req-head">
                          <span className="pdf-req-num" aria-hidden>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="pdf-req-main">
                            <div className="pdf-req-label">
                              {req.label || "(untitled)"}
                            </div>
                            <div className="pdf-req-pills">
                              <span className="pdf-pill pdf-pill-type">
                                {TYPE_LABEL[req.type]}
                              </span>
                              {req.is_required ? (
                                <span className="pdf-pill pdf-pill-required">
                                  Required
                                </span>
                              ) : (
                                <span className="pdf-pill pdf-pill-optional">
                                  Optional
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <ResponseBlock req={req} />
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          ))
        )}

        {/* ───────── End ───────── */}
        <section className="pdf-page pdf-end" aria-label="End of document">
          <div className="pdf-end-card">
            <div className="pdf-end-eyebrow">End of document</div>
            <h2 className="pdf-end-title">Thank you for completing this submission.</h2>
            <p className="pdf-end-body">
              Once every Required item has been answered, return this document — or
              submit your responses through the secure ClientEnforce portal link you
              were sent. For questions, contact {orgName}.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function ResponseBlock({ req }: { req: Requirement }) {
  if (req.type === "info") {
    return req.info_content ? (
      <div className="pdf-resp">
        <p className="pdf-resp-info">{req.info_content}</p>
      </div>
    ) : null;
  }

  if (req.type === "text") {
    return (
      <div className="pdf-resp">
        {req.multiline ? (
          <div className="pdf-resp-text-box" aria-hidden />
        ) : (
          <div className="pdf-resp-text-lines" aria-hidden>
            <div className="pdf-resp-text-line" />
            <div className="pdf-resp-text-line" />
          </div>
        )}
      </div>
    );
  }

  if (req.type === "multiple_choice") {
    const Marker = req.allow_multi_select ? "pdf-checkbox" : "pdf-radio";
    return (
      <div className="pdf-resp">
        <ul className="pdf-resp-options">
          {(req.options ?? []).map((opt, idx) => (
            <li key={idx} className="pdf-resp-option">
              <span className={Marker} aria-hidden />
              <span>{opt}</span>
            </li>
          ))}
          {req.include_other ? (
            <li className="pdf-resp-option">
              <span className={Marker} aria-hidden />
              <span>Other:</span>
              <span className="pdf-resp-other-line" aria-hidden />
            </li>
          ) : null}
        </ul>
      </div>
    );
  }

  if (req.type === "signature") {
    return (
      <div className="pdf-resp">
        <div className="pdf-resp-signature">
          <div>
            <div className="pdf-resp-sig-line" aria-hidden />
            <div className="pdf-resp-sig-caption">Signature</div>
          </div>
          <div>
            <div className="pdf-resp-sig-line" aria-hidden />
            <div className="pdf-resp-sig-caption">Date signed</div>
          </div>
        </div>
      </div>
    );
  }

  if (req.type === "file") {
    return (
      <div className="pdf-resp">
        <div className="pdf-resp-file">
          <span className="pdf-resp-file-icon" aria-hidden />
          <span>Attach a file when submitting via the secure portal</span>
        </div>
      </div>
    );
  }

  if (req.type === "payment") {
    const amount =
      typeof req.payment_amount === "number"
        ? req.payment_amount.toFixed(2)
        : "0.00";
    return (
      <div className="pdf-resp">
        <div className="pdf-resp-payment">
          <span className="pdf-resp-payment-amount">
            {req.payment_currency ?? ""} {amount}
          </span>
          {req.payment_description ? (
            <span className="pdf-resp-payment-desc">
              {req.payment_description}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  if (req.type === "checkbox") {
    return (
      <div className="pdf-resp">
        <div className="pdf-resp-ack">
          <span className="pdf-checkbox" aria-hidden /> I acknowledge
        </div>
      </div>
    );
  }

  return null;
}
