"use client";

import { Clock, Percent, Target, TrendingUp, UserMinus } from "lucide-react";
import type { Kpi } from "./data";
import { formatValue } from "./data";
import { Badge, Sparkline } from "./ui";

const ICONS: Record<string, typeof Target> = {
  "new-arr": Target,
  "expansion-arr": TrendingUp,
  "churned-arr": UserMinus,
  "sla-breach": Clock,
  "margin-erosion": Percent,
};

// Fixed, six-period trend per KPI — deterministic dummy history, no Math.random.
const TRENDS: Record<string, readonly number[]> = {
  "new-arr": [62000, 71000, 68000, 79000, 83000, 86400],
  "expansion-arr": [19000, 21000, 24000, 22000, 26000, 27900],
  "churned-arr": [48000, 51000, 55000, 58000, 61000, 64800],
  "sla-breach": [150, 160, 175, 190, 205, 212],
  "margin-erosion": [28000, 31000, 33000, 36000, 39000, 41200],
};

/**
 * The left rail: a flat list of top-level metric instances to pick between.
 * Selecting one does exactly one thing — tells the page which KPI's
 * decomposition tree to show in the detail pane. It does not know about, and
 * never touches, that tree's own expand/collapse state.
 */
export function MetricRail({
  kpis,
  selectedId,
  onSelect,
}: {
  kpis: Kpi[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav aria-label="Variance investigations">
      <ul className="flex flex-col gap-2">
        {kpis.map((kpi) => {
          const Icon = ICONS[kpi.id] ?? Target;
          const selected = kpi.id === selectedId;
          const monthly = kpi.frames.monthly;
          return (
            <li key={kpi.id}>
              <button
                type="button"
                onClick={() => onSelect(kpi.id)}
                aria-current={selected ? "true" : undefined}
                className={`flex w-full flex-col gap-2 rounded-xl border px-3.5 py-3 text-left transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${
                  selected
                    ? "border-sky-200 bg-sky-50"
                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      selected ? "bg-sky-600 text-white" : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-zinc-900">{kpi.shortLabel}</span>
                    <span className="mt-0.5 block">
                      <Badge tone={selected ? "sky" : "neutral"}>{kpi.badge}</Badge>
                    </span>
                  </span>
                </div>
                <div className="flex items-end justify-between gap-2 pl-[42px]">
                  <span className="text-lg font-semibold tabular-nums text-zinc-900">
                    {formatValue(monthly.rootValue, kpi.unit)}
                  </span>
                  <Sparkline points={TRENDS[kpi.id] ?? [0, 0, 0, 0, 0, 0]} tone="rose" />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
