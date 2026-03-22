"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Menu } from "lucide-react";

const solutionsByUseCase = [
  { href: "/client-onboarding-software", label: "Client onboarding software" },
  { href: "/client-onboarding-automation", label: "Client onboarding automation" },
  { href: "/client-onboarding-checklist", label: "Client onboarding checklist" },
  { href: "/client-onboarding-tools", label: "Best client onboarding tools" },
] as const;

const solutionsWhoFor = [
  { href: "/onboarding-for-agencies", label: "For agencies" },
  { href: "/onboarding-for-accountants", label: "For accountants" },
  { href: "/onboarding-for-consultants", label: "For consultants" },
] as const;

const solutionsCompare = [
  { href: "/dubsado-alternative", label: "vs Dubsado" },
  { href: "/honeybook-alternative", label: "vs HoneyBook" },
] as const;

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2.5 text-[#F0F0F0] transition hover:bg-white/10 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[999] flex flex-col bg-[#0A0A0F]">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-4">
            <Link href="/" onClick={() => setOpen(false)} className="text-sm font-semibold text-[#F0F0F0]">
              ClientEnforce
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2.5 text-[#F0F0F0]"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#9A9AAF]">By use case</p>
              <div className="space-y-1">
                {solutionsByUseCase.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#F0F0F0] transition hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#9A9AAF]">Who it&apos;s for</p>
              <div className="space-y-1">
                {solutionsWhoFor.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#F0F0F0] transition hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#9A9AAF]">Compare</p>
              <div className="space-y-1">
                {solutionsCompare.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#F0F0F0] transition hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#9A9AAF]">Navigate</p>
              <div className="space-y-1">
                {[
                  { href: "/features", label: "Features" },
                  { href: "/pricing", label: "Pricing" },
                  { href: "/blog", label: "Blog" },
                  { href: "/contact", label: "Contact" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#F0F0F0] transition hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Bottom CTAs */}
          <div className="border-t border-white/[0.08] px-4 py-5 space-y-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-[#F0F0F0] transition hover:bg-white/5"
            >
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-[#00C2A8] px-4 py-3 text-center text-sm font-semibold text-[#0A0A0F] transition hover:bg-[#00d4b8]"
            >
              Start free trial
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
