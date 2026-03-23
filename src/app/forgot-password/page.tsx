import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { forgotPasswordAction } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildNoindexMetadata } from "@/lib/seo";

export const metadata: Metadata = buildNoindexMetadata({
  title: "Forgot Password | ClientEnforce",
  description: "Reset your ClientEnforce password and regain access to your onboarding workspace.",
  path: "/forgot-password",
});

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string; email?: string }>;
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
  const sent = sp?.sent === "1";
  const email = (() => {
    if (!sp?.email) return "";
    try {
      return decodeURIComponent(sp.email);
    } catch {
      return sp.email;
    }
  })();

  return (
    <main className="min-h-screen bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)]">
      <div className="mx-auto flex max-w-md flex-col px-6 py-16">
        <Link href="/" className="mb-8 flex w-fit items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white">
            <Image src="/C.png" alt="ClientEnforce logo" width={24} height={24} className="h-6 w-6 object-contain" />
          </div>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            ClientEnforce
          </span>
        </Link>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
          <h1 className="mb-4 text-lg font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Forgot password
          </h1>

          <div className="flex flex-col gap-4">
            {sent ? (
              <div className="rounded-[var(--radius-md)] border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                Password reset email sent{email ? ` to ${email}` : ""}. Check your inbox.
              </div>
            ) : null}

            {error ? (
              <div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
              Enter your email address and we'll send you a secure link to reset your password.
            </p>

            <form action={forgotPasswordAction} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue={email}
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-accent-hover)] active:scale-[0.98]"
              >
                Send reset link
              </button>
            </form>

            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-subtle)]"
            >
              Back to log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
