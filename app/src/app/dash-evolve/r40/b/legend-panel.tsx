"use client";

import { useId, useState } from "react";
import { AXIS_WEIGHTS, type AxisDef, type VendorDef, type VendorId } from "./data";
import type { ViewMode } from "./format";
import VendorChips from "./vendor-chips";

type TabId = "legend" | "weights";

interface LegendPanelProps {
  vendors: VendorDef[];
  axes: AxisDef[];
  pinnedId: VendorId;
  hoveredId: VendorId | null;
  view: ViewMode;
  onPin: (id: VendorId) => void;
  onHover: (id: VendorId | null) => void;
}

export default function LegendPanel({
  vendors,
  axes,
  pinnedId,
  hoveredId,
  view,
  onPin,
  onHover,
}: LegendPanelProps) {
  const [tab, setTab] = useState<TabId>("legend");
  const legendPanelId = useId();
  const weightsPanelId = useId();

  const tabs: { id: TabId; label: string; panelId: string }[] = [
    { id: "legend", label: "Suppliers", panelId: legendPanelId },
    { id: "weights", label: "Axis Weights", panelId: weightsPanelId },
  ];

  return (
    <div>
      <div role="tablist" aria-label="Legend panel" className="flex gap-1 rounded-lg bg-zinc-100 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={t.panelId}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${
              tab === t.id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        id={legendPanelId}
        role="tabpanel"
        aria-labelledby="tab-legend"
        hidden={tab !== "legend"}
        className="mt-3"
      >
        <VendorChips
          vendors={vendors}
          pinnedId={pinnedId}
          hoveredId={hoveredId}
          view={view}
          onPin={onPin}
          onHover={onHover}
        />
      </div>

      <div
        id={weightsPanelId}
        role="tabpanel"
        aria-labelledby="tab-weights"
        hidden={tab !== "weights"}
        className="mt-3 space-y-2.5"
      >
        {axes.map((axis) => {
          const weightPct = Math.round(AXIS_WEIGHTS[axis.id] * 100);
          return (
            <div key={axis.id}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="min-w-0 flex-1 truncate text-sm font-normal text-zinc-700">{axis.label}</span>
                <span className="shrink-0 tabular-nums text-sm font-semibold text-zinc-900">
                  {weightPct}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={`${axis.label} weight in composite score`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={weightPct}
                className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100"
              >
                <div className="h-full rounded-full bg-zinc-400" style={{ width: `${weightPct * 4}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
