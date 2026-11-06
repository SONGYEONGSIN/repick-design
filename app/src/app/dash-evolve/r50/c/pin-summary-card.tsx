"use client";

import { Fragment } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { Experiment } from "./types";
import { METRIC_ORDER, METRICS, formatSignedPct, resolveMetric, sampleFor } from "./format";
import { Badge } from "./ui";

/**
 * The pinned-experiment detail panel. It always shows all three guardrail metrics for the pinned
 * experiment, regardless of which single metric the slope chart currently plots — that
 * independence (from the metric toggle, the chart hover, and the flags-table filter) is deliberate.
 */
export function PinSummaryCard({ experiment }: { experiment: Experiment }) {
  return (
    <div className="px-4 py-4 sm:px-5">
      <p className="text-[13px] font-semibold text-zinc-900">{experiment.name}</p>
      <p className="mt-0.5 text-[11px] font-normal text-zinc-500">
        Flag <span className="font-normal text-zinc-700">{experiment.flagKey}</span> · {experiment.variant}
      </p>

      <dl className="mt-4 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5">
        {METRIC_ORDER.map((key, i) => {
          const meta = METRICS[key];
          const sample = sampleFor(experiment, key);
          const result = resolveMetric(sample, key);
          const Icon = result.direction === "improved" ? TrendingUp : TrendingDown;
          return (
            <Fragment key={key}>
              <dt
                className={`flex items-center gap-1.5 text-[11px] font-normal text-zinc-500 ${i > 0 ? "mt-2.5 border-t border-zinc-100 pt-2.5" : ""}`}
              >
                <Icon
                  className={`h-3 w-3 shrink-0 ${result.direction === "improved" ? "text-emerald-600" : "text-rose-600"}`}
                  aria-hidden="true"
                />
                {meta.label}
              </dt>
              <dd className={`flex items-baseline gap-1.5 justify-self-end text-right ${i > 0 ? "mt-2.5 border-t border-zinc-100 pt-2.5" : ""}`}>
                <span className="text-[11px] font-normal text-zinc-500 tabular-nums">{meta.format(result.before)} →</span>
                <span className="text-[13px] font-bold text-zinc-900 tabular-nums">{meta.format(result.after)}</span>
              </dd>
              <dd className="col-span-2 mt-1 flex items-center justify-between">
                <Badge
                  className={
                    result.direction === "improved" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"
                  }
                >
                  {formatSignedPct(result.pctChange)} {result.direction}
                </Badge>
                {result.significant && <span className="text-[11px] font-normal text-zinc-500">Guardrail-significant</span>}
              </dd>
            </Fragment>
          );
        })}
      </dl>
    </div>
  );
}
