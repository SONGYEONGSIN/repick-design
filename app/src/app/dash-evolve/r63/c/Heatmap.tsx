"use client";

import { Fragment, useRef, useState } from "react";
import type { ApiKey } from "./data";
import { endpointLabel, formatNumber, hourLabel, hourRangeLabel, intensityBin, peakCell } from "./data";
import { FOCUS } from "./ui";

interface Cell {
  rowIndex: number;
  hour: number;
}

const BIN_FILL = [
  "bg-zinc-50",
  "bg-emerald-100",
  "bg-emerald-300",
  "bg-emerald-500",
  "bg-emerald-700",
  "bg-emerald-900",
];
const BIN_BORDER = [
  "border border-zinc-200",
  "border border-emerald-200",
  "border-[1.5px] border-emerald-400",
  "border-2 border-emerald-600",
  "border-2 border-emerald-800",
  "border-[2.5px] border-emerald-950",
];

/**
 * Hour-of-day × endpoint request-volume heatmap for one API key.
 *
 * `hovered` is a completely separate, self-contained piece of state from the rail's `pinnedKeyId`
 * (owned by the parent) — it lives entirely inside this component, is never passed up, and feeds
 * nothing but the crosshair readout rendered at the bottom of this same component. Hovering or
 * keyboard-focusing a cell changes no other widget on the page: not the rail, not the Key overview
 * card, not the pinned key. Mounting this component with `key={apiKey.id}` (done by the caller)
 * resets this local state cleanly whenever the pinned key changes, instead of needing an effect to
 * reconcile row indices across two keys with a different number of scoped endpoints.
 */
export function Heatmap({ apiKey }: { apiKey: ApiKey }) {
  const [hovered, setHovered] = useState<Cell | null>(null);
  const refs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const rows = apiKey.scope.length;
  const peak = peakCell(apiKey.matrix);
  const max = peak.value;
  const active = hovered ?? { rowIndex: 0, hour: 0 };

  function cellKey(r: number, h: number) {
    return `${r}-${h}`;
  }

  function focusCell(r: number, h: number) {
    refs.current.get(cellKey(r, h))?.focus();
  }

  function onCellKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, r: number, h: number) {
    let nr = r;
    let nh = h;
    if (e.key === "ArrowRight") nh = Math.min(23, h + 1);
    else if (e.key === "ArrowLeft") nh = Math.max(0, h - 1);
    else if (e.key === "ArrowDown") nr = Math.min(rows - 1, r + 1);
    else if (e.key === "ArrowUp") nr = Math.max(0, r - 1);
    else if (e.key === "Home") nh = 0;
    else if (e.key === "End") nh = 23;
    else return;
    e.preventDefault();
    focusCell(nr, nh);
  }

  function onGridBlur(e: React.FocusEvent<HTMLDivElement>) {
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
          <div
            role="group"
            aria-label={`Hourly request volume by endpoint for ${apiKey.name}`}
            onMouseLeave={() => setHovered(null)}
            onBlur={onGridBlur}
            className="min-w-0 p-0.5"
          >
            <div className="grid grid-cols-[84px_repeat(24,minmax(0,1fr))] gap-[2px] sm:grid-cols-[128px_repeat(24,minmax(0,1fr))]">
              <div />
              {Array.from({ length: 24 }, (_, h) => (
                <div
                  key={`head-${h}`}
                  aria-hidden="true"
                  className="flex h-4 items-start justify-center text-[9px] font-normal text-zinc-500"
                >
                  {h % 3 === 0 ? hourLabel(h) : ""}
                </div>
              ))}

              {apiKey.scope.map((endpointId, r) => (
                <Fragment key={endpointId}>
                  <div className="flex min-w-0 items-center pr-2" title={endpointLabel(endpointId)}>
                    <span className="block w-full truncate font-mono text-[11px] font-normal text-zinc-600">
                      {endpointLabel(endpointId)}
                    </span>
                  </div>
                  {apiKey.matrix[r].map((value, h) => {
                    const bin = intensityBin(value, max);
                    const isPeak = r === peak.rowIndex && h === peak.hour;
                    const isActiveRowOrCol = isPeak || (hovered ? hovered.rowIndex === r || hovered.hour === h : true);
                    return (
                      <button
                        key={`cell-${endpointId}-${h}`}
                        ref={(el) => {
                          if (el) refs.current.set(cellKey(r, h), el);
                          else refs.current.delete(cellKey(r, h));
                        }}
                        type="button"
                        tabIndex={r === active.rowIndex && h === active.hour ? 0 : -1}
                        onMouseEnter={() => setHovered({ rowIndex: r, hour: h })}
                        onFocus={() => setHovered({ rowIndex: r, hour: h })}
                        onKeyDown={(e) => onCellKeyDown(e, r, h)}
                        aria-label={`${endpointLabel(endpointId)}, ${hourRangeLabel(h)}: ${formatNumber(value)} requests`}
                        className={`${FOCUS} aspect-square w-full min-w-0 rounded-[3px] transition-opacity ${BIN_FILL[bin]} ${BIN_BORDER[bin]} ${
                          isActiveRowOrCol ? "" : "opacity-40"
                        }`}
                      >
                        {isPeak && (
                          <span aria-hidden="true" className="block text-center text-[9px] font-semibold tabular-nums text-white">
                            {value}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="mt-3 flex min-w-0 flex-wrap items-center gap-3">
            <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-600">
              Requests / hour
            </span>
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {["None", "Light", "Moderate", "Busy", "Heavy", "Peak"].map((label, i) => (
                <span key={label} className="flex items-center gap-1">
                  <span aria-hidden="true" className={`block h-2.5 w-2.5 rounded-[2px] ${BIN_FILL[i]} ${BIN_BORDER[i]}`} />
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
