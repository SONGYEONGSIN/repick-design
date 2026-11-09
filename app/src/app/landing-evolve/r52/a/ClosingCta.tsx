"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LISTINGS } from "./data";
import { computeAggregate, formatCount } from "./model";
import { Reveal } from "./Reveal";
import { ACCENT_HEX, EYEBROW, FOCUS_RING, ON_ACCENT_FILL_TEXT } from "./tokens";

type ClosingCtaProps = {
  scrubDay: number;
};

/**
 * Closing section. The buyer-count figure is read from the same `computeAggregate` call the Hero
 * and Value sections use, at the SAME `scrubDay` that is still in the shared state when this
 * renders -- not a literal copy-pasted at generation time. The claim is scoped to that one figure,
 * not a blanket "everything here is live".
 */
export function ClosingCta({ scrubDay }: ClosingCtaProps) {
  const prefersReducedMotion = useReducedMotion();
  const aggregate = computeAggregate(LISTINGS, scrubDay);

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-10 lg:py-28" aria-labelledby="closing-heading">
      <Reveal>
        <div
          className="mx-auto max-w-[1320px] rounded-[28px] px-6 py-14 sm:px-10 sm:py-16"
          style={{ backgroundColor: "#13131A", border: "1px solid #22222C" }}
        >
          <p className={`${EYEBROW} text-[#A1A1AA]`}>repick · ai match engine</p>
          <h2
            id="closing-heading"
            className="mt-3 max-w-[720px] text-[clamp(1.9rem,3.2vw+1rem,3rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white"
          >
            Right now, at Day {scrubDay},{" "}
            <span style={{ color: ACCENT_HEX }}>{formatCount(aggregate.qualifiedBuyers)} buyers</span>{" "}
            qualify for a match like yours.
          </h2>
          <p className="mt-4 max-w-[500px] text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
            That figure moves with the timeline you set above -- drag it earlier or later and this
            number, and the three it&apos;s built from, change with it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.a
              href="#try-the-match"
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold ${ON_ACCENT_FILL_TEXT} ${FOCUS_RING}`}
              style={{ backgroundColor: ACCENT_HEX }}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              Create your listing
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </motion.a>
            <a
              href="#value"
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white ${FOCUS_RING}`}
              style={{ border: "1px solid #3A3A46" }}
            >
              See how the model works
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
