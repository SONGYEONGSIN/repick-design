"use client";

import { useState } from "react";
import {
  sortFacilities,
  metricOf,
  deltaOf,
  isFlagged,
  PRIOR_LABEL,
  CURRENT_LABEL,
  type Facility,
  type MetricId,
  type SortMode,
} from "../lib/data";
import { FOCUS_RING, TrendIndicator, FlaggedBadge } from "./ui";

type Point = "prior" | "current";

function trendOf(delta: number): "up" | "down" | "flat" {
  if (Math.abs(delta) < 0.05) return "flat";
  return delta > 0 ? "up" : "down";
}

function clampPct(n: number) {
  return Math.min(100, Math.max(0, n));
}

/** Per-row dumbbell track: a prior-quarter dot and a current-quarter dot on a fixed 0–100 scale,
 * joined by a connector colored by direction. Both values are also printed as flanking text next
 * to the track in the row that renders this (never hover-gated) — this component only adds the
 * hover/focus crosshair + tooltip, which is a separate, ephemeral layer on top. */
function Track({
  facility,
  metricId,
  hoverKey,
  onHover,
  onLeave,
}: {
  facility: Facility;
  metricId: MetricId;
  hoverKey: string | null;
  onHover: (id: string, point: Point) => void;
  onLeave: () => void;
}) {
  const score = metricOf(facility, metricId);
  const delta = deltaOf(facility, metricId);
  const trend = trendOf(delta);
  const priorPct = clampPct(score.prior);
  const currentPct = clampPct(score.current);
  const left = Math.min(priorPct, currentPct);
  const width = Math.abs(currentPct - priorPct);

  const connectorColor = trend === "up" ? "bg-lime-500" : trend === "down" ? "bg-rose-400" : "bg-zinc-400";
  const currentDotColor = trend === "up" ? "bg-lime-600" : trend === "down" ? "bg-rose-600" : "bg-zinc-500";

  const hoveredPoint: Point | null =
    hoverKey === `${facility.id}:prior` ? "prior" : hoverKey === `${facility.id}:current` ? "current" : null;
  const hoveredPct = hoveredPoint === "prior" ? priorPct : hoveredPoint === "current" ? currentPct : null;
  const tooltipAnchor = hoveredPct === null ? 0 : Math.min(92, Math.max(8, hoveredPct));

  return (
    <div className="relative h-8 px-[14px]">
      <div
        className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-zinc-200"
        aria-hidden="true"
      />
      <div
        className={`absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full ${connectorColor}`}
        style={{ left: `${left}%`, width: `${width}%` }}
        aria-hidden="true"
      />

      {hoveredPct !== null ? (
        <>
          <div
            className="absolute top-0 bottom-0 w-px bg-zinc-300"
            style={{ left: `${hoveredPct}%` }}
            aria-hidden="true"
          />
          <div
            role="tooltip"
            className="absolute bottom-full z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-200 bg-zinc-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg"
            style={{ left: `${tooltipAnchor}%` }}
          >
            {hoveredPoint === "prior" ? PRIOR_LABEL : CURRENT_LABEL} · {score[hoveredPoint!].toFixed(1)}
          </div>
        </>
      ) : null}

      <button
        type="button"
        onMouseEnter={() => onHover(facility.id, "prior")}
        onMouseLeave={onLeave}
        onFocus={() => onHover(facility.id, "prior")}
        onBlur={onLeave}
        style={{ left: `${priorPct}%` }}
        className={`absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${FOCUS_RING}`}
        aria-label={`${facility.name}, ${PRIOR_LABEL}: ${score.prior.toFixed(1)}`}
      >
        <span className="h-3 w-3 rounded-full border-2 border-zinc-400 bg-white" aria-hidden="true" />
      </button>
      <button
        type="button"
        onMouseEnter={() => onHover(facility.id, "current")}
        onMouseLeave={onLeave}
        onFocus={() => onHover(facility.id, "current")}
        onBlur={onLeave}
        style={{ left: `${currentPct}%` }}
        className={`absolute top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${FOCUS_RING}`}
        aria-label={`${facility.name}, ${CURRENT_LABEL}: ${score.current.toFixed(1)}, ${
          trend === "flat" ? "unchanged" : trend === "up" ? "improved" : "declined"
        } by ${Math.abs(delta).toFixed(1)} points since ${PRIOR_LABEL}`}
      >
        <span className={`h-3 w-3 rounded-full ${currentDotColor}`} aria-hidden="true" />
      </button>
    </div>
  );
}

function ValueText({ value, align }: { value: number; align: "left" | "right" }) {
  return (
    <span
      className={`block w-11 shrink-0 text-xs font-semibold tabular-nums text-zinc-700 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {value.toFixed(1)}
    </span>
  );
}

function Row({
  facility,
  metricId,
  pinned,
  onPin,
  hoverKey,
  onHover,
  onLeave,
}: {
  facility: Facility;
  metricId: MetricId;
  pinned: boolean;
  onPin: (id: string) => void;
  hoverKey: string | null;
  onHover: (id: string, point: Point) => void;
  onLeave: () => void;
}) {
  const score = metricOf(facility, metricId);
  const delta = deltaOf(facility, metricId);
  const trend = trendOf(delta);
  const currentColor = trend === "up" ? "text-lime-700" : trend === "down" ? "text-rose-600" : "text-zinc-700";
  const flagged = isFlagged(facility);

  const nameMeta = (
    <div className="flex min-w-0 items-baseline gap-2">
      <button
        type="button"
        onClick={() => onPin(facility.id)}
        aria-current={pinned ? "true" : undefined}
        className={`min-w-0 truncate text-left text-sm font-semibold text-zinc-900 hover:text-lime-700 ${FOCUS_RING}`}
      >
        {facility.name}
      </button>
      {/* zinc-600, not -500: this row's background is tinted lime-50 while pinned, so the -500
          weight that is otherwise fine on white would fall under the tinted-surface contrast floor. */}
      <span className="shrink-0 whitespace-nowrap text-xs text-zinc-600">
        {facility.regionCode} · {facility.type}
      </span>
      {flagged ? <FlaggedBadge /> : null}
    </div>
  );

  const trackEl = <Track facility={facility} metricId={metricId} hoverKey={hoverKey} onHover={onHover} onLeave={onLeave} />;
  const badge = <TrendIndicator delta={delta} srPrefix={facility.name} />;

  return (
    <li
      className={`rounded-xl border px-4 py-3 transition-colors duration-150 motion-reduce:transition-none ${
        pinned ? "border-lime-300 bg-lime-50/50 ring-1 ring-lime-200" : "border-zinc-200 bg-white hover:border-zinc-300"
      }`}
    >
      <span className="sr-only">
        {facility.name}: {score.prior.toFixed(1)} in {PRIOR_LABEL}, {score.current.toFixed(1)} in {CURRENT_LABEL}
        {trend === "flat" ? ", unchanged" : trend === "up" ? ", improved" : ", declined"} by{" "}
        {Math.abs(delta).toFixed(1)} points.
      </span>

      {/* Mobile: name + badge, then prior / track / current */}
      <div className="flex items-start justify-between gap-3 sm:hidden">
        {nameMeta}
        <div className="shrink-0">{badge}</div>
      </div>
      <div className="mt-2 flex items-center gap-2 sm:hidden">
        <ValueText value={score.prior} align="right" />
        <div className="min-w-0 flex-1">{trackEl}</div>
        <span className={`block w-11 shrink-0 text-left text-xs font-semibold tabular-nums ${currentColor}`}>
          {score.current.toFixed(1)}
        </span>
      </div>

      {/* Desktop: single row, fixed-width flanking columns, fluid track */}
      <div className="hidden items-center gap-3 sm:flex">
        <div className="w-[220px] shrink-0">{nameMeta}</div>
        <ValueText value={score.prior} align="right" />
        <div className="min-w-0 flex-1">{trackEl}</div>
        <span className={`block w-11 shrink-0 text-left text-xs font-semibold tabular-nums ${currentColor}`}>
          {score.current.toFixed(1)}
        </span>
        <div className="flex w-20 shrink-0 justify-end">{badge}</div>
      </div>
    </li>
  );
}

export function SlopeChart({
  metricId,
  sortMode,
  declineOnly,
  pinnedId,
  onPin,
}: {
  metricId: MetricId;
  sortMode: SortMode;
  declineOnly: boolean;
  pinnedId: string;
  onPin: (id: string) => void;
}) {
  // Ephemeral, local-only state: which single point is hovered/focused. It drives nothing but
  // this chart's own crosshair + tooltip — a deliberately separate state from the pin above, which
  // instead drives the facility detail drawer elsewhere on the page.
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const rows = sortFacilities(metricId, sortMode, declineOnly);

  return (
    <div className="px-3 py-3 sm:px-5">
      {rows.length === 0 ? (
        <p className="px-2 py-8 text-center text-sm text-zinc-500">
          No facilities are currently declining on this metric.
        </p>
      ) : (
        <ul aria-label="Facility ESG scores, prior vs. current quarter" className="flex flex-col gap-2">
          {rows.map((facility) => (
            <Row
              key={facility.id}
              facility={facility}
              metricId={metricId}
              pinned={facility.id === pinnedId}
              onPin={onPin}
              hoverKey={hoverKey}
              onHover={(id, point) => setHoverKey(`${id}:${point}`)}
              onLeave={() => setHoverKey(null)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
