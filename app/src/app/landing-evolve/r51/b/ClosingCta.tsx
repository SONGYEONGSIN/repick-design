"use client";

import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import type { Listing } from "./data";
import { CRITERION_MAP, type CriterionId, type RankedItem } from "./rank-model";
import { ACCENT_FILL, ACCENT_LARGE, BORDER, GHOST, INK, MEASURE_16, MUTED } from "./tokens";

/**
 * Closing CTA. Both the headline and the body sentence cite the ACTUAL
 * current top-ranked listing and its ACTUAL computed score (`top`), and
 * the actual current #1 criterion (`leadId`) — the same `ranked`/`leadId`
 * values Hero reads, passed down from the one shared computation in
 * LandingExperience. Nothing here is a hardcoded string that merely looks
 * plausible.
 */
export default function ClosingCta({
  top,
  leadId,
  onBackToLadder,
}: {
  top: RankedItem<Listing>;
  leadId: CriterionId;
  onBackToLadder: () => void;
}) {
  const leadLabel = CRITERION_MAP[leadId].label;
  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="relative mx-auto max-w-6xl">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 right-0 select-none font-semibold"
          style={{ color: GHOST, fontSize: "clamp(2.25rem, 6vw, 4rem)", lineHeight: 1, letterSpacing: "0.04em" }}
        >
          05
        </span>
        <Reveal className="relative max-w-2xl">
          <p className="text-[12px] font-semibold uppercase" style={{ color: "#A21CAF", letterSpacing: "0.22em" }}>
            Closing
          </p>
          <h2
            className="mt-2 text-[clamp(1.75rem,5vw,3rem)] font-extrabold leading-[1.06]"
            style={{ fontFamily: "var(--font-display-wide)", color: INK, letterSpacing: "-0.02em" }}
          >
            {top.item.title} is your top match at{" "}
            <span style={{ color: ACCENT_LARGE }}>{top.score}%</span>.
          </h2>
          <p className="mt-4 font-normal leading-[1.6]" style={{ color: MUTED, maxWidth: MEASURE_16, fontSize: "16px" }}>
            That's with {leadLabel.toLowerCase()} leading your current ranking — built the way you ordered it above,
            not a default repick chose for you. List with the same AI match scoring, condition grading, and seller
            verification behind every number on this page.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]"
              style={{ backgroundColor: ACCENT_FILL, outlineColor: ACCENT_LARGE }}
            >
              Start listing on repick
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onBackToLadder}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ color: INK, border: `1px solid ${BORDER}`, outlineColor: ACCENT_LARGE }}
            >
              Adjust your ranking
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
