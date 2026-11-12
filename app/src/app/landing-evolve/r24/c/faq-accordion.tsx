"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "./data";
import { cx, FOCUS, INK_TEXT, MUTED_TEXT } from "./tokens";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;
        return (
          <div key={item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className={cx(
                  "flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold",
                  INK_TEXT,
                  FOCUS,
                )}
              >
                {item.q}
                <ChevronDown
                  aria-hidden="true"
                  className={cx("h-4 w-4 shrink-0 text-[#52525B] transition-transform duration-200", isOpen && "rotate-180")}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-4"
            >
              <p className={cx("max-w-[460px] text-[15px] leading-[1.6]", MUTED_TEXT)}>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
