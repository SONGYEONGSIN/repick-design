"use client";

import { Plus, X } from "lucide-react";
import { BENCH_CAPACITY, classifyLift, experimentById, type Experiment } from "./data";
import { formatSecondaryValue } from "./format";
import { LiftWhiskerPlot, RateBars, formatSampleFootnote, stableLiftDomain } from "./metric-chart";
import { Avatar, Card, FOCUS_RING, LIFT_META, SegmentedControl, StatusBadge } from "./ui";

export type Period = "week" | "full";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "week", label: "Last 7 days" },
  { value: "full", label: "Full test period" },
];

function RunCard({ experiment, period, onUnpin }: { experiment: Experiment; period: Period; onUnpin: (id: string) => void }) {
  const ci = period === "week" ? experiment.ciWeek : experiment.ciFull;
  const authoritativeClass = classifyLift(experiment.ciFull);
  const meta = LIFT_META[authoritativeClass];
  const HeadlineIcon = meta.icon;
  const domain = stableLiftDomain(experiment.ciFull, experiment.ciWeek);

  return (
    <Card>
      <div className="flex items-start justify-between gap-2 border-b border-white/10 p-4">
        <div className="min-w-0">
          <p className="truncate font-medium text-sm text-zinc-50">{experiment.name}</p>
          <p className="mt-1.5">
            <StatusBadge status={experiment.status} />
          </p>
        </div>
        <button
          type="button"
          onClick={() => onUnpin(experiment.id)}
          aria-label={`Remove ${experiment.name} from the comparison bench`}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="p-4">
        <p className="line-clamp-2 font-normal text-xs text-zinc-400">{experiment.hypothesis}</p>

        <div className="mt-4">
          <p className={`flex items-baseline gap-1.5 font-semibold text-3xl tabular-nums ${meta.text}`}>
            <HeadlineIcon className="h-6 w-6 shrink-0 translate-y-0.5" aria-hidden="true" />
            {experiment.liftPct > 0 ? "+" : experiment.liftPct < 0 ? "−" : ""}
            {Math.abs(experiment.liftPct).toFixed(1)}%
          </p>
          <p className="mt-0.5 font-normal text-xs text-zinc-400">
            lift on <span className="font-medium text-zinc-50">{experiment.metricLabel}</span>, full test to date
          </p>
        </div>

        <div className="mt-4">
          <LiftWhiskerPlot
            liftPct={experiment.liftPct}
            ci={ci}
            confidencePct={experiment.confidencePct}
            periodLabel={period === "week" ? "Trailing 7 days" : "Full test period"}
            stableDomain={domain}
          />
        </div>

        <div className="mt-4">
          <p className="font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-400">{experiment.metricLabel}</p>
          <div className="mt-2">
            <RateBars controlRate={experiment.controlRate} variantRate={experiment.variantRate} liftClass={authoritativeClass} />
          </div>
        </div>

        <table className="mt-4 w-full table-fixed border-collapse">
          <caption className="sr-only">Secondary metrics for {experiment.name}</caption>
          <colgroup>
            <col style={{ width: "46%" }} />
            <col style={{ width: "27%" }} />
            <col style={{ width: "27%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10">
              <th scope="col" className="py-1 text-left font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-400">
                Secondary
              </th>
              <th scope="col" className="py-1 text-right font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-400">
                Control
              </th>
              <th scope="col" className="py-1 text-right font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-400">
                Variant
              </th>
            </tr>
          </thead>
          <tbody>
            {experiment.secondaryMetrics.map((m) => (
              <tr key={m.label} className="border-b border-white/5">
                <td className="py-1.5 pr-1 font-normal text-xs text-zinc-400">{m.label}</td>
                <td className="py-1.5 text-right font-medium text-xs tabular-nums text-zinc-50">
                  {formatSecondaryValue(m, m.control)}
                </td>
                <td className="py-1.5 text-right font-medium text-xs tabular-nums text-zinc-50">
                  {formatSecondaryValue(m, m.variant)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-white/10 pt-3">
          <span className="inline-flex min-w-0 items-center gap-2">
            <Avatar initials={experiment.owner.initials} className="h-6 w-6 shrink-0 text-[10px]" />
            <span className="truncate font-normal text-xs text-zinc-400">{experiment.owner.name}</span>
          </span>
          <span className="font-normal text-xs tabular-nums text-zinc-400">
            {experiment.startedOn} · {formatSampleFootnote(experiment.controlSample, experiment.variantSample)}
          </span>
        </div>
      </div>
    </Card>
  );
}

export default function ComparisonBench({
  pinnedIds,
  onUnpin,
  period,
  onPeriodChange,
}: {
  pinnedIds: string[];
  onUnpin: (id: string) => void;
  period: Period;
  onPeriodChange: (period: Period) => void;
}) {
  const slots = Array.from({ length: BENCH_CAPACITY }, (_, i) => pinnedIds[i]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-normal text-sm text-zinc-400">
          Comparing <span className="font-medium text-zinc-50">{pinnedIds.length}</span> of {BENCH_CAPACITY} slots. Pin
          experiments from the rail below to add or swap a slot.
        </p>
        <SegmentedControl label="Comparison window" options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:gap-6">
        {slots.map((id, i) => {
          if (!id) {
            return (
              <div
                key={`empty-${i}`}
                className="col-span-12 flex min-w-0 min-h-[200px] items-center justify-center rounded-xl border border-dashed border-white/15 p-4 text-center md:col-span-6 lg:col-span-4"
              >
                <p className="flex flex-col items-center gap-2 font-normal text-sm text-zinc-400">
                  <Plus className="h-5 w-5" aria-hidden="true" />
                  Empty slot — pin an experiment below to compare
                </p>
              </div>
            );
          }
          const experiment = experimentById(id);
          if (!experiment) return null;
          return (
            <div key={id} className="col-span-12 min-w-0 md:col-span-6 lg:col-span-4">
              <RunCard experiment={experiment} period={period} onUnpin={onUnpin} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
