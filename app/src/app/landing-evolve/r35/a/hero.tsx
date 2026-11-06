"use client";

import { motion } from "framer-motion";
import { ArrowRight, Radio } from "lucide-react";
import type { Checks, Grade, Tier } from "./data";
import { Certificate } from "./certificate";
import { ProductCards } from "./product-cards";
import { EYEBROW, FOCUS_RING, MUTED_TEXT } from "./tokens";

interface HeroProps {
  grade: Grade;
  tier: Tier;
  checks: Checks;
  onGrade: (g: Grade) => void;
  onTier: (t: Tier) => void;
  onCheck: (key: keyof Checks) => void;
}

// The hero never imports `Reveal` and never sets an `initial` opacity on anything that renders
// before interaction — the only motion here is whileHover/whileTap on the CTA, which never
// ships a pre-animation state into server HTML, so there is nothing to mount-gate.
export function Hero({ grade, tier, checks, onGrade, onTier, onCheck }: HeroProps) {
  return (
    <section id="hero" className="mx-auto max-w-[1440px] px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-10 lg:pb-24 lg:pt-16">
      <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8">
        <div className="min-w-0 lg:col-span-8">
          <p className={`${EYEBROW} text-emerald-700`}>Graded before it&apos;s listed</p>
          <h1 className="mt-3 font-[var(--font-display-wide)] text-[clamp(2.5rem,4vw+1.5rem,6rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#15140E]">
            The appraisal comes first.
            <br />
            The sale comes second.
          </h1>
          <p className="mt-5 max-w-[556px] text-lg font-normal leading-[1.6] text-[#15140E]">
            Repick issues a signed grading certificate for every resale listing — condition,
            authenticity, and a fair-price verdict, computed before a single buyer ever sees the
            item.
          </p>
          <motion.a
            href="#certificate"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#15140E] px-6 text-sm font-bold text-[#FAFAF8] ${FOCUS_RING}`}
          >
            Request your certificate
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </motion.a>
        </div>

        <div className="min-w-0 flex flex-col items-start justify-end gap-2 lg:col-span-4 lg:border-l lg:border-[#15140E]/10 lg:pl-6">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700`}>
            <Radio className="h-3.5 w-3.5" aria-hidden="true" />
            Live simulation below
          </span>
          <p className={`text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
            Adjust the grade, tier and checklist inputs below the report and every figure on it
            recomputes immediately — no reload, no waiting.
          </p>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <Certificate grade={grade} tier={tier} checks={checks} onGrade={onGrade} onTier={onTier} onCheck={onCheck} />
        </div>

        <div className="min-w-0 lg:col-span-5">
          <ProductCards />
        </div>
      </div>
    </section>
  );
}
