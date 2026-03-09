import Link from "next/link";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signupAction } from "./action";

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
    <main className="min-h-[calc(100vh-0px)] bg-gradient-to-b from-white to-zinc-50">
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-6 py-16">
        {/* Brand */}
        <div className="mb-6 flex w-full items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white overflow-hidden">
            <Image
              src="/C.png"
              alt="ClientEnforce"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">ClientEnforce</div>
          </div>
        </div>

        <Card className="w-full shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="mb-2">Create account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <form action={signupAction} className="flex flex-col gap-4">
              {next ? <input type="hidden" name="next" value={next} /> : null}
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" name="fullName" placeholder="Jane Doe" required autoComplete="name" />
              </div>

              <div className="flex flex-col gap-2">
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

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
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

              <Button type="submit" className="mt-1">
                Create account
              </Button>

              <div className="flex items-center gap-2 py-1">
                <div className="h-px flex-1 bg-zinc-200" />
                <span className="text-xs text-zinc-500">or</span>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>

              <Link
                href={next ? `/login?next=${encodeURIComponent(next)}` : "/login?next=%2Fdashboard"}
                className="inline-flex h-10 w-full items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50"
              >
                Log in instead
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
