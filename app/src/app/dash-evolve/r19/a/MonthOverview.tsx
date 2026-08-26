"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { MONTH_DAYS, MONTH_LABEL, MONTH_LEADING_BLANKS, MONTH_TOTAL_BOOKINGS } from "./data";
import { formatCount } from "./format";
import { BORDER, FOCUS, NUM, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TRANSITION, cx, heatTier } from "./tokens";
import { Card, CardHeader, HoverTip } from "./ui";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Month overview — the calendar's zoomed-out mode, a genuine 7-column heatmap (charts.catalog
 * "Heatmap"). Only the tracked week (Aug 24–30) has per-booking fidelity; the other 24 days come
 * from a hand-set day-total table (`MONTH_COUNTS_BASE` in data.ts). Because of that, resource
 * selection intentionally does NOT recompute this view — doing so would require fabricating
 * per-resource numbers for days no booking record exists for. The always-visible count on every
 * cell is the required table-fallback value for a heatmap; hover/focus adds the derived percentage,
 * never the only source of the number.
 */
export default function MonthOverview({ headingId }: { headingId: string }) {
  const [tipDay, setTipDay] = useState<number | null>(null);
  const leading = Array.from({ length: MONTH_LEADING_BLANKS }, (_, i) => i);
  const trailing = Array.from({ length: (7 - ((MONTH_LEADING_BLANKS + MONTH_DAYS.length) % 7)) % 7 }, (_, i) => i);

  return (
    <Card ariaLabelledBy={headingId} className="flex flex-col gap-3">
      <CardHeader
        titleId={headingId}
        title="Month overview"
        description={`${MONTH_LABEL} · ${formatCount(MONTH_TOTAL_BOOKINGS)} bookings tracked · resource filter doesn't apply here (see note)`}
      />

      <div aria-label={`${MONTH_LABEL} booking volume by day`} className="w-full">
        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} className={cx("pb-1 text-center text-[11px] font-medium uppercase tracking-wide", TEXT_CAPTION)}>
              {label}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {leading.map((i) => (
            <div key={`lead-${i}`} aria-hidden="true" className="rounded-lg bg-zinc-50" style={{ minHeight: 56 }} />
          ))}
          {MONTH_DAYS.map((md) => {
            const showTip = tipDay === md.day;
            const tipDomId = `month-tip-${md.day}`;
            // Which weekday column this day falls in (0=Mon…6=Sun) — used to keep the tooltip from
            // being centered past the viewport edge for cells near the left or right of the grid.
            const col = (MONTH_LEADING_BLANKS + md.day - 1) % 7;
            const tipAlign = col <= 1 ? "left-0" : col >= 5 ? "right-0" : "left-1/2 -translate-x-1/2";
            return (
              <div key={md.day} className="relative">
                <button
                  type="button"
                  aria-describedby={showTip ? tipDomId : undefined}
                  onMouseEnter={() => setTipDay(md.day)}
                  onMouseLeave={() => setTipDay((k) => (k === md.day ? null : k))}
                  onFocus={() => setTipDay(md.day)}
                  onBlur={() => setTipDay((k) => (k === md.day ? null : k))}
                  className={cx(
                    "flex w-full flex-col items-center justify-center gap-0.5 rounded-lg border py-2.5",
                    TRANSITION,
                    FOCUS,
                    md.isToday ? "border-sky-300" : "border-transparent",
                    heatTier(md.utilizationPct),
                  )}
                  style={{ minHeight: 56 }}
                >
                  <span className={cx("flex items-center gap-1 text-[12px] font-medium", TEXT_PRIMARY)}>
                    <span className="sr-only">{WEEKDAY_LABELS[col]}, Aug </span>
                    {md.day}
                    {md.hasConflict ? <AlertTriangle size={10} aria-hidden="true" className="text-rose-600" /> : null}
                  </span>
                  <span className={cx("text-[10px]", NUM, TEXT_CAPTION_MUTED)}>
                    {md.count}
                    <span className="sr-only"> bookings, {md.utilizationPct}% of the tracked baseline</span>
                  </span>
                  {md.hasConflict ? <span className="sr-only">, has a scheduling conflict</span> : null}
                </button>
                {showTip ? (
                  <HoverTip id={tipDomId} className={cx("top-full mt-1 w-36 max-w-[calc(100vw-2rem)]", tipAlign)}>
                    <p className="font-medium">Aug {md.day}, 2026</p>
                    <p className="mt-1 text-zinc-300">
                      {md.count} booking{md.count === 1 ? "" : "s"} · {md.utilizationPct}% of the tracked baseline
                    </p>
                    {md.hasConflict ? <p className="mt-1 text-rose-300">Includes a scheduling conflict</p> : null}
                  </HoverTip>
                ) : null}
              </div>
            );
          })}
          {trailing.map((i) => (
            <div key={`trail-${i}`} aria-hidden="true" className="rounded-lg bg-zinc-50" style={{ minHeight: 56 }} />
          ))}
        </div>
      </div>

      <p className={cx("text-[11px] leading-relaxed", BORDER, "border-t pt-2", TEXT_CAPTION)}>
        Cell shade is relative volume (0–6+ bookings/day). Aug 24–30 counts come from the tracked bookings below; the rest of August is a day-total figure only.
      </p>
    </Card>
  );
}
