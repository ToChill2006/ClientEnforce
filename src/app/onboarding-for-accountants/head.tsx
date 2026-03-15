const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does ClientEnforce support AML and KYC document collection?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ClientEnforce allows you to define required documents as part of your onboarding template - including proof of identity, proof of address, and any other KYC documents your firm requires. The system enforces collection of these documents before marking onboarding as complete.",
      },
    },
    {
      "@type": "Question",
      name: "Can we export an audit trail for each client?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every onboarding record includes a timestamped history of every document submitted, every step completed, and every signature collected. This can be exported as a PDF evidence pack at any time.",
      },
    },
    {
      "@type": "Question",
      name: "Does the client need to create an account to access the portal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Clients access their onboarding portal through a secure link. No account creation, no password, no friction for the client.",
      },
    },
    {
      "@type": "Question",
      name: "Can we use different onboarding templates for different client types?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Build separate templates for business clients versus individual clients, or for different service types such as audit, tax, or bookkeeping. Assign the correct template when a new client engages.",
      },
    },
    {
      "@type": "Question",
      name: "Is ClientEnforce suitable for sole practitioners as well as larger accounting firms?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Pricing is based on onboarding volume rather than team size. A sole practitioner onboarding a small number of clients per month can use ClientEnforce cost-effectively alongside larger multi-partner firms.",
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
