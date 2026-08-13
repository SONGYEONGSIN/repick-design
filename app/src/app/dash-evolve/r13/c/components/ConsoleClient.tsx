"use client";

import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  CHANNELS,
  type ChannelId,
  DEFAULT_MONTH_INDEX,
  MONTHS,
  type Status,
  TODAY_KEY,
  countByChannel,
  countByStatus,
  itemsForMonth,
  monthLabel,
} from "../data";
import CalendarGrid from "./CalendarGrid";
import ChannelFilter from "./ChannelFilter";
import CommandPalette from "./CommandPalette";
import QueueList, { type SortMode } from "./QueueList";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { BORDER, CARD, DISPLAY_FONT_STYLE, FOCUS_RING, NUM, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

export default function ConsoleClient() {
  const [monthIndex, setMonthIndex] = useState(DEFAULT_MONTH_INDEX);
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(TODAY_KEY);
  const [activeChannels, setActiveChannels] = useState<Set<ChannelId>>(() => new Set(CHANNELS.map((c) => c.id)));
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("soonest");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const { year, month } = MONTHS[monthIndex];

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function goToMonth(index: number) {
    if (index < 0 || index >= MONTHS.length) return;
    setMonthIndex(index);
    const target = MONTHS[index];
    const prefix = `${target.year}-${String(target.month + 1).padStart(2, "0")}`;
    setSelectedDateKey((prev) => (prev && prev.startsWith(prefix) ? prev : null));
  }

  function goToToday() {
    setMonthIndex(DEFAULT_MONTH_INDEX);
    setSelectedDateKey(TODAY_KEY);
  }

  function selectDay(key: string) {
    setSelectedDateKey((prev) => (prev === key ? null : key));
  }

  function toggleChannel(id: ChannelId) {
    setActiveChannels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllChannels() {
    setActiveChannels(new Set(CHANNELS.map((c) => c.id)));
  }
  function clearChannels() {
    setActiveChannels(new Set());
  }
  function filterChannelOnly(id: ChannelId) {
    setActiveChannels(new Set([id]));
  }

  const monthItems = useMemo(() => itemsForMonth(year, month), [year, month]);
  const channelCounts = useMemo(() => countByChannel(monthItems), [monthItems]);
  const statusCounts = useMemo(() => countByStatus(monthItems), [monthItems]);
  const canGoPrev = monthIndex > 0;
  const canGoNext = monthIndex < MONTHS.length - 1;

  return (
    <div className="flex h-dvh max-h-dvh min-h-0 overflow-hidden bg-zinc-950 text-zinc-50">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 style={DISPLAY_FONT_STYLE} className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>
                  Content Calendar
                </h1>
                <p className={cx("mt-1 text-sm", TEXT_CAPTION)}>
                  <span className={NUM}>{monthItems.length}</span> posts this month · <span className={NUM}>{statusCounts.scheduled}</span> scheduled ·{" "}
                  <span className={NUM}>{statusCounts.review}</span> in review
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToToday}
                  className={cx("hidden h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium sm:inline-flex", BORDER, TEXT_CAPTION, "hover:text-zinc-100 hover:bg-white/5", TRANSITION, FOCUS_RING)}
                >
                  <RotateCcw size={13} aria-hidden="true" />
                  Today
                </button>
                <div className={cx("flex items-center gap-1 rounded-lg border p-1", BORDER)}>
                  <button
                    type="button"
                    onClick={() => goToMonth(monthIndex - 1)}
                    disabled={!canGoPrev}
                    aria-label="Previous month"
                    className={cx("grid h-8 w-8 place-items-center rounded-md", TRANSITION, FOCUS_RING, canGoPrev ? cx(TEXT_CAPTION, "hover:bg-white/5 hover:text-zinc-100") : "text-zinc-700")}
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                  </button>
                  <span aria-live="polite" style={DISPLAY_FONT_STYLE} className={cx("min-w-[132px] px-1 text-center text-sm font-medium", TEXT_PRIMARY)}>
                    {monthLabel(year, month)}
                  </span>
                  <button
                    type="button"
                    onClick={() => goToMonth(monthIndex + 1)}
                    disabled={!canGoNext}
                    aria-label="Next month"
                    className={cx("grid h-8 w-8 place-items-center rounded-md", TRANSITION, FOCUS_RING, canGoNext ? cx(TEXT_CAPTION, "hover:bg-white/5 hover:text-zinc-100") : "text-zinc-700")}
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <CalendarGrid year={year} month={month} todayKey={TODAY_KEY} selectedDateKey={selectedDateKey} onSelectDay={selectDay} activeChannels={activeChannels} />

              <div className="flex flex-col gap-6">
                <div className={cx(CARD, "p-4 sm:p-5")}>
                  <ChannelFilter activeChannels={activeChannels} onToggle={toggleChannel} onSelectAll={selectAllChannels} onClear={clearChannels} counts={channelCounts} />
                </div>
                <div className={cx(CARD, "p-4 sm:p-5")}>
                  <QueueList
                    year={year}
                    month={month}
                    selectedDateKey={selectedDateKey}
                    onClearSelection={() => setSelectedDateKey(null)}
                    activeChannels={activeChannels}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    sortMode={sortMode}
                    onSortModeChange={setSortMode}
                    todayKey={TODAY_KEY}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onGoToMonth={goToMonth}
          onGoToToday={goToToday}
          onFilterChannelOnly={filterChannelOnly}
          onClearFilters={selectAllChannels}
        />
      ) : null}
    </div>
  );
}
