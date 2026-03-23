import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupAction } from "./action";
import { buildNoindexMetadata } from "@/lib/seo";

export const metadata: Metadata = buildNoindexMetadata({
  title: "Sign Up | ClientEnforce",
  description:
    "Create your ClientEnforce account to automate client onboarding, collect documents, and track onboarding progress in one portal.",
  path: "/signup",
});

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const sp = await searchParams;
  const error = (() => {
    if (!sp?.error) return null;
    try {
      return decodeURIComponent(sp.error);
    } catch {
      return sp.error;
    }
  })();
  const next = (() => {
    if (!sp?.next) return null;
    try {
      return decodeURIComponent(sp.next);
    } catch {
      return sp.next;
    }
  })();

  return (
    <main className="min-h-screen bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]">
      <div className="mx-auto flex w-full max-w-md flex-col px-6 py-16">
        <Link href="/" className="mb-8 flex w-fit items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white">
            <Image
              src="/C.png"
              alt="ClientEnforce"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            ClientEnforce
          </span>
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Create your ClientEnforce account
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Already have access?{" "}
            <Link
              href={next ? `/login?next=${encodeURIComponent(next)}` : "/login?next=%2Fdashboard"}
              className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
            >
              Log in to your workspace
            </Link>
            .
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
          <div className="flex flex-col gap-4">
            {error ? (
              <div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <form action={signupAction} className="flex flex-col gap-4">
              {next ? <input type="hidden" name="next" value={next} /> : null}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" name="fullName" placeholder="Jane Doe" required autoComplete="name" />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                />
              </div>

              <button
                type="submit"
                className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98]"
              >
                Create account
              </button>

              <div className="flex items-center gap-2 py-1">
                <div className="h-px flex-1 bg-[var(--color-border)]" />
                <span className="text-xs text-[var(--color-text-muted)]">or</span>
                <div className="h-px flex-1 bg-[var(--color-border)]" />
              </div>

              <Link
                href={next ? `/login?next=${encodeURIComponent(next)}` : "/login?next=%2Fdashboard"}
                className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
              >
                Log in instead
              </Link>
            </form>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-[var(--color-text-muted)]">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline hover:text-[var(--color-text-primary)]">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline hover:text-[var(--color-text-primary)]">Privacy Policy</Link>.
        </p>
      </div>
    </main>
  );
}
