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
      <body className="min-h-screen bg-white text-zinc-950 antialiased overflow-x-hidden">
        <div className="min-h-screen w-full">
          {children}
        </div>
      </body>
    </html>
  );
}