import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | ClientEnforce – Why we built it",
  description:
    "Learn why ClientEnforce exists: to replace chaotic onboarding with structured workflows, document uploads, and signatures—so teams onboard clients faster and with fewer mistakes.",
};

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-6">{children}</div>;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
      <div className="mt-3 text-sm leading-6 text-zinc-600">{children}</div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <section className="border-b border-zinc-200 bg-white">
        <Container>
          <div className="py-14">
            <p className="text-sm font-medium text-zinc-600">About</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Built to stop onboarding slipping through the cracks
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              ClientEnforce exists because client onboarding shouldn’t rely on memory, chasing emails,
              or hoping people upload the right files. We’re building a system that makes onboarding consistent,
              trackable, and easy for clients to finish.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/features"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              >
                Explore features
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
              >
                Start free
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="py-12 space-y-4">
            <SectionCard title="The problem">
              <p>
                Most onboarding breaks down in the same places: missing documents, unclear steps,
                signatures delayed, and no visibility on what’s outstanding.
                Teams lose hours to follow-ups, and clients get frustrated.
              </p>
            </SectionCard>

            <SectionCard title="Our approach">
              <p>
                We keep the flow simple: a client portal, a structured checklist, document uploads,
                and signatures—backed by an audit-friendly timeline.
                It’s onboarding designed around completion.
              </p>
            </SectionCard>

            <SectionCard title="Who it’s for">
              <ul className="mt-3 list-disc pl-5">
                <li>Agencies onboarding new retainers</li>
                <li>Consultants and coaches collecting intake and agreements</li>
                <li>Accountants requesting financial documents</li>
                <li>Operations teams standardising client handovers</li>
              </ul>
            </SectionCard>

            <SectionCard title="What’s next">
              <p>
                We’re focused on making ClientEnforce faster, clearer, and more automated—so onboarding
                becomes a predictable system, not an ongoing task.
              </p>
              <p className="mt-3">
                Want to see how it works?{" "}
                <Link href="/features" className="font-medium text-zinc-900 underline underline-offset-4">
                  View the features
                </Link>{" "}
                or{" "}
                <Link href="/pricing" className="font-medium text-zinc-900 underline underline-offset-4">
                  check pricing
                </Link>
                .
              </p>
            </SectionCard>
          </div>
        </Container>
      </section>
    </main>
  );
}