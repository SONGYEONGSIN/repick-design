"use client";

import { useState } from "react";
import {
  ENTITIES,
  LATEST_INDEX,
  PERIODS,
  biggestMover,
  currentLeaderId,
  entityById,
  rankAt,
  valueAt,
  visibleRange,
  type RangeMode,
} from "./data";
import { formatCount } from "./format";
import { FOCUS_RING, RankDelta, SegmentedControl } from "./ui";

/**
 * The hero visualization: a bump chart of weekly rank (1 = top) for all 8 tracked integrations.
 * Both pieces of state that drive it — which period window is visible, and which single line is
 * highlighted — live entirely inside this one component. Nothing outside this file ever reads
 * `selectedId`: there is no separate detail panel anywhere on the page. Selecting a line makes
 * the chart highlight that line in place and print its own rank at every vertex along itself;
 * the chart IS its own detail view.
 *
 * Every piece of TEXT in this chart (period-axis labels, per-vertex rank numbers, and the entity
 * name labels) is a real HTML element positioned over the chart by percentage, never SVG
 * `<text>`. The SVG itself scales fluidly with the card (`preserveAspectRatio="none"` against an
 * aspect-ratio box) so it never needs its own horizontal scrollbar — but that same scaling would
 * also scale a CSS pixel font-size set on SVG text, shrinking it to the point of illegibility on
 * a narrow phone and oversizing it on an ultrawide monitor. HTML text laid over the top is
 * unaffected by that transform, so every label stays a constant, real, readable size.
 */

const RANK_COUNT = ENTITIES.length; // 8
const RANK_TICKS = Array.from({ length: RANK_COUNT }, (_, i) => i + 1);
const CHART_W = 760;
const CHART_H = 300;
// `left` is deliberately tiny: the rank axis has no tick labels inside the chart (an 8-step
// margin that narrow has no room for legible constant-px text once the card shrinks to phone
// width — see the fallback table for exact ranks instead), so nearly the whole width goes to
// the plotted lines.
const MARGIN = { top: 16, right: 108, bottom: 36, left: 8 };
const PLOT_W = CHART_W - MARGIN.left - MARGIN.right; // 644
const PLOT_H = CHART_H - MARGIN.top - MARGIN.bottom; // 248
const LABEL_COL_PCT = ((CHART_W - MARGIN.left - PLOT_W - 8) / CHART_W) * 100; // width reserved for end-of-line name labels

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function xFor(indexInWindow: number, windowSize: number): number {
  if (windowSize <= 1) return round2(MARGIN.left + PLOT_W / 2);
  return round2(MARGIN.left + (indexInWindow / (windowSize - 1)) * PLOT_W);
}

function yFor(rank: number): number {
  return round2(MARGIN.top + ((rank - 1) / (RANK_COUNT - 1)) * PLOT_H);
}

function pctX(x: number): number {
  return (x / CHART_W) * 100;
}

function pctY(y: number): number {
  return (y / CHART_H) * 100;
}

const RANGE_OPTIONS: { value: RangeMode; label: string }[] = [
  { value: "last4", label: "Last 4 weeks" },
  { value: "all8", label: "All 8 weeks" },
];

export function BumpChartHero() {
  const [rangeMode, setRangeMode] = useState<RangeMode>("all8");
  const [selectedId, setSelectedId] = useState<string | null>(currentLeaderId());

  const { startIdx, endIdx } = visibleRange(rangeMode);
  const visibleIndices: number[] = [];
  for (let i = startIdx; i <= endIdx; i++) visibleIndices.push(i);
  const windowSize = visibleIndices.length;
  const lastLocalIndex = windowSize - 1;
  const lastPeriodIdx = visibleIndices[lastLocalIndex];

  const leaderId = currentLeaderId();
  const leader = entityById(leaderId);
  const mover = biggestMover(startIdx, endIdx);
  const moverEntity = entityById(mover.id);
  const rangeLabel = rangeMode === "last4" ? "last 4 weeks" : "full 8-week history";

  function toggleSelect(id: string) {
    setSelectedId((cur) => (cur === id ? null : id));
  }

  const anySelected = selectedId !== null;
  // Draw the selected line last so it always renders on top of the others.
  const drawOrder = selectedId ? [...ENTITIES.filter((e) => e.id !== selectedId), entityById(selectedId)] : ENTITIES;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 id="leaderboard-chart-heading" className="font-semibold text-sm text-zinc-50">
            Integration Rank Leaderboard
          </h2>
          <p className="mt-0.5 max-w-md font-normal text-xs text-zinc-400">
            Weekly rank among the 8 most-connected integrations across every workspace, {PERIODS[0].label} – {PERIODS[LATEST_INDEX].label}.
          </p>
        </div>
        <SegmentedControl label="Period range" options={RANGE_OPTIONS} value={rangeMode} onChange={setRangeMode} />
      </div>

      {/* Always-visible headline readouts — never hover-only, and independent of the chart's own
          click/focus selection below. */}
      <div className="mt-5 flex flex-wrap items-start gap-x-8 gap-y-4">
        <div className="min-w-0">
          <p className="font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">Current #1</p>
          <p className="mt-1 font-semibold text-3xl tabular-nums text-zinc-50 [font-family:var(--font-display-mono)]">{leader.name}</p>
          <p className="mt-1 font-normal text-xs text-zinc-400">{formatCount(valueAt(leaderId, LATEST_INDEX))} active connections this week</p>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">Biggest Mover · {rangeLabel}</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <p className="font-semibold text-3xl tabular-nums text-zinc-50 [font-family:var(--font-display-mono)]">{moverEntity.name}</p>
            <RankDelta delta={mover.delta} />
          </div>
          <p className="mt-1 font-normal text-xs text-zinc-400">
            Rank {rankAt(mover.id, startIdx)} → Rank {rankAt(mover.id, endIdx)}
          </p>
        </div>
      </div>

      <p className="mt-4 font-normal text-xs text-zinc-400">
        Select an integration&apos;s name on the right to follow just that line — its rank appears at every point along it. The exact numbers behind
        every line are also listed in the table below.
      </p>

      <div className="relative mt-3 w-full overflow-hidden" style={{ aspectRatio: `${CHART_W} / ${CHART_H}` }}>
        {/* Geometry only — no text. Fluid and scaled, so a CSS pixel font-size set in here would
            shrink or grow with the card instead of staying a constant readable size. */}
        {/* No <title> element here: React 19 hoists any literal `<title>` tag into document head-
            metadata handling regardless of nesting context (even inside an SVG), which renders it
            in a different DOM position on the client than the server emitted it and breaks
            hydration. The SVG is already `aria-hidden="true"` (decorative geometry only -- the
            always-visible headline text and the real HTML labels over the chart carry the actual
            accessible content), so no in-SVG title is needed. */}
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <g aria-hidden="true">
            {RANK_TICKS.map((rank) => (
              <line key={`row-${rank}`} x1={MARGIN.left} x2={MARGIN.left + PLOT_W} y1={yFor(rank)} y2={yFor(rank)} className="stroke-white/5" strokeWidth={1} />
            ))}
            {visibleIndices.map((periodIdx, i) => (
              <line key={`col-${periodIdx}`} x1={xFor(i, windowSize)} x2={xFor(i, windowSize)} y1={MARGIN.top} y2={MARGIN.top + PLOT_H} className="stroke-white/5" strokeWidth={1} />
            ))}
          </g>

          {drawOrder.map((entity) => {
            const isSelected = entity.id === selectedId;
            const points = visibleIndices.map((periodIdx, i) => `${xFor(i, windowSize)},${yFor(rankAt(entity.id, periodIdx))}`).join(" ");
            const lineClass = isSelected ? "stroke-sky-400" : anySelected ? "stroke-zinc-700" : "stroke-zinc-500";

            return (
              <g key={entity.id}>
                <polyline
                  points={points}
                  fill="none"
                  className={`${lineClass} motion-safe:transition-colors motion-safe:duration-200`}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {isSelected
                  ? visibleIndices.map((periodIdx, i) => (
                      <circle key={periodIdx} cx={xFor(i, windowSize)} cy={yFor(rankAt(entity.id, periodIdx))} r={2.5} className="fill-sky-400" />
                    ))
                  : null}
              </g>
            );
          })}
        </svg>

        {/* Decorative text, laid over the SVG at a constant real pixel size. Every number here is
            also in the fallback table below, so hiding this layer from assistive tech loses
            nothing. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {visibleIndices.map((periodIdx, i) => (
            <span
              key={periodIdx}
              style={{ left: `${pctX(xFor(i, windowSize))}%`, top: `${pctY(CHART_H - 11)}%` }}
              className="absolute block -translate-x-1/2 whitespace-nowrap font-normal text-[9px] text-zinc-400"
            >
              {PERIODS[periodIdx].label}
            </span>
          ))}

          {selectedId
            ? visibleIndices.map((periodIdx, i) => (
                <span
                  key={periodIdx}
                  style={{
                    left: `${pctX(xFor(i, windowSize))}%`,
                    top: `${pctY(yFor(rankAt(selectedId, periodIdx)))}%`,
                    transform: "translate(-50%, calc(-100% - 6px))",
                  }}
                  className="absolute block whitespace-nowrap font-medium text-[10px] tabular-nums text-sky-200"
                >
                  {rankAt(selectedId, periodIdx)}
                </span>
              ))
            : null}
        </div>

        {/* Real HTML buttons, one per integration, positioned by percentage so they track the
            SVG above at any container width. This is the keyboard- and pointer-accessible
            control for the "no separate detail component" selection: it only ever toggles this
            same chart's own highlight, in place. */}
        <div role="group" aria-label="Highlight one integration's line">
          {ENTITIES.map((entity) => {
            const isSelected = entity.id === selectedId;
            // Dimming for a non-selected label while another line is active never drops below
            // the `text-zinc-400` dark-surface floor — it uses opacity on that same safe color
            // token instead of a darker gray step.
            const labelClass = isSelected ? "text-sky-300 font-medium" : anySelected ? "text-zinc-400 font-normal opacity-50" : "text-zinc-400 font-normal";

            return (
              <button
                key={entity.id}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${entity.name}, currently rank ${rankAt(entity.id, lastPeriodIdx)} of ${RANK_COUNT}${
                  isSelected ? ", highlighted, showing rank at every point" : ""
                }`}
                onClick={() => toggleSelect(entity.id)}
                style={{ left: `${pctX(xFor(lastLocalIndex, windowSize) + 8)}%`, top: `${pctY(yFor(rankAt(entity.id, lastPeriodIdx)))}%`, width: `${LABEL_COL_PCT}%` }}
                className={`absolute -translate-y-1/2 truncate rounded px-0.5 text-left text-[11px] motion-safe:transition-colors ${labelClass} ${FOCUS_RING}`}
              >
                {entity.shortName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
