"use client";

import { ArrowRight } from "lucide-react";
import { ListingCard } from "./ListingCard";
import { LISTINGS } from "./listings";
import { TriageTree } from "./TriageTree";
import type { DeviceType } from "./tree";
import { trailFor } from "./tree";
import { ACCENT, EYEBROW, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, PROSE_WIDTH_HERO } from "./tokens";

const displayFace = { fontFamily: "var(--font-display-wide)" };

interface HeroProps {
  deviceType: DeviceType | null;
  conditionId: string | null;
  urgent: boolean;
  onSetDevice: (d: DeviceType) => void;
  onSetCondition: (c: string) => void;
  onClearCondition: () => void;
  onClearDevice: () => void;
  onToggleUrgent: () => void;
}

/**
 * Hero: headline, subhead, single CTA, AND the full Triage Tree device, AND one full
 * product-proof card (match %, condition grade, verified-seller badge, before/after discount) are
 * all literal descendants of this one component — never a sibling section rendered after it. On
 * mobile this collapses to a single column in source order; no `order-*` utility reorders either
 * block.
 */
export function Hero({
  deviceType,
  conditionId,
  urgent,
  onSetDevice,
  onSetCondition,
  onClearCondition,
  onClearDevice,
  onToggleUrgent,
}: HeroProps) {
  const proofListing = LISTINGS[0];

  return (
    <section id="hero" className="px-4 pb-10 pt-6 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 lg:pb-20 lg:pt-12">
      <div className="grid max-w-[1180px] gap-6 lg:grid-cols-[1.08fr_1fr] lg:gap-12">
        <div className="min-w-0">
          <p className={EYEBROW} style={{ color: ACCENT }}>
            Trade-in triage
          </p>
          <h1
            className="mt-2.5 text-[clamp(1.7rem,7vw+0.15rem,2.3rem)] font-extrabold leading-[1.08] tracking-[-0.02em] lg:text-[clamp(2.5rem,2.4vw+1.7rem,3.6rem)]"
            style={{ ...displayFace, color: FG }}
          >
            Two questions. One tree. A real number at the end.
          </h1>
          <p className={`mt-3 text-[16px] font-normal leading-[1.55] ${PROSE_WIDTH_HERO}`} style={{ color: MUTED }}>
            Answer what you&rsquo;re trading in, then its condition — the second question changes with the first, and the path lights up as you go.
          </p>
          <a
            href="#value"
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold ${FOCUS_RING}`}
            style={{ backgroundColor: ACCENT, color: ON_ACCENT_TEXT }}
          >
            See the full tree
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="mt-3 text-[13px] font-normal leading-[1.45]" style={{ color: MUTED }}>
            Current path:{" "}
            <span className="font-semibold" style={{ color: ACCENT }}>
              {trailFor(deviceType, conditionId)}
            </span>
          </p>
        </div>

        <div className="min-w-0">
          <TriageTree
            deviceType={deviceType}
            conditionId={conditionId}
            urgent={urgent}
            onSetDevice={onSetDevice}
            onSetCondition={onSetCondition}
            onClearCondition={onClearCondition}
            onClearDevice={onClearDevice}
            onToggleUrgent={onToggleUrgent}
            compact
          />

          <div className="mt-3">
            <ListingCard listing={proofListing} compact />
          </div>
        </div>
      </div>
    </section>
  );
}
