import type { Metadata } from "next";
import { LPHeader, LPFooter } from "@/components/seo-lp/lp-shell";

// Paid landing pages — no organic role. Block from indexing but allow link equity to flow.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function LPLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]">
      <LPHeader />
      <main>{children}</main>
      <LPFooter />
    </div>
  );
}
