"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EASE, FOCUS, VIEWPORT, VALUE_TABS, cx } from "./data";

/**
 * Post-hero value-propositions section — a real tabbed panel switcher (role="tablist" /
 * role="tab" / role="tabpanel", arrow-key navigation), not numbered sections and not a 3-card
 * split.
 */
export default function ValueTabs() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const tab = VALUE_TABS[active];

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, idx: number) {
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % VALUE_TABS.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + VALUE_TABS.length) % VALUE_TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = VALUE_TABS.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section aria-labelledby="values-title" className="border-b border-white/10 bg-[#0B0B0F]">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8 md:py-24">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, ease: EASE }}
          className="max-w-[62ch]"
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#B6A6F0]">
            Why it works
          </p>
          <h2
            id="values-title"
            className="mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Four guarantees behind every message you send.
          </h2>
        </motion.div>

        <div role="tablist" aria-label="Value propositions" className="mt-8 flex flex-wrap gap-2">
          {VALUE_TABS.map((t, i) => {
            const selected = i === active;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`vtab-${t.id}`}
                aria-selected={selected}
                aria-controls={`vpanel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cx(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors duration-150",
                  selected
                    ? "border-[#6E56CF]/60 bg-[#6E56CF]/10 text-white"
                    : "border-white/10 text-[#A1A1AA] hover:border-white/25 hover:text-white",
                  FOCUS,
                )}
              >
                <Icon
                  aria-hidden="true"
                  className={cx("size-4 shrink-0", selected ? "text-[#B6A6F0]" : "text-current")}
                />
                {t.label}
              </button>
            );
          })}
        </div>

        <div
          id={`vpanel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`vtab-${tab.id}`}
          tabIndex={-1}
          className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
        >
          <motion.div
            key={tab.id}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">{tab.heading}</h3>
            <p className="mt-3 max-w-[65ch] text-base font-normal leading-[1.6] text-[#A1A1AA]">
              {tab.body}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[0.78rem] font-semibold text-[#B6A6F0]">
              {tab.proof}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
