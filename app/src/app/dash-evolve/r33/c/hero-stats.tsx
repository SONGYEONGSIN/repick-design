"use client";

/**
 * Hero number + inline supporting stats. Deliberately NOT a 4-card KPI row —
 * everything here lives inside a single Card, with the supporting figures
 * set as inline stat groups beside the headline number rather than as their
 * own cards (per the macro-skeleton brief for this round).
 */

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, Progress, SectionLabel, Sparkline, TabPanel, Tabs } from "./ui";
import {
  FUNNEL_DATA,
  MEDIAN_DAYS_TO_ACTIVATE,
  PERIOD_META,
  QUARTERLY_RETAINED_GOAL,
  TREND_DATA,
  endToEndConversionPct,
  formatCount,
  formatPct,
  formatSignedCount,
  formatSignedDays,
  otherPeriod,
  paidToRetainedPct,
  retainedCount,
  type PeriodId,
} from "./data";

type TrendMetric = "conversion" | "visitors" | "retained";

const TREND_TABS: { value: TrendMetric; label: string }[] = [
  { value: "conversion", label: "Conversion" },
  { value: "visitors", label: "Visitors" },
  { value: "retained", label: "Retained" },
];

const TREND_FORMAT: Record<TrendMetric, (n: number) => string> = {
  conversion: (n) => formatPct(n, 2),
  visitors: (n) => formatCount(n),
  retained: (n) => formatCount(n),
};

function formatSignedPoints(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "±";
  return `${sign}${Math.abs(n).toFixed(2)} pp`;
}

function DeltaTag({
  value,
  suffix,
  improvementIsNegative = false,
}: {
  value: number;
  suffix: "pp" | "d" | "count";
  improvementIsNegative?: boolean;
}) {
  const isFlat = Math.abs(value) < 0.001;
  const good = improvementIsNegative ? value < 0 : value > 0;
  const Icon = isFlat ? Minus : good ? ArrowUpRight : ArrowDownRight;
  const tone = isFlat ? "text-zinc-400" : good ? "text-emerald-300" : "text-rose-300";
  const text = suffix === "pp" ? formatSignedPoints(value) : suffix === "d" ? formatSignedDays(value) : formatSignedCount(value);
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${tone}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {text}
    </span>
  );
}

export function HeroStats({ period }: { period: PeriodId }) {
  const [trendMetric, setTrendMetric] = useState<TrendMetric>("conversion");
  const stages = FUNNEL_DATA[period];
  const compareStages = FUNNEL_DATA[otherPeriod(period)];

  const heroPct = endToEndConversionPct(stages);
  const comparePct = endToEndConversionPct(compareStages);
  const deltaPct = heroPct - comparePct;

  const retained = retainedCount(stages);
  const compareRetained = retainedCount(compareStages);
  const deltaRetained = retained - compareRetained;

  const paidRetainedPct = paidToRetainedPct(stages);
  const comparePaidRetainedPct = paidToRetainedPct(compareStages);
  const deltaPaidRetainedPct = paidRetainedPct - comparePaidRetainedPct;

  const days = MEDIAN_DAYS_TO_ACTIVATE[period];
  const compareDays = MEDIAN_DAYS_TO_ACTIVATE[otherPeriod(period)];
  const deltaDays = days - compareDays;

  const trendSeries = TREND_DATA[period][trendMetric];
  const trendStart = trendSeries[0];
  const trendEnd = trendSeries[trendSeries.length - 1];

  return (
    <Card className="p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <SectionLabel>End-to-end conversion &middot; {PERIOD_META[period].range}</SectionLabel>
          <p className="mt-2 text-[56px] font-bold leading-none tabular-nums text-zinc-50 sm:text-[64px]" style={{ fontFamily: "var(--font-display-grotesk)" }}>
            {formatPct(heroPct, 2)}
          </p>
          <div className="mt-2">
            <DeltaTag value={deltaPct} suffix="pp" />
            <span className="ml-1.5 text-xs text-zinc-400">vs. {PERIOD_META[otherPeriod(period)].label.toLowerCase()}</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
            <div>
              <SectionLabel>Retained customers</SectionLabel>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums text-zinc-50">{formatCount(retained)}</span>
                <DeltaTag value={deltaRetained} suffix="count" />
              </div>
            </div>
            <div>
              <SectionLabel>Paid &rarr; retained rate</SectionLabel>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums text-zinc-50">{formatPct(paidRetainedPct)}</span>
                <DeltaTag value={deltaPaidRetainedPct} suffix="pp" />
              </div>
            </div>
            <div>
              <SectionLabel>Median time to activate</SectionLabel>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums text-zinc-50">{days.toFixed(1)}d</span>
                <DeltaTag value={deltaDays} suffix="d" improvementIsNegative />
              </div>
            </div>
          </div>

          <div className="mt-6 max-w-sm">
            <Progress
              value={retained}
              max={QUARTERLY_RETAINED_GOAL}
              label="Quarterly retained-customer goal"
              valueText={`${formatCount(retained)} / ${formatCount(QUARTERLY_RETAINED_GOAL)}`}
            />
          </div>
        </div>

        <div className="flex flex-col lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-8">
          <Tabs id="trend" options={TREND_TABS} value={trendMetric} onChange={setTrendMetric} label="Trend metric" />
          {TREND_TABS.map((tab) => (
            <TabPanel key={tab.value} tabId="trend" value={tab.value}>
              {tab.value === trendMetric ? (
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <SectionLabel>8-week trend</SectionLabel>
                    <p className="mt-1 text-sm text-zinc-300">
                      <span className="tabular-nums">{TREND_FORMAT[trendMetric](trendStart)}</span>
                      <span className="mx-1.5 text-zinc-400" aria-hidden="true">&rarr;</span>
                      <span className="font-bold tabular-nums text-zinc-50">{TREND_FORMAT[trendMetric](trendEnd)}</span>
                    </p>
                  </div>
                  <Sparkline values={trendSeries} width={140} height={40} />
                </div>
              ) : null}
            </TabPanel>
          ))}
        </div>
      </div>
    </Card>
  );
}
