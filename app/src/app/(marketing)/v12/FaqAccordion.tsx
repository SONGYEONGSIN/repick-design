"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DISPLAY, FAQS, FOCUS_RING, cx } from "./data";

/**
 * FAQ accordion — a real, functioning multi-open accordion (each item toggles independently,
 * `aria-expanded` + a linked region rather than `<details>` so the disclosure icon can rotate as a
 * transform-only animation). Keyboard-operable via native `<button>` semantics.
 */
export default function FaqAccordion() {
  const [open, setOpen] = useState<Set<string>>(new Set([FAQS[0].id]));

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section aria-labelledby="faq-title" className="border-t border-white/10">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="max-w-[58ch]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A1A1AA]">
            Questions
          </p>
          <h2
            id="faq-title"
            style={DISPLAY}
            className="mt-3 text-[clamp(1.7rem,3.4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.01em] text-white"
          >
            Before you trust a layer
          </h2>
        </div>

        <div className="mt-8 flex flex-col divide-y divide-white/10 border-y border-white/10">
          {FAQS.map((item) => {
            const isOpen = open.has(item.id);
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-button-${item.id}`;
            return (
              <div key={item.id}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(item.id)}
                    className={cx(
                      "flex w-full items-center justify-between gap-4 py-5 text-left",
                      FOCUS_RING,
                    )}
                  >
                    <span className="text-base font-semibold text-white sm:text-lg">
                      {item.q}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cx(
                        "size-5 shrink-0 text-[#B6A6F0] transition-transform duration-200 motion-reduce:transition-none",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="pb-5"
                >
                  <p className="max-w-[58ch] text-sm font-normal leading-[1.65] text-[#A1A1AA] sm:text-base">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
