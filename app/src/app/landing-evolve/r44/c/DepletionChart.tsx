"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BarChart3, Table2 } from "lucide-react";
import { HORIZON_DAYS, INVENTORY_UNITS, formatUsd, type DepletionPoint } from "./data";
import { CAPTION, FIG_CAPTION, FOCUS_RING, MUTED_TEXT } from "./tokens";

const VB_W = 640;
const VB_H = 260;
const PAD = { top: 20, right: 16, bottom: 32, left: 40 };
const PLOT_W = VB_W - PAD.left - PAD.right;
const PLOT_H = VB_H - PAD.top - PAD.bottom;
const GRID_VALUES = [0, 30, 60, 90, 120];
const DAY_TICKS = [0, 7, 14];

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

function xForDay(day: number): number {
  return r2(PAD.left + (day / HORIZON_DAYS) * PLOT_W);
}

function yForRemaining(remaining: number): number {
  return r2(PAD.top + (1 - remaining / INVENTORY_UNITS) * PLOT_H);
}

// Percent helpers for the HTML label overlay (see comment above the figure markup for why
// axis labels are plain HTML, not <text> inside the SVG).
function xPct(day: number): number {
  return r2((xForDay(day) / VB_W) * 100);
}

function yPct(remaining: number): number {
  return r2((yForRemaining(remaining) / VB_H) * 100);
}

const LEFT_MARGIN_PCT = r2((PAD.left / VB_W) * 100);

function buildPaths(curve: DepletionPoint[]) {
  const bottomY = yForRemaining(0);
  const coords = curve.map((p) => `${xForDay(p.day)},${yForRemaining(p.remaining)}`);
  const line = `M${coords.join("L")}`;
  const firstX = xForDay(curve[0].day);
  const lastX = xForDay(curve[curve.length - 1].day);
  const area = `${line}L${lastX},${bottomY}L${firstX},${bottomY}Z`;
  return { line, area };
}

export function DepletionChart({
  price,
  curve,
  sellOutDay,
}: {
  price: number;
  curve: DepletionPoint[];
  sellOutDay: number | null;
}) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const reduced = useReducedMotion();
  const uid = useId();
  const chartPanelId = `${uid}-chart-panel`;
  const tablePanelId = `${uid}-table-panel`;
  const { line, area } = buildPaths(curve);
  const bottomY = yForRemaining(0);
  const markerX = sellOutDay !== null ? xForDay(sellOutDay) : null;
  const finalRemaining = curve[curve.length - 1].remaining;

  const summary =
    sellOutDay !== null
      ? `Line chart: starting at ${INVENTORY_UNITS} units, projected inventory reaches zero on day ${sellOutDay} when listed at ${formatUsd(price)}.`
      : `Line chart: starting at ${INVENTORY_UNITS} units, projected inventory is still at ${finalRemaining} units on day ${HORIZON_DAYS} when listed at ${formatUsd(price)} — it does not reach zero inside this window.`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={`${CAPTION} ${MUTED_TEXT}`}>Fig. 01 — Depletion projection</p>
        <div role="group" aria-label="Chart display mode" className="inline-flex rounded-full border border-[#121212]/15 p-0.5">
          <button
            type="button"
            aria-pressed={view === "chart"}
            aria-controls={chartPanelId}
            onClick={() => setView("chart")}
            className={`inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-colors duration-150 ${FOCUS_RING} ${
              view === "chart" ? "bg-emerald-700 text-white" : "text-[#121212]"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
            Chart
          </button>
          <button
            type="button"
            aria-pressed={view === "table"}
            aria-controls={tablePanelId}
            onClick={() => setView("table")}
            className={`inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-colors duration-150 ${FOCUS_RING} ${
              view === "table" ? "bg-emerald-700 text-white" : "text-[#121212]"
            }`}
          >
            <Table2 className="h-3.5 w-3.5" aria-hidden="true" />
            Table
          </button>
        </div>
      </div>

      {/*
        Both panels are always mounted; `hidden` toggles visibility instead of a ternary that
        unmounts the inactive one. Each toggle button's `aria-controls` points at a panel id that
        must exist in the DOM at all times — axe's aria-valid-attr-value rule (correctly) flags a
        reference to an id with no matching element, which is exactly what conditional unmounting
        produced for whichever panel wasn't currently showing.
      */}
      <figure id={chartPanelId} hidden={view !== "chart"} className="mt-4">
          <div className="relative rounded-xl border border-[#121212]/10 bg-white p-3 sm:p-4">
            <p className="sr-only">{summary}</p>
            {/*
              Axis labels are plain HTML <span>s positioned by percentage, not <text> inside the
              SVG: an SVG viewBox stretches its contents (text included) by the same factor as the
              drawing, so a fixed-px font-size there shrinks below readable size once the container
              narrows to mobile widths. The lines/area/marker stay in the SVG (they're geometry, not
              text, so scaling them is exactly the point); only the numbers move to HTML so their
              font-size stays a real, responsive CSS pixel value at every width.
            */}
            <div aria-hidden="true" className="relative w-full" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
              <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="depletion-area-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#047857" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#047857" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {GRID_VALUES.map((v) => (
                  <line
                    key={v}
                    x1={PAD.left}
                    x2={VB_W - PAD.right}
                    y1={yForRemaining(v)}
                    y2={yForRemaining(v)}
                    stroke="#121212"
                    strokeOpacity={0.08}
                    strokeWidth={1}
                  />
                ))}

                <motion.path
                  d={area}
                  fill="url(#depletion-area-fill)"
                  animate={{ d: area }}
                  transition={{ duration: reduced ? 0 : 0.45, ease: "easeOut" }}
                />
                <motion.path
                  d={line}
                  fill="none"
                  stroke="#047857"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{ d: line }}
                  transition={{ duration: reduced ? 0 : 0.45, ease: "easeOut" }}
                />

                {markerX !== null && (
                  <g>
                    <motion.line
                      x1={markerX}
                      x2={markerX}
                      y1={PAD.top}
                      y2={bottomY}
                      stroke="#121212"
                      strokeOpacity={0.35}
                      strokeDasharray="3,3"
                      strokeWidth={1.25}
                      animate={{ x1: markerX, x2: markerX }}
                      transition={{ duration: reduced ? 0 : 0.45, ease: "easeOut" }}
                    />
                    <motion.circle
                      cx={markerX}
                      cy={bottomY}
                      r={4}
                      fill="#047857"
                      animate={{ cx: markerX }}
                      transition={{ duration: reduced ? 0 : 0.45, ease: "easeOut" }}
                    />
                  </g>
                )}
              </svg>

              {GRID_VALUES.map((v) => (
                <span
                  key={v}
                  className="absolute -translate-y-1/2 text-[11px] font-normal tabular-nums text-zinc-600"
                  style={{ left: 0, width: `${LEFT_MARGIN_PCT}%`, top: `${yPct(v)}%`, textAlign: "right", paddingRight: 4 }}
                >
                  {v}
                </span>
              ))}

              {DAY_TICKS.map((d) => (
                <span
                  key={d}
                  className="absolute bottom-0 text-[11px] font-normal tabular-nums text-zinc-600"
                  style={{
                    left: `${xPct(d)}%`,
                    transform: d === 0 ? "translateX(0)" : d === HORIZON_DAYS ? "translateX(-100%)" : "translateX(-50%)",
                  }}
                >
                  Day {d}
                </span>
              ))}

              {markerX !== null && sellOutDay !== null && (
                <motion.span
                  className="absolute text-[11px] font-bold tabular-nums text-emerald-700"
                  style={{ top: `${yPct(0)}%` }}
                  animate={{ left: `${xPct(sellOutDay)}%` }}
                  initial={false}
                  transition={{ duration: reduced ? 0 : 0.45, ease: "easeOut" }}
                >
                  <span className="block -translate-x-1/2 -translate-y-[160%]">Day {sellOutDay}</span>
                </motion.span>
              )}
            </div>
          </div>
          <figcaption className={`mt-2 ${FIG_CAPTION} ${MUTED_TEXT}`}>
            Projected units remaining across a {HORIZON_DAYS}-day horizon, recomputed for every list price.
          </figcaption>
        </figure>
      <div id={tablePanelId} hidden={view !== "table"} className="mt-4 rounded-xl border border-[#121212]/10 bg-white">
          <table className="w-full table-fixed border-collapse text-left text-sm">
            <caption className="sr-only">
              Projected remaining inventory by day when listed at {formatUsd(price)}, starting from {INVENTORY_UNITS} units.
            </caption>
            <thead>
              <tr className="border-b border-[#121212]/10">
                <th scope="col" className="w-1/3 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#121212]">
                  Day
                </th>
                <th scope="col" className="w-1/3 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#121212]">
                  Remaining
                </th>
                <th scope="col" className="w-1/3 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#121212]">
                  Sold
                </th>
              </tr>
            </thead>
            <tbody>
              {curve.map((p) => (
                <tr key={p.day} className="border-b border-[#121212]/5 last:border-0">
                  <th scope="row" className="px-3 py-1.5 text-sm font-bold tabular-nums text-[#121212]">
                    Day {p.day}
                  </th>
                  <td className="px-3 py-1.5 text-sm font-normal tabular-nums text-[#121212]">{p.remaining}</td>
                  <td className={`px-3 py-1.5 text-sm font-normal tabular-nums ${MUTED_TEXT}`}>
                    {r2(INVENTORY_UNITS - p.remaining)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}
