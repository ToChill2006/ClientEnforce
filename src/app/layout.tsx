import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "ClientEnforce",
  description: "ClientEnforce",
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