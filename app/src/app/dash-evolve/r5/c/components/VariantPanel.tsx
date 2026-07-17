"use client";

import { useState } from "react";
import { Percent, ShieldCheck, Users } from "lucide-react";
import type { Experiment, PeriodId, SegmentId } from "../lib/data";
import { segmentsForPeriod, seriesForPeriod } from "../lib/data";
import {
  SegmentSortKey,
  SortDir,
  formatInt,
  formatPct,
  formatSigned,
  sumSegments,
} from "../lib/format";
import { confidenceInterval95, twoProportionZTest } from "../lib/stats";
import { Badge, Card, EyebrowLabel } from "./ui";
import KpiCard from "./KpiCard";
import CrosshairChart from "./CrosshairChart";
import SegmentTable from "./SegmentTable";

export interface AccentTokens {
  dot: string;
  chip: string;
  text: string;
  chartText: string;
}

export default function VariantPanel({
  side,
  experiment,
  period,
  trafficSplit,
  accent,
  yDomain,
  selectedSegment,
  onSelectSegment,
}: {
  side: "a" | "b";
  experiment: Experiment;
  period: PeriodId;
  trafficSplit: number;
  accent: AccentTokens;
  yDomain: [number, number];
  selectedSegment: SegmentId | "all";
  onSelectSegment: (id: SegmentId | "all") => void;
}) {
  const [sortKey, setSortKey] = useState<SegmentSortKey>("rate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SegmentSortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const variantSeed = side === "a" ? experiment.variantA : experiment.variantB;
  const otherSeed = side === "a" ? experiment.variantB : experiment.variantA;

  const rows = segmentsForPeriod(variantSeed, period);
  const otherRows = segmentsForPeriod(otherSeed, period);
  const totals = sumSegments(rows);
  const otherTotals = sumSegments(otherRows);

  const filteredSelf =
    selectedSegment === "all"
      ? totals
      : sumSegments(rows.filter((r) => r.id === selectedSegment));
  const filteredOther =
    selectedSegment === "all"
      ? otherTotals
      : sumSegments(otherRows.filter((r) => r.id === selectedSegment));

  const comparison =
    side === "a"
      ? twoProportionZTest(filteredSelf.visitors, filteredSelf.conversions, filteredOther.visitors, filteredOther.conversions)
      : twoProportionZTest(filteredOther.visitors, filteredOther.conversions, filteredSelf.visitors, filteredSelf.conversions);

  const selfIsLeader = comparison.leader === side;
  const rateDelta =
    comparison.leader === "tie"
      ? { direction: "flat" as const, text: "±0.0%" }
      : selfIsLeader
        ? { direction: "up" as const, text: formatSigned(comparison.upliftPct) }
        : { direction: "down" as const, text: `−${Math.abs(comparison.upliftPct).toFixed(1)}%` };

  const [ciLow, ciHigh] = confidenceInterval95(filteredSelf.rate, filteredSelf.visitors);

  const series = seriesForPeriod(variantSeed, period);

  const heading = side === "a" ? "Variant A" : "Variant B";

  return (
    <section
      aria-labelledby={`panel-${side}-heading`}
      className="flex min-w-0 flex-1 flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${accent.dot}`} aria-hidden="true" />
          <h2 id={`panel-${side}-heading`} className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {heading}
          </h2>
          <Badge className={accent.chip}>{variantSeed.label}</Badge>
        </div>
        <Badge className="border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
          {trafficSplit}% of traffic
        </Badge>
      </div>
      <p className="-mt-2 text-xs text-zinc-500 dark:text-zinc-400">{variantSeed.description}</p>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <KpiCard
          icon={Percent}
          label="Conversion rate"
          value={formatPct(filteredSelf.rate)}
          caption={selectedSegment === "all" ? "All segments" : "Filtered segment"}
          delta={rateDelta}
        />
        <KpiCard
          icon={Users}
          label="Visitors"
          value={formatInt(filteredSelf.visitors)}
          caption={`${formatInt(filteredSelf.conversions)} conversions`}
        />
        <KpiCard
          icon={ShieldCheck}
          label="95% CI"
          value={`${ciLow.toFixed(1)}–${ciHigh.toFixed(1)}%`}
          caption="Wald interval"
        />
      </div>

      <Card className="min-w-0 p-3.5 sm:p-4">
        <div className="mb-3 flex items-center justify-between">
          <EyebrowLabel>{experiment.metricLabel} · daily</EyebrowLabel>
          <span className={`text-xs font-semibold tabular-nums ${accent.text}`}>
            {series[series.length - 1]?.value.toFixed(2)}%
          </span>
        </div>
        <CrosshairChart
          data={series}
          yDomain={yDomain}
          accentClass={accent.chartText}
          ariaLabel={`${heading} ${experiment.metricLabel} trend`}
        />
      </Card>

      <Card className="min-w-0 p-3.5 sm:p-4">
        <EyebrowLabel className="mb-2 block">Breakdown by segment</EyebrowLabel>
        <SegmentTable
          caption={`${heading} conversion rate by segment for ${experiment.name}`}
          rows={rows}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          selectedSegment={selectedSegment}
          onSelectSegment={onSelectSegment}
          accentTextClass={accent.text}
        />
      </Card>
    </section>
  );
}
