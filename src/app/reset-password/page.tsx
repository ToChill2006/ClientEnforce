import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

async function resetPasswordAction(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!password || password !== confirmPassword) {
    redirect(
      "/reset-password?error=" +
        encodeURIComponent("Passwords do not match")
    );
  }

  const supabase = await supabaseServer();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirect(
      "/reset-password?error=" +
        encodeURIComponent(error.message || "Failed to update password")
    );
  }

  redirect("/login?reset=success");
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const error = sp?.error ? decodeURIComponent(sp.error) : null;

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex max-w-md flex-col px-6 py-14">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <img src="/C.png" alt="ClientEnforce logo" className="h-6 w-6 object-contain" />
          </div>
          <div className="text-sm font-semibold">ClientEnforce</div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="mb-2">Reset password</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <p className="text-sm leading-6 text-zinc-600">
              Choose a new password for your account.
            </p>

            <form action={resetPasswordAction} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <Button type="submit">Update password</Button>
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