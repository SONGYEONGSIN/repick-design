"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DISPLAY_FONT } from "./data";

/**
 * Closing CTA — echoes the live state from Hero's category filter (lifted to page.tsx and passed
 * down as props) rather than a hardcoded number, per the brief: whatever the user last toggled up
 * top is still reflected in the sentence down here.
 */
export default function ClosingCTA({
  trust,
  correctionsVisible,
  correctionsTotal,
  activeCount,
  categoryTotal,
}: {
  trust: number;
  correctionsVisible: number;
  correctionsTotal: number;
  activeCount: number;
  categoryTotal: number;
}) {
  const shouldReduce = useReducedMotion();

  return (
    <section className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <motion.div
        initial={shouldReduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: shouldReduce ? 0 : 0.4 }}
        className="rounded-3xl border border-zinc-200 bg-zinc-50 px-6 py-12 sm:px-12 sm:py-16"
      >
        <h2
          style={DISPLAY_FONT}
          className="max-w-[560px] text-[clamp(1.75rem,1.4rem+1.6vw,2.75rem)] font-bold tracking-[-0.02em] text-zinc-900"
        >
          Ready to see your own redline?
        </h2>
        <p className="mt-4 max-w-[480px] text-[15px] leading-[1.6] text-zinc-600">
          Right now the example above is checking{" "}
          <span className="tabular-nums font-medium text-zinc-800">
            {activeCount} of {categoryTotal}
          </span>{" "}
          claim types —{" "}
          <span className="tabular-nums font-medium text-zinc-800">
            {correctionsVisible} of {correctionsTotal}
          </span>{" "}
          corrections visible, for a{" "}
          <span className="tabular-nums font-medium text-[#0369a1]">{trust}/100</span> trust score.
          Every listing you open gets the same treatment.
        </p>
        <a
          href="#top"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0369a1] px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#075985] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1] active:scale-[0.98]"
        >
          Get matched to verified listings
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </motion.div>
    </section>
  );
}
