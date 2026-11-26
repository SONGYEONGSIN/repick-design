"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Sidebar, type NavKey } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CalendarPanel, type CalendarView } from "./CalendarPanel";
import { KpiRow } from "./KpiRow";
import { SiteRail } from "./SiteRail";
import { VisitBoard } from "./VisitBoard";
import { CommandPalette } from "./CommandPalette";
import { NewVisitModal } from "./NewVisitModal";
import {
  ALL_VISITS,
  TODAY_DAY,
  atRiskVisits,
  busiestDay,
  filterByTrial,
  getTrial,
  type StatusFilter,
  type TrialId,
  type Visit,
} from "./data";

export function SiteframeApp() {
  const [visits, setVisits] = useState<Visit[]>(ALL_VISITS);
  const [activeTrialId, setActiveTrialId] = useState<TrialId>("arx312");
  const [selectedDay, setSelectedDay] = useState(TODAY_DAY);
  const [view, setView] = useState<CalendarView>("month");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [newVisitOpen, setNewVisitOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavKey>("calendar");
  const [compactBoard, setCompactBoard] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const sitesRef = useRef<HTMLDivElement>(null);

  const trial = getTrial(activeTrialId);
  const trialVisits = useMemo(() => filterByTrial(visits, activeTrialId), [visits, activeTrialId]);
  const atRisk = useMemo(() => atRiskVisits(trialVisits), [trialVisits]);
  const busiest = useMemo(() => busiestDay(trialVisits), [trialVisits]);

  const jumpTo = useCallback((target: NavKey) => {
    const refMap = { calendar: calendarRef, board: boardRef, sites: sitesRef };
    refMap[target].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleNavigate = useCallback(
    (key: NavKey) => {
      setActiveNav(key);
      setMobileNavOpen(false);
      jumpTo(key);
    },
    [jumpTo]
  );

  const handleSelectDay = useCallback((day: number) => {
    setSelectedDay(day);
  }, []);

  const handleSwitchTrial = useCallback((id: TrialId) => {
    setActiveTrialId(id);
    setSelectedDay(TODAY_DAY);
  }, []);

  const handleCreateVisit = useCallback((visit: Visit) => {
    setVisits((prev) => [...prev, visit]);
  }, []);

  const handlePaletteStatusFilter = useCallback(
    (f: StatusFilter) => {
      setStatusFilter(f);
      setActiveNav("board");
      jumpTo("board");
    },
    [jumpTo]
  );

  const handleJumpToDay = useCallback(
    (day: number) => {
      setSelectedDay(day);
      setActiveNav("board");
      jumpTo("board");
    },
    [jumpTo]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      <Sidebar
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        activeNav={activeNav}
        onNavigate={handleNavigate}
        activeTrialId={activeTrialId}
        onSwitchTrial={handleSwitchTrial}
        compactBoard={compactBoard}
        onToggleCompactBoard={() => setCompactBoard((v) => !v)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenNewVisit={() => setNewVisitOpen(true)}
          atRisk={atRisk}
          onSelectAtRisk={handleJumpToDay}
        />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-zinc-900" style={{ fontFamily: "var(--font-display-grotesk)" }}>
            Visit calendar
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {trial.name} · sponsored by {trial.sponsor}
          </p>

          <div className="mt-6">
            <KpiRow visits={trialVisits} trial={trial} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div ref={calendarRef} className="min-w-0 lg:col-span-8">
              <CalendarPanel visits={trialVisits} view={view} onViewChange={setView} selectedDay={selectedDay} onSelectDay={handleSelectDay} />
            </div>
            <div ref={sitesRef} className="min-w-0 lg:col-span-4">
              <SiteRail visits={trialVisits} headingId="sites-heading" />
            </div>
          </div>

          <div ref={boardRef} className="mt-6">
            <VisitBoard
              visits={trialVisits}
              selectedDay={selectedDay}
              compact={compactBoard}
              headingId="board-heading"
              filter={statusFilter}
              onFilterChange={setStatusFilter}
            />
          </div>
        </main>
      </div>

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onSwitchTrial={handleSwitchTrial}
          onSetView={setView}
          onSelectDay={handleJumpToDay}
          onSetStatusFilter={handlePaletteStatusFilter}
          todayDay={TODAY_DAY}
          busiestDay={busiest}
        />
      )}

      {newVisitOpen && (
        <NewVisitModal
          day={selectedDay}
          trialId={activeTrialId}
          nextId={`${activeTrialId}-custom-${visits.length}`}
          onClose={() => setNewVisitOpen(false)}
          onCreate={handleCreateVisit}
        />
      )}
    </div>
  );
}
