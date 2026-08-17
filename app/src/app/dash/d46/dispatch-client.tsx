"use client";

import { AlertTriangle, CalendarRange, CheckCircle2, Clock, ListChecks, PlayCircle, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CapacityRail from "./capacity-rail";
import CommandPalette from "./command-palette";
import {
  STATUS_LABEL,
  STATUS_ORDER,
  WEEKLY_TOTALS,
  type DayId,
  type Job,
  type SelectedKey,
  type Status,
  type TechId,
} from "./data";
import ScheduleDay from "./schedule-day";
import ScheduleWeek from "./schedule-week";
import Sidebar from "./sidebar";
import { FOCUS_RING, STATUS_TONE, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import Topbar from "./topbar";
import { SegmentedControl, StatItem } from "./ui";

const STATUS_ICON: Record<Status, LucideIcon> = {
  scheduled: Clock,
  "in-progress": PlayCircle,
  completed: CheckCircle2,
  unassigned: AlertTriangle,
};

type View = "week" | "day";

const ALL_STATUSES = new Set<Status>(STATUS_ORDER);

export default function DispatchClient() {
  const [view, setView] = useState<View>("week");
  const [selectedDay, setSelectedDay] = useState<DayId>("wed");
  const [selectedKey, setSelectedKey] = useState<SelectedKey>(null);
  const [activeStatuses, setActiveStatuses] = useState<Set<Status>>(ALL_STATUSES);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  function toggleStatus(status: Status) {
    setActiveStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  function handleSelectTechnician(id: TechId) {
    setSelectedKey((prev) => (prev === id ? null : id));
    setPaletteOpen(false);
  }

  function handleSelectJob(job: Job) {
    setSelectedDay(job.day);
    setView("day");
    setSelectedKey(job.techId ?? "unassigned");
    setPaletteOpen(false);
  }

  const heroIconIsAlarm = WEEKLY_TOTALS.unassignedJobs > 0;

  const statusChips = useMemo(
    () =>
      STATUS_ORDER.map((status) => {
        const tone = STATUS_TONE[status];
        const Icon = STATUS_ICON[status];
        const active = activeStatuses.has(status);
        return { status, tone, Icon, active, label: STATUS_LABEL[status] };
      }),
    [activeStatuses],
  );

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden bg-white", TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="flex w-full flex-col gap-4 p-4 sm:p-6">
            <header className="flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Dispatch schedule</h1>
                  <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Basin City HVAC &amp; Electric &middot; Week of Mar 9–13, 2026</p>
                </div>
                <SegmentedControl
                  ariaLabel="Select calendar view"
                  value={view}
                  onChange={setView}
                  options={[
                    { id: "week", label: "Week", Icon: CalendarRange },
                    { id: "day", label: "Day", Icon: ListChecks },
                  ]}
                />
              </div>

              <dl className="flex flex-wrap gap-x-8 gap-y-3">
                <StatItem Icon={ListChecks} label="Jobs this week" value={WEEKLY_TOTALS.totalJobs} />
                <StatItem Icon={Users} label="Technicians" value={WEEKLY_TOTALS.technicianCount} />
                <StatItem Icon={CalendarRange} label="Avg utilization" value={`${WEEKLY_TOTALS.avgUtilizationPct}%`} />
                <StatItem
                  Icon={AlertTriangle}
                  label="Unassigned"
                  value={WEEKLY_TOTALS.unassignedJobs}
                  valueClassName={heroIconIsAlarm ? "text-red-700" : undefined}
                />
              </dl>

              <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by job status">
                {statusChips.map(({ status, tone, Icon, active, label }) => (
                  <button
                    key={status}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleStatus(status)}
                    className={cx(
                      "flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
                      TRANSITION,
                      FOCUS_RING,
                      active ? cx(tone.text, tone.bg, tone.border) : cx("border-zinc-200 bg-white text-zinc-500 line-through decoration-zinc-400"),
                    )}
                  >
                    <Icon size={12} aria-hidden="true" />
                    {label}
                  </button>
                ))}
              </div>
            </header>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
              <CapacityRail selectedKey={selectedKey} onSelectKey={setSelectedKey} className="lg:w-64 lg:shrink-0" />

              <div className="min-w-0 flex-1">
                {view === "week" ? (
                  <ScheduleWeek activeStatuses={activeStatuses} selectedKey={selectedKey} />
                ) : (
                  <ScheduleDay selectedDay={selectedDay} onSelectDay={setSelectedDay} activeStatuses={activeStatuses} selectedKey={selectedKey} />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectTechnician={handleSelectTechnician} onSelectJob={handleSelectJob} /> : null}
    </div>
  );
}
