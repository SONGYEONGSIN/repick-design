"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  cx,
  DISPLAY_FACE,
  EASE,
  EYEBROW,
  FOCUS,
  STEPS,
} from "./data";

const STEP_NUMERAL = "tabular-nums tracking-[0.02em]";

/**
 * Horizontal stepper — four steps left to right, connected by a track line,
 * each focusable/clickable to swap the detail panel below. Standard
 * `tablist`/`tab`/`tabpanel` roles: keyboard users get the left/right-arrow
 * roving convention on top of plain Tab+Enter, mouse users click, and the
 * detail panel for step one is already the server-rendered default — so
 * there is no JS-only content and nothing depends on scroll-triggered
 * IntersectionObserver (see the writeup for why that was avoided here).
 */
export default function HowItWorksStepper() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next =
        e.key === "ArrowRight"
          ? (i + 1) % STEPS.length
          : (i - 1 + STEPS.length) % STEPS.length;
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  }

  return (
    <section aria-labelledby="how-title" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8 sm:py-24">
        <p className={EYEBROW}>How it works</p>
        <h2
          id="how-title"
          style={DISPLAY_FACE}
          className="mt-4 max-w-[24ch] text-[clamp(1.9rem,4.4vw,2.9rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-[#0B0B0F]"
        >
          Four steps, none of them hidden.
        </h2>
        <p className="mt-4 max-w-[52ch] text-base font-normal leading-[1.6] text-zinc-600">
          Select a step to see exactly what happens at that point in the
          pipeline — the same pipeline the hero above is already running.
        </p>

        <div className="relative mt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-5 h-px bg-zinc-200"
          />
          <div
            role="tablist"
            aria-label="How repick works, in four steps"
            className="relative flex items-start gap-1"
          >
            {STEPS.map((s, i) => {
              const selected = i === active;
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`step-tab-${s.id}`}
                  aria-selected={selected}
                  aria-controls={`step-panel-${s.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cx(
                    "flex flex-1 flex-col items-center gap-2 rounded-lg px-1 py-1 text-center transition-colors duration-150",
                    FOCUS,
                  )}
                >
                  <span
                    className={cx(
                      "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-150",
                      STEP_NUMERAL,
                      selected
                        ? "border-[#6E56CF] bg-[#6E56CF] text-white"
                        : "border-zinc-300 bg-white text-zinc-600",
                    )}
                  >
                    {s.index}
                  </span>
                  <Icon
                    className={cx(
                      "h-4 w-4 shrink-0",
                      selected ? "text-[#5A3FC0]" : "text-zinc-500",
                    )}
                    aria-hidden
                  />
                  <span
                    className={cx(
                      "text-[0.8rem] font-semibold leading-tight",
                      selected ? "text-[#0B0B0F]" : "text-zinc-600",
                    )}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {STEPS.map((s, i) => (
          <div
            key={s.id}
            id={`step-panel-${s.id}`}
            role="tabpanel"
            aria-labelledby={`step-tab-${s.id}`}
            hidden={i !== active}
          >
            {i === active && (
              <motion.div
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="mt-8 max-w-[62ch] rounded-2xl border border-zinc-200 bg-[#F5F4FA] p-6 sm:p-8"
              >
                <h3 className="text-xl font-extrabold leading-snug tracking-[-0.02em] text-[#0B0B0F]">
                  {s.title}
                </h3>
                <p className="mt-3 text-base font-normal leading-[1.6] text-zinc-600">
                  {s.detail}
                </p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
