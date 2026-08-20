"use client";

import { CalendarPlus, ClipboardList, MoonStar } from "lucide-react";
import type { Day, MetricId } from "./data";
import { BAY_BY_ID, METRIC_BY_ID, fmt, fmtTime, initialsOf } from "./data";
import { ACCENT_SUBTLE, BORDER, FOCUS, NUM, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Card, CardHeader, StatusBadge } from "./ui";

/**
 * Drill-down for whichever calendar cell is selected: a compact summary strip over an ordered
 * agenda of that day's real bookings. Times are the shop clock (America/Chicago) on a fixed literal
 * date — the shop runs two shifts, 06:30 to 22:00.
 */

export default function DayAgenda({ day, metric }: { day: Day; metric: MetricId }) {
  const meta = METRIC_BY_ID[metric];
  const utilisation = day.capacityHours === 0 ? null : Math.round((day.values.hours / day.capacityHours) * 100);

  const summary: { term: string; value: string; note: string }[] = [
    { term: "Work orders", value: fmt(day.values.orders), note: `${fmt(new Set(day.orders.map((o) => o.bayId)).size)} bays used` },
    { term: "Bay hours", value: `${fmt(day.values.hours)}h`, note: day.capacityHours === 0 ? "no scheduled shift" : `of ${day.capacityHours}h capacity` },
    { term: "Overtime", value: `${fmt(day.values.overtime)}h`, note: day.values.hours === 0 ? "none booked" : `${Math.round((day.values.overtime / day.values.hours) * 100)}% of bay time` },
    { term: "Shift use", value: utilisation === null ? "Off-shift" : `${utilisation}%`, note: utilisation === null ? "call-in crew only" : utilisation > 90 ? "at the ceiling" : "inside the ceiling" },
  ];

  return (
    <Card id="agenda-card" className="flex flex-col">
      <CardHeader
        Icon={ClipboardList}
        title="Day agenda"
        description={`Every booking on the selected calendar cell, in start order. Times are shop-floor local (CT).`}
        action={
          <button type="button" className={cx("inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium", BORDER, TEXT_PRIMARY, "bg-white hover:bg-zinc-100", TRANSITION, FOCUS)}>
            <CalendarPlus size={14} aria-hidden="true" className={TEXT_CAPTION} />
            Book here
          </button>
        }
      />

      <p className={cx("mt-3 text-[15px] font-semibold tracking-tight", TEXT_PRIMARY)}>{day.long}</p>
      <p className={cx("mt-0.5 text-xs font-normal", TEXT_CAPTION)}>
        {`Highlighted on the calendar and on the trend below · ${fmt(day.values[metric])} ${meta.spoken}`}
      </p>

      <dl className={cx("mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2")}>
        {summary.map((s) => (
          <div key={s.term} className={cx("min-w-0 rounded-xl border px-3 py-2", BORDER, "bg-zinc-50")}>
            <dt className={cx("truncate text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION_MUTED)}>{s.term}</dt>
            <dd className={cx("mt-1 text-lg font-semibold leading-none", NUM, TEXT_PRIMARY)}>
              {s.value}
              <span className={cx("mt-1 block text-[11px] font-normal leading-tight", TEXT_CAPTION_MUTED)}>{s.note}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 min-h-0 flex-1">
        {day.orders.length === 0 ? (
          <div className={cx("flex h-full min-h-[160px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center", BORDER, "bg-zinc-50")}>
            <MoonStar size={20} aria-hidden="true" className={TEXT_CAPTION} />
            <p className={cx("text-[13px] font-medium", TEXT_PRIMARY)}>Shop closed</p>
            <p className={cx("text-xs font-normal", TEXT_CAPTION_MUTED)}>No bay work booked for this day. Sundays only open for road call-ins.</p>
          </div>
        ) : (
          <ol tabIndex={0} className={cx("divide-y overflow-y-auto rounded-xl border xl:max-h-[352px]", BORDER, FOCUS)}>
            {day.orders.map((o) => {
              const bay = BAY_BY_ID[o.bayId];
              return (
                <li key={o.id} className="flex items-start gap-3 px-3 py-2.5">
                  <span className="w-[52px] shrink-0">
                    <span className={cx("block whitespace-nowrap text-[13px] font-medium leading-tight", NUM, TEXT_PRIMARY)}>{fmtTime(o.startMin)}</span>
                    <span className={cx("block whitespace-nowrap text-[11px] font-normal leading-tight", NUM, TEXT_CAPTION)}>{fmtTime(o.endMin)}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className={cx("text-[13px] font-medium leading-tight", TEXT_PRIMARY)}>{o.name}</span>
                      <StatusBadge status={o.status} />
                    </span>
                    <span className={cx("mt-1 block truncate text-[11px] font-normal", TEXT_CAPTION)}>
                      {`Unit ${o.unit} · ${o.model}`}
                    </span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className={cx("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium", ACCENT_SUBTLE)}>{`Bay ${bay.code}`}</span>
                      <span className={cx("inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium", BORDER, "bg-zinc-50", TEXT_CAPTION_MUTED)}>{o.code}</span>
                      <span aria-hidden="true" className={cx("grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-medium", "bg-zinc-100 text-zinc-600")}>
                        {initialsOf(o.tech)}
                      </span>
                      <span className={cx("truncate text-[11px] font-normal", TEXT_CAPTION_MUTED)}>{o.tech}</span>
                    </span>
                  </span>
                  <span className="w-[58px] shrink-0 text-right">
                    <span className={cx("block whitespace-nowrap text-[13px] font-medium leading-tight", NUM, TEXT_PRIMARY)}>{`${o.bayHours}h bay`}</span>
                    <span className={cx("block whitespace-nowrap text-[11px] font-normal leading-tight", NUM, o.otHours > 0 ? "text-orange-800" : TEXT_CAPTION)}>
                      {o.otHours > 0 ? `+${o.otHours}h OT` : "no OT"}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </Card>
  );
}
