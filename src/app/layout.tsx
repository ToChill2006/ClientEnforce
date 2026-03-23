import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ToastProvider } from "@/components/ui/toast";
import { JsonLd } from "@/components/marketing/public-shell";
import { canonicalSiteOrigin } from "@/lib/app-url";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      className={`h-full ${plusJakartaSans.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-white text-[#0F1117] antialiased overflow-x-hidden selection:bg-[#EBF2FF] selection:text-[#0D3D99]">
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
