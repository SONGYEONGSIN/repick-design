"use client";

import { ArrowRight } from "lucide-react";
import { deriveRange } from "./zones";
import { ACCENT, BORDER, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, PROSE_WIDTH_CTA, SURFACE } from "./tokens";

interface ClosingCtaProps {
  flaggedIds: Set<string>;
  view: "seller" | "buyer";
}

/**
 * Closing CTA — recomputes from the SAME `flaggedIds` state the Hero and Value Split read from
 * (passed in as a prop, never re-derived with hand-typed numbers), so the range and flagged count
 * named here always match whatever the visitor last toggled, all the way to the bottom of the
 * page.
 */
export function ClosingCta({ flaggedIds, view }: ClosingCtaProps) {
  const range = deriveRange(flaggedIds);

  return (
    <section className="px-4 py-16 sm:px-8 sm:py-24 lg:px-12" style={{ backgroundColor: SURFACE }}>
      <div className="mx-auto max-w-[1180px] rounded-3xl p-8 sm:p-12" style={{ border: `1px solid ${BORDER}`, backgroundColor: "#09090B" }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
          Ready to list with confidence
        </p>
        <h2 className="mt-3 text-[26px] font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-[34px]" style={{ color: FG }}>
          With {flaggedIds.size} of 6 zones flagged, this estimate lands at{" "}
          <span className="tabular-nums" style={{ color: ACCENT }}>
            ${range.low}–{range.high}
          </span>
          .
        </h2>
        <p className={`mt-3 text-[16px] font-normal leading-[1.6] ${PROSE_WIDTH_CTA}`} style={{ color: MUTED }}>
          Viewing as {view}. Flag or clear any zone above, and this range — and every line in the
          ledger — follows you down to checkout.
        </p>
        <a
          href="#hero"
          className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold ${FOCUS_RING}`}
          style={{ backgroundColor: ACCENT, color: ON_ACCENT_TEXT }}
        >
          Adjust the ledger
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <p className="mt-6 text-[11.5px] font-normal" style={{ color: MUTED }}>
          Demo listing and estimate for illustration. Actual zones and weights vary by item category.
        </p>
      </div>
    </section>
  );
}
