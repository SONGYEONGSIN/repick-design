"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ANCHOR_DATE, VIEW_MONTHS, getDay, monthSummary, appointmentsToCsv, fmtDateLong,
  type Metric,
} from "./data";
import { Sidebar, MobileDrawer } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette, useCommandPalette } from "./command-palette";
import { KpiStrip } from "./kpi-strip";
import { CalendarCard } from "./calendar";
import { DayDetailPanel, PinnedCompareStrip } from "./detail-panel";
import { TrendChartCard } from "./trend-chart";
import { AppointmentsTable } from "./appointments-table";
import { FOCUS_RING } from "./ui";

const ANCHOR_MONTH_INDEX = VIEW_MONTHS.findIndex((m) => m.key === ANCHOR_DATE.slice(0, 7));

export default function DashboardApp() {
  const [monthIndex, setMonthIndex] = useState(Math.max(0, ANCHOR_MONTH_INDEX));
  const [metric, setMetric] = useState<Metric>("utilization");
  const [selectedDate, setSelectedDate] = useState(ANCHOR_DATE);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [pinnedDates, setPinnedDates] = useState<string[]>(["2026-09-14", "2026-09-08"]);
  const [riskOnly, setRiskOnly] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const jumpToToday = useCallback(() => {
    setMonthIndex(Math.max(0, ANCHOR_MONTH_INDEX));
    setSelectedDate(ANCHOR_DATE);
  }, []);

  const toggleRiskOnly = useCallback(() => setRiskOnly((v) => !v), []);

  const palette = useCommandPalette({ jumpToToday, setMetric, toggleRiskOnly });

  const handleSelectDate = useCallback((date: string) => {
    setSelectedDate(date);
    const idx = VIEW_MONTHS.findIndex((m) => m.key === date.slice(0, 7));
    if (idx >= 0) setMonthIndex(idx);
  }, []);

  const handleTogglePin = useCallback(() => {
    setPinnedDates((prev) => {
      if (prev.includes(selectedDate)) return prev.filter((d) => d !== selectedDate);
      const next = [...prev, selectedDate];
      return next.length > 3 ? next.slice(next.length - 3) : next;
    });
  }, [selectedDate]);

  const handleExport = useCallback(() => {
    const record = getDay(selectedDate);
    const csv = appointmentsToCsv(fmtDateLong(selectedDate), record.appointments);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `openhour-appointments-${selectedDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [selectedDate]);

  const scrollToTable = useCallback(() => {
    document.getElementById("appointments-table")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const selectedRecord = useMemo(() => getDay(selectedDate), [selectedDate]);
  const summary = useMemo(() => monthSummary(VIEW_MONTHS[monthIndex]), [monthIndex]);

  return (
    <div className="flex min-h-screen bg-white">
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-zinc-900 focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white ${FOCUS_RING}`}
      >
        Skip to main content
      </a>
      <Sidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMenu={() => setDrawerOpen(true)}
          onOpenSearch={() => palette.setOpen(true)}
          onExport={handleExport}
        />

        <main id="main-content" className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1
              className="text-2xl font-bold text-zinc-900 sm:text-3xl"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              Capacity Calendar
            </h1>
            <p className="mt-1 text-sm font-normal text-zinc-500">
              Live booked-capacity heatmap across all three BrightPath locations.
            </p>
          </div>

          <KpiStrip summary={summary} />

          <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px] lg:gap-6">
            <CalendarCard
              months={VIEW_MONTHS}
              monthIndex={monthIndex}
              onMonthIndexChange={setMonthIndex}
              metric={metric}
              onMetricChange={setMetric}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              onHoverDate={setHoveredDate}
              pinnedDates={pinnedDates}
              riskOnly={riskOnly}
              onToggleRiskOnly={toggleRiskOnly}
            />

            <div className="space-y-5 lg:space-y-6">
              <DayDetailPanel
                record={selectedRecord}
                previewDate={hoveredDate}
                pinned={pinnedDates.includes(selectedDate)}
                onTogglePin={handleTogglePin}
                onJumpToTable={scrollToTable}
              />
              <PinnedCompareStrip
                pinnedDates={pinnedDates}
                onRemove={(date) => setPinnedDates((prev) => prev.filter((d) => d !== date))}
                onSelect={handleSelectDate}
                selectedDate={selectedDate}
              />
              <TrendChartCard />
            </div>
          </div>

          <AppointmentsTable date={selectedDate} appointments={selectedRecord.appointments} />
        </main>
      </div>

      <CommandPalette open={palette.open} onClose={() => palette.setOpen(false)} commands={palette.commands} />
    </div>
  );
}
