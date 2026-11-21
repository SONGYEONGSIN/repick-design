"use client";

import { useCallback, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  BOX_DATA,
  METRIC_DIRECTION,
  METRIC_LABEL,
  METRIC_UNIT,
  VENDORS,
  formatMetricValue,
  metricDomain,
  round2,
  type FiveNumberSummary,
  type MetricKey,
  type SortKey,
  type Vendor,
} from "./data";
import { SegmentedControl } from "./ui";

const METRICS: readonly MetricKey[] = ["defect", "delivery", "inspection"];
const SORT_KEYS: readonly SortKey[] = ["median", "name"];

/* SVG geometry — a shared coordinate system per column, scaled by a
   domain computed once per metric (see metricDomain in data.ts). Every
   coordinate below is produced through round2() so attribute values never
   exceed 2 decimal places. */
const PLOT_WIDTH = 48;
const PLOT_HEIGHT = 150;
const PLOT_PAD = 9;
const CENTER = 24;
const BOX_HALF = 12;
const CAP_HALF = 8;
const OUTLIER_R = 2.5;
const TOOLTIP_HALF_WIDTH = 150;

function yFor(value: number, domain: { min: number; max: number }): number {
  const span = domain.max - domain.min || 1;
  const inner = PLOT_HEIGHT - PLOT_PAD * 2;
  return round2(PLOT_PAD + ((domain.max - value) / span) * inner);
}

function decimals(metric: MetricKey): number {
  return metric === "inspection" ? 1 : 2;
}

interface TooltipCoords {
  top: number;
  left: number;
}

export function BoxPlotStrip() {
  const [metric, setMetric] = useState<MetricKey>("defect");
  const [sortKey, setSortKey] = useState<SortKey>("median");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [coords, setCoords] = useState<TooltipCoords | null>(null);
  const columnRefs = useRef(new Map<string, HTMLButtonElement>());

  const domain = metricDomain(metric);
  const data = BOX_DATA[metric];

  const rows = [...VENDORS].sort((a, b) => {
    if (sortKey === "name") return a.name.localeCompare(b.name);
    return data[a.id].median - data[b.id].median;
  });

  const fleetValues = VENDORS.map((v) => data[v.id].median).sort((a, b) => a - b);
  const mid = Math.floor(fleetValues.length / 2);
  const fleetMedian =
    fleetValues.length % 2 === 0
      ? round2((fleetValues[mid - 1] + fleetValues[mid]) / 2)
      : fleetValues[mid];
  const outlierTotal = VENDORS.reduce((sum, v) => sum + data[v.id].outliers.length, 0);

  const registerColumnRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) columnRefs.current.set(id, el);
    else columnRefs.current.delete(id);
  }, []);

  function showTooltip(id: string) {
    const el = columnRefs.current.get(id);
    if (el && typeof window !== "undefined") {
      const rect = el.getBoundingClientRect();
      const rawLeft = rect.left + rect.width / 2;
      const clampedLeft = Math.min(
        Math.max(rawLeft, TOOLTIP_HALF_WIDTH + 8),
        window.innerWidth - TOOLTIP_HALF_WIDTH - 8,
      );
      setCoords({ top: rect.bottom + 8, left: clampedLeft });
    }
    setActiveId(id);
  }

  function hideTooltip() {
    setActiveId(null);
    setCoords(null);
  }

  const activeVendor = activeId ? VENDORS.find((v) => v.id === activeId) ?? null : null;

  return (
    <section aria-labelledby="distribution-heading" className="min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-4">
        <div className="min-w-0">
          <h2
            id="distribution-heading"
            className="text-sm font-semibold uppercase tracking-wide text-zinc-50"
          >
            Quality distribution by vendor
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Fleet median {formatMetricValue(metric, fleetMedian)} ({METRIC_DIRECTION[metric]}) ·{" "}
            {outlierTotal} outlier{outlierTotal === 1 ? "" : "s"} flagged across {VENDORS.length}{" "}
            vendors
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl
            options={METRICS}
            value={metric}
            onChange={(next) => {
              setMetric(next);
              hideTooltip();
            }}
            getLabel={(m) => METRIC_LABEL[m]}
            ariaLabel="Quality metric"
          />
          <SegmentedControl
            options={SORT_KEYS}
            value={sortKey}
            onChange={setSortKey}
            getLabel={(k) => (k === "median" ? "Sort: median" : "Sort: name")}
            ariaLabel="Box plot sort order"
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-4">
        <p className="mb-3 text-[11px] uppercase tracking-wide text-zinc-400">
          Scale {domain.min.toFixed(decimals(metric))}–{domain.max.toFixed(decimals(metric))}{" "}
          {METRIC_UNIT[metric]} · min / Q1 / median / Q3 / max, outlier count always shown
        </p>
        <div className="flex gap-3 overflow-x-auto p-2">
          {rows.map((vendor) => (
            <VendorBox
              key={vendor.id}
              vendor={vendor}
              metric={metric}
              domain={domain}
              summary={data[vendor.id]}
              isActive={activeId === vendor.id}
              onShow={showTooltip}
              onHide={hideTooltip}
              registerRef={registerColumnRef}
            />
          ))}
        </div>
      </div>

      {activeVendor && coords && (
        <SummaryTooltip
          vendor={activeVendor}
          metric={metric}
          summary={data[activeVendor.id]}
          coords={coords}
        />
      )}
    </section>
  );
}

function VendorBox({
  vendor,
  metric,
  domain,
  summary,
  isActive,
  onShow,
  onHide,
  registerRef,
}: {
  vendor: Vendor;
  metric: MetricKey;
  domain: { min: number; max: number };
  summary: FiveNumberSummary;
  isActive: boolean;
  onShow: (id: string) => void;
  onHide: () => void;
  registerRef: (id: string, el: HTMLButtonElement | null) => void;
}) {
  const topY = yFor(summary.q3, domain);
  const bottomY = yFor(summary.q1, domain);
  const medianY = yFor(summary.median, domain);
  const maxY = yFor(summary.max, domain);
  const minY = yFor(summary.min, domain);
  const outlierYs = summary.outliers.map((o) => yFor(o, domain));
  const hasOutliers = summary.outliers.length > 0;
  const dp = decimals(metric);

  return (
    <button
      ref={(el) => registerRef(vendor.id, el)}
      type="button"
      onMouseEnter={() => onShow(vendor.id)}
      onMouseLeave={onHide}
      onFocus={() => onShow(vendor.id)}
      onBlur={onHide}
      className={
        "flex w-16 shrink-0 flex-col items-center gap-1 rounded-md px-1 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 " +
        (isActive ? "bg-white/5" : "hover:bg-white/5")
      }
    >
      <span className="text-base font-semibold tabular-nums text-zinc-50">
        {summary.median.toFixed(dp)}
      </span>
      <svg
        viewBox={`0 0 ${PLOT_WIDTH} ${PLOT_HEIGHT}`}
        width={PLOT_WIDTH}
        height={PLOT_HEIGHT}
        aria-hidden="true"
        className="overflow-visible text-zinc-500"
      >
        <line x1={CENTER} y1={maxY} x2={CENTER} y2={topY} stroke="currentColor" strokeWidth={1.25} />
        <line x1={CENTER} y1={bottomY} x2={CENTER} y2={minY} stroke="currentColor" strokeWidth={1.25} />
        <line
          x1={round2(CENTER - CAP_HALF)}
          y1={maxY}
          x2={round2(CENTER + CAP_HALF)}
          y2={maxY}
          stroke="currentColor"
          strokeWidth={1.25}
        />
        <line
          x1={round2(CENTER - CAP_HALF)}
          y1={minY}
          x2={round2(CENTER + CAP_HALF)}
          y2={minY}
          stroke="currentColor"
          strokeWidth={1.25}
        />
        <rect
          x={round2(CENTER - BOX_HALF)}
          y={topY}
          width={round2(BOX_HALF * 2)}
          height={round2(bottomY - topY)}
          rx={2}
          className="fill-indigo-500/25 stroke-indigo-400"
          strokeWidth={1.5}
        />
        <line
          x1={round2(CENTER - BOX_HALF)}
          y1={medianY}
          x2={round2(CENTER + BOX_HALF)}
          y2={medianY}
          className="stroke-zinc-50"
          strokeWidth={2}
        />
        {outlierYs.map((y, i) => (
          <circle
            key={`${vendor.id}-outlier-${i}`}
            cx={CENTER}
            cy={y}
            r={OUTLIER_R}
            className="fill-zinc-950 stroke-indigo-300"
            strokeWidth={1.25}
          />
        ))}
      </svg>
      <span
        className={
          "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums " +
          (hasOutliers ? "bg-indigo-500/15 text-indigo-300" : "text-zinc-400")
        }
      >
        {hasOutliers && <AlertTriangle className="size-3" aria-hidden="true" />}
        {summary.outliers.length}
      </span>
      <span className="max-w-full truncate text-[11px] font-medium uppercase tracking-wide text-zinc-400">
        {vendor.shortCode}
      </span>
      {/* Visually hidden, appended AFTER the visible text above so the
          accessible name (content-derived, no aria-label) starts with
          exactly that visible text verbatim, then adds context —
          satisfies axe's label-content-name-mismatch, which checks that
          visible text is a literal, in-order substring of the name. */}
      <span className="sr-only">
        {` — ${vendor.name}, ${METRIC_LABEL[metric]} median ${formatMetricValue(metric, summary.median)}, ${summary.outliers.length} outlier${summary.outliers.length === 1 ? "" : "s"}. Press to open the full five-number summary.`}
      </span>
    </button>
  );
}

function SummaryTooltip({
  vendor,
  metric,
  summary,
  coords,
}: {
  vendor: Vendor;
  metric: MetricKey;
  summary: FiveNumberSummary;
  coords: TooltipCoords;
}) {
  const dp = decimals(metric);
  type SummaryNumberKey = "min" | "q1" | "median" | "q3" | "max";
  const fields: readonly { key: SummaryNumberKey; label: string }[] = [
    { key: "min", label: "Min" },
    { key: "q1", label: "Q1" },
    { key: "median", label: "Median" },
    { key: "q3", label: "Q3" },
    { key: "max", label: "Max" },
  ];

  return (
    <div
      role="tooltip"
      style={{ position: "fixed", top: coords.top, left: coords.left }}
      className="z-50 w-[300px] -translate-x-1/2 rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-2xl shadow-black/50"
    >
      <p className="truncate text-sm font-semibold text-zinc-50">{vendor.name}</p>
      <p className="mt-0.5 text-xs text-zinc-400">
        {METRIC_LABEL[metric]} · {METRIC_DIRECTION[metric]}
      </p>
      <dl className="mt-2 grid grid-cols-5 gap-1">
        {fields.map(({ key, label }) => (
          <div key={key} className="text-center">
            <dt className="text-[10px] uppercase tracking-wide text-zinc-400">{label}</dt>
            <dd className="mt-0.5 font-mono text-[11px] tabular-nums text-zinc-50">
              {summary[key].toFixed(dp)}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs text-zinc-400">
        {summary.outliers.length === 0
          ? "No outliers detected."
          : `${summary.outliers.length} outlier${summary.outliers.length === 1 ? "" : "s"}: ${summary.outliers
              .map((o) => o.toFixed(dp))
              .join(", ")} ${METRIC_UNIT[metric]}`}
      </p>
    </div>
  );
}
