"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  BASE_TREND,
  CATEGORIES,
  CATEGORY_IDS,
  MONTHS,
  MONTHS_FULL,
  NOW_INDEX,
  type ItemReadout,
  type RibbonSeries,
} from "./data";
import { CATEGORY_COLOR, cx, FOCUS, INK, INK_TEXT, MUTED, MUTED_TEXT, NUM } from "./tokens";

// ---------------------------------------------------------------------------------------------
// Geometry — a hand-rolled streamgraph. No chart library: 12 fixed points per band, smoothed with
// a Catmull-Rom -> cubic-Bezier conversion (tension 6, the standard conversion), stacked around a
// "wiggle" baseline (centered on 0 every month) so both band thickness AND the ribbon's outer
// silhouette breathe with the slider weights, not just an internal partition of a flat rectangle.

const VB_W = 720;
const VB_H = 400;
const M_LEFT = 20;
const M_RIGHT = 64;
const M_TOP = 46;
const M_BOTTOM = 54;
const PLOT_W = VB_W - M_LEFT - M_RIGHT;
const PLOT_H = VB_H - M_TOP - M_BOTTOM;
const CENTER_Y = M_TOP + PLOT_H / 2;
const HALF_PLOT = PLOT_H / 2;

function xAt(i: number): number {
  return M_LEFT + (i * PLOT_W) / (MONTHS.length - 1);
}

type Pt = [number, number];

function smoothPath(points: Pt[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;
  let d = `M ${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}

function bandPath(topPts: Pt[], bottomPts: Pt[]): string {
  const topD = smoothPath(topPts);
  const bottomRev = [...bottomPts].reverse();
  const bottomD = smoothPath(bottomRev);
  const bottomCurveOnly = bottomD.replace(/^M[^C]*/, "");
  return `${topD} L ${bottomRev[0][0].toFixed(2)},${bottomRev[0][1].toFixed(2)} ${bottomCurveOnly} Z`;
}

export default function RibbonChart({
  series,
  itemReadout,
  reduceMotion,
}: {
  series: RibbonSeries;
  itemReadout: ItemReadout;
  reduceMotion: boolean;
}) {
  const tableId = useId();
  const [tableOpen, setTableOpen] = useState(false);

  const scale = (HALF_PLOT * 0.92) / Math.max(series.maxTotal / 2, 1);
  const transition = { duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] as const };

  const bandData = CATEGORY_IDS.map((cat) => {
    const topPts: Pt[] = MONTHS.map((_, i) => [xAt(i), CENTER_Y - series.top[cat][i] * scale]);
    const bottomPts: Pt[] = MONTHS.map((_, i) => [xAt(i), CENTER_Y - series.bottom[cat][i] * scale]);
    return { cat, d: bandPath(topPts, bottomPts) };
  });

  const markerCat = itemReadout.category;
  const markerX = xAt(NOW_INDEX);
  const markerTopY = CENTER_Y - series.top[markerCat][NOW_INDEX] * scale;
  const markerBottomY = CENTER_Y - series.bottom[markerCat][NOW_INDEX] * scale;
  const markerY = (markerTopY + markerBottomY) / 2;

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          role="img"
          aria-label={`Streamgraph of resale demand share across lenses, camera bodies, accessories and vintage film gear over the trailing 12 months, weighted by your current sliders. Your ${CATEGORIES[markerCat].label.toLowerCase()} item currently sits at a ${Math.round(itemReadout.shareNowPct)} percent share with a demand index of ${itemReadout.indexNow} out of 100.`}
          className="h-auto w-full"
        >
          {/* "Now" guideline */}
          <line
            x1={markerX}
            y1={M_TOP - 8}
            x2={markerX}
            y2={M_TOP + PLOT_H + 10}
            stroke="#D4D4D8"
            strokeWidth={1}
            strokeDasharray="3 4"
          />
          <text
            x={markerX}
            y={M_TOP - 16}
            textAnchor="middle"
            fontSize={11}
            fontWeight={600}
            fill={MUTED}
            className={NUM}
          >
            Now
          </text>

          {bandData.map(({ cat, d }) => (
            <motion.path
              key={cat}
              d={d}
              animate={{ d }}
              transition={transition}
              fill={CATEGORY_COLOR[cat]}
              fillOpacity={cat === markerCat ? 0.94 : 0.86}
              stroke={cat === markerCat ? CATEGORY_COLOR[cat] : "none"}
              strokeWidth={cat === markerCat ? 1.5 : 0}
            />
          ))}

          {/* Month axis */}
          {MONTHS.map((label, i) =>
            i % 2 === 0 ? (
              <text
                key={label + i}
                x={xAt(i)}
                y={M_TOP + PLOT_H + 26}
                textAnchor="middle"
                fontSize={11}
                fontWeight={400}
                fill={MUTED}
              >
                {label}
              </text>
            ) : null,
          )}

          {/* Your-item marker */}
          <motion.line
            animate={{ x1: markerX, y1: markerY - 30, x2: markerX, y2: markerY }}
            transition={transition}
            stroke={INK}
            strokeWidth={1}
          />
          <motion.circle
            animate={{ cx: markerX, cy: markerY }}
            transition={transition}
            r={6}
            fill={INK}
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          <motion.g animate={{ x: 0, y: markerY - 30 }} transition={transition}>
            <rect
              x={markerX - 168}
              y={-34}
              width={168}
              height={30}
              rx={7}
              fill="#FFFFFF"
              stroke="#E4E4E7"
              strokeWidth={1}
            />
            <text x={markerX - 158} y={-19} fontSize={10.5} fontWeight={600} fill={MUTED}>
              Your item &middot; {CATEGORIES[markerCat].label}
            </text>
            <text x={markerX - 158} y={-7} fontSize={11.5} fontWeight={800} fill={INK} className={NUM}>
              {Math.round(itemReadout.shareNowPct)}% share &middot; index {itemReadout.indexNow}
            </text>
          </motion.g>
        </svg>
      </div>

      {/* Legend — color dot + text label together, never color alone */}
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2" aria-label="Ribbon band legend">
        {series.order
          .slice()
          .reverse()
          .map((cat) => (
            <li key={cat} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_COLOR[cat] }}
              />
              <span className={cx("text-[12.5px] font-semibold", cat === markerCat ? "text-[#9A3412]" : INK_TEXT)}>
                {CATEGORIES[cat].label}
                {cat === markerCat ? " (your item)" : ""}
              </span>
            </li>
          ))}
      </ul>

      {/* Accessible fallback / audit trail: a real semantic table, not a styled div. */}
      <div className="mt-5">
        <button
          type="button"
          aria-expanded={tableOpen}
          aria-controls={tableId}
          onClick={() => setTableOpen((v) => !v)}
          className={cx(
            "inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-3.5 py-1.5 text-[12.5px] font-semibold",
            INK_TEXT,
            FOCUS,
          )}
        >
          <ChevronDown
            aria-hidden="true"
            className={cx("h-3.5 w-3.5 transition-transform duration-200", tableOpen && "rotate-180")}
          />
          {tableOpen ? "Hide exact numbers" : "View exact numbers"}
        </button>

        <div id={tableId} hidden={!tableOpen} className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-[12px]">
            <caption className={cx("mb-2 text-left text-[12.5px]", MUTED_TEXT)}>
              Live weighted demand share per category, by month — recalculated from your current slider
              weights (source index shown in parentheses, 0-100, independent of weighting).
            </caption>
            <thead>
              <tr className="border-b border-zinc-300">
                <th scope="col" className={cx("py-2 pr-3 text-left font-semibold", INK_TEXT)}>
                  Category
                </th>
                {MONTHS.map((m, i) => (
                  <th
                    key={m + i}
                    scope="col"
                    className={cx("py-2 px-2 text-right font-semibold", MUTED_TEXT)}
                    title={MONTHS_FULL[i]}
                  >
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATEGORY_IDS.map((cat) => (
                <tr key={cat} className="border-b border-zinc-100">
                  <th
                    scope="row"
                    className={cx(
                      "py-2 pr-3 text-left font-semibold",
                      cat === markerCat ? "text-[#9A3412]" : INK_TEXT,
                    )}
                  >
                    {CATEGORIES[cat].label}
                  </th>
                  {MONTHS.map((_, i) => (
                    <td key={i} className={cx("py-2 px-2 text-right", NUM, MUTED_TEXT)}>
                      {Math.round(series.value[cat][i])}
                      <span className="text-zinc-400"> ({BASE_TREND[cat][i]})</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
