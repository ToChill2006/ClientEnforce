import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast";
import { appOrigin } from "@/lib/app-url";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(appOrigin()),
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
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-zinc-50 text-zinc-950 antialiased overflow-x-hidden selection:bg-black selection:text-white">
        <ToastProvider>
          <style>{`
            @keyframes pageFadeIn {
              from {
                opacity: 0;
                transform: translateY(4px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          <div className="min-h-screen w-full bg-gradient-to-b from-white via-zinc-50 to-zinc-100 [animation:pageFadeIn_.18s_ease-out]">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
