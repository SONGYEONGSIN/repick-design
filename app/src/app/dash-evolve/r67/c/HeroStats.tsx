"use client";

import { Plus, TrendingDown, TrendingUp, UserRoundX } from "lucide-react";
import type { PeriodKey, PeriodMetrics } from "./data";
import { PERIOD_OPTIONS, fmtSignedPct, fmtUsd, fmtUsdCompact } from "./data";
import { Card, SegmentedControl, Sparkline, StatTile } from "./ui";

const PERIOD_WINDOW_LABEL: Record<PeriodKey, string> = {
  "30d": "the last 30 days",
  "90d": "the last 90 days",
  "6m": "the last 6 months",
};

/**
 * The macro layout's top region: one headline metric (current MRR, always current — never itself
 * period-dependent) plus four inline secondary stats, each reduced from the *same* look-back
 * window the period toggle picks (`periodMetrics`). Every value here is plain text before any
 * sparkline is even drawn, so nothing in this section is hover-gated.
 */
export function HeroStats({ period, onPeriodChange, metrics }: { period: PeriodKey; onPeriodChange: (p: PeriodKey) => void; metrics: PeriodMetrics }) {
  const positive = metrics.deltaPct >= 0;
  const windowLabel = PERIOD_WINDOW_LABEL[period];

  return (
    <Card>
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">Monthly recurring revenue</h2>
          <div className="mt-1 flex min-w-0 flex-wrap items-baseline gap-3">
            <span className="text-4xl font-semibold tabular-nums text-zinc-900 sm:text-5xl">{fmtUsd(metrics.current)}</span>
            <span className={`flex shrink-0 items-center gap-1 text-sm font-medium tabular-nums ${positive ? "text-emerald-700" : "text-rose-700"}`}>
              {positive ? <TrendingUp className="h-4 w-4 shrink-0" aria-hidden="true" /> : <TrendingDown className="h-4 w-4 shrink-0" aria-hidden="true" />}
              {fmtSignedPct(metrics.deltaPct)}
            </span>
          </div>
          <p className="mt-1 text-xs font-normal text-zinc-600">vs the start of {windowLabel}</p>
        </div>
        <SegmentedControl label="Reporting period" options={PERIOD_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} value={period} onChange={onPeriodChange} />
      </div>

      <div className="mt-4 h-16 w-full min-w-0 text-emerald-600">
        <Sparkline values={metrics.mrrSeries} tone="emerald" height={64} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <StatTile
          label="New MRR"
          value={fmtUsdCompact(metrics.newMrr)}
          icon={Plus}
          tone="text-emerald-700"
          sparkline={<Sparkline values={metrics.newSeries} tone="emerald" height={24} />}
        />
        <StatTile
          label="Expansion MRR"
          value={fmtUsdCompact(metrics.expansionMrr)}
          icon={TrendingUp}
          tone="text-emerald-700"
          sparkline={<Sparkline values={metrics.expansionSeries} tone="emerald" height={24} />}
        />
        <StatTile
          label="Contraction MRR"
          value={`−${fmtUsdCompact(metrics.contractionMrr)}`}
          icon={TrendingDown}
          tone="text-amber-700"
          sparkline={<Sparkline values={metrics.contractionSeries} tone="rose" height={24} />}
        />
        <StatTile
          label="Churned MRR"
          value={`−${fmtUsdCompact(metrics.churnMrr)}`}
          icon={UserRoundX}
          tone="text-rose-700"
          sparkline={<Sparkline values={metrics.churnSeries} tone="rose" height={24} />}
        />
      </div>
    </Card>
  );
}
