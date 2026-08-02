"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cx, FAQ_ITEMS, FOCUS } from "./data";

/** A single-open accordion — plain state, no library. Each trigger is a real <button> that toggles
 * its own panel via aria-expanded/aria-controls, and the panel itself carries role="region" with a
 * matching aria-labelledby so it announces correctly when a screen reader user jumps to it. */
export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section aria-labelledby="faq-heading" className="min-w-0">
      <h2 id="faq-heading" className="text-xl font-semibold text-zinc-50">
        Frequently asked questions
      </h2>
      <div className="mt-4 divide-y divide-zinc-800 rounded-xl border border-zinc-800">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          const triggerId = `${baseId}-trigger-${i}`;
          const panelId = `${baseId}-panel-${i}`;
          return (
            <div key={item.q}>
              <h3>
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={cx(
                    "flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-900/60 sm:text-base",
                    FOCUS,
                  )}
                >
                  {item.q}
                  <ChevronDown
                    className={cx("h-4 w-4 flex-none text-zinc-400 transition-transform", isOpen && "rotate-180")}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              {isOpen && (
                <div id={panelId} role="region" aria-labelledby={triggerId} className="px-4 pb-4 text-sm font-normal leading-relaxed text-zinc-400">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
