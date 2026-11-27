"use client";

import { ArrowRight } from "lucide-react";
import { payoutAtDay, phaseAtDay, PHASE_LABEL } from "./curve";
import { ListingCard } from "./ListingCard";
import { LISTINGS } from "./listings";
import { TimingDial } from "./TimingDial";
import { ACCENT, EYEBROW, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, PROSE_WIDTH_HERO } from "./tokens";

const displayFace = { fontFamily: "var(--font-display-grotesk)" };

interface HeroProps {
  day: number;
  certified: boolean;
  onDayChange: (day: number) => void;
  onToggleCertified: () => void;
}

/**
 * Hero: headline, subhead, single CTA, AND the full Timing Dial device, AND one full
 * product-proof card (match %, condition grade, battery health, before/after discount) are all
 * literal descendants of this one component — never a sibling section rendered after it. On
 * mobile this collapses to a single column in source order; no `order-*` utility reorders either
 * block.
 */
export function Hero({ day, certified, onDayChange, onToggleCertified }: HeroProps) {
  const proofListing = LISTINGS[0];
  const payout = payoutAtDay(day, certified);
  const phase = phaseAtDay(day);

  return (
    <section id="hero" className="px-4 pb-10 pt-6 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 lg:pb-20 lg:pt-12">
      <div className="grid max-w-[1180px] gap-6 lg:grid-cols-[1.08fr_1fr] lg:gap-12">
        <div className="min-w-0">
          <p className={EYEBROW} style={{ color: ACCENT }}>
            Resale timing
          </p>
          <h1
            className="mt-2.5 text-[clamp(1.7rem,7vw+0.15rem,2.3rem)] font-extrabold leading-[1.08] tracking-[-0.02em] lg:text-[clamp(2.5rem,2.4vw+1.7rem,3.6rem)]"
            style={{ ...displayFace, color: FG }}
          >
            Drag the dial. Watch the curve tell you when to sell.
          </h1>
          <p className={`mt-3 text-[16px] font-normal leading-[1.55] ${PROSE_WIDTH_HERO}`} style={{ color: MUTED }}>
            Resale value follows a real curve, not a flat estimate — move the day and the certificate on, and watch the whole projection redraw.
          </p>
          <a
            href="#value"
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT, color: ON_ACCENT_TEXT }}
          >
            See the full projection
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="mt-3 text-[13px] font-normal leading-[1.45]" style={{ color: MUTED }}>
            Right now, day {day}:{" "}
            <span className="font-semibold tabular-nums" style={{ color: ACCENT }}>
              ${payout}
            </span>{" "}
            — {PHASE_LABEL[phase].toLowerCase()}.
          </p>
        </div>

        <div className="min-w-0">
          <p id="dial-label-hero" className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
            Choose your timeline
          </p>
          <TimingDial
            day={day}
            certified={certified}
            onDayChange={onDayChange}
            onToggleCertified={onToggleCertified}
            dialLabelId="dial-label-hero"
          />

          <div className="mt-3">
            <ListingCard listing={proofListing} compact />
          </div>
        </div>
      </div>
    </section>
  );
}
