"use client";

import { ArrowRight } from "lucide-react";
import type { BreakdownResult } from "./categories";
import { ACCENT, BORDER, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, PROSE_WIDTH_CTA, SURFACE } from "./tokens";

interface ClosingCtaProps {
  result: BreakdownResult;
}

/**
 * Closing CTA — cites the SAME `BreakdownResult` the Hero and the full device read from (passed
 * in as a prop, never re-derived or hand-typed), so the score, the max, and the active-category
 * count here always match whatever the visitor last configured above, all the way to the bottom
 * of the page.
 */
export function ClosingCta({ result }: ClosingCtaProps) {
  return (
    <section className="px-4 py-16 sm:px-8 sm:py-24 lg:px-12" style={{ backgroundColor: SURFACE }}>
      <div className="mx-auto max-w-[1180px] rounded-3xl p-8 sm:p-12" style={{ border: `1px solid ${BORDER}`, backgroundColor: "#FFFFFF" }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
          Ready to buy with confidence
        </p>
        <h2 className="mt-3 text-[26px] font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-[34px]" style={{ color: FG }}>
          This listing scores{" "}
          <span className="tabular-nums" style={{ color: ACCENT }}>
            {result.score} / {result.max}
          </span>{" "}
          under {result.mode}.
        </h2>
        <p className={`mt-3 text-[16px] font-normal leading-[1.6] ${PROSE_WIDTH_CTA}`} style={{ color: MUTED }}>
          With{" "}
          <span className="font-semibold tabular-nums" style={{ color: FG }}>
            {result.activeIds.size}
          </span>{" "}
          of 5 checks counted toward the score. Turn any of them back on above, or switch
          strictness, and this number follows it down to the checkout page.
        </p>
        <a
          href="#hero"
          className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold ${FOCUS_RING}`}
          style={{ backgroundColor: ACCENT, color: ON_ACCENT_TEXT }}
        >
          Adjust the breakdown
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <p className="mt-6 text-[11.5px] font-normal" style={{ color: MUTED }}>
          Demo listing and scoring for illustration. Category weights vary by item category.
        </p>
      </div>
    </section>
  );
}
