"use client";

import type { KeyboardEvent, PointerEvent } from "react";
import { useRef } from "react";
import { TrendingUp } from "lucide-react";
import type { MetricId } from "./data";
import { DAYS, DAY_COUNT, GRAND_TOTALS, MAX_DAILY, METRIC_BY_ID, PEAK_DAY, WEEKDAYS, WEEKS, fmt, fmtMetric } from "./data";
import { ACCENT_LINE, BORDER, FOCUS, NUM, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHeader } from "./ui";

/**
 * The same 42 daily figures the calendar shades, drawn as a column trend so the two agree by
 * construction — both read `DAYS[i].values[metric]`. Keyboard: the plot is a slider; Arrow keys walk
 * the crosshair and `aria-valuetext` announces the day and its value, Enter/Space promotes the
 * crosshair day to the page selection (which moves the calendar and the agenda with it).
 *
 * Two series, never separated by colour alone: the daily columns are solid fills, the period average
 * is a dashed rule, and the selected day additionally carries a caret marker under the baseline.
 */

const VB_W = 420;
const VB_H = 112;
const SLOT = 10;
const BAR_W = 7;
const TOP = 10;
const BASE = 92;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export default function TrendChart({
  metric,
  selectedIndex,
  onSelect,
  cursorIndex,
  onCursor,
}: {
  metric: MetricId;
  selectedIndex: number;
  onSelect: (i: number) => void;
  cursorIndex: number | null;
  onCursor: (i: number | null) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const meta = METRIC_BY_ID[metric];
  const max = MAX_DAILY[metric];
  const total = GRAND_TOTALS[metric];
  const avg = total / DAY_COUNT;
  const peak = PEAK_DAY[metric];
  const activeIndex = cursorIndex ?? selectedIndex;
  const activeDay = DAYS[activeIndex];

  function heightFor(v: number): number {
    return round2(max === 0 ? 0 : (v / max) * (BASE - TOP));
  }
  function xFor(i: number): number {
    return round2(i * SLOT + (SLOT - BAR_W) / 2);
  }

  const avgY = round2(BASE - heightFor(avg));

  function indexFromClientX(clientX: number): number {
    const el = wrapRef.current;
    if (!el) return selectedIndex;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.min(DAY_COUNT - 1, Math.floor(ratio * DAY_COUNT));
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const cur = activeIndex;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onCursor(Math.max(0, cur - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onCursor(Math.min(DAY_COUNT - 1, cur + 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      onCursor(0);
    } else if (e.key === "End") {
      e.preventDefault();
      onCursor(DAY_COUNT - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(cur);
    }
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    onCursor(indexFromClientX(e.clientX));
  }

  return (
    <Card id="trend-card" className="flex flex-col">
      <CardHeader
        Icon={TrendingUp}
        title="Daily trend"
        description="The same 42 daily figures the calendar shades, in date order. Arrow keys move the crosshair; Enter selects that day."
      />

      <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { term: "Crosshair", value: fmtMetric(activeDay.values[metric], metric), note: `${WEEKDAYS[activeDay.weekdayIndex]}, ${activeDay.short}` },
          { term: "Peak day", value: fmtMetric(peak.values[metric], metric), note: `${WEEKDAYS[peak.weekdayIndex]}, ${peak.short}` },
          { term: "Daily average", value: `${round2(Math.round(avg * 10) / 10)}`, note: `${meta.short} per day` },
          { term: "Period total", value: fmtMetric(total, metric), note: "42 days" },
        ].map((s) => (
          <div key={s.term} className={cx("min-w-0 rounded-xl border px-3 py-2", BORDER, "bg-zinc-50")}>
            <dt className={cx("truncate text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION_MUTED)}>{s.term}</dt>
            <dd className={cx("mt-1 text-lg font-semibold leading-none", NUM, TEXT_PRIMARY)}>
              {s.value}
              <span className={cx("mt-1 block truncate text-[11px] font-normal leading-tight", NUM, TEXT_CAPTION_MUTED)}>{s.note}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div
        ref={wrapRef}
        role="slider"
        tabIndex={0}
        aria-label={`${meta.label} per day, 2 February to 15 March 2026. Arrow keys move the crosshair, Enter selects the day.`}
        aria-valuemin={0}
        aria-valuemax={DAY_COUNT - 1}
        aria-valuenow={activeIndex}
        aria-valuetext={`${activeDay.long}: ${fmt(activeDay.values[metric])} ${meta.spoken}`}
        onPointerMove={onPointerMove}
        onPointerLeave={() => onCursor(null)}
        onFocus={() => onCursor(activeIndex)}
        onBlur={() => onCursor(null)}
        onKeyDown={onKeyDown}
        onClick={() => onSelect(activeIndex)}
        className={cx("mt-4 w-full cursor-crosshair rounded-lg", FOCUS)}
      >
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="h-[148px] w-full" aria-hidden="true">
          <line x1="0" y1={BASE} x2={VB_W} y2={BASE} stroke="#e4e4e7" strokeWidth="1" />
          {DAYS.map((d) => {
            const h = heightFor(d.values[metric]);
            const isSelected = d.index === selectedIndex;
            const isCursor = d.index === activeIndex;
            return (
              <rect
                key={d.index}
                x={xFor(d.index)}
                y={round2(BASE - h)}
                width={BAR_W}
                height={Math.max(0.8, h)}
                fill={isSelected ? ACCENT_LINE : isCursor ? "#60a5fa" : "#bfdbfe"}
              />
            );
          })}
          <line x1="0" y1={avgY} x2={VB_W} y2={avgY} stroke="#3f3f46" strokeWidth="0.8" strokeDasharray="6,4" />
          <line x1={round2(activeIndex * SLOT + SLOT / 2)} y1={TOP - 6} x2={round2(activeIndex * SLOT + SLOT / 2)} y2={BASE} stroke="#3f3f46" strokeWidth="0.6" strokeDasharray="2,2" />
          <polygon
            points={`${round2(selectedIndex * SLOT + SLOT / 2 - 3)},${BASE + 8} ${round2(selectedIndex * SLOT + SLOT / 2 + 3)},${BASE + 8} ${round2(selectedIndex * SLOT + SLOT / 2)},${BASE + 2}`}
            fill={ACCENT_LINE}
          />
        </svg>
      </div>

      <div className="mt-1 flex" aria-hidden="true">
        {WEEKS.map((w) => (
          <span key={w.index} className={cx("min-w-0 flex-1 truncate text-[11px] font-normal", NUM, TEXT_CAPTION)}>
            {w.days[0].short}
          </span>
        ))}
      </div>

      <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-3 w-3 rounded-[2px]" style={{ backgroundColor: "#bfdbfe" }} />
          <span className={cx("text-[11px] font-normal", TEXT_CAPTION_MUTED)}>{`Daily ${meta.spoken}`}</span>
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-3 w-3 rounded-[2px]" style={{ backgroundColor: ACCENT_LINE }} />
          <span className={cx("text-[11px] font-normal", TEXT_CAPTION_MUTED)}>Selected day (caret below axis)</span>
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="block h-0 w-5 border-t-2 border-dashed border-zinc-600" />
          <span className={cx("text-[11px] font-normal", TEXT_CAPTION_MUTED)}>{`Period average, ${Math.round(avg * 10) / 10} ${meta.short}`}</span>
        </li>
      </ul>
    </Card>
  );
}
