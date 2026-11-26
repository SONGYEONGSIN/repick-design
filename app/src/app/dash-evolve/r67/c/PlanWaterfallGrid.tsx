"use client";

import type { PlanId } from "./data";
import { PLAN_LABEL, PLAN_ORDER, fmtSignedPct, fmtUsd, planBridge } from "./data";
import { Card, CardTitle, FOCUS, WaterfallChart, type BridgeStep } from "./ui";

/**
 * The page's small-multiples device: one compact floating-bar waterfall per plan tier (never a
 * shared-axis bullet-chart grid — each card is scaled to its own min/max, which is what makes a
 * waterfall-per-segment grid read differently from a row of aligned bullet gauges). Clicking a
 * card is the ONE selection axis this grid owns: it only ever sets `pinnedPlanId`, which the plan
 * detail panel below reads. It never touches the accounts table's filters, sort, or its own
 * per-row hover inspector.
 */
export function PlanWaterfallGrid({ pinnedPlanId, onTogglePin }: { pinnedPlanId: PlanId | null; onTogglePin: (id: PlanId) => void }) {
  return (
    <Card>
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <CardTitle>Revenue bridge by plan</CardTitle>
          <p className="mt-0.5 text-xs font-normal text-zinc-600">This month &mdash; starting MRR through new, expansion, contraction and churn</p>
        </div>
        <ul className="flex shrink-0 flex-wrap items-center gap-3" aria-label="Legend">
          <li className="flex items-center gap-1.5 text-xs font-normal text-zinc-600">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
            Gains
          </li>
          <li className="flex items-center gap-1.5 text-xs font-normal text-zinc-600">
            <span className="h-2 w-2 shrink-0 rounded-full bg-rose-400" aria-hidden="true" />
            Losses
          </li>
          <li className="flex items-center gap-1.5 text-xs font-normal text-zinc-600">
            <span className="h-2 w-2 shrink-0 rounded-full bg-zinc-400" aria-hidden="true" />
            Start / end
          </li>
        </ul>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PLAN_ORDER.map((planId) => {
          const bridge = planBridge(planId);
          const pinned = pinnedPlanId === planId;
          const netPct = bridge.start !== 0 ? ((bridge.end - bridge.start) / bridge.start) * 100 : 0;
          const steps: BridgeStep[] = [
            { key: "start", label: "Start", value: bridge.start, kind: "start" },
            { key: "new", label: "New", value: bridge.newMrr, kind: "increase" },
            { key: "expansion", label: "Expand", value: bridge.expansion, kind: "increase" },
            { key: "contraction", label: "Contract", value: bridge.contraction, kind: "decrease" },
            { key: "churn", label: "Churn", value: bridge.churn, kind: "decrease" },
            { key: "end", label: "End", value: bridge.end, kind: "end" },
          ];
          const summary = `${PLAN_LABEL[planId]} plan: from ${fmtUsd(bridge.start)} to ${fmtUsd(bridge.end)} this month. +${fmtUsd(bridge.newMrr)} new, +${fmtUsd(bridge.expansion)} expansion, −${fmtUsd(bridge.contraction)} contraction, −${fmtUsd(bridge.churn)} churn.`;

          return (
            <button
              key={planId}
              type="button"
              aria-pressed={pinned}
              onClick={() => onTogglePin(planId)}
              className={`${FOCUS} w-full min-w-0 rounded-xl border p-3.5 text-left transition-colors motion-reduce:transition-none ${
                pinned ? "border-emerald-300 bg-emerald-50/60 ring-1 ring-inset ring-emerald-600" : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              <div className="flex min-w-0 items-baseline justify-between gap-2">
                <span className="min-w-0 truncate text-sm font-semibold text-zinc-900">{PLAN_LABEL[planId]}</span>
                <span className="shrink-0 text-xs font-medium tabular-nums text-zinc-600">{fmtSignedPct(netPct)} this month</span>
              </div>
              <p className="mt-0.5 truncate text-xs font-normal text-zinc-600">
                Ending MRR <span className="font-medium tabular-nums text-zinc-900">{fmtUsd(bridge.end)}</span>
              </p>
              <div className="mt-3">
                <WaterfallChart steps={steps} summary={summary} />
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
