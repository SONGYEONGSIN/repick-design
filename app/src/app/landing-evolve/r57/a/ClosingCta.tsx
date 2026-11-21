"use client";

import { ArrowRight } from "lucide-react";
import { LISTINGS } from "./data";
import { eligibleCount, formatUsd } from "./model";
import { ACCENT, FG, FOCUS_RING, INK, MUTED, PROSE_WIDTH_CTA } from "./tokens";

interface ClosingCtaProps {
  min: number;
  max: number;
}

const displayFace = { fontFamily: "var(--font-display-grotesk)" };

/**
 * Cites the live eligible count by calling the same eligibleCount() the hero, value-split, and
 * checklist table all call — never a copy-pasted number that could go stale once this component
 * is composed in.
 */
export function ClosingCta({ min, max }: ClosingCtaProps) {
  const count = eligibleCount(LISTINGS, min, max);

  return (
    <section id="start" className="px-4 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="max-w-[760px]">
        <h2
          className="text-[clamp(1.9rem,4vw+1rem,2.8rem)] font-extrabold leading-[1.08] tracking-[-0.02em]"
          style={{ ...displayFace, color: FG }}
        >
          {count > 0 ? (
            <>
              <span style={{ color: ACCENT }}>{count}</span> of {LISTINGS.length} listings already
              pass every check.
            </>
          ) : (
            <>None of the six listings pass every check at this range yet.</>
          )}
        </h2>
        <p className={`mt-4 text-[16px] font-normal leading-[1.6] ${PROSE_WIDTH_CTA}`} style={{ color: MUTED }}>
          {count > 0 ? (
            <>
              Between {formatUsd(min)} and {formatUsd(max)}, that&apos;s how many are in budget,
              Good condition or better, from a verified seller, and shipping within three days —
              all four, at once, right now.
            </>
          ) : (
            <>Widen the range above and this count — and the checklist behind it — updates immediately.</>
          )}
        </p>
        <a
          href="#checklist"
          className={`mt-7 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold ${FOCUS_RING}`}
          style={{ backgroundColor: ACCENT, color: INK }}
        >
          Review the {count} eligible now
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
