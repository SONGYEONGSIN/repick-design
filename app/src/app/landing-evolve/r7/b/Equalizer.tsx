"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  animate,
} from "framer-motion";
import { BadgeCheck, SlidersHorizontal } from "lucide-react";
import {
  CRITERIA,
  HERO_MATCH,
  HERO_ITEM,
  EASE,
  CAPTION,
  NUM,
  cx,
  comma,
} from "./data";

const BAR_TRACK_HEIGHT = 132; // px — fixed track; only scaleY (transform) animates within it
const STAGGER = 0.1;
const BAR_DURATION = 0.8;
const COUNT_DURATION = 0.6 + CRITERIA.length * STAGGER + BAR_DURATION * 0.5;

/**
 * Confidence Equalizer — the hero's output-visualization device. The AI has
 * already computed a single match score; this widget doesn't let you tune
 * anything to produce that number — it shows the five signals that were
 * mixed to reach it, each rendered as a vertical bar whose height is that
 * signal's real, fixed contribution. Selecting a bar (click, or arrow keys
 * via roving tabindex) swaps the evidence panel below to that channel's
 * actual finding — manipulation here means *exploring* a real result, not
 * generating one. Bars fill and the total score counts up together on a
 * deterministic, staggered fixed-delay schedule (no Math.random/Date.now),
 * gated by prefers-reduced-motion so nothing is ever stuck at opacity/height 0.
 */
export default function Equalizer() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);
  const [active, setActive] = useState(0);
  const barRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, HERO_MATCH, {
      duration: COUNT_DURATION,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced]);

  const shown = reduced ? HERO_MATCH : display;
  const current = CRITERIA[active];

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % CRITERIA.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (i - 1 + CRITERIA.length) % CRITERIA.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = CRITERIA.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    barRefs.current[next]?.focus();
  }

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-lg border border-white/15 bg-[#111116] p-[1px]"
    >
      <div className="rounded-[7px] p-6 ring-1 ring-inset ring-white/[0.06] sm:p-8">
        {/* header: item under appraisal + live total */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-white/10">
              <Image
                src={HERO_ITEM.image}
                alt={HERO_ITEM.alt}
                fill
                sizes="56px"
                className="object-cover"
              />
            </span>
            <div className="min-w-0">
              <p className={cx(CAPTION, "flex items-center gap-1.5 text-[#a894f7]")}>
                <SlidersHorizontal className="h-3 w-3" aria-hidden />
                Match Equalizer
              </p>
              <h2 className="mt-1 truncate text-sm font-semibold tracking-[-0.02em] text-white sm:text-base">
                {HERO_ITEM.title}
              </h2>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p
              aria-hidden
              className={cx(NUM, "text-3xl font-extrabold leading-none text-white sm:text-4xl")}
            >
              {shown}
              <span className="text-lg text-[#A1A1AA]">%</span>
            </p>
            <span className="sr-only">{HERO_MATCH}% overall match score</span>
            <p className={cx(CAPTION, "mt-1 text-[#A1A1AA]")}>Overall</p>
          </div>
        </div>

        {/* bar chart — five channels, roving tabindex, always-on value labels */}
        <div
          role="tablist"
          aria-label="Match score channels"
          className="mt-7 grid grid-cols-5 items-end gap-2 border-t border-white/10 pt-6 sm:gap-3"
        >
          {CRITERIA.map((c, i) => {
            const Icon = c.icon;
            const selected = i === active;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`channel-tab-${c.id}`}
                aria-selected={selected}
                aria-controls={`channel-panel-${c.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={cx(
                  "group flex flex-col items-center gap-2 rounded-md py-1.5 transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116] focus-visible:ring-[#6E56CF]",
                )}
              >
                <span className={cx(NUM, "text-[0.65rem] font-semibold text-[#A1A1AA]")}>
                  {c.value}
                </span>
                <span
                  className="relative flex w-full items-end justify-center overflow-hidden rounded-t-sm bg-white/[0.06]"
                  style={{ height: BAR_TRACK_HEIGHT }}
                >
                  <motion.span
                    aria-hidden
                    className={cx(
                      "absolute inset-x-0 bottom-0 w-full rounded-t-sm transition-colors duration-150",
                      selected ? "bg-[#6E56CF]" : "bg-white/25 group-hover:bg-white/40",
                    )}
                    style={{ height: `${c.value}%`, transformOrigin: "bottom" }}
                    initial={reduced ? false : { scaleY: 0 }}
                    animate={inView ? { scaleY: 1 } : {}}
                    transition={{
                      duration: BAR_DURATION,
                      ease: EASE,
                      delay: reduced ? 0 : i * STAGGER,
                    }}
                  />
                </span>
                <Icon
                  className={cx(
                    "h-3.5 w-3.5 shrink-0",
                    selected ? "text-[#6E56CF]" : "text-[#A1A1AA]",
                  )}
                  strokeWidth={2}
                  aria-hidden
                />
                <span
                  className={cx(
                    CAPTION,
                    "text-[0.6rem]",
                    selected ? "text-white" : "text-[#A1A1AA]",
                  )}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* evidence panel — swaps to the selected channel's real finding */}
        <motion.div
          key={current.id}
          role="tabpanel"
          id={`channel-panel-${current.id}`}
          aria-labelledby={`channel-tab-${current.id}`}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="mt-6 rounded-md border border-white/10 bg-white/[0.02] p-4"
        >
          <p className={cx(CAPTION, "text-[#A1A1AA]")}>{current.fullLabel}</p>
          <p className="mt-2 text-sm font-normal leading-[1.6] text-white">
            {current.evidence}
          </p>
        </motion.div>

        {/* seller + price — product context stays on file, never hover-gated */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-white/10 pt-5">
          <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-white">
            <BadgeCheck className="h-4 w-4 text-[#6E56CF]" aria-hidden />
            {HERO_ITEM.seller}
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className={cx("text-base font-extrabold text-white", NUM)}>
              ${comma(HERO_ITEM.price)}
            </span>
            <span className={cx("text-xs font-normal text-[#A1A1AA] line-through", NUM)}>
              ${comma(HERO_ITEM.original)}
            </span>
            <span className={cx("rounded bg-[#6E56CF] px-1.5 py-0.5 text-[0.7rem] font-semibold text-white", NUM)}>
              -{HERO_ITEM.discount}%
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
