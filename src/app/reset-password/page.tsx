import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Card, CardContent } from "@/components/ui/card";
import { AuthSubmitButton } from "@/components/auth/submit-button";
import { resetPasswordAction } from "./action";
import { buildNoindexMetadata } from "@/lib/seo";

export const metadata: Metadata = buildNoindexMetadata({
  title: "Reset Password | ClientEnforce",
  description: "Set a new ClientEnforce password to continue managing client onboarding workflows securely.",
  path: "/reset-password",
});

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
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

  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-16">
        <Link href="/" className="mb-8 mx-auto flex w-fit items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white">
            <Image src="/C.png" alt="ClientEnforce logo" width={24} height={24} className="h-6 w-6 object-contain" />
          </div>
          <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>ClientEnforce</span>
        </Link>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            Set a new password
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            Choose a strong password for your ClientEnforce account.
          </p>
        </div>

        <Card className="shadow-[var(--shadow-sm)]">
          <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
            {error ? (
              <div className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="alert">
                {error}
              </div>
            ) : null}

            <form action={resetPasswordAction} className="flex flex-col gap-4">
              <FormField label="New password" htmlFor="password" required>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="text-base"
                  style={{ fontSize: "16px" }}
                />
              </FormField>

              <FormField label="Confirm new password" htmlFor="confirmPassword" required>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="text-base"
                  style={{ fontSize: "16px" }}
                />
              </FormField>

              <AuthSubmitButton>Update password</AuthSubmitButton>
            </form>
          </CardContent>
        </Card>

        <p className="mt-5 text-center text-sm text-[var(--color-text-secondary)]">
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
