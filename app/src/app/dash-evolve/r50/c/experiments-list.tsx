"use client";

import { Pin, TrendingDown, TrendingUp } from "lucide-react";
import type { Experiment, MetricKey } from "./types";
import { METRICS, formatSignedPct, resolveMetric, sampleFor } from "./format";
import { Badge, FOCUS_RING } from "./ui";

/**
 * A separate selection axis from the slope chart's hover tooltip: clicking a row here *pins* an
 * experiment into the narrow summary card (persists until another row is clicked), while hovering
 * or focusing a line in the chart only opens an ephemeral tooltip that never touches this list's
 * state and vice versa — the two selections are deliberately independent.
 */
export function ExperimentsList({
  experiments,
  metric,
  pinnedId,
  onPin,
}: {
  experiments: Experiment[];
  metric: MetricKey;
  pinnedId: string;
  onPin: (id: string) => void;
}) {
  const meta = METRICS[metric];
  const ranked = [...experiments].sort((a, b) => {
    const ra = resolveMetric(sampleFor(a, metric), metric);
    const rb = resolveMetric(sampleFor(b, metric), metric);
    return Math.abs(rb.pctChange) - Math.abs(ra.pctChange);
  });

  return (
    <ul className="h-full divide-y divide-zinc-100 overflow-y-auto" aria-label="Active experiments">
      {ranked.map((exp) => {
        const result = resolveMetric(sampleFor(exp, metric), metric);
        const isPinned = exp.id === pinnedId;
        const Icon = result.direction === "improved" ? TrendingUp : TrendingDown;
        return (
          <li key={exp.id}>
            <button
              type="button"
              onClick={() => onPin(exp.id)}
              aria-pressed={isPinned}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 ease-out hover:bg-zinc-50 sm:px-5 ${FOCUS_RING} ${
                isPinned ? "bg-emerald-50/70" : ""
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-[13px] font-normal text-zinc-900">{exp.shortName}</span>
                  {isPinned && (
                    <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800" icon={<Pin className="h-2.5 w-2.5" aria-hidden="true" />}>
                      Pinned
                    </Badge>
                  )}
                </span>
                <span className="block truncate text-[11px] font-normal text-zinc-500">{exp.flagKey}</span>
              </span>
              <span
                className={`inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold tabular-nums ${
                  result.direction === "improved" ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {formatSignedPct(result.pctChange)}
              </span>
            </button>
          </li>
        );
      })}
      <li className="px-4 py-2 text-[11px] font-normal text-zinc-500 sm:px-5">Ranked by {meta.label.toLowerCase()} swing, largest first.</li>
    </ul>
  );
}
