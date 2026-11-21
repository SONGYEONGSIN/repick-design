"use client";

import {
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Package,
  FileCheck2,
} from "lucide-react";
import type { Checks, Grade, Tier } from "./data";
import {
  GRADES,
  ISSUE_DATE,
  LISTED_PRICE,
  LOT_LABEL,
  SERIAL,
  TIERS,
  computeFairness,
  computeScore,
  computeVerdict,
  BASELINE_SCORE,
} from "./data";
import { Seal, SealWatermark, Signature, Barcode } from "./graphics";
import { CAPTION, EYEBROW, FOCUS_RING, MUTED_TEXT, STAT_LABEL } from "./tokens";

interface CertificateProps {
  grade: Grade;
  tier: Tier;
  checks: Checks;
  onGrade: (g: Grade) => void;
  onTier: (t: Tier) => void;
  onCheck: (key: keyof Checks) => void;
}

const pillBase =
  "peer-checked:bg-[#15140E] peer-checked:text-[#FAFAF8] inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#15140E]/25 bg-transparent px-4 text-sm font-bold text-[#15140E] transition-colors";
const pillFocus =
  "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#047857]";

export function Certificate({ grade, tier, checks, onGrade, onTier, onCheck }: CertificateProps) {
  const score = computeScore(grade, tier, checks);
  const verdict = computeVerdict(score);
  const fairness = computeFairness(tier);
  const diff = score - BASELINE_SCORE;
  const checkedCount = (checks.serial ? 1 : 0) + (checks.packaging ? 1 : 0);

  return (
    <div
      id="certificate"
      className="relative overflow-hidden rounded-2xl border border-[#15140E]/15 bg-[#FAFAF8] p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)] sm:p-7"
    >
      <SealWatermark className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 sm:h-52 sm:w-52" />

      {/* Report header */}
      <div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-[#15140E]/10 pb-5">
        <div className="flex items-center gap-3">
          <Seal className="h-10 w-10 shrink-0 text-[#15140E]" />
          <div>
            <p className={`${EYEBROW} text-emerald-700`}>Repick Appraisal Report</p>
            <p className="mt-1 text-sm font-bold text-[#15140E]">{LOT_LABEL}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`${CAPTION} ${MUTED_TEXT}`}>Serial</p>
          <p className="font-[var(--font-mono)] text-sm font-normal text-[#15140E]">{SERIAL}</p>
          <p className={`mt-1 text-xs font-normal ${MUTED_TEXT}`}>Issued {ISSUE_DATE}</p>
        </div>
      </div>

      {/* Output fields — flat dl > div > (dt, dd), icon lives inside dt */}
      <dl className="relative grid grid-cols-1 gap-x-6 gap-y-4 border-b border-[#15140E]/10 py-5 sm:grid-cols-2">
        <div>
          <dt className={`flex items-center gap-1.5 ${CAPTION} ${MUTED_TEXT}`}>
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Condition grade
          </dt>
          <dd className="mt-1 text-base font-bold text-[#15140E]">{grade}</dd>
        </div>
        <div>
          <dt className={`flex items-center gap-1.5 ${CAPTION} ${MUTED_TEXT}`}>
            <Package className="h-3.5 w-3.5" aria-hidden="true" />
            Brand tier
          </dt>
          <dd className="mt-1 text-base font-bold text-[#15140E]">{tier}</dd>
        </div>
        <div>
          <dt className={`flex items-center gap-1.5 ${CAPTION} ${MUTED_TEXT}`}>
            <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
            Authentication checklist
          </dt>
          <dd className="mt-1 text-base font-bold text-[#15140E]">{checkedCount} of 2 verified</dd>
        </div>
        <div>
          <dt className={`flex items-center gap-1.5 ${CAPTION} ${MUTED_TEXT}`}>
            <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
            Listed price
          </dt>
          <dd className="mt-1 text-base font-bold text-[#15140E]">${LISTED_PRICE}</dd>
        </div>
      </dl>

      {/* Driving outputs: trust score + stamp + fairness verdict */}
      <div className="relative grid grid-cols-1 gap-6 py-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex items-baseline gap-1">
          <span className="font-[var(--font-display-wide)] text-[clamp(3rem,6vw,4.5rem)] font-extrabold leading-none tracking-[-0.02em] text-[#15140E]">
            {score}
          </span>
          <span className={`${STAT_LABEL} ${MUTED_TEXT}`}>/100 trust score</span>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <span
            className={
              verdict.tone === "low"
                ? "inline-flex -rotate-6 items-center gap-1.5 rounded-sm border-2 border-[#15140E] px-3 py-1.5 text-sm font-extrabold uppercase tracking-[-0.01em] text-[#15140E]"
                : "inline-flex -rotate-6 items-center gap-1.5 rounded-sm border-2 border-[#15140E]/20 bg-emerald-600 px-3 py-1.5 text-sm font-extrabold uppercase tracking-[-0.01em] text-[#15140E] shadow-sm"
            }
          >
            {verdict.tone === "low" ? (
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            )}
            {verdict.label}
          </span>

          <p
            className={
              diff >= 0
                ? "flex items-center gap-1 text-sm font-bold text-emerald-700"
                : "flex items-center gap-1 text-sm font-bold text-[#15140E]"
            }
          >
            {diff >= 0 ? (
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <TrendingDown className="h-4 w-4" aria-hidden="true" />
            )}
            {diff >= 0 ? `+${diff}` : diff} pts vs. {BASELINE_SCORE} category average
          </p>
        </div>
      </div>

      {/* Price-fairness verdict line */}
      <div className="relative flex items-center gap-2 border-t border-[#15140E]/10 py-4 text-sm">
        {fairness.tone === "good" ? (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
        ) : (
          <AlertTriangle className="h-4 w-4 shrink-0 text-[#15140E]" aria-hidden="true" />
        )}
        <span className={fairness.tone === "good" ? "font-bold text-emerald-700" : "font-bold text-[#15140E]"}>
          {fairness.label}
        </span>
        <span className={`font-normal ${MUTED_TEXT}`}>
          · fair band ${fairness.band[0]}–${fairness.band[1]} for {tier}
        </span>
      </div>

      {/* Signature strip */}
      <div className="relative flex flex-wrap items-end justify-between gap-4 border-t border-[#15140E]/10 pt-4">
        <div>
          <Signature className="h-6 w-24 text-[#15140E]" />
          <p className={`mt-1 text-xs font-normal ${MUTED_TEXT}`}>Authenticated by Repick AI Grading System</p>
        </div>
        <Barcode className="h-5 w-28 text-[#15140E]/70" />
      </div>

      {/* Simulation controls */}
      <div className="relative mt-6 rounded-xl border border-[#15140E]/10 bg-[#15140E]/[0.025] p-4 sm:p-5">
        <p className={`${CAPTION} ${MUTED_TEXT}`}>Simulation inputs</p>
        <p className={`mt-1 text-sm font-normal ${MUTED_TEXT}`}>
          Adjust the assumptions below — the report above recomputes immediately.
        </p>

        <fieldset className="mt-4">
          <legend className="text-sm font-bold text-[#15140E]">Condition grade</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {GRADES.map((g) => (
              <label key={g} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="grade"
                  value={g}
                  checked={grade === g}
                  onChange={() => onGrade(g)}
                  className="peer sr-only"
                />
                <span className={`${pillBase} ${pillFocus}`}>
                  {grade === g ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                  {g}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-4">
          <legend className="text-sm font-bold text-[#15140E]">Brand tier</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {TIERS.map((t) => (
              <label key={t} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="tier"
                  value={t}
                  checked={tier === t}
                  onChange={() => onTier(t)}
                  className="peer sr-only"
                />
                <span className={`${pillBase} ${pillFocus}`}>
                  {tier === t ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                  {t}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-4">
          <legend className="text-sm font-bold text-[#15140E]">Authentication checklist</legend>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <label className="relative flex min-h-11 cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={checks.serial}
                onChange={() => onCheck("serial")}
                className={`peer h-5 w-5 shrink-0 rounded border border-[#15140E]/30 accent-emerald-700 ${FOCUS_RING}`}
              />
              <span className="text-sm font-normal text-[#15140E]">Serial verified against registry</span>
            </label>
            <label className="relative flex min-h-11 cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={checks.packaging}
                onChange={() => onCheck("packaging")}
                className={`peer h-5 w-5 shrink-0 rounded border border-[#15140E]/30 accent-emerald-700 ${FOCUS_RING}`}
              />
              <span className="text-sm font-normal text-[#15140E]">Original packaging &amp; card present</span>
            </label>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
