"use client";

import { ArrowRight } from "lucide-react";
import type { ReplayResult } from "./frames";
import { ACCENT, BORDER, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, PROSE_WIDTH_CTA, SURFACE } from "./tokens";

interface ClosingCtaProps {
  result: ReplayResult;
}

/**
 * Closing CTA — cites the SAME `ReplayResult` the Hero and the full device read from (passed in
 * as a prop, never re-derived or hand-typed), so the frame label, price, and confidence here
 * always match wherever the visitor last left the scrubber, all the way to the bottom of the
 * page.
 */
export function ClosingCta({ result }: ClosingCtaProps) {
  return (
    <section className="px-4 py-16 sm:px-8 sm:py-24 lg:px-12" style={{ backgroundColor: SURFACE }}>
      <div className="mx-auto max-w-[1180px] rounded-3xl p-8 sm:p-12" style={{ border: `1px solid ${BORDER}` }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
          Ready to check out
        </p>
        <h2 className="mt-3 text-[26px] font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-[34px]" style={{ color: FG }}>
          At &ldquo;{result.frame.label}&rdquo;, the price is{" "}
          <span className="tabular-nums" style={{ color: ACCENT }}>
            ${result.finalPriceAtFrame.toLocaleString("en-US")}
          </span>
          .
        </h2>
        <p className={`mt-3 text-[16px] font-normal leading-[1.6] ${PROSE_WIDTH_CTA}`} style={{ color: MUTED }}>
          Overall confidence at this point in the replay is{" "}
          <span className="font-semibold tabular-nums" style={{ color: FG }}>
            {result.overallConfidence}%
          </span>
          {result.escalated ? ", including one human-reviewed override." : "."} Scrub back to any
          earlier frame above and this number follows it down.
        </p>
        <a
          href="#hero"
          className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold ${FOCUS_RING}`}
          style={{ backgroundColor: ACCENT, color: ON_ACCENT_TEXT }}
        >
          Replay the inspection
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <p className="mt-6 text-[11.5px] font-normal" style={{ color: MUTED }}>
          Demo listing and pricing for illustration. Deduction amounts vary by item and condition.
        </p>
      </div>
    </section>
  );
}
