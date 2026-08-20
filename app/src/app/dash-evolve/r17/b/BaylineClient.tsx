"use client";

import { CalendarClock, ClipboardCheck, Flame, Timer } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import BayTable from "./BayTable";
import CommandPalette from "./CommandPalette";
import DayAgenda from "./DayAgenda";
import LoadCalendar from "./LoadCalendar";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TrendChart from "./TrendChart";
import WeekdayProfile from "./WeekdayProfile";
import type { BayId, MetricId } from "./data";
import { DAYS, GRAND_TOTALS, METRIC_BY_ID, PEAK_DAY, TOTAL_CAPACITY_HOURS, WEEKDAYS, fmt } from "./data";
import { APP_BG, BORDER, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import { StatTile } from "./ui";

const DEFAULT_DAY = 17; // Thursday, February 19, 2026 — a full seven-order day.

export default function BaylineClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [metric, setMetric] = useState<MetricId>("hours");
  const [selectedIndex, setSelectedIndex] = useState(DEFAULT_DAY);
  /** Calendar hover/focus readout — null means "show the selection". */
  const [readoutIndex, setReadoutIndex] = useState<number | null>(null);
  /** Trend crosshair — null means "sit on the selection". */
  const [cursorIndex, setCursorIndex] = useState<number | null>(null);
  const [highlightBayId, setHighlightBayId] = useState<BayId | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const selectDay = useCallback((i: number) => {
    setSelectedIndex(i);
    setCursorIndex(null);
  }, []);

  const day = DAYS[selectedIndex];
  const peak = PEAK_DAY[metric];
  const shiftUse = Math.round((GRAND_TOTALS.hours / TOTAL_CAPACITY_HOURS) * 100);
  const otShare = Math.round((GRAND_TOTALS.overtime / GRAND_TOTALS.hours) * 100);

  return (
    <div className={cx("flex min-h-dvh", APP_BG)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
              <h1 className={cx("text-2xl font-semibold tracking-tight", TEXT_PRIMARY)}>Bay capacity</h1>
              <p className={cx("mt-1 max-w-2xl text-[13px] font-normal leading-relaxed", TEXT_CAPTION)}>
                Terminal 4 shop floor, six-week planning horizon. Pick any day on the calendar to open its agenda; the trend and the
                bay roster follow the same figure.
              </p>
            </div>
            <dl className={cx("flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border px-3.5 py-2", BORDER, "bg-white")}>
              <div>
                <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Horizon</dt>
                <dd className={cx("mt-0.5 whitespace-nowrap text-[13px] font-medium", NUM, TEXT_PRIMARY)}>Feb 2 – Mar 15, 2026</dd>
              </div>
              <div>
                <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Shop clock</dt>
                <dd className={cx("mt-0.5 whitespace-nowrap text-[13px] font-medium", NUM, TEXT_PRIMARY)}>America/Chicago</dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              Icon={ClipboardCheck}
              label="Work orders"
              value={fmt(GRAND_TOTALS.orders)}
              sub="booked across 42 days"
              highlighted={metric === "orders"}
            />
            <StatTile
              Icon={CalendarClock}
              label="Bay hours"
              value={`${fmt(GRAND_TOTALS.hours)}h`}
              sub={`${shiftUse}% of ${fmt(TOTAL_CAPACITY_HOURS)}h shift capacity`}
              highlighted={metric === "hours"}
            />
            <StatTile
              Icon={Timer}
              label="Overtime"
              value={`${fmt(GRAND_TOTALS.overtime)}h`}
              sub={`${otShare}% of all bay time`}
              highlighted={metric === "overtime"}
            />
            <StatTile
              Icon={Flame}
              label="Busiest day"
              value={`${WEEKDAYS[peak.weekdayIndex]} ${peak.short}`}
              sub={`${fmt(peak.values[metric])} ${METRIC_BY_ID[metric].short} — the period high`}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="min-w-0 xl:col-span-8">
              <LoadCalendar
                metric={metric}
                onMetricChange={setMetric}
                selectedIndex={selectedIndex}
                onSelect={selectDay}
                readoutIndex={readoutIndex}
                onReadout={setReadoutIndex}
              />
            </div>
            <div className="min-w-0 xl:col-span-4">
              <DayAgenda day={day} metric={metric} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
            <div className="min-w-0 xl:col-span-8">
              <TrendChart metric={metric} selectedIndex={selectedIndex} onSelect={selectDay} cursorIndex={cursorIndex} onCursor={setCursorIndex} />
            </div>
            <div className="min-w-0 xl:col-span-4">
              <WeekdayProfile metric={metric} />
            </div>
          </div>

          <div className="mt-4">
            <BayTable metric={metric} highlightBayId={highlightBayId} />
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette
          metric={metric}
          onClose={() => setPaletteOpen(false)}
          onSelectDay={selectDay}
          onFocusBay={(id) => setHighlightBayId(id)}
        />
      ) : null}
    </div>
  );
}
