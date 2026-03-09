import Link from "next/link";
import Image from "next/image";
import { forgotPasswordAction } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex max-w-md flex-col px-6 py-14">
        <Link href="/" className="mb-6 flex w-fit items-center gap-3 rounded-md">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <Image src="/C.png" alt="ClientEnforce logo" width={24} height={24} className="h-6 w-6 object-contain" />
          </div>
          <div className="text-sm font-semibold">ClientEnforce</div>
        </Link>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="mb-2">Forgot password</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {sent ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                Password reset email sent{email ? ` to ${email}` : ""}. Check your inbox.
              </div>
            ) : null}

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <p className="text-sm leading-6 text-zinc-600">
              Enter your email address and we’ll send you a secure link to reset your password.
            </p>

            <form action={forgotPasswordAction} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
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

              <Button type="submit">Send reset link</Button>
            </form>

            <Link href="/login" className="w-full">
              <Button type="button" variant="secondary" className="w-full">
                Back to log in
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
