import { appOrigin } from "@/lib/app-url";

type EmailCta = {
  label: string;
  href: string;
};

export type ClientEnforceEmailOptions = {
  preheader?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  intro?: string;
  paragraphs?: string[];
  bullets?: string[];
  primaryCta?: EmailCta | null;
  secondaryCta?: EmailCta | null;
  footerNote?: string;
};

// Colours — kept as constants so the whole template stays in sync
const C = {
  accent: "#1B6EF3",
  accentHover: "#1558c0",
  white: "#ffffff",
  bgPage: "#f3f4f6",
  bgCard: "#ffffff",
  bgFooter: "#f9fafb",
  border: "#e5e7eb",
  textPrimary: "#111827",
  textSecondary: "#374151",
  textMuted: "#6b7280",
  textFooter: "#9ca3af",
} as const;

function escapeHtml(value: string) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function paragraphHtml(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, "<br/>");
}

function renderCta(cta: EmailCta, variant: "primary" | "secondary") {
  const bg = variant === "primary" ? C.accent : C.white;
  const fg = variant === "primary" ? C.white : C.textPrimary;
  const border = variant === "primary" ? `1px solid ${C.accent}` : `1px solid ${C.border}`;

  return `<a
    href="${escapeHtml(cta.href)}"
    style="
      display:inline-block;
      padding:13px 24px;
      border-radius:100px;
      background:${bg};
      color:${fg};
      border:${border};
      font-family:Arial,Helvetica,sans-serif;
      font-size:14px;
      font-weight:700;
      letter-spacing:0.01em;
      text-decoration:none;
      mso-padding-alt:0;
    "
  >${escapeHtml(cta.label)}</a>`;
}

function asPlainText(options: ClientEnforceEmailOptions) {
  const lines: string[] = [];

  lines.push(options.title);
  if (options.subtitle) lines.push(options.subtitle);
  if (options.intro) lines.push(options.intro);

  for (const p of options.paragraphs ?? []) {
    const trimmed = p.trim();
    if (trimmed) lines.push(trimmed);
  }

  if ((options.bullets ?? []).length > 0) {
    lines.push((options.bullets ?? []).map((item) => `- ${item}`).join("\n"));
  }

  if (options.primaryCta) {
    lines.push(`${options.primaryCta.label}: ${options.primaryCta.href}`);
  }

  if (options.secondaryCta) {
    lines.push(`${options.secondaryCta.label}: ${options.secondaryCta.href}`);
  }

  lines.push(options.footerNote || "Sent by ClientEnforce");

  return lines.join("\n\n");
}

export function renderClientEnforceEmail(options: ClientEnforceEmailOptions) {
  const origin = appOrigin().replace(/\/$/, "");
  const logoUrl = `${origin}/C.png`;
  const preheader = options.preheader || options.subtitle || options.title;
  const paragraphs = (options.paragraphs ?? []).map((p) => p.trim()).filter(Boolean);
  const bullets = (options.bullets ?? []).map((b) => b.trim()).filter(Boolean);

  const html = `<!doctype html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(options.title)}</title>
    <!--[if mso]>
    <noscript>
      <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
    </noscript>
    <![endif]-->
  </head>
  <body style="margin:0;padding:0;background:${C.bgPage};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

    <!-- Preheader (hidden) -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${C.bgPage};">
      ${escapeHtml(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>

    <!-- Outer wrapper -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bgPage};">
      <tr>
        <td align="center" style="padding:32px 12px;">

          <!-- Card -->
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
            style="width:100%;max-width:600px;border-collapse:separate;border-spacing:0;border:1px solid ${C.border};border-radius:16px;overflow:hidden;">

            <!-- ── Header ── -->
            <tr>
              <td style="padding:16px 24px;background:${C.bgCard};border-bottom:1px solid ${C.border};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img
                        src="${escapeHtml(logoUrl)}"
                        width="28"
                        height="28"
                        alt="ClientEnforce"
                        style="display:inline-block;vertical-align:middle;border:0;outline:none;text-decoration:none;border-radius:6px;border:1px solid ${C.border};"
                      />
                      <span style="display:inline-block;margin-left:10px;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;letter-spacing:0.01em;color:${C.textPrimary};">ClientEnforce</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ── Hero ── -->
            <tr>
              <td style="padding:32px 32px 24px 32px;background:${C.bgCard};">
                ${
                  options.eyebrow
                    ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;font-weight:700;letter-spacing:0.08em;color:${C.accent};text-transform:uppercase;margin-bottom:10px;">${escapeHtml(options.eyebrow)}</div>`
                    : ""
                }
                <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:1.2;font-weight:800;color:${C.textPrimary};">
                  ${escapeHtml(options.title)}
                </h1>
                ${
                  options.subtitle
                    ? `<p style="margin:12px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:${C.textSecondary};">${paragraphHtml(options.subtitle)}</p>`
                    : ""
                }
                ${
                  options.primaryCta
                    ? `<div style="margin-top:24px;">${renderCta(options.primaryCta, "primary")}</div>`
                    : ""
                }
              </td>
            </tr>

            <!-- ── Divider ── -->
            ${
              (options.intro || paragraphs.length > 0 || bullets.length > 0 || options.secondaryCta)
                ? `<tr>
                    <td style="padding:0 32px;">
                      <div style="height:1px;background:${C.border};font-size:0;line-height:0;">&nbsp;</div>
                    </td>
                  </tr>`
                : ""
            }

            <!-- ── Body ── -->
            ${
              (options.intro || paragraphs.length > 0 || bullets.length > 0 || options.secondaryCta)
                ? `<tr>
                    <td style="padding:24px 32px 32px 32px;background:${C.bgCard};">
                      ${
                        options.intro
                          ? `<p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${C.textSecondary};">${paragraphHtml(options.intro)}</p>`
                          : ""
                      }
                      ${paragraphs
                        .map(
                          (p) =>
                            `<p style="margin:0 0 14px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${C.textSecondary};">${paragraphHtml(p)}</p>`
                        )
                        .join("")}
                      ${
                        bullets.length > 0
                          ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 18px 0;">
                              ${bullets
                                .map(
                                  (b) => `<tr>
                                    <td style="width:16px;vertical-align:top;padding:5px 10px 5px 0;">
                                      <div style="width:6px;height:6px;border-radius:50%;background:${C.accent};margin-top:5px;"></div>
                                    </td>
                                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:${C.textSecondary};padding:4px 0;">
                                      ${paragraphHtml(b)}
                                    </td>
                                  </tr>`
                                )
                                .join("")}
                            </table>`
                          : ""
                      }
                      ${
                        options.secondaryCta
                          ? `<div style="margin-top:12px;">${renderCta(options.secondaryCta, "secondary")}</div>`
                          : ""
                      }
                    </td>
                  </tr>`
                : ""
            }

            <!-- ── Footer ── -->
            <tr>
              <td style="padding:16px 24px;background:${C.bgFooter};border-top:1px solid ${C.border};border-radius:0 0 16px 16px;">
                <p style="margin:0;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:${C.textFooter};">
                  ${escapeHtml(options.footerNote || "You received this email from ClientEnforce.")}
                </p>
                <p style="margin:6px 0 0 0;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:${C.textFooter};">
                  <a href="${escapeHtml(origin)}" style="color:${C.accent};text-decoration:none;">clientenforce.com</a>
                  &nbsp;&middot;&nbsp;
                  <a href="mailto:support@clientenforce.com" style="color:${C.accent};text-decoration:none;">support@clientenforce.com</a>
                </p>
              </td>
            </tr>

          </table>
          <!-- /Card -->

        </td>
      </tr>
    </table>

  </body>
</html>`.trim();

  return {
    html,
    text: asPlainText(options),
  };
}
