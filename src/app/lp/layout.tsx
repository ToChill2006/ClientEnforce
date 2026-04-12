import { LPHeader, LPFooter } from "@/components/seo-lp/lp-shell";

export default function LPLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]">
      <LPHeader />
      <main>{children}</main>
      <LPFooter />
    </div>
  );
}
