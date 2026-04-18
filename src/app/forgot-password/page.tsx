import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { forgotPasswordAction } from "./actions";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Card, CardContent } from "@/components/ui/card";
import { AuthSubmitButton } from "@/components/auth/submit-button";
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
    <main className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-16">
        <Link href="/" className="mb-8 mx-auto flex w-fit items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-panel)]">
            <Image src="/C.png" alt="ClientEnforce logo" width={24} height={24} className="h-6 w-6 object-contain" />
          </div>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            ClientEnforce
          </span>
        </Link>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Enter your email and we&apos;ll send a secure reset link.
          </p>
        </div>

        <Card className="shadow-[var(--shadow-sm)]">
          <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
            {sent ? (
              <div className="rounded-[var(--radius-md)] border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                Password reset email sent{email ? ` to ${email}` : ""}. Check your inbox.
              </div>
            ) : null}

            {error ? (
              <div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
                {error}
              </div>
            ) : null}

            <form action={forgotPasswordAction} className="flex flex-col gap-4">
              <FormField label="Email" htmlFor="email" required>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue={email}
                  className="text-base"
                  style={{ fontSize: "16px" }}
                />
              </FormField>

              <AuthSubmitButton>Send reset link</AuthSubmitButton>
            </form>
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-sm text-[var(--color-text-secondary)]">
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            Back to log in
          </Link>
        </p>
      </div>
    </main>
  );
}
