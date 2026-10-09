"use client";

import { MapPin, X } from "lucide-react";
import { useMemo, useState } from "react";
import { REGIONS, hexCenter, hexPoints, regionById, regionStatus, type TimeRange } from "./data";
import {
  BORDER,
  FADE_TRANSITION,
  RAMP_FILL,
  RAMP_LABEL_INCIDENTS,
  RAMP_LABEL_LATENCY,
  RAMP_TEXT,
  STATUS_DOT,
  STATUS_LABEL,
  STATUS_TEXT,
  TEXT_AUX,
  TEXT_PRIMARY,
  TRANSITION,
  cx,
  fmtCompact,
  fmtMs,
  fmtPct,
  r2,
  tierForIncidents,
  tierForLatency,
} from "./tokens";
import { Card, CardHead, Tabs } from "./ui";

const HEX_RADIUS = 38; // drawn radius — smaller than the 42px grid spacing, leaving a visible gap
const PAD = 54;

type Metric = "incidents" | "latency";

const METRIC_TABS: { id: Metric; label: string }[] = [
  { id: "incidents", label: "Incidents" },
  { id: "latency", label: "Latency" },
];

/**
 * The choropleth. Reacts to `pinnedRegionId` (set from exactly one place — a feed item click in
 * the orchestrator) by drawing a ring and a one-line text callout; this is the single
 * partial-recompute consumer of that id, nothing else on the page reads it. Hover/focus on a
 * region is a fully separate, zero-state mechanism: pure CSS `group-hover`/`group-focus-within`
 * opacity on a per-region tooltip, so it never touches React state and cannot leak into any
 * other widget.
 */
export function RegionMap({ range, pinnedRegionId, onClearPin }: { range: TimeRange; pinnedRegionId: string | null; onClearPin: () => void }) {
  const [metric, setMetric] = useState<Metric>("incidents");

  const centers = useMemo(() => REGIONS.map((r) => hexCenter(r.col, r.row)), []);
  const bounds = useMemo(() => {
    const xs = centers.map((c) => c.x);
    const ys = centers.map((c) => c.y);
    return { minX: r2(Math.min(...xs) - PAD), maxX: r2(Math.max(...xs) + PAD), minY: r2(Math.min(...ys) - PAD), maxY: r2(Math.max(...ys) + PAD) };
  }, [centers]);
  const vbW = r2(bounds.maxX - bounds.minX);
  const vbH = r2(bounds.maxY - bounds.minY);

  const pinned = regionById(pinnedRegionId);
  const ramp = metric === "incidents" ? RAMP_LABEL_INCIDENTS : RAMP_LABEL_LATENCY;

  return (
    <Card id="map" className="flex h-full flex-col">
      <CardHead
        title="Edge regions"
        hint={
          pinned ? (
            <span className="inline-flex flex-wrap items-center gap-1.5">
              <MapPin size={12} aria-hidden="true" className="text-sky-400" />
              Pinned — <span className="font-medium text-sky-300">{pinned.name}</span>
              <button
                type="button"
                onClick={onClearPin}
                aria-label="Clear pinned region"
                className={cx("ml-1 inline-flex min-h-6 items-center gap-0.5 rounded px-1.5 text-[11px] font-medium", TEXT_AUX, TRANSITION, "hover:text-zinc-50")}
              >
                <X size={10} aria-hidden="true" /> Clear
              </button>
            </span>
          ) : (
            "Select an activity item to pin its region. Hover or tab onto a region for its stats."
          )
        }
        action={<Tabs options={METRIC_TABS} value={metric} onChange={setMetric} ariaLabel="Map metric" panelId="map-metric-panel" />}
      />

      <div
        id="map-metric-panel"
        role="tabpanel"
        aria-label={metric === "incidents" ? "Incident load by region" : "p50 latency by region"}
        className="relative mt-4 w-full"
        style={{ aspectRatio: `${vbW} / ${vbH}` }}
      >
        <svg viewBox={`${bounds.minX} ${bounds.minY} ${vbW} ${vbH}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          {REGIONS.map((region, i) => {
            const c = centers[i];
            const m = region.metrics[range];
            const tier = metric === "incidents" ? tierForIncidents(m.incidents) : tierForLatency(m.p50Ms);
            const isPinned = region.id === pinnedRegionId;
            const value = metric === "incidents" ? String(m.incidents) : `${m.p50Ms}ms`;
            return (
              <g key={region.id}>
                {isPinned ? <polygon points={hexPoints(c.x, c.y, HEX_RADIUS + 7)} fill="none" stroke="#38bdf8" strokeWidth={2.5} /> : null}
                <polygon points={hexPoints(c.x, c.y, HEX_RADIUS)} fill={RAMP_FILL[tier]} stroke="rgba(255,255,255,0.28)" strokeWidth={1.25} />
                <text x={c.x} y={r2(c.y - 6)} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={600} fill={RAMP_TEXT[tier]} style={{ fontFamily: "var(--font-sans)" }}>
                  {region.code}
                </text>
                <text x={c.x} y={r2(c.y + 9)} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={400} fill={RAMP_TEXT[tier]} style={{ fontFamily: "var(--font-sans)" }}>
                  {value}
                </text>
              </g>
            );
          })}
        </svg>

        {REGIONS.map((region, i) => {
          const c = centers[i];
          const m = region.metrics[range];
          const status = regionStatus(region, range);
          const leftPct = r2(((c.x - bounds.minX) / vbW) * 100);
          const topPct = r2(((c.y - bounds.minY) / vbH) * 100);
          const wPct = r2(((HEX_RADIUS * 2) / vbW) * 100);
          const hPct = r2(((HEX_RADIUS * Math.sqrt(3)) / vbH) * 100);
          // Tooltip horizontal anchor: regions near either edge of the panel pin the tooltip to
          // that same edge instead of centering it, so it never extends past the panel at narrow
          // widths (a centered 176px tooltip over an edge hex would otherwise push past 390px).
          const tooltipAlign: "start" | "center" | "end" = leftPct < 20 ? "start" : leftPct > 80 ? "end" : "center";
          const tooltipPositionClass =
            tooltipAlign === "start" ? "left-0" : tooltipAlign === "end" ? "right-0" : "left-1/2 -translate-x-1/2";
          return (
            <div
              key={region.id}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${leftPct}%`, top: `${topPct}%`, width: `${wPct}%`, height: `${hPct}%` }}
            >
              <button
                type="button"
                aria-label={`${region.name}: ${STATUS_LABEL[status]}, ${m.incidents} incidents, ${fmtPct(m.uptimePct)} uptime, ${fmtMs(m.p50Ms)} p50, ${fmtCompact(m.reqPerSec)} requests per second`}
                // min-w/min-h guarantee a real tap target even if the hex grid is ever denser or
                // the viewport narrower than today's layout makes the percentage-sized box — the
                // visual hex glyph can be smaller than the hit area, never the other way round.
                className="absolute inset-0 min-h-6 min-w-6 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              />
              <div
                aria-hidden="true"
                className={cx(
                  "pointer-events-none absolute bottom-full z-20 mb-2 w-44 rounded-lg border bg-zinc-800 p-2.5 text-left opacity-0 shadow-lg shadow-black/40 group-focus-within:opacity-100 group-hover:opacity-100",
                  tooltipPositionClass,
                  BORDER,
                  FADE_TRANSITION,
                )}
              >
                <p className={cx("flex items-center gap-1.5 text-xs font-medium", TEXT_PRIMARY)}>
                  <span aria-hidden="true" className={cx("h-1.5 w-1.5 rounded-full", STATUS_DOT[status])} />
                  {region.name}
                </p>
                <dl className="mt-1.5 space-y-0.5 text-[11px]">
                  <div className="flex items-center justify-between gap-2">
                    <dt className={TEXT_AUX}>Status</dt>
                    <dd className={cx("font-medium tabular-nums", STATUS_TEXT[status])}>{STATUS_LABEL[status]}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className={TEXT_AUX}>Uptime</dt>
                    <dd className={cx("font-medium tabular-nums", TEXT_PRIMARY)}>{fmtPct(m.uptimePct)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className={TEXT_AUX}>p50</dt>
                    <dd className={cx("font-medium tabular-nums", TEXT_PRIMARY)}>{fmtMs(m.p50Ms)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className={TEXT_AUX}>Incidents</dt>
                    <dd className={cx("font-medium tabular-nums", TEXT_PRIMARY)}>{m.incidents}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <dt className={TEXT_AUX}>Req/s</dt>
                    <dd className={cx("font-medium tabular-nums", TEXT_PRIMARY)}>{fmtCompact(m.reqPerSec)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          );
        })}
      </div>

      <ul aria-label="Severity legend" className={cx("mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t pt-3 text-[11px]", BORDER)}>
        {ramp.map((label, i) => (
          <li key={label} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm border border-white/25" style={{ backgroundColor: RAMP_FILL[i] }} />
            <span className={TEXT_AUX}>
              {label} {metric === "incidents" ? "incidents" : ""}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
