"use client";

import { useId, useMemo, useState } from "react";
import type { Period, SlaPoint } from "./data";
import { round2 } from "./data";
import { FOCUS_RING, Segmented } from "./ui";

const VB_W = 640;
const VB_H = 200;
const PAD = { top: 18, right: 12, bottom: 22, left: 12 };

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
];

export function SlaChart({
  data,
  period,
  onPeriodChange,
  targetMinutes,
}: {
  data: Record<Period, SlaPoint[]>;
  period: Period;
  onPeriodChange: (p: Period) => void;
  targetMinutes: number;
}) {
  const points = data[period];
  const uid = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const geometry = useMemo(() => {
    const values = points.map((p) => p.value);
    const rawMax = Math.max(...values, targetMinutes);
    const rawMin = Math.min(...values, targetMinutes);
    const span = Math.max(rawMax - rawMin, 8);
    const maxV = rawMax + span * 0.2;
    const minV = Math.max(0, rawMin - span * 0.2);
    const plotW = VB_W - PAD.left - PAD.right;
    const plotH = VB_H - PAD.top - PAD.bottom;

    const xAt = (i: number) => round2(PAD.left + (points.length === 1 ? plotW / 2 : (i * plotW) / (points.length - 1)));
    const yAt = (v: number) => round2(PAD.top + plotH - ((v - minV) / (maxV - minV)) * plotH);

    const coords = points.map((p, i) => ({ x: xAt(i), y: yAt(p.value), label: p.label, value: p.value }));
    const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
    const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${round2(PAD.top + plotH)} L ${coords[0].x} ${round2(
      PAD.top + plotH
    )} Z`;
    const targetY = yAt(targetMinutes);

    return { coords, linePath, areaPath, targetY, plotBottom: round2(PAD.top + plotH) };
  }, [points, targetMinutes]);

  const last = geometry.coords[geometry.coords.length - 1];
  const first = geometry.coords[0];
  const active = activeIndex !== null ? geometry.coords[activeIndex] : null;
  const trendPct = Math.round(((last.value - first.value) / first.value) * 100);

  const pct = (n: number, total: number) => `${round2((n / total) * 100)}%`;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="flex gap-5">
          <Stat label="Current" value={`${last.value}m`} />
          <Stat label="Target" value={`${targetMinutes}m`} muted />
          <Stat
            label={`vs ${period === "7d" ? "last week" : period === "30d" ? "last month" : "prior period"}`}
            value={`${trendPct > 0 ? "+" : ""}${trendPct}%`}
            tone={trendPct <= 0 ? "good" : "bad"}
          />
        </div>
        <Segmented ariaLabel="SLA chart time range" options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} />
      </div>

      <div
        className="relative"
        onMouseLeave={() => setActiveIndex(null)}
      >
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="w-full h-auto touch-none"
          role="img"
          aria-label={`Response time trend, ${period}. Current ${last.value} minutes against a ${targetMinutes} minute target.`}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * VB_W;
            let nearest = 0;
            let best = Infinity;
            geometry.coords.forEach((c, i) => {
              const d = Math.abs(c.x - relX);
              if (d < best) {
                best = d;
                nearest = i;
              }
            });
            setActiveIndex(nearest);
          }}
        >
          <defs>
            <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* target reference line — dashed, never color-only (paired with the "Target" stat + label) */}
          <line
            x1={PAD.left}
            y1={geometry.targetY}
            x2={VB_W - PAD.right}
            y2={geometry.targetY}
            stroke="#a1a1aa"
            strokeWidth={1.25}
            strokeDasharray="4 4"
          />

          <path d={geometry.areaPath} fill={`url(#${uid}-fill)`} stroke="none" />
          <path d={geometry.linePath} fill="none" stroke="#0d9488" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {/* crosshair */}
          {active && (
            <>
              <line x1={active.x} y1={PAD.top} x2={active.x} y2={geometry.plotBottom} stroke="#0f766e" strokeWidth={1} strokeOpacity={0.35} />
              <circle cx={active.x} cy={active.y} r={4} fill="#0f766e" stroke="white" strokeWidth={1.5} />
            </>
          )}

          {geometry.coords.map(
            (c, i) =>
              i !== activeIndex && (
                <circle key={i} cx={c.x} cy={c.y} r={2.25} fill="#0d9488" fillOpacity={0.55} />
              )
          )}
        </svg>

        {/* always-visible endpoint labels — key values shown as persistent text, not hover-gated */}
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-zinc-700 shadow-sm"
          style={{ left: pct(last.x, VB_W), top: pct(last.y - 6, VB_H) }}
        >
          {last.value}m
        </span>

        {/* keyboard-accessible hover targets, one per data point */}
        <div className="absolute inset-0 flex" aria-hidden={false}>
          {geometry.coords.map((c, i) => (
            <button
              key={i}
              type="button"
              tabIndex={0}
              onFocus={() => setActiveIndex(i)}
              onBlur={(e) => {
                if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) setActiveIndex(null);
              }}
              onMouseEnter={() => setActiveIndex(i)}
              aria-label={`${c.label}: ${c.value} minutes, ${c.value <= targetMinutes ? "under" : "over"} the ${targetMinutes} minute target`}
              className={`h-full flex-1 bg-transparent ${FOCUS_RING}`}
            />
          ))}
        </div>

        {active && (
          <div
            role="tooltip"
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-md border border-zinc-200 bg-zinc-900 px-2.5 py-1.5 text-xs text-white shadow-md"
            style={{ left: pct(active.x, VB_W), top: pct(active.y, VB_H) }}
          >
            <div className="font-semibold tabular-nums">{active.value}m</div>
            <div className="text-zinc-300">
              {active.label} &middot; {active.value <= targetMinutes ? "under target" : "over target"}
            </div>
          </div>
        )}
      </div>

      <div
        className="mt-1 flex text-[10px] font-medium uppercase tracking-wide text-zinc-500"
        style={{ paddingLeft: pct(PAD.left, VB_W), paddingRight: pct(PAD.right, VB_W) }}
      >
        {points.map((p, i) => (
          <span key={i} className="flex-1 text-center">
            {p.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  muted,
  tone,
}: {
  label: string;
  value: string;
  muted?: boolean;
  tone?: "good" | "bad";
}) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">{label}</div>
      <div
        className={`text-base font-semibold tabular-nums ${
          muted ? "text-zinc-500" : tone === "good" ? "text-emerald-700" : tone === "bad" ? "text-red-700" : "text-zinc-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
