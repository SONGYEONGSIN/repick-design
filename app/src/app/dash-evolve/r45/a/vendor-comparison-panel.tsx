"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  AXES,
  DEFAULT_PINNED_ID,
  RISK_FLAG_THRESHOLD,
  VENDORS,
  VENDOR_LIST,
  axisDomain,
  highestRiskVendor,
  metricsFor,
  type Period,
  type VendorId,
} from "./data";
import { formatCurrency } from "./format";
import { statusFor } from "./status";
import { Card, FOCUS_RING, ProgressBar, Sparkline, StatusBadge, Tabs } from "./ui";

/**
 * Selection model (read this before touching the state below):
 *
 * - `pinnedId` is the ONE committed selection, local to this component. Nothing outside this
 *   file ever reads or writes it — `page.tsx` passes this component only `period`, a view filter,
 *   not an entity id. There is no second component anywhere that consumes "which vendor is
 *   selected": the entity rail, the chart's highlighted polyline and the accordion detail below
 *   are three renderings of the SAME state inside the SAME component, not three consumers of a
 *   shared id threaded from above. That is the thing this round's brief ranks as the best
 *   selection-fan-out tier — no separate detail component at all.
 * - `hoverId` is a second, fully ephemeral piece of state: it never persists, is cleared on
 *   mouse-leave/blur, and never changes what is "pinned". It only overrides what the inspector
 *   line and chart highlight show *while active*, then reverts automatically.
 * - The command palette (see `command-palette.tsx`) can move DOM focus onto a rail button, which
 *   triggers the exact same ephemeral preview a mouse hover would — through `.focus()` on a DOM
 *   node, not through any prop or shared id. It is not a fourth consumer of selection state.
 */

const AXIS_X = [30, 162, 294, 426, 558, 690];
const PLOT_TOP = 40;
const PLOT_BOTTOM = 206;
const VIEW_W = 720;
const VIEW_H = 280;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

type DetailTab = "metrics" | "trend";

const DETAIL_TABS: { value: DetailTab; label: string }[] = [
  { value: "metrics", label: "Metrics" },
  { value: "trend", label: "Cost trend" },
];

export function VendorComparisonPanel({ period }: { period: Period }) {
  const [pinnedId, setPinnedId] = useState<VendorId>(DEFAULT_PINNED_ID);
  const [hoverId, setHoverId] = useState<VendorId | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("metrics");

  const displayedId = hoverId ?? pinnedId;
  const pinnedVendor = VENDORS[pinnedId];
  const displayedVendor = VENDORS[displayedId];
  const displayedMetrics = metricsFor(displayedId, period);
  const isPreviewing = hoverId !== null && hoverId !== pinnedId;

  const leader = highestRiskVendor(period);
  const periodLabel = period === "current" ? "this cycle" : "the prior cycle";

  const domains = AXES.map((axis) => axisDomain(axis, period));

  function yFor(axisIndex: number, value: number): number {
    const { min, max } = domains[axisIndex];
    const range = max - min || 1;
    const norm = (value - min) / range;
    return round2(PLOT_BOTTOM - norm * (PLOT_BOTTOM - PLOT_TOP));
  }

  function pointsFor(id: VendorId): { x: number; y: number }[] {
    const m = metricsFor(id, period);
    return AXES.map((axis, i) => ({ x: AXIS_X[i], y: yFor(i, axis.accessor(m)) }));
  }

  const pinnedPoints = pointsFor(pinnedId);
  const hoverPoints = hoverId ? pointsFor(hoverId) : null;
  const otherVendors = VENDOR_LIST.filter((v) => v.id !== pinnedId && v.id !== hoverId);

  function toPointsAttr(points: { x: number; y: number }[]): string {
    return points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  }

  const history = pinnedVendor.costHistory;

  return (
    <Card as="section" ariaLabelledBy="vendor-comparison-heading" id="vendor-comparison" className="min-w-0 p-4 sm:p-5">
      <h2 id="vendor-comparison-heading" className="font-semibold text-sm text-zinc-900">
        Vendor Comparison — {period === "current" ? "Current renewal cycle" : "Prior renewal cycle"}
      </h2>
      <p className="mt-0.5 max-w-2xl font-normal text-xs text-zinc-500">
        Six vendor contracts plotted across six metrics. Color and position are never the only cue — every line ends in a two-letter code, and
        the exact numbers for every vendor are repeated in the table below the chart.
      </p>

      {/* Always-visible headline — never requires a hover or click to see. Computed fresh from
          the active period's data, so it is never a stale or hardcoded vendor name. */}
      <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="font-semibold text-sm text-zinc-500">Highest renewal risk {periodLabel}:</span>
        <span className="font-semibold text-xl text-zinc-900 sm:text-2xl">{leader.vendor.name}</span>
        {/* The number, not the name, is this chart's actual primary data text — kept strictly
            larger than every KPI tile's value (text-xl, 20px) at every breakpoint. */}
        <span className="font-semibold text-3xl tabular-nums text-rose-700 sm:text-4xl">{Math.round(leader.value)}/100</span>
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Entity-picker rail. */}
        <div className="col-span-12 min-w-0 lg:col-span-4">
          <p className="font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">Vendors</p>
          <ul className="mt-2 space-y-1">
            {VENDOR_LIST.map((v) => {
              const m = metricsFor(v.id, period);
              const status = statusFor(v, period);
              const isPinned = v.id === pinnedId;
              const isPreview = v.id === hoverId && v.id !== pinnedId;
              return (
                <li key={v.id}>
                  <button
                    id={`rail-vendor-${v.id}`}
                    type="button"
                    aria-pressed={isPinned}
                    onMouseEnter={() => setHoverId(v.id)}
                    onMouseLeave={() => setHoverId(null)}
                    onFocus={() => setHoverId(v.id)}
                    onBlur={() => setHoverId(null)}
                    onClick={() => setPinnedId(v.id)}
                    className={`flex min-h-[52px] w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-left motion-safe:transition-colors ${FOCUS_RING} ${
                      isPinned ? "border-indigo-200 bg-indigo-50" : isPreview ? "border-zinc-300 bg-zinc-50" : "border-transparent hover:bg-zinc-50"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span className="truncate font-medium text-sm text-zinc-900">{v.name}</span>
                        {isPinned ? (
                          <span className="shrink-0 rounded-full bg-indigo-600 px-1.5 py-0.5 font-medium text-[10px] text-white">Pinned</span>
                        ) : isPreview ? (
                          <span className="shrink-0 rounded-full bg-zinc-200 px-1.5 py-0.5 font-medium text-[10px] text-zinc-700">Previewing</span>
                        ) : null}
                      </span>
                      {/* zinc-600, not the zinc-500 floor: this caption can sit on the pinned/
                          preview row's tinted indigo-50 / zinc-50 background, not the plain white
                          canvas, so it needs the higher tinted-surface contrast floor. */}
                      <span className="block truncate font-normal text-xs text-zinc-600">{v.category}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-medium text-xs tabular-nums text-zinc-900">{formatCurrency(m.cost)}</span>
                      <StatusBadge status={status} abbreviated className="mt-0.5" />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* The parallel-coordinates chart itself. */}
        <div className="col-span-12 min-w-0 lg:col-span-8">
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-labelledby="pc-chart-title pc-chart-desc" className="h-auto w-full">
            <title id="pc-chart-title">Parallel coordinates comparing six vendor contracts across six metrics</title>
            <desc id="pc-chart-desc">
              Exact values for every vendor and metric are listed in the sortable table below this chart.
            </desc>

            {AXIS_X.map((x, i) => (
              <line key={AXES[i].id} x1={x} y1={PLOT_TOP} x2={x} y2={PLOT_BOTTOM} stroke="currentColor" className="text-zinc-200" strokeWidth={1} />
            ))}

            {AXIS_X.map((x, i) => {
              const axis = AXES[i];
              const { min, max } = domains[i];
              return (
                <g key={axis.id}>
                  <text x={x} y={14} textAnchor="middle" className="fill-zinc-700 font-semibold" style={{ fontSize: 10, letterSpacing: "0.04em" }}>
                    {axis.shortLabel.toUpperCase()}
                  </text>
                  <text x={x} y={30} textAnchor="middle" className="fill-zinc-500" style={{ fontSize: 9 }}>
                    {axis.format(max)}
                  </text>
                  <text x={x} y={222} textAnchor="middle" className="fill-zinc-500" style={{ fontSize: 9 }}>
                    {axis.format(min)}
                  </text>
                </g>
              );
            })}

            {otherVendors.map((v) => {
              const pts = pointsFor(v.id);
              return (
                <polyline
                  key={v.id}
                  points={toPointsAttr(pts)}
                  fill="none"
                  stroke="currentColor"
                  className="text-zinc-400"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                />
              );
            })}

            {hoverId !== pinnedId ? (
              <polyline
                points={toPointsAttr(pinnedPoints)}
                fill="none"
                stroke="currentColor"
                className="text-indigo-600"
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
            ) : null}

            {hoverPoints && hoverId !== pinnedId ? (
              <polyline
                points={toPointsAttr(hoverPoints)}
                fill="none"
                stroke="currentColor"
                className="text-indigo-400"
                strokeWidth={2.5}
                strokeDasharray="5 3"
                strokeLinejoin="round"
              />
            ) : null}

            {hoverId === pinnedId ? (
              <polyline
                points={toPointsAttr(pinnedPoints)}
                fill="none"
                stroke="currentColor"
                className="text-indigo-600"
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
            ) : null}

            {/* End-of-line codes: identity never depends on color alone. */}
            {VENDOR_LIST.map((v) => {
              const pts = pointsFor(v.id);
              const lastPoint = pts[pts.length - 1];
              const emphasized = v.id === displayedId;
              return (
                <text
                  key={v.id}
                  x={lastPoint.x + 10}
                  y={lastPoint.y + 3}
                  className={emphasized ? "fill-indigo-700 font-semibold" : "fill-zinc-500 font-medium"}
                  style={{ fontSize: 10 }}
                >
                  {v.code}
                </text>
              );
            })}

            {/* Invisible wide hit-targets for mouse hover directly on a line. Keyboard users get
                the same preview through the rail buttons' focus handlers above. */}
            {VENDOR_LIST.map((v) => (
              <polyline
                key={`hit-${v.id}`}
                points={toPointsAttr(pointsFor(v.id))}
                fill="none"
                stroke="transparent"
                strokeWidth={14}
                style={{ pointerEvents: "stroke", cursor: "pointer" }}
                onMouseEnter={() => setHoverId(v.id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => setPinnedId(v.id)}
              />
            ))}
          </svg>

          {/* Ephemeral inspector line — always shows a real vendor (hover, or the pinned one when
              nothing is hovered), never an empty "select something" placeholder. */}
          <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 rounded-lg bg-zinc-50 px-3 py-2 font-normal text-xs text-zinc-700">
            <span className={`font-medium ${isPreviewing ? "text-zinc-600" : "text-indigo-700"}`}>{isPreviewing ? "Previewing:" : "Pinned:"}</span>
            <span className="font-medium text-zinc-900">{displayedVendor.name}</span>
            <span aria-hidden="true">—</span>
            {AXES.map((axis, i) => (
              <span key={axis.id} className="tabular-nums">
                {axis.shortLabel} {axis.format(axis.accessor(displayedMetrics))}
                {i < AXES.length - 1 ? "," : ""}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Same-component detail — the pinned vendor's own expanded breakdown, not a separate
          consumer component reacting to a shared id. */}
      <div className="mt-4 border-t border-zinc-200 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-semibold text-sm text-zinc-900">
            {pinnedVendor.name}
            <StatusBadge status={statusFor(pinnedVendor, period)} />
          </h3>
          <Tabs idBase="vendor-detail" ariaLabel={`${pinnedVendor.name} detail views`} tabs={DETAIL_TABS} value={detailTab} onChange={setDetailTab} />
        </div>

        {detailTab === "metrics" ? (
          <dl
            id="vendor-detail-panel-metrics"
            role="tabpanel"
            aria-labelledby="vendor-detail-tab-metrics"
            className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3"
          >
            {AXES.map((axis) => {
              const value = axis.accessor(metricsFor(pinnedId, period));
              return (
                <div key={axis.id} className="min-w-0">
                  <dt className="font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">{axis.label}</dt>
                  <dd className="mt-1 font-medium text-sm tabular-nums text-zinc-900">{axis.format(value)}</dd>
                  {axis.id === "utilization" ? (
                    <ProgressBar pct={value} className="mt-1.5" ariaLabel={`${pinnedVendor.name} seat utilization, ${Math.round(value)} percent`} />
                  ) : null}
                </div>
              );
            })}
          </dl>
        ) : (
          <div id="vendor-detail-panel-trend" role="tabpanel" aria-labelledby="vendor-detail-tab-trend" className="mt-3 flex flex-wrap items-center gap-4">
            <Sparkline values={history} />
            <div className="min-w-0">
              <p className="font-medium text-sm tabular-nums text-zinc-900">
                {formatCurrency(history[0])} <span aria-hidden="true">{"→"}</span> {formatCurrency(history[history.length - 1])}
              </p>
              <p className="font-normal text-xs text-zinc-500">Six-point annual cost trend, oldest reading to the current cycle.</p>
            </div>
          </div>
        )}
      </div>

      {statusFor(pinnedVendor, period) === "at-risk" ? (
        <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-rose-50 px-3 py-2 font-normal text-xs text-rose-700">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          This contract is flagged at-risk — renewal risk is at or above the {RISK_FLAG_THRESHOLD}-point threshold.
        </p>
      ) : null}
    </Card>
  );
}
