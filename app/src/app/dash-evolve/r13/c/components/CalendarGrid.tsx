"use client";

import { useMemo } from "react";
import {
  CHANNELS,
  type ChannelId,
  type ContentItem,
  ITEMS_BY_DATE,
  WEEKDAY_LABELS,
  buildMonthMatrix,
  fullDayLabel,
  monthLabel,
  shortDayLabel,
} from "../data";
import { BORDER, CARD, FOCUS_RING_INSET, NUM, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

/**
 * Channel-toggle feedback for indicator icons: default (no filtering) renders every channel in a
 * neutral tone; once the user narrows the channel set, matching channels recolor to the accent and
 * non-matching ones "dim" — but dimming never drops below the zinc-400 dark-surface contrast floor
 * (a11y: filtered/toggled states must clear the same bar as the default render). The de-emphasis
 * instead comes from a smaller icon size, a second, non-color cue.
 */
function indicatorStyle(channelId: ChannelId, activeChannels: Set<ChannelId>, allSelected: boolean): { className: string; size: number } {
  if (allSelected) return { className: "text-zinc-300", size: 13 };
  if (activeChannels.has(channelId)) return { className: "text-orange-400", size: 13 };
  return { className: "text-zinc-400", size: 10 };
}

function distinctChannelsFor(items: ContentItem[]): ChannelId[] {
  return CHANNELS.filter((c) => items.some((i) => i.channel === c.id)).map((c) => c.id);
}

export default function CalendarGrid({
  year,
  month,
  todayKey,
  selectedDateKey,
  onSelectDay,
  activeChannels,
}: {
  year: number;
  month: number;
  todayKey: string;
  selectedDateKey: string | null;
  onSelectDay: (key: string) => void;
  activeChannels: Set<ChannelId>;
}) {
  const cells = useMemo(() => buildMonthMatrix(year, month), [year, month]);
  const weeks = useMemo(() => {
    const out: (typeof cells)[] = [];
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
    return out;
  }, [cells]);
  const allSelected = activeChannels.size === CHANNELS.length;
  const monthCount = cells.filter((c) => c.inMonth).reduce((sum, c) => sum + (ITEMS_BY_DATE[c.key]?.length ?? 0), 0);
  const daysWithItems = cells.filter((c) => c.inMonth && (ITEMS_BY_DATE[c.key]?.length ?? 0) > 0);

  return (
    <>
      {/* Desktop / tablet: a real month-grid table, the page's dominant element. */}
      <div className={cx(CARD, "hidden overflow-hidden p-0 sm:block")}>
        <div className={cx("flex items-center justify-between gap-3 border-b px-4 py-3", BORDER)}>
          <h2 id="calendar-heading" className={cx("text-sm font-semibold", TEXT_PRIMARY)}>
            {monthLabel(year, month)}
          </h2>
          <p className={cx("text-xs", TEXT_CAPTION, NUM)}>{monthCount} items this month</p>
        </div>

        <table className="w-full table-fixed border-collapse text-sm" aria-labelledby="calendar-heading">
          <caption className="sr-only">
            Content calendar for {monthLabel(year, month)}. Activate a day to filter the queue list on the right to that day&rsquo;s items.
          </caption>
          <colgroup>
            {WEEKDAY_LABELS.map((d) => (
              <col key={d} style={{ width: "14.2857%" }} />
            ))}
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              {WEEKDAY_LABELS.map((d) => (
                <th key={d} scope="col" className={cx("px-2 py-2 text-center text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>
                  <span aria-hidden="true">{d}</span>
                  <span className="sr-only">{d === "Sun" ? "Sunday" : d === "Mon" ? "Monday" : d === "Tue" ? "Tuesday" : d === "Wed" ? "Wednesday" : d === "Thu" ? "Thursday" : d === "Fri" ? "Friday" : "Saturday"}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi} className={wi > 0 ? cx("border-t", BORDER) : undefined}>
                {week.map((cell, ci) => {
                  const dayItems = ITEMS_BY_DATE[cell.key] ?? [];
                  const isToday = cell.key === todayKey;
                  const isSelected = cell.key === selectedDateKey;
                  const channelsPresent = distinctChannelsFor(dayItems);
                  const labelParts = [fullDayLabel(cell.year, cell.month, cell.day)];
                  if (isToday) labelParts.push("today");
                  labelParts.push(dayItems.length > 0 ? `${dayItems.length} item${dayItems.length === 1 ? "" : "s"} scheduled` : "no items scheduled");
                  if (isSelected) labelParts.push("selected");
                  if (!cell.inMonth) labelParts.push("outside current month");

                  return (
                    <td key={cell.key} className={cx("relative h-[92px] align-top p-0", ci > 0 && cx("border-l", BORDER))}>
                      <button
                        type="button"
                        disabled={!cell.inMonth}
                        onClick={() => onSelectDay(cell.key)}
                        aria-current={isToday ? "date" : undefined}
                        aria-label={labelParts.join(", ")}
                        className={cx(
                          "flex h-full w-full flex-col items-stretch gap-1 p-1.5 text-left disabled:cursor-default sm:p-2",
                          TRANSITION,
                          FOCUS_RING_INSET,
                          !cell.inMonth && "opacity-40",
                          isSelected ? "bg-white/[0.08] ring-2 ring-inset ring-orange-400" : isToday ? "ring-1 ring-inset ring-orange-400/50" : cell.inMonth && "hover:bg-white/[0.04]",
                        )}
                      >
                        <span className="flex items-center justify-between gap-1">
                          <span aria-hidden="true" className={cx("text-xs", NUM, isToday ? "font-semibold text-orange-300" : cell.inMonth ? "text-zinc-300" : "text-zinc-600")}>{cell.day}</span>
                          {dayItems.length > 0 ? (
                            <span aria-hidden="true" className={cx("rounded-full px-1.5 py-[1px] text-[10px] font-medium", NUM, "bg-white/[0.07]", TEXT_CAPTION)}>
                              {dayItems.length}
                            </span>
                          ) : null}
                        </span>
                        {cell.inMonth && channelsPresent.length > 0 ? (
                          <span className="mt-auto flex flex-wrap items-center gap-1">
                            {channelsPresent.map((chId) => {
                              const channel = CHANNELS.find((c) => c.id === chId)!;
                              const Icon = channel.Icon;
                              const style = indicatorStyle(chId, activeChannels, allSelected);
                              return <Icon key={chId} aria-hidden="true" size={style.size} className={cx("shrink-0", style.className)} />;
                            })}
                          </span>
                        ) : null}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile (< sm): the grid reflows to a compact agenda list — no horizontal scroll. */}
      <div className={cx(CARD, "block p-4 sm:hidden")}>
        <div className="flex items-center justify-between gap-3">
          <h2 id="calendar-heading-mobile" className={cx("text-sm font-semibold", TEXT_PRIMARY)}>
            {monthLabel(year, month)}
          </h2>
          <p className={cx("text-xs", TEXT_CAPTION, NUM)}>{monthCount} items</p>
        </div>
        {daysWithItems.length === 0 ? (
          <p className={cx("mt-3 text-sm", TEXT_CAPTION)}>No items scheduled this month.</p>
        ) : (
          <ol aria-labelledby="calendar-heading-mobile" className={cx("mt-3 flex flex-col divide-y", "divide-white/10")}>
            {daysWithItems.map((cell) => {
              const dayItems = ITEMS_BY_DATE[cell.key] ?? [];
              const isToday = cell.key === todayKey;
              const isSelected = cell.key === selectedDateKey;
              const channelsPresent = distinctChannelsFor(dayItems);
              return (
                <li key={cell.key}>
                  <button
                    type="button"
                    onClick={() => onSelectDay(cell.key)}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={`${fullDayLabel(cell.year, cell.month, cell.day)}${isToday ? ", today" : ""}, ${dayItems.length} item${dayItems.length === 1 ? "" : "s"} scheduled${isSelected ? ", selected" : ""}`}
                    className={cx("flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-left", TRANSITION, FOCUS_RING_INSET, isSelected ? "bg-white/[0.08]" : "hover:bg-white/[0.04]")}
                  >
                    <span aria-hidden="true" className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className={cx("text-sm font-medium", isToday ? "text-orange-300" : TEXT_PRIMARY)}>{shortDayLabel(cell.year, cell.month, cell.day)}</span>
                        {isToday ? <span className="rounded-full bg-orange-500/12 px-1.5 py-[1px] text-[10px] font-medium text-orange-300">Today</span> : null}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5">
                        {channelsPresent.map((chId) => {
                          const channel = CHANNELS.find((c) => c.id === chId)!;
                          const Icon = channel.Icon;
                          const style = indicatorStyle(chId, activeChannels, allSelected);
                          return <Icon key={chId} aria-hidden="true" size={style.size} className={cx("shrink-0", style.className)} />;
                        })}
                      </span>
                    </span>
                    <span aria-hidden="true" className={cx("shrink-0 text-xs", NUM, TEXT_CAPTION)}>{dayItems.length}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </>
  );
}
