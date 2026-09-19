"use client";

/**
 * Excursion intensity heatmap — the page's single dominant visualization.
 * 7 days × 24 hours = 168 cells, fill = average excursion minutes for that slot.
 *
 * Two interaction scopes, deliberately kept separate (see ColdlineClient.tsx):
 *  - Hover/focus is a purely ephemeral inspector: `hovered` is local state to this
 *    component only, painted as a crosshair (row + column header tint) and read out
 *    in the aria-live strip below the grid. It never reaches the parent and never
 *    changes anything else on the page.
 *  - Click is a persistent, explicit "pin": it calls back up to the parent, which
 *    recomputes exactly two of the four KPI cards. The pinned cell keeps a visible
 *    inset ring after the pointer moves away, unlike the hover-only tint.
 *
 * Fill ramp is near-monochrome + a single accent, contrast-checked stop by stop
 * against its own text color (not assumed from the ramp's midpoint), WCAG relative
 * luminance formula, computed against each literal hex:
 *   zinc-50   #FAFAFA + zinc-900 text → 16.97:1
 *   violet-100 #EDE9FE + zinc-900 text → 14.92:1
 *   violet-200 #DDD6FE + zinc-900 text → 12.76:1
 *   violet-400 #A78BFA + zinc-900 text → 6.51:1
 *   violet-600 #7C3AED + white text     → 6.45:1
 * violet-500 is skipped entirely — at that stop neither zinc-900 (4.19:1) nor white
 * (4.23:1) clears the 4.5:1 text floor, so it never appears as a fill.
 *
 * Grade-B required fallback for this chart type: (1) hover/focus already surfaces the
 * exact value as standing text below the grid, and (2) a separate row/column table
 * further down repeats every value in plain semantic markup for screen-reader and
 * non-mouse users — transposed to hour-rows × day-columns so it stays narrow enough
 * to need no horizontal scrolling of its own.
 */

import { ChevronDown, MapPin, MapPinOff } from "lucide-react";
import { useState } from "react";
import { DAY_FULL, DAY_LABELS, TIER_FILL, TIER_LABEL, TIER_TEXT, formatMin, hourLabel, tierFor, type GridStats } from "./data";
import { BORDER, FOCUS, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

export interface PinnedCell {
  day: number;
  hour: number;
}

const TIERS = ["minimal", "light", "moderate", "heavy", "severe"] as const;
const TIER_RANGE: Record<(typeof TIERS)[number], string> = {
  minimal: "0–4",
  light: "5–14",
  moderate: "15–24",
  heavy: "25–34",
  severe: "35+",
};

export default function ExcursionHeatmap({
  matrix,
  stats,
  pinned,
  onPinCell,
  periodLabel,
}: {
  matrix: number[][];
  stats: GridStats;
  pinned: PinnedCell | null;
  onPinCell: (cell: PinnedCell | null) => void;
  periodLabel: string;
}) {
  const [hovered, setHovered] = useState<PinnedCell | null>(null);

  const peakMultiple = stats.avgPerSlot > 0 ? Math.round((stats.peak.value / stats.avgPerSlot) * 10) / 10 : 0;

  function cellReadout(cell: PinnedCell) {
    const v = matrix[cell.day][cell.hour];
    return `${DAY_FULL[cell.day]} ${hourLabel(cell.hour)} — ${formatMin(v)} out of band`;
  }

  return (
    <div>
      {/* Always-visible key stat — at-a-glance reading, not gated behind hover (page-brief-core §"단일 지배 시각화 완성도"). */}
      <p className={cx("text-sm font-normal leading-relaxed", TEXT_MUTED)}>
        Peak stress window <span className={cx("font-semibold", TEXT_PRIMARY)}>{DAY_FULL[stats.peak.day]} {hourLabel(stats.peak.hour)}</span> ·{" "}
        <span className={cx("font-semibold tabular-nums", TEXT_PRIMARY)}>{formatMin(stats.peak.value)}</span> —{" "}
        <span className="tabular-nums">{peakMultiple}×</span> the {periodLabel.toLowerCase()} network average.
      </p>

      <div className="mt-3 overflow-x-auto lg:overflow-visible">
        <table aria-label={`Excursion minutes by day and hour, ${periodLabel.toLowerCase()}`} className="w-full min-w-[888px] table-fixed border-collapse">
          <colgroup>
            <col className="w-[8%]" />
            {Array.from({ length: 24 }).map((_, h) => (
              <col key={h} className="w-[3.8333%]" />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="relative p-0">
                <span className="sr-only">Day</span>
              </th>
              {Array.from({ length: 24 }).map((_, h) => {
                const active = hovered?.hour === h;
                return (
                  <th
                    key={h}
                    scope="col"
                    className={cx(
                      "pb-1 text-center text-[10px] font-medium tabular-nums",
                      TRANSITION,
                      active ? "rounded-md bg-violet-50 text-violet-700" : TEXT_AUX,
                    )}
                  >
                    {h}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {DAY_LABELS.map((label, d) => {
              const rowActive = hovered?.day === d;
              return (
                <tr key={label}>
                  <th
                    scope="row"
                    className={cx(
                      "w-10 pr-1.5 text-left text-[11px] font-semibold",
                      TRANSITION,
                      rowActive ? "rounded-md bg-violet-50 text-violet-700" : TEXT_PRIMARY,
                    )}
                  >
                    {label}
                  </th>
                  {Array.from({ length: 24 }).map((_, h) => {
                    const value = matrix[d][h];
                    const tier = tierFor(value);
                    const isPinned = pinned?.day === d && pinned?.hour === h;
                    const isHovered = hovered?.day === d && hovered?.hour === h;
                    return (
                      <td key={h} className="p-0.5 text-center">
                        <button
                          type="button"
                          aria-pressed={isPinned}
                          aria-label={`${DAY_FULL[d]} ${hourLabel(h)}: ${formatMin(value)} out of band, ${TIER_LABEL[tier]} tier. ${isPinned ? "Pinned — press to unpin." : "Press to pin."}`}
                          onMouseEnter={() => setHovered({ day: d, hour: h })}
                          onFocus={() => setHovered({ day: d, hour: h })}
                          onMouseLeave={() => setHovered(null)}
                          onBlur={() => setHovered(null)}
                          onClick={() => onPinCell(isPinned ? null : { day: d, hour: h })}
                          className={cx(
                            "grid h-8 w-full place-items-center rounded-md text-[10px] font-semibold tabular-nums",
                            TRANSITION,
                            FOCUS,
                            TIER_FILL[tier],
                            TIER_TEXT[tier],
                            // Tailwind v4 note: `ring-*` + `ring-offset-*` renders fully transparent here — the
                            // pinned/hovered rings below stay inset (no offset utility) so they actually paint.
                            isPinned ? "ring-2 ring-inset ring-violet-600" : isHovered ? "ring-1 ring-inset ring-violet-400" : null,
                          )}
                        >
                          {value}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Ephemeral inspector readout — mirrors the crosshair tint above; screen readers get it via aria-live
          whether the trigger was mouse hover or keyboard focus. This state is local to this component. */}
      <div aria-live="polite" className={cx("mt-2 min-h-[2.25rem] rounded-lg border px-2.5 py-1.5 text-[11px] font-normal", BORDER, TEXT_MUTED, "bg-zinc-50")}>
        {hovered ? cellReadout(hovered) : pinned ? `Pinned — ${cellReadout(pinned)}` : "Hover or focus a cell for its exact reading."}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3" role="list" aria-label="Intensity scale">
          {TIERS.map((t) => (
            <span key={t} role="listitem" className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className={cx("h-3 w-3 rounded-sm border border-zinc-900/5", TIER_FILL[t])} />
              <span className={cx("text-[11px] font-normal", TEXT_MUTED)}>
                {TIER_LABEL[t]} <span className="tabular-nums">({TIER_RANGE[t]} min)</span>
              </span>
            </span>
          ))}
        </div>

        {pinned ? (
          <button
            type="button"
            onClick={() => onPinCell(null)}
            className={cx("inline-flex h-8 items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 text-[11px] font-medium text-violet-700", TRANSITION, FOCUS)}
          >
            <MapPinOff size={12} aria-hidden="true" />
            Clear pin — {DAY_LABELS[pinned.day]} {hourLabel(pinned.hour)}
          </button>
        ) : (
          <span className={cx("inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-normal", BORDER, TEXT_AUX)}>
            <MapPin size={12} aria-hidden="true" />
            Click a cell to pin it into the summary above
          </span>
        )}
      </div>

      <RowColumnFallback matrix={matrix} periodLabel={periodLabel} />
    </div>
  );
}

function RowColumnFallback({ matrix, periodLabel }: { matrix: number[][]; periodLabel: string }) {
  const [open, setOpen] = useState(false);
  return (
    <details className="mt-4" open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary className={cx("inline-flex cursor-pointer items-center gap-1.5 rounded-md text-[11px] font-medium", TEXT_MUTED, "hover:text-zinc-900", FOCUS)}>
        <ChevronDown size={13} aria-hidden="true" className={cx("transition-transform", open && "rotate-180")} />
        Row and column values as a table
      </summary>
      <div className="mt-2 overflow-x-auto lg:overflow-visible">
        <table className="w-full min-w-[480px] table-fixed border-collapse text-xs">
          <caption className={cx("mb-1.5 text-left text-[11px] font-normal", TEXT_AUX)}>
            Excursion minutes by hour (rows) and day (columns), {periodLabel.toLowerCase()}
          </caption>
          <colgroup>
            <col className="w-[16%]" />
            {DAY_LABELS.map((d) => (
              <col key={d} className="w-[12%]" />
            ))}
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              <th scope="col" className={cx("py-1.5 text-left font-medium", TEXT_AUX)}>
                Hour
              </th>
              {DAY_LABELS.map((d) => (
                <th key={d} scope="col" className={cx("py-1.5 text-right font-medium", TEXT_AUX)}>
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {Array.from({ length: 24 }).map((_, h) => (
              <tr key={h}>
                <th scope="row" className={cx("py-1 text-left font-medium tabular-nums", TEXT_PRIMARY)}>
                  {hourLabel(h)}
                </th>
                {DAY_LABELS.map((_, d) => (
                  <td key={d} className={cx("py-1 text-right tabular-nums", TEXT_MUTED)}>
                    {matrix[d][h]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
