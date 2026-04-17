import { renderClientEnforceEmail } from "@/lib/email-template";
import { appOrigin } from "@/lib/app-url";

export type NurtureEmail = {
  subject: string;
  html: string;
  text: string;
  scheduledAt: string;
};

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

const origin = () => appOrigin().replace(/\/$/, "");

export function buildNurtureSequence(firstName: string): NurtureEmail[] {
  const name = firstName?.trim() || "there";

  const email1 = renderClientEnforceEmail({
    preheader: "Here's how to launch your first onboarding in under 20 minutes",
    eyebrow: "Getting started",
    title: `Set up your first template today`,
    subtitle: "Three steps and you're live.",
    paragraphs: [
      `Hi ${name} — welcome to ClientEnforce. Most teams are up and running in under 20 minutes. Here's the fastest path:`,
    ],
    bullets: [
      "Build one template — define the steps, documents, and signatures your client needs to complete",
      "Send one portal link — when a client signs, trigger from your template and send the link",
      "Let automation handle follow-up — ClientEnforce chases overdue steps automatically",
    ],
    primaryCta: {
      label: "Go to your dashboard →",
      href: `${origin()}/dashboard`,
    },
    secondaryCta: {
      label: "Watch a 3-min walkthrough",
      href: "https://calendar.app.google/QfkFs4hWUoCbKupj7",
    },
    footerNote: "You signed up for ClientEnforce. Unsubscribe any time by replying STOP.",
  });

  const email2 = renderClientEnforceEmail({
    preheader: "Most teams make this mistake in their first onboarding",
    eyebrow: "Week 1 tip",
    title: "The most common mistake — and how to avoid it",
    subtitle: "It's not what you'd expect.",
    paragraphs: [
      `Hi ${name} — the most common mistake teams make in their first onboarding: they build a checklist instead of an enforced workflow.`,
      "A checklist is passive. ClientEnforce is active — required steps are gated, reminders fire automatically, and nothing can be 'completed' without actually being completed.",
      "If you haven't yet marked any steps as required in your template, log in now and do that. It's the single change that makes the biggest difference.",
    ],
    primaryCta: {
      label: "Update your template →",
      href: `${origin()}/dashboard`,
    },
    footerNote: "You signed up for ClientEnforce. Unsubscribe any time by replying STOP.",
  });

  const email3 = renderClientEnforceEmail({
    preheader: "How is your first onboarding going?",
    eyebrow: "One week in",
    title: "Is your first client through yet?",
    subtitle: "Here's what to check if things feel stuck.",
    paragraphs: [
      `Hi ${name} — it's been a week. Most teams have their first client through by now. If you're not there yet, here's what to check:`,
    ],
    bullets: [
      "Have you built a template? Start with your most common client type.",
      "Have you sent a portal link? Copy it from the dashboard and paste it into your next client email.",
      "Are reminders enabled? Check your template settings — automated reminders should be turned on.",
    ],
    primaryCta: {
      label: "Check your dashboard →",
      href: `${origin()}/dashboard`,
    },
    secondaryCta: {
      label: "Book a free 20-min setup call",
      href: "https://calendar.app.google/QfkFs4hWUoCbKupj7",
    },
    footerNote: "You signed up for ClientEnforce. Unsubscribe any time by replying STOP.",
  });

  const email4 = renderClientEnforceEmail({
    preheader: "Quick question — are you still onboarding clients manually?",
    eyebrow: "Two weeks in",
    title: "Still chasing clients over email?",
    subtitle: "Let's fix that in the next 20 minutes.",
    paragraphs: [
      `Hi ${name} — two weeks since you signed up. If you're still chasing clients manually, something isn't set up right — and I'd like to help.`,
      "Reply to this email and tell me what's blocking you. Or book a free 20-minute call and I'll walk through your setup with you personally.",
      "Most teams who book a call launch their first onboarding the same day.",
    ],
    primaryCta: {
      label: "Book a free setup call",
      href: "https://calendar.app.google/QfkFs4hWUoCbKupj7",
    },
    secondaryCta: {
      label: "Go to your dashboard",
      href: `${origin()}/dashboard`,
    },
    footerNote: "You signed up for ClientEnforce. Unsubscribe any time by replying STOP.",
  });

  return [
    { subject: "Set up your first ClientEnforce template (3 steps)", ...email1, scheduledAt: daysFromNow(1) },
    { subject: "The most common mistake in week one (and how to avoid it)", ...email2, scheduledAt: daysFromNow(3) },
    { subject: "Is your first client through yet?", ...email3, scheduledAt: daysFromNow(7) },
    { subject: "Still chasing clients over email?", ...email4, scheduledAt: daysFromNow(14) },
  ];
}
