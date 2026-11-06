"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { AxisDef, VendorDef } from "./data";
import { formatDelta, formatScore, valueForView, type ViewMode } from "./format";

interface StatStripProps {
  axes: AxisDef[];
  pinnedVendor: VendorDef;
  hoveredVendor: VendorDef | null;
  view: ViewMode;
}

/**
 * The radar chart's always-visible numeric readout: every axis value for the
 * pinned supplier, rendered as plain text so the chart's core values never
 * require a hover to read. These are deliberately the largest numerals on
 * the page — nothing else (the context strip, the composite badge) renders
 * at an equal or larger size.
 */
export default function StatStrip({ axes, pinnedVendor, hoveredVendor, view }: StatStripProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {axes.map((axis) => {
        const value = valueForView(axis.id, pinnedVendor.scores[axis.id], view);
        const hoverValue = hoveredVendor
          ? valueForView(axis.id, hoveredVendor.scores[axis.id], view)
          : null;
        const delta = hoverValue === null ? null : round2(value - hoverValue);
        return (
          <div
            key={axis.id}
            className="min-w-0 rounded-lg border border-zinc-200 bg-white px-3 py-2.5"
          >
            <p className="truncate text-[11px] font-medium uppercase tracking-wide text-zinc-500">
              {axis.shortLabel}
            </p>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-3xl font-semibold tabular-nums text-zinc-900">
                {formatScore(value)}
              </span>
              <span className="text-xs font-normal text-zinc-500">/100</span>
            </div>
            {delta !== null && hoveredVendor ? (
              <p className="mt-1 flex items-center gap-1 text-xs font-medium tabular-nums text-zinc-600">
                {delta >= 0 ? (
                  <TrendingUp className="h-3 w-3 shrink-0" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-3 w-3 shrink-0" aria-hidden="true" />
                )}
                <span className="min-w-0 flex-1 truncate">
                  {formatDelta(delta)} vs {hoveredVendor.shortName}
                </span>
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
