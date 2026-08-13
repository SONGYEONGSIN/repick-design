"use client";

import { useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "../utils";
import { round2, clamp, formatPercent, labelFromOffset } from "../data";
import type { SeriesPoint } from "../types";

const CHART_W = 760;
const CHART_H = 240;
const PAD_Y = 18;

interface EtaChartProps {
  fleet: SeriesPoint[];
  /** actual-only carrier overlay, same length as the fleet's actual segment */
  carrierOverlay: SeriesPoint[] | null;
  carrierLabel: string | null;
  periodLabel: string;
}

export function EtaChart({ fleet, carrierOverlay, carrierLabel, periodLabel }: EtaChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const n = fleet.length;
  const todayIndex = fleet.findIndex((p) => !p.isForecast && p.offset === 0);
  const actualCount = todayIndex + 1;

  const allValues = fleet.flatMap((p) => [p.value, p.lower ?? p.value, p.upper ?? p.value]);
  if (carrierOverlay) allValues.push(...carrierOverlay.map((p) => p.value));
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const range = max - min || 1;
  const plotH = CHART_H - PAD_Y * 2;

  function mapX(i: number): number {
    return round2((i / (n - 1)) * CHART_W);
  }
  function mapY(v: number): number {
    return round2(PAD_Y + ((max - v) / range) * plotH);
  }

  const actualPoints = fleet.slice(0, actualCount);
  const forecastPoints = fleet.slice(actualCount);

  const actualLine = actualPoints.map((p, i) => `${mapX(i)},${mapY(p.value)}`).join(" L ");
  const forecastLine = [fleet[todayIndex], ...forecastPoints]
    .map((p, i) => `${mapX(todayIndex + i)},${mapY(p.value)}`)
    .join(" L ");

  const bandUpper = [fleet[todayIndex], ...forecastPoints]
    .map((p, i) => `${mapX(todayIndex + i)},${mapY(p.upper ?? p.value)}`)
    .join(" L ");
  const bandLowerRev = [fleet[todayIndex], ...forecastPoints]
    .map((p, i) => `${mapX(todayIndex + i)},${mapY(p.lower ?? p.value)}`)
    .reverse()
    .join(" L ");
  const bandPath = `M ${bandUpper} L ${bandLowerRev} Z`;

  const carrierLine = carrierOverlay ? carrierOverlay.map((p, i) => `${mapX(i)},${mapY(p.value)}`).join(" L ") : null;

  const active = activeIndex !== null ? fleet[activeIndex] : null;
  const activeX = activeIndex !== null ? mapX(activeIndex) : 0;
  const activeY = active ? mapY(active.value) : 0;
  const tooltipLeftPct = clamp((activeX / CHART_W) * 100, 10, 90);
  const tooltipTopPct = active ? (activeY / CHART_H) * 100 : 0;

  function indexFromClientX(clientX: number, rect: DOMRect): number {
    const fraction = clamp((clientX - rect.left) / rect.width, 0, 1);
    return Math.round(fraction * (n - 1));
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveIndex(indexFromClientX(e.clientX, rect));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const current = activeIndex ?? todayIndex;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIndex(clamp(current + 1, 0, n - 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex(clamp(current - 1, 0, n - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(n - 1);
    }
  }

  const gridValues = [max, max - range / 2, min];
  const todayX = mapX(todayIndex);

  return (
    <div className="px-1">
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Fleet on-time trend, ${periodLabel}. Use arrow keys to inspect each day, including the forecast.`}
        aria-valuemin={0}
        aria-valuemax={n - 1}
        aria-valuenow={activeIndex ?? todayIndex}
        aria-valuetext={
          active
            ? active.isForecast
              ? `${active.fullLabel}, projected ${formatPercent(active.value)}, range ${formatPercent(active.lower ?? active.value)} to ${formatPercent(active.upper ?? active.value)}`
              : `${active.fullLabel}, ${formatPercent(active.value)} on time`
            : `Today, ${formatPercent(fleet[todayIndex].value)} on time`
        }
        aria-orientation="horizontal"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setActiveIndex(null)}
        onKeyDown={handleKeyDown}
        onBlur={() => setActiveIndex(null)}
        className={cn(
          "relative h-56 w-full cursor-crosshair rounded-lg outline-none sm:h-64 lg:h-72",
          "focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        )}
      >
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none" className="h-full w-full overflow-visible" role="presentation">
          {gridValues.map((gv, i) => (
            <line key={i} x1={0} x2={CHART_W} y1={mapY(gv)} y2={mapY(gv)} stroke="currentColor" className="text-white/5" strokeWidth={1} />
          ))}

          {/* today divider — always visible, not hover-gated */}
          <line x1={todayX} x2={todayX} y1={PAD_Y} y2={CHART_H - PAD_Y} stroke="currentColor" className="text-white/15" strokeWidth={1} strokeDasharray="2 3" />

          <path d={bandPath} fill="#fb7185" fillOpacity="0.16" stroke="none" />

          {carrierLine && (
            <path d={`M ${carrierLine}`} fill="none" stroke="#a1a1aa" strokeWidth={1.5} strokeDasharray="4 3" strokeLinejoin="round" strokeLinecap="round" />
          )}

          <path d={`M ${actualLine}`} fill="none" stroke="#f4f4f5" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <path d={`M ${forecastLine}`} fill="none" stroke="#fb7185" strokeWidth={2} strokeDasharray="5 4" strokeLinejoin="round" strokeLinecap="round" />

          {/* always-on markers: today (actual) and end of forecast */}
          <circle cx={mapX(todayIndex)} cy={mapY(fleet[todayIndex].value)} r={3.5} fill="#f4f4f5" stroke="#09090b" strokeWidth={1.5} />
          <circle cx={mapX(n - 1)} cy={mapY(fleet[n - 1].value)} r={3.5} fill="#fb7185" stroke="#09090b" strokeWidth={1.5} />

          {activeIndex !== null && (
            <>
              <line x1={activeX} x2={activeX} y1={PAD_Y} y2={CHART_H - PAD_Y} stroke="currentColor" className="text-white/25 motion-reduce:transition-none" strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={activeX} cy={activeY} r={4} fill={active?.isForecast ? "#fb7185" : "#f4f4f5"} stroke="#09090b" strokeWidth={2} />
            </>
          )}
        </svg>

        {gridValues.map((gv, i) => (
          <span key={i} aria-hidden="true" className="pointer-events-none absolute right-1 -translate-y-1/2 text-[10px] tabular-nums text-zinc-400" style={{ top: `${(mapY(gv) / CHART_H) * 100}%` }}>
            {formatPercent(gv)}
          </span>
        ))}

        {/* always-on labels at today + forecast end, independent of hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+6px)] whitespace-nowrap text-[10px] font-medium tabular-nums text-zinc-200"
          style={{ left: `${(todayX / CHART_W) * 100}%`, top: `${(mapY(fleet[todayIndex].value) / CHART_H) * 100}%` }}
        >
          Today · {formatPercent(fleet[todayIndex].value)}
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -translate-x-full translate-y-[10px] whitespace-nowrap text-right text-[10px] font-medium tabular-nums text-rose-300"
          style={{ left: `${(mapX(n - 1) / CHART_W) * 100}%`, top: `${(mapY(fleet[n - 1].value) / CHART_H) * 100}%` }}
        >
          +{fleet[n - 1].offset}d · {formatPercent(fleet[n - 1].lower ?? fleet[n - 1].value)}–{formatPercent(fleet[n - 1].upper ?? fleet[n - 1].value)}
        </span>

        {carrierLabel && carrierOverlay && (() => {
          const carrierLeftPct = (mapX(carrierOverlay.length - 1) / CHART_W) * 100;
          // Flip the label to the left of its point once it gets close to the
          // right edge, so its text never runs past the plot's own bounds
          // (measured to overflow the page by a few px at 390px otherwise).
          const flipLeft = carrierLeftPct > 68;
          return (
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute -translate-y-1/2 whitespace-nowrap text-[10px] font-medium tabular-nums text-zinc-300",
                flipLeft ? "-translate-x-[calc(100%+8px)]" : "translate-x-2",
              )}
              style={{ left: `${carrierLeftPct}%`, top: `${(mapY(carrierOverlay[carrierOverlay.length - 1].value) / CHART_H) * 100}%` }}
            >
              {carrierLabel} · {formatPercent(carrierOverlay[carrierOverlay.length - 1].value)}
            </span>
          );
        })()}

        {active && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg border border-white/10 bg-zinc-800/95 px-2.5 py-1.5 text-xs shadow-lg motion-reduce:transition-none"
            style={{ left: `${tooltipLeftPct}%`, top: `${tooltipTopPct}%` }}
          >
            <p className="font-semibold tabular-nums text-zinc-50">
              {active.isForecast ? `${formatPercent(active.lower ?? active.value)}–${formatPercent(active.upper ?? active.value)}` : formatPercent(active.value)}
            </p>
            <p className="tabular-nums text-zinc-400">
              {active.fullLabel}
              {active.isForecast ? " · projected" : ""}
            </p>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between px-1 text-[11px] tabular-nums text-zinc-400" aria-hidden="true">
        <span>{labelFromOffset(fleet[0].offset)}</span>
        <span>{labelFromOffset(fleet[todayIndex].offset)}</span>
        <span>{labelFromOffset(fleet[n - 1].offset)}</span>
      </div>
    </div>
  );
}
