export type VerticalFaq = {
  question: string;
  answer: string;
};

export type VerticalFeature = {
  icon: string;
  name: string;
  description: string;
};

export type ComparisonRow = {
  feature: string;
  clientenforce: string;
  competitor1: string;
  competitor2: string;
};

export type VerticalConfig = {
  slug: string;
  vertical: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  targetPersona: string;
  painPoints: { title: string; description: string }[];
  competitorsMentioned: [string, string];
  industrySpecificFeatures: VerticalFeature[];
  faqItems: VerticalFaq[];
  metaTitle: string;
  metaDescription: string;
  heroSubheadline: string;
  solutionParagraphs: string[];
  pullQuote: { quote: string; name: string; role: string; company: string };
  comparisonRows: ComparisonRow[];
  relatedVerticals: string[];
};

export type UseCaseConfig = {
  slug: string;
  parentVertical: string;
  primaryKeyword: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubheadline: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  faqItems: VerticalFaq[];
};

export const verticals: VerticalConfig[] = [
  {
    slug: "agencies",
    vertical: "Agencies",
    primaryKeyword: "client onboarding software for agencies",
    secondaryKeywords: [
      "agency client onboarding",
      "client portal for agencies",
      "onboarding checklist for agencies",
      "client intake software for agencies",
      "agency onboarding automation",
    ],
    targetPersona: "Marketing and creative agency account managers",
    painPoints: [
      {
        title: "Chaotic email threads replace a real process",
        description:
          "New client intake lives across a dozen email threads, shared Drives, and Slack messages. Nobody can tell at a glance which clients are ready to start.",
      },
      {
        title: "Clients ghost document requests for weeks",
        description:
          "You send the same asset request three times. The client eventually provides half of what is needed. Kickoff happens anyway — and delivery suffers for it.",
      },
      {
        title: "No visibility across multiple clients at once",
        description:
          "Account managers carry onboarding status in their heads. When someone is out, everything stalls. Leadership has no dashboard to see what is blocked.",
      },
    ],
    competitorsMentioned: ["HoneyBook", "Dubsado"],
    industrySpecificFeatures: [
      {
        icon: "layout",
        name: "Reusable onboarding templates",
        description:
          "Build one template per service line — retainer, project, campaign — and reuse it for every new client without rebuilding from scratch.",
      },
      {
        icon: "folder",
        name: "Structured asset collection",
        description:
          "Request brand files, logins, briefs, and approvals inside a single portal step rather than scattered across email attachments.",
      },
      {
        icon: "bell",
        name: "Automated overdue reminders",
        description:
          "Rule-based follow-ups go out when a step is overdue, so account managers stop chasing and start delivering.",
      },
      {
        icon: "grid",
        name: "Portfolio dashboard",
        description:
          "See every active client onboarding and its completion percentage from one view — ready for team standups and ops reviews.",
      },
      {
        icon: "pen",
        name: "E-signature on SOWs and contracts",
        description:
          "Capture signed statements of work and agreements inside the onboarding flow without switching to a separate tool.",
      },
      {
        icon: "shield",
        name: "Audit trail per client",
        description:
          "Every document submitted, every step completed, and every signature collected is recorded with a timestamp — ready for disputes or reviews.",
      },
    ],
    faqItems: [
      {
        question: "How does ClientEnforce differ from a general client portal for agencies?",
        answer:
          "General portals give clients a workspace but do not enforce completion. ClientEnforce marks specific steps as required — onboarding cannot be called complete until every asset, form, and signature is submitted. That enforcement is what stops kickoffs from happening before intake is actually finished.",
      },
      {
        question: "Can we run different onboarding templates for different service lines?",
        answer:
          "Yes. You can build a separate template for every service type — retainer, project, campaign, one-off work — and reuse each one for every new client in that category without rebuilding steps.",
      },
      {
        question: "How long does it take to set up the first template?",
        answer:
          "Most agency teams have their first template live in under 20 minutes. You map out the required steps, set up automated reminders, and send the first portal link in the same session.",
      },
      {
        question: "Does the client need to create an account or download anything?",
        answer:
          "No. Clients access their onboarding portal through a secure link. No account creation, no app download, no friction. They see exactly what is required and complete each step directly in the browser.",
      },
      {
        question: "Can we track multiple client onboardings at the same time?",
        answer:
          "Yes. The dashboard gives your team a real-time view of every active onboarding — what is complete, what is outstanding, and which clients need a nudge — across your entire client roster.",
      },
    ],
    metaTitle: "Agency Client Onboarding Software | ClientEnforce",
    metaDescription:
      "Client onboarding software for agencies that enforces every step — asset collection, e-signatures, automated reminders, and a full audit trail. Start free.",
    heroSubheadline:
      "Stop chasing clients for assets. Enforce onboarding steps so kickoffs happen on time.",
    solutionParagraphs: [
      "Agency onboarding fails not because account managers are disorganised, but because the tools they use were not built for enforcement. Email communicates; it does not enforce. A client can reply 'looks great' to an onboarding thread and still leave three required assets missing. ClientEnforce closes that gap.",
      "With ClientEnforce, you build one onboarding template per service line — retainer, project, or campaign — and every new client goes through the same structured portal. Required steps cannot be skipped. Automated reminders go out when something is overdue. Your team sees completion status across all active clients from a single dashboard.",
      "The result is an agency client onboarding process that runs without constant manual follow-up. Account managers focus on strategy, not chasing. Clients experience a professional, structured start rather than a fragmented email thread.",
    ],
    pullQuote: {
      // TODO: Replace with real customer quote
      quote:
        "We used to kick off projects with half the assets still missing. Now every client completes onboarding before we touch their account. It's changed how delivery starts.",
      name: "Sarah M.",
      role: "Head of Client Services",
      company: "Mid-size digital agency",
    },
    comparisonRows: [
      {
        feature: "Required step enforcement",
        clientenforce: "Yes — steps blocked until submitted",
        competitor1: "Partial — clients can skip steps",
        competitor2: "Partial — clients can skip steps",
      },
      {
        feature: "Automated overdue reminders",
        clientenforce: "Rule-based, configurable per step",
        competitor1: "Basic notifications only",
        competitor2: "Basic notifications only",
      },
      {
        feature: "Reusable onboarding templates",
        clientenforce: "Yes — per service line",
        competitor1: "Yes", // TODO: Verify HoneyBook
        competitor2: "Yes", // TODO: Verify Dubsado
      },
      {
        feature: "E-signatures",
        clientenforce: "Built-in",
        competitor1: "Built-in",
        competitor2: "Built-in",
      },
      {
        feature: "Multi-client dashboard",
        clientenforce: "Yes — completion % per client",
        competitor1: "Check vendor site", // TODO: Verify
        competitor2: "Check vendor site", // TODO: Verify
      },
      {
        feature: "Audit trail",
        clientenforce: "Full timestamped audit trail",
        competitor1: "Limited",
        competitor2: "Limited",
      },
      {
        feature: "Pricing model",
        clientenforce: "Flat plan",
        competitor1: "Per seat / volume",
        competitor2: "Per seat / volume",
      },
      {
        feature: "Setup time",
        clientenforce: "Under 20 minutes",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
    ],
    relatedVerticals: ["consulting", "saas", "coaches"],
  },

  {
    slug: "consulting",
    vertical: "Consulting",
    primaryKeyword: "client onboarding software for consultants",
    secondaryKeywords: [
      "consultant client onboarding",
      "consulting intake process",
      "onboarding checklist for consultants",
      "client portal for consultants",
      "consulting workflow automation",
    ],
    targetPersona: "Independent consultants and boutique consultancy principals",
    painPoints: [
      {
        title: "No repeatable onboarding process",
        description:
          "Each new engagement starts differently. Documents are requested ad hoc, agreements are signed informally, and kickoff readiness depends on whoever managed the last project.",
      },
      {
        title: "Scope creep starts at kickoff",
        description:
          "When intake is incomplete — missing a signed SOW, an unclear brief, or an unconfirmed project scope — scope creep begins before delivery does.",
      },
      {
        title: "Manual status updates eat billable hours",
        description:
          "Consultants spend hours each week tracking down outstanding items from clients that should have been collected during intake.",
      },
    ],
    competitorsMentioned: ["HoneyBook", "Dubsado"],
    industrySpecificFeatures: [
      {
        icon: "layout",
        name: "Repeatable intake templates",
        description:
          "Define your onboarding steps once per engagement type and run every new client through the same structured process.",
      },
      {
        icon: "pen",
        name: "SOW and retainer e-signatures",
        description:
          "Capture signed statements of work, retainer agreements, and NDAs inside the onboarding flow before a single hour is billed.",
      },
      {
        icon: "clipboard",
        name: "Project brief collection",
        description:
          "Gather goals, constraints, stakeholders, and success criteria through structured form fields — not email threads.",
      },
      {
        icon: "bell",
        name: "Automated follow-up rules",
        description:
          "Set reminders to fire automatically when a step is overdue. Stop writing follow-up emails manually.",
      },
      {
        icon: "shield",
        name: "Scope confirmation record",
        description:
          "Every submitted brief and signed agreement is stored with a timestamp — the definitive record of what was agreed at the start.",
      },
      {
        icon: "grid",
        name: "Multi-client visibility",
        description:
          "See every active onboarding and its status at a glance — useful when running multiple engagements simultaneously.",
      },
    ],
    faqItems: [
      {
        question: "How does ClientEnforce help prevent scope creep for consultants?",
        answer:
          "By capturing a signed statement of work, a structured project brief, and stakeholder confirmations before kickoff — all enforced as required steps — you establish a clear, agreed scope. That record is available if scope is challenged later.",
      },
      {
        question: "Can I build different templates for different types of consulting engagement?",
        answer:
          "Yes. Build one template for strategy engagements, another for implementation projects, another for retainers. Each template can have different required steps, documents, and signature requirements.",
      },
      {
        question: "Does this replace my existing contract or proposal tools?",
        answer:
          "No. ClientEnforce fits alongside your existing tools. It handles the structured intake workflow — collecting signed agreements, gathering project inputs, and confirming scope — before work begins.",
      },
      {
        question: "Will clients find the portal easy to use?",
        answer:
          "Yes. Clients access the portal through a secure link — no account creation required. They see a clear list of what is needed, complete each step at their own pace, and receive reminders if anything is outstanding.",
      },
      {
        question: "How quickly can I get my first template running?",
        answer:
          "Most consultants have a complete onboarding template live in under 20 minutes. You map out the required steps — brief form, SOW signature, document uploads — and the system handles follow-up from there.",
      },
    ],
    metaTitle: "Consultant Client Onboarding Software | ClientEnforce",
    metaDescription:
      "Client onboarding software for consultants that enforces scope sign-off, document collection, and e-signatures before work begins. Start free.",
    heroSubheadline:
      "Eliminate scope ambiguity at kickoff with a structured, enforced intake process.",
    solutionParagraphs: [
      "Consulting engagements go wrong when the intake phase is rushed. A missing signed brief, an informal agreement, or an assumed scope definition creates friction that compounds throughout delivery. ClientEnforce makes intake structured and enforced — so every client goes through the same process before work starts.",
      "You build one onboarding template per engagement type. Every required step — statement of work signature, project brief, stakeholder confirmation, access credentials — is listed clearly and cannot be marked complete until submitted. Automated reminders handle follow-up so you are not spending billable time chasing.",
      "The result is a consulting onboarding workflow that scales without scaling your administrative overhead. Less scope creep, cleaner kickoffs, and a documented record of what was agreed at the start.",
    ],
    pullQuote: {
      // TODO: Replace with real customer quote
      quote:
        "I used to start projects with a vague email chain as my only record of what we agreed. Now I have signed briefs and SOWs collected before I send a single invoice.",
      name: "James R.",
      role: "Independent strategy consultant",
      company: "Boutique consultancy",
    },
    comparisonRows: [
      {
        feature: "Required step enforcement",
        clientenforce: "Yes — steps blocked until submitted",
        competitor1: "Partial",
        competitor2: "Partial",
      },
      {
        feature: "E-signatures",
        clientenforce: "Built-in",
        competitor1: "Built-in",
        competitor2: "Built-in",
      },
      {
        feature: "Project brief collection",
        clientenforce: "Structured form fields",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Automated reminders",
        clientenforce: "Rule-based, per step",
        competitor1: "Basic notifications",
        competitor2: "Basic notifications",
      },
      {
        feature: "Audit trail",
        clientenforce: "Full timestamped record",
        competitor1: "Limited",
        competitor2: "Limited",
      },
      {
        feature: "Pricing model",
        clientenforce: "Flat plan",
        competitor1: "Per seat / volume",
        competitor2: "Per seat / volume",
      },
      {
        feature: "Client portal (no login)",
        clientenforce: "Yes — secure link access",
        competitor1: "Yes",
        competitor2: "Yes",
      },
      {
        feature: "Multiple templates",
        clientenforce: "Yes — unlimited",
        competitor1: "Yes",
        competitor2: "Yes",
      },
    ],
    relatedVerticals: ["agencies", "coaches", "financial-advisors"],
  },

  {
    slug: "accounting",
    vertical: "Accounting",
    primaryKeyword: "client onboarding software for accountants",
    secondaryKeywords: [
      "accounting firm client onboarding",
      "secure document collection for accountants",
      "engagement letter e-signature",
      "AML document collection software",
      "accounting client intake process",
    ],
    targetPersona: "CPAs, bookkeepers, and accounting firm partners",
    painPoints: [
      {
        title: "Documents scattered across email and attachments",
        description:
          "AML checks, proof of identity, and signed engagement letters live in email threads across multiple inboxes. There is no single auditable record.",
      },
      {
        title: "Required documents arrive late — or not at all",
        description:
          "AML and KYC documents are requested via email and sit untracked until someone notices they are missing — sometimes weeks later.",
      },
      {
        title: "No exportable audit trail for reviews",
        description:
          "When a file review comes up, answering 'did we receive this document?' requires searching through multiple inboxes and folders.",
      },
    ],
    competitorsMentioned: ["Karbon", "Ignition"],
    industrySpecificFeatures: [
      {
        icon: "shield",
        name: "Timestamped audit trail",
        description:
          "Every document received, every step completed, and every signature collected is recorded with a date, time, and submitter record — ready for review.",
      },
      {
        icon: "folder",
        name: "AML and KYC document collection",
        description:
          "Define required documents as onboarding steps — proof of identity, proof of address, source of funds — and enforce collection before the file is opened.",
      },
      {
        icon: "pen",
        name: "Engagement letter e-signatures",
        description:
          "Capture signed engagement letters inside the onboarding flow with a full record of when the signature was applied.",
      },
      {
        icon: "download",
        name: "Exportable evidence pack",
        description:
          "Export a PDF at any point showing the complete onboarding record — all documents, signatures, steps, and timestamps — ready for audit.",
      },
      {
        icon: "layout",
        name: "Templates per client type",
        description:
          "Build separate templates for business clients, individual clients, and different service lines such as tax, audit, and bookkeeping.",
      },
      {
        icon: "lock",
        name: "Secure document portal",
        description:
          "Clients upload sensitive documents directly into a secure portal — not via email attachments forwarded between inboxes.",
      },
    ],
    faqItems: [
      {
        question: "Does ClientEnforce support AML and KYC document collection?",
        answer:
          "ClientEnforce allows you to define required documents as onboarding steps — including proof of identity, proof of address, and any other KYC documents your firm requires. The system enforces collection of these documents before marking onboarding as complete.",
      },
      {
        question: "Can we export an audit trail for each client?",
        answer:
          "Yes. Every onboarding record includes a timestamped history of every document submitted, every step completed, and every signature collected. This can be exported as a PDF evidence pack at any time.",
      },
      {
        question: "Can we use different templates for different types of client?",
        answer:
          "Yes. Build separate templates for business clients versus individual clients, or for different service types such as audit, tax, or bookkeeping. Each template can have different required steps and documents.",
      },
      {
        question: "Is ClientEnforce a compliance platform?",
        answer:
          "No. ClientEnforce is onboarding workflow software — it supports your compliance process by enforcing completion, storing records, and providing an exportable audit trail. The specific compliance requirements for your firm should be defined by your compliance officer or professional adviser.",
      },
      {
        question: "Does the client need to create an account to submit documents?",
        answer:
          "No. Clients access their onboarding portal through a secure link. No account creation, no password, no friction. They see what is required and upload documents directly.",
      },
    ],
    metaTitle: "Client Onboarding Software for Accountants | ClientEnforce",
    metaDescription:
      "Client onboarding software for accountants with AML document collection, engagement letter e-signatures, and a full exportable audit trail. Start free.",
    heroSubheadline:
      "Replace scattered email intake with a compliant, auditable onboarding process.",
    solutionParagraphs: [
      "For accounting firms, client onboarding is not just a process — it is a compliance obligation. Documents must be collected correctly, stored securely, and traceable. An email thread is not an audit trail. ClientEnforce replaces the inbox with a structured portal that enforces every required step.",
      "You define your intake requirements once — AML checks, KYC documents, engagement letter signature, fee agreement — and every new client goes through the same enforced process. Documents are uploaded directly into a secure portal. Signatures are captured with a full timestamp. Nothing advances until every required item is submitted.",
      "When a file review arrives, you export the complete evidence pack in one click. No inbox searching. No reconstructing who sent what and when. Everything is already in one auditable record.",
    ],
    pullQuote: {
      // TODO: Replace with real customer quote
      quote:
        "We used to answer compliance questions by searching through three email accounts. Now every client has a complete, exportable record from day one.",
      name: "Claire T.",
      role: "Partner",
      company: "Mid-size accounting firm",
    },
    comparisonRows: [
      {
        feature: "Required step enforcement",
        clientenforce: "Yes — AML/KYC steps enforced",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "E-signatures",
        clientenforce: "Built-in with timestamp",
        competitor1: "Check vendor site",
        competitor2: "Built-in",
      },
      {
        feature: "Exportable audit trail",
        clientenforce: "Yes — PDF evidence pack",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Secure document portal",
        clientenforce: "Yes — no email attachments",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Templates per client type",
        clientenforce: "Yes — unlimited",
        competitor1: "Yes",
        competitor2: "Yes",
      },
      {
        feature: "Automated reminders",
        clientenforce: "Rule-based, per step",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Client portal (no login required)",
        clientenforce: "Yes",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Pricing model",
        clientenforce: "Flat plan",
        competitor1: "Per seat",
        competitor2: "Per seat / volume",
      },
    ],
    relatedVerticals: ["law-firms", "financial-advisors", "consulting"],
  },

  {
    slug: "law-firms",
    vertical: "Law Firms",
    primaryKeyword: "law firm client onboarding software",
    secondaryKeywords: [
      "legal client intake software",
      "law firm intake process",
      "retainer agreement e-signature",
      "conflict check workflow",
      "legal client portal",
    ],
    targetPersona: "Law firm partners and legal operations managers",
    painPoints: [
      {
        title: "Intake chaos slows matter opening",
        description:
          "New client information is collected informally — a phone call here, an email there — creating delays in matter opening and gaps in the client record.",
      },
      {
        title: "Retainer signatures and conflict checks handled manually",
        description:
          "Retainer agreements are emailed as PDF attachments. Conflict check confirmations are informal. Neither creates a reliable, auditable record.",
      },
      {
        title: "Sensitive information travels through uncontrolled email",
        description:
          "Clients send identity documents and financial records as email attachments. That information is untracked, insecure, and hard to retrieve later.",
      },
    ],
    competitorsMentioned: ["Clio", "MyCase"],
    industrySpecificFeatures: [
      {
        icon: "clipboard",
        name: "Structured matter intake forms",
        description:
          "Collect client name, matter type, related parties, and background information through structured fields — not a phone call or freeform email.",
      },
      {
        icon: "pen",
        name: "Retainer agreement e-signatures",
        description:
          "Capture signed retainer agreements inside the onboarding portal with a full timestamp and submitter record.",
      },
      {
        icon: "shield",
        name: "Conflict check confirmation step",
        description:
          "Include a conflict check confirmation as a required step that must be completed before the matter advances — creating a clear record.",
      },
      {
        icon: "lock",
        name: "Secure document portal",
        description:
          "Clients upload sensitive documents — ID, financials, supporting evidence — directly into a secure portal rather than via email.",
      },
      {
        icon: "download",
        name: "Exportable client record",
        description:
          "Export a complete, timestamped onboarding record at any point — useful for audits, disputes, or regulatory reviews.",
      },
      {
        icon: "layout",
        name: "Templates per practice area",
        description:
          "Build separate intake templates for different practice areas — litigation, commercial, family, conveyancing — each with the right required steps.",
      },
    ],
    faqItems: [
      {
        question: "How does ClientEnforce handle conflict check workflows for law firms?",
        answer:
          "You can include a conflict check confirmation as a required step in your onboarding template. The matter cannot advance until that step is completed and recorded — creating a timestamped audit trail for your compliance records.",
      },
      {
        question: "Is ClientEnforce a practice management system?",
        answer:
          "No. ClientEnforce focuses specifically on the intake and onboarding phase — collecting client information, capturing retainer signatures, and verifying identity before the matter opens. It works alongside your practice management system.",
      },
      {
        question: "Can we build different intake templates for different practice areas?",
        answer:
          "Yes. Build a separate template for each practice area — litigation, family, commercial, property. Each can have different required steps, documents, and signature requirements appropriate to that area of law.",
      },
      {
        question: "How do clients access the onboarding portal?",
        answer:
          "Clients receive a secure link. No account creation is required. They see exactly what is needed, complete each step, and receive reminders if anything is outstanding.",
      },
      {
        question: "What happens to documents submitted through the portal?",
        answer:
          "Every document submitted is stored with a timestamp, submitter record, and completion status. You can export the full onboarding record at any time as a PDF evidence pack.",
      },
    ],
    metaTitle: "Law Firm Client Onboarding Software | ClientEnforce",
    metaDescription:
      "Law firm client onboarding software for structured intake, retainer e-signatures, conflict check workflows, and a full audit trail. Start free.",
    heroSubheadline:
      "Structure client intake, capture retainer signatures, and open matters faster.",
    solutionParagraphs: [
      "Law firm intake fails when it relies on email and informal processes. A phone call to collect client details, a PDF retainer sent as an attachment, a conflict check acknowledged verbally — none of these create the kind of auditable record that protects the firm or the client.",
      "ClientEnforce replaces informal intake with a structured portal. You define required steps for each practice area — matter intake form, identity documents, retainer signature, conflict check confirmation — and every new client goes through the same enforced process before the matter advances.",
      "The result is faster matter opening, a complete client record from day one, and a timestamped audit trail that holds up if anything is challenged later.",
    ],
    pullQuote: {
      // TODO: Replace with real customer quote
      quote:
        "We open matters faster now because intake is complete before the file even hits our system. The audit trail alone has been worth it.",
      name: "Daniel F.",
      role: "Managing Partner",
      company: "Boutique commercial law firm",
    },
    comparisonRows: [
      {
        feature: "Structured matter intake forms",
        clientenforce: "Yes",
        competitor1: "Yes",
        competitor2: "Yes",
      },
      {
        feature: "Retainer e-signatures",
        clientenforce: "Built-in with timestamp",
        competitor1: "Built-in",
        competitor2: "Built-in",
      },
      {
        feature: "Conflict check workflow",
        clientenforce: "Yes — required step with record",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Required step enforcement",
        clientenforce: "Yes — matter blocked until complete",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Exportable audit trail",
        clientenforce: "Yes — PDF evidence pack",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Secure document portal",
        clientenforce: "Yes — no email attachments",
        competitor1: "Yes",
        competitor2: "Yes",
      },
      {
        feature: "Templates per practice area",
        clientenforce: "Yes — unlimited",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Client portal (no login required)",
        clientenforce: "Yes",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
    ],
    relatedVerticals: ["accounting", "financial-advisors", "consulting"],
  },

  {
    slug: "real-estate",
    vertical: "Real Estate",
    primaryKeyword: "real estate client onboarding software",
    secondaryKeywords: [
      "real estate client intake process",
      "property management onboarding software",
      "mortgage broker client onboarding",
      "real estate document collection",
      "client portal for real estate",
    ],
    targetPersona: "Real estate brokers, property managers, and mortgage brokers",
    painPoints: [
      {
        title: "Collecting ID and financial documents securely",
        description:
          "Clients send sensitive identity and financial documents as email attachments. That information is untracked and easy to lose or mishandle.",
      },
      {
        title: "Coordinating multiple parties on one transaction",
        description:
          "Buyers, sellers, solicitors, lenders, and surveyors all need information at different stages. Managing this through email creates version confusion and delays.",
      },
      {
        title: "Repetitive manual steps on every transaction",
        description:
          "The same intake steps are recreated from scratch for every new client. There is no standard template and no automated follow-up.",
      },
    ],
    competitorsMentioned: ["Dotloop", "DocuSign"],
    industrySpecificFeatures: [
      {
        icon: "lock",
        name: "Secure identity document collection",
        description:
          "Clients upload ID, proof of address, and financial documents into a secure portal — not via email attachment.",
      },
      {
        icon: "pen",
        name: "Agreement and disclosure e-signatures",
        description:
          "Capture signed buyer or tenant agreements, agency disclosures, and authority documents inside the onboarding flow.",
      },
      {
        icon: "users",
        name: "Multi-party step assignment",
        description:
          "Assign specific steps to different parties — buyer, seller, or third party — so everyone knows exactly what they need to provide.",
      },
      {
        icon: "layout",
        name: "Reusable transaction templates",
        description:
          "Build one template per transaction type — residential sale, rental, mortgage — and run every new instruction through the same process.",
      },
      {
        icon: "bell",
        name: "Automated completion reminders",
        description:
          "Reminders go out automatically when documents or signatures are outstanding — without manual chasing.",
      },
      {
        icon: "shield",
        name: "Audit trail per transaction",
        description:
          "Every document submitted and every step completed is recorded with a timestamp — a clear record for compliance and dispute resolution.",
      },
    ],
    faqItems: [
      {
        question: "How does ClientEnforce help with AML checks in real estate?",
        answer:
          "You can include AML document collection — proof of identity, proof of address, source of funds confirmation — as required steps in your onboarding template. The file cannot advance until every required document is submitted and recorded.",
      },
      {
        question: "Can different parties complete different steps in the same onboarding?",
        answer:
          "Yes. You can assign steps to different participants in a transaction — buyer, seller, guarantor — so each party sees and completes only the steps relevant to them.",
      },
      {
        question: "Does this replace our existing e-signature tools?",
        answer:
          "ClientEnforce has built-in e-signature functionality for agreement collection within the onboarding flow. If you have a separate e-signature tool, you can continue using it for other documents and use ClientEnforce for the full intake workflow.",
      },
      {
        question: "How quickly can we set up a template for a new transaction type?",
        answer:
          "Most teams build a complete transaction intake template in under 20 minutes. You define the required steps, set reminder rules, and start sending portal links to new clients in the same session.",
      },
      {
        question: "Is client information stored securely?",
        answer:
          "Yes. Documents are uploaded directly into a secure portal — not via email. Every submission is stored with a timestamp and access is controlled through unique client links.",
      },
    ],
    metaTitle: "Real Estate Client Onboarding Software | ClientEnforce",
    metaDescription:
      "Real estate client onboarding software for secure document collection, e-signatures, and multi-party coordination. Enforce every step. Start free.",
    heroSubheadline:
      "Collect identity documents, signatures, and disclosures in one secure portal — not email.",
    solutionParagraphs: [
      "Real estate transactions involve multiple parties, sensitive documents, and compliance obligations that cannot be managed through a shared email thread. ClientEnforce gives every transaction a structured, enforced intake process so nothing is missed and nothing travels through unsecured channels.",
      "You build one onboarding template per transaction type — residential sale, rental, mortgage — and every new instruction follows the same steps. Required documents are collected securely. Agreements are signed with a full timestamp. Automated reminders handle follow-up so your team focuses on transactions, not chasing paperwork.",
      "The result is a faster, more professional client experience at the start of every transaction — with a complete audit trail ready for compliance or dispute resolution.",
    ],
    pullQuote: {
      // TODO: Replace with real customer quote
      quote:
        "Our transaction fall-through rate dropped after we standardised intake. Now we catch missing documents in week one instead of week six.",
      name: "Rachel O.",
      role: "Operations Director",
      company: "Independent property agency",
    },
    comparisonRows: [
      {
        feature: "Required step enforcement",
        clientenforce: "Yes",
        competitor1: "Check vendor site",
        competitor2: "Limited — signature-focused",
      },
      {
        feature: "E-signatures",
        clientenforce: "Built-in",
        competitor1: "Built-in",
        competitor2: "Built-in",
      },
      {
        feature: "Secure document collection",
        clientenforce: "Yes — portal upload",
        competitor1: "Check vendor site",
        competitor2: "Limited",
      },
      {
        feature: "Automated reminders",
        clientenforce: "Rule-based, per step",
        competitor1: "Check vendor site",
        competitor2: "Limited",
      },
      {
        feature: "Audit trail",
        clientenforce: "Full timestamped record",
        competitor1: "Check vendor site",
        competitor2: "Signature records only",
      },
      {
        feature: "Reusable templates",
        clientenforce: "Yes — unlimited",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Client portal (no login)",
        clientenforce: "Yes",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Pricing model",
        clientenforce: "Flat plan",
        competitor1: "Per seat",
        competitor2: "Per envelope / seat",
      },
    ],
    relatedVerticals: ["law-firms", "accounting", "financial-advisors"],
  },

  {
    slug: "saas",
    vertical: "SaaS",
    primaryKeyword: "SaaS customer onboarding software",
    secondaryKeywords: [
      "automate SaaS customer onboarding",
      "customer onboarding automation",
      "SaaS onboarding workflow",
      "customer success onboarding tool",
      "time to value SaaS",
    ],
    targetPersona: "Customer success managers and SaaS founders",
    painPoints: [
      {
        title: "Long time-to-value from delayed setup",
        description:
          "Customers sign up and then stall. Setup steps are explained over email, completed piecemeal, and tracked nowhere. Time-to-value stretches for weeks.",
      },
      {
        title: "Customers do not complete the setup process",
        description:
          "Without an enforced checklist, customers skip configuration steps and then blame the product when it does not work as expected.",
      },
      {
        title: "No visibility across the onboarding pipeline",
        description:
          "Customer success managers carry onboarding status in their heads or in spreadsheets. There is no single dashboard showing who is blocked and what is outstanding.",
      },
    ],
    competitorsMentioned: ["Rocketlane", "GuideCX"],
    industrySpecificFeatures: [
      {
        icon: "grid",
        name: "Structured onboarding plans",
        description:
          "Give every new customer a clear, sequenced list of setup steps with due dates — so they know exactly what is needed and in what order.",
      },
      {
        icon: "bell",
        name: "Automated setup reminders",
        description:
          "Rule-based reminders go out when setup steps are overdue — reducing time-to-value without increasing customer success headcount.",
      },
      {
        icon: "layout",
        name: "Templates per customer tier",
        description:
          "Build separate onboarding templates for self-serve, growth, and enterprise customers — each with the right level of structured guidance.",
      },
      {
        icon: "shield",
        name: "Completion enforcement",
        description:
          "Mark configuration steps as required so customers cannot skip critical setup and then report that the product does not work.",
      },
      {
        icon: "bar-chart",
        name: "Onboarding pipeline dashboard",
        description:
          "See every customer's setup progress in real time — who is on track, who is stalled, and who needs a proactive outreach from your CS team.",
      },
      {
        icon: "folder",
        name: "Data collection and form steps",
        description:
          "Collect configuration details, integration credentials, and use-case information through structured steps — not email threads.",
      },
    ],
    faqItems: [
      {
        question: "How does ClientEnforce reduce time-to-value for SaaS products?",
        answer:
          "By giving every new customer a structured, enforced onboarding plan with clear steps and automated reminders, ClientEnforce reduces the delays caused by incomplete setup. Customers know exactly what is needed and receive automatic nudges when they fall behind.",
      },
      {
        question: "Can we build different onboarding flows for different customer tiers?",
        answer:
          "Yes. Build one template for self-serve customers, another for growth accounts, and a more detailed one for enterprise onboarding. Each template can have different steps, timelines, and required inputs.",
      },
      {
        question: "Does ClientEnforce integrate with our existing CS tools?",
        answer:
          "ClientEnforce focuses on the structured intake and onboarding workflow. It works alongside your CRM and CS platform. Check the integrations page for the current list of supported connections.",
      },
      {
        question: "What happens when a customer skips a required setup step?",
        answer:
          "Required steps cannot be bypassed. The customer receives automated reminders, and your CS dashboard shows the step as outstanding — so your team can intervene before it blocks value delivery.",
      },
      {
        question: "How much setup does ClientEnforce require on our side?",
        answer:
          "Most teams have their first customer onboarding template live in under 20 minutes. You map out the required steps, set reminder timing, and start sending onboarding links to new customers immediately.",
      },
    ],
    metaTitle: "SaaS Customer Onboarding Software | ClientEnforce",
    metaDescription:
      "SaaS customer onboarding software that enforces setup steps, automates reminders, and gives CS teams a live pipeline dashboard. Start free.",
    heroSubheadline:
      "Get customers to value faster by enforcing every setup step from day one.",
    solutionParagraphs: [
      "SaaS churn often starts during onboarding — not because the product is wrong, but because the customer never completed setup. When configuration steps live in email threads and onboarding guidance is delivered informally, customers stall. ClientEnforce turns onboarding into a structured, enforced process.",
      "You build one template per customer tier and every new customer gets a clear onboarding plan with sequenced steps, due dates, and automated reminders. Required configuration items cannot be skipped. Your CS dashboard shows the full onboarding pipeline — who is on track, who is stalled, and where to intervene.",
      "The result is shorter time-to-value, fewer support tickets from incomplete setup, and a customer success team that spends its time on relationships — not chasing missing information.",
    ],
    pullQuote: {
      // TODO: Replace with real customer quote
      quote:
        "We cut our average time-to-value by nearly a third after we stopped managing onboarding over email and started using a structured portal with enforced steps.",
      name: "Marcus L.",
      role: "Head of Customer Success",
      company: "B2B SaaS company",
    },
    comparisonRows: [
      {
        feature: "Required step enforcement",
        clientenforce: "Yes",
        competitor1: "Yes",
        competitor2: "Yes",
      },
      {
        feature: "Automated reminders",
        clientenforce: "Rule-based, per step",
        competitor1: "Yes",
        competitor2: "Yes",
      },
      {
        feature: "Onboarding pipeline dashboard",
        clientenforce: "Yes",
        competitor1: "Yes",
        competitor2: "Yes",
      },
      {
        feature: "Templates per customer tier",
        clientenforce: "Yes — unlimited",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "E-signatures",
        clientenforce: "Built-in",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Client portal (no login)",
        clientenforce: "Yes",
        competitor1: "Requires login",
        competitor2: "Requires login",
      },
      {
        feature: "Setup time",
        clientenforce: "Under 20 minutes",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Pricing model",
        clientenforce: "Flat plan",
        competitor1: "Per seat",
        competitor2: "Per seat",
      },
    ],
    relatedVerticals: ["agencies", "consulting", "it-msps"],
  },

  {
    slug: "financial-advisors",
    vertical: "Financial Advisors",
    primaryKeyword: "client onboarding software for financial advisors",
    secondaryKeywords: [
      "financial advisor client intake",
      "KYC document collection software",
      "wealth management client onboarding",
      "RIA onboarding workflow",
      "AML compliance onboarding",
    ],
    targetPersona: "RIAs, financial planners, and wealth managers",
    painPoints: [
      {
        title: "KYC and AML documents collected informally",
        description:
          "Required identity and suitability documents are requested via email, returned as attachments, and stored in a way that is hard to retrieve for reviews.",
      },
      {
        title: "Wet signatures replaced by informal email approvals",
        description:
          "Client agreements and suitability forms are signed informally — or not at all — creating compliance gaps from the first day of the relationship.",
      },
      {
        title: "No consistent intake process across advisors",
        description:
          "Each advisor runs onboarding differently. When a client is transferred or a new advisor joins, there is no standard record of what was collected at the start.",
      },
    ],
    competitorsMentioned: ["Orion", "Redtail"],
    industrySpecificFeatures: [
      {
        icon: "shield",
        name: "KYC and AML document enforcement",
        description:
          "Define required documents — proof of identity, proof of address, source of wealth — as mandatory steps that must be completed before the relationship opens.",
      },
      {
        icon: "pen",
        name: "Suitability and agreement e-signatures",
        description:
          "Capture signed investment agreements, suitability assessments, and risk disclosures inside the onboarding portal with a full timestamp.",
      },
      {
        icon: "download",
        name: "Exportable compliance record",
        description:
          "Export a complete, timestamped onboarding record for any client at any time — ready for regulator reviews or internal audits.",
      },
      {
        icon: "lock",
        name: "Secure document portal",
        description:
          "Clients upload sensitive financial and identity documents directly into a secure portal — not via email attachments.",
      },
      {
        icon: "layout",
        name: "Templates per service level",
        description:
          "Build separate intake templates for different client categories — advisory, discretionary, execution-only — each with appropriate required steps.",
      },
      {
        icon: "grid",
        name: "Advisor portfolio dashboard",
        description:
          "Supervisors and compliance officers can see onboarding completion status across all advisors and clients from a single view.",
      },
    ],
    faqItems: [
      {
        question: "How does ClientEnforce help financial advisors meet KYC obligations?",
        answer:
          "ClientEnforce allows you to define KYC documents — proof of identity, proof of address, source of wealth — as required onboarding steps. The client cannot be marked as onboarded until every required document is submitted, creating a clear and auditable compliance record.",
      },
      {
        question: "Is ClientEnforce a compliance platform for financial advisors?",
        answer:
          "No. ClientEnforce is onboarding workflow software that supports your compliance process by enforcing document collection and creating an audit trail. Your compliance officer should define the specific regulatory requirements for your firm.",
      },
      {
        question: "Can we export a compliance record for each client?",
        answer:
          "Yes. Every onboarding record includes a timestamped history of every document submitted, every step completed, and every signature collected. This can be exported at any time for regulatory reviews or client file audits.",
      },
      {
        question: "Can different advisors use different onboarding templates?",
        answer:
          "Yes. You can build separate templates per service type — advisory, discretionary, execution-only — or per client category. Each advisor can access the templates relevant to their client base.",
      },
      {
        question: "How do clients submit documents if they are not tech-savvy?",
        answer:
          "Clients access the portal through a secure link — no account creation or app download required. The interface is simple and step-by-step. They upload documents, complete forms, and sign agreements directly in the browser.",
      },
    ],
    metaTitle: "Client Onboarding Software for Financial Advisors | ClientEnforce",
    metaDescription:
      "Client onboarding software for financial advisors with KYC document enforcement, e-signatures, and exportable compliance records. Start free.",
    heroSubheadline:
      "Enforce KYC collection, capture signed agreements, and build a compliance record from day one.",
    solutionParagraphs: [
      "For financial advisors, the onboarding phase is where compliance obligations are established. KYC documents must be collected. Suitability assessments must be completed. Agreements must be signed. When these happen informally over email, the firm is exposed — and the client record is incomplete.",
      "ClientEnforce gives every new client relationship a structured, enforced intake process. You define the required steps — identity verification, risk assessment form, signed agreement, source of wealth declaration — and the portal enforces completion before the relationship advances. Everything is recorded with a full timestamp.",
      "When a regulator review or internal audit arrives, you export the complete onboarding record for any client in one click. No email searching. No reconstructing when things were received. Everything is already there.",
    ],
    pullQuote: {
      // TODO: Replace with real customer quote
      quote:
        "Our last audit went smoothly because every client file had a complete, timestamped onboarding record. That would not have been possible with our old email-based process.",
      name: "Andrew K.",
      role: "Principal, Registered Investment Adviser",
      company: "Independent RIA firm",
    },
    comparisonRows: [
      {
        feature: "KYC/AML document enforcement",
        clientenforce: "Yes — required steps",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "E-signatures with timestamp",
        clientenforce: "Built-in",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Exportable compliance record",
        clientenforce: "Yes — PDF evidence pack",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Secure document portal",
        clientenforce: "Yes — no email",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Templates per service level",
        clientenforce: "Yes — unlimited",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Automated reminders",
        clientenforce: "Rule-based, per step",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Client portal (no login)",
        clientenforce: "Yes",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Pricing model",
        clientenforce: "Flat plan",
        competitor1: "Per seat",
        competitor2: "Per seat",
      },
    ],
    relatedVerticals: ["accounting", "law-firms", "consulting"],
  },

  {
    slug: "coaches",
    vertical: "Coaches",
    primaryKeyword: "client onboarding software for coaches",
    secondaryKeywords: [
      "coaching client onboarding",
      "client intake software for coaches",
      "coach onboarding portal",
      "business coach client intake",
      "online coach client management",
    ],
    targetPersona: "Business coaches, life coaches, and online course creators",
    painPoints: [
      {
        title: "First impression undermined by scattered intake",
        description:
          "New clients receive a coaching agreement via email, an intake form via a separate link, and a welcome message in a third place. The fragmented experience sets the wrong tone.",
      },
      {
        title: "Manual intake forms slow down kickoff",
        description:
          "Intake questionnaires are sent as Google Forms or PDFs. Answers arrive in different formats. Summarising them before the first session takes significant time.",
      },
      {
        title: "Tools and documents scattered across multiple platforms",
        description:
          "Signed agreements live in DocuSign. Intake answers live in Google Forms. Payment confirmation lives in Stripe. There is no single client record.",
      },
    ],
    competitorsMentioned: ["HoneyBook", "Dubsado"],
    industrySpecificFeatures: [
      {
        icon: "pen",
        name: "Coaching agreement e-signatures",
        description:
          "Capture signed coaching agreements and terms inside the onboarding portal — before the first session begins.",
      },
      {
        icon: "clipboard",
        name: "Intake questionnaire forms",
        description:
          "Collect goals, challenges, background, and expectations through structured form fields — all in one place and easy to review before the first call.",
      },
      {
        icon: "layout",
        name: "Professional branded portal",
        description:
          "Every client starts their coaching journey in a clean, structured portal that reflects your professionalism — not a chaotic email thread.",
      },
      {
        icon: "bell",
        name: "Automated pre-session reminders",
        description:
          "Clients receive automatic reminders to complete outstanding intake steps before the first session — so you are never starting from zero.",
      },
      {
        icon: "folder",
        name: "Resource and materials delivery",
        description:
          "Include pre-work materials, reading, or welcome resources as onboarding steps so clients arrive prepared from day one.",
      },
      {
        icon: "shield",
        name: "Signed agreement record",
        description:
          "Every coaching agreement is stored with a timestamp and submitter record — a clear, retrievable record for both parties.",
      },
    ],
    faqItems: [
      {
        question: "Can I customise the onboarding portal to match my coaching brand?",
        answer:
          "Yes. The client portal uses your colours and name so the experience feels like a natural extension of your brand — not a third-party tool.",
      },
      {
        question: "Can I collect intake form answers before the first coaching session?",
        answer:
          "Yes. Include your intake questionnaire as a required step in the onboarding template. Clients must complete it before onboarding is marked as done — so you always have their answers before the first call.",
      },
      {
        question: "Does ClientEnforce work for group coaching programmes as well as one-to-one?",
        answer:
          "Yes. You can build separate templates for individual coaching and group programme onboarding. Each template can have different required steps appropriate to that format.",
      },
      {
        question: "Do clients need to download an app or create an account?",
        answer:
          "No. Clients access the onboarding portal through a secure link. No account creation, no app download. They complete their steps directly in the browser.",
      },
      {
        question: "How quickly can I set up my onboarding template?",
        answer:
          "Most coaches have a complete onboarding template — agreement signature, intake form, and welcome resources — live in under 20 minutes.",
      },
    ],
    metaTitle: "Client Onboarding Software for Coaches | ClientEnforce",
    metaDescription:
      "Client onboarding software for coaches with intake questionnaires, e-signatures, and a professional branded portal. Start free today.",
    heroSubheadline:
      "Give every new coaching client a structured, professional start — not a scattered email thread.",
    solutionParagraphs: [
      "The first impression a coaching client has of your practice is not your website — it is your onboarding process. Sending a coaching agreement over email, an intake form via a separate link, and a welcome pack via Dropbox sets a fragmented tone that undermines confidence before the first session.",
      "ClientEnforce gives every new client a single, structured portal where they sign their agreement, complete their intake questionnaire, and access any pre-work materials. Required steps cannot be skipped. You see exactly when each item is complete and receive a notification when a client is ready for their first session.",
      "The result is a professional, consistent onboarding experience that makes clients feel they made the right choice — and gives you the information you need before that first conversation begins.",
    ],
    pullQuote: {
      // TODO: Replace with real customer quote
      quote:
        "My clients started commenting on how professional the onboarding felt. It's the first time I've had everything — the agreement, the intake form, the prep materials — in one place before session one.",
      name: "Lisa H.",
      role: "Business and leadership coach",
      company: "Independent coaching practice",
    },
    comparisonRows: [
      {
        feature: "E-signatures",
        clientenforce: "Built-in",
        competitor1: "Built-in",
        competitor2: "Built-in",
      },
      {
        feature: "Intake questionnaire forms",
        clientenforce: "Structured, required steps",
        competitor1: "Yes",
        competitor2: "Yes",
      },
      {
        feature: "Required step enforcement",
        clientenforce: "Yes — nothing skipped",
        competitor1: "Partial",
        competitor2: "Partial",
      },
      {
        feature: "Branded client portal",
        clientenforce: "Yes",
        competitor1: "Yes",
        competitor2: "Yes",
      },
      {
        feature: "Automated reminders",
        clientenforce: "Rule-based, per step",
        competitor1: "Basic notifications",
        competitor2: "Basic notifications",
      },
      {
        feature: "Audit trail",
        clientenforce: "Full timestamped record",
        competitor1: "Limited",
        competitor2: "Limited",
      },
      {
        feature: "Setup time",
        clientenforce: "Under 20 minutes",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Pricing model",
        clientenforce: "Flat plan",
        competitor1: "Per seat / tiered",
        competitor2: "Per seat / tiered",
      },
    ],
    relatedVerticals: ["consulting", "agencies", "saas"],
  },

  {
    slug: "it-msps",
    vertical: "IT & MSPs",
    primaryKeyword: "MSP client onboarding software",
    secondaryKeywords: [
      "managed service provider onboarding",
      "MSP client intake process",
      "IT service provider onboarding software",
      "MSP onboarding checklist",
      "MSP client portal",
    ],
    targetPersona: "Managed service provider operations leads and vCIOs",
    painPoints: [
      {
        title: "Onboarding 10+ clients simultaneously with no visibility",
        description:
          "MSPs often have multiple client onboardings running in parallel. Without a dashboard, the team carries status in their heads and blockers surface late.",
      },
      {
        title: "Technical handoffs documented inconsistently",
        description:
          "Network credentials, admin access, asset inventories, and escalation contacts are collected differently each time — creating gaps that appear during the first incident.",
      },
      {
        title: "SLA documentation and agreement signing handled informally",
        description:
          "MSA and SLA documents are emailed as PDFs and signed informally. There is no central record of what was agreed at the start of the relationship.",
      },
    ],
    competitorsMentioned: ["ConnectWise", "HaloPSA"],
    industrySpecificFeatures: [
      {
        icon: "grid",
        name: "Multi-client onboarding dashboard",
        description:
          "Track every active client onboarding in one view — completion percentage, outstanding steps, and who is blocked — across your entire pipeline.",
      },
      {
        icon: "clipboard",
        name: "Technical handoff templates",
        description:
          "Standardise the collection of admin credentials, network documentation, asset inventories, and escalation contacts as required onboarding steps.",
      },
      {
        icon: "pen",
        name: "MSA and SLA e-signatures",
        description:
          "Capture signed MSAs, SLAs, and onboarding agreements inside the portal with a full timestamp before service delivery begins.",
      },
      {
        icon: "lock",
        name: "Secure credential and document collection",
        description:
          "Clients submit sensitive access credentials and technical documentation through a secure portal — not via email or ticketing threads.",
      },
      {
        icon: "layout",
        name: "Templates per client tier",
        description:
          "Build separate onboarding templates for SMB clients, mid-market accounts, and fully managed enterprise clients — each with appropriate required steps.",
      },
      {
        icon: "shield",
        name: "Audit trail per client",
        description:
          "Every step completed, every document submitted, and every signature captured is recorded — a clear record for contract disputes or service reviews.",
      },
    ],
    faqItems: [
      {
        question: "How does ClientEnforce help MSPs standardise technical handoffs?",
        answer:
          "You build a technical handoff template with required steps — admin credential collection, network documentation, asset inventory, escalation contact — and every new client goes through the same enforced process. Nothing is collected informally or inconsistently.",
      },
      {
        question: "Can we track multiple client onboardings at the same time?",
        answer:
          "Yes. The dashboard shows every active client onboarding — its completion percentage, which steps are outstanding, and which clients need attention — across your full pipeline. Useful for ops leads managing multiple engineers.",
      },
      {
        question: "Does ClientEnforce integrate with ConnectWise or HaloPSA?",
        answer:
          "ClientEnforce focuses on the structured onboarding phase. It works alongside your PSA tool. Check the integrations page for the current list of supported connections.",
      },
      {
        question: "Can different engineers run the same onboarding template for their clients?",
        answer:
          "Yes. Templates are shared across the team. Every engineer uses the same process, which means every client gets the same standard of intake — regardless of who handles the onboarding.",
      },
      {
        question: "How long does setup take for the first MSP onboarding template?",
        answer:
          "Most MSP teams have a complete technical onboarding template — credential collection, agreement signature, documentation steps — live in under 30 minutes.",
      },
    ],
    metaTitle: "MSP Client Onboarding Software | ClientEnforce",
    metaDescription:
      "MSP client onboarding software for technical handoffs, SLA e-signatures, and a multi-client dashboard. Standardise every new client. Start free.",
    heroSubheadline:
      "Standardise technical handoffs and collect every credential before service delivery begins.",
    solutionParagraphs: [
      "MSPs face a specific onboarding challenge: they are often running multiple client integrations simultaneously, each requiring technical documentation, signed agreements, and credential collection. When this happens ad hoc, gaps appear that surface during the first incident — not during onboarding.",
      "ClientEnforce gives every new client a structured onboarding plan with enforced steps. You define what must be collected — admin credentials, network documentation, signed MSA, asset inventory — and the portal enforces completion before service delivery begins. Your operations dashboard shows the full onboarding pipeline at a glance.",
      "The result is a consistent, repeatable technical onboarding process that protects your team when things go wrong and makes your service delivery look professional from the start.",
    ],
    pullQuote: {
      // TODO: Replace with real customer quote
      quote:
        "We used to discover missing admin credentials during the first incident. Now every client has a complete technical handoff record before we touch their environment.",
      name: "Pete R.",
      role: "Operations Lead",
      company: "Regional MSP",
    },
    comparisonRows: [
      {
        feature: "Required step enforcement",
        clientenforce: "Yes",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Multi-client dashboard",
        clientenforce: "Yes — completion % per client",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "E-signatures",
        clientenforce: "Built-in",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Secure credential collection",
        clientenforce: "Yes — portal upload",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Templates per client tier",
        clientenforce: "Yes — unlimited",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Audit trail",
        clientenforce: "Full timestamped record",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Automated reminders",
        clientenforce: "Rule-based, per step",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Pricing model",
        clientenforce: "Flat plan",
        competitor1: "Per seat",
        competitor2: "Per seat",
      },
    ],
    relatedVerticals: ["saas", "agencies", "consulting"],
  },

  {
    slug: "architects-engineers",
    vertical: "Architecture & Engineering",
    primaryKeyword: "client onboarding software for architects",
    secondaryKeywords: [
      "architecture firm client intake",
      "engineering firm client onboarding",
      "project brief collection software",
      "client portal for architects",
      "design firm client onboarding",
    ],
    targetPersona: "Architecture firm project managers and engineering firm principals",
    painPoints: [
      {
        title: "Project brief collection is slow and inconsistent",
        description:
          "Client briefs arrive via email in various formats. Key constraints, site details, and programme requirements are scattered across multiple threads and attachments.",
      },
      {
        title: "Contract execution delays kickoff",
        description:
          "Appointment letters and fee agreements are exchanged informally. Signed documents arrive late — or are never formally confirmed — pushing kickoff back by weeks.",
      },
      {
        title: "Kickoff scheduling bottlenecks caused by incomplete intake",
        description:
          "Key information — site access, planning history, stakeholder contacts — is still outstanding when the kickoff meeting is already scheduled.",
      },
    ],
    competitorsMentioned: ["PlanGrid", "Buildertrend"],
    industrySpecificFeatures: [
      {
        icon: "clipboard",
        name: "Structured project brief collection",
        description:
          "Gather site details, programme requirements, budget constraints, planning history, and stakeholder contacts through structured form fields — not email.",
      },
      {
        icon: "pen",
        name: "Appointment letter and fee agreement signing",
        description:
          "Capture signed appointment letters and fee agreements inside the onboarding portal before design work begins.",
      },
      {
        icon: "layout",
        name: "Phase-specific templates",
        description:
          "Build separate intake templates for feasibility projects, full design services, and framework appointments — each with appropriate required steps.",
      },
      {
        icon: "folder",
        name: "Site document collection",
        description:
          "Request site surveys, planning documents, existing drawings, and condition reports as required onboarding steps — all stored in one place.",
      },
      {
        icon: "bell",
        name: "Automated document reminders",
        description:
          "Reminders go out when outstanding documents or signed agreements are overdue — without requiring manual chasing from the project manager.",
      },
      {
        icon: "shield",
        name: "Client instruction record",
        description:
          "Every signed document, submitted brief, and completed step is stored with a timestamp — a clear record of client instruction from the start.",
      },
    ],
    faqItems: [
      {
        question: "How does ClientEnforce help architecture firms collect project briefs?",
        answer:
          "You build a project brief collection template with structured fields for site details, programme requirements, budget constraints, and stakeholder contacts. Clients complete the brief through the portal — so answers arrive in a consistent format, ready for the design team to use.",
      },
      {
        question: "Can we collect signed appointment letters and fee agreements through the portal?",
        answer:
          "Yes. Appointment letters, fee agreements, and professional service contracts can be included as required signing steps in the onboarding portal — with a full timestamp and submitter record.",
      },
      {
        question: "Can we build different templates for different project types?",
        answer:
          "Yes. Build separate templates for residential projects, commercial appointments, framework projects, or feasibility studies. Each can have different required steps and documents.",
      },
      {
        question: "How do clients access the portal?",
        answer:
          "Clients access the portal through a secure link — no account creation required. They see exactly what is needed, complete each step at their own pace, and receive automatic reminders if anything is outstanding.",
      },
      {
        question: "Does this replace our project management software?",
        answer:
          "No. ClientEnforce handles the pre-project intake phase — collecting briefs, signed agreements, and site documents before design work starts. It works alongside your project management tool.",
      },
    ],
    metaTitle: "Client Onboarding Software for Architects | ClientEnforce",
    metaDescription:
      "Client onboarding software for architects and engineers — collect project briefs, appointment signatures, and site documents before kickoff. Start free.",
    heroSubheadline:
      "Collect complete project briefs and signed appointments before design work starts.",
    solutionParagraphs: [
      "Architecture and engineering projects start with incomplete information more often than they should. Briefs arrive via email in inconsistent formats. Fee agreements are unsigned. Site documents are still outstanding when the kickoff meeting is already in the diary. ClientEnforce replaces the ad hoc intake process with a structured portal.",
      "You define what must be collected before a project advances — project brief, site survey, signed appointment letter, stakeholder contacts — and the portal enforces completion. Clients receive automated reminders when items are overdue. Your team has a complete intake record before the first design session.",
      "The result is better briefed projects, faster contract execution, and a professional client experience that reflects the quality of your practice.",
    ],
    pullQuote: {
      // TODO: Replace with real customer quote
      quote:
        "We stopped starting projects with half a brief. Now every client completes the full intake before we open the project in our management software.",
      name: "Fiona B.",
      role: "Project Director",
      company: "Architecture practice",
    },
    comparisonRows: [
      {
        feature: "Structured project brief forms",
        clientenforce: "Yes",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "E-signatures",
        clientenforce: "Built-in",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Required step enforcement",
        clientenforce: "Yes",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Automated reminders",
        clientenforce: "Rule-based, per step",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Document collection",
        clientenforce: "Secure portal upload",
        competitor1: "File sharing",
        competitor2: "File sharing",
      },
      {
        feature: "Audit trail",
        clientenforce: "Full timestamped record",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Templates per project type",
        clientenforce: "Yes — unlimited",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Client portal (no login)",
        clientenforce: "Yes",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
    ],
    relatedVerticals: ["law-firms", "real-estate", "consulting"],
  },

  {
    slug: "tire-shops",
    vertical: "Tire & Auto Shops",
    primaryKeyword: "client onboarding software for tire shops",
    secondaryKeywords: [
      "digital vehicle intake forms",
      "auto shop customer intake software",
      "tire shop service authorization software",
      "multi-location auto shop management",
      "vehicle check-in software",
    ],
    targetPersona: "Tire shop owners, auto service center managers, and franchise operators",
    painPoints: [
      {
        title: "Paper vehicle intake forms create bottlenecks",
        description:
          "Handwritten check-in forms slow down the service lane, get lost, and cannot be searched or reported on. Digital alternatives are scattered across different apps.",
      },
      {
        title: "Service authorizations are unsigned or informal",
        description:
          "Customers verbally approve work without signing a service authorization. When disputes arise, there is no record of what was agreed.",
      },
      {
        title: "No standardised process across multiple locations",
        description:
          "Each location runs check-in differently. Franchise operators cannot enforce a consistent intake standard or benchmark performance across sites.",
      },
    ],
    competitorsMentioned: ["Mitchell1", "Shop-Ware"],
    industrySpecificFeatures: [
      {
        icon: "clipboard",
        name: "Digital vehicle intake forms",
        description:
          "Replace paper check-in forms with structured digital steps — vehicle details, reported faults, mileage, and customer contact — collected consistently every time.",
      },
      {
        icon: "pen",
        name: "Service authorization e-signatures",
        description:
          "Capture signed service authorizations before work begins — a clear record that the customer approved the scope and cost.",
      },
      {
        icon: "grid",
        name: "Multi-location dashboard",
        description:
          "Franchise operators and area managers can see intake completion and process adherence across every location from a single view.",
      },
      {
        icon: "layout",
        name: "Service templates per type",
        description:
          "Build separate intake templates for tyre fitting, full service, MOT, and repair — each with the required steps appropriate to that job type.",
      },
      {
        icon: "bell",
        name: "Automated customer reminders",
        description:
          "Send automatic reminders when a customer has not completed an outstanding intake step or signed an authorization before their appointment.",
      },
      {
        icon: "shield",
        name: "Signed authorization record",
        description:
          "Every signed service authorization is stored with a timestamp and customer record — ready for dispute resolution or warranty claims.",
      },
    ],
    faqItems: [
      {
        question: "Can customers complete vehicle intake forms before they arrive at the shop?",
        answer:
          "Yes. Send customers a portal link before their appointment. They can complete vehicle details, describe the fault, and review the service authorization in advance — reducing wait time at check-in.",
      },
      {
        question: "Does this work across multiple shop locations?",
        answer:
          "Yes. Franchise operators and area managers can see intake completion across all locations from a single dashboard — and can enforce a standard process across every site.",
      },
      {
        question: "Do customers need to download an app to complete the intake form?",
        answer:
          "No. Customers access the intake portal through a link on their phone or a QR code at the service desk. No app download, no account creation.",
      },
      {
        question: "Can we include a service authorization for customers to sign digitally?",
        answer:
          "Yes. Service authorization is a required step in the intake template. The customer cannot proceed until they sign — creating a clear, timestamped record of their approval.",
      },
      {
        question: "Does ClientEnforce replace our existing shop management system?",
        answer:
          "No. ClientEnforce handles the intake and authorization phase — collecting customer and vehicle information, capturing service approvals, and enforcing completion. It works alongside your existing shop management or DMS system.",
      },
    ],
    metaTitle: "Client Onboarding Software for Tire Shops | ClientEnforce",
    metaDescription:
      "Digital vehicle intake forms and service authorization software for tire shops and auto service centers. Enforce every check-in step. Start free.",
    heroSubheadline:
      "Replace paper check-in forms with digital intake that captures signed service authorizations.",
    solutionParagraphs: [
      "Tire shops and auto service centers rely on consistent, documented intake to protect the business and serve customers efficiently. When vehicle check-in happens on handwritten forms — or verbally — the shop is exposed to disputes and the manager cannot benchmark performance across the service lane or multiple locations.",
      "ClientEnforce replaces the paper intake process with a digital portal. Customers complete vehicle details, describe reported faults, and sign service authorizations through a link on their phone — before or when they arrive. Required steps cannot be skipped. Every signed authorization is stored with a timestamp.",
      "For franchise operators and multi-location managers, the dashboard shows intake completion and process adherence across every site — making it possible to enforce a consistent standard without being on-site.",
    ],
    pullQuote: {
      // TODO: Replace with real customer quote
      quote:
        "Disputes about what was authorized used to happen monthly. Since every customer signs digitally before we start work, we haven't had a single one.",
      name: "Tony M.",
      role: "Owner",
      company: "Independent tyre and service centre",
    },
    comparisonRows: [
      {
        feature: "Digital intake forms",
        clientenforce: "Yes — structured steps",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Service authorization e-signatures",
        clientenforce: "Built-in",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Required step enforcement",
        clientenforce: "Yes",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Multi-location dashboard",
        clientenforce: "Yes",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Mobile-friendly (no app needed)",
        clientenforce: "Yes — browser-based",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Audit trail per customer",
        clientenforce: "Full timestamped record",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Templates per service type",
        clientenforce: "Yes — unlimited",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Pricing model",
        clientenforce: "Flat plan",
        competitor1: "Per seat / per location",
        competitor2: "Per seat",
      },
    ],
    relatedVerticals: ["dental-clinics", "real-estate", "coaches"],
  },

  {
    slug: "dental-clinics",
    vertical: "Dental Clinics",
    primaryKeyword: "client onboarding software for dental clinics",
    secondaryKeywords: [
      "digital new patient intake forms dental",
      "dental patient onboarding software",
      "dental practice intake management",
      "HIPAA-compliant patient intake",
      "dental patient portal software",
    ],
    targetPersona: "Dental practice owners, office managers, and DSO operations leads",
    painPoints: [
      {
        title: "New patient paperwork bottlenecks in the waiting room",
        description:
          "Patients arrive and fill in paper forms at reception, creating queues, delays, and frustrated first impressions before they even see the dentist.",
      },
      {
        title: "Incomplete intake leads to no-shows and appointment delays",
        description:
          "When medical history and insurance information is missing at the appointment, the dentist cannot start treatment on time — or at all.",
      },
      {
        title: "Patient documents handled insecurely",
        description:
          "Sensitive health and insurance documents arrive via email or are collected on paper with no formal storage process or access control.",
      },
    ],
    competitorsMentioned: ["Dentrix", "Carestream"],
    industrySpecificFeatures: [
      {
        icon: "clipboard",
        name: "Digital new patient intake forms",
        description:
          "Patients complete medical history, contact details, and consent forms through a secure portal link before their first appointment — no waiting room paperwork.",
      },
      {
        icon: "lock",
        name: "Secure health document portal",
        description:
          "Patients submit insurance cards, referral letters, and prior X-rays through a secure portal — not via email or handed in on paper.",
      },
      {
        icon: "pen",
        name: "Consent form e-signatures",
        description:
          "Capture signed treatment consent and practice terms before the first appointment — with a full timestamp and patient record.",
      },
      {
        icon: "bell",
        name: "Pre-appointment completion reminders",
        description:
          "Automated reminders go out when intake is incomplete before an appointment — reducing no-shows and last-minute delays.",
      },
      {
        icon: "layout",
        name: "Templates per appointment type",
        description:
          "Build separate intake flows for new patient registrations, referral patients, and specialist consultations — each with appropriate required steps.",
      },
      {
        icon: "shield",
        name: "Timestamped patient record",
        description:
          "Every consent form, document, and completed step is stored with a timestamp — a clear record for clinical and administrative review.",
      },
    ],
    faqItems: [
      {
        question: "Can patients complete intake forms before their appointment?",
        answer:
          "Yes. Send patients a portal link when their appointment is booked. They complete medical history, consent forms, and insurance details at home — so the practice has everything before the patient arrives.",
      },
      {
        question: "Is ClientEnforce HIPAA-compliant?",
        answer:
          "ClientEnforce is designed to handle sensitive patient information securely. Please contact us to discuss HIPAA compliance requirements for your practice in detail — specific configurations may be required.", // TODO: Update based on actual HIPAA status
      },
      {
        question: "Does this replace our practice management system?",
        answer:
          "No. ClientEnforce handles the new patient intake and onboarding phase — collecting forms, consent signatures, and documents before the first appointment. It works alongside your existing practice management or PMS system.",
      },
      {
        question: "Can we build different intake templates for different appointment types?",
        answer:
          "Yes. Build a separate template for new patient registrations, referral patients, NHS versus private patients, and specialist consultations — each with the appropriate required steps and consent forms.",
      },
      {
        question: "Do patients need to download an app or create an account?",
        answer:
          "No. Patients access the intake portal through a secure link sent via email or SMS. No app download, no account creation. They complete their forms directly in the browser on any device.",
      },
    ],
    metaTitle: "Client Onboarding Software for Dental Clinics | ClientEnforce",
    metaDescription:
      "Digital new patient intake forms and consent e-signatures for dental clinics. Collect everything before the appointment. Start free.",
    heroSubheadline:
      "Send patients a portal link before their appointment — no waiting room paperwork, no delays.",
    solutionParagraphs: [
      "Dental practices lose time and patient satisfaction at the very first touchpoint: the waiting room intake form. Patients arrive, sit down with a clipboard, and the appointment clock starts before treatment is even close to beginning. Meanwhile, incomplete insurance information and missing consent forms create treatment delays that ripple through the day.",
      "ClientEnforce replaces paper intake with a secure patient portal. Send a link when the appointment is booked. Patients complete their medical history, insurance details, and consent forms at home — before they arrive. Required steps cannot be skipped. The practice receives a notification when intake is complete.",
      "The result is a smoother arrival experience, fewer appointment delays, and a complete patient record before the chair is even in use.",
    ],
    pullQuote: {
      // TODO: Replace with real customer quote
      quote:
        "We stopped losing the first 10 minutes of every new patient appointment to paperwork. Everything is complete before they arrive — it's transformed how our front desk operates.",
      name: "Dr. Hannah W.",
      role: "Practice Principal",
      company: "Private dental practice",
    },
    comparisonRows: [
      {
        feature: "Digital patient intake forms",
        clientenforce: "Yes — pre-appointment",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Consent form e-signatures",
        clientenforce: "Built-in",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Required step enforcement",
        clientenforce: "Yes",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Pre-appointment reminders",
        clientenforce: "Automated, per step",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Secure document portal",
        clientenforce: "Yes — no email",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Templates per appointment type",
        clientenforce: "Yes — unlimited",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Mobile-friendly (no app)",
        clientenforce: "Yes",
        competitor1: "Check vendor site",
        competitor2: "Check vendor site",
      },
      {
        feature: "Pricing model",
        clientenforce: "Flat plan",
        competitor1: "Per seat / per location",
        competitor2: "Per seat",
      },
    ],
    relatedVerticals: ["tire-shops", "financial-advisors", "law-firms"],
  },
];

export const verticalBySlug = Object.fromEntries(verticals.map((v) => [v.slug, v]));

// ─── Use-case sub-page configs ───────────────────────────────────────────────

export const useCasePages: UseCaseConfig[] = [
  {
    slug: "vehicle-intake-forms",
    parentVertical: "tire-shops",
    primaryKeyword: "digital vehicle intake forms for auto shops",
    metaTitle: "Digital Vehicle Intake Forms for Auto Shops | ClientEnforce",
    metaDescription:
      "Replace paper vehicle check-in with digital intake forms for auto shops and tire centers. Capture signed service authorizations before work starts. Free trial.",
    h1: "Digital vehicle intake forms for auto shops",
    heroSubheadline:
      "Collect vehicle details, reported faults, and signed service authorizations digitally — before you touch the car.",
    sections: [
      {
        heading: "Why paper vehicle intake forms cost auto shops time and money",
        paragraphs: [
          "Paper check-in forms create three problems for auto shops: they are slow to complete, easy to lose, and impossible to report on. When a dispute arises about what was authorized, there is no clear record. When management wants to see average check-in completion time, there is no data.",
          "Digital vehicle intake forms solve all three. Customers complete vehicle details, describe the reported fault, review the job estimate, and sign the service authorization — all through a link on their phone. The shop has a complete, timestamped record before the first spanner is picked up.",
        ],
        bullets: [
          "Vehicle registration, make, model, and mileage collected in structured fields",
          "Customer description of reported fault or requested service",
          "Service estimate review and signed authorization",
          "Contact details and preferred update method",
          "Pre-existing damage acknowledgment",
        ],
      },
      {
        heading: "Send the intake link before the appointment",
        paragraphs: [
          "The most efficient shops send the intake portal link when the appointment is booked — not when the customer arrives. Customers complete the form at home, in the car park, or anywhere else that is convenient. By the time they walk in, the paperwork is done.",
          "For walk-in customers, a QR code at the service desk links directly to the intake portal. Customers complete the form on their phone while they wait — faster and more accurate than handwriting on a clipboard.",
        ],
      },
    ],
    faqItems: [
      {
        question: "Can customers complete the vehicle intake form before they arrive?",
        answer:
          "Yes. Send customers a portal link when their appointment is booked. They complete vehicle details, describe the fault, and sign the service authorization before arrival — so check-in takes seconds rather than minutes.",
      },
      {
        question: "Do customers need to download an app to complete the form?",
        answer:
          "No. The intake portal is browser-based. Customers access it through a link or QR code — no download, no account creation.",
      },
      {
        question: "Can we include a signed service authorization in the digital intake?",
        answer:
          "Yes. Service authorization is a required step in the intake template. The customer signs digitally — with a timestamp — before work begins.",
      },
      {
        question: "Does this work across multiple shop locations?",
        answer:
          "Yes. Each location uses the same intake template, and managers can see completion rates across all sites from one dashboard.",
      },
      {
        question: "What happens if a customer does not complete the intake before their appointment?",
        answer:
          "Automated reminders go out when intake is incomplete. For walk-in customers, a QR code at the desk links directly to the form.",
      },
    ],
  },

  {
    slug: "new-patient-intake",
    parentVertical: "dental-clinics",
    primaryKeyword: "digital new patient intake forms dental",
    metaTitle: "Digital New Patient Intake Forms for Dental Clinics | ClientEnforce",
    metaDescription:
      "Replace waiting room paperwork with digital new patient intake forms for dental practices. Send a portal link before the appointment. Start free.",
    h1: "Digital new patient intake forms for dental clinics",
    heroSubheadline:
      "Send patients a portal link before their appointment — forms completed at home, not at the front desk.",
    sections: [
      {
        heading: "The cost of waiting room paperwork",
        paragraphs: [
          "Every minute a new patient spends filling in paper forms at reception is a minute the appointment clock is already running. For practices with tight schedules, a 10-minute paper intake at the start of a 45-minute appointment creates a cascading delay that affects every patient that day.",
          "Digital new patient intake forms solve this by moving the intake step out of the waiting room and into the patient's home — or car park, or coffee shop — before they arrive. The practice has a complete record before the appointment begins.",
        ],
        bullets: [
          "Medical and dental history collected through structured fields",
          "Insurance details and policy numbers",
          "Consent form e-signatures with timestamp",
          "Emergency contact and GP details",
          "Prior treatment and medication notes",
        ],
      },
      {
        heading: "How it works for dental practices",
        paragraphs: [
          "When a new patient books an appointment, they receive a secure portal link. The link takes them to a step-by-step intake flow — medical history, contact details, insurance information, and consent form signature. Required fields cannot be left blank. The practice receives a notification when intake is complete.",
          "For patients who do not complete intake before the appointment, automated reminders are sent in the days before the visit. Walk-in patients can access the same form via a QR code at the front desk.",
        ],
      },
    ],
    faqItems: [
      {
        question: "When should the intake portal link be sent to new patients?",
        answer:
          "Send the link when the appointment is booked — ideally 3 to 5 days before the visit. This gives patients enough time to complete the form and allows the practice to follow up if anything is outstanding.",
      },
      {
        question: "Can we collect consent form signatures digitally?",
        answer:
          "Yes. Consent form signature is a required step in the intake template. Patients sign digitally through the portal — with a full timestamp and record.",
      },
      {
        question: "What happens if a patient does not complete the intake before their appointment?",
        answer:
          "Automated reminders go out when intake is incomplete. For patients who still have not completed it on the day, a QR code at the front desk gives them access to finish quickly on their phone.",
      },
      {
        question: "Can we build different intake templates for different appointment types?",
        answer:
          "Yes. Build a separate flow for new NHS patients, new private patients, referral patients, and specialist consultations — each with appropriate required steps.",
      },
      {
        question: "Is patient data stored securely?",
        answer:
          "Yes. Patient information is submitted through a secure portal and stored with controlled access. Contact us to discuss specific compliance requirements for your practice.",
      },
    ],
  },

  {
    slug: "client-portal",
    parentVertical: "agencies",
    primaryKeyword: "client portal for agencies",
    metaTitle: "Client Portal for Agencies | Enforced Onboarding | ClientEnforce",
    metaDescription:
      "A client portal for agencies that enforces onboarding steps — asset collection, e-signatures, automated reminders. No step gets skipped. Start free.",
    h1: "Client portal for agencies",
    heroSubheadline:
      "A client portal that enforces onboarding steps — so asset collection actually gets done.",
    sections: [
      {
        heading: "What agencies need from a client portal",
        paragraphs: [
          "Most agency client portals give clients a space. They do not enforce completion. An asset request sits open in the portal while the client assumes they sent it via email. Required files are technically available but never submitted through the right channel. Kickoff happens with gaps.",
          "A client portal built for agencies needs to do one thing the others do not: enforce completion. Required steps should block advancement until they are done. Automated reminders should go out when steps are overdue — without requiring a human to remember.",
        ],
        bullets: [
          "Required steps clients cannot skip",
          "Automated overdue reminders at configurable intervals",
          "Real-time dashboard showing every client's completion status",
          "Secure asset upload — not email attachments",
          "E-signature on SOWs and contracts within the portal",
        ],
      },
      {
        heading: "One portal per client, one template for all",
        paragraphs: [
          "You build one onboarding template per service line — retainer, project, campaign — and every new client goes through the same structured portal. The client sees their personalised onboarding checklist. Your team sees a real-time dashboard showing every active client and what is still outstanding.",
          "There is no duplication. There is no building the same onboarding from scratch each time. One template, consistently applied, across every client.",
        ],
      },
    ],
    faqItems: [
      {
        question: "How is ClientEnforce different from general client portal software?",
        answer:
          "General portals give clients a workspace. ClientEnforce enforces completion — required steps cannot be skipped, automated reminders go out when steps are overdue, and your dashboard shows real-time completion status across all clients.",
      },
      {
        question: "Can we use different portal templates for different service lines?",
        answer:
          "Yes. Build one template for retainer clients, another for project clients, and another for campaign work. Every new client in each category goes through the same enforced process.",
      },
      {
        question: "Does the client portal support asset uploads?",
        answer:
          "Yes. Clients upload brand files, access credentials, briefs, and any other required assets directly through the portal — not via email attachments.",
      },
      {
        question: "How does our team see what clients have and have not completed?",
        answer:
          "Your team dashboard shows every active client onboarding and its real-time completion status — which steps are done, which are outstanding, and which clients need attention.",
      },
      {
        question: "Can clients access the portal without creating an account?",
        answer:
          "Yes. Clients access the portal through a unique secure link. No account creation, no password, no friction.",
      },
    ],
  },

  {
    slug: "onboarding-checklist",
    parentVertical: "agencies",
    primaryKeyword: "agency client onboarding checklist template",
    metaTitle: "Agency Client Onboarding Checklist Template | ClientEnforce",
    metaDescription:
      "A practical agency client onboarding checklist template covering asset collection, contracts, access, and kickoff readiness. Start enforcing it today.",
    h1: "Agency client onboarding checklist template",
    heroSubheadline:
      "A complete onboarding checklist for agencies — from signed contract to kickoff-ready in a structured portal.",
    sections: [
      {
        heading: "What to include in an agency client onboarding checklist",
        paragraphs: [
          "An effective agency onboarding checklist covers four phases: contract execution, intake and briefing, asset and access collection, and kickoff readiness confirmation. Each phase has required steps that must be complete before the project advances.",
        ],
        bullets: [
          "Signed statement of work or retainer agreement",
          "Client brief — goals, constraints, target audience, success metrics",
          "Brand assets — logo files, brand guidelines, imagery, fonts",
          "Access credentials — CMS, analytics, advertising accounts, social accounts",
          "Stakeholder contacts and communication preferences",
          "Kickoff meeting confirmation and agenda acceptance",
        ],
      },
      {
        heading: "Why a checklist alone is not enough",
        paragraphs: [
          "A checklist tells you what needs to be done. It does not enforce that it gets done. An account manager can send the checklist to a client and still have assets missing three weeks later because the client never opened it or assumed it was advisory.",
          "ClientEnforce turns your agency onboarding checklist into an enforced workflow. Required steps block advancement. Automated reminders go out when items are overdue. Your dashboard shows exactly where every client stands in the checklist — in real time.",
        ],
      },
    ],
    faqItems: [
      {
        question: "What should be on an agency client onboarding checklist?",
        answer:
          "A complete agency onboarding checklist should cover: signed contract or SOW, client brief collection, brand asset uploads, access credential submission, stakeholder contact details, and kickoff confirmation. Mark every item as required before kickoff.",
      },
      {
        question: "How do we enforce checklist completion with clients?",
        answer:
          "ClientEnforce turns your checklist into required portal steps. Clients cannot mark the onboarding as complete until every item is submitted. Automated reminders go out when anything is overdue.",
      },
      {
        question: "Can we customise the checklist for different types of client?",
        answer:
          "Yes. Build a separate onboarding template for each service line — retainer, project, campaign — each with the checklist items appropriate to that engagement type.",
      },
      {
        question: "Can we add or remove checklist items for specific clients?",
        answer:
          "Yes. Onboarding templates can be customised per client before the portal is sent. Add, remove, or modify steps based on the specific engagement requirements.",
      },
      {
        question: "What happens when a client completes every item on the checklist?",
        answer:
          "Your team receives a notification when onboarding is complete. The completed record — all submitted assets, signed documents, and timestamps — is stored and accessible for future reference.",
      },
    ],
  },

  {
    slug: "customer-onboarding",
    parentVertical: "saas",
    primaryKeyword: "automate SaaS customer onboarding",
    metaTitle: "Automate SaaS Customer Onboarding | ClientEnforce",
    metaDescription:
      "Automate SaaS customer onboarding with enforced setup steps, automated reminders, and a live pipeline dashboard. Reduce time-to-value. Start free.",
    h1: "Automate SaaS customer onboarding",
    heroSubheadline:
      "Replace manual CS follow-up with automated setup steps that enforce completion from day one.",
    sections: [
      {
        heading: "What SaaS customer onboarding automation actually means",
        paragraphs: [
          "Onboarding automation in SaaS does not mean removing the human. It means removing the manual work that does not require one. Sending a setup reminder email every three days manually is manual work. Sending it automatically when a step is overdue is automation.",
          "ClientEnforce automates the follow-up and enforcement layer of customer onboarding — reminders, step sequencing, completion tracking — so your customer success team focuses on customers who need strategic help, not everyone who has not clicked a button.",
        ],
        bullets: [
          "Automated reminders when setup steps are overdue",
          "Required steps that cannot be skipped",
          "Completion notifications sent to the CS team when a customer is ready",
          "Pipeline dashboard showing onboarding status across all accounts",
          "Separate templates for self-serve, growth, and enterprise customers",
        ],
      },
      {
        heading: "The onboarding steps worth automating first",
        paragraphs: [
          "Not every onboarding step needs automation. Focus first on the steps that block value delivery when incomplete: account configuration, integration setup, data import, and user training confirmation. These are the steps where delays directly extend time-to-value.",
          "Build a required-step onboarding template around these blockers. Every new customer goes through the same enforced flow. Reminders go out automatically. Your CS team sees who is stuck before it becomes a churn risk.",
        ],
      },
    ],
    faqItems: [
      {
        question: "What parts of SaaS customer onboarding can be automated?",
        answer:
          "You can automate follow-up reminders when setup steps are overdue, completion notifications when customers finish a step, and escalation alerts when an account has stalled. The structured workflow itself — guiding customers through required configuration steps — is also automated once you build the template.",
      },
      {
        question: "Will automation feel impersonal to enterprise customers?",
        answer:
          "No. Automation handles the repetitive follow-up that does not need to be personal. Your CS team still manages the relationship — they just spend less time writing follow-up emails and more time on strategic conversations.",
      },
      {
        question: "How does this reduce SaaS customer churn?",
        answer:
          "Churn often starts when customers do not complete setup and then blame the product. By enforcing required configuration steps and automating reminders, you ensure customers reach the 'aha moment' faster — which is the strongest predictor of retention.",
      },
      {
        question: "Can we build separate automated onboarding flows for different customer segments?",
        answer:
          "Yes. Build one template for self-serve customers, another for growth accounts, and a more detailed one for enterprise onboarding. Each can have different required steps and automation rules.",
      },
      {
        question: "How quickly can we launch automated SaaS onboarding?",
        answer:
          "Most teams have their first automated onboarding template live in under 20 minutes. You map out the required steps, configure reminder timing, and start sending onboarding links to new customers immediately.",
      },
    ],
  },

  {
    slug: "document-collection",
    parentVertical: "accounting",
    primaryKeyword: "secure document collection for accountants",
    metaTitle: "Secure Document Collection for Accountants | ClientEnforce",
    metaDescription:
      "Replace email attachments with a secure document collection portal for accountants. Enforce AML, KYC, and engagement docs. Exportable audit trail. Start free.",
    h1: "Secure document collection for accountants",
    heroSubheadline:
      "Collect AML, KYC, and engagement documents through a secure portal — not email attachments.",
    sections: [
      {
        heading: "Why email is the wrong place for accounting document collection",
        paragraphs: [
          "Accounting firms collect some of the most sensitive documents that exist: proof of identity, source of funds, financial statements, tax records. When these travel as email attachments, they are forwarded between accounts, stored on personal devices, and impossible to audit. That is a compliance and data protection risk.",
          "A secure document collection portal removes the email from the equation. Clients upload directly to a controlled environment. Every upload is timestamped. The firm has a single, auditable record of every document received.",
        ],
        bullets: [
          "Proof of identity and proof of address — AML compliance",
          "Source of funds and source of wealth declarations",
          "Signed engagement letters and fee agreements",
          "Prior year accounts and tax returns",
          "Bank statements and financial records",
        ],
      },
      {
        heading: "Enforced collection rather than requested collection",
        paragraphs: [
          "Sending a document request by email is not document collection — it is hoping the client responds. ClientEnforce replaces email requests with required portal steps. The client cannot be marked as onboarded until every required document is submitted. Automated reminders handle the follow-up.",
          "The result is a complete, retrievable document record for every client — before the engagement begins.",
        ],
      },
    ],
    faqItems: [
      {
        question: "How is portal document collection more secure than email?",
        answer:
          "Documents uploaded through the portal are stored in a controlled environment with access logging and timestamping. Email attachments are forwarded, stored on personal devices, and cannot be audited. The portal creates a single, traceable record.",
      },
      {
        question: "Can we enforce which documents must be submitted before the engagement starts?",
        answer:
          "Yes. Mark AML, KYC, and engagement documents as required steps. The client cannot be marked as onboarded until every required document is submitted — removing the risk of missing documents discovered later.",
      },
      {
        question: "Can clients upload multiple documents in one step?",
        answer:
          "Yes. Each document collection step can accept multiple file uploads. Clients can upload all files relevant to that step in one action.",
      },
      {
        question: "What formats are supported for document upload?",
        answer:
          "The portal accepts standard document formats — PDF, JPEG, PNG, and common office file types. Clients can upload from any device.",
      },
      {
        question: "Can we export a record of all documents received per client?",
        answer:
          "Yes. Every onboarding record includes a timestamped log of every document received and every step completed. This can be exported at any time as a PDF evidence pack.",
      },
    ],
  },
];

export const useCaseBySlug = Object.fromEntries(
  useCasePages.map((uc) => [`${uc.parentVertical}/${uc.slug}`, uc]),
);

// All /lp/* paths for the sitemap
export const lpVerticalPaths = verticals.map((v) => `/lp/${v.slug}`);
export const lpUseCasePaths = useCasePages.map(
  (uc) => `/lp/${uc.parentVertical}/${uc.slug}`,
);
export const allLpPaths = [...lpVerticalPaths, ...lpUseCasePaths];
