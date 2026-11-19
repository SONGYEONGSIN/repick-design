"use client";

import { ArrowRight } from "lucide-react";
import { DualRangeSlider } from "./DualRangeSlider";
import { ListingCard } from "./ListingCard";
import { LISTINGS, HANDLE_GAP, PRICE_MAX_BOUND, PRICE_MIN_BOUND, PRICE_STEP } from "./data";
import { eligibleCount, formatUsd } from "./model";
import { ACCENT, BORDER, EYEBROW, FG, FOCUS_RING, INK, MUTED, PROSE_WIDTH_HERO, SURFACE } from "./tokens";

interface HeroProps {
  min: number;
  max: number;
  onChangeMin: (n: number) => void;
  onChangeMax: (n: number) => void;
}

const displayFace = { fontFamily: "var(--font-display-grotesk)" };

/**
 * Hero: headline, subhead, single CTA, AND the full product proof (match %, condition grade,
 * verification badge, before/after discount — all four badge types, via the Mono Trail Sneaker
 * card below) AND the live dual-handle range slider are all literal descendants of THIS
 * component, never a sibling section rendered after it — so the structural requirement holds at
 * 390px too, where this exact JSX stacks into one column in source order (headline first, device
 * and proof second — nothing is reordered with a mobile-only `order-*` utility).
 */
export function Hero({ min, max, onChangeMin, onChangeMax }: HeroProps) {
  const count = eligibleCount(LISTINGS, min, max);
  const proofListing = LISTINGS[0];

  return (
    <section id="hero" className="px-4 pb-10 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 lg:pb-20 lg:pt-14">
      <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        {/* Left: headline, subhead, single CTA */}
        <div className="min-w-0">
          <p className={EYEBROW} style={{ color: ACCENT }}>
            Budget-fit matching
          </p>
          <h1
            className="mt-3 text-[clamp(2.1rem,7vw+0.6rem,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em] lg:text-[clamp(2.8rem,2.6vw+2rem,4.2rem)]"
            style={{ ...displayFace, color: FG }}
          >
            Set your range. See which listings actually qualify.
          </h1>
          <p
            className={`mt-4 text-[17px] font-normal leading-[1.6] ${PROSE_WIDTH_HERO}`}
            style={{ color: MUTED }}
          >
            Drag both handles below — every one of these six listings re-checks live against your
            budget, condition, seller, and shipping rules.
          </p>
          <a
            href="#checklist"
            className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT, color: INK }}
          >
            See the full checklist
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="mt-5 text-[13px] font-normal tabular-nums" style={{ color: MUTED }}>
            Right now, between {formatUsd(min)} and {formatUsd(max)}:{" "}
            <span className="font-semibold" style={{ color: ACCENT }}>
              {count} of {LISTINGS.length} listings
            </span>{" "}
            qualify.
          </p>
        </div>

        {/* Right: the manipulation device + one full proof card, both inside Hero */}
        <div className="min-w-0">
          <div
            className="rounded-2xl p-5"
            style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}
          >
            <DualRangeSlider
              bound={[PRICE_MIN_BOUND, PRICE_MAX_BOUND]}
              step={PRICE_STEP}
              gap={HANDLE_GAP}
              valueMin={min}
              valueMax={max}
              onChangeMin={onChangeMin}
              onChangeMax={onChangeMax}
              compact
            />
          </div>

          <div className="mt-4">
            <ListingCard listing={proofListing} min={min} max={max} compact />
          </div>
        </div>
      </div>
    </section>
  );
}
