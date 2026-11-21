"use client";

import { CalendarX2, Users } from "lucide-react";
import { getBookingsForDay, getDayStats, getRoomById, formatRange, usdFmt, TODAY_DAY, STATUS_LABEL, type BookingStatus } from "./data";
import { Badge, Card, InitialsAvatar, NUM, SectionLabel } from "./ui";

function statusTone(status: BookingStatus): "success" | "accent" | "muted" {
  if (status === "confirmed") return "success";
  if (status === "pending") return "accent";
  return "muted";
}

export function DayDetail({ day }: { day: number }) {
  const bookings = getBookingsForDay(day);
  const stats = getDayStats(day);
  const isToday = day === TODAY_DAY;

  return (
    <Card className="flex h-full min-w-0 flex-col">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <SectionLabel>{isToday ? "Today" : "Selected day"}</SectionLabel>
          <h3 className="truncate text-base font-semibold text-zinc-900">November {day}, 2026</h3>
        </div>
        <span className={`shrink-0 whitespace-nowrap text-sm font-medium text-zinc-900 ${NUM}`}>{usdFmt.format(stats.revenue)}</span>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-200 py-10 text-center">
          <CalendarX2 className="h-5 w-5 text-zinc-400" aria-hidden="true" />
          <p className="max-w-[200px] text-sm text-zinc-500">No bookings on this day.</p>
        </div>
      ) : (
        <ul className="flex min-w-0 flex-col gap-2 overflow-y-auto" style={{ maxHeight: 420 }}>
          {bookings.map((bk) => {
            const room = getRoomById(bk.room);
            return (
              <li key={bk.id} className="min-w-0 rounded-lg border border-zinc-200 p-2.5">
                <div className="flex min-w-0 items-start justify-between gap-2">
                  <div className="flex min-w-0 items-start gap-2">
                    <InitialsAvatar name={bk.clientName} size={26} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-900">{bk.eventName}</p>
                      <p className="truncate text-xs text-zinc-500">{bk.clientName}</p>
                    </div>
                  </div>
                  <Badge tone={statusTone(bk.status)}>{STATUS_LABEL[bk.status]}</Badge>
                </div>
                <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                  <span className="whitespace-nowrap">{formatRange(bk.start, bk.end)}</span>
                  <span className="whitespace-nowrap">{room.name}</span>
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <Users className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {bk.guests}
                  </span>
                  <span className={`ml-auto shrink-0 whitespace-nowrap font-medium text-zinc-900 ${NUM}`}>{usdFmt.format(bk.revenue)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
