"use client";

import { ArrowUpDown, CalendarX2, X } from "lucide-react";
import { useMemo } from "react";
import {
  CHANNELS,
  CHANNEL_BY_ID,
  type ChannelId,
  CONTRIBUTORS,
  type ContentItem,
  ITEMS_BY_DATE,
  STATUSES,
  STATUS_BY_ID,
  type Status,
  formatTime,
  fullDayLabel,
  itemsForMonth,
  monthLabel,
  shortDayLabel,
} from "../data";
import { BORDER, DIVIDE, FOCUS_RING, NUM, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { CardHeader, InitialsAvatar, StatusBadge } from "./ui";

export type SortMode = "soonest" | "channel";

function sortItems(items: ContentItem[], mode: SortMode): ContentItem[] {
  const copy = [...items];
  copy.sort((a, b) => {
    if (mode === "channel") {
      const ca = CHANNELS.findIndex((c) => c.id === a.channel);
      const cb = CHANNELS.findIndex((c) => c.id === b.channel);
      if (ca !== cb) return ca - cb;
    }
    if (a.year !== b.year) return a.year - b.year;
    if (a.month !== b.month) return a.month - b.month;
    if (a.day !== b.day) return a.day - b.day;
    return a.time.localeCompare(b.time);
  });
  return copy;
}

export default function QueueList({
  year,
  month,
  selectedDateKey,
  onClearSelection,
  activeChannels,
  statusFilter,
  onStatusFilterChange,
  sortMode,
  onSortModeChange,
  todayKey,
}: {
  year: number;
  month: number;
  selectedDateKey: string | null;
  onClearSelection: () => void;
  activeChannels: Set<ChannelId>;
  statusFilter: Status | "all";
  onStatusFilterChange: (s: Status | "all") => void;
  sortMode: SortMode;
  onSortModeChange: (m: SortMode) => void;
  todayKey: string;
}) {
  const basePool = useMemo(() => {
    if (selectedDateKey) return ITEMS_BY_DATE[selectedDateKey] ?? [];
    return itemsForMonth(year, month);
  }, [selectedDateKey, year, month]);

  const filtered = useMemo(
    () => basePool.filter((i) => activeChannels.has(i.channel) && (statusFilter === "all" || i.status === statusFilter)),
    [basePool, activeChannels, statusFilter],
  );

  const sorted = useMemo(() => sortItems(filtered, sortMode), [filtered, sortMode]);

  const heading = selectedDateKey
    ? (() => {
        const [y, m, d] = selectedDateKey.split("-").map(Number);
        return fullDayLabel(y, m - 1, d);
      })()
    : `Upcoming in ${monthLabel(year, month)}`;

  return (
    <div>
      <CardHeader
        title={heading}
        titleId="queue-heading"
        description={`${sorted.length} item${sorted.length === 1 ? "" : "s"}${selectedDateKey ? "" : " scheduled this month"}`}
        action={
          selectedDateKey ? (
            <button
              type="button"
              onClick={onClearSelection}
              className={cx("flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium", TEXT_CAPTION, "hover:text-zinc-100", TRANSITION, FOCUS_RING)}
            >
              <X size={13} aria-hidden="true" />
              Clear
            </button>
          ) : undefined
        }
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label htmlFor="queue-status-filter" className="sr-only">
          Filter queue by status
        </label>
        <select
          id="queue-status-filter"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as Status | "all")}
          className={cx(
            "h-9 min-w-0 flex-1 rounded-lg border bg-zinc-950 px-2.5 text-xs font-medium",
            BORDER,
            TEXT_PRIMARY,
            TRANSITION,
            FOCUS_RING,
          )}
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        <div role="group" aria-label="Sort queue" className={cx("flex h-9 shrink-0 items-center gap-0.5 rounded-lg border p-0.5", BORDER)}>
          {(
            [
              { id: "soonest", label: "Soonest" },
              { id: "channel", label: "By channel" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              aria-pressed={sortMode === opt.id}
              onClick={() => onSortModeChange(opt.id)}
              className={cx(
                "flex h-full items-center gap-1 rounded-md px-2 text-[11px] font-medium",
                TRANSITION,
                FOCUS_RING,
                sortMode === opt.id ? "bg-orange-500/15 text-orange-300" : cx(TEXT_CAPTION, "hover:text-zinc-100"),
              )}
            >
              {opt.id === "soonest" ? <ArrowUpDown size={11} aria-hidden="true" /> : null}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 py-8 text-center">
          <CalendarX2 size={22} aria-hidden="true" className={TEXT_CAPTION} />
          <p className={cx("max-w-[220px] text-sm", TEXT_CAPTION)}>
            {selectedDateKey ? "No items scheduled for this day." : "No items match the current filters."}
          </p>
        </div>
      ) : (
        <ul aria-labelledby="queue-heading" className={cx("mt-3 flex max-h-[520px] flex-col divide-y overflow-y-auto pr-1 [scrollbar-width:thin]", DIVIDE)}>
          {sorted.map((item) => {
            const channel = CHANNEL_BY_ID[item.channel];
            const status = STATUS_BY_ID[item.status];
            const owner = CONTRIBUTORS[item.owner];
            const ChannelIcon = channel.Icon;
            const isToday = `${item.year}-${String(item.month + 1).padStart(2, "0")}-${String(item.day).padStart(2, "0")}` === todayKey;
            return (
              <li key={item.id} className="py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.04]">
                    <ChannelIcon size={14} aria-hidden="true" className={TEXT_CAPTION} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cx("line-clamp-2 text-sm font-medium leading-snug", TEXT_PRIMARY)}>{item.title}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className={cx("whitespace-nowrap text-xs", NUM, isToday ? "text-orange-300" : TEXT_CAPTION)}>
                        {selectedDateKey ? formatTime(item.time) : `${shortDayLabel(item.year, item.month, item.day)} · ${formatTime(item.time)}`}
                      </span>
                      <StatusBadge status={item.status} Icon={status.Icon} label={status.label} />
                      <span className="ml-auto flex items-center gap-1.5">
                        <InitialsAvatar initials={owner.initials} size={20} />
                        <span className="sr-only">{owner.name}, {owner.role}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
