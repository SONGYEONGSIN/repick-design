"use client";

import { useId, useRef } from "react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { PricePoint, WindowPreset } from "./data";
import {
  clamp,
  computeSegment,
  formatUsd,
  headlineMetric,
  headlineText,
  indexFromFrac,
  monthLabel,
  windowSegments,
  xFrac,
  MAX_PRICE,
  MIN_PRICE,
  type SegmentStats,
  type TimelineWindow,
  type Trend,
} from "./model";
import { ACCENT_BORDER, ACCENT_FILL, ACCENT_HEX, ACCENT_TEXT, FOCUS_RING, MUTED_HEX, MUTED_TEXT, ON_ACCENT_FILL_TEXT, PROSE_WIDTH, STAT_LABEL, SURFACE_BORDER } from "./tokens";

type DragMode = "move" | "resize-start" | "resize-end" | null;

const VIEW_W = 1000;
const VIEW_H = 300;

function priceToY(price: number): number {
  const padTop = 36;
  const padBottom = 36;
  const span = MAX_PRICE - MIN_PRICE || 1;
  const t = (price - MIN_PRICE) / span;
  return VIEW_H - padBottom - t * (VIEW_H - padTop - padBottom);
}

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />;
  return <Minus className="h-3.5 w-3.5" aria-hidden="true" />;
}

function trendLabel(stats: SegmentStats | null): string {
  if (!stats) return "No months here";
  if (stats.trend === "flat" || stats.count < 2) return "flat";
  const sign = stats.deltaPct > 0 ? "+" : "";
  return `${sign}${stats.deltaPct}%`;
}

function SegmentCard({ title, stats }: { title: string; stats: SegmentStats | null }) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 rounded-xl border ${SURFACE_BORDER} p-4`}>
      <p className={`${STAT_LABEL} ${MUTED_TEXT}`}>{title}</p>
      {stats ? (
        <>
          <p className="text-[22px] font-extrabold tabular-nums leading-none">{formatUsd(stats.avgPrice)}</p>
          <div className={`flex items-center gap-1.5 text-[13px] font-normal ${MUTED_TEXT}`}>
            <TrendIcon trend={stats.trend} />
            <span>{trendLabel(stats)}</span>
            <span aria-hidden="true">·</span>
            <span>
              {stats.count} {stats.count === 1 ? "month" : "months"}
            </span>
          </div>
        </>
      ) : (
        <p className={`text-[13px] font-normal ${MUTED_TEXT}`}>No months here</p>
      )}
    </div>
  );
}

export interface TimelineBrushProps {
  data: readonly PricePoint[];
  window: TimelineWindow;
  onChange: (next: TimelineWindow) => void;
  minWindow: number;
  presets: readonly WindowPreset[];
}

export default function TimelineBrush({ data, window: win, onChange, minWindow, presets }: TimelineBrushProps) {
  const instructionsId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragMode = useRef<DragMode>(null);
  const dragAnchor = useRef<{ clientX: number; start: number; end: number }>({ clientX: 0, start: 0, end: 0 });

  const n = data.length;
  const { before, inside, after } = windowSegments(data, win);
  const beforeStats = computeSegment(before);
  const insideStats = computeSegment(inside);
  const afterStats = computeSegment(after);
  const metric = headlineMetric(data, win);

  function getFrac(clientX: number): number {
    const el = containerRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return 0;
    return clamp((clientX - rect.left) / rect.width, 0, 1);
  }

  function beginDrag(mode: DragMode, el: Element, pointerId: number, clientX: number) {
    dragMode.current = mode;
    dragAnchor.current = { clientX, start: win.start, end: win.end };
    try {
      el.setPointerCapture(pointerId);
    } catch {
      // pointer capture is best-effort; dragging still works without it in most browsers
    }
  }

  function handleMove(clientX: number) {
    const mode = dragMode.current;
    if (!mode) return;
    const anchor = dragAnchor.current;
    if (mode === "move") {
      const idx0 = indexFromFrac(getFrac(anchor.clientX), n);
      const idx1 = indexFromFrac(getFrac(clientX), n);
      const deltaIdx = idx1 - idx0;
      const span = anchor.end - anchor.start;
      const newStart = clamp(anchor.start + deltaIdx, 0, n - 1 - span);
      onChange({ start: newStart, end: newStart + span });
    } else if (mode === "resize-start") {
      const idx = clamp(indexFromFrac(getFrac(clientX), n), 0, win.end - minWindow + 1);
      if (idx !== win.start) onChange({ start: idx, end: win.end });
    } else if (mode === "resize-end") {
      const idx = clamp(indexFromFrac(getFrac(clientX), n), win.start + minWindow - 1, n - 1);
      if (idx !== win.end) onChange({ start: win.start, end: idx });
    }
  }

  function onBodyPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    beginDrag("move", e.currentTarget, e.pointerId, e.clientX);
  }
  function onLeftHandlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.preventDefault();
    beginDrag("resize-start", e.currentTarget, e.pointerId, e.clientX);
  }
  function onRightHandlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    e.preventDefault();
    beginDrag("resize-end", e.currentTarget, e.pointerId, e.clientX);
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    // Captured pointer events still bubble from the handle that captured them up through this
    // component's own tree, so this is attached to all three elements (body + both handles) but
    // stopped here to avoid handling the same move twice when it bubbles from a handle.
    e.stopPropagation();
    if (dragMode.current) handleMove(e.clientX);
  }
  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    dragMode.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // already released or never captured -- nothing to clean up
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const span = win.end - win.start;
    if (e.shiftKey && e.key === "ArrowRight") {
      e.preventDefault();
      onChange({ start: win.start, end: clamp(win.end + 1, win.start + minWindow - 1, n - 1) });
    } else if (e.shiftKey && e.key === "ArrowLeft") {
      e.preventDefault();
      onChange({ start: win.start, end: clamp(win.end - 1, win.start + minWindow - 1, n - 1) });
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const newStart = clamp(win.start + 1, 0, n - 1 - span);
      onChange({ start: newStart, end: newStart + span });
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const newStart = clamp(win.start - 1, 0, n - 1 - span);
      onChange({ start: newStart, end: newStart + span });
    } else if (e.key === "Home") {
      e.preventDefault();
      onChange({ start: 0, end: span });
    } else if (e.key === "End") {
      e.preventDefault();
      onChange({ start: n - 1 - span, end: n - 1 });
    }
  }

  const linePath = data.map((p, i) => `${i === 0 ? "M" : "L"}${(xFrac(i, n) * VIEW_W).toFixed(1)},${priceToY(p.price).toFixed(1)}`).join(" ");
  const highlightPoints = data.slice(win.start, win.end + 1);
  const highlightPath = highlightPoints
    .map((p, j) => `${j === 0 ? "M" : "L"}${(xFrac(win.start + j, n) * VIEW_W).toFixed(1)},${priceToY(p.price).toFixed(1)}`)
    .join(" ");

  const leftPct = xFrac(win.start, n) * 100;
  const rightPct = xFrac(win.end, n) * 100;
  const widthPct = rightPct - leftPct;

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-[clamp(1.3rem,1.6vw+0.9rem,1.7rem)] font-extrabold tracking-[-0.01em]">Where did the price move?</h2>
        <p className={`${STAT_LABEL} ${MUTED_TEXT}`}>Sony a7 III · 24 months on repick</p>
      </div>

      {/* 13px caption: chars-per-line = 400 / (0.44*13) = 69.9, inside the 70-char target --
          a different max-width than the 16px body copy's 500px, computed for this font size. */}
      <p id={instructionsId} className={`mt-2 max-w-[400px] text-[13px] font-normal leading-[1.6] ${MUTED_TEXT}`}>
        Drag the highlighted window, or its edges to resize it. Or focus it and use the arrow keys —
        hold Shift and press an arrow key to resize instead of move.
      </p>

      {/* Preset jumps -- a second, fully keyboard- and screen-reader-friendly way to set the
          window, independent of the drag gesture. */}
      <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Jump the window to a preset range">
        {presets.map((preset) => {
          const active = win.start === preset.start && win.end === preset.end;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange({ start: preset.start, end: preset.end })}
              aria-current={active ? "true" : undefined}
              className={`${FOCUS_RING} rounded-full border px-3 py-2 text-[12px] font-semibold transition-colors ${
                active ? `${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} border-transparent` : `${SURFACE_BORDER} ${MUTED_TEXT}`
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Chart + draggable brush. The SVG is purely decorative (aria-hidden): the real state is
          exposed through the slider's aria-valuetext below and the live comparison panel. */}
      <div ref={containerRef} className="relative mt-5 h-[220px] w-full select-none sm:h-[260px] lg:h-[300px]">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path d={linePath} fill="none" stroke={MUTED_HEX} strokeOpacity={0.5} strokeWidth={2} />
          <path d={highlightPath} fill="none" stroke={ACCENT_HEX} strokeWidth={3} />
          {data.map((p, i) => {
            const isInside = i >= win.start && i <= win.end;
            return (
              <circle
                key={i}
                cx={xFrac(i, n) * VIEW_W}
                cy={priceToY(p.price)}
                r={isInside ? 5 : 3}
                fill={isInside ? ACCENT_HEX : MUTED_HEX}
                opacity={isInside ? 1 : 0.45}
              />
            );
          })}
        </svg>

        <div
          role="slider"
          tabIndex={0}
          aria-orientation="horizontal"
          aria-label="Price history selection window"
          aria-describedby={instructionsId}
          aria-valuemin={0}
          aria-valuemax={n - 1}
          aria-valuenow={win.start}
          aria-valuetext={`${monthLabel(win.start)} to ${monthLabel(win.end)}, ${win.end - win.start + 1} months selected`}
          onKeyDown={onKeyDown}
          onPointerDown={onBodyPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className={`${FOCUS_RING} absolute top-0 bottom-0 cursor-grab touch-none rounded-lg border-2 ${ACCENT_BORDER} bg-[#818CF8]/15 active:cursor-grabbing`}
          style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 0)}%` }}
        >
          <div
            aria-hidden="true"
            onPointerDown={onLeftHandlePointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="absolute bottom-0 top-0 -left-3 flex w-6 cursor-ew-resize items-center justify-center touch-none"
          >
            <span className="h-[60%] w-1 rounded-full bg-[#818CF8]" />
          </div>
          <div
            aria-hidden="true"
            onPointerDown={onRightHandlePointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="absolute bottom-0 top-0 -right-3 flex w-6 cursor-ew-resize items-center justify-center touch-none"
          >
            <span className="h-[60%] w-1 rounded-full bg-[#818CF8]" />
          </div>
        </div>
      </div>

      <div className="mt-1 flex justify-between text-[11px] font-normal tabular-nums">
        <span className={MUTED_TEXT}>{monthLabel(0)}</span>
        <span className={MUTED_TEXT}>{monthLabel(n - 1)}</span>
      </div>

      {/* Live comparison panel -- this candidate's proof. Recomputes on every drag step and every
          keyboard step, from the same `win` state the SVG and the handle use. */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3" aria-live="polite">
        <SegmentCard title="Before window" stats={beforeStats} />
        <SegmentCard title="Inside window" stats={insideStats} />
        <SegmentCard title="After window" stats={afterStats} />
      </div>

      <p className={`mt-4 ${PROSE_WIDTH} text-[16px] font-normal leading-[1.6]`} aria-live="polite">
        {headlineText(metric)
          .split(/(\$[0-9,]+)/)
          .map((part, i) => (part.startsWith("$") ? <span key={i} className={`${ACCENT_TEXT} font-semibold`}>{part}</span> : <span key={i}>{part}</span>))}
      </p>
    </div>
  );
}
