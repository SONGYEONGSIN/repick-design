"use client";

import { getMonthStats, getRoomUtilization, usdFmt, countFmt, pctFmt } from "./data";
import { Card, NUM, Progress, SectionLabel } from "./ui";

export function MonthSummary() {
  const stats = getMonthStats();
  const rooms = getRoomUtilization();

  return (
    <Card>
      <SectionLabel>November at a glance</SectionLabel>
      <dl className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <dt className="text-xs text-zinc-500">Booked revenue</dt>
          <dd className={`mt-0.5 text-lg font-semibold text-zinc-900 ${NUM}`}>{usdFmt.format(stats.revenue)}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Active bookings</dt>
          <dd className={`mt-0.5 text-lg font-semibold text-zinc-900 ${NUM}`}>{countFmt.format(stats.activeCount)}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Deposits pending</dt>
          <dd className={`mt-0.5 text-sm font-medium text-orange-700 ${NUM}`}>{countFmt.format(stats.pendingCount)}</dd>
        </div>
        <div>
          <dt className="text-xs text-zinc-500">Avg. party size</dt>
          <dd className={`mt-0.5 text-sm font-medium text-zinc-900 ${NUM}`}>{countFmt.format(stats.avgPartySize)} guests</dd>
        </div>
      </dl>

      <div className="mt-4 border-t border-zinc-100 pt-4">
        <SectionLabel>Room occupancy</SectionLabel>
        <ul className="mt-2.5 flex flex-col gap-2.5">
          {rooms.map(({ room, bookedDays, utilization }) => (
            <li key={room.id} className="min-w-0">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="min-w-0 truncate text-sm text-zinc-700">{room.name}</span>
                <span className={`shrink-0 whitespace-nowrap text-xs text-zinc-500 ${NUM}`}>
                  {bookedDays}/30 days · {pctFmt.format(utilization)}
                </span>
              </div>
              <Progress value={utilization} label={`${room.name} occupancy, ${pctFmt.format(utilization)} of November`} />
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
