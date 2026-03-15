const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is ClientEnforce a good Dubsado alternative for agencies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — ClientEnforce is purpose-built for agencies and service teams who onboard clients repeatedly. Where Dubsado is a broad CRM covering invoicing, contracts, and client management, ClientEnforce focuses entirely on the onboarding phase: document collection, e-signatures, automated follow-ups, and audit-ready tracking. If your main pain is getting clients through intake cleanly, ClientEnforce is the more focused choice.",
      },
    },
    {
      "@type": "Question",
      name: "What are the main differences between Dubsado and ClientEnforce?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dubsado is an all-in-one CRM built primarily for solo freelancers — it handles invoicing, proposals, contracts, scheduling, and client management in one platform. ClientEnforce is not a CRM. It does one thing: client onboarding. It enforces completion of required steps, automates follow-ups, and maintains a full audit trail from signed agreement to kickoff-ready. Dubsado is broader. ClientEnforce is deeper on onboarding specifically.",
      },
    },
    {
      "@type": "Question",
      name: "Does ClientEnforce replace Dubsado completely?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not necessarily. If you rely on Dubsado for invoicing, payment processing, or proposals, you would keep using those features or use a separate tool for them. ClientEnforce handles the onboarding phase — from signed agreement to project kickoff. Many teams use ClientEnforce alongside their existing tools rather than replacing them entirely.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to switch from Dubsado to ClientEnforce?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most teams build their first onboarding template in under 20 minutes. There is no import needed from Dubsado — you simply build a template for each service line, add the required steps and documents, and send your first client portal link. The setup is deliberately simple.",
      },
    },
    {
      "@type": "Question",
      name: "Who should choose ClientEnforce over Dubsado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ClientEnforce is the better fit if: you run an agency or team of 5–50 people, you onboard 3 or more clients per month, your main pain is chasing clients for documents and information rather than managing invoices, or you need a compliance-ready audit trail of your onboarding process. Dubsado is the better fit if you are a solo freelancer who needs invoicing, proposals, and scheduling all in one place.",
      },
    },
  ],
};

export default function Head() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}
