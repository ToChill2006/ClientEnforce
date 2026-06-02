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
  text: "Written response",
  file: "Attachment required",
  signature: "Signature required",
  multiple_choice: "Selection",
  checkbox: "Acknowledgement",
  heading: "Subsection",
  payment: "Payment",
  info: "For information",
};

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function makeFormRef(id: string, updatedAt: string) {
  const short = id.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 6);
  const y = new Date(updatedAt).getFullYear();
  return `DDQ-${short}/${y}`;
}

function makeVersion(updatedAt: string) {
  const d = new Date(updatedAt);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function sectionLetter(n: number): string {
  // 1 → A, 2 → B, 27 → AA
  let s = "";
  let x = n;
  while (x > 0) {
    const r = (x - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    x = Math.floor((x - 1) / 26);
  }
  return s || "A";
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
  phases.forEach((p) => {
    if (!groups.has(p.number)) groups.set(p.number, []);
  });
  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([num, reqs], idx) => ({
      number: num,
      letter: sectionLetter(idx + 1),
      name: phaseMap.get(num)?.name ?? `Section ${sectionLetter(idx + 1)}`,
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
  const name = (data as { name?: string } | null)?.name ?? "Form";
  return {
    title: `${name} — Due Diligence Questionnaire`,
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
  const orgName = whiteLabel.brand_name || orgRecordName || "Issuing organisation";
  const logoUrl = whiteLabel.logo_url;

  const requirements = template.definition?.requirements ?? [];
  const phases = template.definition?.phases ?? [];
  const sections = groupByPhase(requirements, phases);
  const generatedDate = formatDateLong(new Date().toISOString());
  const formRef = makeFormRef(template.id, template.updated_at);
  const version = makeVersion(template.updated_at);

  return (
    <div className="print-root">
      <PrintToolbar templateName={template.name} />

      {/* Named strings drive the @page running header on every page */}
      <span className="pdf-string-title" aria-hidden style={{ display: "none" }}>
        {template.name}
      </span>
      <span className="pdf-string-org" aria-hidden style={{ display: "none" }}>
        {orgName}
      </span>
      <span className="pdf-string-date" aria-hidden style={{ display: "none" }}>
        Issued {generatedDate}
      </span>
      <span className="pdf-string-formref" aria-hidden style={{ display: "none" }}>
        {formRef}
      </span>

      <div className="pdf-doc">
        {/* ───────── COVER ───────── */}
        <section className="pdf-page pdf-cover" aria-label="Cover">
          <div className="pdf-cover-body">
            {/* Form reference */}
            <div className="pdf-cover-id-block">
              <div className="pdf-cover-issuer">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={`${orgName} logo`}
                    className="pdf-cover-issuer-logo"
                  />
                ) : null}
              </div>
              <div className="pdf-cover-formref">
                <strong>{formRef}</strong>
                Version {version}
                <br />
                Issued {generatedDate}
              </div>
            </div>

            {/* Title block */}
            <div className="pdf-cover-title-block">
              <div className="pdf-cover-eyebrow">
                Due Diligence Questionnaire
              </div>
              <h1 className="pdf-cover-title">{template.name}</h1>
              <p className="pdf-cover-subtitle">
                This form collects the information and documents required to
                complete due diligence on the respondent named below. Read the
                instructions before completing.
              </p>
            </div>

            {/* Respondent details — to be completed */}
            <div className="pdf-cover-respondent" aria-label="Respondent details">
              <div className="pdf-cover-respondent-col">
                <div className="pdf-cover-respondent-label">
                  Respondent (full legal name)
                </div>
                <div className="pdf-cover-respondent-line" aria-hidden />
              </div>
              <div className="pdf-cover-respondent-col">
                <div className="pdf-cover-respondent-label">Date received</div>
                <div className="pdf-cover-respondent-line" aria-hidden />
              </div>
            </div>
            <div className="pdf-cover-respondent">
              <div className="pdf-cover-respondent-col">
                <div className="pdf-cover-respondent-label">Position / title</div>
                <div className="pdf-cover-respondent-line" aria-hidden />
              </div>
              <div className="pdf-cover-respondent-col">
                <div className="pdf-cover-respondent-label">Company name</div>
                <div className="pdf-cover-respondent-line" aria-hidden />
              </div>
            </div>

            {/* Instructions — like a real form's "Before you begin" panel */}
            <div className="pdf-cover-instructions">
              <div className="pdf-cover-instructions-head">
                Instructions — please read before completing this form
              </div>
              <div className="pdf-cover-instructions-body">
                <ol>
                  <li>
                    Complete every section in order. Sections are lettered A
                    onwards; items within each section are numbered.
                  </li>
                  <li>
                    Items marked <strong style={{ color: "#b00020" }}>*</strong>{" "}
                    are mandatory. Items not marked are optional but encouraged.
                  </li>
                  <li>
                    Print clearly in BLOCK CAPITALS where a written response is
                    requested. Tick (✗) the appropriate box where options are
                    listed.
                  </li>
                  <li>
                    Where an attachment is requested, label the file with the
                    item number (e.g. {sections[0]?.letter ?? "A"}.1) and
                    return alongside this form.
                  </li>
                  <li>
                    Sign and date the declaration on the final page. An
                    unsigned form will not be accepted.
                  </li>
                  <li>
                    Return the completed form and all attachments to the issuer
                    via the secure portal link provided, or by post to the
                    address on record.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="pdf-cover-confidentiality">
            <span>Confidential</span>
            <span>For the named respondent only — do not redistribute</span>
          </div>
        </section>

        {/* ───────── CONTENTS ───────── */}
        {sections.length > 0 ? (
          <section className="pdf-page" aria-label="Contents">
            <div className="pdf-page-band pdf-page-band-print-hide">
              <span className="pdf-page-band-id">{formRef}</span>
              <span className="pdf-page-band-title">{template.name}</span>
              <span className="pdf-page-band-side">Contents</span>
            </div>
            <div className="pdf-page-body">
              <h2 className="pdf-contents-title">Contents</h2>
              <table className="pdf-contents-table">
                <thead>
                  <tr>
                    <th scope="col">Section</th>
                    <th scope="col">Title</th>
                    <th scope="col">Items</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map((s) => (
                    <tr key={s.number}>
                      <td>Section {s.letter}</td>
                      <td>{s.name}</td>
                      <td>
                        {s.requirements.length === 0
                          ? "—"
                          : s.requirements.length}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>Final</td>
                    <td>Declaration and signature</td>
                    <td>—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {/* ───────── SECTIONS ───────── */}
        {sections.length === 0 ? (
          <section className="pdf-page">
            <div className="pdf-page-body">
              <p className="pdf-resp-info">
                No items have been added to this form yet.
              </p>
            </div>
          </section>
        ) : (
          sections.map((section) => (
            <section
              key={section.number}
              className="pdf-page"
              aria-label={`Section ${section.letter}: ${section.name}`}
            >
              <div className="pdf-page-band pdf-page-band-print-hide">
                <span className="pdf-page-band-id">{formRef}</span>
                <span className="pdf-page-band-title">{template.name}</span>
                <span className="pdf-page-band-side">Section {section.letter}</span>
              </div>
              <div className="pdf-page-body">
                <div className="pdf-phase-banner">
                  <span>Section {section.letter}</span>
                  <span>{section.requirements.length} item{section.requirements.length === 1 ? "" : "s"}</span>
                </div>
                <h2 className="pdf-phase-title">{section.name}</h2>
                {section.deadline ? (
                  <div className="pdf-phase-deadline">
                    Return by {formatDateLong(section.deadline)}
                  </div>
                ) : null}
                <div className="pdf-phase-divider" aria-hidden />

                {section.requirements.length === 0 ? (
                  <p className="pdf-resp-info">
                    No items in this section.
                  </p>
                ) : (
                  <ol className="pdf-req-list">
                    {section.requirements.map((req, i) => {
                      if (req.type === "heading") {
                        return (
                          <li key={i} className="pdf-req-heading">
                            <div className="pdf-req-heading-eyebrow">
                              Subsection
                            </div>
                            <div className="pdf-req-heading-title">
                              {req.label || "(untitled subsection)"}
                            </div>
                          </li>
                        );
                      }
                      const itemRef = `${section.letter}.${i + 1}`;
                      return (
                        <li key={i} className="pdf-req">
                          <div className="pdf-req-num" aria-hidden>
                            {itemRef}
                          </div>
                          <div className="pdf-req-body">
                            <div className="pdf-req-label">
                              <span>{req.label || "(untitled)"}</span>
                              {req.is_required ? (
                                <span
                                  className="pdf-req-required"
                                  aria-label="Mandatory"
                                >
                                  Mandatory
                                </span>
                              ) : (
                                <span className="pdf-req-optional">
                                  Optional
                                </span>
                              )}
                            </div>
                            <div className="pdf-req-type">
                              {TYPE_LABEL[req.type]}
                            </div>
                            <ResponseBlock req={req} itemRef={itemRef} />
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>
            </section>
          ))
        )}

        {/* ───────── DECLARATION ───────── */}
        <section className="pdf-page" aria-label="Declaration">
          <div className="pdf-page-band pdf-page-band-print-hide">
            <span className="pdf-page-band-id">{formRef}</span>
            <span className="pdf-page-band-title">{template.name}</span>
            <span className="pdf-page-band-side">Declaration</span>
          </div>
          <div className="pdf-page-body">
            <h2 className="pdf-decl-title">Declaration</h2>
            <p className="pdf-decl-body">
              I, the undersigned respondent, declare that:
            </p>
            <ol className="pdf-decl-list">
              <li>
                The information provided in this form, and in all accompanying
                documents and attachments, is true, complete and accurate to
                the best of my knowledge and belief.
              </li>
              <li>
                I am duly authorised to provide this information and these
                documents on behalf of the respondent organisation named on
                the cover of this form.
              </li>
              <li>
                I understand that the information will be used by {orgName}
                {" "}for the purpose of conducting due diligence and will be
                treated as confidential.
              </li>
              <li>
                I understand that providing false or misleading information,
                or omitting material information, may result in the
                withdrawal of any offer and may give rise to legal liability.
              </li>
            </ol>

            <div className="pdf-decl-sig" aria-label="Signature block">
              <div className="pdf-decl-sig-row">
                <div className="pdf-decl-sig-cell">
                  <span className="pdf-decl-sig-cell-label">Signature</span>
                  <div className="pdf-decl-sig-line" aria-hidden />
                </div>
                <div className="pdf-decl-sig-cell">
                  <span className="pdf-decl-sig-cell-label">Print name</span>
                  <div className="pdf-decl-sig-line" aria-hidden />
                </div>
                <div className="pdf-decl-sig-cell">
                  <span className="pdf-decl-sig-cell-label">Date</span>
                  <div className="pdf-decl-sig-line" aria-hidden />
                </div>
              </div>
              <div className="pdf-decl-sig-row">
                <div className="pdf-decl-sig-cell">
                  <span className="pdf-decl-sig-cell-label">Position</span>
                  <div className="pdf-decl-sig-line" aria-hidden />
                </div>
                <div className="pdf-decl-sig-cell">
                  <span className="pdf-decl-sig-cell-label">
                    Company name
                  </span>
                  <div className="pdf-decl-sig-line" aria-hidden />
                </div>
                <div className="pdf-decl-sig-cell">
                  <span className="pdf-decl-sig-cell-label">Email</span>
                  <div className="pdf-decl-sig-line" aria-hidden />
                </div>
              </div>
            </div>

            <div className="pdf-decl-official" aria-label="For official use only">
              <div className="pdf-decl-official-head">
                For official use only — to be completed by {orgName}
              </div>
              <div className="pdf-decl-official-body">
                <div className="pdf-decl-official-cell">
                  <span className="pdf-decl-official-cell-label">
                    Received by
                  </span>
                  <span className="pdf-decl-official-cell-line" aria-hidden />
                </div>
                <div className="pdf-decl-official-cell">
                  <span className="pdf-decl-official-cell-label">
                    Date received
                  </span>
                  <span className="pdf-decl-official-cell-line" aria-hidden />
                </div>
                <div className="pdf-decl-official-cell">
                  <span className="pdf-decl-official-cell-label">
                    Reference
                  </span>
                  <span className="pdf-decl-official-cell-line" aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ResponseBlock({ req, itemRef }: { req: Requirement; itemRef: string }) {
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
          <div className="pdf-resp-text-line" aria-hidden />
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
              <span>Other (please specify):</span>
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
          <div className="pdf-resp-sig-cell">
            <div className="pdf-resp-sig-line" aria-hidden />
            <div className="pdf-resp-sig-caption">Signature</div>
          </div>
          <div className="pdf-resp-sig-cell">
            <div className="pdf-resp-sig-line" aria-hidden />
            <div className="pdf-resp-sig-caption">Print name</div>
          </div>
          <div className="pdf-resp-sig-cell">
            <div className="pdf-resp-sig-line" aria-hidden />
            <div className="pdf-resp-sig-caption">Date</div>
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
          <span>
            Attach the requested document and label with reference{" "}
            <strong>{itemRef}</strong>.
          </span>
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
          <div className="pdf-resp-payment-cell">
            <div className="pdf-resp-payment-label">Currency</div>
            <div className="pdf-resp-payment-value">
              {req.payment_currency ?? "—"}
            </div>
          </div>
          <div className="pdf-resp-payment-cell">
            <div className="pdf-resp-payment-label">Amount</div>
            <div className="pdf-resp-payment-value">{amount}</div>
          </div>
          <div className="pdf-resp-payment-cell">
            <div className="pdf-resp-payment-label">Description</div>
            <div className="pdf-resp-payment-value-soft">
              {req.payment_description || "—"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (req.type === "checkbox") {
    return (
      <div className="pdf-resp">
        <div className="pdf-resp-ack">
          <span className="pdf-checkbox" aria-hidden />
          <span>I acknowledge the above</span>
        </div>
      </div>
    );
  }

  return null;
}
