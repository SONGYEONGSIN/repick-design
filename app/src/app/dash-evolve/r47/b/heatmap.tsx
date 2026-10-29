"use client";

import { useId, useState } from "react";
import { Gauge, Percent } from "lucide-react";
import {
  REGIONS,
  SERVICES,
  matrixValue,
  regionLabel,
  serviceLabel,
  tierIndex,
  worstCell,
  type HeatCell,
  type Metric,
  type PinnedKey,
  type RegionId,
  type ServiceId,
} from "./data";
import { formatMs, formatPercent } from "./format";
import { Card, FOCUS_RING, SegmentedControl } from "./ui";

const TIER_CLASS = ["bg-zinc-800/70", "bg-rose-950/70", "bg-rose-800/70", "bg-rose-600/70", "bg-rose-500/70"] as const;
const TIER_LABEL = ["Nominal", "Watch", "Elevated", "High", "Critical"] as const;

function valueText(metric: Metric, value: number): string {
  return metric === "errorRate" ? formatPercent(value, 2) : formatMs(value);
}

function metricNoun(metric: Metric): string {
  return metric === "errorRate" ? "error rate" : "p95 latency";
}

/**
 * The dominant visualization: a services × regions error-surface matrix. This single element is
 * BOTH the heatmap and the chart catalog's required "row/column-labeled data table" fallback — it
 * is a real `<table>` throughout, every cell's exact value is rendered as visible text (never
 * color-alone), and only the tier (background shade) varies with intensity.
 *
 * Two independent, locally-scoped mechanisms live in this file and never leave it:
 *  - `activeCell` — hover/focus crosshair. Read only by the caption line below the matrix.
 *  - `pinnedLocal` — a local echo of the last clicked cell, used only to draw this file's own
 *    "pinned" ring. `onPin` is a one-way notification outward (to page.tsx, which forwards the
 *    value — never the setter — to the Pinned Cell card only). Nothing is ever read back in.
 */
export function ServiceRegionHeatmap({ onPin }: { onPin: (key: PinnedKey) => void }) {
  const [metric, setMetric] = useState<Metric>("errorRate");
  const [activeCell, setActiveCell] = useState<{ serviceId: ServiceId; regionId: RegionId } | null>(null);
  const [pinnedLocal, setPinnedLocal] = useState<HeatCell>(() => worstCell("errorRate"));
  const captionId = useId();

  const worst = worstCell(metric);

  function handlePin(serviceId: ServiceId, regionId: RegionId) {
    const value = matrixValue(metric, serviceId, regionId);
    const cell: HeatCell = { serviceId, regionId, value };
    setPinnedLocal(cell);
    onPin({ serviceId, regionId });
  }

  const activeReadout = activeCell
    ? `${serviceLabel(activeCell.serviceId)} × ${regionLabel(activeCell.regionId)} — ${valueText(metric, matrixValue(metric, activeCell.serviceId, activeCell.regionId))}`
    : "Hover or tab onto a cell to inspect it.";

  return (
    <Card as="section" id="heatmap-section" ariaLabelledBy="heatmap-title" className="p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="heatmap-title" className="text-sm font-semibold text-zinc-50">
            Error Surface
          </h2>
          <p className="mt-0.5 font-normal text-xs text-zinc-400">7 services × 5 regions, current rolling window</p>
        </div>
        <SegmentedControl
          label="Heatmap metric"
          value={metric}
          onChange={setMetric}
          options={[
            { value: "errorRate", label: "Error rate" },
            { value: "latencyP95", label: "p95 latency" },
          ]}
        />
      </div>

      {/* Always-visible headline — never hover-gated, recomputes with the metric toggle. */}
      <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="font-normal text-sm text-zinc-400">Worst cell this window:</span>
        <span className="font-medium text-sm text-zinc-50">
          {serviceLabel(worst.serviceId)} × {regionLabel(worst.regionId)}
        </span>
        <span className="[font-family:var(--font-display-wide)] text-2xl tabular-nums text-rose-300 sm:text-3xl">
          {valueText(metric, worst.value)}
        </span>
        <span className="font-normal text-xs text-zinc-400">{metricNoun(metric)}</span>
      </p>

      {/* Desktop / tablet: the matrix table itself (also the a11y data-table fallback). */}
      <div className="mt-4 hidden sm:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">
            Service by region {metricNoun(metric)} heatmap. Each cell shows the exact value; background shade encodes its
            severity tier from Nominal to Critical.
          </caption>
          <colgroup>
            <col style={{ width: "22%" }} />
            {REGIONS.map((r) => (
              <col key={r.id} style={{ width: "15.6%" }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="px-2 py-2 text-left font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">
                Service
              </th>
              {REGIONS.map((r) => (
                <th
                  key={r.id}
                  scope="col"
                  title={r.full}
                  className={`px-1 py-2 text-center font-semibold text-[11px] uppercase tracking-[0.06em] motion-safe:transition-colors ${
                    activeCell?.regionId === r.id ? "text-zinc-50" : "text-zinc-400"
                  }`}
                >
                  {r.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SERVICES.map((s) => (
              <tr key={s.id}>
                <th
                  scope="row"
                  className={`px-2 py-1.5 text-left font-medium text-xs motion-safe:transition-colors ${
                    activeCell?.serviceId === s.id ? "text-zinc-50" : "text-zinc-300"
                  }`}
                >
                  {s.label}
                </th>
                {REGIONS.map((r) => {
                  const value = matrixValue(metric, s.id, r.id);
                  const tier = tierIndex(value, metric);
                  const isPinned = pinnedLocal.serviceId === s.id && pinnedLocal.regionId === r.id;
                  return (
                    <td key={r.id} className="p-1">
                      <button
                        type="button"
                        onClick={() => handlePin(s.id, r.id)}
                        onFocus={() => setActiveCell({ serviceId: s.id, regionId: r.id })}
                        onBlur={() => setActiveCell(null)}
                        onMouseEnter={() => setActiveCell({ serviceId: s.id, regionId: r.id })}
                        onMouseLeave={() => setActiveCell(null)}
                        aria-describedby={captionId}
                        aria-label={`${s.label}, ${r.full}: ${valueText(metric, value)} ${metricNoun(metric)}, tier ${TIER_LABEL[tier]}. Click to pin.`}
                        className={`flex h-9 w-full items-center justify-center rounded-md font-medium text-xs tabular-nums text-zinc-50 motion-safe:transition-transform motion-safe:duration-150 hover:motion-safe:scale-105 ${FOCUS_RING} ${TIER_CLASS[tier]} ${
                          isPinned ? "ring-2 ring-inset ring-rose-300" : ""
                        }`}
                      >
                        {valueText(metric, value)}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile fallback: stacked cards, one per service, each region as its own tappable chip. */}
      <ul className="mt-4 space-y-3 sm:hidden">
        {SERVICES.map((s) => (
          <li key={s.id} className="rounded-lg border border-white/10 p-2.5">
            <p className="font-medium text-xs text-zinc-50">{s.label}</p>
            <div className="mt-2 grid grid-cols-5 gap-1.5">
              {REGIONS.map((r) => {
                const value = matrixValue(metric, s.id, r.id);
                const tier = tierIndex(value, metric);
                const isPinned = pinnedLocal.serviceId === s.id && pinnedLocal.regionId === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handlePin(s.id, r.id)}
                    aria-label={`${s.label}, ${r.full}: ${valueText(metric, value)} ${metricNoun(metric)}, tier ${TIER_LABEL[tier]}. Tap to pin.`}
                    className={`flex h-10 flex-col items-center justify-center rounded-md font-medium text-[11px] tabular-nums text-zinc-50 ${FOCUS_RING} ${TIER_CLASS[tier]} ${
                      isPinned ? "ring-2 ring-inset ring-rose-300" : ""
                    }`}
                  >
                    <span>{valueText(metric, value)}</span>
                    <span className="font-normal text-[9px] text-zinc-50">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      <p id={captionId} className="mt-3 font-normal text-xs text-zinc-400" aria-live="polite">
        {activeReadout}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-white/10 pt-3">
        <span className="flex items-center gap-1 font-normal text-[11px] text-zinc-400">
          {metric === "errorRate" ? <Percent className="h-3 w-3" aria-hidden="true" /> : <Gauge className="h-3 w-3" aria-hidden="true" />}
          {metricNoun(metric)} by tier:
        </span>
        {TIER_LABEL.map((label, i) => (
          <span key={label} className="flex items-center gap-1 font-normal text-[11px] text-zinc-400">
            <span className={`h-2.5 w-2.5 rounded-sm ${TIER_CLASS[i]}`} aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>
    </Card>
  );
}
