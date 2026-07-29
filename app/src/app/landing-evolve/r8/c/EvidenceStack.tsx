"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ShieldCheck, Award } from "lucide-react";
import {
  LAYERS,
  VERDICT,
  EASE,
  VIEWPORT,
  CAPTION,
  NUM,
  FOCUS,
  cx,
  comma,
} from "./data";

/**
 * "Strata" — the hero's exploded evidence stack. Five bordered layer cards
 * (Style Fit, Size, Condition, Price, Trend) sit visibly overlapped like a
 * tight deck of film sheets on load. Once the hero scrolls into view they
 * separate downward into their own row in a fixed, staggered sequence
 * (transform-only: translateY + scale + rotate, no opacity fade — the
 * layers are never invisible, only repositioned) and settle into a resolved
 * verdict strip below. Clicking, or arrow-keying through, any layer pulls it
 * forward and swaps the adjacent detail panel to that layer's full reasoning
 * — a real content change, not a decorative flourish. prefers-reduced-motion
 * skips the separating animation entirely and mounts every layer already in
 * its resolved position.
 */

// vertical distance (px) each layer is pulled up onto the layer above it
// while the deck sits collapsed — roughly matches a card's min-height + gap,
// so at rest the stack reads as a slightly fanned pile, not a random jumble.
const STACK_STEP = 86;

const containerVariants: Variants = {
  collapsed: {},
  shown: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const layerVariants: Variants = {
  collapsed: (i: number) => ({
    y: -(i * STACK_STEP),
    scale: 1 - i * 0.018,
    rotate: i === 0 ? 0 : i % 2 === 0 ? -(i * 0.6) : i * 0.6,
  }),
  shown: {
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

export default function EvidenceStack() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeLayer = LAYERS[active];

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      next = (i + 1) % LAYERS.length;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      next = (i - 1 + LAYERS.length) % LAYERS.length;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = LAYERS.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-8 right-2 select-none text-[6rem] font-extrabold leading-none tracking-[-0.02em] text-white/[0.04] sm:-top-10 sm:right-4 sm:text-[7.5rem]"
      >
        05
      </span>

      <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        {/* the stack — a role=tablist of layer cards, initially overlapped */}
        <div className="relative">
          <p className={cx(CAPTION, "text-[#A1A1AA]")}>
            Live Strata scan · 5 layers
          </p>

          <motion.div
            role="tablist"
            aria-label="Match evidence layers"
            initial={reduced ? "shown" : "collapsed"}
            whileInView="shown"
            viewport={VIEWPORT}
            variants={containerVariants}
            className="relative mt-4 flex flex-col gap-3"
          >
            {LAYERS.map((layer, i) => {
              const isActive = active === i;
              const Icon = layer.icon;
              return (
                <motion.div
                  key={layer.id}
                  custom={i}
                  variants={layerVariants}
                  style={{ zIndex: isActive ? 50 : LAYERS.length - i }}
                  className="relative"
                >
                  <motion.button
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    id={`strata-tab-${layer.id}`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls="strata-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActive(i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    animate={{
                      x: isActive ? 16 : 0,
                      scale: isActive ? 1.02 : 0.98,
                    }}
                    transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                    className={cx(
                      "flex min-h-[84px] w-full items-center justify-between gap-4 rounded-lg border bg-[#111116] px-4 py-3 text-left transition-colors duration-200",
                      isActive
                        ? "border-[#6E56CF]/70 bg-[#19152a]"
                        : "border-white/10 hover:border-white/25",
                      FOCUS,
                    )}
                  >
                    <span className="flex min-w-0 items-start gap-3">
                      <Icon
                        className={cx(
                          "mt-0.5 h-4 w-4 shrink-0",
                          isActive ? "text-[#a894f7]" : "text-[#A1A1AA]",
                        )}
                        aria-hidden
                      />
                      <span className="min-w-0">
                        <span className="block text-[0.9rem] font-semibold text-white">
                          {layer.label}
                        </span>
                        <span className="mt-0.5 line-clamp-1 block text-xs font-normal text-[#A1A1AA]">
                          {layer.shortFinding}
                        </span>
                      </span>
                    </span>
                    <span
                      className={cx(
                        "shrink-0 text-base font-extrabold text-white",
                        NUM,
                      )}
                    >
                      {layer.score}
                    </span>
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* adjacent detail panel — swaps to the selected layer's full
            reasoning; a real content change driven by the click/keyboard
            interaction above, not a decorative animation. */}
        <div
          id="strata-panel"
          role="tabpanel"
          aria-live="polite"
          aria-labelledby={`strata-tab-${activeLayer.id}`}
          className="flex flex-col justify-between rounded-lg border border-white/10 bg-white/[0.02] p-5 sm:p-6"
        >
          <div>
            <p className={cx(CAPTION, "text-[#A1A1AA]")}>
              Layer {active + 1} of {LAYERS.length} — {activeLayer.label}
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={activeLayer.id}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
                className="mt-3 text-base font-normal leading-[1.6] text-white"
              >
                {activeLayer.fullReasoning}
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="mt-5 text-sm font-normal text-[#A1A1AA]">
            Layer score{" "}
            <span className={cx("font-semibold text-white", NUM)}>
              {activeLayer.score} / 100
            </span>
          </p>
        </div>
      </div>

      {/* verdict — aggregate match, grade, verified seller, and the real
          before/after discount, all visible at rest regardless of scroll or
          interaction state. Appears last, reading as the sequence's
          resolution rather than a random shuffle. */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.9 }}
        className="mt-6 flex flex-col gap-5 rounded-lg border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <div className="flex items-center gap-4">
          <div>
            <p className={cx(CAPTION, "text-[#A1A1AA]")}>Aggregate match</p>
            <p className={cx("mt-1 text-4xl font-extrabold text-white", NUM)}>
              {VERDICT.match}
              <span className="text-xl text-[#A1A1AA]">%</span>
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/25 px-2.5 py-1 text-xs font-semibold text-white">
            <Award className="h-3.5 w-3.5" aria-hidden />
            Grade {VERDICT.grade} · {VERDICT.gradeLabel}
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <span className="inline-flex items-center gap-1.5 text-sm font-normal text-[#A1A1AA]">
            <ShieldCheck className="h-4 w-4 text-[#6E56CF]" aria-hidden />
            {VERDICT.sellerName} · {VERDICT.sellerMeta}
          </span>
          <span className="flex items-baseline gap-2">
            <span className={cx("text-lg font-extrabold text-white", NUM)}>
              ${comma(VERDICT.price)}
            </span>
            <span
              className={cx(
                "text-sm font-normal text-[#A1A1AA] line-through",
                NUM,
              )}
            >
              ${comma(VERDICT.original)}
            </span>
            <span
              className={cx(
                "rounded bg-[#6E56CF] px-1.5 py-0.5 text-xs font-semibold text-white",
                NUM,
              )}
            >
              -{VERDICT.discount}%
            </span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
