"use client";

import { useState } from "react";
import type { Candle } from "./data";
import { formatPrice, movingAverage } from "./data";
import { FOCUS_RING } from "./ui";

const VIEW_W = 760;
const VIEW_H = 320;
const MARGIN = { top: 16, right: 64, bottom: 26, left: 8 };
const PLOT_W = VIEW_W - MARGIN.left - MARGIN.right;
const PLOT_H = VIEW_H - MARGIN.top - MARGIN.bottom;
const MA_WINDOW = 5;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function CandlestickChart({
  candles,
  datasetKey,
  decimals,
}: {
  candles: Candle[];
  datasetKey: string;
  decimals: number;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(candles.length - 1);

  // Reset selection/hover synchronously in render (not inside an effect) whenever the active
  // instrument or period changes, so a stale index never points past the new dataset's end.
  const [prevDatasetKey, setPrevDatasetKey] = useState(datasetKey);
  let effectiveSelected = selectedIndex;
  let effectiveHover = hoverIndex;
  if (prevDatasetKey !== datasetKey) {
    setPrevDatasetKey(datasetKey);
    setSelectedIndex(candles.length - 1);
    setHoverIndex(null);
    effectiveSelected = candles.length - 1;
    effectiveHover = null;
  }

  const n = candles.length;
  const lows = candles.map((c) => c.low);
  const highs = candles.map((c) => c.high);
  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const pad = (max - min) * 0.08 || max * 0.01 || 1;
  const domainMin = min - pad;
  const domainMax = max + pad;

  function yFor(price: number): number {
    const t = (price - domainMin) / (domainMax - domainMin || 1);
    return round2(MARGIN.top + (1 - t) * PLOT_H);
  }

  const slotW = PLOT_W / n;
  const bodyW = round2(Math.min(Math.max(slotW * 0.56, 2), 16));

  function xCenter(i: number): number {
    return round2(MARGIN.left + slotW * (i + 0.5));
  }

  const ma = movingAverage(candles, MA_WINDOW);
  const maPoints: string[] = [];
  ma.forEach((v, i) => {
    if (v == null) return;
    maPoints.push(`${xCenter(i)},${yFor(v)}`);
  });
  const maPath = maPoints.length > 1 ? `M${maPoints.join(" L")}` : "";

  const gridLevels = 4;
  const gridLines = Array.from({ length: gridLevels + 1 }, (_, i) => {
    const price = domainMin + ((domainMax - domainMin) * i) / gridLevels;
    return { y: yFor(price), price };
  });

  const maxLabels = 7;
  const labelStep = Math.max(1, Math.ceil(n / maxLabels));

  const hovered = effectiveHover != null ? candles[effectiveHover] : null;
  const tooltipW = 150;
  const tooltipH = 92;
  let tooltipX = 0;
  let tooltipY = MARGIN.top + 4;
  if (effectiveHover != null) {
    const cx = xCenter(effectiveHover);
    tooltipX = cx + 10;
    if (tooltipX + tooltipW > VIEW_W - 2) tooltipX = cx - tooltipW - 10;
    if (tooltipX < 2) tooltipX = 2;
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        aria-label={`Candlestick price chart, ${n} candles, with a dashed 5-period moving average overlay. Each candle is focusable for exact values; the full data also appears in the table below.`}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={MARGIN.left} x2={VIEW_W - MARGIN.right + 6} y1={g.y} y2={g.y} stroke="var(--color-zinc-100)" strokeWidth="1" />
            <text x={VIEW_W - MARGIN.right + 10} y={round2(g.y + 3)} className="fill-zinc-500" style={{ fontSize: "10px" }}>
              {formatPrice(g.price, decimals)}
            </text>
          </g>
        ))}

        {candles.map((c, i) => {
          const cx = xCenter(i);
          const isUp = c.close >= c.open;
          const bodyTop = yFor(Math.max(c.open, c.close));
          const bodyBottom = yFor(Math.min(c.open, c.close));
          const bodyH = Math.max(round2(bodyBottom - bodyTop), 1.5);
          const isSelected = i === effectiveSelected;
          return (
            <g key={c.label}>
              <line
                x1={cx}
                x2={cx}
                y1={yFor(c.high)}
                y2={yFor(c.low)}
                stroke={isUp ? "var(--color-emerald-600)" : "var(--color-rose-600)"}
                strokeWidth="1"
              />
              <rect
                x={round2(cx - bodyW / 2)}
                y={round2(bodyTop)}
                width={bodyW}
                height={bodyH}
                fill={isUp ? "white" : "var(--color-rose-600)"}
                stroke={isUp ? "var(--color-emerald-600)" : "var(--color-rose-600)"}
                strokeWidth="1.3"
              />
              {isSelected ? (
                <rect
                  x={round2(MARGIN.left + slotW * i + 1)}
                  y={MARGIN.top}
                  width={round2(slotW - 2)}
                  height={PLOT_H}
                  fill="none"
                  stroke="var(--color-zinc-400)"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
              ) : null}
            </g>
          );
        })}

        {maPath ? <path d={maPath} fill="none" stroke="var(--color-zinc-500)" strokeWidth="1.5" strokeDasharray="6 4" /> : null}

        {candles.map((c, i) => {
          if (i % labelStep !== 0 && i !== n - 1) return null;
          return (
            <text key={`lbl-${c.label}`} x={xCenter(i)} y={VIEW_H - 6} textAnchor="middle" className="fill-zinc-500" style={{ fontSize: "10px" }}>
              {c.label}
            </text>
          );
        })}

        {effectiveHover != null ? (
          <line
            x1={xCenter(effectiveHover)}
            x2={xCenter(effectiveHover)}
            y1={MARGIN.top}
            y2={MARGIN.top + PLOT_H}
            stroke="var(--color-zinc-400)"
            strokeDasharray="2 3"
            strokeWidth="1"
          />
        ) : null}

        {/* Hit targets: one focusable, clickable rect per candle for hover/focus tooltip + click-to-select. */}
        {candles.map((c, i) => (
          <rect
            key={`hit-${c.label}`}
            x={round2(MARGIN.left + slotW * i)}
            y={MARGIN.top}
            width={round2(slotW)}
            height={PLOT_H}
            fill="transparent"
            tabIndex={0}
            role="button"
            aria-label={`Candle ${c.label}: open ${formatPrice(c.open, decimals)}, high ${formatPrice(c.high, decimals)}, low ${formatPrice(c.low, decimals)}, close ${formatPrice(c.close, decimals)}`}
            className={FOCUS_RING}
            onMouseEnter={() => setHoverIndex(i)}
            onFocus={() => setHoverIndex(i)}
            onBlur={() => setHoverIndex(null)}
            onClick={() => setSelectedIndex(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedIndex(i);
              }
            }}
          />
        ))}

        {hovered ? (
          <g transform={`translate(${tooltipX}, ${tooltipY})`}>
            <rect width={tooltipW} height={tooltipH} rx="6" fill="white" stroke="var(--color-zinc-200)" strokeWidth="1" />
            <text x="10" y="18" className="fill-zinc-900" style={{ fontSize: "11px", fontWeight: 600 }}>
              {hovered.label}
            </text>
            <text x="10" y="36" className="fill-zinc-600" style={{ fontSize: "10px" }}>
              O {formatPrice(hovered.open, decimals)}
            </text>
            <text x="10" y="50" className="fill-zinc-600" style={{ fontSize: "10px" }}>
              H {formatPrice(hovered.high, decimals)}
            </text>
            <text x="10" y="64" className="fill-zinc-600" style={{ fontSize: "10px" }}>
              L {formatPrice(hovered.low, decimals)}
            </text>
            <text x="10" y="78" className="fill-zinc-600" style={{ fontSize: "10px" }}>
              C {formatPrice(hovered.close, decimals)}
            </text>
          </g>
        ) : null}
      </svg>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-t border-zinc-100 pt-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-normal text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[2px] border border-emerald-600 bg-white" aria-hidden="true" />
            Up (hollow)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[2px] bg-rose-600" aria-hidden="true" />
            Down (filled)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="20" height="8" aria-hidden="true">
              <line x1="0" y1="4" x2="20" y2="4" stroke="var(--color-zinc-500)" strokeWidth="1.5" strokeDasharray="5 3" />
            </svg>
            5-candle MA (dashed)
          </span>
        </div>
        <p className="font-medium text-xs tabular-nums text-zinc-700">
          Selected {candles[effectiveSelected].label} · O {formatPrice(candles[effectiveSelected].open, decimals)} · H{" "}
          {formatPrice(candles[effectiveSelected].high, decimals)} · L {formatPrice(candles[effectiveSelected].low, decimals)} · C{" "}
          {formatPrice(candles[effectiveSelected].close, decimals)}
        </p>
      </div>
    </div>
  );
}
