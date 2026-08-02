"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "./data";

// Single-open accordion, standard WAI-ARIA APG pattern (button aria-expanded/aria-controls
// paired with the panel it reveals). Content stays in the DOM at all times — collapsing is a
// grid-template-rows transition, not unmounting, so nothing depends on JS having run for a
// crawler or no-JS fallback to see the answer text.
export default function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);
  const baseId = useId();

  return (
    <div className="divide-y divide-zinc-800 rounded-2xl border border-zinc-800 bg-zinc-900/40">
      {faqItems.map((item) => {
        const open = item.id === openId;
        const panelId = `${baseId}-panel-${item.id}`;
        const buttonId = `${baseId}-button-${item.id}`;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-zinc-100 transition-colors hover:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 sm:px-6 sm:text-base"
              >
                {item.question}
                <ChevronDown
                  aria-hidden="true"
                  className={[
                    "h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 motion-reduce:transition-none",
                    open ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>
            </h3>
            <div
              id={panelId}
              aria-labelledby={buttonId}
              className={[
                "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              ].join(" ")}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm font-normal text-zinc-400 tabular-nums sm:px-6">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
