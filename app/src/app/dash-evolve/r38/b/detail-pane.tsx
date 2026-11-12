"use client";

import { useMemo, useState } from "react";
import type { Kpi, Period } from "./data";
import { flattenLeaves, formatValue } from "./data";
import { Badge, Card, SegmentedControl } from "./ui";
import { DecompositionTree } from "./decomposition-tree";
import { LeafTable } from "./leaf-table";

const PERIOD_OPTIONS = [
  { value: "monthly" as Period, label: "This month" },
  { value: "quarterly" as Period, label: "This quarter" },
];

/**
 * The detail pane shown for whichever KPI is selected in the rail.
 *
 * `period` is local state, scoped entirely to this pane — toggling it swaps
 * which fixed dataset feeds the tree and table below, but it is never read
 * by the rail and never resets when the rail selection changes except by
 * virtue of this whole pane being handed a different `kpi` prop. The tree's
 * own expand/collapse state lives one level deeper still, inside
 * `DecompositionTree`, and this component never reaches into it.
 */
export function DetailPane({ kpi }: { kpi: Kpi }) {
  const [period, setPeriod] = useState<Period>("monthly");
  const frame = kpi.frames[period];
  const leafRows = useMemo(() => flattenLeaves(frame.tree), [frame]);

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-zinc-900">{kpi.name}</h2>
              <Badge tone="rose">{kpi.badge}</Badge>
            </div>
            <p className="mt-1 text-sm text-zinc-500">
              Root-cause breakdown by {kpi.dimensionLabels[0].toLowerCase()}, {kpi.dimensionLabels[1].toLowerCase()}
              , then {kpi.dimensionLabels[2].toLowerCase()}.
            </p>
          </div>
          <SegmentedControl label="Reporting period" options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />
        </div>

        <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-4 border-t border-zinc-100 pt-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{frame.rootLabel}</p>
            <p
              className="text-3xl font-semibold tabular-nums text-zinc-900"
              style={{ fontFamily: "var(--font-display-grotesk)" }}
            >
              {formatValue(frame.rootValue, kpi.unit)}
            </p>
          </div>
          {frame.context && (
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                  {frame.context.targetLabel}
                </p>
                <p className="text-sm font-semibold tabular-nums text-zinc-700">
                  {formatValue(frame.context.targetValue, kpi.unit)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                  {frame.context.actualLabel}
                </p>
                <p className="text-sm font-semibold tabular-nums text-zinc-700">
                  {formatValue(frame.context.actualValue, kpi.unit)}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-zinc-900">Root-cause breakdown</h3>
        <p className="mt-0.5 text-xs text-zinc-500">
          Expand any branch to see how it splits further. Collapsed branches still show their full
          value and share.
        </p>
        <div className="mt-3">
          <DecompositionTree key={kpi.id} root={frame.tree} unit={kpi.unit} dimensionLabels={kpi.dimensionLabels} />
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-zinc-900">Reason code detail</h3>
        <LeafTable rows={leafRows} unit={kpi.unit} />
      </Card>
    </div>
  );
}
