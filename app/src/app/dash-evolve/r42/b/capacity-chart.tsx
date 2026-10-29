"use client";

import { useRef } from "react";
import { Pin } from "lucide-react";
import { formatInt, formatSignedInt, formatWeekRange, formatWeekShort } from "./format";
import { round2, type WeekResult } from "./sim";
import { FOCUS_RING, GapIndicator } from "./ui";

const VIEW_W = 880;
const VIEW_H = 320;
const PAD_LEFT = 44;
const PAD_RIGHT = 16;
const PAD_TOP = 40;
const PAD_BOTTOM = 34;
const CHART_W = VIEW_W - PAD_LEFT - PAD_RIGHT;
const CHART_H = VIEW_H - PAD_TOP - PAD_BOTTOM;

export default function CapacityChart({
  rows,
  pinnedWeek,
  hoveredWeek,
  onHoverWeek,
  onPinWeek,
}: {
  rows: WeekResult[];
  pinnedWeek: number;
  hoveredWeek: number | null;
  onHoverWeek: (index: number | null) => void;
  onPinWeek: (index: number) => void;
}) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const n = rows.length;
  const rawMax = Math.max(...rows.map((r) => Math.max(r.requiredHeadcount, r.scheduledHeadcount)));
  const domainMax = Math.max(20, Math.ceil((rawMax * 1.15) / 20) * 20);

  const xAt = (i: number) => round2(PAD_LEFT + (n === 1 ? CHART_W / 2 : (i / (n - 1)) * CHART_W));
  const yAt = (v: number) => round2(PAD_TOP + CHART_H - (v / domainMax) * CHART_H);

  const requiredLine = rows.map((r, i) => `${xAt(i)},${yAt(r.requiredHeadcount)}`).join(" ");
  const scheduledLine = rows.map((r, i) => `${xAt(i)},${yAt(r.scheduledHeadcount)}`).join(" ");

  const bandWidth = n > 1 ? round2(CHART_W / n) : CHART_W;

  const gridFractions = [0, 0.25, 0.5, 0.75, 1];

  // Ephemeral preview: a hovered/focused week shows a crosshair + tooltip, but never for the
  // week that is already pinned — that week already has its own persistent, always-visible
  // marker and (via the table) its expanded detail, so a floating preview on top would be a
  // redundant, jarring duplicate rather than new information.
  const previewIndex = hoveredWeek !== null && hoveredWeek !== pinnedWeek ? hoveredWeek : null;
  const preview = previewIndex !== null ? rows[previewIndex] : null;
  const pinnedRow = rows[pinnedWeek];

  const liveDescription = preview
    ? `Week of ${formatWeekRange(preview.index)}: ${formatInt(preview.requiredHeadcount)} agents required, ${formatInt(
        preview.scheduledHeadcount
      )} scheduled, ${formatInt(preview.attainmentPct)}% attainment${preview.breach ? ", under target" : ""}.`
    : `Pinned week ${formatWeekRange(pinnedRow.index)}: ${formatInt(pinnedRow.requiredHeadcount)} agents required, ${formatInt(
        pinnedRow.scheduledHeadcount
      )} scheduled, ${formatInt(pinnedRow.attainmentPct)}% attainment${pinnedRow.breach ? ", under target" : ""}.`;

  function focusIndex(i: number) {
    buttonRefs.current[i]?.focus();
  }

  return (
    <div>
      <div className="relative">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="block h-auto w-full" aria-hidden="true">
          <defs>
            <pattern id="breach-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" className="fill-red-50" />
              <line x1="0" y1="0" x2="0" y2="6" className="stroke-red-200" strokeWidth={2} />
            </pattern>
          </defs>

          {/* Per-week background bands: breach weeks hatched + tinted red, surplus weeks tinted
              green. This is a discrete per-week signal (not an interpolated area-between-curves
              fill), so it always matches the week's own attainment badge exactly. */}
          {rows.map((r, i) => (
            <rect
              key={`band-${r.index}`}
              x={round2(xAt(i) - bandWidth / 2)}
              y={PAD_TOP}
              width={round2(bandWidth)}
              height={CHART_H}
              fill={r.breach ? "url(#breach-hatch)" : undefined}
              className={r.breach ? undefined : "fill-green-50"}
            />
          ))}

          {/* Gridlines + y-axis labels */}
          {gridFractions.map((f) => {
            const v = Math.round(f * domainMax);
            const y = yAt(v);
            return (
              <g key={f}>
                <line x1={PAD_LEFT} x2={VIEW_W - PAD_RIGHT} y1={y} y2={y} className="stroke-zinc-200" strokeWidth={1} />
                <text x={PAD_LEFT - 8} y={y} textAnchor="end" dominantBaseline="middle" className="fill-zinc-600 font-normal text-[10px] tabular-nums">
                  {formatInt(v)}
                </text>
              </g>
            );
          })}

          {/* Scheduled capacity — flat reference line (headcount doesn't vary week to week). */}
          <polyline points={scheduledLine} fill="none" className="stroke-zinc-400" strokeWidth={1.75} strokeDasharray="5 4" />

          {/* Required demand — the primary series. */}
          <polyline points={requiredLine} fill="none" className="stroke-green-700" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          {rows.map((r, i) => (
            <circle key={`pt-${r.index}`} cx={xAt(i)} cy={yAt(r.requiredHeadcount)} r={3.5} className="fill-green-700" />
          ))}

          {/* Persistent pinned marker — always visible, independent of hover. */}
          <g>
            <circle cx={xAt(pinnedWeek)} cy={yAt(pinnedRow.requiredHeadcount)} r={9} fill="none" className="stroke-green-700" strokeWidth={2} />
            <circle cx={xAt(pinnedWeek)} cy={yAt(pinnedRow.requiredHeadcount)} r={4.5} className="fill-white stroke-green-700" strokeWidth={2} />
            <text x={xAt(pinnedWeek)} y={yAt(pinnedRow.requiredHeadcount) - 16} textAnchor="middle" className="fill-green-700 font-semibold text-[10px] uppercase tracking-[0.03em]">
              Pinned
            </text>
          </g>

          {/* Ephemeral hover/focus crosshair */}
          {preview ? (
            <g className="motion-safe:transition-opacity motion-safe:duration-150">
              <line x1={xAt(previewIndex!)} x2={xAt(previewIndex!)} y1={PAD_TOP} y2={VIEW_H - PAD_BOTTOM} className="stroke-zinc-400" strokeWidth={1} strokeDasharray="2 2" />
              <circle cx={xAt(previewIndex!)} cy={yAt(preview.requiredHeadcount)} r={6} fill="none" className="stroke-zinc-600" strokeWidth={2} />
            </g>
          ) : null}

          {/* X-axis week labels */}
          {rows.map((r, i) => (
            <text key={`label-${r.index}`} x={xAt(i)} y={VIEW_H - PAD_BOTTOM + 18} textAnchor="middle" className="fill-zinc-600 font-normal text-[10px] tabular-nums">
              {formatWeekShort(r.index)}
            </text>
          ))}
        </svg>

        {/* Real, individually focusable hit targets — pointer AND keyboard both land here. */}
        {rows.map((r, i) => (
          <button
            key={`hit-${r.index}`}
            type="button"
            ref={(el) => {
              buttonRefs.current[i] = el;
            }}
            onMouseEnter={() => onHoverWeek(i)}
            onMouseLeave={() => onHoverWeek(null)}
            onFocus={() => onHoverWeek(i)}
            onBlur={() => onHoverWeek(null)}
            onClick={() => onPinWeek(i)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" && i < n - 1) {
                event.preventDefault();
                focusIndex(i + 1);
              } else if (event.key === "ArrowLeft" && i > 0) {
                event.preventDefault();
                focusIndex(i - 1);
              } else if (event.key === "Home") {
                event.preventDefault();
                focusIndex(0);
              } else if (event.key === "End") {
                event.preventDefault();
                focusIndex(n - 1);
              }
            }}
            aria-label={`Week of ${formatWeekRange(r.index)}: ${formatInt(r.requiredHeadcount)} agents required, ${formatInt(
              r.scheduledHeadcount
            )} scheduled, ${formatInt(r.attainmentPct)}% attainment${r.breach ? ", under target" : ""}. ${
              i === pinnedWeek ? "Currently pinned." : "Press Enter to pin."
            }`}
            className={`absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full ${FOCUS_RING}`}
            style={{ left: `${(xAt(i) / VIEW_W) * 100}%`, top: `${(yAt(r.requiredHeadcount) / VIEW_H) * 100}%` }}
          />
        ))}

        {preview ? (
          <div
            className="pointer-events-none absolute z-10 w-max max-w-[220px] -translate-x-1/2 rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-md motion-safe:transition-opacity motion-safe:duration-150"
            style={{
              left: `${(xAt(previewIndex!) / VIEW_W) * 100}%`,
              top: `${Math.max(0, (yAt(preview.requiredHeadcount) / VIEW_H) * 100 - 20)}%`,
            }}
          >
            <p className="font-medium text-xs text-zinc-900">Week of {formatWeekRange(preview.index)}</p>
            <p className="mt-0.5 font-normal text-[11px] tabular-nums text-zinc-600">Required {formatInt(preview.requiredHeadcount)} agents</p>
            <p className="font-normal text-[11px] tabular-nums text-zinc-600">Scheduled {formatInt(preview.scheduledHeadcount)} agents</p>
            <p className={`mt-0.5 flex items-center gap-1 font-medium text-[11px] tabular-nums ${preview.gap >= 0 ? "text-green-700" : "text-red-700"}`}>
              <GapIndicator gap={preview.gap} />
              {formatSignedInt(preview.gap)} vs. required
            </p>
          </div>
        ) : null}

        <p aria-live="polite" className="sr-only font-normal">
          {liveDescription}
        </p>
      </div>

      {/* Legend — shape/line-style + text, never color alone. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-100 pt-3">
        <span className="flex items-center gap-1.5 font-medium text-xs text-zinc-600">
          <span className="h-0.5 w-5 rounded-full bg-green-700" aria-hidden="true" />
          Required (demand)
        </span>
        <span className="flex items-center gap-1.5 font-medium text-xs text-zinc-600">
          <span className="h-0.5 w-5 rounded-full border-t-2 border-dashed border-zinc-400" aria-hidden="true" />
          Scheduled (capacity)
        </span>
        <span className="flex items-center gap-1.5 font-medium text-xs text-zinc-600">
          <span className="h-2.5 w-5 rounded-sm bg-red-50" style={{ backgroundImage: "repeating-linear-gradient(45deg, #fecaca 0 2px, transparent 2px 6px)" }} aria-hidden="true" />
          Under-target week
        </span>
        <span className="flex items-center gap-1.5 font-medium text-xs text-zinc-600">
          <Pin className="h-3 w-3 shrink-0 text-green-700" aria-hidden="true" />
          Pinned week
        </span>
      </div>
    </div>
  );
}
