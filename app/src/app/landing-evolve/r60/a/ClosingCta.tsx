"use client";

import { ArrowRight } from "lucide-react";
import { payoutAtDay, phaseAtDay, PHASE_LABEL } from "./curve";
import { ACCENT, BORDER, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, PROSE_WIDTH_CTA, SURFACE } from "./tokens";

const displayFace = { fontFamily: "var(--font-display-grotesk)" };

interface ClosingCtaProps {
  day: number;
  certified: boolean;
}

/**
 * Closing CTA — recomputes from the SAME `day`/`certified` state the Hero and Value Split read
 * from (passed in as props, never re-derived with hand-typed numbers), so the payout and phase
 * named here always match whatever the visitor last set the dial to, all the way to the bottom of
 * the page.
 */
export function ClosingCta({ day, certified }: ClosingCtaProps) {
  const payout = payoutAtDay(day, certified);
  const phase = phaseAtDay(day);

  return (
    <section className="px-4 py-16 sm:px-8 sm:py-24 lg:px-12" style={{ backgroundColor: SURFACE }}>
      <div className="mx-auto max-w-[1180px] rounded-3xl p-8 sm:p-12" style={{ border: `1px solid ${BORDER}`, backgroundColor: "#09090B" }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
          Ready to list at the right time
        </p>
        <h2 className="mt-3 text-[26px] font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-[34px]" style={{ ...displayFace, color: FG }}>
          At day {day}, this listing projects{" "}
          <span className="tabular-nums" style={{ color: ACCENT }}>
            ${payout}
          </span>
          {" "}— {PHASE_LABEL[phase].toLowerCase()}.
        </h2>
        <p className={`mt-3 text-[16px] font-normal leading-[1.6] ${PROSE_WIDTH_CTA}`} style={{ color: MUTED }}>
          {certified ? "With" : "Without"} the verified condition certificate applied. Drag the
          dial above or toggle the certificate, and this number follows you down to checkout.
        </p>
        <a
          href="#hero"
          className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold ${FOCUS_RING}`}
          style={{ backgroundColor: ACCENT, color: ON_ACCENT_TEXT }}
        >
          Adjust the dial
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <p className="mt-6 text-[11.5px] font-normal" style={{ color: MUTED }}>
          Demo listing and projection for illustration. Actual curves vary by device model and market.
        </p>
      </div>
    </section>
  );
}
