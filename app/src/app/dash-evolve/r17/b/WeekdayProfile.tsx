"use client";

import { CalendarDays } from "lucide-react";
import type { MetricId } from "./data";
import { GRAND_TOTALS, METRICS, METRIC_BY_ID, WEEKDAYS_LONG, WEEKDAY_TOTALS, fmtMetric } from "./data";
import { BORDER, DIVIDE, NUM, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHeader, LoadBar } from "./ui";

/**
 * The calendar's column totals, written out as a labelled table with a share meter. It is the
 * heatmap's row/column companion in plain text and it is part of the design, not a hidden fallback.
 *
 * At 390px the two secondary numeric columns are REMOVED (`hidden sm:table-cell`) rather than
 * squeezed — a percentage column that shrinks under its own nowrap text is exactly the failure mode
 * the r16 review caught, so the narrow layout keeps three comfortable columns instead of five thin ones.
 */

export default function WeekdayProfile({ metric }: { metric: MetricId }) {
  const meta = METRIC_BY_ID[metric];
  const grand = GRAND_TOTALS[metric];
  /** The meter is scaled against the busiest weekday, not the grand total — otherwise every bar is
   *  a 14–19% stub and the column stops carrying any comparison at all. */
  const peakWeekday = WEEKDAY_TOTALS.reduce((m, c) => Math.max(m, c.totals[metric]), 0);
  /** The two metrics that are NOT on the calendar right now — otherwise the toggle produces a table
   *  with the same column heading twice ("OT h ... OT h"). */
  const others = METRICS.filter((m) => m.id !== metric);

  return (
    <Card id="profile-card" className="flex flex-col">
      <CardHeader
        Icon={CalendarDays}
        title="Weekday profile"
        description="The calendar's column totals in full. Share is that weekday's part of the whole period."
      />

      <table className="mt-3 w-full table-fixed text-left">
        <caption className={cx("mb-2 text-left text-xs font-normal", TEXT_CAPTION)}>
          {`${meta.label} by weekday across the six-week horizon — the same figures as the calendar's bottom row.`}
        </caption>
        <thead>
          <tr className={cx("border-b", BORDER)}>
            <th scope="col" className={cx("w-[26%] pb-2 pr-2 text-[11px] font-medium uppercase tracking-wider sm:w-[22%]", TEXT_CAPTION)}>
              Day
            </th>
            <th scope="col" className={cx("w-[24%] pb-2 pr-2 text-right text-[11px] font-medium uppercase tracking-wider sm:w-[16%]", TEXT_CAPTION)}>
              {meta.short}
            </th>
            {others.map((o) => (
              <th key={o.id} scope="col" className={cx("hidden pb-2 pr-2 text-right text-[11px] font-medium uppercase tracking-wider sm:table-cell sm:w-[16%]", TEXT_CAPTION)}>
                {o.short}
              </th>
            ))}
            <th scope="col" className={cx("w-[50%] pb-2 text-right text-[11px] font-medium uppercase tracking-wider sm:w-[30%]", TEXT_CAPTION)}>
              Share
            </th>
          </tr>
        </thead>
        <tbody className={cx("divide-y", DIVIDE)}>
          {WEEKDAY_TOTALS.map((c) => {
            const value = c.totals[metric];
            const pct = grand === 0 ? 0 : (value / grand) * 100;
            return (
              <tr key={c.weekdayIndex}>
                <th scope="row" className={cx("py-2 pr-2 text-left text-[13px] font-medium", TEXT_PRIMARY)}>
                  <span className="block truncate">{c.label}</span>
                  <span className="sr-only">{WEEKDAYS_LONG[c.weekdayIndex]}</span>
                </th>
                <td className={cx("py-2 pr-2 text-right text-[13px] font-medium whitespace-nowrap", NUM, TEXT_PRIMARY)}>{fmtMetric(value, metric)}</td>
                {others.map((o) => (
                  <td key={o.id} className={cx("hidden py-2 pr-2 text-right text-[13px] font-normal whitespace-nowrap sm:table-cell", NUM, TEXT_CAPTION_MUTED)}>
                    {fmtMetric(c.totals[o.id], o.id)}
                  </td>
                ))}
                <td className="py-2">
                  <span className="flex items-center justify-end gap-2">
                    <span className="hidden min-w-0 flex-1 sm:block">
                      <LoadBar pct={peakWeekday === 0 ? 0 : (value / peakWeekday) * 100} muted={c.weekdayIndex >= 5} />
                    </span>
                    <span className={cx("w-11 shrink-0 whitespace-nowrap text-right text-[13px] font-medium", NUM, TEXT_PRIMARY)}>{`${Math.round(pct)}%`}</span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className={cx("border-t-2", BORDER)}>
            <th scope="row" className={cx("pt-2 pr-2 text-left text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION_MUTED)}>
              Total
            </th>
            <td className={cx("pt-2 pr-2 text-right text-[13px] font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>{fmtMetric(grand, metric)}</td>
            {others.map((o) => (
              <td key={o.id} className={cx("hidden pt-2 pr-2 text-right text-[13px] font-semibold whitespace-nowrap sm:table-cell", NUM, TEXT_PRIMARY)}>
                {fmtMetric(GRAND_TOTALS[o.id], o.id)}
              </td>
            ))}
            <td className={cx("pt-2 text-right text-[13px] font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>100%</td>
          </tr>
        </tfoot>
      </table>
    </Card>
  );
}
