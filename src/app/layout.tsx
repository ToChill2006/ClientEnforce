import "./globals.css";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import { ToastProvider } from "@/components/ui/toast";
import { JsonLd } from "@/components/marketing/public-shell";
import { canonicalSiteOrigin } from "@/lib/app-url";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo";
import { ThemeScript } from "@/components/theme/ThemeScript";

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
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] antialiased overflow-x-hidden selection:bg-[var(--color-accent-subtle)] selection:text-[var(--color-accent)]">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-Y1W99ZK32F" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Y1W99ZK32F');
        `}</Script>
        <ToastProvider>
          <div className="min-h-screen w-full">{children}</div>
          <JsonLd data={buildOrganizationSchema()} />
          <JsonLd data={buildWebsiteSchema()} />
          <Analytics />
          <SpeedInsights />
        </ToastProvider>
      </body>
    </html>
  );
}
