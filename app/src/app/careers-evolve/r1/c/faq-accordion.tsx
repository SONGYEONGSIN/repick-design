"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FOCUS_RING, type FaqItem } from "./data";

/**
 * Single-open FAQ accordion. Real state — one `openIndex` — so opening any question closes
 * whichever one was previously open; there is no "all open" or "all closed by default" ambiguity.
 * Each trigger is a native <button> with aria-expanded/aria-controls wired to the panel it owns, so
 * it's reachable and operable with just Tab + Enter/Space (no custom key handling needed for that).
 * Panels use the `hidden` attribute rather than height/opacity animation: it removes the content
 * from the accessibility tree for free and never leaves an `opacity: 0` element behind for
 * prefers-reduced-motion to worry about. The only animated property is the chevron rotation, which
 * is purely decorative and gated with motion-reduce.
 */
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-zinc-200 border-y border-zinc-200">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const triggerId = `faq-trigger-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div key={item.question}>
            <h3 className="m-0">
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={`flex w-full items-center justify-between gap-4 py-5 text-left ${FOCUS_RING}`}
              >
                <span className="font-medium text-zinc-900">{item.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`h-5 w-5 shrink-0 text-fuchsia-600 transition-transform duration-200 motion-reduce:transition-none ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className="pb-5 pr-9"
            >
              <p className="max-w-2xl text-zinc-600">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
