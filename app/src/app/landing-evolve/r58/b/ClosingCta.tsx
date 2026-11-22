"use client";

import { ArrowRight } from "lucide-react";
import type { CoverageResult } from "./coverage";
import { ACCENT, BORDER, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, PROSE_WIDTH_CTA, SURFACE } from "./tokens";

interface ClosingCtaProps {
  result: CoverageResult;
}

/**
 * Closing CTA — cites the SAME `CoverageResult` the Hero and the full breakdown panel read from
 * (passed in as a prop, never re-derived or hand-typed), so the tier name, the itemized line
 * count, and the total here always match what the visitor actually configured above.
 */
export function ClosingCta({ result }: ClosingCtaProps) {
  const lineSummary = result.lines.map((line) => line.label).join(" + ");

  return (
    <section className="px-4 py-16 sm:px-8 sm:py-24 lg:px-12" style={{ backgroundColor: SURFACE }}>
      <div
        className="mx-auto max-w-[1180px] rounded-3xl p-8 sm:p-12"
        style={{ border: `1px solid ${BORDER}`, backgroundColor: "#FFFFFF" }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
          Ready to check out
        </p>
        <h2
          className="mt-3 text-[26px] font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-[34px]"
          style={{ color: FG }}
        >
          {result.lines.length > 0 ? (
            <>
              Your tier is{" "}
              <span style={{ color: ACCENT }}>{result.tierLabel}</span>.
            </>
          ) : (
            "Pick at least one add-on to lock in a tier."
          )}
        </h2>
        <p className={`mt-3 text-[16px] font-normal leading-[1.6] ${PROSE_WIDTH_CTA}`} style={{ color: MUTED }}>
          {result.lines.length > 0 ? (
            <>
              Item price plus {lineSummary} comes to{" "}
              <span className="font-semibold tabular-nums" style={{ color: FG }}>
                ${result.total.toLocaleString("en-US")}
              </span>
              , itemized line by line at checkout — nothing collapsed into one number.
            </>
          ) : (
            "Turn on Shield Guard, Loss Watch, or Resale Lock above to see your tier and total here."
          )}
        </p>
        <a
          href="#hero"
          className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold ${FOCUS_RING}`}
          style={{ backgroundColor: ACCENT, color: ON_ACCENT_TEXT }}
        >
          Lock in this tier
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <p className="mt-6 text-[11.5px] font-normal" style={{ color: MUTED }}>
          Demo listing and pricing for illustration. Add-on availability varies by item.
        </p>
      </div>
    </section>
  );
}
