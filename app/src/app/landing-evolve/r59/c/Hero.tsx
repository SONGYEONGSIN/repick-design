"use client";

import { ArrowRight } from "lucide-react";
import { deriveBreakdown } from "./categories";
import { ListingCard } from "./ListingCard";
import { LISTINGS } from "./listings";
import { TrustBreakdown } from "./TrustBreakdown";
import { ACCENT, EYEBROW, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, PROSE_WIDTH_HERO } from "./tokens";
import type { StrictnessMode } from "./categories";

interface HeroProps {
  activeIds: Set<string>;
  mode: StrictnessMode;
  onToggleCategory: (id: string) => void;
  onSetMode: (mode: StrictnessMode) => void;
}

/**
 * Hero: headline, subhead, single CTA, AND the compact Trust Breakdown device, AND one full
 * product-proof card (match %, condition grade, verified-seller badge, before/after discount)
 * are all literal descendants of this one component — never a sibling section rendered after it.
 * On mobile this collapses to a single column in source order; no `order-*` utility reorders
 * either block.
 */
export function Hero({ activeIds, mode, onToggleCategory, onSetMode }: HeroProps) {
  const proofListing = LISTINGS[0];
  const result = deriveBreakdown(activeIds, mode);

  return (
    <section id="hero" className="px-4 pb-10 pt-6 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 lg:pb-20 lg:pt-12">
      <div className="grid max-w-[1180px] gap-6 lg:grid-cols-[1.08fr_1fr] lg:gap-12">
        <div className="min-w-0">
          <p className={EYEBROW} style={{ color: ACCENT }}>
            Trust breakdown
          </p>
          <h1
            className="mt-2.5 text-[clamp(1.7rem,7vw+0.15rem,2.3rem)] font-extrabold leading-[1.08] tracking-[-0.02em] lg:text-[clamp(2.5rem,2.4vw+1.7rem,3.6rem)]"
            style={{ color: FG }}
          >
            Turn off a check. Watch the score explain why it moved.
          </h1>
          <p className={`mt-3 text-[16px] font-normal leading-[1.55] ${PROSE_WIDTH_HERO}`} style={{ color: MUTED }}>
            Five inspection categories, each worth a fixed number of points — toggle any of them and switch how strictly they&apos;re weighed.
          </p>
          <a
            href="#device"
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT, color: ON_ACCENT_TEXT }}
          >
            See the full breakdown
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="mt-3 text-[13px] font-normal leading-[1.45]" style={{ color: MUTED }}>
            Right now:{" "}
            <span className="font-semibold tabular-nums" style={{ color: ACCENT }}>
              {result.score} / {result.max}
            </span>{" "}
            on {mode}.
          </p>
        </div>

        <div className="min-w-0">
          <p id="breakdown-label-hero" className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
            Toggle what counts
          </p>
          <TrustBreakdown
            activeIds={activeIds}
            mode={mode}
            onToggleCategory={onToggleCategory}
            onSetMode={onSetMode}
            compact
            groupLabelId="breakdown-label-hero"
          />

          <div className="mt-3">
            <ListingCard listing={proofListing} compact />
          </div>
        </div>
      </div>
    </section>
  );
}
