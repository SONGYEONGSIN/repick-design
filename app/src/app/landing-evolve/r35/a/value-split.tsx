import { FileCheck2, Package, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import type { Grade, Tier } from "./data";
import { BASELINE_SCORE } from "./data";
import { Reveal } from "./reveal";
import { EYEBROW, MUTED_TEXT } from "./tokens";

interface ValueSplitProps {
  score: number;
  tier: Tier;
  grade: Grade;
}

export function ValueSplit({ score, tier, grade }: ValueSplitProps) {
  const diff = score - BASELINE_SCORE;
  const diffText = diff >= 0 ? `${diff} points above` : `${Math.abs(diff)} points below`;

  return (
    <section id="how-it-works" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
      <Reveal>
        <p className={`${EYEBROW} text-emerald-700`}>Inside the report</p>
        <h2 className="mt-3 max-w-2xl font-[var(--font-display-wide)] text-3xl font-extrabold leading-[1.08] tracking-[-0.02em] text-[#15140E] sm:text-4xl">
          What actually moves the score
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        <Reveal delay={0}>
          <div className="min-w-0">
            <ShieldCheck className="h-6 w-6 text-emerald-700" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-bold text-[#15140E]">Condition, graded by eye</h3>
            <p className={`mt-2 max-w-[432px] text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
              Every submitted photo set is reviewed against the same three-point scale sellers see
              on the form — Good, Excellent or Mint — before anything else is calculated.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="min-w-0">
            <Package className="h-6 w-6 text-emerald-700" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-bold text-[#15140E]">Provenance, cross-checked</h3>
            <p className={`mt-2 max-w-[432px] text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
              Brand tier and the authentication checklist both carry weight on their own — a Core
              item with both checks cleared can outscore a Designer item with neither.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="min-w-0">
            <FileCheck2 className="h-6 w-6 text-emerald-700" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-bold text-[#15140E]">Price, benchmarked</h3>
            <p className={`mt-2 max-w-[432px] text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
              The certificate above is scoring this {grade.toLowerCase()}, {tier.toLowerCase()}
              -tier listing at <span className="font-bold text-[#15140E]">{score}/100</span> —{" "}
              <span className={diff >= 0 ? "font-bold text-emerald-700" : "font-bold text-[#15140E]"}>
                {diffText}
              </span>{" "}
              the {BASELINE_SCORE}-point category average.
              {diff >= 0 ? (
                <TrendingUp className="ml-1 inline h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
              ) : (
                <TrendingDown className="ml-1 inline h-3.5 w-3.5 text-[#15140E]" aria-hidden="true" />
              )}
            </p>
            <p className={`mt-2 max-w-[370px] text-xs font-normal leading-[1.6] ${MUTED_TEXT}`}>
              That average is a fixed benchmark from Repick&apos;s verified-listing cohort, not a
              number this page re-pulls on a schedule.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
