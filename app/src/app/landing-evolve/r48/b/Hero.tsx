"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, RotateCcw } from "lucide-react";
import { ListingProof } from "./ListingProof";
import { TreePath } from "./TreePath";
import type { StepOneId, StepTwoId } from "./trade-data";
import { formatDays, formatUsd, type PathSummary } from "./trade-math";
import {
  ACCENT_FILL,
  ACCENT_FILL_HOVER,
  ACCENT_TEXT,
  ACCENT_TINT_TEXT,
  CARD_BG_CLASS,
  CARD_BORDER,
  EYEBROW,
  FOCUS_RING,
  INK_CLASS,
  MUTED_TEXT,
  ON_ACCENT_TEXT,
  PROSE_WIDTH_18,
} from "./tokens";
import { useMounted } from "./useMounted";

interface HeroProps {
  step1: StepOneId;
  step2: StepTwoId | null;
  summary: PathSummary;
  onSelectStep1: (id: StepOneId) => void;
  onSelectStep2: (id: StepTwoId) => void;
  onReset: () => void;
  announcement: { text: string; assertive: boolean };
}

/**
 * The hero carries the whole mechanic: headline/subhead/CTA on the left, and the Trade Path
 * Simulator — tree diagram AND its live headline number — on the right, inside this same
 * component. Nothing about the device lives in a section below the fold.
 */
export function Hero({ step1, step2, summary, onSelectStep1, onSelectStep2, onReset, announcement }: HeroProps) {
  const mounted = useMounted();
  const reduceMotion = useReducedMotion();
  const shouldAnimate = mounted && !reduceMotion;

  const payoutText = summary.stage === "leaf" ? formatUsd(summary.leaf.payout) : `${formatUsd(summary.range.low)}–${formatUsd(summary.range.high)}`;
  const daysText = summary.stage === "leaf" ? formatDays(summary.leaf.days) : `${summary.range.daysLow}–${summary.range.daysHigh} days`;
  const percentText =
    summary.stage === "leaf" ? `${summary.percent}% of market value` : `${summary.percentLow}–${summary.percentHigh}% of market value`;
  const numberKey = summary.stage === "leaf" ? summary.leaf.id : `${summary.branch.id}-range`;

  return (
    <section className="border-b border-white/10 px-4 pb-10 pt-8 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-10">
          {/* Left: asymmetric headline block, not centered */}
          <div className="flex min-w-0 flex-col justify-center gap-4">
            <p className={`${EYEBROW} ${ACCENT_TEXT}`}>Every exit path, priced before you pick one</p>
            <h1
              id="hero-heading"
              className={`text-[clamp(2rem,8vw,2.75rem)] lg:text-[clamp(2.75rem,4vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em] ${INK_CLASS}`}
            >
              Three ways to turn
              <br />
              gear into cash — <span className={ACCENT_TEXT}>run the path</span> first.
            </h1>
            <p className={`${PROSE_WIDTH_18} text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
              Sell now, list for a better offer, or trade straight in for credit. Each click
              commits to a step and narrows the payout on the right — nothing is estimated after
              the fact.
            </p>
            <div>
              <a
                href="#catalog"
                className={`inline-flex items-center gap-2 rounded-full ${ACCENT_FILL} px-6 py-3 text-sm font-semibold ${ON_ACCENT_TEXT} transition-colors duration-200 ${ACCENT_FILL_HOVER} ${FOCUS_RING}`}
              >
                See today&apos;s verified listings
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right: the Trade Path Simulator, inside the Hero component itself */}
          <div className={`flex min-w-0 flex-col gap-3 rounded-2xl border ${CARD_BORDER} ${CARD_BG_CLASS} p-3.5 sm:p-4`}>
            <div className="flex items-baseline justify-between gap-2">
              <p className={`${EYEBROW} ${ACCENT_TEXT}`}>Trade path simulator</p>
              <button
                type="button"
                onClick={onReset}
                className={`inline-flex min-h-6 shrink-0 items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-semibold ${MUTED_TEXT} transition-colors duration-150 hover:border-white/25 hover:text-white ${FOCUS_RING}`}
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Reset path
              </button>
            </div>

            <ListingProof />

            {/* The live-updating headline number: the compounding financial + time outcome of
                the path chosen so far. Re-keyed on the exact leaf/branch id so it only replays
                its entrance when the underlying value actually changes. */}
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <p className={`${EYEBROW} ${MUTED_TEXT}`}>Estimated payout</p>
                <motion.p
                  key={numberKey}
                  initial={shouldAnimate ? { opacity: 0, y: 6 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-none tracking-[-0.02em] tabular-nums ${INK_CLASS}`}
                >
                  {payoutText}
                </motion.p>
                <p className={`mt-1 text-xs font-normal ${MUTED_TEXT}`}>{percentText}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5">
                <Clock className={`h-3.5 w-3.5 ${ACCENT_TINT_TEXT}`} aria-hidden="true" />
                <span className="text-xs font-semibold tabular-nums">{daysText}</span>
                <span className={`text-[11px] font-normal ${MUTED_TEXT}`}>to cash</span>
              </div>
            </div>

            <TreePath
              step1={step1}
              step2={step2}
              summary={summary}
              onSelectStep1={onSelectStep1}
              onSelectStep2={onSelectStep2}
              announcement={announcement}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
