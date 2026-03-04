import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "ClientEnforce – Client Onboarding Automation",
  description:
    "ClientEnforce turns messy client onboarding into a structured, automated workflow with document uploads, signatures, and compliance tracking.",
  keywords: [
    "client onboarding software",
    "client portal",
    "document upload portal",
    "client onboarding automation",
    "client compliance workflow",
    "ClientEnforce",
  ],
  openGraph: {
    title: "ClientEnforce – Client Onboarding Automation",
    description:
      "Automate client onboarding with structured workflows, document uploads, and signatures.",
    url: "https://clientenforce.com",
    siteName: "ClientEnforce",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClientEnforce – Client Onboarding Automation",
    description:
      "Automate client onboarding with structured workflows, document uploads, and signatures.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full min-h-screen bg-zinc-50 text-zinc-900 antialiased">
        <ToastProvider>
          <div className="min-h-screen">{children}</div>
        </ToastProvider>
      </body>
    </html>
  );
}