"use client";

import { useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, Check } from "lucide-react";
import Radar from "./Radar";
import {
  AXES,
  LISTINGS,
  WEIGHT_LEVELS,
  DEFAULT_SELECTED,
  DEFAULT_LEVEL,
  idealProfile,
  matchPercent,
  listingVector,
  discountOf,
  strongestAxes,
  money,
  cx,
  EYEBROW,
  CAPTION,
  STAT,
  NUM,
  FOCUS,
  type AxisId,
} from "./data";

const GROTESK = { fontFamily: "var(--font-display-grotesk)" } as const;

/**
 * Hero + rich product preview in one. Left: editorial headline, subhead, single CTA. Right: the
 * criteria controls (a row of toggle chips = which axes matter, plus a Lenient/Balanced/Strict
 * segmented weight) and the stack of three listing cards. ONE manipulation drives THREE evidence
 * surfaces at once: every card's amber ideal polygon redraws, every match% recomputes, and the stack
 * re-sorts — while the per-card proof (match%, grade, cert badge, before→after discount) is fully
 * exposed at rest and only ever strengthened, never gated, by the controls.
 */
export default function MatchStudio() {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<AxisId[]>(DEFAULT_SELECTED);
  const [levelId, setLevelId] = useState(DEFAULT_LEVEL);
  const levelRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const groupId = useId();

  const level = WEIGHT_LEVELS.find((l) => l.id === levelId) ?? WEIGHT_LEVELS[1];
  const ideal = useMemo(() => idealProfile(selected, level.demand), [selected, level.demand]);

  const ranked = useMemo(
    () =>
      LISTINGS.map((l, i) => ({
        listing: l,
        order: i,
        match: matchPercent(listingVector(l), ideal),
      })).sort((a, b) => b.match - a.match || a.order - b.order),
    [ideal],
  );

  const toggleAxis = (id: AxisId) =>
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const chooseLevel = (i: number) => {
    const clamped = (i + WEIGHT_LEVELS.length) % WEIGHT_LEVELS.length;
    setLevelId(WEIGHT_LEVELS[clamped].id);
    levelRefs.current[clamped]?.focus();
  };

  const onLevelKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); chooseLevel(i + 1); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); chooseLevel(i - 1); }
    else if (e.key === "Home") { e.preventDefault(); chooseLevel(0); }
    else if (e.key === "End") { e.preventDefault(); chooseLevel(WEIGHT_LEVELS.length - 1); }
  };

  const top = ranked[0];

  return (
    <MotionConfig reducedMotion="user">
      <section id="hero" className="border-b border-white/10 bg-[#0B0B0F]">
        <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-start gap-12 px-5 pb-16 pt-10 sm:px-8 sm:pt-14 lg:grid-cols-12 lg:gap-12 lg:pb-24">
          {/* left — editorial */}
          <div className="lg:col-span-5">
            <p className={cx(EYEBROW, "text-[#fbbf24]")}>repick match engine</p>
            <h1
              style={GROTESK}
              className="mt-5 text-[clamp(2.1rem,7vw,2.9rem)] font-extrabold leading-[1.03] tracking-[-0.02em] text-white lg:text-[clamp(2.5rem,3.4vw,3.4rem)]"
            >
              Draw the buyer you are. Watch the resale rack answer.
            </h1>
            <p className="mt-6 max-w-[440px] text-base font-normal leading-[1.6] text-[#A1A1AA]">
              Every pre-owned listing carries a five-axis profile. Set which axes
              matter and each match score is the exact overlap of two shapes —
              proven, not promised.
            </p>

            <div className="mt-8">
              <motion.a
                href="#value"
                whileHover={reduced ? undefined : { y: -2 }}
                whileTap={reduced ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={cx(
                  "inline-flex items-center justify-center gap-2 rounded-full bg-[#b45309] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#96450a]",
                  FOCUS,
                )}
              >
                See how a match is scored
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </motion.a>
            </div>

            <p className="mt-8 max-w-[420px] text-sm font-normal leading-[1.6] text-[#A1A1AA]">
              <span className="font-semibold text-white">Reading the chart:</span>{" "}
              the amber polygon is what you asked for; the pale one is the listing.
              The more they overlap, the higher the match.
            </p>
          </div>

          {/* right — controls + re-sorting card stack */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 style={GROTESK} className="text-xl font-extrabold tracking-[-0.01em] text-white">
                Ranked to your criteria
              </h2>
              <p className={cx(NUM, CAPTION, "text-[#A1A1AA]")}>{LISTINGS.length} listings</p>
            </div>

            {/* criteria chips */}
            <div
              role="group"
              aria-label="Which criteria matter to you"
              className="mt-4 flex flex-wrap gap-2"
            >
              {AXES.map((a) => {
                const on = selected.includes(a.id);
                const Icon = a.icon;
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleAxis(a.id)}
                    className={cx(
                      "inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-150",
                      on
                        ? "border-[#b45309] bg-[#b45309] text-white"
                        : "border-white/15 bg-white/[0.02] text-[#A1A1AA] hover:text-white",
                      FOCUS,
                    )}
                  >
                    {on ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={2.75} aria-hidden />
                    ) : (
                      <Icon className="h-3.5 w-3.5 text-[#fbbf24]" strokeWidth={2} aria-hidden />
                    )}
                    {a.label}
                  </button>
                );
              })}
            </div>

            {/* weight segmented control */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className={cx(STAT, "text-[#A1A1AA]")} id={`${groupId}-wlabel`}>
                How demanding
              </span>
              <div
                role="radiogroup"
                aria-labelledby={`${groupId}-wlabel`}
                className="inline-flex rounded-full border border-white/15 bg-white/[0.02] p-1"
              >
                {WEIGHT_LEVELS.map((l, i) => {
                  const on = l.id === levelId;
                  return (
                    <button
                      key={l.id}
                      ref={(el) => { levelRefs.current[i] = el; }}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      tabIndex={on ? 0 : -1}
                      onClick={() => setLevelId(l.id)}
                      onKeyDown={(e) => onLevelKey(e, i)}
                      className={cx(
                        "min-h-[32px] rounded-full px-3.5 py-1 text-xs font-semibold transition-colors duration-150",
                        on ? "bg-[#b45309] text-white" : "text-[#A1A1AA] hover:text-white",
                        FOCUS,
                      )}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="sr-only" aria-live="polite">
              Top match: {top.listing.title}, {top.match} percent.
            </p>

            {/* card stack — re-sorts by match% */}
            <ul className="mt-5 flex flex-col gap-3">
              {ranked.map(({ listing, match }, rank) => {
                const strong = strongestAxes(listing, selected, level.demand);
                return (
                  <motion.li
                    key={listing.id}
                    layout
                    transition={{ type: "spring", stiffness: 460, damping: 40 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5"
                  >
                    {/* ghost rank numeral */}
                    <span
                      aria-hidden
                      className={cx(
                        NUM,
                        "pointer-events-none absolute -right-1 -top-3 select-none text-6xl font-extrabold leading-none text-white/[0.04]",
                      )}
                    >
                      {rank + 1}
                    </span>

                    <div className="flex items-center gap-4">
                      {/* photo — reserved, no proof overlaid */}
                      <div className="relative aspect-square w-14 shrink-0 overflow-hidden rounded-lg bg-[#1B1B22] sm:w-16">
                        <Image
                          src={listing.image.src}
                          alt={listing.image.alt}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className={cx(CAPTION, "text-[#A1A1AA]")}>
                          {listing.brand} · {listing.category}
                        </p>
                        <h3 className="mt-0.5 truncate text-base font-extrabold tracking-[-0.01em] text-white sm:text-lg">
                          <a href="#value" className={cx("rounded", FOCUS)}>
                            {listing.title}
                          </a>
                        </h3>
                      </div>

                      {/* radar */}
                      <div className="h-[92px] w-[92px] shrink-0 sm:h-[104px] sm:w-[104px]">
                        <Radar
                          listingValues={listingVector(listing)}
                          idealValues={ideal}
                          match={match}
                        />
                      </div>
                    </div>

                    {/* proof row — real data, never on the photo */}
                    <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
                      <div>
                        <dt className={cx(STAT, "text-[#A1A1AA]")}>Match</dt>
                        <dd className={cx(NUM, "mt-0.5 text-lg font-extrabold text-[#fbbf24]")}>
                          {match}%
                        </dd>
                      </div>
                      <div>
                        <dt className={cx(STAT, "text-[#A1A1AA]")}>Condition</dt>
                        <dd className="mt-0.5 text-lg font-extrabold text-white">{listing.grade}</dd>
                      </div>
                      <div>
                        <dt className={cx(STAT, "text-[#A1A1AA]")}>Verified</dt>
                        <dd className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-white">
                          <BadgeCheck className="h-4 w-4 text-[#fbbf24]" strokeWidth={2} aria-hidden />
                          {listing.certified ? "Yes" : "No"}
                        </dd>
                      </div>
                    </dl>

                    {/* price row — before → after */}
                    <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-white/10 pt-3">
                      <div className="flex items-baseline gap-2">
                        <span className={cx(NUM, "text-xl font-extrabold text-white")}>
                          {money(listing.price)}
                        </span>
                        <span className={cx(NUM, "text-sm font-normal text-[#A1A1AA] line-through")}>
                          {money(listing.original)}
                        </span>
                      </div>
                      <span
                        className={cx(
                          NUM,
                          "rounded-full bg-[#b45309] px-2.5 py-1 text-xs font-semibold text-white",
                        )}
                      >
                        {discountOf(listing)}% off
                      </span>
                    </div>

                    {/* hover/focus micro-detail — adds context, never gates the proof above */}
                    <p
                      className={cx(
                        CAPTION,
                        "mt-2 text-[#A1A1AA] transition-colors duration-200 group-hover:text-[#fbbf24] group-focus-within:text-[#fbbf24] motion-reduce:transition-none",
                      )}
                    >
                      {strong.length
                        ? `Fully meets ${strong.join(" · ")}`
                        : "Below your bar on every chosen axis"}
                    </p>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
