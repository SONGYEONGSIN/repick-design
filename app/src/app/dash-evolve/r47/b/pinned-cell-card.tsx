"use client";

import { Gauge, Percent, Pin } from "lucide-react";
import { matrixValue, regionLabel, serviceLabel, tierIndex, type PinnedKey } from "./data";
import { formatMs, formatPercent } from "./format";
import { Card } from "./ui";

const TIER_TEXT = ["text-zinc-300", "text-rose-300", "text-rose-300", "text-rose-300", "text-rose-300"] as const;
const TIER_WORD = ["Nominal", "Watch", "Elevated", "High", "Critical"] as const;

/**
 * Tier-3 mechanism (a): the ONLY consumer of `pinnedKey`. It never touches the incident feed or
 * the incidents table — grep `pinnedKey` in this folder and the only writer is `page.tsx` (via
 * the heatmap's `onPin` callback) and the only reader is this file.
 *
 * Default-populated with the dataset's worst error-rate cell before any click ever happens, so
 * this is never an empty "click something" placeholder.
 */
export function PinnedCellCard({ pinnedKey }: { pinnedKey: PinnedKey }) {
  const errorRate = matrixValue("errorRate", pinnedKey.serviceId, pinnedKey.regionId);
  const latency = matrixValue("latencyP95", pinnedKey.serviceId, pinnedKey.regionId);
  const tier = tierIndex(errorRate, "errorRate");

  return (
    <Card as="section" ariaLabelledBy="pinned-title" className="p-4 sm:p-5">
      <div className="flex items-center gap-1.5">
        <Pin className="h-3.5 w-3.5 shrink-0 text-rose-400" aria-hidden="true" />
        <h2 id="pinned-title" className="text-sm font-semibold text-zinc-50">
          Pinned Cell
        </h2>
      </div>
      <p className="mt-1 font-normal text-xs text-zinc-400">Click any heatmap cell to pin it here.</p>

      <p className="mt-3 truncate font-medium text-sm text-zinc-50">
        {serviceLabel(pinnedKey.serviceId)} <span className="text-zinc-500">×</span> {regionLabel(pinnedKey.regionId)}
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <dt className="flex items-center gap-1 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">
            <Percent className="h-3 w-3" aria-hidden="true" />
            Error rate
          </dt>
          <dd className={`mt-0.5 [font-family:var(--font-display-wide)] text-2xl tabular-nums ${TIER_TEXT[tier]}`}>
            {formatPercent(errorRate, 2)}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">
            <Gauge className="h-3 w-3" aria-hidden="true" />
            p95 latency
          </dt>
          <dd className="mt-0.5 text-2xl tabular-nums text-zinc-50">{formatMs(latency)}</dd>
        </div>
      </dl>

      <p className="mt-3 border-t border-white/10 pt-3 font-normal text-xs text-zinc-400">
        Severity tier: <span className="font-medium text-zinc-200">{TIER_WORD[tier]}</span>
      </p>
    </Card>
  );
}
