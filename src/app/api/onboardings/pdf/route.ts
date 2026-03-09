import { NextResponse } from "next/server";
import { requireProfile, requireRole } from "@/lib/rbac";
import { roleHasPermission } from "@/lib/permissions";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  exportUnavailableMessage,
  exportsEnabledForTier,
  permissionDenied,
  selectOrganizationTier,
} from "@/lib/plan-enforcement";

export const runtime = "nodejs";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

function safeFileName(input: string) {
  const s = (input || "onboarding")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return s || "onboarding";
}

function baseName(path: string) {
  const p = (path || "").trim();
  if (!p) return "";
  const parts = p.split("/");
  return parts[parts.length - 1] || p;
}

function parseStorageRef(ref: string): { bucket: string; path: string } | null {
  const s = (ref || "").trim();
  if (!s) return null;
  if (s.startsWith("http://") || s.startsWith("https://")) return null;
  // expect: bucket:path/to/object
  const idx = s.indexOf(":");
  if (idx <= 0) return null;
  const bucket = s.slice(0, idx).trim();
  const path = s.slice(idx + 1).trim().replace(/^\/+/, "");
  if (!bucket || !path) return null;
  return { bucket, path };
}

async function downloadRefAsBuffer(admin: any, ref: string): Promise<{ bytes: Buffer; contentType?: string; filename?: string } | null> {
  const s = (ref || "").trim();
  if (!s) return null;

  // URL
  if (s.startsWith("http://") || s.startsWith("https://")) {
    const res = await fetch(s);
    if (!res.ok) throw new Error(`Failed to fetch ${s}: ${res.status}`);
    const ab = await res.arrayBuffer();
    const ct = res.headers.get("content-type") || undefined;
    const fn = baseName(new URL(s).pathname);
    return { bytes: Buffer.from(ab), contentType: ct, filename: fn };
  }

  // storage ref: bucket:path
  const parsed = parseStorageRef(s);
  if (!parsed) return null;

  const { data, error } = await admin.storage.from(parsed.bucket).download(parsed.path);
  if (error) throw error;
  if (!data) return null;

  // supabase-js returns a Blob in most environments
  const ab = await (data as any).arrayBuffer();
  return {
    bytes: Buffer.from(ab),
    contentType: (data as any)?.type || undefined,
    filename: baseName(parsed.path),
  };
}

function isImageContentType(ct?: string) {
  const t = (ct || "").toLowerCase();
  return t.includes("image/png") || t.includes("image/jpeg") || t.includes("image/jpg");
}

function isImageFilename(name?: string) {
  const n = (name || "").toLowerCase();
  return n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg");
}

/**
 * Minimal PDF generator with:
 * - Helvetica + Helvetica-Bold
 * - Multi-page layout
 * - Optional embedded images (PNG/JPEG) rendered on their own pages
 * No external deps.
 */

type PdfImage = {
  name: string; // e.g. Im1
  width: number;
  height: number;
  data: Buffer;
  filter: "/DCTDecode" | "/FlateDecode";
};

type PdfPage = {
  content: string; // content stream
  images: PdfImage[];
};

function pdfNum(n: number) {
  // keep PDF decimals short
  return Number.isInteger(n) ? String(n) : n.toFixed(3).replace(/\.0+$/, "").replace(/\.$/, "");
}

function pdfEscape(s: string) {
  return (s || "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\r?\n/g, " ");
}

function wrapLine(text: string, max = 92) {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return [t];

  const out: string[] = [];
  let cur = "";
  for (const word of t.split(" ")) {
    if (!cur) {
      cur = word;
      continue;
    }
    if ((cur + " " + word).length > max) {
      out.push(cur);
      cur = word;
    } else {
      cur += " " + word;
    }
  }
  if (cur) out.push(cur);
  return out;
}

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toISOString().replace("T", " ").slice(0, 16);
}

// --- Image parsing helpers (PNG/JPEG) ---

function readU32BE(buf: Buffer, off: number) {
  return buf.readUInt32BE(off);
}

function paeth(a: number, b: number, c: number) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function unfilterPng(
  filtered: Buffer,
  width: number,
  height: number,
  bpp: number
): Buffer {
  // bpp = bytes per pixel
  const rowLen = width * bpp;
  const out = Buffer.alloc(height * rowLen);

  let inOff = 0;
  let outOff = 0;

  for (let y = 0; y < height; y++) {
    const filter = filtered[inOff];
    inOff += 1;

    for (let x = 0; x < rowLen; x++) {
      const raw = filtered[inOff++];
      const left = x >= bpp ? out[outOff + x - bpp] : 0;
      const up = y > 0 ? out[outOff - rowLen + x] : 0;
      const upLeft = y > 0 && x >= bpp ? out[outOff - rowLen + x - bpp] : 0;

      let val = 0;
      switch (filter) {
        case 0: // None
          val = raw;
          break;
        case 1: // Sub
          val = (raw + left) & 0xff;
          break;
        case 2: // Up
          val = (raw + up) & 0xff;
          break;
        case 3: // Average
          val = (raw + Math.floor((left + up) / 2)) & 0xff;
          break;
        case 4: // Paeth
          val = (raw + paeth(left, up, upLeft)) & 0xff;
          break;
        default:
          // Unknown filter → treat as None
          val = raw;
      }
      out[outOff + x] = val;
    }

    outOff += rowLen;
  }

  return out;
}

function parsePngToRgb(png: Buffer): { width: number; height: number; rgb: Buffer } {
  // Supports 8-bit RGB (color type 2) and RGBA (color type 6)
  // Converts RGBA → RGB with white background.
  const signature = png.subarray(0, 8);
  const sigOk = signature.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (!sigOk) throw new Error("Invalid PNG");

  let off = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatParts: Buffer[] = [];

  while (off + 8 <= png.length) {
    const len = readU32BE(png, off);
    const type = png.subarray(off + 4, off + 8).toString("ascii");
    const dataStart = off + 8;
    const dataEnd = dataStart + len;
    if (dataEnd + 4 > png.length) break;

    const data = png.subarray(dataStart, dataEnd);

    if (type === "IHDR") {
      width = readU32BE(data, 0);
      height = readU32BE(data, 4);
      bitDepth = data[8];
      colorType = data[9];
      if (bitDepth !== 8) throw new Error("PNG bit depth not supported");
      if (colorType !== 2 && colorType !== 6) throw new Error("PNG color type not supported");
    } else if (type === "IDAT") {
      idatParts.push(Buffer.from(data));
    } else if (type === "IEND") {
      break;
    }

    off = dataEnd + 4; // skip CRC
  }

  if (!width || !height) throw new Error("PNG missing IHDR");
  if (idatParts.length === 0) throw new Error("PNG missing IDAT");

  const zlib = require("zlib") as typeof import("zlib");
  const inflated = zlib.inflateSync(Buffer.concat(idatParts));

  const bpp = colorType === 6 ? 4 : 3;
  const raw = unfilterPng(inflated, width, height, bpp);

  if (colorType === 2) {
    return { width, height, rgb: raw };
  }

  // RGBA → RGB on white background
  const rgb = Buffer.alloc(width * height * 3);
  for (let i = 0, j = 0; i < raw.length; i += 4, j += 3) {
    const r = raw[i];
    const g = raw[i + 1];
    const b = raw[i + 2];
    const a = raw[i + 3] / 255;
    rgb[j] = Math.round(255 * (1 - a) + r * a);
    rgb[j + 1] = Math.round(255 * (1 - a) + g * a);
    rgb[j + 2] = Math.round(255 * (1 - a) + b * a);
  }
  return { width, height, rgb };
}

function parseJpegSize(jpg: Buffer): { width: number; height: number } {
  // Minimal JPEG SOF parser
  if (jpg.length < 4 || jpg[0] !== 0xff || jpg[1] !== 0xd8) throw new Error("Invalid JPEG");
  let i = 2;
  while (i + 3 < jpg.length) {
    if (jpg[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = jpg[i + 1];
    // Standalone markers
    if (marker === 0xd9 || marker === 0xda) break;
    const len = jpg.readUInt16BE(i + 2);
    if (len < 2) break;

    // SOF0/1/2 etc.
    if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
      const height = jpg.readUInt16BE(i + 5);
      const width = jpg.readUInt16BE(i + 7);
      return { width, height };
    }

    i += 2 + len;
  }
  throw new Error("JPEG size not found");
}

function isLikelyPng(buf: Buffer) {
  return buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
}

function isLikelyJpeg(buf: Buffer) {
  return buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8;
}

function makePdfImage(name: string, bytes: Buffer): PdfImage {
  // Prefer JPEG passthrough; otherwise PNG → RGB → Flate
  if (isLikelyJpeg(bytes)) {
    const { width, height } = parseJpegSize(bytes);
    return { name, width, height, data: bytes, filter: "/DCTDecode" };
  }

  if (isLikelyPng(bytes)) {
    const { width, height, rgb } = parsePngToRgb(bytes);
    const zlib = require("zlib") as typeof import("zlib");
    const deflated = zlib.deflateSync(rgb);
    return { name, width, height, data: deflated, filter: "/FlateDecode" };
  }

  throw new Error("Unsupported image format");
}

function buildPdf(pages: PdfPage[]) {
  const pageWidth = 612; // US Letter
  const pageHeight = 792;

  // PDF objects
  // 1: Catalog
  // 2: Pages
  // 3: Font Helvetica
  // 4: Font Helvetica-Bold
  // then: Page objects, Image objects, Content objects

  const objects: string[] = [];
  const offsets: number[] = [0]; // 1-based

  const pushObj = (obj: string) => {
    offsets.push(0);
    objects.push(obj);
  };

  pushObj(`<< /Type /Catalog /Pages 2 0 R >>`);
  pushObj(`<< /Type /Pages /Kids [] /Count 0 >>`);
  pushObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);
  pushObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`);

  const pageObjNums: number[] = [];
  const pageImageObjNums: number[][] = [];
  const contentObjNums: number[] = [];

  // Reserve page objects
  for (let i = 0; i < pages.length; i++) {
    pushObj(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents 0 0 R >>`);
    pageObjNums.push(4 + 1 + i); // objects are 0-based; obj #5 is objects[4]
    pageImageObjNums.push([]);
  }

  // Image objects
  const imageObjNumByName = new Map<string, number>();
  for (let p = 0; p < pages.length; p++) {
    for (const img of pages[p].images) {
      if (imageObjNumByName.has(img.name)) {
        pageImageObjNums[p].push(imageObjNumByName.get(img.name)!);
        continue;
      }
      const len = img.data.length;
      if (img.filter === "/DCTDecode") {
        // JPEG
        pushObj(
          `<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter ${img.filter} /Length ${len} >>\nstream\n${img.data.toString("binary")}\nendstream`
        );
      } else {
        // Flate RGB
        pushObj(
          `<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter ${img.filter} /Length ${len} >>\nstream\n${img.data.toString("binary")}\nendstream`
        );
      }
      const objNum = objects.length; // just pushed; obj number equals objects.length
      imageObjNumByName.set(img.name, objNum);
      pageImageObjNums[p].push(objNum);
    }
  }

  // Content stream objects
  for (let i = 0; i < pages.length; i++) {
    const stream = pages[i].content;
    const len = Buffer.byteLength(stream, "binary");
    pushObj(`<< /Length ${len} >>\nstream\n${stream}\nendstream`);
    contentObjNums.push(objects.length);
  }

  // Patch Pages kids/count
  const kids = pageObjNums.map((n) => `${n} 0 R`).join(" ");
  objects[1] = `<< /Type /Pages /Kids [ ${kids} ] /Count ${pageObjNums.length} >>`;

  // Patch page objects with resources + content refs
  for (let i = 0; i < pageObjNums.length; i++) {
    const contentNum = contentObjNums[i];

    // Build XObject resources for images used on this page
    const imgs = pages[i].images;
    const xobj = imgs.length
      ? ` /XObject << ${imgs.map((im) => `/${im.name} ${imageObjNumByName.get(im.name)} 0 R`).join(" ")} >>`
      : "";

    const idxInObjects = 4 + i; // obj #5 is objects[4]
    objects[idxInObjects] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >>${xobj} >> /Contents ${contentNum} 0 R >>`;
  }

  // Build final PDF with xref
  // IMPORTANT: when embedding binary streams, we must write using binary-safe encoding.
  // We'll build using latin1 (binary) for object streams; textual parts are ASCII-safe.

  let pdf = "%PDF-1.4\n";

  for (let i = 0; i < objects.length; i++) {
    const objNum = i + 1;
    offsets[objNum] = Buffer.byteLength(pdf, "binary");
    pdf += `${objNum} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = Buffer.byteLength(pdf, "binary");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += `0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    const off = offsets[i] || 0;
    pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "binary");
}

export async function GET(req: Request) {
  try {
    const role = await requireRole(["owner", "admin", "member"]);
    if (!roleHasPermission(role, "exports_read")) {
      return json(403, { error: permissionDenied("You do not have access to export onboarding evidence packs.") });
    }

    const profile = await requireProfile(); // must include org_id on your profile
    const orgId = (profile as any)?.org_id;
    if (!orgId) return json(403, { error: "Missing org context" });

    const admin = supabaseAdmin();
    const { tier, error: tierError } = await selectOrganizationTier(admin as any, orgId);
    if (tierError) return json(400, { error: tierError.message });
    if (!exportsEnabledForTier(tier)) return json(403, { error: exportUnavailableMessage() });

    const url = new URL(req.url);
    const onboardingId =
      url.searchParams.get("onboarding_id") ||
      url.searchParams.get("id") ||
      "";

    if (!onboardingId) return json(400, { error: "Missing onboarding_id" });

    // Onboarding
    const { data: onboarding, error: obErr } = await admin
      .from("onboardings")
      .select("*")
      .eq("org_id", orgId)
      .eq("id", onboardingId)
      .maybeSingle();

    if (obErr) throw obErr;
    if (!onboarding) return json(404, { error: "Onboarding not found" });

    // Client details
    // Prefer looking up the referenced client record, but fall back to any client fields stored on the onboarding.
    let clientLabel = "";

    // 1) Fallback from onboarding row (different schemas may store these)
    const obClientName =
      ((onboarding as any)?.client_name as string | undefined) ||
      ((onboarding as any)?.client_full_name as string | undefined) ||
      ((onboarding as any)?.client as string | undefined) ||
      "";
    const obClientEmail =
      ((onboarding as any)?.client_email as string | undefined) ||
      ((onboarding as any)?.email as string | undefined) ||
      "";

    // 2) If we have a client_id, try loading the client row. Use select('*') to avoid column mismatch.
    if ((onboarding as any)?.client_id) {
      const { data: client, error: clientErr } = await admin
        .from("clients")
        .select("*")
        .eq("org_id", orgId)
        .eq("id", (onboarding as any).client_id)
        .maybeSingle();

      if (clientErr) {
        // Don't fail PDF generation if optional client fields are missing
        console.warn("[pdf] failed to load client", clientErr.message);
      }

      const name =
        (client as any)?.full_name ||
        (client as any)?.name ||
        (client as any)?.client_name ||
        obClientName ||
        "";
      const email = (client as any)?.email || (client as any)?.client_email || obClientEmail || "";
      clientLabel = [name, email].filter(Boolean).join(" • ");
    } else {
      // No client_id on this onboarding; use whatever is available on the onboarding row.
      clientLabel = [obClientName, obClientEmail].filter(Boolean).join(" • ");
    }

    // Template name (optional)
    let templateName: string | null = null;
    if ((onboarding as any)?.template_id) {
      const { data: t } = await admin
        .from("templates")
        .select("name")
        .eq("org_id", orgId)
        .eq("id", (onboarding as any).template_id)
        .maybeSingle();
      templateName = (t as any)?.name ?? null;
    }

    // Requirements + answers snapshot
    const { data: reqs, error: reqErr } = await admin
      .from("onboarding_requirements")
      .select("*")
      .eq("onboarding_id", onboardingId)
      .order("sort_order", { ascending: true });

    if (reqErr) throw reqErr;

    // --- Build pages ---
    const pages: PdfPage[] = [];

    const headerTitle = "ClientEnforce";
    const docTitle = "Onboarding Export";

    const title = (onboarding as any)?.title || "Onboarding";

    // First page: summary + responses table (text)
    const summaryLines: string[] = [];
    summaryLines.push(`${headerTitle}    ${docTitle}`);
    summaryLines.push("");
    summaryLines.push(`Title: ${title}`);
    summaryLines.push(`Onboarding ID: ${onboarding.id}`);
    summaryLines.push(`Status: ${onboarding.status || "draft"}`);
    summaryLines.push(`Template: ${templateName || "Default"}`);
    summaryLines.push(`Client: ${clientLabel || "—"}`);
    summaryLines.push(`Created: ${formatDate(onboarding.created_at)}    Updated: ${formatDate(onboarding.updated_at)}`);
    summaryLines.push("");
    summaryLines.push("Responses");
    summaryLines.push("────────────────────────────────────────────────────────────");

    const list = Array.isArray(reqs) ? reqs : [];

    // Collect embedded images (each will get its own page)
    const embedded: Array<{ label: string; ref: string; kind: "file" | "signature" }>=[];

    if (list.length === 0) {
      summaryLines.push("No requirements found.");
    } else {
      for (const r of list) {
        const label = (r as any)?.label || "Untitled field";
        const required = (r as any)?.is_required ? " (Required)" : "";
        const kind = ((r as any)?.type || "field").toString();

        let answer = "—";
        const sig = ((r as any)?.signature_path || (r as any)?.signature_url || "").toString().trim();
        const fp = ((r as any)?.file_path || (r as any)?.file_url || "").toString().trim();

        const vt = (r as any)?.value_text ?? (r as any)?.answer_text ?? (r as any)?.response_text ?? (r as any)?.value ?? null;
        const vj = (r as any)?.value_json ?? (r as any)?.answer_json ?? (r as any)?.response_json ?? null;

        if (sig) {
          answer = `Signature: ${baseName(sig)}`;
          embedded.push({ label, ref: sig, kind: "signature" });
        } else if (fp) {
          answer = `File: ${baseName(fp)}`;
          embedded.push({ label, ref: fp, kind: "file" });
        } else if (typeof vt === "string" && vt.trim()) answer = vt.trim();
        else if (vt != null && typeof vt !== "string") answer = JSON.stringify(vt);
        else if (vj != null) answer = JSON.stringify(vj);

        summaryLines.push("");
        summaryLines.push(`${label}${required}`);
        summaryLines.push(`Type: ${kind}`);
        for (const l of wrapLine(`Answer: ${answer}`, 92)) summaryLines.push(l);

        const doneAt = (r as any)?.completed_at || (r as any)?.updated_at || null;
        summaryLines.push(`Completed: ${doneAt ? formatDate(doneAt) : "No"}`);
      }
    }

    // Build first page content stream with bold title
    {
      const left = 54;
      const top = 740;
      const fontSize = 11;
      const lineHeight = 14;

      const ops: string[] = [];
      ops.push("BT");
      // Header line in bold
      ops.push(`/F2 14 Tf`);
      ops.push(`${left} ${top} Td`);
      ops.push(`(${pdfEscape(`${headerTitle}    ${docTitle}`)}) Tj`);
      ops.push(`0 -${lineHeight * 2} Td`);

      // Body
      ops.push(`/F1 ${fontSize} Tf`);

      // Render remaining summary lines starting from index 2 (we already rendered the first line)
      const bodyLines = summaryLines.slice(2);
      for (let i = 0; i < bodyLines.length; i++) {
        ops.push(`(${pdfEscape(bodyLines[i] ?? "")}) Tj`);
        if (i !== bodyLines.length - 1) ops.push(`0 -${lineHeight} Td`);
      }
      ops.push("ET");

      pages.push({ content: ops.join("\n"), images: [] });
    }

    // Extra pages: embed each image (if the file is an image)
    // We intentionally do NOT fail the whole export if an image cannot be fetched/parsed.
    let imgCounter = 1;
    for (const item of embedded) {
      try {
        const dl = await downloadRefAsBuffer(admin, item.ref);
        if (!dl) continue;

        const looksLikeImage = isImageContentType(dl.contentType) || isImageFilename(dl.filename);
        if (!looksLikeImage) {
          // Not an image (e.g. PDF/doc) → add a text page noting the file name
          const left = 54;
          const top = 740;
          const lineHeight = 14;
          const ops: string[] = [];
          ops.push("BT");
          ops.push(`/F2 14 Tf`);
          ops.push(`${left} ${top} Td`);
          ops.push(`(${pdfEscape(item.label)}) Tj`);
          ops.push(`0 -${lineHeight * 2} Td`);
          ops.push(`/F1 11 Tf`);
          ops.push(`(${pdfEscape(item.kind === "signature" ? "Signature file" : "Uploaded file")}: ${pdfEscape(dl.filename || baseName(item.ref) || "file")}) Tj`);
          ops.push("ET");
          pages.push({ content: ops.join("\n"), images: [] });
          continue;
        }

        const name = `Im${imgCounter++}`;
        const img = makePdfImage(name, dl.bytes);

        // Layout: title + image scaled to fit
        const pageW = 612;
        const pageH = 792;
        const margin = 54;
        const top = 740;
        const captionH = 60;
        const availW = pageW - margin * 2;
        const availH = pageH - margin * 2 - captionH;

        const scale = Math.min(availW / img.width, availH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const x = margin + (availW - drawW) / 2;
        const y = margin; // bottom margin

        const ops: string[] = [];
        ops.push("BT");
        ops.push(`/F2 14 Tf`);
        ops.push(`${margin} ${top} Td`);
        ops.push(`(${pdfEscape(item.label)}) Tj`);
        ops.push(`0 -18 Td`);
        ops.push(`/F1 11 Tf`);
        ops.push(`(${pdfEscape(item.kind === "signature" ? "Signature" : "Upload")}: ${pdfEscape(dl.filename || baseName(item.ref) || "image")}) Tj`);
        ops.push("ET");

        // Draw image
        ops.push("q");
        ops.push(`${pdfNum(drawW)} 0 0 ${pdfNum(drawH)} ${pdfNum(x)} ${pdfNum(y)} cm`);
        ops.push(`/${img.name} Do`);
        ops.push("Q");

        pages.push({ content: ops.join("\n"), images: [img] });
      } catch (e: any) {
        console.warn("[pdf] failed to embed image", item.ref, e?.message || e);
      }
    }

    const pdf = buildPdf(pages);
    const fname = `${safeFileName(title)}.pdf`;

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${fname}"`,
        "cache-control": "no-store",
      },
    });
  } catch (e: any) {
    return json(500, { error: e?.message || "PDF export failed" });
  }
}
