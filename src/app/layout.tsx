import "./globals.css";
import type { Metadata } from "next";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ToastProvider } from "@/components/ui/toast";
import { JsonLd } from "@/components/marketing/public-shell";
import { canonicalSiteOrigin } from "@/lib/app-url";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(canonicalSiteOrigin()),
  title: {
    default: "ClientEnforce | Client onboarding software",
    template: "%s",
  },
  description: "Client onboarding software with templates, automation, and progress tracking.",
  openGraph: {
    title: "ClientEnforce | Client onboarding software",
    description:
      "Client onboarding software with templates, document collection, signatures, and automation.",
    type: "website",
    url: "/",
    siteName: "ClientEnforce",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClientEnforce | Client onboarding software",
    description:
      "Client onboarding software with templates, document collection, signatures, and automation.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/C.png", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full ${instrumentSerif.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen bg-zinc-50 text-zinc-950 antialiased overflow-x-hidden selection:bg-[#00C2A8] selection:text-[#0A0A0F]">
        <ToastProvider>
          <div className="min-h-screen w-full">{children}</div>
          <JsonLd data={buildOrganizationSchema()} />
          <JsonLd data={buildWebsiteSchema()} />
          <Analytics />
        </ToastProvider>
      </body>
    </html>
  );
}
