"use client";

import { ArrowRight } from "lucide-react";
import type { LadderResult } from "./grades";
import { formatUsd } from "./grades";
import { ACCENT, BORDER, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, PROSE_WIDTH_CTA, SURFACE } from "./tokens";

interface ClosingCtaProps {
  result: LadderResult;
  includeAccessories: boolean;
}

/**
 * Closing CTA — cites the SAME `LadderResult` the Hero and the full device read from (passed in
 * as a prop, never re-derived or hand-typed), so the grade, price band, and 12-month resale
 * figure here always match whatever rung the visitor last clicked, all the way to the bottom of
 * the page.
 */
export function ClosingCta({ result, includeAccessories }: ClosingCtaProps) {
  return (
    <section className="px-4 py-16 sm:px-8 sm:py-24 lg:px-12" style={{ backgroundColor: SURFACE }}>
      <div className="mx-auto max-w-[1180px] rounded-3xl p-8 sm:p-12" style={{ border: `1px solid ${BORDER}`, backgroundColor: "#FFFFFF" }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
          Ready to list or buy
        </p>
        <h2 className="mt-3 text-[26px] font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-[34px]" style={{ color: FG }}>
          Grade <span style={{ color: ACCENT }}>{result.grade.label}</span> holds{" "}
          <span className="tabular-nums" style={{ color: ACCENT }}>
            {result.resale12}%
          </span>{" "}
          of value at 12 months.
        </h2>
        <p className={`mt-3 text-[16px] font-normal leading-[1.6] ${PROSE_WIDTH_CTA}`} style={{ color: MUTED }}>
          At this grade the current band is{" "}
          <span className="font-semibold tabular-nums" style={{ color: FG }}>
            {formatUsd(result.priceLow)}–{formatUsd(result.priceHigh)}
          </span>
          {includeAccessories ? ", with original accessories included." : " without original accessories."} Climb or
          drop a rung above and this number updates with it.
        </p>
        <a
          href="#hero"
          className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold ${FOCUS_RING}`}
          style={{ backgroundColor: ACCENT, color: ON_ACCENT_TEXT }}
        >
          Pick your grade
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <p className="mt-6 text-[11.5px] font-normal" style={{ color: MUTED }}>
          Demo listing and pricing for illustration. Resale figures are historical averages, not guarantees.
        </p>
      </div>
    </section>
  );
}
