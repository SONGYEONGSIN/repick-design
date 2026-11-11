"use client";

import { AlertTriangle, GitBranch, Timer } from "lucide-react";
import type { PeriodData, PeriodKey } from "../lib/data";
import { PERIOD_OPTIONS, formatCount, formatDuration, formatPercent } from "../lib/data";
import { Card, FieldLabel, SegmentedControl } from "./ui";

const DISPLAY_FONT = { fontFamily: "var(--font-display-mono)" };

/**
 * The hero strip. The headline success rate AND the bottleneck stage's name/count/duration are
 * plain static text here — never behind a hover or a click — so the page's core story reads
 * before anyone touches the process map below.
 */
export function Hero({
  data,
  period,
  onPeriodChange,
}: {
  data: PeriodData;
  period: PeriodKey;
  onPeriodChange: (p: PeriodKey) => void;
}) {
  const bottleneck = data.bottlenecks[0];

  return (
    <section aria-labelledby="hero-heading" className="min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <FieldLabel>Pipeline Health &middot; {data.label}</FieldLabel>
          <h1 id="hero-heading" className="mt-1.5 text-[26px] font-semibold text-zinc-50 sm:text-[30px]" style={DISPLAY_FONT}>
            Build pipeline reliability
          </h1>
          <p className="mt-1.5 max-w-xl text-sm font-normal text-zinc-400">
            Trestle traces every build from checkout to production release and names exactly
            which stage is holding the line up.
          </p>
        </div>
        <SegmentedControl options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} label="Reporting period" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="min-w-0">
          <FieldLabel>Overall Success Rate</FieldLabel>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-[34px] font-semibold leading-none text-zinc-50" style={DISPLAY_FONT}>
              {formatPercent(data.successRate)}
            </span>
          </div>
          <p className="mt-2 text-xs font-normal text-zinc-400">
            {formatCount(data.releasedRuns)} of {formatCount(data.totalRuns)} builds reached production.
          </p>
        </Card>

        <Card className="min-w-0">
          <FieldLabel>Total Runs</FieldLabel>
          <div className="mt-2 flex items-center gap-2">
            <GitBranch className="h-4 w-4 shrink-0 text-violet-400" aria-hidden="true" />
            <span className="font-mono text-[28px] font-semibold leading-none text-zinc-50">
              {formatCount(data.totalRuns)}
            </span>
          </div>
          <p className="mt-2 text-xs font-normal text-zinc-400">Triggered across all branches, {data.label.toLowerCase()}.</p>
        </Card>

        <Card className="min-w-0">
          <FieldLabel>Avg Pipeline Duration</FieldLabel>
          <div className="mt-2 flex items-center gap-2">
            <Timer className="h-4 w-4 shrink-0 text-violet-400" aria-hidden="true" />
            <span className="font-mono text-[28px] font-semibold leading-none text-zinc-50">
              {formatDuration(data.totalDurationMin)}
            </span>
          </div>
          <p className="mt-2 text-xs font-normal text-zinc-400">Checkout through production, straight-through builds.</p>
        </Card>

        <Card className="min-w-0 border-amber-400/25 bg-amber-400/[0.06]">
          <FieldLabel tone="amber">Current Bottleneck</FieldLabel>
          <div className="mt-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
            <span className="truncate text-lg font-semibold text-zinc-50">{bottleneck.name}</span>
          </div>
          <p className="mt-2 text-xs font-normal text-zinc-400">
            <span className="font-mono tabular-nums text-amber-400">{formatCount(bottleneck.failed)}</span> failed runs
            {" · "}
            <span className="font-mono tabular-nums text-amber-400">{formatDuration(bottleneck.avgDurationMin)}</span>{" "}
            avg hold time
          </p>
        </Card>
      </div>
    </section>
  );
}
