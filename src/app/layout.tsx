import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast";
import Link from "next/link";
import Script from "next/script";

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
          <Script
            id="schema-org"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "@id": "https://clientenforce.com/#organization",
                    name: "ClientEnforce",
                    url: "https://clientenforce.com"
                  },
                  {
                    "@type": "WebSite",
                    "@id": "https://clientenforce.com/#website",
                    url: "https://clientenforce.com",
                    name: "ClientEnforce",
                    publisher: { "@id": "https://clientenforce.com/#organization" }
                  },
                  {
                    "@type": "SoftwareApplication",
                    "@id": "https://clientenforce.com/#software",
                    name: "ClientEnforce",
                    description:
                      "ClientEnforce turns messy client onboarding into a structured automated workflow with document uploads, signatures and compliance tracking.",
                    applicationCategory: "BusinessApplication",
                    operatingSystem: "Web",
                    url: "https://clientenforce.com",
                    publisher: { "@id": "https://clientenforce.com/#organization" }
                  }
                ]
              })
            }}
          />
          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-semibold">
                  CE
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">ClientEnforce</div>
                  <div className="text-xs text-zinc-500">Secure client onboarding</div>
                </div>
              </Link>

              <nav className="hidden items-center gap-6 md:flex">
                <Link href="/features" className="text-sm text-zinc-600 hover:text-zinc-900">
                  Features
                </Link>
                <Link href="/pricing" className="text-sm text-zinc-600 hover:text-zinc-900">
                  Pricing
                </Link>
                <Link href="/about" className="text-sm text-zinc-600 hover:text-zinc-900">
                  About
                </Link>
              </nav>

              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-transparent bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Create account
                </Link>
              </div>
            </div>
          </header>

          <div className="min-h-screen">{children}</div>

          <footer className="border-t border-zinc-200 bg-white">
            <div className="mx-auto max-w-6xl px-6 py-10">
              <div className="grid gap-8 md:grid-cols-4">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">ClientEnforce</div>
                  <p className="mt-2 text-sm text-zinc-600">
                    ClientEnforce is a client onboarding platform designed to turn messy
                    onboarding into a structured workflow with document uploads,
                    signatures, and real‑time progress tracking.
                  </p>
                </div>

                <div>
                  <div className="text-sm font-semibold text-zinc-900">Product</div>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                    <li><Link href="/features" className="hover:text-zinc-900">Features</Link></li>
                    <li><Link href="/pricing" className="hover:text-zinc-900">Pricing</Link></li>
                    <li><Link href="/about" className="hover:text-zinc-900">About</Link></li>
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-semibold text-zinc-900">Resources</div>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                    <li><Link href="/login" className="hover:text-zinc-900">Log in</Link></li>
                    <li><Link href="/signup" className="hover:text-zinc-900">Create account</Link></li>
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-semibold text-zinc-900">SEO</div>
                  <p className="mt-2 text-sm text-zinc-600">
                    Client onboarding software, secure client portals, document upload
                    systems, and automated onboarding workflows for modern service
                    businesses.
                  </p>
                </div>
              </div>

              <div className="mt-10 border-t border-zinc-200 pt-6 text-xs text-zinc-500 flex items-center justify-between">
                <span>© {new Date().getFullYear()} ClientEnforce</span>
                <span>Onboarding, enforced.</span>
              </div>
            </div>
          </footer>
        </ToastProvider>
      </body>
    </html>
  );
}