"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Grade, Tier } from "./data";
import { BASELINE_SCORE } from "./data";
import { Reveal } from "./reveal";
import { EYEBROW, FOCUS_RING, MUTED_TEXT } from "./tokens";

interface ClosingCTAProps {
  score: number;
  tier: Tier;
  grade: Grade;
}

export function ClosingCTA({ score, tier, grade }: ClosingCTAProps) {
  const diff = score - BASELINE_SCORE;
  const diffText = diff >= 0 ? `${diff} pts above` : `${Math.abs(diff)} pts below`;

  return (
    <section id="start" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <Reveal className="rounded-2xl border border-[#15140E]/12 bg-[#15140E]/[0.02] p-8 sm:p-12">
        <p className={`${EYEBROW} text-emerald-700`}>Start here</p>
        <h2 className="mt-3 max-w-xl font-[var(--font-display-wide)] text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-[#15140E] sm:text-4xl">
          Your simulated listing is ready to compare
        </h2>
        <p className={`mt-4 max-w-[494px] text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
          As configured above, this {grade.toLowerCase()}-condition, {tier.toLowerCase()}-tier
          piece carries a {score}/100 trust score — {diffText} the category average. Every
          certificate on Repick carries the same breakdown before you buy.
        </p>

        <motion.a
          href="#certificate"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className={`mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-600 px-6 text-sm font-bold text-[#15140E] ${FOCUS_RING}`}
        >
          Browse {tier} pieces on Repick
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </motion.a>
      </Reveal>
    </section>
  );
}
