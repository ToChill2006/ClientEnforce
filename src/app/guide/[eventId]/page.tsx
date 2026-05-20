import * as React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const admin = supabaseAdmin();
  const { data: event } = await admin
    .from("events")
    .select("name, exhibitor_guide")
    .eq("id", eventId)
    .maybeSingle();
  const guide = (event as any)?.exhibitor_guide as GuideData | null;
  const title = guide?.title || (event as any)?.name || "Exhibitor Guide";
  return { title };
}

type GuideSection =
  | { id: string; type: "heading"; title: string }
  | { id: string; type: "text"; title?: string; content: string }
  | { id: string; type: "info_box"; title?: string; content: string; color?: "blue" | "yellow" | "green" | "red" }
  | { id: string; type: "table"; title?: string; headers: string[]; rows: string[][] }
  | { id: string; type: "image"; url: string; alt?: string; caption?: string }
  | { id: string; type: "divider" };

type GuideData = {
  title: string;
  hero_image?: string | null;
  intro?: string | null;
  sections: GuideSection[];
};

function GuideHero({ guide, eventName }: { guide: GuideData; eventName: string }) {
  if (guide.hero_image) {
    return (
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gray-900">
        <img
          src={guide.hero_image}
          alt={guide.title}
          className="h-56 w-full object-cover opacity-70 sm:h-72"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 sm:p-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/60">{eventName}</p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{guide.title}</h1>
        </div>
      </div>
    );
  }
  return (
    <div className="mb-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-900 to-slate-700 p-8">
      <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/50">{eventName}</p>
      <h1 className="text-2xl font-bold text-white sm:text-3xl">{guide.title}</h1>
      {guide.intro && <p className="mt-3 text-sm leading-relaxed text-white/70">{guide.intro}</p>}
    </div>
  );
}

function SectionBlock({ section }: { section: GuideSection }) {
  if (section.type === "divider") {
    return <hr className="my-6 border-gray-200" />;
  }

  if (section.type === "heading") {
    return (
      <div className="mb-2 mt-8 border-b-2 border-gray-900 pb-2">
        <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">{section.title}</h2>
      </div>
    );
  }

  if (section.type === "text") {
    return (
      <div className="mb-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        {section.title && <h3 className="mb-2 text-sm font-semibold text-gray-800">{section.title}</h3>}
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{section.content}</div>
      </div>
    );
  }

  if (section.type === "info_box") {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-50 border-blue-200 text-blue-900",
      yellow: "bg-amber-50 border-amber-200 text-amber-900",
      green: "bg-emerald-50 border-emerald-200 text-emerald-900",
      red: "bg-red-50 border-red-200 text-red-900",
    };
    const cls = colorMap[section.color || "blue"] || colorMap.blue;
    return (
      <div className={`mb-4 rounded-xl border p-5 ${cls}`}>
        {section.title && <h3 className="mb-1.5 text-sm font-semibold">{section.title}</h3>}
        <div className="whitespace-pre-wrap text-sm leading-relaxed">{section.content}</div>
      </div>
    );
  }

  if (section.type === "table") {
    return (
      <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {section.title && (
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-2.5">
            <h3 className="text-sm font-semibold text-gray-800">{section.title}</h3>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {section.headers && section.headers.length > 0 && (
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {section.headers.map((h, i) => (
                    <th key={i} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {(section.rows ?? []).map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-gray-700 align-top">
                      <div className="whitespace-pre-wrap">{cell}</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (section.type === "image") {
    return (
      <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <img src={section.url} alt={section.alt || ""} className="w-full object-contain" />
        {section.caption && (
          <div className="border-t border-gray-100 px-4 py-2 text-center text-xs text-gray-500">{section.caption}</div>
        )}
      </div>
    );
  }

  return null;
}

export default async function ExhibitorGuidePage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const admin = supabaseAdmin();

  const { data: event, error } = await admin
    .from("events")
    .select("id, name, exhibitor_guide")
    .eq("id", eventId)
    .maybeSingle();

  if (error || !event) return notFound();

  const guide = (event as any).exhibitor_guide as GuideData | null;

  if (!guide || !guide.sections || guide.sections.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mb-3 text-4xl">📋</div>
            <h1 className="mb-2 text-xl font-bold text-gray-900">{(event as any).name} — Exhibitor Guide</h1>
            <p className="text-sm text-gray-500">The exhibitor guide for this event is being prepared. Check back soon.</p>
          </div>
        </div>
      </div>
    );
  }

  const eventName = (event as any).name || "Event";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <GuideHero guide={guide} eventName={eventName} />
        {guide.intro && guide.hero_image && (
          <p className="mb-6 -mt-2 text-sm leading-relaxed text-gray-600">{guide.intro}</p>
        )}
        <div>
          {guide.sections.map((section) => (
            <SectionBlock key={section.id} section={section} />
          ))}
        </div>
        <div className="mt-10 text-center text-xs text-gray-400">
          This guide is provided by the event organiser. For questions, contact the event team.
        </div>
      </div>
    </div>
  );
}
