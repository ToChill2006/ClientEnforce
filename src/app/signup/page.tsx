import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Card, CardContent } from "@/components/ui/card";
import { AuthSubmitButton } from "@/components/auth/submit-button";
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

  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : "/login?next=%2Fdashboard";

  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-16">
        <Link href="/" className="mb-8 mx-auto flex w-fit items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)]">
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

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Start automating your client onboarding in minutes.
          </p>
        </div>

        <Card className="shadow-[var(--shadow-sm)]">
          <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
            {error ? (
              <div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
                {error}
              </div>
            ) : null}

            <form action={signupAction} className="flex flex-col gap-4">
              {next ? <input type="hidden" name="next" value={next} /> : null}

              <FormField label="Full name" htmlFor="fullName" required>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Jane Doe"
                  required
                  autoComplete="name"
                  className="text-base"
                  style={{ fontSize: "16px" }}
                />
              </FormField>

              <FormField label="Email" htmlFor="email" required>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="text-base"
                  style={{ fontSize: "16px" }}
                />
              </FormField>

              <FormField label="Password" htmlFor="password" required hint="Use at least 8 characters.">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  className="text-base"
                  style={{ fontSize: "16px" }}
                />
              </FormField>

              <AuthSubmitButton>Create account</AuthSubmitButton>
            </form>
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-sm text-[var(--color-text-secondary)]">
          Already have access?{" "}
          <Link
            href={loginHref}
            className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            Log in
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
          By creating an account you agree to our{" "}
          <Link href="/terms" className="underline hover:text-[var(--color-text-primary)]">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline hover:text-[var(--color-text-primary)]">Privacy Policy</Link>.
        </p>
      </div>
    </main>
  );
}
