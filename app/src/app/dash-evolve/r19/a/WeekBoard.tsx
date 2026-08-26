"use client";

import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { WEEK_DAYS, WEEK_LABEL, WINDOW_HOURS, WINDOW_START_HOUR, type Booking, type BookingStatus, type DayId } from "./data";
import { formatHours, formatTimeRange } from "./format";
import { BORDER, FOCUS, NUM, STATUS_LABEL, STATUS_TONE, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TRANSITION, cx, heatTier, r2 } from "./tokens";
import { Card, CardHeader, HoverTip, InitialsAvatar } from "./ui";

const STATUS_ICON: Record<BookingStatus, LucideIcon> = { confirmed: CheckCircle2, pending: Clock, conflict: AlertTriangle };
const TICKS = [8, 10, 12, 14, 16, 18];
const ROW_HEIGHT_PX = 560;

/** Greedy interval packing (same technique a real calendar UI uses): overlapping bookings on a
 *  given day get side-by-side lanes instead of stacking on top of each other, so two rooms double
 *  booked at once — or the genuine Harbor A conflict on Tuesday — render as visibly adjacent
 *  blocks rather than an ambiguous pixel overlap. */
function packDay(bookings: Booking[]): { booking: Booking; lane: number; lanes: number }[] {
  const sorted = [...bookings].sort((a, b) => a.startHour - b.startHour || a.id.localeCompare(b.id));
  const laneEnds: number[] = [];
  const placed: { booking: Booking; lane: number }[] = [];
  for (const b of sorted) {
    let lane = laneEnds.findIndex((end) => end <= b.startHour);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(b.startHour + b.durationHours);
    } else {
      laneEnds[lane] = b.startHour + b.durationHours;
    }
    placed.push({ booking: b, lane });
  }
  const lanes = Math.max(1, laneEnds.length);
  return placed.map((p) => ({ ...p, lanes }));
}

type DayStat = { count: number; confirmed: number; pending: number; conflict: number; hoursBooked: number; occupancyPct: number };

export default function WeekBoard({ bookings, capacityDivisor, headingId }: { bookings: Booking[]; capacityDivisor: number; headingId: string }) {
  const [tipDay, setTipDay] = useState<DayId | null>(null);
  const byDay = useMemo(() => {
    const map = new Map<DayId, Booking[]>();
    for (const d of WEEK_DAYS) map.set(d.id, bookings.filter((b) => b.day === d.id));
    return map;
  }, [bookings]);

  const dayStats = useMemo(() => {
    const capacityHours = WINDOW_HOURS * capacityDivisor;
    const map = new Map<DayId, DayStat>();
    for (const d of WEEK_DAYS) {
      const list = byDay.get(d.id) ?? [];
      const hoursBooked = list.reduce((sum, b) => sum + b.durationHours, 0);
      map.set(d.id, {
        count: list.length,
        confirmed: list.filter((b) => b.status === "confirmed").length,
        pending: list.filter((b) => b.status === "pending").length,
        conflict: list.filter((b) => b.status === "conflict").length,
        hoursBooked,
        occupancyPct: Math.min(100, Math.round((hoursBooked / capacityHours) * 100)),
      });
    }
    return map;
  }, [byDay, capacityDivisor]);

  return (
    <Card ariaLabelledBy={headingId} padded={false} className="overflow-hidden">
      <div className="p-4 sm:p-5">
        <CardHeader titleId={headingId} title="Week board" description={`${WEEK_LABEL} · hover or focus a day for the occupancy breakdown`} />
      </div>

      {/* Desktop / tablet: real time grid, 7 day columns × the 8:00–18:00 window. */}
      <div className={cx("hidden border-t px-4 pb-4 sm:px-5 sm:pb-5 lg:block", BORDER)}>
        <div className="flex">
          <div className="w-12 shrink-0" aria-hidden="true" />
          <div className="grid flex-1 grid-cols-7 gap-2">
            {WEEK_DAYS.map((d) => {
              const stat = dayStats.get(d.id)!;
              const showTip = tipDay === d.id;
              const tipDomId = `day-tip-${d.id}`;
              return (
                <div key={d.id} className="relative">
                  <button
                    type="button"
                    aria-describedby={showTip ? tipDomId : undefined}
                    onMouseEnter={() => setTipDay(d.id)}
                    onMouseLeave={() => setTipDay((k) => (k === d.id ? null : k))}
                    onFocus={() => setTipDay(d.id)}
                    onBlur={() => setTipDay((k) => (k === d.id ? null : k))}
                    className={cx(
                      "flex w-full flex-col items-center gap-0.5 rounded-lg border-2 px-1 py-1.5",
                      TRANSITION,
                      FOCUS,
                      heatTier(stat.occupancyPct),
                      d.isToday ? "border-sky-300" : "border-transparent",
                    )}
                  >
                    <span className={cx("text-[11px] font-medium uppercase tracking-wide", TEXT_CAPTION_MUTED)}>{d.label}</span>
                    <span className={cx("flex items-center gap-1 text-[13px] font-medium", TEXT_PRIMARY)}>
                      {d.dateLabel}
                      {d.isToday ? <span className="rounded-full bg-sky-700 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-white">Today</span> : null}
                    </span>
                    <span className={cx("text-[11px]", NUM, TEXT_CAPTION_MUTED)}>
                      {stat.count} · {stat.occupancyPct}%
                    </span>
                  </button>
                  {showTip ? (
                    <HoverTip id={tipDomId} className="left-1/2 top-full mt-1 w-48 -translate-x-1/2">
                      <p className="font-medium">
                        {d.label}, {d.dateLabel}
                      </p>
                      <p className="mt-1 text-zinc-300">
                        {formatHours(stat.hoursBooked)} booked · {stat.occupancyPct}% of window
                      </p>
                      <p className="mt-1 text-zinc-300">
                        {stat.confirmed} confirmed · {stat.pending} pending · {stat.conflict} conflict{stat.conflict === 1 ? "" : "s"}
                      </p>
                    </HoverTip>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-1 flex">
          <div className="flex w-12 shrink-0 flex-col text-right text-[10px]" style={{ height: ROW_HEIGHT_PX }}>
            {TICKS.map((h) => (
              <span key={h} className={cx("relative -top-1.5 pr-2", TEXT_CAPTION)} style={{ height: `${100 / (TICKS.length - 1)}%` }}>
                {h > 12 ? `${h - 12}p` : h === 12 ? "12p" : `${h}a`}
              </span>
            ))}
          </div>

          <div className="relative flex-1 rounded-lg border border-zinc-100" style={{ height: ROW_HEIGHT_PX }}>
            {TICKS.map((h) => (
              <div key={h} className="absolute inset-x-0 border-t border-zinc-100" style={{ top: `${r2(((h - WINDOW_START_HOUR) / WINDOW_HOURS) * 100)}%` }} aria-hidden="true" />
            ))}
            <div className="grid h-full grid-cols-7 gap-2">
              {WEEK_DAYS.map((d) => {
                const dayBookings = byDay.get(d.id) ?? [];
                const packed = packDay(dayBookings);
                return (
                  <div key={d.id} className="relative h-full">
                    {packed.length === 0 ? (
                      <p className={cx("pt-2 text-center text-[11px]", TEXT_CAPTION)}>No bookings</p>
                    ) : (
                      packed.map(({ booking, lane, lanes }) => {
                        const top = r2(((booking.startHour - WINDOW_START_HOUR) / WINDOW_HOURS) * 100);
                        const height = r2((booking.durationHours / WINDOW_HOURS) * 100);
                        const left = r2((lane / lanes) * 100);
                        const width = r2(100 / lanes);
                        const tone = STATUS_TONE[booking.status];
                        const Icon = STATUS_ICON[booking.status];
                        const compact = booking.durationHours < 1;
                        return (
                          <div
                            key={booking.id}
                            className={cx("absolute overflow-hidden rounded-md border-l-2 px-1 py-0.5", tone.border, "bg-white shadow-sm")}
                            style={{ top: `${top}%`, height: `${height}%`, left: `${left}%`, width: `calc(${width}% - 3px)` }}
                          >
                            <span className="flex items-center gap-1">
                              <Icon size={9} aria-hidden="true" className={cx("shrink-0", tone.text)} />
                              <span className={cx("truncate text-[9.5px] font-medium", NUM, TEXT_CAPTION_MUTED)}>{formatTimeRange(booking.startHour, booking.durationHours)}</span>
                            </span>
                            <p className={cx("truncate text-[10.5px] font-medium leading-tight", TEXT_PRIMARY)}>{booking.title}</p>
                            {!compact ? (
                              <p className="mt-0.5 flex items-center gap-1">
                                <InitialsAvatar name={booking.organizer} size={12} />
                                <span className={cx("truncate text-[9.5px]", TEXT_CAPTION)}>{booking.organizer}</span>
                              </p>
                            ) : null}
                            <span className="sr-only">{STATUS_LABEL[booking.status]}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: the same data as a per-day agenda list — a 7-column time grid cannot fit 390px. */}
      <div className="border-t p-4 lg:hidden">
        <ul className="flex flex-col gap-3">
          {WEEK_DAYS.map((d) => {
            const list = (byDay.get(d.id) ?? []).slice().sort((a, b) => a.startHour - b.startHour);
            const stat = dayStats.get(d.id)!;
            return (
              <li key={d.id}>
                <div className="flex items-center gap-2">
                  <p className={cx("text-[13px] font-medium", TEXT_PRIMARY)}>
                    {d.label}, {d.dateLabel}
                  </p>
                  {d.isToday ? <span className="rounded-full bg-sky-700 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-white">Today</span> : null}
                  <span className={cx("ml-auto text-[11px]", NUM, TEXT_CAPTION)}>
                    {stat.count} · {stat.occupancyPct}%
                  </span>
                </div>
                {list.length === 0 ? (
                  <p className={cx("mt-1 text-[11px]", TEXT_CAPTION)}>No bookings</p>
                ) : (
                  <ul className="mt-1.5 flex flex-col gap-1.5">
                    {list.map((booking) => {
                      const tone = STATUS_TONE[booking.status];
                      const Icon = STATUS_ICON[booking.status];
                      return (
                        <li key={booking.id} className={cx("flex items-start gap-2 rounded-lg border-l-2 px-2 py-1.5", tone.border, "bg-zinc-50")}>
                          <Icon size={13} aria-hidden="true" className={cx("mt-0.5 shrink-0", tone.text)} />
                          <div className="min-w-0 flex-1">
                            <p className={cx("truncate text-[13px] font-medium", TEXT_PRIMARY)}>{booking.title}</p>
                            <p className={cx("text-[11px]", NUM, TEXT_CAPTION_MUTED)}>{formatTimeRange(booking.startHour, booking.durationHours)}</p>
                          </div>
                          <span className={cx("shrink-0 rounded-full border px-1.5 py-0.5 text-[10px] font-medium", tone.text, tone.bg, tone.border)}>{STATUS_LABEL[booking.status]}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
