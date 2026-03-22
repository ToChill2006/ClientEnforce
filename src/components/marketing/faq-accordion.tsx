"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export type FaqItem = { question: string; answer: string };

export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-white/[0.08]">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-start justify-between gap-4 py-5 text-left transition"
              aria-expanded={isOpen}
            >
              <span className="text-base font-medium text-[#F0F0F0]">{item.question}</span>
              <span className="mt-0.5 shrink-0 text-[#00C2A8]">
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "max-h-96 pb-5" : "max-h-0"
              }`}
            >
              <p className="text-sm leading-7 text-[#9A9AAF]">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
