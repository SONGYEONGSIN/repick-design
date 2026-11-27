"use client";

import { ArrowRight } from "lucide-react";
import { findLeaf, formatRange, offerFor, trailFor, type DeviceType } from "./tree";
import { ACCENT, BORDER, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, PROSE_WIDTH_CTA, SURFACE } from "./tokens";

const displayFace = { fontFamily: "var(--font-display-wide)" };

interface ClosingCtaProps {
  deviceType: DeviceType | null;
  conditionId: string | null;
  urgent: boolean;
}

/**
 * Closing CTA — recomputes from the SAME `deviceType`/`conditionId`/`urgent` state the Hero and
 * Value Split read from (passed in as props, never re-derived with hand-typed numbers), so the
 * channel and range named here always match whatever the visitor last answered, all the way to
 * the bottom of the page.
 */
export function ClosingCta({ deviceType, conditionId, urgent }: ClosingCtaProps) {
  const leaf = deviceType && conditionId ? findLeaf(deviceType, conditionId) : undefined;
  const offer = leaf ? offerFor(leaf, urgent) : undefined;

  return (
    <section className="px-4 py-16 sm:px-8 sm:py-24 lg:px-12" style={{ backgroundColor: SURFACE }}>
      <div className="mx-auto max-w-[1180px] rounded-3xl p-8 sm:p-12" style={{ border: `1px solid ${BORDER}`, backgroundColor: "#FFFFFF" }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: ACCENT }}>
          Ready to send it in
        </p>
        <h2 className="mt-3 text-[26px] font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-[34px]" style={{ ...displayFace, color: FG }}>
          {leaf && offer ? (
            <>
              Your path lands on{" "}
              <span style={{ color: ACCENT }}>{offer.channel}</span>, estimated{" "}
              <span className="tabular-nums" style={{ color: ACCENT }}>
                {formatRange(offer)}
              </span>
              .
            </>
          ) : (
            "Walk the tree above to see your channel and range."
          )}
        </h2>
        <p className={`mt-3 text-[16px] font-normal leading-[1.6] ${PROSE_WIDTH_CTA}`} style={{ color: MUTED }}>
          Path so far: {trailFor(deviceType, conditionId)}. Change either answer above, or flip
          between &ldquo;need it today&rdquo; and &ldquo;can wait,&rdquo; and this number follows
          you down to checkout.
        </p>
        <a
          href="#hero"
          className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold ${FOCUS_RING}`}
          style={{ backgroundColor: ACCENT, color: ON_ACCENT_TEXT }}
        >
          Walk the tree
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
        <p className="mt-6 text-[11.5px] font-normal" style={{ color: MUTED }}>
          Demo valuations for illustration. Actual channel pricing varies by model and market.
        </p>
      </div>
    </section>
  );
}
