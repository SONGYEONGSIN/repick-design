"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CAPTION,
  EYEBROW,
  FOCUS,
  MATCH_TAGS,
  RETAIL_COMP,
  SELLER_BADGES,
  STAGES,
  currentPrice,
  discountPct,
  gradeForStage,
  money,
} from "./data";

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function ProductPreview({ stageIndex }: { stageIndex: number }) {
  const [openTags, setOpenTags] = useState<Set<string>>(new Set());
  const stage = STAGES[stageIndex];
  const grade = gradeForStage(stage);
  const price = currentPrice(stage);
  const discount = discountPct(stage);

  function toggleTag(id: string) {
    setOpenTags((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <section id="preview" className="border-b border-white/10 px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto w-full max-w-[1240px]">
        <Reveal>
          <p className={EYEBROW}>THE PREVIEW A BUYER SEES</p>
          <h2
            className="mt-4 max-w-[620px] text-[clamp(1.7rem,3.6vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.01em] text-white"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Why it matched, what grade it earned, who to trust.
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-7" delay={0.05}>
            <p className={CAPTION}>AI MATCH, EXPLAINED</p>
            <ul className="mt-3 flex flex-col gap-2">
              {MATCH_TAGS.map((tag) => {
                const open = openTags.has(tag.id);
                return (
                  <li key={tag.id} className="rounded-xl border border-white/10 bg-white/[0.02]">
                    <button
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      aria-expanded={open}
                      aria-controls={`tag-detail-${tag.id}`}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left ${FOCUS}`}
                    >
                      <span className="text-[13px] font-semibold text-white">{tag.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${
                          open ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    <p
                      id={`tag-detail-${tag.id}`}
                      hidden={!open}
                      className="max-w-[431px] px-4 pb-3.5 text-[12.5px] font-normal leading-[1.55] text-zinc-400"
                    >
                      {tag.detail}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal className="min-w-0 lg:col-span-5" delay={0.1}>
            <div className="flex h-full flex-col gap-6 rounded-2xl border border-white/10 bg-[#111116] p-6">
              <div>
                <p className={CAPTION}>
                  CONDITION, AS OF STAGE <span className="tabular-nums">{stage.index + 1}</span>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#7A5F28] px-3 py-1.5 text-[13px] font-semibold text-white">
                    Grade {grade}
                  </span>
                  <span className="text-[13px] font-normal tabular-nums text-zinc-300">
                    {stage.confidence}% confidence
                  </span>
                  <span className="text-[13px] font-normal tabular-nums text-zinc-300">
                    {stage.defectsLogged} flags disclosed
                  </span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className={CAPTION}>SELLER VERIFICATION</p>
                <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {SELLER_BADGES.map((badge) => (
                    <li key={badge} className="flex items-center gap-2">
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#D9BE84]" aria-hidden="true" />
                      <span className="text-[12px] font-normal text-zinc-300">{badge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className={CAPTION}>PRICE VS. RETAIL</p>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-[13px] font-normal tabular-nums text-zinc-400 line-through">
                    {money(RETAIL_COMP)}
                  </span>
                  <span className="text-[24px] font-extrabold tabular-nums text-white">{money(price)}</span>
                  <span className="rounded-full bg-[#D9BE84]/10 px-2.5 py-1 text-[12px] font-semibold tabular-nums text-[#D9BE84]">
                    {discount}% off
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
