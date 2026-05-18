import { ImageResponse } from "next/og";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { loadWhiteLabelForOrg } from "@/lib/white-label";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Icon({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const admin = supabaseAdmin();

  const { data: onboarding } = await admin
    .from("onboardings")
    .select("org_id")
    .eq("client_token", token)
    .maybeSingle();

  if (!onboarding?.org_id) {
    return new ImageResponse(
      <div style={{ width: 32, height: 32, background: "#6316FF", borderRadius: 6 }} />,
      { width: 32, height: 32 }
    );
  }

  const wl = await loadWhiteLabelForOrg(String(onboarding.org_id)).catch(() => null);
  const logoUrl = wl?.logo_url?.trim() || null;
  const accent = wl?.accent_color?.trim() || "#6316FF";

  if (!logoUrl) {
    return new ImageResponse(
      <div style={{ width: 32, height: 32, background: accent, borderRadius: 6 }} />,
      { width: 32, height: 32 }
    );
  }

  // Fetch logo and pass as data URL so Satori can render it
  try {
    const res = await fetch(logoUrl);
    const buf = await res.arrayBuffer();
    const mime = res.headers.get("content-type") || "image/png";
    const dataUrl = `data:${mime};base64,${Buffer.from(buf).toString("base64")}`;

    return new ImageResponse(
      // eslint-disable-next-line @next/next/no-img-element
      <img src={dataUrl} width={32} height={32} style={{ objectFit: "contain" }} />,
      { width: 32, height: 32 }
    );
  } catch {
    return new ImageResponse(
      <div style={{ width: 32, height: 32, background: accent, borderRadius: 6 }} />,
      { width: 32, height: 32 }
    );
  }
}
