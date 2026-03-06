import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClientEnforce",
  description: "Client onboarding automation for modern teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-zinc-950">{children}</body>
    </html>
  );
}