"use client";

import { useMemo } from "react";
import { ChevronDown, ChevronUp, Minus } from "lucide-react";
import { currency, formatSigned, type BridgeRow } from "./data";

const WIDTH = 940;
const HEIGHT = 380;
const MARGIN = { top: 58, right: 16, bottom: 46, left: 16 };
const GAP = 14;

const FILL: Record<BridgeRow["type"], string> = {
  increase: "#EA580C", // orange-600
  decrease: "#52525B", // zinc-600
  total: "#27272A", // zinc-800
};

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

interface Bar {
  row: BridgeRow;
  x: number;
  width: number;
  barTop: number;
  barBottom: number;
  barHeight: number;
  connectorY: number | null;
}

function computeLayout(rows: BridgeRow[]): { bars: Bar[]; baselineY: number } {
  const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
  const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
  const count = rows.length;
  const barWidth = round2((plotWidth - GAP * (count - 1)) / count);
  const domainMax = Math.max(...rows.map((r) => Math.max(r.before, r.after))) * 1.12;
  const scale = (v: number) => (v / domainMax) * plotHeight;

  const bars: Bar[] = rows.map((row, i) => {
    const x = round2(MARGIN.left + i * (barWidth + GAP));
    const geomTop = row.type === "total" ? row.after : Math.max(row.before, row.after);
    const geomBottom = row.type === "total" ? 0 : Math.min(row.before, row.after);
    const barTop = round2(MARGIN.top + (plotHeight - scale(geomTop)));
    const barBottom = round2(MARGIN.top + (plotHeight - scale(geomBottom)));
    const barHeight = round2(Math.max(barBottom - barTop, 1.5));
    // The connector sits at this step's running total, which is exactly where the next bar begins.
    const connectorY = i < count - 1 ? round2(MARGIN.top + (plotHeight - scale(row.after))) : null;
    return { row, x, width: barWidth, barTop, barBottom, barHeight, connectorY };
  });

  return { bars, baselineY: round2(MARGIN.top + plotHeight) };
}

interface WaterfallChartProps {
  rows: BridgeRow[];
  pinnedKey: string | null;
  hoveredKey: string | null;
  onHover: (key: string | null) => void;
  onPin: (key: string | null) => void;
  axisNote: string;
}

export default function WaterfallChart({ rows, pinnedKey, hoveredKey, onHover, onPin, axisNote }: WaterfallChartProps) {
  const { bars, baselineY } = useMemo(() => computeLayout(rows), [rows]);
  const activeBar = bars.find((b) => b.row.key === hoveredKey) ?? null;

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="relative" style={{ width: WIDTH, minWidth: WIDTH }}>
          <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`Revenue recognition waterfall, ${axisNote}`}>
            <line x1={MARGIN.left} y1={baselineY} x2={WIDTH - MARGIN.right} y2={baselineY} stroke="#E4E4E7" strokeWidth={1} />
            {bars.slice(0, -1).map((b, i) =>
              b.connectorY !== null ? (
                <line
                  key={`connector-${b.row.key}`}
                  x1={round2(b.x + b.width)}
                  y1={b.connectorY}
                  x2={bars[i + 1].x}
                  y2={b.connectorY}
                  stroke="#D4D4D8"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              ) : null
            )}
            {bars.map((b) => {
              const isPinned = pinnedKey === b.row.key;
              const isHovered = hoveredKey === b.row.key;
              return (
                <rect
                  key={b.row.key}
                  x={b.x}
                  y={b.barTop}
                  width={b.width}
                  height={b.barHeight}
                  rx={4}
                  fill={FILL[b.row.type]}
                  opacity={pinnedKey && !isPinned ? 0.35 : 1}
                  className="transition-[opacity] duration-200 motion-reduce:transition-none"
                  style={isHovered ? { filter: "brightness(1.12)" } : undefined}
                />
              );
            })}
          </svg>

          {/* Interactive hit-targets + persistent value labels, sharing the SVG's pixel space. */}
          {bars.map((b) => {
            const hitHeight = Math.max(b.barHeight, 22);
            const hitTop = round2(b.barBottom - hitHeight);
            const isIncrease = b.row.type === "increase";
            const isDecrease = b.row.type === "decrease";
            const Icon = isIncrease ? ChevronUp : isDecrease ? ChevronDown : Minus;
            const deltaColor = isIncrease ? "text-orange-700" : isDecrease ? "text-zinc-600" : "text-zinc-500";
            return (
              <div key={b.row.key}>
                <button
                  type="button"
                  onMouseEnter={() => onHover(b.row.key)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(b.row.key)}
                  onBlur={() => onHover(null)}
                  onClick={() => onPin(pinnedKey === b.row.key ? null : b.row.key)}
                  aria-pressed={pinnedKey === b.row.key}
                  className="absolute rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
                  style={{ left: b.x, top: hitTop, width: b.width, height: hitHeight }}
                >
                  <span className="sr-only">
                    {b.row.label}: {b.row.type === "total" ? currency.format(b.row.after) : formatSigned(b.row.delta)}, running total {currency.format(b.row.after)}.{" "}
                    {pinnedKey === b.row.key ? "Selected — press to clear filter." : "Press to filter the table below to this line item."}
                  </span>
                </button>

                {/* persistent labels above the bar */}
                <div
                  className="pointer-events-none absolute flex flex-col items-center gap-0.5"
                  style={{ left: b.x + b.width / 2, top: b.barTop - 8, width: b.width, transform: "translate(-50%, -100%)" }}
                >
                  <span className="whitespace-nowrap text-[11px] font-semibold tabular-nums text-zinc-900">{currency.format(b.row.after)}</span>
                  <span className={`flex items-center gap-0.5 whitespace-nowrap text-[10px] tabular-nums ${deltaColor}`}>
                    <Icon className="h-3 w-3" aria-hidden="true" />
                    {b.row.type === "total" ? "Balance" : formatSigned(b.row.delta)}
                  </span>
                </div>

                {/* axis label below the bar */}
                <div
                  className="pointer-events-none absolute text-center text-[11px] font-medium text-zinc-500"
                  style={{ left: b.x, top: baselineY + 10, width: b.width }}
                >
                  {b.row.shortLabel}
                </div>
              </div>
            );
          })}

          {activeBar && (
            <div
              role="tooltip"
              className="pointer-events-none absolute z-10 w-56 rounded-lg border border-zinc-200 bg-white p-3 shadow-md"
              style={{
                left: Math.min(Math.max(activeBar.x + activeBar.width / 2, 112), WIDTH - 112),
                top: Math.max(activeBar.barTop - 96, 4),
                transform: "translateX(-50%)",
              }}
            >
              <p className="text-xs font-semibold text-zinc-900">{activeBar.row.label}</p>
              <p className="mt-0.5 text-[11px] text-zinc-500">{activeBar.row.category}</p>
              <dl className="mt-2 space-y-1 text-[11px]">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-zinc-500">
                    {activeBar.row.type === "total" ? "Balance" : "Delta"}
                  </dt>
                  <dd className="tabular-nums font-medium text-zinc-900">
                    {activeBar.row.type === "total" ? currency.format(activeBar.row.after) : formatSigned(activeBar.row.delta)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-zinc-500">Running total</dt>
                  <dd className="tabular-nums font-medium text-zinc-900">{currency.format(activeBar.row.after)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-zinc-500">Share of opening</dt>
                  <dd className="tabular-nums font-medium text-zinc-900">{activeBar.row.shareOfOpening}%</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-100 pt-3 text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: FILL.total }} aria-hidden="true" /> Balance
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: FILL.increase }} aria-hidden="true" /> Growth
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: FILL.decrease }} aria-hidden="true" /> Reduction
        </span>
        <span className="text-zinc-500">Hover or focus a bar for detail. Click a bar to filter the table.</span>
      </div>
    </div>
  );
}
