"use client";

import { ArrowRight } from "lucide-react";
import RankDevice from "./RankDevice";
import TopPickCard from "./TopPickCard";
import NarrativeOutput from "./NarrativeOutput";
import { getRankResult, type CriterionId } from "./lib";
import { FOCUS_RING, DISPLAY_FONT_STYLE, ACCENT } from "./ui";

interface HeroProps {
  order: CriterionId[];
  onReorder: (next: CriterionId[]) => void;
}

/**
 * Full-bleed single wide canvas — no app-chrome side rail, text column and
 * the interactive device live together in one grid. The device, its live
 * narrative sentence, and all four proof-badge types (match %, condition
 * grade, verification, before/after discount) render here, fully, on first
 * paint — literal children of Hero, not a sibling section — and hold at
 * every viewport, including the 390px stack where this column simply moves
 * below the headline in document order rather than disappearing.
 */
export default function Hero({ order, onReorder }: HeroProps) {
  const result = getRankResult(order);

  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative">
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-12 sm:px-6 sm:pt-16 sm:pb-16 lg:px-8 lg:pt-24 lg:pb-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: headline, subhead, single primary CTA — asymmetric, left-aligned. */}
          <div className="min-w-0 lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT }}>
              Verified camera resale
            </p>
            <h1
              id="hero-heading"
              style={DISPLAY_FONT_STYLE}
              className="mt-3 text-[clamp(2.25rem,8vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white lg:mt-5 lg:text-[clamp(3rem,5vw,4.75rem)] lg:leading-[1.03]"
            >
              Rank what matters.
              <br />
              We surface the match.
            </h1>
            <p className="mt-4 max-w-[480px] text-base leading-[1.6] text-zinc-300 lg:mt-6">
              Drag your four priorities into order and FOCAL recalculates
              which listing actually fits — plus the exact trade-off behind
              that pick, in one plain-language sentence.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 lg:mt-8">
              <a
                href="#proof"
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-colors hover:brightness-110 ${FOCUS_RING}`}
                style={{ backgroundColor: ACCENT }}
              >
                Browse ranked listings
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="text-xs text-zinc-400 tabular-nums">
                {result.scored.length} listings tracked · reorder any time
              </span>
            </div>
          </div>

          {/* Right: the interactive device + live proof, side by side with the
              text column on desktop, stacked below it on mobile — never after
              the headline is pushed off the first mobile screen, since the
              text column above is short enough to clear on its own. */}
          <div className="min-w-0 lg:col-span-7">
            <RankDevice order={order} onReorder={onReorder} />

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Fig. 02 — Top recomputed pick
                </p>
                <div className="mt-2">
                  <TopPickCard listing={result.top} />
                </div>
              </div>
              <div className="min-w-0 self-end">
                <NarrativeOutput result={result} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
