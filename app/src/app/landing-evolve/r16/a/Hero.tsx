"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Scale } from "lucide-react";
import { DISPLAY } from "./theme";

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative border-b border-zinc-200 bg-white px-6 pt-14 pb-16 sm:px-10 sm:pt-20 sm:pb-20 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <p className="min-w-0 text-xs font-semibold uppercase text-zinc-500 tracking-[0.28em]">
            Quarterly transparency report
          </p>
          <p className="shrink-0 text-xs font-normal text-zinc-500 tracking-[0.16em] tabular-nums">
            No. 04 &middot; Q2 2026
          </p>
        </div>

        <h1
          id="hero-heading"
          style={DISPLAY}
          className="mt-6 max-w-4xl animate-[rise_0.6s_ease-out] text-[clamp(2.25rem,4.4vw+1.1rem,4.75rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-zinc-900 motion-reduce:animate-none"
        >
          We audit our own matches. Here&apos;s where we got it wrong this
          quarter.
        </h1>

        <p className="mt-6 max-w-[32rem] text-base leading-[1.6] text-zinc-600 sm:text-lg">
          Every quarter, repick publishes the AI matching errors serious
          enough that a buyer felt them — including the ones that got worse,
          not just the ones that improved.
        </p>

        <div className="mt-5 flex max-w-[28rem] items-start gap-3 border-l-2 border-[#EA580C] pl-4">
          <Scale
            aria-hidden="true"
            className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500"
          />
          <p className="text-sm leading-[1.6] text-zinc-500">
            Ranked by harm to a buyer&apos;s trust, not by how often it
            happened.{" "}
            <a
              href="#audit-report"
              className="font-semibold text-[#C2410C] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C] rounded-sm"
            >
              See the full rationale
            </a>
            .
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          <motion.a
            href="#verified-now"
            className="inline-flex items-center gap-2 rounded-full bg-[#C2410C] px-6 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C] motion-reduce:transition-none"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            Browse verified listings
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </motion.a>
          <a
            href="#audit-report"
            className="text-sm font-normal text-zinc-500 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C] rounded-sm hover:text-zinc-900"
          >
            Read the full disclosure
          </a>
        </div>
      </div>
    </section>
  );
}
