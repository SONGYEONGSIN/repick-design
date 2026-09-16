"use client";

import { ArrowRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import GradingDiagram from "./GradingDiagram";
import StageScrubber from "./StageScrubber";
import {
  CHECKLIST,
  EYEBROW,
  FOCUS,
  ITEM,
  RETAIL_COMP,
  STAGES,
  discountPct,
  gradeForStage,
  money,
  priceLabel,
} from "./data";

export default function Hero({
  stageIndex,
  onStageChange,
}: {
  stageIndex: number;
  onStageChange: (index: number) => void;
}) {
  const reduce = useReducedMotion();
  const stage = STAGES[stageIndex];
  const grade = gradeForStage(stage);
  const discount = discountPct(stage);

  const heroMotion = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section id="hero" className="border-b border-white/10 px-5 pb-16 pt-14 sm:px-8 sm:pt-16 lg:px-12 lg:pb-24 lg:pt-20">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <motion.div className="min-w-0 lg:col-span-5" {...heroMotion}>
            <p className={EYEBROW}>ONE LISTING, FIVE VERIFIED STEPS</p>
            <h1
              className="mt-5 text-[clamp(2.2rem,6.4vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              Grade the listing.
              <span className="block">Not just the seller.</span>
            </h1>
            <p className="mt-6 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400">
              This is one real overcoat, moving through repick&rsquo;s five-step pipeline. Drag
              the scrubber or pick a step, and the evidence, the flags, the checklist, and the
              price all update together &mdash; because they&rsquo;re computed from the same
              record.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#start"
                className={`inline-flex items-center gap-2 rounded-full bg-[#7A5F28] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#63491E] ${FOCUS}`}
              >
                List with full inspection
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400">
                NO STEP IS SKIPPABLE ONCE LISTED
              </span>
            </div>
          </motion.div>

          <motion.div className="min-w-0 lg:col-span-7" {...heroMotion}>
            <div className="rounded-3xl border border-white/10 bg-[#111116] p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-5">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-white">{ITEM.title}</p>
                  <p className="mt-1 text-[12px] font-normal text-zinc-400">
                    {ITEM.meta} &middot; @{ITEM.seller}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#D9BE84]/40 bg-[#D9BE84]/10 px-3 py-1.5 text-[12px] font-semibold text-[#D9BE84]">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  {ITEM.matchScore}% match to you
                </span>
              </div>

              <div className="mt-5">
                <StageScrubber stageIndex={stageIndex} onChange={onStageChange} />
              </div>

              <p className="mt-4 max-w-[431px] text-[13px] font-normal leading-[1.6] text-zinc-300">
                {stage.narrative}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-[minmax(0,1fr)_220px]">
                <GradingDiagram stage={stage} />

                <div className="flex flex-col gap-5">
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-4">
                    <div>
                      <dt className="text-[10px] font-semibold tracking-[0.1em] text-zinc-400">CONFIDENCE</dt>
                      <dd className="mt-1 text-[20px] font-extrabold tabular-nums text-white">
                        {stage.confidence}%
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-semibold tracking-[0.1em] text-zinc-400">GRADE</dt>
                      <dd className="mt-1 text-[20px] font-extrabold text-white">{grade}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-[10px] font-semibold tracking-[0.1em] text-zinc-400">ESTIMATED PRICE</dt>
                      <dd className="mt-1 flex items-baseline gap-2">
                        <span className="text-[20px] font-extrabold tabular-nums text-white">
                          {priceLabel(stage)}
                        </span>
                        <span className="text-[11px] font-normal tabular-nums text-zinc-400">
                          {discount}% off {money(RETAIL_COMP)} retail comp
                        </span>
                      </dd>
                    </div>
                  </dl>

                  <ul className="flex flex-col gap-2 border-t border-white/10 pt-4">
                    {CHECKLIST.map((item) => {
                      const done = stageIndex >= item.doneAtStage;
                      return (
                        <li key={item.id} className="flex items-start gap-2">
                          <ShieldCheck
                            className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                              done ? "text-[#D9BE84]" : "text-zinc-600"
                            }`}
                            aria-hidden="true"
                          />
                          <span
                            className={`text-[11.5px] font-normal leading-[1.45] ${
                              done ? "text-zinc-200" : "text-zinc-400"
                            }`}
                          >
                            {item.label}
                            <span className="sr-only">{done ? " — complete" : " — pending"}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
