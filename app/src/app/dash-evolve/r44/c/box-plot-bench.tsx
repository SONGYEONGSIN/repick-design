"use client";

import { useMemo } from "react";
import { LATENCY_SUMMARY, SERVICES, deriveServiceStatus, type Period } from "./data";
import { FOCUS_RING } from "./ui";

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

const VIEW_W = 1000;
const VIEW_H = 240;
const PLOT_TOP = 20;
const PLOT_BOTTOM = 212;
const COL_WIDTH = VIEW_W / SERVICES.length;

type Layout = {
  serviceId: string;
  cx: number;
  boxLeft: number;
  boxRight: number;
  boxTop: number;
  boxBottom: number;
  medianY: number;
  whiskerTopY: number;
  whiskerBottomY: number;
  capLeft: number;
  capRight: number;
};

const STATUS_DOT: Record<string, string> = {
  operational: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-rose-600",
};

/** Box geometry for every service, scaled to a shared domain so the six groups
 *  stay visually comparable. Pure function of `period` via the precomputed
 *  `LATENCY_SUMMARY` table — no coordinate here is hand-typed, and every one is
 *  rounded to 2 decimals as a plain linear map (no curves). */
function layoutBoxes(period: Period): Layout[] {
  const summaries = SERVICES.map((s) => LATENCY_SUMMARY[s.id][period]);
  const domainMin = Math.min(...summaries.map((s) => s.min));
  const domainMax = Math.max(...summaries.map((s) => s.max));
  const range = domainMax - domainMin || 1;
  const pad = range * 0.08;
  const plotMin = domainMin - pad;
  const plotMax = domainMax + pad;

  function yFor(value: number): number {
    const frac = (value - plotMin) / (plotMax - plotMin);
    return r2(PLOT_BOTTOM - frac * (PLOT_BOTTOM - PLOT_TOP));
  }

  return SERVICES.map((service, i) => {
    const summary = LATENCY_SUMMARY[service.id][period];
    const cx = r2((i + 0.5) * COL_WIDTH);
    const halfW = r2(COL_WIDTH * 0.22);
    const capHalf = r2(halfW * 0.55);
    return {
      serviceId: service.id,
      cx,
      boxLeft: r2(cx - halfW),
      boxRight: r2(cx + halfW),
      boxTop: yFor(summary.q3),
      boxBottom: yFor(summary.q1),
      medianY: yFor(summary.median),
      whiskerTopY: yFor(summary.max),
      whiskerBottomY: yFor(summary.min),
      capLeft: r2(cx - capHalf),
      capRight: r2(cx + capHalf),
    };
  });
}

export default function BoxPlotBench({
  period,
  pinnedServiceId,
  hoveredServiceId,
  onPin,
  onHover,
}: {
  period: Period;
  pinnedServiceId: string;
  hoveredServiceId: string | null;
  onPin: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const layouts = useMemo(() => layoutBoxes(period), [period]);
  const hoveredLayout = layouts.find((l) => l.serviceId === hoveredServiceId) ?? null;
  const hoveredService = SERVICES.find((s) => s.id === hoveredServiceId) ?? null;
  const hoveredSummary = hoveredServiceId ? LATENCY_SUMMARY[hoveredServiceId][period] : null;

  return (
    <div>
      {/* Crosshair readout: lives in normal document flow (never absolutely
          positioned over the chart), so it can never push the page wider than
          its own container at any viewport. The SVG crosshair line below is the
          same idea rendered inside the bounded viewBox. */}
      <p className="font-normal text-xs text-zinc-500">
        {hoveredService && hoveredSummary ? (
          <>
            <span className="font-medium text-zinc-900">{hoveredService.name}</span> &mdash; median{" "}
            <span className="tabular-nums text-zinc-700">{hoveredSummary.median}ms</span> (Q1{" "}
            <span className="tabular-nums text-zinc-700">{hoveredSummary.q1}</span> &middot; Q3{" "}
            <span className="tabular-nums text-zinc-700">{hoveredSummary.q3}</span>) &middot; range{" "}
            <span className="tabular-nums text-zinc-700">
              {hoveredSummary.min}&ndash;{hoveredSummary.max}ms
            </span>
          </>
        ) : (
          "Response-time distribution per service. Hover or focus a bar for its exact range — every value below is already shown as text, never hover-only."
        )}
      </p>

      <div className="relative mt-3">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" className="pointer-events-none h-56 w-full sm:h-64">
          {layouts.map((l) => {
            const isPinned = l.serviceId === pinnedServiceId;
            const isHovered = l.serviceId === hoveredServiceId;
            const boxTone = isPinned
              ? "fill-violet-200 stroke-violet-700"
              : isHovered
                ? "fill-violet-100 stroke-violet-600"
                : "fill-violet-50 stroke-violet-400";
            return (
              <g key={l.serviceId}>
                <line x1={l.cx} x2={l.cx} y1={l.whiskerTopY} y2={l.boxTop} className="stroke-zinc-400" strokeWidth={1.5} />
                <line x1={l.cx} x2={l.cx} y1={l.boxBottom} y2={l.whiskerBottomY} className="stroke-zinc-400" strokeWidth={1.5} />
                <line x1={l.capLeft} x2={l.capRight} y1={l.whiskerTopY} y2={l.whiskerTopY} className="stroke-zinc-400" strokeWidth={1.5} />
                <line x1={l.capLeft} x2={l.capRight} y1={l.whiskerBottomY} y2={l.whiskerBottomY} className="stroke-zinc-400" strokeWidth={1.5} />
                <rect
                  x={l.boxLeft}
                  y={l.boxTop}
                  width={r2(l.boxRight - l.boxLeft)}
                  height={r2(l.boxBottom - l.boxTop)}
                  rx={3}
                  strokeWidth={isPinned ? 2 : 1.5}
                  className={boxTone}
                />
                <line x1={l.boxLeft} x2={l.boxRight} y1={l.medianY} y2={l.medianY} className="stroke-violet-700" strokeWidth={2} />
              </g>
            );
          })}
          {hoveredLayout ? (
            <line
              x1={hoveredLayout.cx}
              x2={hoveredLayout.cx}
              y1={4}
              y2={236}
              className="stroke-violet-400"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
          ) : null}
        </svg>

        {/* Keyboard- and pointer-accessible overlay: one real button per group,
            positioned to match the SVG columns exactly. The crosshair readout
            above and the box styling here both key off this same hover/pin state. */}
        <div className="absolute inset-0 grid grid-cols-6">
          {SERVICES.map((service) => {
            const summary = LATENCY_SUMMARY[service.id][period];
            const pinned = service.id === pinnedServiceId;
            const status = deriveServiceStatus(service.id);
            return (
              <button
                key={service.id}
                type="button"
                onMouseEnter={() => onHover(service.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(service.id)}
                onBlur={() => onHover(null)}
                onClick={() => onPin(service.id)}
                aria-pressed={pinned}
                className={`h-full w-full rounded-md motion-safe:transition-colors ${FOCUS_RING} ${pinned ? "" : "hover:bg-violet-50/40"}`}
              >
                <span className="sr-only">
                  {service.name} ({status}) — median {summary.median} ms, Q1 {summary.q1} ms, Q3 {summary.q3} ms, range{" "}
                  {summary.min}–{summary.max} ms. {pinned ? "Currently pinned." : "Press Enter to pin and load the detail panel."}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {SERVICES.map((service) => {
          const summary = LATENCY_SUMMARY[service.id][period];
          const status = deriveServiceStatus(service.id);
          const pinned = service.id === pinnedServiceId;
          return (
            <div
              key={service.id}
              className={`min-w-0 rounded-lg border p-2.5 ${pinned ? "border-violet-300 bg-violet-50/50" : "border-zinc-200"}`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[status]}`} aria-hidden="true" />
                <p className="truncate font-medium text-xs text-zinc-700">{service.short}</p>
              </div>
              <dl className="mt-1.5 grid grid-cols-5 gap-x-0.5 text-center">
                <div>
                  <dt className="font-medium text-[11px] uppercase tracking-wide text-zinc-500">Min</dt>
                  <dd className="font-semibold tabular-nums text-[11px] text-zinc-900">{summary.min}</dd>
                </div>
                <div>
                  <dt className="font-medium text-[11px] uppercase tracking-wide text-zinc-500">Q1</dt>
                  <dd className="font-semibold tabular-nums text-[11px] text-zinc-900">{summary.q1}</dd>
                </div>
                <div>
                  <dt className="font-medium text-[11px] uppercase tracking-wide text-zinc-500">Med</dt>
                  <dd className="font-semibold tabular-nums text-[11px] text-violet-700">{summary.median}</dd>
                </div>
                <div>
                  <dt className="font-medium text-[11px] uppercase tracking-wide text-zinc-500">Q3</dt>
                  <dd className="font-semibold tabular-nums text-[11px] text-zinc-900">{summary.q3}</dd>
                </div>
                <div>
                  <dt className="font-medium text-[11px] uppercase tracking-wide text-zinc-500">Max</dt>
                  <dd className="font-semibold tabular-nums text-[11px] text-zinc-900">{summary.max}</dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}
