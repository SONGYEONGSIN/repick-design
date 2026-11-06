"use client";

import { ArrowRight } from "lucide-react";
import { PlayheadScrub } from "./PlayheadScrub";
import { HeroProofCard } from "./HeroProofCard";
import { HERO_PRODUCTS, formatCount, periodLabel, weekAt } from "./data";
import {
  ACCENT_FILL,
  ACCENT_FILL_HOVER,
  ACCENT_TINT_TEXT,
  CARD_BG_CLASS,
  CARD_BORDER,
  EYEBROW,
  FOCUS_RING,
  INK_CLASS,
  MUTED_TEXT,
  ON_ACCENT_TEXT,
  PROSE_WIDTH_14,
} from "./tokens";

interface HeroProps {
  weekIndex: number;
  onScrub: (index: number) => void;
}

/**
 * The hero carries the whole mechanic AND the fold-proof proof cards inside this one component
 * — never a sibling section. Left: headline/subhead/CTA. Right: the single-point playhead
 * scrubber with its live stat panel. Below both, still inside Hero: two fully-badged product
 * cards (match% + grade + verified + discount, all four, every time) whose caption cites the
 * CURRENT scrub position live — so the fold-proof requirement is satisfiable at the default
 * "this week" position before any dragging happens, and stays truthful once a visitor drags.
 */
export function Hero({ weekIndex, onScrub }: HeroProps) {
  const current = weekAt(weekIndex);

  return (
    <section className="border-b border-white/10 px-4 pb-6 pt-5 sm:px-6 lg:px-10 lg:pb-8 lg:pt-6" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-8">
          {/* Left: asymmetric headline block, not centered */}
          <div className="flex min-w-0 flex-col justify-center gap-3">
            <p className={`${EYEBROW} ${ACCENT_TINT_TEXT}`}>Scrub the market, not a spreadsheet</p>
            <h1
              id="hero-heading"
              className={`text-[clamp(1.9rem,7vw,2.5rem)] lg:text-[clamp(2.25rem,3.4vw,3.25rem)] font-extrabold leading-[1.08] tracking-[-0.02em] ${INK_CLASS}`}
            >
              Drag one playhead,
              <br />
              watch <span className={ACCENT_TINT_TEXT}>12 weeks</span> of matches move.
            </h1>
            {/* Width tracks font-size per breakpoint (0.44em avg-advance formula): 14px body ->
                431px (PROSE_WIDTH_14, ~70 chars); 16px body at lg -> 493px (~70 chars). */}
            <p className={`${PROSE_WIDTH_14} text-sm font-normal leading-[1.6] ${MUTED_TEXT} lg:max-w-[30.8125rem] lg:text-base`}>
              One point on a fixed timeline, scrubbed like a video. Drag it, or use the arrow
              keys, and matches found, average payout and items sold update to that exact week.
            </p>
            <div>
              <a
                href="#catalog"
                className={`inline-flex items-center gap-2 rounded-full ${ACCENT_FILL} px-5 py-2.5 text-sm font-semibold ${ON_ACCENT_TEXT} transition-colors duration-200 ${ACCENT_FILL_HOVER} ${FOCUS_RING}`}
              >
                See today&apos;s verified listings
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right: the single-point playhead scrubber, inside the Hero component itself. */}
          <div className={`flex min-w-0 flex-col rounded-2xl border ${CARD_BORDER} ${CARD_BG_CLASS} p-3 sm:p-3.5`}>
            <PlayheadScrub index={weekIndex} onChange={onScrub} />
          </div>
        </div>

        {/* Fully-badged proof cards — inside Hero, visible with zero scroll at 1280-1920px.
            Compact horizontal cards (see HeroProofCard) so this block stays short regardless of
            viewport height, not just viewport width. */}
        <div className="mt-5 lg:mt-6">
          <p className={`mb-2.5 text-xs font-normal ${MUTED_TEXT}`}>
            Showing 2 of{" "}
            <span className={`font-semibold tabular-nums ${INK_CLASS}`}>{formatCount(current.matchesFound)}</span>{" "}
            matches found {periodLabel(weekIndex)}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {HERO_PRODUCTS.map((product) => (
              <HeroProofCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
