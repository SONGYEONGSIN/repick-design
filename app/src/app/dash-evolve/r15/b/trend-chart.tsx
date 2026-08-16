"use client";

import { useMemo, useRef, useState } from "react";
import { HUB_BY_ID, PERIODS, dailyHubSeries, dailyNetworkSeries, networkOnTime, onTimeForPeriod, seriesForPeriod } from "./data";
import type { PeriodId } from "./types";
import { ACCENT_TEXT, FOCUS_VISIBLE, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";

const VB_W = 640;
const VB_H = 220;
const PAD_X = 12;
const PAD_TOP = 20;
const PAD_BOTTOM = 24;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Dominant secondary visualization's supporting chart: network-wide on-time trend, with the
 * selected hub plotted as a second line for direct comparison — the map-node click's second synced
 * widget. Every data point is a real, individually focusable ≥24×24px control; Tab moves through
 * them in DOM order and ArrowLeft/ArrowRight jump directly between them, each announcing its value
 * so the crosshair tooltip is fully keyboard-reachable, not only hover-only.
 */
export default function TrendChart({ period, selectedHubId }: { period: PeriodId; selectedHubId: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const hub = HUB_BY_ID[selectedHubId];
  const networkDaily = useMemo(() => dailyNetworkSeries(), []);
  const hubDaily = useMemo(() => dailyHubSeries(hub), [hub]);

  const networkPoints = seriesForPeriod(networkDaily, period);
  const hubPoints = seriesForPeriod(hubDaily, period);
  const n = networkPoints.length;

  const plotW = VB_W - PAD_X * 2;
  const plotH = VB_H - PAD_TOP - PAD_BOTTOM;

  // Scale 84–100% into the plot area so the trend's day-to-day movement is legible.
  const SCALE_MIN = 84;
  const SCALE_MAX = 100;
  function scaleY(value: number) {
    const t = (Math.min(SCALE_MAX, Math.max(SCALE_MIN, value)) - SCALE_MIN) / (SCALE_MAX - SCALE_MIN);
    return round2(PAD_TOP + (1 - t) * plotH);
  }

  const netCoords = networkPoints.map((p, i) => ({ x: round2(PAD_X + (n > 1 ? (i * plotW) / (n - 1) : plotW / 2)), y: scaleY(p.value), value: p.value }));
  const hubCoords = hubPoints.map((p, i) => ({ x: round2(PAD_X + (n > 1 ? (i * plotW) / (n - 1) : plotW / 2)), y: scaleY(p.value), value: p.value }));

  const netLine = netCoords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x},${c.y}`).join(" ");
  const hubLine = hubCoords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x},${c.y}`).join(" ");
  const baselineY = round2(PAD_TOP + plotH);
  const active = activeIndex != null ? { idx: activeIndex, net: netCoords[activeIndex], hub: hubCoords[activeIndex] } : null;

  function focusIndex(i: number) {
    const clamped = Math.max(0, Math.min(n - 1, i));
    btnRefs.current[clamped]?.focus();
    setActiveIndex(clamped);
  }

  const periodMeta = PERIODS.find((p) => p.id === period) ?? PERIODS[0];
  const netAvg = networkOnTime(period);
  const hubAvg = onTimeForPeriod(hub, period);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap gap-6">
          <div>
            <p className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Network on time</p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className={cx("text-2xl font-semibold", NUM, TEXT_PRIMARY)}>{netAvg.toFixed(1)}%</span>
              <span className={cx("inline-flex items-center gap-1 text-[11px] font-medium", TEXT_CAPTION)}>
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-zinc-300" /> network
              </span>
            </div>
          </div>
          <div>
            <p className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>{hub.code} on time</p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className={cx("text-2xl font-semibold", NUM, ACCENT_TEXT)}>{hubAvg.toFixed(1)}%</span>
              <span className={cx("inline-flex items-center gap-1 text-[11px] font-medium", TEXT_CAPTION)}>
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-cyan-400" /> selected hub
              </span>
            </div>
          </div>
        </div>
        <span className={cx("shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium", "border-white/10 bg-white/[0.04]", TEXT_CAPTION)}>Synced to {periodMeta.label} above</span>
      </div>

      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          className="h-48 w-full sm:h-56"
          role="img"
          aria-label={`On-time trend over the ${periodMeta.fullLabel}: network averaging ${netAvg.toFixed(1)} percent, ${hub.name} averaging ${hubAvg.toFixed(1)} percent`}
        >
          <line x1={PAD_X} y1={baselineY} x2={VB_W - PAD_X} y2={baselineY} className="stroke-white/15" strokeWidth={1} />
          <line x1={PAD_X} y1={PAD_TOP} x2={VB_W - PAD_X} y2={PAD_TOP} className="stroke-white/10" strokeWidth={1} />

          {active ? <line x1={active.net.x} y1={PAD_TOP} x2={active.net.x} y2={baselineY} className="stroke-cyan-400/50" strokeWidth={1} strokeDasharray="3 3" /> : null}

          <path d={netLine} fill="none" className="stroke-zinc-400" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          <path d={hubLine} fill="none" className="stroke-cyan-400" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {netCoords.map((c, i) => (
            <circle key={`n${i}`} cx={c.x} cy={c.y} r={activeIndex === i ? 3.5 : 2} className="fill-zinc-300" />
          ))}
          {hubCoords.map((c, i) => (
            <circle key={`h${i}`} cx={c.x} cy={c.y} r={activeIndex === i ? 4 : 2.5} className="fill-cyan-400" />
          ))}
        </svg>

        {netCoords.map((c, i) => (
          <button
            key={i}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            type="button"
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(i)}
            onBlur={() => setActiveIndex(null)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                focusIndex(i + 1);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                focusIndex(i - 1);
              }
            }}
            aria-label={`Point ${i + 1} of ${n}${i === n - 1 ? " (most recent)" : ""}: network ${netCoords[i].value.toFixed(1)} percent, ${hub.code} ${hubCoords[i].value.toFixed(1)} percent on time`}
            className={cx("absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full", FOCUS_VISIBLE)}
            style={{ left: `${round2((c.x / VB_W) * 100)}%`, top: `${round2((c.y / VB_H) * 100)}%` }}
          />
        ))}

        {active ? (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 -translate-y-full rounded-lg border border-white/10 bg-zinc-800 px-2.5 py-1.5 text-xs shadow-md"
            style={{ left: `${round2((active.net.x / VB_W) * 100)}%` }}
          >
            <p className={cx("font-semibold", TEXT_PRIMARY)}>
              Point {active.idx + 1} of {n}
            </p>
            <p className={TEXT_CAPTION}>
              network <span className={cx(NUM, "text-zinc-100")}>{active.net.value.toFixed(1)}%</span> · {hub.code}{" "}
              <span className={cx(NUM, "text-cyan-300")}>{active.hub.value.toFixed(1)}%</span>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
