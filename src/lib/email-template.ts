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
  const bg = variant === "primary" ? "#18181b" : "#ffffff";
  const fg = variant === "primary" ? "#ffffff" : "#18181b";
  const border = variant === "primary" ? "1px solid #18181b" : "1px solid #d4d4d8";

  return `
    <a
      href="${escapeHtml(cta.href)}"
      style="
        display:inline-block;
        padding:12px 20px;
        border-radius:8px;
        background:${bg};
        color:${fg};
        border:${border};
        font-family:Arial,Helvetica,sans-serif;
        font-size:14px;
        font-weight:700;
        letter-spacing:0.01em;
        text-decoration:none;
      "
    >
      ${escapeHtml(cta.label)}
    </a>
  `;
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
  const logoUrl = `${appOrigin().replace(/\/$/, "")}/C.png`;
  const preheader = options.preheader || options.subtitle || options.title;
  const paragraphs = (options.paragraphs ?? []).map((p) => p.trim()).filter(Boolean);
  const bullets = (options.bullets ?? []).map((b) => b.trim()).filter(Boolean);

  const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(options.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#fafafa;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
      ${escapeHtml(preheader)}
    </div>

    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0" style="background:#fafafa;">
      <tr>
        <td align="center" style="padding:24px 10px;">
          <table role="presentation" width="620" cellPadding="0" cellSpacing="0" border="0" style="width:100%;max-width:620px;border-collapse:separate;border-spacing:0;">
            <tr>
              <td style="padding:14px 20px;border:1px solid #18181b;border-bottom:none;border-radius:14px 14px 0 0;background:#18181b;">
                <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="${escapeHtml(logoUrl)}" width="24" height="24" alt="ClientEnforce" style="display:inline-block;vertical-align:middle;border:0;outline:none;text-decoration:none;border-radius:6px;" />
                      <span style="display:inline-block;margin-left:10px;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;letter-spacing:0.02em;color:#ffffff;">CLIENTENFORCE</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 26px;background:#f4f4f5;border-left:1px solid #e4e4e7;border-right:1px solid #e4e4e7;">
                ${
                  options.eyebrow
                    ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:16px;font-weight:700;letter-spacing:0.08em;color:#52525b;text-transform:uppercase;">${escapeHtml(options.eyebrow)}</div>`
                    : ""
                }
                <h1 style="margin:8px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:34px;line-height:1.12;font-weight:800;color:#18181b;">
                  ${escapeHtml(options.title)}
                </h1>
                ${
                  options.subtitle
                    ? `<p style="margin:12px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.45;color:#3f3f46;">${paragraphHtml(options.subtitle)}</p>`
                    : ""
                }
                ${
                  options.primaryCta
                    ? `<div style="margin-top:22px;">${renderCta(options.primaryCta, "primary")}</div>`
                    : ""
                }
              </td>
            </tr>

            <tr>
              <td style="padding:26px;border:1px solid #d4d4d8;border-top:none;border-radius:0 0 14px 14px;background:#ffffff;">
                ${
                  options.intro
                    ? `<p style="margin:0 0 14px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#27272a;">${paragraphHtml(options.intro)}</p>`
                    : ""
                }

                ${paragraphs
                  .map(
                    (p) => `
                      <p style="margin:0 0 14px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#3f3f46;">
                        ${paragraphHtml(p)}
                      </p>
                    `
                  )
                  .join("")}

                ${
                  bullets.length > 0
                    ? `
                      <ul style="margin:2px 0 16px 22px;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#3f3f46;">
                        ${bullets.map((b) => `<li style="margin:0 0 8px 0;">${paragraphHtml(b)}</li>`).join("")}
                      </ul>
                    `
                    : ""
                }

                ${
                  options.secondaryCta
                    ? `<div style="margin-top:8px;margin-bottom:8px;">${renderCta(options.secondaryCta, "secondary")}</div>`
                    : ""
                }
              </td>
            </tr>

            <tr>
              <td style="padding:14px 4px 0 4px;">
                <p style="margin:0;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#71717a;">
                  ${escapeHtml(options.footerNote || "Sent by ClientEnforce")}
                </p>
                <p style="margin:6px 0 0 0;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#71717a;">
                  <a href="${escapeHtml(appOrigin())}" style="color:#18181b;text-decoration:underline;">clientenforce.com</a>
                  &nbsp;|&nbsp;
                  <a href="mailto:support@clientenforce.com" style="color:#18181b;text-decoration:underline;">support@clientenforce.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();

  return {
    html,
    text: asPlainText(options),
  };
}
