import "./globals.css";
import type { Metadata } from "next";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "ClientEnforce",
  description: "Client onboarding automation for modern teams.",
  icons: {
    icon: "/favicon.ico",
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
      </body>
    </html>
  );
}