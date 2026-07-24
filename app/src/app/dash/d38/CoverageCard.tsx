"use client";

import { Radio } from "lucide-react";
import { ENGINEERS, TODAY_TREND, WEEK_OWNERS, WEEKDAY_LABELS, WEEK_TREND, engineerById, formatCount, secondaryFor } from "./data";
import { BORDER, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import OnCallRing, { type RingRange } from "./OnCallRing";
import { Card, CardHeader, SegmentedControl, Sparkline } from "./ui";

const RANGE_OPTIONS: { id: RingRange; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
];

export default function CoverageCard({
  range,
  onRangeChange,
  highlightHour,
  highlightDay,
}: {
  range: RingRange;
  onRangeChange: (r: RingRange) => void;
  highlightHour: number | null;
  highlightDay: number | null;
}) {
  const trend = range === "today" ? TODAY_TREND : WEEK_TREND;
  const total = trend.reduce((a, b) => a + b, 0);
  const bucketLabel = range === "today" ? "per hour" : "per day";

  return (
    <Card>
      <CardHeader
        Icon={Radio}
        titleId="coverage-heading"
        title="24-hour on-call coverage"
        description="Colored arcs show who is paged for each block · hover or focus a segment for the exact reading"
        action={<SegmentedControl ariaLabel="Coverage time range" options={RANGE_OPTIONS} value={range} onChange={onRangeChange} size="sm" />}
      />

      <div className={cx("mt-4 border-t pt-4", BORDER)} aria-labelledby="coverage-heading">
        <OnCallRing range={range} highlightHour={highlightHour} highlightDay={highlightDay} />
      </div>

      <div className={cx("mt-4 grid grid-cols-1 gap-4 border-t pt-4 sm:grid-cols-[1fr_auto]", BORDER)}>
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>Incidents triggered, {bucketLabel}</p>
            <p className={cx("text-sm font-semibold", TEXT_PRIMARY, NUM)}>{formatCount(total)} total</p>
          </div>
          <div className="mt-2 h-11">
            <Sparkline values={trend} stroke="stroke-teal-300" fill="fill-teal-300" />
          </div>
          <div className="sr-only">
            <table>
              <caption>Incidents triggered {bucketLabel}, {range === "today" ? "24 hourly buckets" : "7 daily buckets, Monday to Sunday"}</caption>
              <thead>
                <tr>
                  <th scope="col">{range === "today" ? "Hour" : "Day"}</th>
                  <th scope="col">Incidents</th>
                </tr>
              </thead>
              <tbody>
                {trend.map((v, i) => (
                  <tr key={i}>
                    <td>{range === "today" ? `${String(i).padStart(2, "0")}:00` : WEEKDAY_LABELS[i]}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={cx("mt-4 border-t pt-4", BORDER)}>
        <p className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>This week&rsquo;s primary rotation</p>
        <div className="mt-2 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm lg:min-w-0 lg:table-fixed">
            <caption className="sr-only">Primary on-call owner for each day this week, with secondary escalation contact</caption>
            <colgroup>
              <col className="w-[14%]" />
              <col className="w-[30%]" />
              <col className="w-[26%]" />
              <col className="w-[30%]" />
            </colgroup>
            <thead>
              <tr className={cx("border-b text-[11px] uppercase tracking-wide", BORDER, TEXT_CAPTION)}>
                <th scope="col" className="py-2 pl-3">
                  Day
                </th>
                <th scope="col" className="py-2">
                  Primary owner
                </th>
                <th scope="col" className="py-2">
                  Role
                </th>
                <th scope="col" className="py-2 pr-3">
                  Secondary
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {WEEKDAY_LABELS.map((day, i) => {
                const owner = engineerById(WEEK_OWNERS[i]);
                const secondary = secondaryFor(owner.id);
                return (
                  <tr key={day}>
                    <td className={cx("whitespace-nowrap py-2 pl-3 font-medium", TEXT_PRIMARY)}>{day}</td>
                    <td className={cx("truncate py-2 pr-2", TEXT_SECONDARY)}>{owner.name}</td>
                    <td className={cx("truncate py-2 pr-2 text-xs", TEXT_CAPTION)}>{owner.role}</td>
                    <td className={cx("truncate py-2 pr-3 text-xs", TEXT_CAPTION)}>{secondary.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className={cx("mt-3 text-[11px] leading-snug", TEXT_CAPTION)}>{ENGINEERS.length} engineers rotate through the pager schedule; each hour block always shows its owner&rsquo;s name directly on the ring.</p>
    </Card>
  );
}
