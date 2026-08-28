"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { AuditCategory } from "./data";
import { DISPLAY } from "./theme";

interface ClosingCtaProps {
  category: AuditCategory;
}

export default function ClosingCta({ category }: ClosingCtaProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="closing-cta"
      aria-labelledby="closing-heading"
      className="bg-white px-6 py-16 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 sm:p-12"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2
            id="closing-heading"
            style={DISPLAY}
            className="max-w-2xl text-[clamp(1.75rem,2.6vw+1rem,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-zinc-900"
          >
            The report you&apos;re reading is live.
          </h2>
          <p
            aria-live="polite"
            className="mt-4 max-w-[32rem] text-base leading-[1.6] text-zinc-600"
          >
            You&apos;re currently on{" "}
            <span className="font-semibold text-zinc-900">
              &ldquo;{category.label}&rdquo;
            </span>{" "}
            &mdash;{" "}
            <span className="font-semibold text-zinc-900 tabular-nums">
              {category.thisQuarter} cases
            </span>{" "}
            this quarter,{" "}
            <span className="font-semibold text-zinc-900 tabular-nums">
              {category.resolutionRate}%
            </span>{" "}
            resolved. Every listing below carries the same proof this report
            holds us to.
          </p>

          <motion.a
            href="#verified-now"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#C2410C] px-6 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C] motion-reduce:transition-none"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            Browse verified listings
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
