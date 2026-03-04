import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-semibold">
              CE
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">ClientEnforce</div>
              <div className="text-xs text-zinc-500">Secure client onboarding</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/features" className="text-sm text-zinc-600 hover:text-zinc-900">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-zinc-600 hover:text-zinc-900">
              Pricing
            </Link>
            <Link href="/about" className="text-sm text-zinc-600 hover:text-zinc-900">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-9 items-center justify-center rounded-md border border-transparent bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Create account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-zinc-900/5 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live progress • uploads • signatures
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                Client onboarding that actually finishes.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600 md:text-base">
                ClientEnforce turns messy email threads into a calm, structured workflow.
                Create a template once, send a secure link, and watch completion update live—
                with evidence (uploads + signatures) in one place.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-zinc-800"
                >
                  Start free
                </Link>
                <Link
                  href="/dashboard/onboardings"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  Go to dashboard
                </Link>
                <Link
                  href="/features"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                >
                  See what you get →
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
                <div className="rounded-xl border border-zinc-200 bg-white p-3">
                  <div className="text-xs text-zinc-500">Time to send</div>
                  <div className="mt-1 text-sm font-semibold">Under 2 min</div>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-3">
                  <div className="text-xs text-zinc-500">Fewer emails</div>
                  <div className="mt-1 text-sm font-semibold">-60%</div>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-white p-3">
                  <div className="text-xs text-zinc-500">Clear evidence</div>
                  <div className="mt-1 text-sm font-semibold">Uploads + sign</div>
                </div>
              </div>
            </div>

            {/* Mock UI */}
            <div className="relative">
              <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
                  <div className="text-sm font-semibold">Onboarding: Acme</div>
                  <div className="text-xs text-zinc-500">Secure link • Do not share</div>
                </div>
                <div className="p-4">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-zinc-500">Required completed</div>
                        <div className="mt-1 text-sm font-semibold">2 / 3</div>
                      </div>
                      <div className="text-sm font-semibold">67%</div>
                    </div>
                    <div className="mt-3 h-2 w-full rounded-full bg-white">
                      <div className="h-2 w-2/3 rounded-full bg-zinc-900" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-zinc-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">Company details</div>
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                          Completed
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-zinc-500">Name, address, primary contact</div>
                    </div>
                    <div className="rounded-xl border border-zinc-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">Upload insurance cert</div>
                        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                          Pending
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-zinc-500">PDF/JPG • stored securely</div>
                    </div>
                    <div className="rounded-xl border border-zinc-200 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">Sign engagement letter</div>
                        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                          Pending
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-zinc-500">One-click signature</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-10 -right-8 hidden rounded-2xl border border-zinc-200 bg-white p-4 text-xs text-zinc-600 shadow-sm md:block">
                <div className="text-sm font-semibold text-zinc-900">Progress updates live</div>
                <div className="mt-1">No refresh, no guessing, no chasing.</div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">Accounting & finance</span>
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">Agencies</span>
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">Legal</span>
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">Consulting</span>
            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">Operations</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold">Everything you need to run onboarding like a system.</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Templates, client links, evidence, and admin visibility—built to reduce work, not add it.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="text-sm font-semibold">Template-driven requirements</div>
              <div className="mt-2 text-sm text-zinc-600">
                Define what you need once. Reuse across clients. Sort, require, and keep it consistent.
              </div>
              <div className="mt-4 text-xs text-zinc-500">Text • Upload • Signature • Checkbox</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="text-sm font-semibold">Secure client portal links</div>
              <div className="mt-2 text-sm text-zinc-600">
                Send a unique link per onboarding. Clients can return anytime—answers save automatically.
              </div>
              <div className="mt-4 text-xs text-zinc-500">No account required for clients</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="text-sm font-semibold">Live progress + audit trail</div>
              <div className="mt-2 text-sm text-zinc-600">
                See completion across required items, who submitted what, and when. No chasing.
              </div>
              <div className="mt-4 text-xs text-zinc-500">Completed timestamps • Status</div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="text-sm font-semibold">Evidence in one place</div>
              <div className="mt-2 text-sm text-zinc-600">
                Uploads and signatures attach directly to requirements so nothing gets lost.
              </div>
              <div className="mt-4 text-xs text-zinc-500">Files stored securely</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="text-sm font-semibold">Team-ready operations</div>
              <div className="mt-2 text-sm text-zinc-600">
                Keep the workflow consistent across staff. Same template, same standards, every time.
              </div>
              <div className="mt-4 text-xs text-zinc-500">Roles & permissions (roadmap)</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="text-sm font-semibold">Fewer tabs, fewer tools</div>
              <div className="mt-2 text-sm text-zinc-600">
                ClientEnforce becomes your onboarding hub—templates, tracking, evidence, and outcomes.
              </div>
              <div className="mt-4 text-xs text-zinc-500">Built for operations</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold">How it works</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                A simple flow that clients understand—and admins can monitor.
              </p>

              <ol className="mt-6 space-y-4">
                <li className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                      1
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Create a template</div>
                      <div className="mt-1 text-sm text-zinc-600">
                        Define requirements: info to collect, files to upload, and what must be signed.
                      </div>
                    </div>
                  </div>
                </li>
                <li className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                      2
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Send a secure link</div>
                      <div className="mt-1 text-sm text-zinc-600">
                        Choose a template, connect a client, and share a single link that updates live.
                      </div>
                    </div>
                  </div>
                </li>
                <li className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                      3
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Track completion</div>
                      <div className="mt-1 text-sm text-zinc-600">
                        See progress and responses in the admin view. Lock when done. Export anytime.
                      </div>
                    </div>
                  </div>
                </li>
              </ol>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="text-sm font-semibold">What you’ll stop doing</div>
              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="text-sm font-semibold">Chasing missing items</div>
                  <div className="mt-1 text-sm text-zinc-600">The list is clear. Required items are obvious.</div>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="text-sm font-semibold">Hunting for attachments</div>
                  <div className="mt-1 text-sm text-zinc-600">Uploads and signatures attach to the exact requirement.</div>
                </div>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="text-sm font-semibold">Guessing what’s complete</div>
                  <div className="mt-1 text-sm text-zinc-600">Progress is calculated from completed required items.</div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4">
                <div className="text-xs text-zinc-500">Tip</div>
                <div className="mt-1 text-sm font-semibold">Make onboarding feel like a checklist, not a project.</div>
                <div className="mt-1 text-sm text-zinc-600">Clients finish faster when the path is obvious.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-semibold">Security by default</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Client links are unique and evidence stays attached to the onboarding record.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <div className="text-sm font-semibold">Secure links</div>
                  <div className="mt-2 text-sm text-zinc-600">Each onboarding has a unique tokenized portal URL.</div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <div className="text-sm font-semibold">Evidence tied to requirements</div>
                  <div className="mt-2 text-sm text-zinc-600">Uploads and signatures are stored on the requirement record.</div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <div className="text-sm font-semibold">Audit-friendly</div>
                  <div className="mt-2 text-sm text-zinc-600">Completed timestamps and admin visibility are built in.</div>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <div className="text-sm font-semibold">Least-privilege mindset</div>
                  <div className="mt-2 text-sm text-zinc-600">Designed to support role-based access as teams grow.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section id="pricing" className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 md:p-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-semibold">Start free. Upgrade when you’re ready.</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Build your templates, send onboardings, and get clean operational visibility. When you need more seats or advanced controls,
                  upgrade in Settings.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/signup"
                    className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-zinc-800"
                  >
                    Create account
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                  >
                    View pricing
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <div className="text-sm font-semibold">Free</div>
                  <div className="mt-1 text-sm text-zinc-600">Get set up and run your first onboardings.</div>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                    <li>• Templates</li>
                    <li>• Client portal links</li>
                    <li>• Evidence tracking</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <div className="text-sm font-semibold">Pro / Business</div>
                  <div className="mt-1 text-sm text-zinc-600">For teams that need scale and control.</div>
                  <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                    <li>• More seats</li>
                    <li>• Advanced controls</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between gap-6 border-t border-zinc-200 pt-8 text-xs text-zinc-500">
            <div>© {new Date().getFullYear()} ClientEnforce</div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hover:text-zinc-900">
                Log in
              </Link>
              <Link href="/signup" className="hover:text-zinc-900">
                Sign up
              </Link>
              <Link href="/features" className="hover:text-zinc-900">
                Features
              </Link>
              <Link href="/pricing" className="hover:text-zinc-900">
                Pricing
              </Link>
              <Link href="/about" className="hover:text-zinc-900">
                About
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}