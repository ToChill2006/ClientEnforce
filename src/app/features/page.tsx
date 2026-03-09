import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Features | ClientEnforce – Client Onboarding Automation",
  description:
    "Explore ClientEnforce features: client portal, document uploads, e-signatures, onboarding workflows, reminders, and audit-ready tracking for a smoother onboarding process.",
  path: "/features",
  keywords: [
    "client onboarding features",
    "client onboarding software",
    "client onboarding workflow",
  ],
  type: "website",
});

const features = [
  {
    title: "Client portal that keeps onboarding moving",
    desc: "Give clients a single link to upload files, complete steps, and sign. No chasing, no scattered email threads.",
  },
  {
    title: "Document uploads (clear, tracked, and organised)",
    desc: "Request the right files once, track what’s missing, and keep everything attached to the client record.",
  },
  {
    title: "Signatures that feel effortless",
    desc: "Capture signatures directly in the flow so clients can complete onboarding in one sitting.",
  },
  {
    title: "Step-by-step onboarding workflows",
    desc: "Turn your process into a checklist with required steps. Know exactly what’s done and what’s outstanding.",
  },
  {
    title: "Automated reminders",
    desc: "Nudge clients automatically when tasks are incomplete—without you manually following up every time.",
  },
  {
    title: "Audit-ready history",
    desc: "See who did what and when. Keep a clean timeline for compliance and internal accountability.",
  },
];

const faqs = [
  {
    q: "Is ClientEnforce a client onboarding tool or a client portal?",
    a: "Both. It’s an onboarding system with a client-facing portal that guides uploads, signatures, and task completion in one place.",
  },
  {
    q: "What types of businesses use ClientEnforce?",
    a: "Any service business that collects documents and approvals—agencies, consultants, accountants, property services, and operations teams.",
  },
  {
    q: "Can I customise the onboarding steps?",
    a: "Yes. You can structure your workflow so each client completes the same required steps, reducing missed items.",
  },
];

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-6">{children}</div>;
}

function Card({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{desc}</p>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      {/* Hero */}
      <section className="border-b border-zinc-200 bg-white">
        <Container>
          <div className="py-14">
            <p className="text-sm font-medium text-zinc-600">
              Features
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Client onboarding, enforced.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              ClientEnforce turns messy client onboarding into a structured workflow.
              Collect documents, capture signatures, and track every step in one portal—so nothing gets missed.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
              >
                Start free
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              >
                View pricing
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature grid */}
      <section>
        <Container>
          <div className="py-12">
            <h2 className="text-2xl font-semibold text-zinc-900">
              Everything you need to onboard clients faster
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
              Designed for real-world onboarding: uploads, signatures, steps, and tracking—without the clutter.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <Card key={f.title} title={f.title} desc={f.desc} />
              ))}
            </div>

            {/* SEO content block */}
            <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-zinc-900">
                Why teams choose ClientEnforce
              </h2>
              <div className="mt-4 grid gap-6 lg:grid-cols-3">
                <div>
                  <h3 className="font-semibold text-zinc-900">Less chasing</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Replace long email chains with a portal that shows what’s missing and what’s completed.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">More consistency</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Every client follows the same steps. Your process becomes repeatable and reliable.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">Audit-ready records</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Keep a clear history of uploads, signatures, and completion timestamps for compliance.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
                >
                  Try ClientEnforce
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  Learn more
                </Link>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-zinc-900">FAQ</h2>
              <div className="mt-6 grid gap-4">
                {faqs.map((item) => (
                  <div
                    key={item.q}
                    className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
                  >
                    <h3 className="font-semibold text-zinc-900">{item.q}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
