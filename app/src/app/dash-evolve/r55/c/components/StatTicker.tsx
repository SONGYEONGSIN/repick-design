"use client";

import type { ReactNode } from "react";
import {
  FACILITIES,
  METRICS,
  averageScore,
  averageDelta,
  improvingCount,
  topMover,
  flaggedCount,
  CURRENT_LABEL,
  type MetricId,
} from "../lib/data";
import { TrendIndicator } from "./ui";

/**
 * A single inline row of text stats — middot-separated, not a card grid. Every value is derived
 * from `FACILITIES` at render time (see lib/data.ts), so nothing here can drift from the chart
 * below it. Three of the five figures recompute when the active metric changes, which keeps the
 * ticker in sync with the metric toggle rather than reading as a static header.
 */
export function StatTicker({ activeMetric }: { activeMetric: MetricId }) {
  const metric = METRICS.find((m) => m.id === activeMetric)!;
  const avg = averageScore(activeMetric, "current");
  const delta = averageDelta(activeMetric);
  const improving = improvingCount(activeMetric);
  const total = FACILITIES.length;
  const mover = topMover(activeMetric);
  const flagged = flaggedCount();

  const items: { value: ReactNode; label: string }[] = [
    { value: total, label: "facilities tracked" },
    {
      value: (
        <span className="inline-flex items-baseline gap-1.5">
          {avg.toFixed(1)}
          <TrendIndicator delta={delta} className="text-xs" srPrefix={`${metric.shortLabel} average`} />
        </span>
      ),
      label: `avg ${metric.shortLabel.toLowerCase()} score vs ${CURRENT_LABEL.replace("Q3", "Q2")}`,
    },
    { value: `${improving} of ${total}`, label: `improving on ${metric.shortLabel.toLowerCase()}` },
    {
      value: (
        <span className="inline-flex items-baseline gap-1.5">
          {mover.facility.name}
          <TrendIndicator delta={mover.delta} className="text-xs" />
        </span>
      ),
      label: "biggest mover",
    },
    { value: flagged, label: "flagged below compliance threshold" },
  ];

  return (
    <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 sm:px-6">
      <ul aria-label="Portfolio summary" className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 ? (
              <span aria-hidden="true" className="text-zinc-300">
                ·
              </span>
            ) : null}
            <span className="font-semibold tabular-nums text-zinc-900">{item.value}</span>
            <span className="whitespace-nowrap text-zinc-500">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
