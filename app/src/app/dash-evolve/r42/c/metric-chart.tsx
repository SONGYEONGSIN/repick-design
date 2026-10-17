"use client";

import { useState } from "react";
import { classifyLift, type LiftClass } from "./data";
import { formatCount, formatPct, formatSignedPct } from "./format";
import { FOCUS_RING } from "./ui";

function roundDownTo5(n: number): number {
  return Math.floor(n / 5) * 5;
}
function roundUpTo5(n: number): number {
  return Math.ceil(n / 5) * 5;
}

const LIFT_STROKE: Record<LiftClass, string> = {
  positive: "stroke-lime-400",
  negative: "stroke-rose-400",
  inconclusive: "stroke-zinc-400",
};
const LIFT_FILL: Record<LiftClass, string> = {
  positive: "fill-lime-400",
  negative: "fill-rose-400",
  inconclusive: "fill-zinc-400",
};
const LIFT_NOTE: Record<LiftClass, string> = {
  positive: "95% interval sits entirely above zero.",
  negative: "95% interval sits entirely below zero.",
  inconclusive: "95% interval still straddles zero.",
};

/**
 * The lab's headline chart: a 95%-CI whisker for the lift estimate, plus a crosshair-style
 * tooltip on the point estimate that works by pointer AND by keyboard focus. The exact numbers
 * are always printed below the plot as static text — hovering only adds a precise readout, it is
 * never the only way to see the proof.
 */
export function LiftWhiskerPlot({
  liftPct,
  ci,
  confidencePct,
  periodLabel,
  stableDomain,
}: {
  liftPct: number;
  ci: [number, number];
  confidencePct: number;
  periodLabel: string;
  stableDomain: [number, number];
}) {
  const [open, setOpen] = useState(false);
  const liftClass = classifyLift(ci);

  const width = 280;
  const height = 56;
  const cy = 28;
  const [domainMin, domainMax] = stableDomain;
  const span = domainMax - domainMin;

  function xFor(v: number): number {
    return Math.round((((v - domainMin) / span) * width) * 100) / 100;
  }

  const xZero = xFor(0);
  const xLower = xFor(ci[0]);
  const xUpper = xFor(ci[1]);
  const xPoint = xFor(liftPct);
  const pointLeftPct = Math.round((xPoint / width) * 1000) / 10;

  return (
    <div>
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-14 w-full" aria-hidden="true">
          <line x1={0} x2={width} y1={cy} y2={cy} stroke="currentColor" className="text-white/10" strokeWidth={1} />
          <line x1={xZero} x2={xZero} y1={6} y2={height - 6} stroke="currentColor" className="text-white/20" strokeWidth={1} strokeDasharray="2,3" />
          <line x1={xLower} x2={xUpper} y1={cy} y2={cy} className={LIFT_STROKE[liftClass]} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={xLower} x2={xLower} y1={cy - 6} y2={cy + 6} className={LIFT_STROKE[liftClass]} strokeWidth={2} />
          <line x1={xUpper} x2={xUpper} y1={cy - 6} y2={cy + 6} className={LIFT_STROKE[liftClass]} strokeWidth={2} />
          <circle cx={xPoint} cy={cy} r={5} className={LIFT_FILL[liftClass]} stroke="#09090b" strokeWidth={1.5} />
        </svg>

        <button
          type="button"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          style={{ left: `${pointLeftPct}%`, top: `${(cy / height) * 100}%` }}
          className={`absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full ${FOCUS_RING}`}
        >
          <span className="sr-only">
            {periodLabel} lift {formatSignedPct(liftPct)}, 95% interval {formatSignedPct(ci[0])} to {formatSignedPct(ci[1])}, {confidencePct}%
            confidence.
          </span>
        </button>

        {open ? (
          <div
            aria-hidden="true"
            style={{ left: `${pointLeftPct}%` }}
            className="pointer-events-none absolute bottom-full z-10 mb-2 w-44 -translate-x-1/2 rounded-lg border border-white/10 bg-zinc-950 px-2.5 py-2 text-xs shadow-xl"
          >
            <p className="font-semibold tabular-nums text-zinc-50">{formatSignedPct(liftPct)} lift</p>
            <p className="mt-0.5 font-normal tabular-nums text-zinc-400">
              CI {formatSignedPct(ci[0])} to {formatSignedPct(ci[1])}
            </p>
            <p className="font-normal tabular-nums text-zinc-400">{confidencePct}% confidence</p>
          </div>
        ) : null}
      </div>

      <div className="mt-1 flex items-center justify-between font-normal text-xs tabular-nums text-zinc-400">
        <span>{formatSignedPct(domainMin)}</span>
        <span>0%</span>
        <span>{formatSignedPct(domainMax)}</span>
      </div>
      <p className="mt-1.5 font-normal text-xs text-zinc-400">
        {periodLabel}: {formatSignedPct(liftPct)} lift, {confidencePct}% confidence — {LIFT_NOTE[liftClass]}
      </p>
    </div>
  );
}

/** A stable axis domain covering both the weekly and full-period CIs, so toggling the period
 *  widens/narrows the whisker without the whole axis jumping underneath it. */
export function stableLiftDomain(ciFull: [number, number], ciWeek: [number, number]): [number, number] {
  const min = roundDownTo5(Math.min(ciFull[0], ciWeek[0], -2));
  const max = roundUpTo5(Math.max(ciFull[1], ciWeek[1], 2));
  return [min, max];
}

/** Two horizontal bars — control vs. variant — on a shared scale. The absolute rates, not just
 *  the relative lift, so the comparison reads as real numbers rather than an abstract percentage. */
export function RateBars({
  controlRate,
  variantRate,
  liftClass,
}: {
  controlRate: number;
  variantRate: number;
  liftClass: LiftClass;
}) {
  const scaleMax = Math.max(5, roundUpTo5((Math.max(controlRate, variantRate) * 1.25)));
  const controlPct = Math.round((controlRate / scaleMax) * 1000) / 10;
  const variantPct = Math.round((variantRate / scaleMax) * 1000) / 10;
  const variantBg = liftClass === "positive" ? "bg-lime-400" : liftClass === "negative" ? "bg-rose-400" : "bg-zinc-400";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <span className="w-14 shrink-0 font-normal text-xs text-zinc-400">Control</span>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
          <div className="h-full rounded-full bg-white/25" style={{ width: `${controlPct}%` }} />
        </div>
        <span className="w-12 shrink-0 text-right font-medium text-xs tabular-nums text-zinc-50">{formatPct(controlRate)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-14 shrink-0 font-normal text-xs text-zinc-400">Variant</span>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
          <div className={`h-full rounded-full ${variantBg}`} style={{ width: `${variantPct}%` }} />
        </div>
        <span className="w-12 shrink-0 text-right font-medium text-xs tabular-nums text-zinc-50">{formatPct(variantRate)}</span>
      </div>
    </div>
  );
}

export function formatSampleFootnote(controlSample: number, variantSample: number): string {
  return `${formatCount(controlSample)} / ${formatCount(variantSample)} users`;
}
