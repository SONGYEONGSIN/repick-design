"use client";

import { ArrowRight } from "lucide-react";
import { CoverageDevice } from "./CoverageDevice";
import type { AddOnId, CoverageResult, CoverageState } from "./coverage";
import { ListingCard } from "./ListingCard";
import { LISTINGS } from "./listings";
import { ACCENT, EYEBROW, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, PROSE_WIDTH_HERO } from "./tokens";

interface HeroProps {
  state: CoverageState;
  result: CoverageResult;
  onToggle: (id: AddOnId) => void;
  onReset: () => void;
}

/**
 * Hero: headline, subhead, single CTA, AND the full "Add-On Combination Tier" device, AND one
 * full product-proof card (match %, condition grade, verified-seller badge, before/after
 * discount) are all literal descendants of this one component — never a sibling section rendered
 * after it. On mobile this collapses to a single column in plain source order (headline block
 * first, device+proof block second); no `order-*` utility ever reorders either block ahead of the
 * other, so the headline is never traded away to "win" the device's place in the fold, or vice
 * versa. The proof card renders in its `compact` form here specifically because a full-width
 * top-stacked photo would alone eat the mobile fold's vertical budget.
 */
export function Hero({ state, result, onToggle, onReset }: HeroProps) {
  const proofListing = LISTINGS[0];

  return (
    <section id="hero" className="px-4 pb-10 pt-6 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 lg:pb-20 lg:pt-12">
      <div className="grid max-w-[1180px] gap-6 lg:grid-cols-[1.08fr_1fr] lg:gap-12">
        {/* Column 1 in source order: headline, subhead, single CTA — never reordered. */}
        <div className="min-w-0">
          <p className={EYEBROW} style={{ color: ACCENT }}>
            Add-on coverage
          </p>
          <h1
            className="mt-2.5 text-[clamp(1.7rem,7vw+0.15rem,2.3rem)] font-extrabold leading-[1.08] tracking-[-0.02em] lg:text-[clamp(2.5rem,2.4vw+1.7rem,3.6rem)]"
            style={{ color: FG }}
          >
            Named by which add-ons you turn on. Not how many.
          </h1>
          <p className={`mt-3 text-[16px] font-normal leading-[1.55] ${PROSE_WIDTH_HERO}`} style={{ color: MUTED }}>
            Same &ldquo;2 of 3&rdquo; combo, different tier, different name, different price.
          </p>
          <a
            href="#lookup"
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT, color: ON_ACCENT_TEXT }}
          >
            See all seven tiers
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="mt-3 text-[13px] font-normal leading-[1.45]" style={{ color: MUTED }}>
            Right now:{" "}
            <span className="font-semibold tabular-nums" style={{ color: ACCENT }}>
              {result.tierLabel}
            </span>{" "}
            — total{" "}
            <span className="font-semibold tabular-nums" style={{ color: FG }}>
              ${result.total.toLocaleString("en-US")}
            </span>
            .
          </p>
        </div>

        {/* Column 2 in source order: the device, then the proof card — both inside Hero. */}
        <div className="min-w-0">
          <p id="coverage-label-hero" className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
            Choose your add-ons
          </p>
          <CoverageDevice
            state={state}
            result={result}
            onToggle={onToggle}
            onReset={onReset}
            compact
            headingId="coverage-label-hero"
          />

          <div className="mt-3">
            <ListingCard listing={proofListing} compact />
          </div>
        </div>
      </div>
    </section>
  );
}
