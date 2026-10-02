"use client";

import { useMemo, useState } from "react";
import {
  SELLERS,
  OUTLIER_TOP_REVENUE,
  OUTLIER_WORST_RETURN,
  TIER_META,
  formatCurrency,
  formatCurrencyCompact,
  formatPercent,
  formatCount,
  FOCUS_RING,
  type Seller,
} from "./data";

interface ScatterChartProps {
  pinnedId: string | null;
  hoveredRailId: string | null;
  onPin: (id: string) => void;
}

const VB_W = 720;
const VB_H = 420;
const PAD_LEFT = 64;
const PAD_RIGHT = 20;
const PAD_TOP = 20;
const PAD_BOTTOM = 40;
const PLOT_W = VB_W - PAD_LEFT - PAD_RIGHT;
const PLOT_H = VB_H - PAD_TOP - PAD_BOTTOM;
const R_MIN = 7;
const R_MAX = 25;

interface Point {
  seller: Seller;
  cx: number;
  cy: number;
  r: number;
}

export default function ScatterChart({ pinnedId, hoveredRailId, onPin }: ScatterChartProps) {
  const [hoveredChartId, setHoveredChartId] = useState<string | null>(null);

  const { points, xMax, yMax, xTicks, yTicks } = useMemo(() => {
    const maxReturn = Math.max(...SELLERS.map((s) => s.returnRatePct));
    const maxRevenue = Math.max(...SELLERS.map((s) => s.revenue));
    const minOrders = Math.min(...SELLERS.map((s) => s.orderVolume));
    const maxOrders = Math.max(...SELLERS.map((s) => s.orderVolume));

    const xMax = Math.ceil(maxReturn / 5) * 5;
    const yMax = Math.ceil(maxRevenue / 100000) * 100000;

    const sqrtMin = Math.sqrt(minOrders);
    const sqrtMax = Math.sqrt(maxOrders);
    const rScale = (v: number) =>
      sqrtMax === sqrtMin
        ? (R_MIN + R_MAX) / 2
        : R_MIN + ((Math.sqrt(v) - sqrtMin) / (sqrtMax - sqrtMin)) * (R_MAX - R_MIN);

    const xScale = (v: number) => PAD_LEFT + (v / xMax) * PLOT_W;
    const yScale = (v: number) => PAD_TOP + PLOT_H - (v / yMax) * PLOT_H;

    const points: Point[] = SELLERS.map((seller) => ({
      seller,
      cx: Math.round(xScale(seller.returnRatePct) * 100) / 100,
      cy: Math.round(yScale(seller.revenue) * 100) / 100,
      r: Math.round(rScale(seller.orderVolume) * 100) / 100,
    }));

    const xTicks: number[] = [];
    for (let v = 0; v <= xMax; v += 5) xTicks.push(v);
    const yTicks: number[] = [];
    for (let v = 0; v <= yMax; v += 100000) yTicks.push(v);

    return { points, xMax, yMax, xTicks, yTicks };
  }, []);

  const pointById = useMemo(() => new Map(points.map((p) => [p.seller.id, p])), [points]);

  const outlierIds = useMemo(() => {
    const ids = new Set<string>([...OUTLIER_TOP_REVENUE, ...OUTLIER_WORST_RETURN]);
    return Array.from(ids);
  }, []);

  const hoveredPoint = hoveredChartId ? pointById.get(hoveredChartId) ?? null : null;

  function labelFor(point: Point) {
    const isTop = OUTLIER_TOP_REVENUE.includes(point.seller.id);
    const isWorst = OUTLIER_WORST_RETURN.includes(point.seller.id);
    if (isTop && isWorst) {
      return `${formatCurrencyCompact(point.seller.revenue)} · ${point.seller.returnRatePct}% returns`;
    }
    if (isTop) return `${formatCurrencyCompact(point.seller.revenue)} revenue`;
    return `${point.seller.returnRatePct}% returns`;
  }

  function labelAnchor(cx: number): "start" | "middle" | "end" {
    if (cx < PAD_LEFT + 100) return "start";
    if (cx > PAD_LEFT + PLOT_W - 100) return "end";
    return "middle";
  }

  function labelDy(point: Point): number {
    const wouldOverflowTop = point.cy - point.r - 26 < PAD_TOP;
    return wouldOverflowTop ? point.r + 30 : -(point.r + 12);
  }

  return (
    <div>
      <p id="scatter-instructions" className="sr-only font-normal">
        Scatter plot of {SELLERS.length} sellers. Horizontal axis is return rate, vertical axis is
        trailing 90-day revenue, and bubble size is order volume. Tab through each point to hear its
        exact values, or use the full sortable table below for the same data in text form.
      </p>
      <div className="relative">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="w-full h-auto"
          aria-describedby="scatter-instructions"
        >
          <title>Return rate versus revenue, sized by order volume</title>

          {/* Gridlines */}
          {yTicks.map((t) => {
            const y = PAD_TOP + PLOT_H - (t / yMax) * PLOT_H;
            return (
              <line
                key={`gy-${t}`}
                x1={PAD_LEFT}
                x2={VB_W - PAD_RIGHT}
                y1={y}
                y2={y}
                className="stroke-white/[0.06]"
                strokeWidth={1}
              />
            );
          })}
          {xTicks.map((t) => {
            const x = PAD_LEFT + (t / xMax) * PLOT_W;
            return (
              <line
                key={`gx-${t}`}
                x1={x}
                x2={x}
                y1={PAD_TOP}
                y2={PAD_TOP + PLOT_H}
                className="stroke-white/[0.05]"
                strokeWidth={1}
              />
            );
          })}

          {/* Axes */}
          <line x1={PAD_LEFT} x2={PAD_LEFT} y1={PAD_TOP} y2={PAD_TOP + PLOT_H} className="stroke-white/15" strokeWidth={1} />
          <line
            x1={PAD_LEFT}
            x2={VB_W - PAD_RIGHT}
            y1={PAD_TOP + PLOT_H}
            y2={PAD_TOP + PLOT_H}
            className="stroke-white/15"
            strokeWidth={1}
          />

          {/* Tick labels */}
          {xTicks.map((t) => (
            <text
              key={`xt-${t}`}
              x={PAD_LEFT + (t / xMax) * PLOT_W}
              y={PAD_TOP + PLOT_H + 18}
              textAnchor="middle"
              className="fill-zinc-400 text-[10px] font-normal tabular-nums"
            >
              {t}%
            </text>
          ))}
          {yTicks.map((t) => (
            <text
              key={`yt-${t}`}
              x={PAD_LEFT - 10}
              y={PAD_TOP + PLOT_H - (t / yMax) * PLOT_H + 3}
              textAnchor="end"
              className="fill-zinc-400 text-[10px] font-normal tabular-nums"
            >
              {t === 0 ? "$0" : formatCurrencyCompact(t)}
            </text>
          ))}

          {/* Axis titles */}
          <text
            x={PAD_LEFT + PLOT_W / 2}
            y={VB_H - 4}
            textAnchor="middle"
            className="fill-zinc-400 text-[10px] font-medium uppercase tracking-wider"
          >
            Return rate
          </text>
          <text
            x={-(PAD_TOP + PLOT_H / 2)}
            y={16}
            textAnchor="middle"
            transform="rotate(-90)"
            className="fill-zinc-400 text-[10px] font-medium uppercase tracking-wider"
          >
            Revenue, trailing 90 days
          </text>

          {/* Ephemeral rail-hover ring — decorative, never intercepts pointer events, and is a
              fully separate visual language (dashed, no fill) from the persistent pin ring below. */}
          {hoveredRailId &&
            hoveredRailId !== pinnedId &&
            (() => {
              const p = pointById.get(hoveredRailId);
              if (!p) return null;
              return (
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={p.r + 6}
                  fill="none"
                  className="stroke-zinc-300/70"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  pointerEvents="none"
                />
              );
            })()}

          {/* Persistent pin ring — a halo plus a solid ring, distinct from the ephemeral hover mark. */}
          {pinnedId &&
            (() => {
              const p = pointById.get(pinnedId);
              if (!p) return null;
              return (
                <g pointerEvents="none">
                  <circle cx={p.cx} cy={p.cy} r={p.r + 12} className="fill-sky-400/10" />
                  <circle cx={p.cx} cy={p.cy} r={p.r + 6} fill="none" className="stroke-sky-300" strokeWidth={2} />
                </g>
              );
            })()}

          {/* Bubbles */}
          {points.map((p) => {
            const isPinned = p.seller.id === pinnedId;
            const isChartHovered = p.seller.id === hoveredChartId;
            return (
              <circle
                key={p.seller.id}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                role="button"
                tabIndex={0}
                aria-pressed={isPinned}
                aria-label={`${p.seller.name}. ${formatPercent(p.seller.returnRatePct)} return rate, ${formatCurrency(
                  p.seller.revenue
                )} revenue, ${formatCount(p.seller.orderVolume)} orders. Press to pin.`}
                onMouseEnter={() => setHoveredChartId(p.seller.id)}
                onMouseLeave={() => setHoveredChartId((cur) => (cur === p.seller.id ? null : cur))}
                onFocus={() => setHoveredChartId(p.seller.id)}
                onBlur={() => setHoveredChartId((cur) => (cur === p.seller.id ? null : cur))}
                onClick={() => onPin(p.seller.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onPin(p.seller.id);
                  }
                }}
                className={`cursor-pointer fill-sky-400/35 stroke-sky-300/80 transition-[fill-opacity,stroke-opacity] motion-reduce:transition-none ${FOCUS_RING} ${
                  isChartHovered ? "fill-sky-300/60 stroke-sky-200" : ""
                }`}
                strokeWidth={1.5}
              />
            );
          })}

          {/* Always-visible outlier labels — top 3 by revenue, worst 3 by return rate. This is
              fixed by the underlying data, not by the pinned seller: it deliberately does not
              react to selection, so the chart still reads correctly with nothing pinned. */}
          {outlierIds.map((id) => {
            const p = pointById.get(id);
            if (!p) return null;
            const tier = TIER_META[p.seller.tier];
            const anchor = labelAnchor(p.cx);
            const dy = labelDy(p);
            return (
              <text
                key={`lbl-${id}`}
                x={p.cx}
                y={p.cy + dy}
                textAnchor={anchor}
                className="pointer-events-none select-none"
              >
                <tspan x={p.cx} className={`text-[10.5px] font-medium ${tier.text}`}>
                  {p.seller.name}
                </tspan>
                <tspan x={p.cx} dy={12} className="fill-zinc-400 text-[10px] font-normal tabular-nums">
                  {labelFor(p)}
                </tspan>
              </text>
            );
          })}
        </svg>

        {/* Hover tooltip — HTML overlay, independent of the pin. Ephemeral: clears on
            mouse-leave/blur and never writes to persistent state. */}
        {hoveredPoint && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-10 w-52 -translate-x-1/2 rounded-lg border border-white/10 bg-zinc-900 p-3 shadow-xl shadow-black/40"
            style={{
              left: `${(hoveredPoint.cx / VB_W) * 100}%`,
              top: `${(hoveredPoint.cy / VB_H) * 100}%`,
              transform:
                hoveredPoint.cy - hoveredPoint.r - 96 < PAD_TOP
                  ? "translate(-50%, 14px)"
                  : "translate(-50%, calc(-100% - 14px))",
            }}
          >
            <p className="truncate text-xs font-semibold text-zinc-50">{hoveredPoint.seller.name}</p>
            <p className="mt-0.5 truncate text-[11px] font-normal text-zinc-400">{hoveredPoint.seller.category}</p>
            <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
              <div className="col-span-2 flex items-center justify-between gap-2">
                <dt className="font-normal text-zinc-400">Return rate</dt>
                <dd className="font-medium tabular-nums text-zinc-50">{formatPercent(hoveredPoint.seller.returnRatePct)}</dd>
              </div>
              <div className="col-span-2 flex items-center justify-between gap-2">
                <dt className="font-normal text-zinc-400">Revenue</dt>
                <dd className="font-medium tabular-nums text-zinc-50">{formatCurrency(hoveredPoint.seller.revenue)}</dd>
              </div>
              <div className="col-span-2 flex items-center justify-between gap-2">
                <dt className="font-normal text-zinc-400">Orders</dt>
                <dd className="font-medium tabular-nums text-zinc-50">{formatCount(hoveredPoint.seller.orderVolume)}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* Legend — color is always paired with an icon and a label. */}
      <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-normal text-zinc-400">
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border border-sky-300/80 bg-sky-400/35" />
          Seller (size = order volume)
        </li>
        {(Object.keys(TIER_META) as Array<keyof typeof TIER_META>).map((key) => {
          const meta = TIER_META[key];
          const Icon = meta.icon;
          return (
            <li key={key} className="flex items-center gap-1.5">
              <Icon className={`h-3.5 w-3.5 ${meta.text}`} aria-hidden="true" />
              {meta.label} outlier label
            </li>
          );
        })}
      </ul>
    </div>
  );
}
