export type UsVerticalFaq = {
  question: string;
  answer: string;
};

export type UsVerticalUseCase = {
  title: string;
  description: string;
};

export type UsVerticalConfig = {
  slug: string;
  vertical: string;
  badge: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  heroHeadline: string;
  heroSubheadline: string;
  /** Optional extra line in the hero trust bar (e.g., Telletire mention for auto-service) */
  heroTrustNote?: string;
  painPoints: { title: string; body: string }[];
  howItWorksIntro: string;
  testimonialQuote: string;
  testimonialName: string;
  testimonialTitle: string;
  testimonialLocation: string;
  leadMagnetTitle: string;
  /** Agencies page only — surfaces the Agency Pro white-label pitch */
  showWhiteLabel: boolean;
  /** Accountants, dental, health-wellness */
  showComplianceCallout: boolean;
  complianceCallout?: string;
  /** Health-wellness only */
  showUseCasesBlock: boolean;
  useCases?: UsVerticalUseCase[];
  /** Auto-service only — stalled-account ROI calculator */
  showRoiCalculator?: boolean;
  faqItems: UsVerticalFaq[];
  ctaHeading: string;
  ctaSubtext: string;
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Agencies                                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */
const agencies: UsVerticalConfig = {
  slug: "agencies",
  vertical: "Agencies",
  badge: "For Marketing & Creative Agencies",
  metaTitle: "Client Onboarding Software for Agencies | ClientEnforce",
  metaDescription:
    "Stop rebuilding onboarding from scratch for every client. ClientEnforce gives agencies repeatable templates, branded portals, and required-step enforcement — live in 20 minutes.",
  keywords: [
    "client onboarding software for agencies",
    "agency onboarding automation",
    "agency client portal software",
    "client intake software for agencies",
    "agency onboarding checklist",
  ],
  heroHeadline: "Stop onboarding clients by hand. Your agency has better things to do.",
  heroSubheadline:
    "ClientEnforce gives agencies a repeatable onboarding system — branded portals, automated follow-ups, and required-step enforcement so nothing slips through the cracks.",
  painPoints: [
    {
      title: "You're rebuilding the same onboarding checklist for every new client",
      body: "Copy-pasting from last client's email thread, then starting over every time a new account lands. It's a tax on your team and an inconsistent experience for your client.",
    },
    {
      title: "Creative work starts before the brief is even complete",
      body: "Kickoff happens before all assets, approvals, and credentials are in hand. Delivery suffers. The client doesn't see the connection. You take the blame.",
    },
    {
      title: "Your account manager is the bottleneck",
      body: "One person manually chasing every client, every time — and they have actual client work to deliver. Every hour spent on follow-up is an hour not spent on results.",
    },
    {
      title: "A client ghosts mid-onboarding and the project stalls",
      body: "No enforcement means no accountability, and no early warning. You find out a week later when a deadline is already at risk.",
    },
  ],
  howItWorksIntro:
    "Agencies use ClientEnforce to standardize onboarding across every service line — so every client gets the same clean start, every time.",
  testimonialQuote:
    "We onboard 8–12 clients a month. ClientEnforce paid for itself in the first week.",
  testimonialName: "[Agency Owner Name]",
  testimonialTitle: "[Title]",
  testimonialLocation: "[City, State]",
  leadMagnetTitle: "The US Agency Onboarding Checklist",
  showWhiteLabel: true,
  showComplianceCallout: false,
  showUseCasesBlock: false,
  faqItems: [
    {
      question: "Does ClientEnforce support white-label client portals?",
      answer:
        "Yes. With the Agency Pro plan, your client portals display your branding — your logo, your colors, your domain. Clients never see ClientEnforce branding.",
    },
    {
      question: "Can I have different templates for different service lines?",
      answer:
        "Yes. Build separate templates for retainer clients, project engagements, campaigns, and more — then reuse each one across every new client in that service line without rebuilding from scratch.",
    },
    {
      question: "Do my clients need to create an account?",
      answer:
        "No. Clients receive a secure link and complete their onboarding directly in the portal — no login, no app, no friction.",
    },
    {
      question: "How quickly can my agency get set up?",
      answer:
        "Most agencies launch their first onboarding template in under 20 minutes. You build the template once, then reuse it for every new client in that service line.",
    },
  ],
  ctaHeading: "Your agency's next client deserves a better start",
  ctaSubtext:
    "Build your first agency onboarding template in under 20 minutes. No credit card required. 30-day money-back guarantee.",
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Consultants                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
const consultants: UsVerticalConfig = {
  slug: "consultants",
  vertical: "Consultants",
  badge: "For Consultants & Consulting Firms",
  metaTitle: "Client Onboarding Software for Consultants | ClientEnforce",
  metaDescription:
    "Stop starting engagements with missing information. ClientEnforce gives consultants a structured intake portal — documents, signatures, and answers collected before the first call.",
  keywords: [
    "client onboarding for consultants",
    "consultant client portal software",
    "client intake software for consultants",
    "consultant onboarding automation",
    "consulting firm client onboarding",
  ],
  heroHeadline: "The consultant client portal that gets everything you need before day one.",
  heroSubheadline:
    "ClientEnforce is a consultant client portal — no login required for clients — that collects documents, answers, and signatures upfront so you can hit the ground running from the first call.",
  painPoints: [
    {
      title: "Discovery takes three sessions instead of one",
      body: "Your client shows up to the discovery call unprepared because intake wasn't enforced before it. You spend the session gathering basics instead of delivering insight.",
    },
    {
      title: "You're chasing a signed contract two weeks after sending it",
      body: "No automated follow-up means it sits in their inbox until you ping them again. Every day it's unsigned is a day the engagement hasn't started.",
    },
    {
      title: "Engagement scope shifts because intake was incomplete",
      body: "Missing information at kickoff becomes scope creep and rework a month in. The client thinks it's new work. You know it was always part of the deal.",
    },
    {
      title: "Your onboarding lives in your inbox",
      body: "No single place to see what's been submitted versus what's still outstanding. You find out something's missing when it blocks actual work.",
    },
  ],
  howItWorksIntro:
    "Consultants use ClientEnforce to structure every new engagement intake — so nothing critical is missing when the real work begins.",
  testimonialQuote:
    "I used to spend 30 minutes per client chasing intake forms. Now it's zero.",
  testimonialName: "[Consultant Name]",
  testimonialTitle: "[Firm / Title]",
  testimonialLocation: "[City, State]",
  leadMagnetTitle: "The Consultant's Client Intake Checklist",
  showWhiteLabel: false,
  showComplianceCallout: false,
  showUseCasesBlock: false,
  faqItems: [
    {
      question: "Do I need to install anything?",
      answer:
        "No. ClientEnforce is entirely web-based. You log in, build your template, and send the link — nothing to download or install for you or your client.",
    },
    {
      question: "Can I collect e-signatures through ClientEnforce?",
      answer:
        "Yes. Engagement letters and agreements can be signed inside the portal — no separate DocuSign account needed for standard consulting agreements.",
    },
    {
      question: "What if a client doesn't complete their intake?",
      answer:
        "ClientEnforce sends automated reminders on the schedule you set. You can also see exactly which step they're stuck on in the dashboard — and follow up with context.",
    },
    {
      question: "Is there a free plan?",
      answer:
        "Yes. You can start on the free Solo plan and upgrade as your client volume grows. No credit card required to get started.",
    },
  ],
  ctaHeading: "Start your next engagement the right way",
  ctaSubtext:
    "Build your consultant intake template in under 20 minutes. No credit card required. 30-day money-back guarantee.",
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Accountants                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */
const accountants: UsVerticalConfig = {
  slug: "accountants",
  vertical: "Accountants",
  badge: "For Accounting Firms, CPAs & Bookkeepers",
  metaTitle: "Accounting Client Onboarding Software | ClientEnforce",
  metaDescription:
    "Collect every client document before the deadline — not after. ClientEnforce helps accounting firms enforce document collection, track completion, and maintain an audit-ready timeline.",
  keywords: [
    "accounting client onboarding software",
    "CPA client document collection",
    "accounting firm onboarding automation",
    "bookkeeper client intake software",
    "accounting practice onboarding system",
  ],
  heroHeadline: "Accounting client onboarding software that enforces every deadline.",
  heroSubheadline:
    "ClientEnforce is accounting client onboarding software that collects required documents, tracks completion, and maintains an audit-ready timeline — without a single manual follow-up.",
  painPoints: [
    {
      title: "Tax season hits and half your clients still haven't submitted their docs",
      body: "No enforcement means last-minute scrambles, extended deadlines, and unhappy clients who somehow expect you to have filed already.",
    },
    {
      title: "You have no proof of when a client submitted what",
      body: "Email threads aren't an audit trail. When a dispute arises — and it will — you need timestamps, not inbox searches.",
    },
    {
      title: "New client onboarding takes two weeks of back-and-forth",
      body: "Engagement letter, W-9, prior returns, bank statements — collected piecemeal over email. Each missing piece delays the next one.",
    },
    {
      title: "Staff turnover means onboarding knowledge walks out the door",
      body: "No standardized process means tribal knowledge, not a system. When someone leaves, the next hire reinvents the wheel — and clients notice.",
    },
  ],
  howItWorksIntro:
    "Accounting firms use ClientEnforce to enforce document collection, standardize intake across staff, and build a defensible compliance record for every client.",
  testimonialQuote:
    "We cut our new client intake time from 2 weeks to 3 days. The audit trail alone was worth it.",
  testimonialName: "[CPA / Firm Manager Name]",
  testimonialTitle: "[Title]",
  testimonialLocation: "[City, State]",
  leadMagnetTitle: "The Accounting Firm New Client Checklist",
  showWhiteLabel: false,
  showComplianceCallout: true,
  complianceCallout:
    "Every document submission is timestamped and logged. Your engagement records are always audit-ready — no inbox archaeology required.",
  showUseCasesBlock: false,
  faqItems: [
    {
      question: "Is the audit trail useful for compliance purposes?",
      answer:
        "Yes. Every document submission, signature, and step completion is timestamped and logged, giving you a defensible record of client activity. We recommend consulting your compliance advisor about your specific requirements.",
    },
    {
      question: "Can I use different templates for different service types?",
      answer:
        "Yes. Build separate templates for individual tax clients, business returns, new bookkeeping engagements, and more — then reuse each one across every client in that category.",
    },
    {
      question: "Do my clients need to create an account?",
      answer:
        "No. Clients receive a secure link and complete their document submission without logging in — no app, no friction, no excuse.",
    },
    {
      question: "How do I handle tax season volume spikes?",
      answer:
        "All paid plans support multiple concurrent active onboardings. Automated reminders handle client follow-up during busy season so your team stays focused on returns, not chasing documents.",
    },
  ],
  ctaHeading: "Make this tax season the last chaotic one",
  ctaSubtext:
    "Build your accounting firm's intake template in under 20 minutes. No credit card required. 30-day money-back guarantee.",
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Ops Teams                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */
const opsTeams: UsVerticalConfig = {
  slug: "ops-teams",
  vertical: "Ops Teams",
  badge: "For Operations Managers & Growing Service Teams",
  metaTitle: "Client Onboarding Workflow Software for Ops Teams | ClientEnforce",
  metaDescription:
    "Stop letting onboarding quality depend on who's running it. ClientEnforce gives ops teams standardized templates, required-step enforcement, and real-time visibility across every active onboarding.",
  keywords: [
    "onboarding workflow software",
    "client onboarding automation ops",
    "standardized onboarding system",
    "operations onboarding software",
    "onboarding template library",
  ],
  heroHeadline: "Stop letting onboarding quality depend on who's running it.",
  heroSubheadline:
    "ClientEnforce gives ops teams a repeatable onboarding system — standardized templates, required-step enforcement, and real-time visibility across every active onboarding.",
  painPoints: [
    {
      title: "Every team member runs onboarding differently",
      body: "No consistency, quality varies by person, and outcomes are unpredictable. Clients notice the difference — even when your team doesn't.",
    },
    {
      title: "You can't see where any given onboarding is stuck without asking someone",
      body: "No dashboard, no visibility, no proactive escalation. Problems surface when they're already late — not when they could be fixed.",
    },
    {
      title: "You're building a new onboarding checklist for every engagement type",
      body: "No template library means starting from scratch every time. Your best people waste time on admin that should have been standardized months ago.",
    },
    {
      title: "A new hire breaks the process on their second client",
      body: "No guardrails means your process quality is only as good as your newest employee's judgment. Required-step enforcement changes that.",
    },
  ],
  howItWorksIntro:
    "Ops teams use ClientEnforce to build a single, repeatable onboarding playbook — then enforce it across every team member and every engagement.",
  testimonialQuote:
    "We standardized onboarding across our whole team in one afternoon. The dashboard visibility was a game changer.",
  testimonialName: "[Ops Manager / COO Name]",
  testimonialTitle: "[Title]",
  testimonialLocation: "[City, State]",
  leadMagnetTitle: "The Ops Team Onboarding Standardization Checklist",
  showWhiteLabel: false,
  showComplianceCallout: false,
  showUseCasesBlock: false,
  faqItems: [
    {
      question: "Can different team members have different access levels?",
      answer:
        "Yes. Team roles (RBAC) let you assign owner, admin, and member access — so each person sees and can do exactly what they need, without over-access.",
    },
    {
      question: "Can we have templates for different engagement or client types?",
      answer:
        "Yes. Build a template per service type and reuse it every time a new engagement starts. Your whole team works from the same playbook — without copying from a shared doc.",
    },
    {
      question: "What's the learning curve for new team members?",
      answer:
        "Minimal. The portal is simple enough that new hires can run an onboarding correctly from their first week. Required-step enforcement provides the guardrails so you're not babysitting the process.",
    },
    {
      question: "Does ClientEnforce replace our project management tool?",
      answer:
        "No — it complements it. ClientEnforce handles the intake phase from signed agreement to kickoff-ready. Your PM tool handles delivery after that. The two work alongside each other.",
    },
  ],
  ctaHeading: "Build your team's onboarding playbook today",
  ctaSubtext:
    "Standardize your first onboarding workflow in under 20 minutes. No credit card required. 30-day money-back guarantee.",
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Auto Service                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */
const autoService: UsVerticalConfig = {
  slug: "auto-service",
  vertical: "Auto Service",
  badge: "For Tire Shops, Auto Service Chains & Fleet Businesses",
  metaTitle: "Auto Service & Fleet Account Onboarding Software | ClientEnforce",
  metaDescription:
    "Onboard fleet accounts and commercial clients faster — without the paperwork chaos. ClientEnforce enforces completion so nothing gets missed before the first service call.",
  keywords: [
    "fleet account onboarding software",
    "auto service client onboarding",
    "fleet management onboarding system",
    "commercial client intake software",
    "auto service business software",
  ],
  heroHeadline:
    "Fleet accounts, commercial clients, new locations — onboard them all without the paperwork chaos.",
  heroSubheadline:
    "ClientEnforce gives auto service businesses a structured onboarding system for fleet accounts, commercial clients, and new location rollouts — so nothing gets missed before the first service call.",
  // TODO: Replace with Telletire logo/quote when available
  heroTrustNote: "Trusted by Telletire and growing auto service businesses across the US",
  painPoints: [
    {
      title: "Fleet account setup takes days of back-and-forth",
      body: "Missing insurance certificates, billing contacts, and vehicle lists delay first service. Meanwhile, the fleet manager is calling to ask when their account is active.",
    },
    {
      title: "You're onboarding a new location and nobody knows what the process is",
      body: "Every manager does it differently — and quality suffers. What works at your flagship location isn't being replicated because there's no system to replicate.",
    },
    {
      title: "A commercial client started before their credit application was approved",
      body: "No enforcement on required steps creates billing exposure. One skipped step at setup creates a collection problem three months later.",
    },
    {
      title: "Your service advisor is chasing paperwork instead of selling",
      body: "Manual follow-up on account setup kills revenue-generating time. Every hour spent on admin is an hour not spent on the floor.",
    },
  ],
  howItWorksIntro:
    "Auto service businesses use ClientEnforce to standardize fleet account setup, commercial client intake, and new location rollouts — so every account starts right.",
  testimonialQuote:
    "We set up our fleet account onboarding template in one afternoon. New accounts now go live in 24 hours instead of a week.",
  testimonialName: "[Owner / Ops Manager Name]",
  testimonialTitle: "[Title]",
  // TODO: Replace with real auto service testimonial — consider reaching out to Telletire for a quote
  testimonialLocation: "[City, State]",
  leadMagnetTitle: "The Auto Service Fleet Account Onboarding Checklist",
  showWhiteLabel: false,
  showComplianceCallout: false,
  showUseCasesBlock: false,
  showRoiCalculator: true,
  faqItems: [
    {
      question: "Can I have different templates for fleet vs. commercial accounts?",
      answer:
        "Yes. Build separate templates per account type — fleet, commercial, wholesale, new location rollout — and reuse each one every time. No rebuilding from scratch.",
    },
    {
      question: "Do fleet managers need to create an account to complete onboarding?",
      answer:
        "No. Fleet contacts receive a secure link and complete onboarding from any device — no account setup, no app download, no friction.",
    },
    {
      question: "What documents can I collect through the portal?",
      answer:
        "Insurance certificates, vehicle lists, credit applications, billing contacts, signed account agreements — any document you define as a required step. Clients can't proceed until it's submitted.",
    },
    {
      question: "How quickly can we launch our first template?",
      answer:
        "Most auto service businesses launch their first onboarding template in under 20 minutes. You can have your fleet account intake live the same day.",
    },
  ],
  ctaHeading: "Get your next fleet account live in 24 hours",
  ctaSubtext:
    "Build your account onboarding template in under 20 minutes. No credit card required. 30-day money-back guarantee.",
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Dental Practices                                                            */
/* ─────────────────────────────────────────────────────────────────────────── */
const dentalPractices: UsVerticalConfig = {
  slug: "dental-practices",
  vertical: "Dental Practices",
  badge: "For Dental Practices & DSOs",
  metaTitle: "Dental Practice Onboarding Software | ClientEnforce",
  metaDescription:
    "Streamline new patient intake, staff onboarding, and multi-location standardization for dental practices. Required forms, automated reminders, audit trail. Start free.",
  keywords: [
    "dental patient intake software",
    "dental onboarding system",
    "DSO onboarding software",
    "multi-location dental practice management",
    "dental new patient forms software",
  ],
  heroHeadline: "Dental patient software that collects intake before the waiting room.",
  heroSubheadline:
    "ClientEnforce gives dental practices and DSOs a structured intake system — required forms, HIPAA consent documents, insurance info, and payment setup collected upfront, automatically, before the first appointment.",
  painPoints: [
    {
      title: "New patients arrive with half their paperwork done",
      body: "Incomplete intake means delayed appointments, frustrated front desk staff, and a first impression that sets the wrong tone for the patient relationship.",
    },
    {
      title: "Each location handles new patient onboarding differently",
      body: "No standardization across a multi-location group means inconsistent patient experience and no way to measure or improve the intake process.",
    },
    {
      title: "Insurance verification gets started too late",
      body: "Missing info at checkout creates billing delays, write-offs, and awkward conversations with patients who thought their coverage was confirmed.",
    },
    {
      title: "There's no defined process for onboarding a new associate or front desk hire",
      body: "Tribal knowledge isn't a system. When staff turns over — and it does — onboarding quality drops until the new hire figures it out themselves.",
    },
  ],
  howItWorksIntro:
    "Dental practices use ClientEnforce to collect patient intake, standardize new-hire onboarding, and maintain consistent workflows across every location.",
  testimonialQuote:
    "We standardized intake across all five locations in a week. Front desk time on paperwork dropped immediately.",
  testimonialName: "[Practice Owner / Office Manager Name]",
  testimonialTitle: "[Title]",
  testimonialLocation: "[City, State]",
  leadMagnetTitle: "The Dental Practice Patient Intake Checklist",
  showWhiteLabel: false,
  showComplianceCallout: true,
  complianceCallout:
    "Every submission is timestamped and logged — giving your practice a defensible, audit-ready record of patient intake and consent.",
  showUseCasesBlock: true,
  useCases: [
    {
      title: "Single-Location Dental Practices",
      description:
        "Dental patient intake software that collects new patient forms, insurance information, HIPAA consent, and payment method — automatically, before the appointment. Front desk staff spend less time chasing paperwork and more time on patient experience.",
    },
    {
      title: "Multi-Location Groups",
      description:
        "Standardize new patient intake across every location with one template. Each location follows the same process — same forms, same order, same completion requirements — so your operations team can monitor intake quality across the whole group from one dashboard.",
    },
    {
      title: "DSO Onboarding Software",
      description:
        "DSO onboarding software built for scale. Deploy one intake template across every practice in your network. Required-step enforcement ensures no patient arrives without complete paperwork, regardless of location size or front desk experience level.",
    },
    {
      title: "New Associate & Staff Onboarding",
      description:
        "Use ClientEnforce for new associate and front desk hire onboarding too. Credentialing documents, signed employment agreements, and required compliance training confirmations — all collected in a structured portal before their first day.",
    },
  ],
  faqItems: [
    {
      question: "Does this work for multi-location dental groups and DSOs?",
      answer:
        "Yes. Templates standardize the intake process across every location — same workflow whether it's location 2 or location 20. DSO operations leads use the dashboard to monitor completion across the whole group.",
    },
    {
      question: "Do patients need to create an account?",
      answer:
        "No. Patients receive a link via text or email and complete their forms directly — no login required, no app to download.",
    },
    {
      question: "Can I collect HIPAA-relevant intake documents?",
      answer:
        "ClientEnforce collects and stores documents securely with a full audit trail. We recommend consulting your compliance advisor about HIPAA-specific requirements for your practice's use case.",
    },
    {
      question: "How long does setup take for a new intake template?",
      answer:
        "Most practices launch their first patient intake template in under 20 minutes. Multi-location rollout follows the same template — no rebuilding per location.",
    },
  ],
  ctaHeading: "Give your patients a better first impression",
  ctaSubtext:
    "Build your first intake template in under 20 minutes. No credit card required. 30-day money-back guarantee.",
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Health & Wellness                                                           */
/* ─────────────────────────────────────────────────────────────────────────── */
const healthWellness: UsVerticalConfig = {
  slug: "health-wellness",
  vertical: "Health & Wellness",
  badge: "For Health, Wellness & Social Services Organizations",
  metaTitle: "Health & Wellness Client Onboarding Software | ClientEnforce",
  metaDescription:
    "Collect intake forms, consent documents, and compliance paperwork before day one. Required-step enforcement, audit trail, automated reminders. Built for health and wellness businesses.",
  keywords: [
    "home health agency onboarding software",
    "therapy practice intake forms",
    "wellness business client onboarding",
    "health services onboarding automation",
    "health and wellness intake software",
  ],
  heroHeadline: "Home health agency onboarding software that closes every compliance gap.",
  heroSubheadline:
    "ClientEnforce gives home health agencies and wellness businesses a structured onboarding system — required intake forms, consent documents, insurance info, and care agreements collected upfront, with automated reminders and a full audit trail.",
  painPoints: [
    {
      title: "Care starts before intake is complete",
      body: "Missing consent forms or insurance info creates compliance exposure and billing headaches. The gap between 'started' and 'properly onboarded' is where liability lives.",
    },
    {
      title: "Staff onboarding varies by manager and location",
      body: "No standardized credentialing or compliance documentation process means quality depends on who's running the intake — not on a system that enforces it.",
    },
    {
      title: "You're chasing clients for the same forms every enrollment period",
      body: "No automation means fully manual follow-up every time. Your staff spends hours on administrative work that should run itself.",
    },
    {
      title: "There's no proof of when a client signed a consent form",
      body: "Email threads aren't audit trails. When a compliance review, licensing visit, or accreditation check comes around, timestamps matter.",
    },
  ],
  howItWorksIntro:
    "Health and wellness organizations use ClientEnforce to enforce intake completion, build audit-ready records, and standardize onboarding across every service type and location.",
  testimonialQuote:
    "Our compliance team used to manually track every intake document. Now it's all in one place with timestamps.",
  testimonialName: "[Owner / Ops Director Name]",
  testimonialTitle: "[Title]",
  testimonialLocation: "[City, State]",
  leadMagnetTitle: "The Health & Wellness Client Intake Checklist",
  showWhiteLabel: false,
  showComplianceCallout: true,
  complianceCallout:
    "Every form submission is timestamped and logged — giving your organization a defensible, audit-ready intake record for compliance reviews, licensing, and accreditation.",
  showUseCasesBlock: true,
  useCases: [
    {
      title: "Home Health Agencies",
      description:
        "Home health agency onboarding software that collects caregiver credentials, client care agreements, and emergency contact forms before the first visit. Required-step enforcement means care can't begin until intake is provably complete — giving you a defensible record for every client from day one.",
    },
    {
      title: "Therapy & Mental Health Practices",
      description:
        "Therapy practice intake software that collects psychosocial history forms, HIPAA consent, insurance verification, and session agreements — all before session one. Clients complete their intake from a secure link with no account required, on any device, at their own pace.",
    },
    {
      title: "Wellness Studios & Fitness Businesses",
      description:
        "Wellness studio onboarding for new member agreements, health screening questionnaires, and liability waivers — sent automatically when a membership is confirmed. Members finish intake before their first class; your front desk doesn't chase paperwork.",
    },
    {
      title: "Benefits Brokers & EAPs",
      description:
        "Structured employer group enrollment — eligibility forms, plan documentation, and employee consent — in one portal per account. Automated reminders handle follow-up during open enrollment so your brokers focus on relationships, not administrative chasing.",
    },
  ],
  faqItems: [
    {
      question: "Can I use different templates for different service types?",
      answer:
        "Yes. Build separate templates for new client intake, annual re-enrollment, staff credentialing, and vendor setup — each reusable for every new instance in that category.",
    },
    {
      question: "Is the audit trail useful for compliance reviews and accreditation?",
      answer:
        "Yes. Every form submission, signature, and step completion is timestamped and logged — providing a defensible record for compliance reviews, licensing visits, and accreditation processes.",
    },
    {
      question: "Do clients need to create accounts to complete intake?",
      answer:
        "No. Clients and patients receive a secure link and complete their intake without logging in — from any device, at their convenience.",
    },
    {
      question: "Does this work for multi-location organizations?",
      answer:
        "Yes. Templates standardize your intake process across every location — so onboarding quality is consistent whether you have 2 sites or 20.",
    },
  ],
  ctaHeading: "Close the gap between intake and care",
  ctaSubtext:
    "Build your first intake template in under 20 minutes. No credit card required. 30-day money-back guarantee.",
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Law Firms                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */
const lawFirm: UsVerticalConfig = {
  slug: "law-firm",
  vertical: "Law Firms",
  badge: "For US Law Firms & Solo Attorneys",
  metaTitle: "Law Firm Client Onboarding Software & Intake | ClientEnforce (2026)",
  metaDescription:
    "Law firm client onboarding software that enforces retainer agreements, KYC checks, and engagement letters before any billable work begins. Required steps, timestamped audit trail, and automated follow-up for solicitors and attorneys.",
  keywords: [
    "law firm client onboarding software",
    "law firm client intake software",
    "law firm onboarding software",
    "attorney client onboarding",
    "law firm intake software",
    "client intake for law firms",
    "solicitor client onboarding",
  ],
  heroHeadline: "Law firm client intake software that closes every file before the engagement opens.",
  heroSubheadline:
    "ClientEnforce enforces retainer agreements, conflict checks, and KYC documentation before your attorneys begin any billable work — with a full timestamped audit trail for bar compliance.",
  painPoints: [
    {
      title: "Engagement letters sit unsigned for weeks",
      body: "You send the retainer, the client says they'll sign, and three weeks later the matter is underway with nothing executed. Enforcement eliminates the follow-up loop.",
    },
    {
      title: "Missing KYC documentation creates compliance exposure",
      body: "Incomplete identity verification and conflict-check documentation is a liability. Without a required-step gate, matters open with gaps that surface only when regulators or bar counsel ask.",
    },
    {
      title: "Associates are chasing intake instead of doing billable work",
      body: "Every hour an associate spends tracking down a signed form or a missing ID document is an hour not billed. Automated enforcement removes that burden entirely.",
    },
    {
      title: "No defensible record of what was collected and when",
      body: "If a client later disputes the scope of the engagement or the terms of the retainer, you need a timestamped log of every document collected, every step completed, and every signature obtained.",
    },
  ],
  howItWorksIntro:
    "Law firms use ClientEnforce to enforce intake from the moment a matter opens — retainer agreements, ID verification, conflict check authorization, and scope documentation — before any work begins.",
  testimonialQuote:
    "We used to open matters with incomplete intake files constantly. Now nothing moves forward until the required steps are done.",
  testimonialName: "[Managing Partner]",
  testimonialTitle: "[Title]",
  testimonialLocation: "[City, State]",
  leadMagnetTitle: "The Law Firm Client Intake Checklist",
  showWhiteLabel: false,
  showComplianceCallout: true,
  complianceCallout:
    "Every form submission, document signature, and intake step is timestamped and logged — providing a defensible, exportable audit trail for bar compliance, matter management, and client disputes.",
  showUseCasesBlock: true,
  useCases: [
    {
      title: "Solo & Small Firm Attorneys",
      description:
        "Law firm intake software for solo attorneys and small firms that eliminates manual follow-up — engagement letters, retainer agreements, and KYC documentation enforced automatically before any billable work begins.",
    },
    {
      title: "Multi-Attorney Practices",
      description:
        "Standardize intake across every attorney and practice area — so every client file is complete to the same standard, regardless of which associate handled the intake.",
    },
    {
      title: "Litigation & Transactional Practices",
      description:
        "Collect case-specific information, signed authority documents, and client representations through structured intake portals — with conditional logic that adapts to matter type.",
    },
    {
      title: "Compliance-Sensitive Specialties",
      description:
        "For immigration, estate planning, M&A, and regulated practice areas — enforce identity verification, conflict-check authorization, and engagement documentation with a timestamped audit trail.",
    },
  ],
  faqItems: [
    {
      question: "Can I collect signed retainer agreements through ClientEnforce?",
      answer:
        "Yes. You can include document upload steps and require clients to confirm receipt and agreement before proceeding. Combine with your existing e-signature tool or use the built-in acknowledgement step.",
    },
    {
      question: "Does ClientEnforce produce an audit trail for bar compliance?",
      answer:
        "Yes. Every step completion, form submission, and document upload is timestamped and logged per client. You can export the full intake record as a PDF evidence pack for compliance review or client disputes.",
    },
    {
      question: "Can I have different intake templates for different practice areas?",
      answer:
        "Yes. Build separate templates for litigation, transactional, immigration, estate planning, and any other practice area — each enforced independently with its own required steps.",
    },
    {
      question: "Do clients need to create an account to complete intake?",
      answer:
        "No. Clients receive a secure link and complete their intake portal without logging in — reducing friction and increasing the likelihood of timely completion.",
    },
  ],
  ctaHeading: "Open every matter with a complete file",
  ctaSubtext:
    "Build your first intake template in under 20 minutes. No credit card required. 30-day money-back guarantee.",
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Financial Advisors                                                          */
/* ─────────────────────────────────────────────────────────────────────────── */
const financialAdvisors: UsVerticalConfig = {
  slug: "financial-advisors",
  vertical: "Financial Advisors",
  badge: "For RIAs & Independent Financial Advisors",
  metaTitle: "Financial Advisor Client Onboarding Software | ClientEnforce",
  metaDescription:
    "Financial advisor client onboarding software with built-in KYC enforcement. Collect CIP documentation, suitability forms, and signed disclosures before any account is opened — with a full audit trail.",
  keywords: [
    "financial advisor client onboarding software",
    "KYC document collection software financial advisor",
    "RIA new client intake form",
    "financial advisor onboarding software",
    "RIA client onboarding",
  ],
  heroHeadline: "Financial advisor client onboarding software with built-in KYC enforcement.",
  heroSubheadline:
    "ClientEnforce enforces CIP documentation, suitability questionnaires, and signed disclosures before any account is opened — so your compliance team has a defensible, timestamped record for every client.",
  painPoints: [
    {
      title: "KYC documentation arrives incomplete or weeks late",
      body: "You open new accounts provisionally, then spend weeks chasing missing ID documents and source-of-funds declarations. Every gap is a compliance exposure — and a distraction for your advisors.",
    },
    {
      title: "AML and suitability checks stall account openings",
      body: "Without required-step enforcement, clients submit partial suitability forms, skip risk tolerance sections, and return documents that need re-collection. The account opening drags on.",
    },
    {
      title: "No defensible audit trail when regulators ask",
      body: "SEC, FINRA, and state regulators want to see exactly what was collected, when, and in what order. A spreadsheet or email thread is not an audit trail.",
    },
    {
      title: "Advisors spend time on administration instead of client relationships",
      body: "Every hour an advisor spends following up on missing forms is an hour not spent on financial planning, client calls, or new business development.",
    },
  ],
  howItWorksIntro:
    "RIAs and independent advisors use ClientEnforce to enforce client onboarding from day one — CIP documentation, suitability forms, signed disclosures, and account paperwork — before any investment activity begins.",
  testimonialQuote:
    "Our compliance team used to spend half their time chasing incomplete onboarding documents. That time is now zero.",
  testimonialName: "[RIA Principal]",
  testimonialTitle: "[Title]",
  testimonialLocation: "[City, State]",
  leadMagnetTitle: "The RIA Client Onboarding Compliance Checklist",
  showWhiteLabel: false,
  showComplianceCallout: true,
  complianceCallout:
    "Every form submission, document upload, and intake step is timestamped and logged per client — producing a defensible audit trail for SEC, FINRA, and state regulator examinations.",
  showUseCasesBlock: true,
  useCases: [
    {
      title: "Registered Investment Advisers (RIAs)",
      description:
        "Financial advisor onboarding software that enforces CIP documentation, Form ADV delivery acknowledgement, and suitability questionnaire completion — before any account is funded. Full audit trail for SEC and state examinations.",
    },
    {
      title: "Independent Financial Planners",
      description:
        "Collect signed engagement agreements, financial data gathering questionnaires, and document uploads in a structured intake portal — so every planning engagement starts with a complete client file.",
    },
    {
      title: "Wealth Management Practices",
      description:
        "Standardize new client onboarding across every advisor in the practice — investment policy statements, risk tolerance assessments, and KYC documentation enforced consistently regardless of who handled intake.",
    },
    {
      title: "Insurance-Linked Financial Advisors",
      description:
        "Enforce needs analysis forms, replacement notices, and suitability documentation for insurance-linked products — with a timestamped record that satisfies state insurance department requirements.",
    },
  ],
  faqItems: [
    {
      question: "Does ClientEnforce support KYC and CIP documentation collection?",
      answer:
        "Yes. You can build required-step intake flows that collect identity documents, source-of-funds declarations, beneficial ownership information, and any other CIP-required documentation — enforced before any account progresses.",
    },
    {
      question: "Can I use this for Form ADV Part 2 delivery acknowledgement?",
      answer:
        "Yes. Include an acknowledgement step that requires the client to confirm receipt before the intake portal advances — producing a timestamped record of delivery for your compliance files.",
    },
    {
      question: "Does ClientEnforce produce an audit trail for regulatory exams?",
      answer:
        "Yes. Every step completion, form submission, document upload, and timestamp is logged per client and exportable as a PDF evidence pack — designed to answer examiner requests for onboarding documentation.",
    },
    {
      question: "Can I have different intake workflows for different client types?",
      answer:
        "Yes. Build separate templates for individual accounts, joint accounts, entity accounts, retirement accounts, and trust accounts — each with the specific required steps for that client type.",
    },
  ],
  ctaHeading: "Open every account with a complete compliance file",
  ctaSubtext:
    "Build your first client intake template in under 20 minutes. No credit card required. 30-day money-back guarantee.",
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Exports                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
export const usVerticals: UsVerticalConfig[] = [
  agencies,
  consultants,
  accountants,
  opsTeams,
  autoService,
  dentalPractices,
  healthWellness,
  lawFirm,
  financialAdvisors,
];

export const usVerticalBySlug: Record<string, UsVerticalConfig> = Object.fromEntries(
  usVerticals.map((v) => [v.slug, v]),
);
