"use client";

import { AlertTriangle, CalendarRange, CheckCircle2, Clock, Gauge, LayoutGrid, ListChecks } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import BookingsTable from "./BookingsTable";
import CommandPalette from "./CommandPalette";
import {
  MONTH_LABEL,
  RESOURCES,
  WEEK_LABEL,
  WINDOW_HOURS,
  resourceOf,
  weekBookings,
  type BookingStatus,
  type PaletteCommand,
  type ResourceId,
} from "./data";
import { formatHours, formatPercent } from "./format";
import MonthOverview from "./MonthOverview";
import ResourceRail from "./ResourceRail";
import Sidebar from "./Sidebar";
import { TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import Topbar from "./Topbar";
import { SegmentedControl, StatItem } from "./ui";
import WeekBoard from "./WeekBoard";

type View = "week" | "month";

function scrollIntoViewGated(el: HTMLElement | null) {
  if (!el) return;
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export default function CorridorClient() {
  const [view, setView] = useState<View>("week");
  const [selectedResource, setSelectedResource] = useState<ResourceId | null>(null);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const boardSectionRef = useRef<HTMLDivElement>(null);

  const filteredBookings = useMemo(() => weekBookings(selectedResource), [selectedResource]);
  const capacityDivisor = selectedResource ? 1 : RESOURCES.length;

  const weekStats = useMemo(() => {
    const confirmed = filteredBookings.filter((b) => b.status === "confirmed").length;
    const pending = filteredBookings.filter((b) => b.status === "pending").length;
    const conflict = filteredBookings.filter((b) => b.status === "conflict").length;
    const hoursBooked = filteredBookings.reduce((sum, b) => sum + b.durationHours, 0);
    const avgOccupancyPct = Math.round((hoursBooked / (WINDOW_HOURS * capacityDivisor * 7)) * 100);
    return { total: filteredBookings.length, confirmed, pending, conflict, avgOccupancyPct };
  }, [filteredBookings, capacityDivisor]);

  function runCommand(command: PaletteCommand) {
    if (command.id === "view-week") setView("week");
    else if (command.id === "view-month") setView("month");
    else if (command.id === "clear-resource") setSelectedResource(null);
    else if (command.id.startsWith("resource-")) setSelectedResource(command.id.replace("resource-", "") as ResourceId);
    else if (command.id === "filter-all") setStatusFilter("all");
    else if (command.id === "filter-confirmed") setStatusFilter("confirmed");
    else if (command.id === "filter-pending") setStatusFilter("pending");
    else if (command.id === "filter-conflict") setStatusFilter("conflict");
    else if (command.id === "jump-today") {
      setView("week");
      scrollIntoViewGated(boardSectionRef.current);
    }
  }

  function openPalette() {
    setPaletteOpen(true);
  }

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

  return (
    <div className="flex h-dvh min-h-dvh overflow-hidden bg-white">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={openPalette} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="flex w-full flex-col gap-4 p-4 sm:p-6">
            <header className="flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)} style={{ fontFamily: "var(--font-display-wide)" }}>
                    Booking overview
                  </h1>
                  <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Solandra Group · {selectedResource ? `${resourceOf(selectedResource).name} only` : "All resources"} · {view === "week" ? WEEK_LABEL : MONTH_LABEL}</p>
                </div>
                <SegmentedControl
                  ariaLabel="Select calendar view"
                  value={view}
                  onChange={setView}
                  options={[
                    { id: "week", label: "Week", Icon: CalendarRange },
                    { id: "month", label: "Month", Icon: LayoutGrid },
                  ]}
                />
              </div>

              <dl className="flex flex-wrap gap-x-8 gap-y-3">
                <StatItem Icon={ListChecks} label="Bookings this week" value={weekStats.total} />
                <StatItem Icon={CheckCircle2} label="Confirmed" value={weekStats.confirmed} />
                <StatItem Icon={Clock} label="Pending" value={weekStats.pending} valueClassName={weekStats.pending > 0 ? "text-amber-700" : undefined} />
                <StatItem Icon={AlertTriangle} label="Conflicts" value={weekStats.conflict} valueClassName={weekStats.conflict > 0 ? "text-rose-700" : undefined} />
                <StatItem Icon={Gauge} label="Avg occupancy" value={formatPercent(weekStats.avgOccupancyPct)} hint={formatHours(filteredBookings.reduce((s, b) => s + b.durationHours, 0))} />
              </dl>
            </header>

            <div className="lg:grid lg:grid-cols-12 lg:gap-4">
              <ResourceRail selected={selectedResource} onSelect={setSelectedResource} className="mb-4 lg:col-span-3 lg:mb-0" />

              <div className="min-w-0 lg:col-span-9">
                <div ref={boardSectionRef} className="flex flex-col gap-4">
                  {view === "week" ? (
                    <WeekBoard bookings={filteredBookings} capacityDivisor={capacityDivisor} headingId="week-board-heading" />
                  ) : (
                    <MonthOverview headingId="month-overview-heading" />
                  )}
                  <BookingsTable bookings={filteredBookings} headingId="bookings-table-heading" statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onRun={runCommand} /> : null}
    </div>
  );
}
