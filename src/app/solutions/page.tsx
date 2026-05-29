import type { Metadata } from "next";
import Link from "next/link";
import {
  Wrench,
  House,
  Stethoscope,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { MarketingShell } from "@/components/marketing-v2/Chrome";
import {
  Container,
  Section,
  Eyebrow,
  FinalCTA,
} from "@/components/marketing-v2/primitives";
import { canonicalSiteOrigin } from "@/lib/app-url";

const title = "Solutions | ClientEnforce";
const description =
  "Due diligence intake software for automotive, home services and healthcare roll-up acquirers. Pick your vertical to see how ClientEnforce fits your acquisition workflow.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/solutions" },
  openGraph: {
    title,
    description,
    url: `${canonicalSiteOrigin()}/solutions`,
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
};

const verticals = [
  {
    icon: Wrench,
    name: "Automotive roll-ups",
    body: "Tire shops, auto service, mechanical workshops. Structured intake from shop owners.",
    href: "/solutions/automotive",
  },
  {
    icon: House,
    name: "Home services roll-ups",
    body: "HVAC, plumbing, electrical, landscaping. One link per service business owner.",
    href: "/solutions/home-services",
  },
  {
    icon: Stethoscope,
    name: "Healthcare acquisitions",
    body: "Dental, veterinary and medical practice acquisitions. Built for practice owners.",
    href: "/solutions/healthcare",
  },
];

export default function SolutionsIndexPage() {
  return (
    <MarketingShell>
      <Section ariaLabel="Solutions hero" className="pt-20 sm:pt-24 lg:pt-28">
        <Container className="max-w-3xl text-center">
          <Eyebrow>Solutions</Eyebrow>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Due diligence intake, by vertical.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
            One platform, language tuned per industry. Pick your acquisition
            playbook below.
          </p>
        </Container>
      </Section>

      <Section ariaLabel="Verticals" className="pt-0">
        <Container>
          <ul className="grid gap-6 md:grid-cols-3">
            {verticals.map(({ icon: Icon, name, body, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 transition-shadow duration-150 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 sm:p-8"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-900 text-white">
                    <Icon size={24} aria-hidden />
                  </span>
                  <h2 className="mt-5 text-lg font-semibold text-slate-950 sm:text-xl">
                    {name}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-slate-700">
                    {body}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition-colors group-hover:text-sky-800">
                    See how it works{" "}
                    <ArrowRight size={16} weight="bold" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <FinalCTA />
    </MarketingShell>
  );
}
