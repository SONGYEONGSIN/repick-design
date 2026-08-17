"use client";

import type { Experiment } from "./data";
import { currentCi, currentLift, formatLift, formatMetricValue, numberFmt, round2, significanceState, variantValue } from "./data";
import { CardHeader, EyebrowLabel, SignificanceBadge } from "./ui";
import { CARD, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";

const BR_W = 220;
const BR_H = 34;
const BR_MIN = -9;
const BR_MAX = 14;

function xPos(v: number): number {
  return round2(((v - BR_MIN) / (BR_MAX - BR_MIN)) * BR_W);
}

const BRACKET_CLASS: Record<"good" | "warn" | "bad", string> = {
  good: "stroke-emerald-400 fill-emerald-400",
  warn: "stroke-amber-400 fill-amber-400",
  bad: "stroke-rose-400 fill-rose-400",
};

/** Compact confidence-interval bracket: same [-9, 14] domain as the hero chart, so the reader can
 *  see at a glance whether this variant's interval clears the zero line — always paired with the
 *  numeric CI text next to it, never the sole carrier of the significance result. */
function CIBracket({ ciLow, ciHigh, lift, tone }: { ciLow: number; ciHigh: number; lift: number; tone: "good" | "warn" | "bad" }) {
  const zeroX = xPos(0);
  const lowX = xPos(ciLow);
  const highX = xPos(ciHigh);
  const liftX = xPos(lift);
  const cls = BRACKET_CLASS[tone];
  return (
    <svg viewBox={`0 0 ${BR_W} ${BR_H}`} className="h-8 w-full max-w-56" role="img" aria-label={`95 percent confidence interval from ${formatLift(ciLow)} to ${formatLift(ciHigh)}, point estimate ${formatLift(lift)}`}>
      <line x1={0} y1={BR_H / 2} x2={BR_W} y2={BR_H / 2} className="stroke-white/10" strokeWidth={1} />
      <line x1={zeroX} y1={6} x2={zeroX} y2={BR_H - 6} className="stroke-zinc-600" strokeWidth={1} strokeDasharray="2 2" />
      <line x1={lowX} y1={BR_H / 2} x2={highX} y2={BR_H / 2} className={cls} strokeWidth={2} />
      <line x1={lowX} y1={BR_H / 2 - 5} x2={lowX} y2={BR_H / 2 + 5} className={cls} strokeWidth={2} />
      <line x1={highX} y1={BR_H / 2 - 5} x2={highX} y2={BR_H / 2 + 5} className={cls} strokeWidth={2} />
      <circle cx={liftX} cy={BR_H / 2} r={3.5} className={cx(cls, "stroke-none")} />
    </svg>
  );
}

function VariantCard({
  label,
  value,
  unit,
  sample,
  isControl,
  lift,
  ciLow,
  ciHigh,
}: {
  label: string;
  value: number;
  unit: "percent" | "currency";
  sample: number;
  isControl: boolean;
  lift?: number;
  ciLow?: number;
  ciHigh?: number;
}) {
  const sig = !isControl && ciLow != null && ciHigh != null ? significanceState(ciLow, ciHigh) : null;
  const tone: "good" | "warn" | "bad" = sig === "significant-positive" ? "good" : sig === "significant-negative" ? "bad" : "warn";
  return (
    <div className={cx(CARD, "p-4")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className={cx("text-sm font-semibold", TEXT_PRIMARY)}>{label}</h3>
        {sig ? <SignificanceBadge state={sig} /> : <span className={cx("text-xs font-medium", TEXT_CAPTION)}>Baseline</span>}
      </div>
      <p className={cx("mt-2 text-2xl font-semibold", NUM, TEXT_PRIMARY)}>{formatMetricValue(value, unit)}</p>
      <p className={cx("mt-0.5 text-xs", NUM, TEXT_CAPTION)}>{numberFmt.format(sample)} participants</p>

      {!isControl && lift != null && ciLow != null && ciHigh != null ? (
        <div className="mt-3">
          <div className="flex items-center justify-between">
            <EyebrowLabel>Lift vs. control</EyebrowLabel>
            <span className={cx("text-sm font-semibold", NUM, tone === "bad" ? "text-rose-400" : "text-zinc-50")}>{formatLift(lift)}</span>
          </div>
          <div className="mt-1.5">
            <CIBracket ciLow={ciLow} ciHigh={ciHigh} lift={lift} tone={tone} />
          </div>
          <p className={cx("text-[11px]", NUM, TEXT_CAPTION)}>
            95% CI {formatLift(ciLow)} to {formatLift(ciHigh)}
          </p>
        </div>
      ) : (
        <div className="mt-3 h-8" aria-hidden="true" />
      )}
    </div>
  );
}

export default function VariantCompare({ experiment }: { experiment: Experiment }) {
  const lift = currentLift(experiment);
  const ci = currentCi(experiment);
  const vValue = variantValue(experiment);

  return (
    <div>
      <CardHeader title="Compare variants" description={`${experiment.metricLabel} · control vs. treatment`} />
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <VariantCard label="Control" value={experiment.controlValue} unit={experiment.metricUnit} sample={experiment.controlSample} isControl />
        <VariantCard label="Variant" value={vValue} unit={experiment.metricUnit} sample={experiment.variantSample} isControl={false} lift={lift} ciLow={ci.ciLow} ciHigh={ci.ciHigh} />
      </div>
    </div>
  );
}
