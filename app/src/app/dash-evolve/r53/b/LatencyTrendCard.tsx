"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardHeader, SegmentedControl, FOCUS_RING, formatMs } from "./ui";
import { LATENCY_SERIES, PERIOD_LABEL, SERVICE_BY_ID, currentLatency, type Period } from "./data";

const VB_W = 640;
const VB_H = 200;
const MARGIN = { top: 10, right: 10, bottom: 22, left: 40 };
const PLOT_W = VB_W - MARGIN.left - MARGIN.right;
const PLOT_H = VB_H - MARGIN.top - MARGIN.bottom;

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function LatencyTrendCard({
  period,
  onPeriodChange,
  selectedServiceId,
  id,
}: {
  period: Period;
  onPeriodChange: (p: Period) => void;
  selectedServiceId: string | null;
  id?: string;
}) {
  // Crosshair state is local and ephemeral to this chart — intentionally NOT the same axis as
  // `selectedServiceId` (the pinned-selection axis, shared with the Incident Queue and Service
  // Health cards below). Hovering/arrowing through the chart never changes what's pinned elsewhere.
  const [crosshair, setCrosshair] = useState<number | null>(null);

  const points = LATENCY_SERIES[period];
  const selected = selectedServiceId ? SERVICE_BY_ID[selectedServiceId] : null;

  const { lineValues, min, max } = useMemo(() => {
    const platform = points.map((p) => p.platform);
    const service = selected ? points.map((p) => p.values[selected.id]) : null;
    const all = service ? [...platform, ...service] : platform;
    const lo = Math.min(...all);
    const hi = Math.max(...all);
    const pad = (hi - lo) * 0.15 || 4;
    return { lineValues: { platform, service }, min: Math.floor(lo - pad), max: Math.ceil(hi + pad) };
  }, [points, selected]);

  const n = points.length;
  const xAt = (i: number) => r2(MARGIN.left + (n === 1 ? 0 : (i / (n - 1)) * PLOT_W));
  const yAt = (v: number) => r2(MARGIN.top + (1 - (v - min) / (max - min || 1)) * PLOT_H);

  const platformPath = lineValues.platform.map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i)},${yAt(v)}`).join(" ");
  const servicePath = lineValues.service ? lineValues.service.map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i)},${yAt(v)}`).join(" ") : null;
  const areaPath = `${platformPath} L${xAt(n - 1)},${r2(MARGIN.top + PLOT_H)} L${xAt(0)},${r2(MARGIN.top + PLOT_H)} Z`;

  const gridValues = [min, (min + max) / 2, max];

  function indexFromClientX(container: HTMLDivElement, clientX: number) {
    const rect = container.getBoundingClientRect();
    const fx = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const vbX = fx * VB_W;
    const i = Math.round(((vbX - MARGIN.left) / PLOT_W) * (n - 1));
    return Math.min(n - 1, Math.max(0, i));
  }

  const activeIndex = crosshair ?? n - 1;
  const activePoint = points[activeIndex];
  const stat = currentLatency(selected ? selected.id : "platform");
  const statLabel = selected ? selected.name : "Platform aggregate";

  const tooltipLeftPct = (xAt(activeIndex) / VB_W) * 100;
  const tooltipAlign = activeIndex < n * 0.18 ? "left" : activeIndex > n * 0.82 ? "right" : "center";

  return (
    <Card id={id} colSpan="col-span-1 md:col-span-2 lg:col-span-7" rowSpan="lg:row-span-2" className="flex flex-col">
      <CardHeader
        title="Request latency"
        description={statLabel}
        action={
          <SegmentedControl
            aria-label="Latency chart time range"
            value={period}
            onChange={onPeriodChange}
            options={[
              { value: "24h", label: "24H" },
              { value: "7d", label: "7D" },
              { value: "30d", label: "30D" },
            ]}
          />
        }
      />
      <div className="flex flex-shrink-0 flex-wrap items-baseline gap-x-6 gap-y-1 px-4 pt-3">
        <StatBlock label="p50" value={stat.p50} />
        <StatBlock label="p95" value={stat.p95} />
        <StatBlock label="p99" value={stat.p99} />
        <span className="text-xs text-zinc-500">{PERIOD_LABEL[period]}</span>
      </div>
      <div className="relative min-h-0 flex-1 px-2 pb-3 pt-2">
        <div
          role="group"
          tabIndex={0}
          aria-label={`Latency trend for ${statLabel}, ${PERIOD_LABEL[period]}. Use left and right arrow keys to inspect each point. Currently showing ${activePoint.label}, platform ${formatMs(activePoint.platform)}${selected ? `, ${selected.name} ${formatMs(activePoint.values[selected.id])}` : ""}.`}
          className={`relative h-full w-full cursor-crosshair rounded-lg ${FOCUS_RING}`}
          onPointerMove={(e) => setCrosshair(indexFromClientX(e.currentTarget, e.clientX))}
          onPointerLeave={() => setCrosshair(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              setCrosshair((c) => Math.min(n - 1, (c ?? n - 1) + 1));
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              setCrosshair((c) => Math.max(0, (c ?? n - 1) - 1));
            } else if (e.key === "Home") {
              e.preventDefault();
              setCrosshair(0);
            } else if (e.key === "End") {
              e.preventDefault();
              setCrosshair(n - 1);
            }
          }}
        >
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-full w-full overflow-visible" aria-hidden="true">
            <defs>
              <linearGradient id="r53b-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
              </linearGradient>
            </defs>
            {gridValues.map((v, i) => (
              <g key={i}>
                <line x1={MARGIN.left} x2={VB_W - MARGIN.right} y1={yAt(v)} y2={yAt(v)} stroke="#e4e4e7" strokeWidth={1} />
                <text x={MARGIN.left - 6} y={yAt(v) + 3} textAnchor="end" fontSize="9" fill="#71717a">
                  {Math.round(v)}
                </text>
              </g>
            ))}
            <path d={areaPath} fill="url(#r53b-area)" />
            <path d={platformPath} fill="none" stroke={selected ? "#a1a1aa" : "#16a34a"} strokeWidth={selected ? 1.5 : 2} strokeLinejoin="round" strokeLinecap="round" />
            {servicePath && <path d={servicePath} fill="none" stroke="#15803d" strokeWidth={2.25} strokeLinejoin="round" strokeLinecap="round" />}
            {crosshair !== null && (
              <>
                <line x1={xAt(activeIndex)} x2={xAt(activeIndex)} y1={MARGIN.top} y2={MARGIN.top + PLOT_H} stroke="#a1a1aa" strokeWidth={1} strokeDasharray="3 3" />
                <circle cx={xAt(activeIndex)} cy={yAt(activePoint.platform)} r={3} fill="#16a34a" />
                {selected && <circle cx={xAt(activeIndex)} cy={yAt(activePoint.values[selected.id])} r={3} fill="#15803d" />}
              </>
            )}
          </svg>
          {crosshair !== null && (
            <div
              className="pointer-events-none absolute top-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs shadow-md"
              style={{
                left: `${tooltipLeftPct}%`,
                transform: tooltipAlign === "center" ? "translateX(-50%)" : tooltipAlign === "left" ? "translateX(0%)" : "translateX(-100%)",
              }}
            >
              <p className="font-medium text-zinc-900 whitespace-nowrap">{activePoint.label}</p>
              <p className="whitespace-nowrap tabular-nums text-zinc-600">Platform {formatMs(activePoint.platform)}</p>
              {selected && (
                <p className="whitespace-nowrap tabular-nums text-green-700">
                  {selected.name} {formatMs(activePoint.values[selected.id])}
                </p>
              )}
            </div>
          )}
        </div>
        <p className="sr-only" aria-live="polite">
          {activePoint.label}: platform {formatMs(activePoint.platform)}
          {selected ? `, ${selected.name} ${formatMs(activePoint.values[selected.id])}` : ""}
        </p>
      </div>
      {selected && (
        <div className="flex flex-shrink-0 items-center gap-1.5 border-t border-zinc-100 px-4 py-2 text-xs text-zinc-600">
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-green-600" aria-hidden="true" />
          Pinned to <span className="font-medium text-zinc-900">{selected.name}</span> — select another row to compare.
        </div>
      )}
    </Card>
  );
}

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-500">{label}</span>
      <span className="text-lg font-semibold tabular-nums text-zinc-900">{formatMs(value)}</span>
    </div>
  );
}
