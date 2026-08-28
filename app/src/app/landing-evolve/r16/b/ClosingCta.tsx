"use client";

import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { NEIGHBORHOOD, formatPrice, formatRadius, type PriceBand, type Listing } from "./data";

type ClosingCtaProps = {
  radiusKm: number;
  within: Listing[];
  band: PriceBand | null;
};

export default function ClosingCta({ radiusKm, within, band }: ClosingCtaProps) {
  const reduce = useReducedMotion();

  const liveLine = band
    ? `There ${within.length === 1 ? "is" : "are"} ${within.length} comparable listing${
        within.length === 1 ? "" : "s"
      } within ${formatRadius(radiusKm)} km of ${NEIGHBORHOOD} right now, priced ${formatPrice(
        band.low
      )} to ${formatPrice(band.high)}.`
    : `No comparables sit within ${formatRadius(radiusKm)} km of ${NEIGHBORHOOD} yet. Widen the radius to see what opens up.`;

  return (
    <section aria-labelledby="closing-heading" className="px-4 py-20 sm:px-6 lg:px-10">
      <motion.div
        initial={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut" }}
        className="mx-auto max-w-[1200px] rounded-2xl border border-zinc-800 bg-zinc-950/60 px-6 py-12 sm:px-12"
      >
        <h2
          id="closing-heading"
          className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white"
        >
          See what is nearby, right now.
        </h2>
        <p className="mt-4 max-w-[480px] tabular-nums text-[15px] leading-[1.6] text-zinc-300">
          {liveLine}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#radius-control"
            className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-5 py-2.5 text-[14px] font-bold text-[#0B0B0F] transition-transform hover:scale-[1.02] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
          >
            Browse comparables
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
          <a
            href="#radius-control"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-[14px] font-medium text-zinc-200 transition-colors hover:border-zinc-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3e635]"
          >
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4 text-lime-400" />
            Adjust your radius
          </a>
        </div>
      </motion.div>
    </section>
  );
}
