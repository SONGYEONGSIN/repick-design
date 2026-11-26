"use client";

import { ArrowRight } from "lucide-react";
import type { GradeId } from "./grades";
import { deriveLadder, formatUsd } from "./grades";
import { GradeLadder } from "./GradeLadder";
import { ListingCard } from "./ListingCard";
import { LISTINGS } from "./listings";
import { ACCENT, EYEBROW, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, PROSE_WIDTH_HERO } from "./tokens";

interface HeroProps {
  gradeId: GradeId;
  includeAccessories: boolean;
  onSelectGrade: (id: GradeId) => void;
  onToggleAccessories: () => void;
}

/**
 * Hero: headline, subhead, single CTA, AND the compact Grade Ladder device, AND one full
 * product-proof card (match %, condition grade, verified-seller badge, before/after discount)
 * are all literal descendants of this one component — never a sibling section rendered after it.
 * On mobile this collapses to a single column in source order (headline block first, device+
 * proof block second); no `order-*` utility ever reorders either block. The proof card's
 * Condition badge is overridden to the ladder's LIVE selection (not the listing's static grade),
 * so the control's effect is visible inside the Hero itself, not only in sections further down.
 */
export function Hero({ gradeId, includeAccessories, onSelectGrade, onToggleAccessories }: HeroProps) {
  const proofListing = LISTINGS[0];
  const result = deriveLadder(gradeId, includeAccessories);

  return (
    <section id="hero" className="px-4 pb-10 pt-6 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 lg:pb-20 lg:pt-12">
      <div className="grid max-w-[1180px] gap-6 lg:grid-cols-[1.08fr_1fr] lg:gap-12">
        {/* Column 1 in source order: headline, subhead, single CTA — never reordered. */}
        <div className="min-w-0">
          <p className={EYEBROW} style={{ color: ACCENT }}>
            Resale pricing
          </p>
          <h1
            className="mt-2.5 text-[clamp(1.7rem,7vw+0.15rem,2.3rem)] font-extrabold leading-[1.08] tracking-[-0.02em] lg:text-[clamp(2.5rem,2.4vw+1.7rem,3.6rem)]"
            style={{ color: FG, fontFamily: "var(--font-display-grotesk)" }}
          >
            Climb the ladder. Watch the price move with you.
          </h1>
          <p className={`mt-3 text-[16px] font-normal leading-[1.55] ${PROSE_WIDTH_HERO}`} style={{ color: MUTED }}>
            Four condition grades, one price band each — pick a rung and see exactly what it lets through.
          </p>
          <a
            href="#device"
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT, color: ON_ACCENT_TEXT }}
          >
            See every grade&apos;s rules
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="mt-3 text-[13px] font-normal leading-[1.45]" style={{ color: MUTED }}>
            Right now:{" "}
            <span className="font-semibold" style={{ color: ACCENT }}>
              Grade {result.grade.label}
            </span>{" "}
            — band{" "}
            <span className="font-semibold tabular-nums" style={{ color: FG }}>
              {formatUsd(result.priceLow)}–{formatUsd(result.priceHigh)}
            </span>
            .
          </p>
        </div>

        {/* Column 2 in source order: the device, then the proof card — both inside Hero. */}
        <div className="min-w-0">
          <p id="ladder-label-hero" className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
            Choose a grade
          </p>
          <GradeLadder
            gradeId={gradeId}
            includeAccessories={includeAccessories}
            onSelectGrade={onSelectGrade}
            onToggleAccessories={onToggleAccessories}
            compact
            headingId="ladder-label-hero"
          />

          <div className="mt-3">
            <ListingCard listing={proofListing} compact conditionGradeOverride={`Grade ${result.grade.label}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
