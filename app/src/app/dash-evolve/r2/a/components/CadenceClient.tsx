"use client";

import { useEffect, useMemo, useState } from "react";
import { buildMonthCells, buildWeekRows } from "../lib/calendar";
import {
  CALENDAR_DAYS,
  CALENDAR_WEEKS,
  CHANNEL_ORDER,
  DEFAULT_WEEK_INDEX,
  POSTS,
  TODAY_ISO,
  WEEK_HOURS,
  weekRangeLabel,
  type ChannelId,
} from "../lib/data";
import CalendarToolbar from "./CalendarToolbar";
import CommandPalette from "./CommandPalette";
import EventDrawer from "./EventDrawer";
import MonthGrid from "./MonthGrid";
import QueueRail from "./QueueRail";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Card } from "./ui";
import WeekGrid from "./WeekGrid";

export type CalendarView = "month" | "week";

const MONTH_LABEL = "2026년 7월";

export default function CadenceClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<CalendarView>("month");
  const [weekIndex, setWeekIndex] = useState(DEFAULT_WEEK_INDEX);
  const [activeChannels, setActiveChannels] = useState<ChannelId[]>(CHANNEL_ORDER);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

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

  const filteredPosts = useMemo(() => POSTS.filter((p) => activeChannels.includes(p.channel)), [activeChannels]);

  const monthCells = useMemo(() => buildMonthCells(CALENDAR_DAYS, filteredPosts), [filteredPosts]);

  const currentWeek = CALENDAR_WEEKS[weekIndex];
  const weekRows = useMemo(() => buildWeekRows(currentWeek, filteredPosts, WEEK_HOURS), [currentWeek, filteredPosts]);

  const periodLabel = view === "month" ? MONTH_LABEL : weekRangeLabel(currentWeek);

  function toggleChannel(c: ChannelId) {
    setActiveChannels((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  function resetChannels() {
    setActiveChannels(CHANNEL_ORDER);
  }

  function onlyChannel(c: ChannelId) {
    setActiveChannels([c]);
  }

  function selectEvent(id: string) {
    setSelectedEventId(id);
  }

  function selectDay(date: string) {
    setSelectedDate(date);
    setSelectedEventId(null);
  }

  function closeDrawer() {
    setSelectedDate(null);
    setSelectedEventId(null);
  }

  function backToAgenda() {
    setSelectedEventId(null);
  }

  function goToToday() {
    setView("week");
    setWeekIndex(DEFAULT_WEEK_INDEX);
  }

  function openComposeFlow() {
    setSelectedEventId(null);
    setSelectedDate(TODAY_ISO);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 font-sans text-zinc-900 lg:h-dvh lg:flex-row lg:overflow-hidden">
      <h1 className="sr-only">Cadence — 콘텐츠 발행 캘린더</h1>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col lg:h-full lg:overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} onOpenPalette={() => setPaletteOpen(true)} onComposeClick={openComposeFlow} />

        <CalendarToolbar
          view={view}
          onViewChange={setView}
          periodLabel={periodLabel}
          weekIndex={weekIndex}
          weekCount={CALENDAR_WEEKS.length}
          onPrevWeek={() => setWeekIndex((i) => Math.max(0, i - 1))}
          onNextWeek={() => setWeekIndex((i) => Math.min(CALENDAR_WEEKS.length - 1, i + 1))}
          onToday={() => setWeekIndex(DEFAULT_WEEK_INDEX)}
          channels={CHANNEL_ORDER}
          activeChannels={activeChannels}
          onToggleChannel={toggleChannel}
          onResetChannels={resetChannels}
        />

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6 lg:flex-row lg:overflow-hidden">
          <div className="flex min-h-[560px] min-w-0 flex-1 flex-col lg:min-h-0">
            <Card className="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
              {view === "month" ? (
                <MonthGrid cells={monthCells} onSelectEvent={selectEvent} onSelectDay={selectDay} />
              ) : (
                <WeekGrid week={currentWeek} rows={weekRows} onSelectEvent={selectEvent} onSelectDay={selectDay} />
              )}
            </Card>
          </div>

          <QueueRail activeChannels={activeChannels} posts={filteredPosts} onSelectEvent={selectEvent} />
        </div>
      </div>

      <EventDrawer date={selectedDate} eventId={selectedEventId} onClose={closeDrawer} onSelectEvent={selectEvent} onBack={backToAgenda} />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSetView={setView}
        onGoToday={goToToday}
        onOnlyChannel={onlyChannel}
        onResetChannels={resetChannels}
      />
    </div>
  );
}
