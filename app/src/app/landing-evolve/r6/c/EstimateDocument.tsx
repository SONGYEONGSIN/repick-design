"use client";

import { useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ShieldCheck } from "lucide-react";
import {
  type Category,
  type Condition,
  type Estimate,
  EASE,
  NUM,
  CAPTION,
  EYEBROW,
  cx,
  comma,
  clampNum,
} from "./data";

/**
 * Animates a numeric target through a spring so the estimate card counts up
 * (or down) whenever an input changes, rather than jumping instantly.
 * Reduced-motion users get a near-instant spring instead of no spring at all,
 * so the value still updates deterministically without perceptible motion.
 */
function useAnimatedNumber(target: number, reduced: boolean): MotionValue<number> {
  const mv = useMotionValue(target);
  const spring = useSpring(
    mv,
    reduced
      ? { stiffness: 1000, damping: 100, mass: 0.4 }
      : { stiffness: 210, damping: 26, mass: 0.7 },
  );
  useEffect(() => {
    mv.set(target);
  }, [target, mv]);
  return spring;
}

type Props = {
  category: Category;
  condition: Condition;
  budget: number;
  estimate: Estimate;
};

export default function EstimateDocument({ category, condition, budget, estimate }: Props) {
  const reduced = useReducedMotion() ?? false;
  const Icon = category.icon;

  const fairSpring = useAnimatedNumber(estimate.fairPrice, reduced);
  const payoutSpring = useAnimatedNumber(estimate.payout, reduced);
  const scoreSpring = useAnimatedNumber(estimate.matchScore, reduced);

  const fairText = useTransform(fairSpring, (v) => `₩${comma(v)}`);
  const payoutText = useTransform(payoutSpring, (v) => `₩${comma(v)}`);
  const scoreText = useTransform(scoreSpring, (v) => `${Math.round(clampNum(v, 0, 100))}%`);
  const barScale = useTransform(scoreSpring, (v) => clampNum(v, 0, 100) / 100);

  const summary = `Estimate updated: ${category.label}, ${condition.label} condition, fair price ₩${comma(
    estimate.fairPrice,
  )}, match score ${estimate.matchScore} percent, ${estimate.matchLabel.toLowerCase()}.`;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        {/* header */}
        <div className="flex items-center justify-between gap-4 border-b border-dashed border-white/15 px-5 py-4 sm:px-6">
          <div>
            <p className={cx(EYEBROW, "text-[#a894f7]")}>Estimate Certificate</p>
            <p className={cx(NUM, "mt-1 text-xs font-normal text-[#A1A1AA]")}>{estimate.serial}</p>
          </div>
          <span className="inline-flex shrink-0 -rotate-3 items-center gap-1.5 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#a894f7]">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            AI-Verified
          </span>
        </div>

        {/* item row */}
        <div className="flex items-center gap-3 px-5 pt-5 sm:px-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <Icon className="h-5 w-5 text-[#6E56CF]" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold tracking-[-0.02em] text-white">
              {category.label}
            </p>
            <p className="text-sm font-normal text-[#A1A1AA]">{condition.label} condition</p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={condition.grade}
              initial={reduced ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-sm font-extrabold text-white"
              aria-label={`Condition grade ${condition.grade}`}
            >
              {condition.grade}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* itemized breakdown */}
        <dl className="mt-5 divide-y divide-white/[0.06] border-t border-white/10 px-5 text-sm sm:px-6">
          <div className="flex items-center justify-between py-2.5">
            <dt className="font-normal text-[#A1A1AA]">Base retail-equivalent value</dt>
            <dd className={cx(NUM, "font-semibold text-white")}>{`₩${comma(estimate.base)}`}</dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="font-normal text-[#A1A1AA]">Condition adjustment ({condition.grade} grade)</dt>
            <dd className={cx(NUM, "font-semibold", estimate.conditionAdjustPct < 0 ? "text-white" : "text-white")}>
              {estimate.conditionAdjustPct > 0 ? "+" : ""}
              {estimate.conditionAdjustPct}%
            </dd>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <dt className="font-normal text-[#A1A1AA]">Category demand adjustment</dt>
            <dd className={cx(NUM, "font-semibold text-white")}>
              {estimate.demandAdjustPct > 0 ? "+" : ""}
              {estimate.demandAdjustPct}%
            </dd>
          </div>
        </dl>

        {/* headline number */}
        <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-white/15 px-5 pt-4 sm:px-6">
          <span className={cx(CAPTION, "text-[#A1A1AA]")}>AI fair-price estimate</span>
          <motion.span className={cx(NUM, "text-2xl font-extrabold text-white sm:text-3xl")}>
            {fairText}
          </motion.span>
        </div>

        <div className="flex items-baseline justify-between px-5 pt-3 text-sm sm:px-6">
          <span className="font-normal text-[#A1A1AA]">Your target price</span>
          <span className={cx(NUM, "font-semibold text-white")}>{`₩${comma(budget)}`}</span>
        </div>

        <div className="flex items-baseline justify-between px-5 pt-3 text-sm sm:px-6">
          <span className="font-normal text-[#A1A1AA]">Est. payout after 12% service fee</span>
          <motion.span className={cx(NUM, "font-semibold text-white")}>{payoutText}</motion.span>
        </div>

        {/* match score */}
        <div className="mx-5 mt-5 border-t border-white/10 pb-5 pt-4 sm:mx-6">
          <div className="flex items-center justify-between">
            <span className={cx(CAPTION, "text-[#A1A1AA]")}>AI match score</span>
            <motion.span className={cx(NUM, "text-sm font-semibold text-white")}>{scoreText}</motion.span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              style={{ scaleX: barScale }}
              className="h-full w-full origin-left rounded-full bg-[#6E56CF]"
            />
          </div>
          <p className="mt-2 text-xs font-normal text-[#A1A1AA]">
            {estimate.matchLabel} against your target price
          </p>
        </div>

        <div className="border-t border-white/10 px-5 py-3 text-xs font-normal text-[#A1A1AA] sm:px-6">
          Generated instantly from your inputs · not a binding offer
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {summary}
      </p>
    </div>
  );
}
