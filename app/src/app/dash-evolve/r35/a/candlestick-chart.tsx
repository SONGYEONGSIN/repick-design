"use client";

import { useRef, useState } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { Candle } from "./data";
import { formatPercent, formatPrice } from "./data";
import { cx, CROSSHAIR_HEX, DOWN_HEX, FOCUS, GRID_HEX, NUM, round2, TEXT_AUX, TEXT_PRIMARY, UP_HEX } from "./tokens";

const VIEW_W = 760;
const VIEW_H = 280;
const AXIS_H = 22;
const PLOT_H = VIEW_H - AXIS_H;

type InputMode = "mouse" | "keyboard" | null;

/**
 * The ephemeral half of the page's split selection axis: hover or keyboard-focus a candle and a
 * crosshair + tooltip appear, but no state outside this component ever changes. Compare to pinning
 * a feed signal (fluxgate-client.tsx), which deliberately *does* persist and *does* reach another
 * widget. Up/down is never color-only — the body is solid-filled when the close is at or above the
 * open and hollow (stroke only) when it is below, independent of the emerald/rose hue, and the exact
 * +/- change is always printed as text in the tooltip and the persistent header above this chart.
 */
export function CandlestickChart({ candles, instrumentName }: { candles: Candle[]; instrumentName: string }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const displayIndex = inputMode === "keyboard" ? focusIndex : inputMode === "mouse" ? hoverIndex : null;

  const lows = candles.map((c) => c.low);
  const highs = candles.map((c) => c.high);
  const domainMin = Math.min(...lows);
  const domainMax = Math.max(...highs);
  const domainRange = domainMax - domainMin || 1;
  const pad = domainRange * 0.08;
  const yMin = domainMin - pad;
  const yMax = domainMax + pad;

  const step = VIEW_W / candles.length;
  const bodyWidth = Math.min(Math.max(step * 0.58, 3), 20);

  function scaleY(price: number): number {
    return round2(PLOT_H - ((price - yMin) / (yMax - yMin)) * PLOT_H);
  }

  const geometry = candles.map((c, i) => {
    const xCenter = round2(step * (i + 0.5));
    const isUp = c.close >= c.open;
    const yOpen = scaleY(c.open);
    const yClose = scaleY(c.close);
    const yHigh = scaleY(c.high);
    const yLow = scaleY(c.low);
    const bodyTop = round2(Math.min(yOpen, yClose));
    const bodyHeight = round2(Math.max(Math.abs(yOpen - yClose), 1.5));
    return { ...c, i, xCenter, isUp, yHigh, yLow, bodyTop, bodyHeight };
  });

  function indexFromClientX(clientX: number): number {
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return candles.length - 1;
    const frac = (clientX - rect.left) / rect.width;
    return Math.min(candles.length - 1, Math.max(0, Math.floor(frac * candles.length)));
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    setInputMode("mouse");
    setHoverIndex(indexFromClientX(e.clientX));
  }
  function handleMouseLeave() {
    setInputMode((m) => (m === "mouse" ? null : m));
    setHoverIndex(null);
  }
  function handleFocus() {
    setInputMode("keyboard");
    setFocusIndex((prev) => prev ?? candles.length - 1);
  }
  function handleBlur() {
    setInputMode((m) => (m === "keyboard" ? null : m));
    setFocusIndex(null);
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    setInputMode("keyboard");
    setFocusIndex((prev) => {
      const current = prev ?? candles.length - 1;
      if (e.key === "ArrowLeft") return Math.max(0, current - 1);
      if (e.key === "ArrowRight") return Math.min(candles.length - 1, current + 1);
      if (e.key === "Home") return 0;
      return candles.length - 1;
    });
  }

  const active = displayIndex !== null ? geometry[displayIndex] : null;
  const ariaIndex = displayIndex ?? candles.length - 1;
  const ariaCandle = candles[ariaIndex];
  const leftPct = round2(((ariaIndex + 0.5) / candles.length) * 100);
  const tooltipAlign = leftPct < 18 ? "left" : leftPct > 82 ? "right" : "center";

  const firstLabel = candles[0]?.label ?? "";
  const lastLabel = candles[candles.length - 1]?.label ?? "";
  const midLabel = candles[Math.floor((candles.length - 1) / 2)]?.label ?? "";

  return (
    <div className="relative select-none" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}`, minHeight: 180 }}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" className="h-full w-full overflow-visible">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={0} y1={round2(PLOT_H * f)} x2={VIEW_W} y2={round2(PLOT_H * f)} stroke={GRID_HEX} strokeWidth={1} />
        ))}

        {geometry.map((c) => (
          <g key={c.index}>
            <line x1={c.xCenter} y1={c.yHigh} x2={c.xCenter} y2={c.yLow} stroke={c.isUp ? UP_HEX : DOWN_HEX} strokeWidth={1} />
            <rect
              x={round2(c.xCenter - bodyWidth / 2)}
              y={c.bodyTop}
              width={round2(bodyWidth)}
              height={c.bodyHeight}
              rx={1}
              fill={c.isUp ? UP_HEX : "none"}
              fillOpacity={c.isUp ? 0.9 : 1}
              stroke={c.isUp ? "none" : DOWN_HEX}
              strokeWidth={c.isUp ? 0 : 1.5}
            />
          </g>
        ))}

        {active ? (
          <line x1={active.xCenter} y1={0} x2={active.xCenter} y2={PLOT_H} stroke={CROSSHAIR_HEX} strokeWidth={1} strokeDasharray="3,3" />
        ) : null}

        <text x={0} y={VIEW_H - 6} fontSize={11} fill="#a1a1aa">
          {firstLabel}
        </text>
        <text x={VIEW_W / 2} y={VIEW_H - 6} fontSize={11} fill="#a1a1aa" textAnchor="middle">
          {midLabel}
        </text>
        <text x={VIEW_W} y={VIEW_H - 6} fontSize={11} fill="#a1a1aa" textAnchor="end">
          {lastLabel}
        </text>
      </svg>

      {/* Accessible control layer: a single focusable "slider" standing in for every candle, since
          24-30 individually tabbable buttons would both clutter the tab order and fail target-size
          at the narrow end. Arrow keys move it; aria-valuetext carries the full OHLC reading so a
          screen reader gets the same inspection a sighted hover gets, without needing the tooltip. */}
      <div
        ref={overlayRef}
        role="slider"
        tabIndex={0}
        aria-label={`${instrumentName} price candle inspector`}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={candles.length - 1}
        aria-valuenow={ariaIndex}
        aria-valuetext={`${ariaCandle.label}: open ${formatPrice(ariaCandle.open)}, high ${formatPrice(ariaCandle.high)}, low ${formatPrice(ariaCandle.low)}, close ${formatPrice(ariaCandle.close)}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cx("absolute inset-0 cursor-crosshair rounded-md", FOCUS)}
      />

      {active ? (
        <div
          aria-hidden="true"
          style={{ left: `${leftPct}%` }}
          className={cx(
            "pointer-events-none absolute top-1 w-44 rounded-lg border border-white/10 bg-zinc-900/95 p-2.5 shadow-lg shadow-black/40 backdrop-blur-sm",
            "motion-safe:transition-opacity motion-safe:duration-100",
            tooltipAlign === "center" && "-translate-x-1/2",
            tooltipAlign === "right" && "-translate-x-full",
          )}
        >
          <p className={cx("text-[11px] font-medium", TEXT_AUX)}>{active.label}</p>
          <dl className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11.5px]">
            <dt className={TEXT_AUX}>Open</dt>
            <dd className={cx("text-right", NUM, TEXT_PRIMARY)}>{formatPrice(active.open)}</dd>
            <dt className={TEXT_AUX}>High</dt>
            <dd className={cx("text-right", NUM, TEXT_PRIMARY)}>{formatPrice(active.high)}</dd>
            <dt className={TEXT_AUX}>Low</dt>
            <dd className={cx("text-right", NUM, TEXT_PRIMARY)}>{formatPrice(active.low)}</dd>
            <dt className={TEXT_AUX}>Close</dt>
            <dd className={cx("text-right", NUM, TEXT_PRIMARY)}>{formatPrice(active.close)}</dd>
          </dl>
          <TooltipChange open={active.open} close={active.close} />
        </div>
      ) : null}

      <p className="sr-only">
        {instrumentName} candlestick chart, {candles.length} periods from {firstLabel} to {lastLabel}. Latest close {formatPrice(candles[candles.length - 1].close)}. Focus the chart and use the arrow keys to inspect each period&apos;s open, high, low and close.
      </p>
    </div>
  );
}

function TooltipChange({ open, close }: { open: number; close: number }) {
  const pct = round2(((close - open) / open) * 100);
  const isZero = Math.abs(pct) < 0.05;
  const Icon = isZero ? Minus : pct > 0 ? TrendingUp : TrendingDown;
  const color = isZero ? "text-zinc-400" : pct > 0 ? "text-emerald-400" : "text-rose-400";
  return (
    <p className={cx("mt-1.5 flex items-center gap-1 border-t border-white/10 pt-1.5 text-[11.5px] font-medium", NUM, color)}>
      <Icon aria-hidden="true" className="size-3" />
      {formatPercent(pct)} vs open
    </p>
  );
}
