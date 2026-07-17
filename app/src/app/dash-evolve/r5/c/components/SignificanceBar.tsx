"use client";

import { AlertTriangle, CheckCircle2, Gauge } from "lucide-react";
import type { ZTestResult } from "../lib/stats";
import { formatInt, formatSigned } from "../lib/format";
import { Badge, Card, EyebrowLabel } from "./ui";

export default function SignificanceBar({
  comparison,
  visitorsA,
  visitorsB,
  experimentName,
}: {
  comparison: ZTestResult;
  visitorsA: number;
  visitorsB: number;
  experimentName: string;
}) {
  const marginPp = 1.96 * comparison.se * 100;
  const diffLow = comparison.diffPct - marginPp;
  const diffHigh = comparison.diffPct + marginPp;
  const maxAbs = Math.max(Math.abs(diffLow), Math.abs(diffHigh), 1);
  const toPct = (v: number) => ((v + maxAbs) / (maxAbs * 2)) * 100;
  const bandLeft = toPct(diffLow);
  const bandWidth = toPct(diffHigh) - toPct(diffLow);
  const pointLeft = toPct(comparison.diffPct);
  const crossesZero = diffLow < 0 && diffHigh > 0;

  const VerdictIcon = comparison.significant ? CheckCircle2 : AlertTriangle;
  const verdictTone = comparison.significant
    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300"
    : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-300";
  const bandTone = crossesZero
    ? "bg-amber-300 dark:bg-amber-500/60"
    : comparison.diffPct >= 0
      ? "bg-indigo-400 dark:bg-indigo-400/70"
      : "bg-zinc-400 dark:bg-zinc-500/70";

  return (
    <Card className="min-w-0 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Statistical significance</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Two-proportion z-test on {experimentName}, all segments combined
            </p>
          </div>
        </div>
        <Badge className={`${verdictTone} px-2.5 py-1 text-xs`}>
          <VerdictIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {comparison.significant ? "Statistically significant" : "Not yet significant"}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        <Stat label="Sample size" value={formatInt(visitorsA + visitorsB)} caption={`A ${formatInt(visitorsA)} · B ${formatInt(visitorsB)}`} />
        <Stat
          label="Difference (B − A)"
          value={`${comparison.diffPct >= 0 ? "+" : "−"}${Math.abs(comparison.diffPct).toFixed(2)}pp`}
          caption={`Relative ${formatSigned(comparison.leader === "tie" ? 0 : comparison.upliftPct)}`}
        />
        <Stat label="95% CI of difference" value={`${diffLow.toFixed(2)} to ${diffHigh.toFixed(2)}pp`} caption="Wald interval" />
        <Stat label="p-value" value={comparison.pValue < 0.001 ? "< 0.001" : comparison.pValue.toFixed(3)} caption={`z = ${comparison.zScore.toFixed(2)}`} />
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between">
          <EyebrowLabel>Confidence interval of the lift</EyebrowLabel>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">B favored →</span>
        </div>
        <div
          className="relative h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10"
          role="img"
          aria-label={`Confidence interval for the conversion rate difference between variant B and variant A: ${diffLow.toFixed(
            2
          )} to ${diffHigh.toFixed(2)} percentage points, centered at ${comparison.diffPct.toFixed(2)} percentage points.`}
        >
          <div
            className={`absolute inset-y-0 rounded-full ${bandTone}`}
            style={{ left: `${bandLeft}%`, width: `${Math.max(bandWidth, 1.5)}%` }}
          />
          <div className="absolute inset-y-0 w-px bg-zinc-400 dark:bg-zinc-500" style={{ left: `${toPct(0)}%` }} />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-zinc-900 shadow dark:border-zinc-950 dark:bg-zinc-50"
            style={{ left: `${pointLeft}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400">
          <span>{diffLow.toFixed(1)}pp</span>
          <span>0.0pp</span>
          <span>{diffHigh.toFixed(1)}pp</span>
        </div>
      </div>
    </Card>
  );
}

function Stat({ label, value, caption }: { label: string; value: string; caption: string }) {
  return (
    <div className="min-w-0">
      <EyebrowLabel>{label}</EyebrowLabel>
      <p className="mt-1 text-base font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">{value}</p>
      <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{caption}</p>
    </div>
  );
}
