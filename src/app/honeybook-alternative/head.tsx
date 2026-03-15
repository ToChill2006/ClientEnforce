const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is ClientEnforce a good HoneyBook alternative for agencies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — particularly for agencies and service teams that onboard clients repeatedly and need a structured, enforceable process. HoneyBook is designed as an all-in-one clientflow platform for small businesses and creatives. ClientEnforce focuses entirely on the onboarding phase — document collection, required step enforcement, automated reminders, and a full audit trail. For teams where chaotic client intake is the main pain, ClientEnforce is the more targeted solution.",
      },
    },
    {
      "@type": "Question",
      name: "What is the main difference between HoneyBook and ClientEnforce?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HoneyBook covers the full client journey for small businesses — leads, proposals, contracts, payments, and project management in one platform. ClientEnforce covers one phase only: client onboarding. It enforces completion of required intake steps, automates follow-up reminders, and maintains a timestamped audit trail from signed agreement to kickoff. HoneyBook is broader. ClientEnforce is deeper on onboarding specifically.",
      },
    },
    {
      "@type": "Question",
      name: "Can ClientEnforce work alongside HoneyBook?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Many teams use HoneyBook or similar tools for proposals, contracts, and invoicing, and use ClientEnforce specifically for the onboarding phase that follows. ClientEnforce handles the structured intake process — documents, signatures on onboarding forms, required information — that sits between signing a contract and starting a project.",
      },
    },
    {
      "@type": "Question",
      name: "Who is HoneyBook designed for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HoneyBook is designed primarily for independent business owners and creative professionals — photographers, event planners, designers, coaches. It excels at helping solo operators manage the full client lifecycle from lead to invoice in one place.",
      },
    },
    {
      "@type": "Question",
      name: "Who should choose ClientEnforce over HoneyBook?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ClientEnforce is the better fit for agencies and service teams of 5 or more people who run structured onboarding processes across multiple clients simultaneously, need a compliance-ready audit trail, or have found that their current onboarding relies too heavily on manual follow-up. If your pain is chaotic client intake rather than managing your full business workflow, ClientEnforce is more focused on that problem.",
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
