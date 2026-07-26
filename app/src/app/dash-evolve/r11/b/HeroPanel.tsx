"use client";

import { ArrowDownRight, ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import type { HeroStats, MetricId, PeriodId } from "./data";
import { METRIC_OPTIONS, PERIOD_OPTIONS, fmtPct, formatMetric, formatMetricSigned } from "./data";
import { BORDER, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { Card, CardHeader, EyebrowLabel, NUM, SegmentedControl, Sparkline } from "./ui";

export default function HeroPanel({
  period,
  metric,
  onPeriodChange,
  onMetricChange,
  stats,
  trend,
  trendLabels,
  periodLabel,
  newValue,
}: {
  period: PeriodId;
  metric: MetricId;
  onPeriodChange: (p: PeriodId) => void;
  onMetricChange: (m: MetricId) => void;
  stats: HeroStats;
  trend: number[];
  trendLabels: string[];
  periodLabel: string;
  newValue: number;
}) {
  const retentionUp = stats.netRetention >= 1;
  const noun = metric === "arr" ? "ARR" : "Seats";

  return (
    <Card>
      <CardHeader
        as="h2"
        titleId="hero-heading"
        title={`Ending ${noun}`}
        description={`Bridge window: ${periodLabel}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <SegmentedControl ariaLabel="Bridge period" options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} size="sm" />
            <SegmentedControl ariaLabel="Bridge metric unit" options={METRIC_OPTIONS} value={metric} onChange={onMetricChange} size="sm" />
          </div>
        }
      />

      <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-end gap-4">
          <p className={cx("text-4xl font-semibold tracking-tight sm:text-5xl", NUM, TEXT_PRIMARY)}>{formatMetric(metric, stats.endValue)}</p>
          <div className="h-11 w-28 shrink-0 sm:h-12 sm:w-36">
            <Sparkline values={trend} stroke="stroke-[#A16207] dark:stroke-amber-400" fill="fill-[#A16207] dark:fill-amber-400" />
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3 lg:w-auto">
          <InlineStat
            label="Net retention"
            value={fmtPct(stats.netRetention)}
            Icon={retentionUp ? ArrowUpRight : ArrowDownRight}
            tone={retentionUp ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}
          />
          <InlineStat label="Gross attrition" value={fmtPct(stats.grossAttrition)} Icon={TrendingDown} tone="text-rose-700 dark:text-rose-300" />
          <InlineStat label="New business" value={formatMetricSigned(metric, newValue, true)} Icon={TrendingUp} tone="text-emerald-700 dark:text-emerald-300" />
        </dl>
      </div>

      <div className={cx("mt-4 flex items-center justify-between border-t pt-3 text-[11px]", BORDER, TEXT_CAPTION)}>
        <span>Trailing 6 {period === "monthly" ? "months" : "quarters"}: {trendLabels.join(" · ")}</span>
        <span className={TEXT_SECONDARY}>Snapshot deterministic — no live feed</span>
      </div>
    </Card>
  );
}

function InlineStat({ label, value, Icon, tone }: { label: string; value: string; Icon: typeof TrendingUp; tone: string }) {
  return (
    <div className="min-w-0">
      <dt>
        <EyebrowLabel>{label}</EyebrowLabel>
      </dt>
      <dd className={cx("mt-0.5 flex items-center gap-1 text-lg font-semibold", NUM, tone)}>
        <Icon size={15} aria-hidden="true" />
        {value}
      </dd>
    </div>
  );
}
