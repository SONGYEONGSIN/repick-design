"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Clock, CircleDot, CircleCheckBig } from "lucide-react";
import {
  DOORS,
  ZONE_LABEL,
  WINDOW_START,
  WINDOW_END,
  WINDOW_SPAN,
  CURRENT_MINUTE,
  getTicks,
  getDoorBookings,
  getDoorStats,
  getStatus,
  computeConflictIds,
  assignLanes,
  formatClock,
  formatClockShort,
  formatRange,
  pctFmt,
  STATUS_LABEL,
  type Period,
  type Booking,
  type Zone,
} from "./data";
import { FOCUS_RING, NUM } from "./ui";

const LABEL_COL = "w-40 sm:w-44";
const LANE_HEIGHT = 52;
const LANE_GAP = 6;

const LOAD_LABEL: Record<"FTL" | "LTL", string> = { FTL: "Full truckload", LTL: "Less than truckload" };

const STATUS_ICON = { scheduled: Clock, loading: CircleDot, completed: CircleCheckBig } as const;

/** One hour per slot across the 6 AM–8 PM window — 14 slots. Used only by the time-axis crosshair
 *  below; the bars themselves never depend on this grouping. */
const SLOT_MINUTES = 60;

interface DockTimelineProps {
  period: Period;
  pinnedDoorId: string;
  onPinDoor: (doorId: string) => void;
  focusedCarrier: string | null;
}

export function DockTimeline({ period, pinnedDoorId, onPinDoor, focusedCarrier }: DockTimelineProps) {
  const ticks = useMemo(() => getTicks(), []);
  const conflictIds = useMemo(() => computeConflictIds(period), [period]);

  // Ephemeral, local to this one widget: which hour-bucket of the time axis is hovered/focused.
  // Drives only the crosshair band + its own tooltip right here — nothing outside this component
  // ever reads it.
  const [activeTick, setActiveTick] = useState<number | null>(null);

  const slotStarts = useMemo(() => {
    const slots: number[] = [];
    for (let t = WINDOW_START; t < WINDOW_END; t += SLOT_MINUTES) slots.push(t);
    return slots;
  }, []);

  const activeSlotInfo = useMemo(() => {
    if (activeTick === null) return null;
    const start = slotStarts[activeTick];
    const end = start + SLOT_MINUTES;
    const activeDoors = DOORS.filter((door) =>
      getDoorBookings(period, door.id).some((bk) => bk.start <= start && bk.end > start),
    );
    return { start, end, doors: activeDoors };
  }, [activeTick, slotStarts, period]);

  const nowPct = period === "today" && CURRENT_MINUTE >= WINDOW_START && CURRENT_MINUTE <= WINDOW_END
    ? ((CURRENT_MINUTE - WINDOW_START) / WINDOW_SPAN) * 100
    : null;

  return (
    <div>
      {/* Legend — status + conflict cues are always icon + visible text, never color alone. */}
      <ul className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">
        <li className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
          Scheduled
        </li>
        <li className="flex items-center gap-1.5">
          <CircleDot className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
          Loading
        </li>
        <li className="flex items-center gap-1.5">
          <CircleCheckBig className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
          Completed
        </li>
        <li className="flex items-center gap-1.5">
          <AlertTriangle className="h-3.5 w-3.5 text-rose-400" aria-hidden="true" />
          Scheduling conflict
        </li>
        {nowPct !== null && (
          <li className="flex items-center gap-1.5">
            <span className="h-3.5 w-px bg-emerald-400" aria-hidden="true" />
            Now — {formatClock(CURRENT_MINUTE)}
          </li>
        )}
      </ul>

      {/* Fully fluid Gantt — no overflow-x-auto wrapper and no px min-width floor anywhere in this
          tree. Every row's track is `min-w-0 flex-1` and every bar/tick is positioned by percentage
          of that track, so the whole timeline compresses cleanly at any desktop width ≥768px with
          zero horizontal scrollbar. */}
      <div className="w-full min-w-0 rounded-lg border border-white/10">
        {/* Time-axis header, with a keyboard-reachable crosshair: each hour is an invisible,
            focusable slice. Hovering or tabbing through it highlights that hour across every row
            below and reports exactly which doors are loading at that hour — this is deliberately a
            separate, ephemeral read from the persistent carrier/time text already printed on every
            bar. */}
        <div className="relative flex border-b border-white/10 bg-white/[0.03] text-[11px] text-zinc-400">
          <div className={`${LABEL_COL} shrink-0 border-r border-white/10 px-3 py-2 font-medium text-zinc-400`}>Dock door</div>
          <div className="relative min-w-0 flex-1 pr-3">
            <div className="grid" style={{ gridTemplateColumns: `repeat(${ticks.length}, minmax(0, 1fr))` }}>
              {ticks.map((t) => (
                <div key={t} className={`truncate whitespace-nowrap py-2 pl-1.5 ${NUM}`}>
                  {formatClockShort(t)}
                </div>
              ))}
            </div>
            {nowPct !== null && (
              <div
                className="pointer-events-none absolute top-0.5 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-emerald-400 px-1.5 py-0.5 text-[10px] font-medium text-zinc-950"
                style={{ left: `${nowPct}%` }}
                aria-hidden="true"
              >
                Now
              </div>
            )}
            <div className="absolute inset-0 flex">
              {slotStarts.map((start, i) => (
                <button
                  key={start}
                  type="button"
                  tabIndex={0}
                  onMouseEnter={() => setActiveTick(i)}
                  onMouseLeave={() => setActiveTick((cur) => (cur === i ? null : cur))}
                  onFocus={() => setActiveTick(i)}
                  onBlur={() => setActiveTick((cur) => (cur === i ? null : cur))}
                  aria-label={`${formatClockShort(start)}–${formatClockShort(start + SLOT_MINUTES)}: ${
                    DOORS.filter((d) => getDoorBookings(period, d.id).some((bk) => bk.start <= start && bk.end > start)).length
                  } of ${DOORS.length} doors loading`}
                  className={`h-full flex-1 rounded-sm bg-transparent ${FOCUS_RING}`}
                />
              ))}
            </div>
            {activeSlotInfo ? (
              <div
                role="status"
                className={`pointer-events-none absolute top-full z-30 mt-1.5 w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-white/10 bg-zinc-900 p-2.5 text-xs text-zinc-300 shadow-xl ${
                  activeTick === 0 ? "left-0" : activeTick === slotStarts.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2"
                }`}
              >
                <p className="font-medium text-zinc-50">
                  {`${formatClockShort(activeSlotInfo.start)}–${formatClockShort(activeSlotInfo.end)}`}
                </p>
                <p className="mt-1 text-zinc-300">
                  {activeSlotInfo.doors.length} of {DOORS.length} doors loading
                  {activeSlotInfo.doors.length > 0 ? `: ${activeSlotInfo.doors.map((d) => d.code).join(", ")}` : "."}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Rows, grouped by zone. */}
        <div className="divide-y divide-white/5">
          {(["inbound", "outbound"] as Zone[]).map((zone) => (
            <div key={zone}>
              <div className="bg-white/[0.02] px-3 py-1.5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">{ZONE_LABEL[zone]}</p>
              </div>
              <div className="divide-y divide-white/5">
                {DOORS.filter((door) => door.zone === zone).map((door) => {
                  const bookings = getDoorBookings(period, door.id);
                  const { laneOf, laneCount } = assignLanes(bookings);
                  const stats = getDoorStats(period, door.id);
                  const isPinned = door.id === pinnedDoorId;
                  const trackHeight = laneCount * LANE_HEIGHT + (laneCount - 1) * LANE_GAP;

                  return (
                    <div key={door.id} className="flex items-stretch">
                      <div className={`${LABEL_COL} shrink-0 border-r border-white/10 px-3 py-2.5`}>
                        <button
                          type="button"
                          onClick={() => onPinDoor(door.id)}
                          aria-pressed={isPinned}
                          className={`block w-full min-w-0 rounded-md px-1 py-0.5 text-left transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                            isPinned ? "bg-emerald-400/10 ring-1 ring-inset ring-emerald-400/60" : "hover:bg-white/[0.04]"
                          }`}
                        >
                          <span className="block truncate text-sm font-semibold text-zinc-50">{door.code}</span>
                          <span className="mt-0.5 block truncate text-[11px] text-zinc-400">
                            {stats.bookingCount} booking{stats.bookingCount === 1 ? "" : "s"}
                          </span>
                          <span className="mt-1.5 flex items-center gap-1.5">
                            <span className="h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                              <span className="block h-1 rounded-full bg-emerald-400" style={{ width: `${Math.min(stats.utilization * 100, 100)}%` }} />
                            </span>
                            <span className={`shrink-0 text-[10px] text-zinc-400 ${NUM}`}>{pctFmt.format(stats.utilization)}</span>
                          </span>
                        </button>
                      </div>

                      <div className="relative min-w-0 flex-1 pr-3" style={{ minHeight: trackHeight + 20 }}>
                        {/* Tick grid lines, spanning the full row. */}
                        {ticks.slice(1).map((t) => (
                          <div
                            key={t}
                            className="pointer-events-none absolute inset-y-0 w-px bg-white/5"
                            style={{ left: `${((t - WINDOW_START) / WINDOW_SPAN) * 100}%` }}
                            aria-hidden="true"
                          />
                        ))}
                        {nowPct !== null && (
                          <div
                            className="pointer-events-none absolute inset-y-0 z-[5] w-px bg-emerald-400/50"
                            style={{ left: `${nowPct}%` }}
                            aria-hidden="true"
                          />
                        )}
                        {/* Crosshair band — shares `activeTick` with the time-axis header above. */}
                        {activeTick !== null && (
                          <div
                            className="pointer-events-none absolute inset-y-0 z-[1] bg-emerald-400/[0.07]"
                            style={{
                              left: `${((slotStarts[activeTick] - WINDOW_START) / WINDOW_SPAN) * 100}%`,
                              width: `${(SLOT_MINUTES / WINDOW_SPAN) * 100}%`,
                            }}
                            aria-hidden="true"
                          />
                        )}

                        {bookings.map((bk) => (
                          <BookingBar
                            key={bk.id}
                            booking={bk}
                            door={door}
                            period={period}
                            lane={laneOf.get(bk.id) ?? 0}
                            isConflict={conflictIds.has(bk.id)}
                            isDimmed={focusedCarrier !== null && bk.carrier !== focusedCarrier}
                            isFocused={focusedCarrier !== null && bk.carrier === focusedCarrier}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BookingBar({
  booking,
  door,
  period,
  lane,
  isConflict,
  isDimmed,
  isFocused,
}: {
  booking: Booking;
  door: { id: string; code: string };
  period: Period;
  lane: number;
  isConflict: boolean;
  isDimmed: boolean;
  isFocused: boolean;
}) {
  const status = getStatus(booking, period);
  const Icon = STATUS_ICON[status];
  const leftPct = ((booking.start - WINDOW_START) / WINDOW_SPAN) * 100;
  const widthPct = ((booking.end - booking.start) / WINDOW_SPAN) * 100;

  const fill =
    isDimmed
      ? "border-white/10 bg-white/[0.04] text-zinc-300"
      : status === "loading"
        ? "border-emerald-400/50 bg-emerald-700 text-zinc-50"
        : status === "completed"
          ? "border-white/10 bg-white/[0.05] text-zinc-300"
          : "border-emerald-700/60 bg-emerald-900/70 text-zinc-100";

  return (
    <div
      className="group absolute"
      style={{ left: `${leftPct}%`, width: `${widthPct}%`, top: `${lane * (LANE_HEIGHT + LANE_GAP)}px`, height: `${LANE_HEIGHT}px` }}
    >
      <button
        type="button"
        tabIndex={0}
        className={`relative h-full w-full overflow-hidden rounded-md border px-2 py-1 text-left transition-colors motion-reduce:transition-none ${FOCUS_RING} ${fill} ${
          isConflict ? "border-dashed border-rose-400/60" : ""
        } ${isFocused ? "ring-2 ring-emerald-300" : ""}`}
      >
        <span className="flex h-full min-w-0 flex-col justify-center gap-0.5">
          <span className="flex min-w-0 items-center gap-1">
            {isConflict && <AlertTriangle className="h-3 w-3 shrink-0 text-rose-400" aria-hidden="true" />}
            <span className="min-w-0 truncate text-[11px] font-medium leading-tight">{booking.carrier}</span>
          </span>
          <span className={`flex min-w-0 items-center gap-1 truncate text-[10px] leading-tight text-zinc-50 ${NUM}`}>
            <Icon className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
            {formatRange(booking.start, booking.end)}
          </span>
        </span>
        {/* Visible text (carrier + time, above) is the accessible name verbatim; this adds the
            extra door/cargo/status/conflict context for screen-reader users without paraphrasing
            or reordering what's already visible. */}
        <span className="sr-only">
          {` door ${door.code}. ${LOAD_LABEL[booking.load]}. Status: ${STATUS_LABEL[status]}.${
            isConflict ? " Scheduling conflict with another booking on this door." : ""
          }`}
        </span>
      </button>

      {/* Hover / focus-within tooltip — ephemeral, CSS-driven, keyboard reachable. Duplicates the
          button's aria-label in visible text for sighted pointer and keyboard-focus users; hidden
          from the a11y tree so it isn't announced twice. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-full left-0 z-20 mb-2 w-56 -translate-y-1 rounded-lg border p-3 opacity-0 shadow-xl shadow-black/40 transition-opacity duration-100 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transition-none ${
          isConflict ? "border-rose-400/30 bg-zinc-900" : "border-white/10 bg-zinc-900"
        }`}
      >
        <p className="text-xs font-medium text-zinc-50">{booking.carrier}</p>
        <p className="mt-0.5 text-[11px] text-zinc-400">
          {booking.trailer} · {booking.load}
        </p>
        <p className={`mt-1.5 text-[11px] text-zinc-300 ${NUM}`}>{formatRange(booking.start, booking.end)}</p>
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-zinc-300">
          <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
          {STATUS_LABEL[status]}
        </p>
        {isConflict ? (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-300">
            <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
            Scheduling conflict
          </p>
        ) : null}
      </div>
    </div>
  );
}
