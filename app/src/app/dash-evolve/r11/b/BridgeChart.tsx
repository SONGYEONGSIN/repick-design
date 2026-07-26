"use client";

import { ArrowDown, ArrowUp, Equal } from "lucide-react";
import { useMemo, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { BridgeBar, MetricId, StepKey } from "./data";
import { formatMetric, formatMetricSigned, round2 } from "./data";
import { BORDER, FOCUS_RING, SVG_FOCUS, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { NUM } from "./ui";

const VIEW_W = 880;
const VIEW_H = 380;
const PLOT_LEFT = 14;
const PLOT_RIGHT = 866;
const PLOT_TOP = 50;
const PLOT_BOTTOM = 300;
const BAR_RATIO = 0.56;

type BarGeom = {
  key: StepKey;
  xLeft: number;
  width: number;
  yTop: number;
  yBottom: number;
  center: number;
  labelY: number;
};

function computeGeometry(bars: BridgeBar[]) {
  const n = bars.length;
  const plotW = PLOT_RIGHT - PLOT_LEFT;
  const plotH = PLOT_BOTTOM - PLOT_TOP;
  const slot = plotW / n;
  const barW = round2(slot * BAR_RATIO);

  const afterValues = bars.map((b) => b.cumulativeAfter);
  const minL = Math.min(...afterValues);
  const maxL = Math.max(...afterValues);
  const range = Math.max(maxL - minL, 1);
  const yFloor = minL - range * 0.22;
  const yTopVal = maxL + range * 0.16;
  const scale = plotH / (yTopVal - yFloor);
  const yOf = (v: number) => round2(PLOT_TOP + (yTopVal - v) * scale);

  const bars_: BarGeom[] = bars.map((b, i) => {
    const xLeft = round2(PLOT_LEFT + slot * i + (slot - barW) / 2);
    const center = round2(xLeft + barW / 2);
    let yTop: number;
    let yBottom: number;
    if (b.kind === "anchor") {
      yTop = yOf(b.cumulativeAfter);
      yBottom = yOf(yFloor);
    } else {
      const before = b.cumulativeBefore ?? b.cumulativeAfter;
      const yA = yOf(before);
      const yB = yOf(b.cumulativeAfter);
      yTop = Math.min(yA, yB);
      yBottom = Math.max(yA, yB);
    }
    if (yBottom - yTop < 3) yBottom = yTop + 3;
    return { key: b.key, xLeft, width: barW, yTop, yBottom, center, labelY: round2(yTop - 12) };
  });

  const connectors = bars.slice(0, -1).map((b, i) => {
    const y = yOf(b.cumulativeAfter);
    const from = bars_[i];
    const to = bars_[i + 1];
    return { x1: round2(from.xLeft + from.width), y1: y, x2: to.xLeft, y2: y };
  });

  const gridY = [0.22, 0.5, 0.78].map((t) => round2(PLOT_TOP + plotH * t));

  return { bars: bars_, connectors, gridY, slot, plotBottom: round2(yOf(yFloor)) };
}

export default function BridgeChart({
  bars,
  metric,
  selectedKey,
  onSelect,
}: {
  bars: BridgeBar[];
  metric: MetricId;
  selectedKey: StepKey;
  onSelect: (key: StepKey) => void;
}) {
  const geometry = useMemo(() => computeGeometry(bars), [bars]);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedBar = bars.find((b) => b.key === selectedKey) ?? bars[0];

  function moveTo(idx: number) {
    const clamped = Math.max(0, Math.min(bars.length - 1, idx));
    onSelect(bars[clamped].key);
    refs.current[clamped]?.focus();
  }

  function onKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      moveTo(idx + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveTo(idx - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      moveTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      moveTo(bars.length - 1);
    }
  }

  const readout =
    selectedBar.kind === "anchor"
      ? `${selectedBar.label}: ${formatMetric(metric, selectedBar.cumulativeAfter)} total.`
      : `${selectedBar.label}: ${formatMetricSigned(metric, selectedBar.signedValue)}. Running total ${formatMetric(metric, selectedBar.cumulativeAfter)}.`;

  return (
    <div>
      {/* Keyboard-accessible crosshair readout — always visible, updates on click or arrow-key roving focus. */}
      <div role="status" aria-live="polite" className={cx("mb-3 rounded-xl border px-3.5 py-2.5", BORDER, "bg-zinc-50 dark:bg-zinc-950/60")}>
        <p className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>Selected bar</p>
        <p className={cx("mt-0.5 text-sm font-medium", TEXT_PRIMARY, NUM)}>{readout}</p>
      </div>

      <div className="relative w-full" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none" role="img" aria-hidden="true" focusable="false">
          {geometry.gridY.map((y, i) => (
            <line key={i} x1={PLOT_LEFT} y1={y} x2={PLOT_RIGHT} y2={y} className="stroke-zinc-200 dark:stroke-white/10" strokeWidth={1} />
          ))}
          <line x1={PLOT_LEFT} y1={geometry.plotBottom} x2={PLOT_RIGHT} y2={geometry.plotBottom} className="stroke-zinc-300 dark:stroke-white/15" strokeWidth={1} />

          {geometry.connectors.map((c, i) => (
            <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} className="stroke-zinc-300 dark:stroke-white/25" strokeWidth={1.5} strokeDasharray="3 3" />
          ))}

          {geometry.bars.map((g, i) => {
            const bar = bars[i];
            const isSelected = bar.key === selectedKey;
            const fillClass =
              bar.kind === "positive"
                ? "fill-emerald-600 dark:fill-emerald-400"
                : bar.kind === "negative"
                  ? "fill-rose-600 dark:fill-rose-400"
                  : "fill-[#0F172A] dark:fill-slate-200";
            return (
              <g key={bar.key}>
                {isSelected ? (
                  <rect x={round2(PLOT_LEFT + geometry.slot * i)} y={PLOT_TOP - 8} width={round2(geometry.slot)} height={round2(PLOT_BOTTOM - PLOT_TOP + 16)} className="fill-[#A16207]/7 dark:fill-amber-400/8" />
                ) : null}
                <rect
                  x={g.xLeft}
                  y={g.yTop}
                  width={g.width}
                  height={round2(g.yBottom - g.yTop)}
                  rx={3}
                  className={cx(fillClass, isSelected ? "opacity-100" : "opacity-90")}
                />
                {bar.kind === "anchor" ? (
                  <g aria-hidden="true">
                    <line x1={round2(g.center - 9)} y1={round2(g.yBottom - 5)} x2={round2(g.center - 3)} y2={round2(g.yBottom - 15)} className="stroke-white dark:stroke-zinc-950" strokeWidth={3} strokeLinecap="round" />
                    <line x1={round2(g.center + 1)} y1={round2(g.yBottom - 5)} x2={round2(g.center + 7)} y2={round2(g.yBottom - 15)} className="stroke-white dark:stroke-zinc-950" strokeWidth={3} strokeLinecap="round" />
                  </g>
                ) : null}
              </g>
            );
          })}
        </svg>

        {/* HTML overlay: one focusable column per bar, roving tabindex, always-visible value + icon (not hover-only). */}
        <div role="group" aria-label="Revenue bridge bars — use Left/Right arrow keys to move between them" className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${bars.length}, 1fr)` }}>
          {bars.map((bar, i) => {
            const g = geometry.bars[i];
            const isSelected = bar.key === selectedKey;
            const Icon = bar.kind === "anchor" ? Equal : bar.kind === "positive" ? ArrowUp : ArrowDown;
            const toneText = bar.kind === "positive" ? "text-emerald-700 dark:text-emerald-300" : bar.kind === "negative" ? "text-rose-700 dark:text-rose-300" : "text-slate-900 dark:text-slate-50";
            const valueLabel = bar.kind === "anchor" ? formatMetric(metric, bar.cumulativeAfter, true) : formatMetricSigned(metric, bar.signedValue, true);
            return (
              <button
                key={bar.key}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                aria-pressed={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => onSelect(bar.key)}
                onKeyDown={(e) => onKeyDown(e, i)}
                aria-label={`${valueLabel} ${bar.label}${bar.kind === "anchor" ? "" : `, running total ${formatMetric(metric, bar.cumulativeAfter)}`}`}
                className={cx("relative h-full w-full cursor-pointer rounded-lg", TRANSITION, SVG_FOCUS, FOCUS_RING)}
              >
                <span
                  className={cx("pointer-events-none absolute left-1/2 flex -translate-x-1/2 -translate-y-full items-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-[11px] font-semibold shadow-sm", toneText, NUM, "bg-white/95 dark:bg-zinc-900/90", BORDER)}
                  style={{ top: `${(g.labelY / VIEW_H) * 100}%` }}
                >
                  <Icon size={11} aria-hidden="true" />
                  {valueLabel}
                </span>
                <span className={cx("pointer-events-none absolute bottom-1 left-1/2 w-full -translate-x-1/2 px-1 text-center text-[11px] font-medium leading-tight", TEXT_SECONDARY)}>{bar.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className={cx("mt-2 text-[11px] leading-snug", TEXT_CAPTION)}>
        Baseline is truncated (⁄⁄ break mark on total bars) to keep period-over-period deltas legible — every bar still shows its own value directly, never hover-only. Use ← → to move between bars.
      </p>

      {/* Required a11y fallback (charts.catalog: Waterfall → running-total table + directional icons). */}
      <div className="sr-only">
        <table>
          <caption>{`Revenue bridge running totals, ${bars[0]?.label ?? ""} to ${bars[bars.length - 1]?.label ?? ""}`}</caption>
          <thead>
            <tr>
              <th scope="col">Driver</th>
              <th scope="col">Change</th>
              <th scope="col">Direction</th>
              <th scope="col">Running total</th>
            </tr>
          </thead>
          <tbody>
            {bars.map((b) => (
              <tr key={b.key}>
                <td>{b.label}</td>
                <td>{b.kind === "anchor" ? "—" : formatMetricSigned(metric, b.signedValue)}</td>
                <td>{b.kind === "anchor" ? "Total" : b.kind === "positive" ? "Increase" : "Decrease"}</td>
                <td>{formatMetric(metric, b.cumulativeAfter)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
