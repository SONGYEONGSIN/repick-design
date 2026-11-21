"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, FocusEvent as ReactFocusEvent } from "react";
import type { ApiKey } from "./data";
import { endpointLabel, formatNumber, hourLabel, hourRangeLabel, intensityBin, peakCell } from "./data";
import { FOCUS } from "./ui";

interface Cell {
  rowIndex: number;
  hour: number;
}

const COLS = 24;
const CELL = 22;
const GAP = 2;
const LABEL_W = 152;
const HEADER_H = 20;

const BIN_FILL = ["fill-zinc-50", "fill-emerald-100", "fill-emerald-300", "fill-emerald-500", "fill-emerald-700", "fill-emerald-900"];
const BIN_STROKE = ["stroke-zinc-200", "stroke-emerald-200", "stroke-emerald-400", "stroke-emerald-600", "stroke-emerald-800", "stroke-emerald-950"];
const BIN_STROKE_WIDTH = [1, 1, 1.25, 1.5, 1.75, 2];
const BIN_LEGEND_BG = ["bg-zinc-50", "bg-emerald-100", "bg-emerald-300", "bg-emerald-500", "bg-emerald-700", "bg-emerald-900"];
const BIN_LEGEND_BORDER = [
  "border border-zinc-200",
  "border border-emerald-200",
  "border-[1.5px] border-emerald-400",
  "border-2 border-emerald-600",
  "border-2 border-emerald-800",
  "border-[2.5px] border-emerald-950",
];

/** Rounds to 2 decimal places — every coordinate the grid below computes is passed through this,
 * so the generated SVG markup is fully deterministic (no sub-float drift between server and client
 * renders) even though the current cell/label geometry happens to resolve to whole numbers. */
function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Hour-of-day × endpoint request-volume heatmap for one API key, drawn as a single generative SVG
 * (every cell/label coordinate computed from `CELL`/`LABEL_W`/`HEADER_H` and rounded via `r2`).
 *
 * `hovered` is a completely separate, self-contained piece of state from the rail's `pinnedKeyId`
 * (owned by the parent) — it lives entirely inside this component, is never passed up, and feeds
 * nothing but the crosshair dimming below and the one shared `aria-live` readout rendered at the
 * bottom of this same component. Hovering or keyboard-focusing a cell changes no other widget on the
 * page: not the rail, not the Key overview card, not the pinned key. Mounting this component with
 * `key={apiKey.id}` (done by the caller) resets this local state cleanly whenever the pinned key
 * changes, instead of needing an effect to reconcile row indices across keys with a different number
 * of scoped endpoints.
 *
 * No cell renders any visible numeric text — not even one wrapped in `aria-hidden`. The exact value
 * is exposed only through each cell's `aria-label` and the shared crosshair caption, which avoids the
 * `label-content-name-mismatch` failure a visible-but-differently-formatted number would trigger.
 */
export function Heatmap({ apiKey }: { apiKey: ApiKey }) {
  const [hovered, setHovered] = useState<Cell | null>(null);
  const refs = useRef<Map<string, SVGRectElement>>(new Map());
  const clipId = useId();

  const rows = apiKey.scope.length;
  const peak = peakCell(apiKey.matrix);
  const max = peak.value;
  const active = hovered ?? { rowIndex: 0, hour: 0 };

  const width = r2(LABEL_W + COLS * CELL);
  const height = r2(HEADER_H + rows * CELL);

  function cellKey(r: number, h: number) {
    return `${r}-${h}`;
  }

  function focusCell(r: number, h: number) {
    refs.current.get(cellKey(r, h))?.focus();
  }

  function onCellKeyDown(e: ReactKeyboardEvent<SVGRectElement>, r: number, h: number) {
    let nr = r;
    let nh = h;
    if (e.key === "ArrowRight") nh = Math.min(COLS - 1, h + 1);
    else if (e.key === "ArrowLeft") nh = Math.max(0, h - 1);
    else if (e.key === "ArrowDown") nr = Math.min(rows - 1, r + 1);
    else if (e.key === "ArrowUp") nr = Math.max(0, r - 1);
    else if (e.key === "Home") nh = 0;
    else if (e.key === "End") nh = COLS - 1;
    else return;
    e.preventDefault();
    focusCell(nr, nh);
  }

  function onGridBlur(e: ReactFocusEvent<SVGSVGElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovered(null);
  }

  const readout = hovered
    ? `${endpointLabel(apiKey.scope[hovered.rowIndex])} — ${hourRangeLabel(hovered.hour)}: ${formatNumber(
        apiKey.matrix[hovered.rowIndex][hovered.hour],
      )} requests`
    : "Hover or use the arrow keys on the grid to inspect hourly traffic for each endpoint.";

  return (
    <div>
      {max <= 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-sm font-normal text-zinc-600">
          No requests recorded yet for this key.
        </p>
      ) : (
        <>
          <div className="min-w-0" style={{ aspectRatio: `${width} / ${height}` }}>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              role="group"
              aria-label={`Hourly request volume by endpoint for ${apiKey.name}`}
              onMouseLeave={() => setHovered(null)}
              onBlur={onGridBlur}
              className="block h-full w-full min-w-0"
            >
              <clipPath id={`${clipId}-label`}>
                <rect x={0} y={0} width={r2(LABEL_W - 10)} height={height} />
              </clipPath>

              <g aria-hidden="true">
                {Array.from({ length: COLS }, (_, h) =>
                  h % 3 === 0 ? (
                    <text
                      key={`head-${h}`}
                      x={r2(LABEL_W + h * CELL + CELL / 2)}
                      y={r2(HEADER_H - 7)}
                      textAnchor="middle"
                      className="select-none fill-zinc-500 text-[9px] font-normal"
                    >
                      {hourLabel(h)}
                    </text>
                  ) : null,
                )}
              </g>

              <g clipPath={`url(#${clipId}-label)`}>
                {apiKey.scope.map((endpointId, r) => (
                  <text
                    key={`label-${endpointId}`}
                    x={8}
                    y={r2(HEADER_H + r * CELL + CELL / 2 + 3)}
                    className="select-none fill-zinc-600 font-mono text-[11px] font-normal"
                  >
                    {endpointLabel(endpointId)}
                  </text>
                ))}
              </g>

              {apiKey.scope.map((endpointId, r) =>
                apiKey.matrix[r].map((value, h) => {
                  const bin = intensityBin(value, max);
                  const isPeak = r === peak.rowIndex && h === peak.hour;
                  const isCrosshair = hovered ? hovered.rowIndex === r || hovered.hour === h : false;
                  const dim = hovered ? !(isPeak || isCrosshair) : false;
                  return (
                    <rect
                      key={`cell-${endpointId}-${h}`}
                      ref={(el) => {
                        if (el) refs.current.set(cellKey(r, h), el);
                        else refs.current.delete(cellKey(r, h));
                      }}
                      x={r2(LABEL_W + h * CELL + GAP / 2)}
                      y={r2(HEADER_H + r * CELL + GAP / 2)}
                      width={r2(CELL - GAP)}
                      height={r2(CELL - GAP)}
                      rx={2}
                      tabIndex={r === active.rowIndex && h === active.hour ? 0 : -1}
                      role="button"
                      aria-label={`${endpointLabel(endpointId)}, ${hourRangeLabel(h)}: ${formatNumber(value)} requests`}
                      onMouseEnter={() => setHovered({ rowIndex: r, hour: h })}
                      onFocus={() => setHovered({ rowIndex: r, hour: h })}
                      onKeyDown={(e) => onCellKeyDown(e, r, h)}
                      strokeWidth={BIN_STROKE_WIDTH[bin]}
                      className={`${FOCUS} cursor-pointer transition-opacity motion-reduce:transition-none ${BIN_FILL[bin]} ${BIN_STROKE[bin]} ${
                        dim ? "opacity-40" : "opacity-100"
                      }`}
                    />
                  );
                }),
              )}
            </svg>
          </div>

          <div className="mt-3 flex min-w-0 flex-wrap items-center gap-3">
            <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">
              Requests / hour
            </span>
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {["None", "Light", "Moderate", "Busy", "Heavy", "Peak"].map((label, i) => (
                <span key={label} className="flex items-center gap-1">
                  <span aria-hidden="true" className={`block h-2.5 w-2.5 rounded-[2px] ${BIN_LEGEND_BG[i]} ${BIN_LEGEND_BORDER[i]}`} />
                  <span className="whitespace-nowrap text-[11px] font-normal text-zinc-600">{label}</span>
                </span>
              ))}
            </div>
            <span className="shrink-0 whitespace-nowrap font-mono text-[11px] font-normal tabular-nums text-zinc-600">
              Peak: {formatNumber(max)} req at {endpointLabel(apiKey.scope[peak.rowIndex])}, {hourRangeLabel(peak.hour)}
            </span>
          </div>

          <p role="status" aria-live="polite" className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-normal text-zinc-700">
            {readout}
          </p>
        </>
      )}
    </div>
  );
}
