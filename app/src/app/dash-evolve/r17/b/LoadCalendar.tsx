"use client";

import type { KeyboardEvent } from "react";
import { useRef } from "react";
import { CalendarRange, CircleDot } from "lucide-react";
import type { MetricId } from "./data";
import { DAYS, DAY_COUNT, MAX_DAILY, METRICS, METRIC_BY_ID, WEEKDAYS, WEEKDAYS_LONG, WEEKS, WEEKDAY_TOTALS, GRAND_TOTALS, fmt, fmtMetric, levelOf, rampBands } from "./data";
import { BORDER, FOCUS, NUM, RAMP, RAMP_BORDER, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Card, CardHeader, SegmentedControl } from "./ui";

/**
 * The page's spine: a 6-week x 7-day intensity calendar.
 *
 * A11y grade B is met inside one artefact rather than by bolting a hidden duplicate onto it — the
 * heatmap IS a semantic `<table>`: `<caption>`, `<th scope="col">` weekday headers, `<th scope="row">`
 * week headers, a `<td>` row-total column and a `<tfoot>` of column totals. Every cell prints its own
 * value as always-visible text; the hover/focus overlay adds the other two metrics on top.
 *
 * Below `lg` the grid does NOT shrink. A 9-column %-width table survives an overflow sweep at 390px
 * and still bleeds nowrap text across its own column edges, so the desktop table is replaced by a
 * genuinely different layout: a week-grouped stacked list where each day is a full-width row with a
 * proportional load bar and a right-aligned value.
 */

export default function LoadCalendar({
  metric,
  onMetricChange,
  selectedIndex,
  onSelect,
  readoutIndex,
  onReadout,
}: {
  metric: MetricId;
  onMetricChange: (m: MetricId) => void;
  selectedIndex: number;
  onSelect: (i: number) => void;
  readoutIndex: number | null;
  onReadout: (i: number | null) => void;
}) {
  const cellRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const meta = METRIC_BY_ID[metric];
  const max = MAX_DAILY[metric];
  const bands = rampBands(max);
  const readDay = DAYS[readoutIndex ?? selectedIndex];

  function move(from: number, delta: number) {
    const next = Math.min(DAY_COUNT - 1, Math.max(0, from + delta));
    if (next === from) return;
    onSelect(next);
    onReadout(next);
    cellRefs.current[next]?.focus();
  }

  function onCellKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      move(i, -1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      move(i, 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(i, -7);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      move(i, 7);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(i, -(i % 7));
    } else if (e.key === "End") {
      e.preventDefault();
      move(i, 6 - (i % 7));
    }
  }

  function cellStyle(level: number) {
    return { backgroundColor: RAMP[level], borderColor: RAMP_BORDER[level] };
  }

  return (
    <Card id="calendar-card" className="flex flex-col">
      <CardHeader
        Icon={CalendarRange}
        title="Bay load calendar"
        description={`Six weeks, Feb 2 – Mar 15 2026. Cell shade and printed number are the same figure; edge columns and the bottom row carry the week and weekday totals.`}
        action={
          <SegmentedControl
            ariaLabel="Calendar load metric"
            value={metric}
            onChange={onMetricChange}
            options={METRICS.map((m) => ({ id: m.id, label: m.label }))}
          />
        }
      />

      {/* Always-visible readout — doubles as the polite live region for keyboard cell moves. */}
      <p
        aria-live="polite"
        className={cx("mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-xl border px-3 py-2.5", BORDER, "bg-zinc-50")}
      >
        <span className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION_MUTED)}>
          {readoutIndex === null ? "Selected day" : "Reading"}
        </span>
        <span className={cx("text-[13px] font-semibold", TEXT_PRIMARY)}>{readDay.long}</span>
        <span className={cx("text-[13px] font-normal", NUM, TEXT_CAPTION_MUTED)}>
          {`${fmt(readDay.values.orders)} work orders · ${fmt(readDay.values.hours)} bay hours · ${fmt(readDay.values.overtime)} overtime hours`}
        </span>
        <span className={cx("text-[13px] font-normal", NUM, TEXT_CAPTION_MUTED)}>
          {readDay.capacityHours === 0 ? "· off-shift call-in" : `· ${Math.round((readDay.values.hours / readDay.capacityHours) * 100)}% of a ${readDay.capacityHours}h shift`}
        </span>
      </p>

      {/* Ramp legend — numeric bands printed, never hover-only. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>{`${meta.label} per day`}</span>
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1">
            <span aria-hidden="true" className="h-3.5 w-3.5 rounded-[3px] border" style={cellStyle(0)} />
            <span className={cx("text-[11px] font-normal", NUM, TEXT_CAPTION_MUTED)}>0</span>
          </span>
          {bands.map((b) => (
            <span key={b.level} className="flex items-center gap-1">
              <span aria-hidden="true" className="h-3.5 w-3.5 rounded-[3px] border" style={cellStyle(b.level)} />
              <span className={cx("text-[11px] font-normal", NUM, TEXT_CAPTION_MUTED)}>{b.lo === b.hi ? b.lo : `${b.lo}–${b.hi}`}</span>
            </span>
          ))}
        </span>
      </div>

      {/* ------------------------------------------------ desktop: intensity grid */}
      <table className="mt-3 hidden w-full table-fixed border-separate border-spacing-1 lg:table">
        <caption className={cx("sr-only text-left text-xs font-normal", TEXT_CAPTION)}>
          {`${meta.label} per day across six weeks, 2 February to 15 March 2026. Rows are weeks, columns are weekdays; the last column holds week totals and the last row holds weekday totals.`}
        </caption>
        <colgroup>
          <col style={{ width: "15%" }} />
          {WEEKDAYS.map((d) => (
            <col key={d} style={{ width: "10.4%" }} />
          ))}
          <col style={{ width: "12%" }} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className={cx("px-1 pb-1 text-left text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>
              Week
            </th>
            {WEEKDAYS.map((d, i) => (
              <th key={d} scope="col" className={cx("px-1 pb-1 text-left text-[11px] font-medium uppercase tracking-wider", i >= 5 ? TEXT_CAPTION_MUTED : TEXT_CAPTION)}>
                {d}
                <span className="sr-only">{` (${WEEKDAYS_LONG[i]})`}</span>
              </th>
            ))}
            <th scope="col" className={cx("px-1 pb-1 text-right text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>
              Week total
            </th>
          </tr>
        </thead>
        <tbody>
          {WEEKS.map((w) => (
            <tr key={w.index}>
              <th scope="row" className="px-1 py-0 text-left align-middle">
                <span className={cx("block text-[13px] font-medium leading-tight", TEXT_PRIMARY)}>{w.label}</span>
                <span className={cx("mt-0.5 block whitespace-nowrap text-[11px] font-normal leading-tight", NUM, TEXT_CAPTION)}>{w.range}</span>
              </th>
              {w.days.map((d) => {
                const value = d.values[metric];
                const level = levelOf(value, max);
                const selected = d.index === selectedIndex;
                return (
                  <td key={d.index} className="p-0 align-top">
                    <button
                      ref={(el) => {
                        cellRefs.current[d.index] = el;
                      }}
                      type="button"
                      aria-current={selected ? "date" : undefined}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => {
                        onSelect(d.index);
                        onReadout(d.index);
                      }}
                      onKeyDown={(e) => onCellKeyDown(e, d.index)}
                      onMouseEnter={() => onReadout(d.index)}
                      onMouseLeave={() => onReadout(null)}
                      onFocus={() => onReadout(d.index)}
                      onBlur={() => onReadout(null)}
                      style={cellStyle(level)}
                      className={cx(
                        "group relative flex h-16 w-full flex-col justify-between rounded-lg border px-2 py-1.5 text-left",
                        TRANSITION,
                        FOCUS,
                        "hover:z-20 focus-visible:z-20",
                        level === 0 ? "text-zinc-600" : "text-zinc-900",
                      )}
                    >
                      <span className="flex items-center gap-1 text-[11px] font-normal leading-none tabular-nums">
                        {d.dayOfMonth === 1 || d.index === 0 ? <span className="font-medium">{d.monthShort}</span> : null}
                        {d.dayOfMonth}
                        <span className="sr-only">{` ${d.long}`}</span>
                      </span>
                      <span className={cx("block text-right leading-none", NUM, selected ? "text-base font-semibold" : "text-[15px] font-medium")}>
                        {fmt(value)}
                        <span className="sr-only">{` ${meta.spoken}`}</span>
                      </span>
                      {selected ? <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-lg border-2 border-blue-700" /> : null}

                      {/* hover / focus value overlay */}
                      <span
                        aria-hidden="true"
                        className={cx(
                          "pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 hidden w-44 -translate-x-1/2 rounded-lg border px-2.5 py-2 opacity-0 shadow-lg shadow-zinc-950/10 group-hover:block group-hover:opacity-100 group-focus-visible:block group-focus-visible:opacity-100",
                          BORDER,
                          "bg-white",
                        )}
                      >
                        <span className={cx("block whitespace-nowrap text-[11px] font-semibold", TEXT_PRIMARY)}>{`${WEEKDAYS[d.weekdayIndex]}, ${d.short}`}</span>
                        <span className={cx("mt-1 block whitespace-nowrap text-[11px] font-normal", NUM, TEXT_CAPTION_MUTED)}>{`${fmt(d.values.orders)} orders · ${fmt(d.values.hours)}h bay`}</span>
                        <span className={cx("block whitespace-nowrap text-[11px] font-normal", NUM, TEXT_CAPTION_MUTED)}>{`${fmt(d.values.overtime)}h overtime`}</span>
                      </span>
                    </button>
                  </td>
                );
              })}
              <td className={cx("rounded-lg border px-2 py-1.5 align-middle", BORDER, "bg-zinc-50")}>
                <span className={cx("block text-right text-[15px] font-semibold leading-none", NUM, TEXT_PRIMARY)}>{fmtMetric(w.totals[metric], metric)}</span>
                <span className={cx("mt-1 block text-right text-[11px] font-normal leading-none", TEXT_CAPTION_MUTED)}>{meta.short}</span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" className={cx("px-1 py-2 text-left text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>
              Weekday total
            </th>
            {WEEKDAY_TOTALS.map((c) => (
              <td key={c.weekdayIndex} className={cx("rounded-lg border px-2 py-2 align-middle", BORDER, "bg-zinc-50")}>
                <span className={cx("block text-right text-[13px] font-semibold leading-none", NUM, TEXT_PRIMARY)}>{fmtMetric(c.totals[metric], metric)}</span>
              </td>
            ))}
            <td className={cx("rounded-lg border-2 px-2 py-2 align-middle border-blue-200 bg-blue-50")}>
              <span className={cx("block text-right text-[15px] font-semibold leading-none", NUM, "text-blue-900")}>{fmtMetric(GRAND_TOTALS[metric], metric)}</span>
              <span className={cx("mt-1 block text-right text-[11px] font-normal leading-none", "text-blue-800")}>period</span>
            </td>
          </tr>
        </tfoot>
      </table>

      {/* -------------------------------------- below lg: week-grouped stacked list */}
      <div className="mt-4 lg:hidden">
        <p className={cx("mb-3 text-xs font-normal", TEXT_CAPTION)}>
          {`Grouped by week — tap a day to load its agenda. ${meta.label} shown; bar length is the day against the busiest day of the period (${fmt(max)}).`}
        </p>
        <div className={cx("divide-y rounded-xl border", BORDER)}>
          {WEEKS.map((w) => (
            <div key={w.index} className="p-2">
              <div className="flex items-baseline justify-between gap-2 px-1.5 pb-1.5">
                <h3 className={cx("text-[13px] font-semibold", TEXT_PRIMARY)}>
                  {w.label}
                  <span className={cx("ml-1.5 text-[11px] font-normal", NUM, TEXT_CAPTION)}>{w.range}</span>
                </h3>
                <span className={cx("shrink-0 whitespace-nowrap text-[13px] font-semibold", NUM, TEXT_PRIMARY)}>
                  {fmtMetric(w.totals[metric], metric)}
                </span>
              </div>
              <ul className="flex flex-col gap-1">
                {w.days.map((d) => {
                  const value = d.values[metric];
                  const selected = d.index === selectedIndex;
                  const pct = max === 0 ? 0 : (value / max) * 100;
                  return (
                    <li key={d.index}>
                      <button
                        type="button"
                        aria-current={selected ? "date" : undefined}
                        onClick={() => {
                          onSelect(d.index);
                          onReadout(null);
                        }}
                        className={cx(
                          "flex min-h-11 w-full items-center gap-3 rounded-lg border px-2.5 py-2 text-left",
                          TRANSITION,
                          FOCUS,
                          selected ? "border-blue-700 bg-blue-50" : cx(BORDER, "bg-white hover:bg-zinc-50"),
                        )}
                      >
                        <span className="flex w-14 shrink-0 items-center gap-1">
                          {selected ? <CircleDot size={12} aria-hidden="true" className="shrink-0 text-blue-700" /> : null}
                          <span className="min-w-0">
                            <span className={cx("block text-[11px] font-normal leading-tight", TEXT_CAPTION_MUTED)}>{WEEKDAYS[d.weekdayIndex]}</span>
                            <span className={cx("block whitespace-nowrap text-[13px] font-medium leading-tight", NUM, TEXT_PRIMARY)}>{d.short}</span>
                          </span>
                        </span>
                        <span className="min-w-0 flex-1">
                          {value === 0 ? (
                            <span className={cx("block text-[11px] font-normal", TEXT_CAPTION_MUTED)}>Shop closed — no bay work</span>
                          ) : (
                            <span aria-hidden="true" className="block h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                              <span className="block h-full rounded-full bg-blue-500" style={{ width: `${Math.max(3, Math.round(pct))}%` }} />
                            </span>
                          )}
                        </span>
                        <span className={cx("w-16 shrink-0 whitespace-nowrap text-right text-[13px] leading-none", NUM, selected ? "font-semibold text-zinc-900" : "font-medium text-zinc-900")}>
                          {fmtMetric(value, metric)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className={cx("flex items-baseline justify-between gap-2 px-3.5 py-3", "bg-blue-50")}>
            <span className={cx("text-[11px] font-medium uppercase tracking-wider", "text-blue-800")}>Period total</span>
            <span className={cx("whitespace-nowrap text-[15px] font-semibold", NUM, "text-blue-900")}>{fmtMetric(GRAND_TOTALS[metric], metric)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
