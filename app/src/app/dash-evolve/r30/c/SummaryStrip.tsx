"use client";

import { Crosshair, X } from "lucide-react";
import {
  NODE_BY_ID,
  TOTALS,
  STATUS_META,
  statusFor,
  formatCompact,
  formatPercent,
  formatRps,
  FOCUS_RING,
} from "./data";
import { Card, Divider, InlineStat } from "./ui";

interface SummaryStripProps {
  pinnedNodeId: string | null;
  onClearPin: () => void;
}

export default function SummaryStrip({ pinnedNodeId, onClearPin }: SummaryStripProps) {
  const pinned = pinnedNodeId ? NODE_BY_ID.get(pinnedNodeId) ?? null : null;
  const pinnedStatus = pinned ? statusFor(pinned.errorRatePct) : null;

  return (
    <Card className="flex flex-col gap-5 lg:flex-row lg:items-center">
      <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-4">
        <InlineStat label="Services" value={String(TOTALS.serviceCount)} />
        <Divider />
        <InlineStat label="Total throughput" value={`${formatCompact(TOTALS.totalRps)} req/s`} />
        <Divider />
        <InlineStat label="Weighted avg. error rate" value={formatPercent(TOTALS.avgErrorRatePct)} />
        <Divider />
        <InlineStat label="Avg. p99 latency" value={`${TOTALS.avgP99Ms} ms`} />
        <Divider />
        <InlineStat
          label="Degraded"
          value={String(TOTALS.degradedCount)}
          tone={TOTALS.degradedCount > 0 ? "text-amber-700" : "text-zinc-900"}
        />
        <Divider />
        <InlineStat
          label="Critical"
          value={String(TOTALS.criticalCount)}
          tone={TOTALS.criticalCount > 0 ? "text-rose-700" : "text-zinc-900"}
        />
      </div>

      {/* Persistent-pin axis #1: clicking a node in the graph (or a row's Focus button in the
          table) sets this one narrow readout. It never touches the table's own rows or filters —
          that is the second, independently-scoped pin axis, surfaced beside the graph instead. */}
      <div className="shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 lg:w-72">
        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">Focused service</p>
        {pinned && pinnedStatus ? (
          <div className="mt-1.5 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900">{pinned.fullName}</p>
              <p className={`mt-0.5 text-xs font-medium ${STATUS_META[pinnedStatus].text}`}>
                {STATUS_META[pinnedStatus].label} &middot; {formatPercent(pinned.errorRatePct)} &middot;{" "}
                {formatRps(pinned.rps)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClearPin}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 ${FOCUS_RING}`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Clear focused service</span>
            </button>
          </div>
        ) : (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm font-normal text-zinc-600">
            <Crosshair className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Click any node to focus it here
          </p>
        )}
      </div>
    </Card>
  );
}
