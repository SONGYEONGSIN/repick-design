"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Card, Label, SegmentedControl, Sparkline } from "./ui";
import {
  TOTAL_ON_HAND,
  ZONES,
  WINDOW_STATS,
  TREND_WINDOWS,
  TREND_WINDOW_LABEL,
  fmtUsd,
  fmtNumber,
  type TrendWindow,
} from "./data";

export function HeroPanel({
  trendWindow,
  onWindowChange,
}: {
  trendWindow: TrendWindow;
  onWindowChange: (w: TrendWindow) => void;
}) {
  const stats = WINDOW_STATS[trendWindow];
  const deltaUp = stats.fillRateDeltaPt >= 0;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Label>Inventory value on hand</Label>
          <p className="mt-1.5 font-[family-name:var(--font-display-grotesk)] text-4xl font-semibold tabular-nums text-zinc-900 sm:text-5xl">
            {fmtUsd(TOTAL_ON_HAND)}
          </p>
          <p className="mt-1.5 text-sm font-normal text-zinc-600">
            Sellable stock across {ZONES.length} active zones, right now
          </p>
        </div>

        <SegmentedControl
          label="Trend window"
          value={trendWindow}
          onChange={onWindowChange}
          options={TREND_WINDOWS.map((w) => ({ value: w, label: TREND_WINDOW_LABEL[w] }))}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-zinc-100 pt-4 sm:grid-cols-3">
        <div className="flex min-w-0 items-end justify-between gap-3">
          <div className="min-w-0">
            <Label>Fill rate</Label>
            <p className="mt-1 text-lg font-semibold tabular-nums text-zinc-900">{stats.fillRatePct}%</p>
            <p className={`mt-0.5 flex items-center gap-1 text-xs font-normal tabular-nums ${deltaUp ? "text-green-700" : "text-rose-700"}`}>
              {deltaUp ? (
                <ArrowUp className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              ) : (
                <ArrowDown className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              )}
              {Math.abs(stats.fillRateDeltaPt)}pt vs prior {TREND_WINDOW_LABEL[trendWindow]}
            </p>
          </div>
          <Sparkline values={stats.sparkline} />
        </div>

        <div className="min-w-0">
          <Label>Avg dwell time</Label>
          <p className="mt-1 text-lg font-semibold tabular-nums text-zinc-900">{stats.avgDwellDays}d</p>
          <p className="mt-0.5 text-xs font-normal text-zinc-500">from receipt to pick-ready</p>
        </div>

        <div className="min-w-0">
          <Label>Units received</Label>
          <p className="mt-1 text-lg font-semibold tabular-nums text-zinc-900">{fmtNumber(stats.unitsReceived)}</p>
          <p className="mt-0.5 text-xs font-normal text-zinc-500">across all zones, this window</p>
        </div>
      </div>
    </Card>
  );
}
