"use client";

import { useEffect, useRef, useState } from "react";
import { MobileSidebar, Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { NewBookingModal } from "./NewBookingModal";
import { BookingCalendar } from "./CalendarGrid";
import { DayDetail } from "./DayDetail";
import { RevenueTrend } from "./RevenueTrend";
import { MonthSummary } from "./MonthSummary";
import { BookingsTable } from "./BookingsTable";
import { Card } from "./ui";
import { DAYS_IN_MONTH, TODAY_DAY, type ViewMode } from "./data";

export function StagebookClient() {
  // Primary axis — which day the calendar has selected. Every other widget on the page describes
  // this same day (or, for the table, highlights rows that fall on it), the same way a reporting
  // period is shared across a hero and its charts elsewhere in this catalog.
  const [selectedDay, setSelectedDay] = useState<number>(TODAY_DAY);
  const [view, setView] = useState<ViewMode>("month");

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const paletteTriggerRef = useRef<HTMLButtonElement>(null);
  const newBookingTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function selectDay(day: number) {
    if (day >= 1 && day <= DAYS_IN_MONTH) setSelectedDay(day);
  }

  return (
    <div className="flex min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900 focus:shadow-xl focus:outline-2 focus:outline-offset-2 focus:outline-orange-600"
      >
        Skip to main content
      </a>
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <Topbar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenNewBooking={() => setNewBookingOpen(true)}
          paletteTriggerRef={paletteTriggerRef}
          newBookingTriggerRef={newBookingTriggerRef}
        />
        <main id="main-content" className="min-h-0 min-w-0 flex-1">
          <div className="mx-auto w-full min-w-0 max-w-[1760px] px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-12 items-start gap-6">
              <div className="col-span-12 min-w-0 lg:col-span-8">
                <Card>
                  <BookingCalendar
                    view={view}
                    selectedDay={selectedDay}
                    onSelectDay={selectDay}
                    onViewChange={setView}
                    onJumpToday={() => selectDay(TODAY_DAY)}
                  />
                </Card>
              </div>

              <div className="col-span-12 flex min-w-0 flex-col gap-6 lg:col-span-4">
                <DayDetail day={selectedDay} />
                <RevenueTrend />
                <MonthSummary />
              </div>

              <div className="col-span-12 min-w-0">
                <BookingsTable selectedDay={selectedDay} />
              </div>
            </div>
          </div>
        </main>
      </div>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSwitchView={setView}
        onSelectDay={selectDay}
        triggerRef={paletteTriggerRef}
      />
      <NewBookingModal
        open={newBookingOpen}
        onClose={() => setNewBookingOpen(false)}
        onCreate={selectDay}
        triggerRef={newBookingTriggerRef}
      />
    </div>
  );
}
