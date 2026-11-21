"use client";

import { useEffect, useRef, useState } from "react";
import { MobileSidebar, Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { NewJobModal } from "./NewJobModal";
import { KpiRow } from "./KpiRow";
import { UtilizationBullets } from "./UtilizationBullets";
import { ScheduleSection } from "./ScheduleSection";
import { JobsTable } from "./JobsTable";
import { TechnicianDrawer } from "./TechnicianDrawer";
import { DISPLAY_FACE } from "./ui";
import { DAY_LABEL, TECHNICIANS, type BoardView, type StatusFilter, type TechnicianId } from "./data";

export function JoblineClient() {
  // Primary job-schedule filters — shared by the board and the calendar (the status chip in
  // `ScheduleSection`) so switching view never loses the filter. The jobs table below has its own,
  // fully independent status filter and does not read this one.
  const [view, setView] = useState<BoardView>("board");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Pin axis — scoped to exactly one summary widget, the technician drawer. Neither the board nor
  // the calendar reads `pinnedTechId` for anything other than drawing a highlight on the pinned
  // column/row's own header button; the job lists they render never depend on it.
  const [pinnedTechId, setPinnedTechId] = useState<TechnicianId | null>(null);

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [newJobOpen, setNewJobOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const paletteTriggerRef = useRef<HTMLButtonElement>(null);
  const newJobTriggerRef = useRef<HTMLButtonElement>(null);

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

  function togglePin(id: TechnicianId) {
    setPinnedTechId((current) => (current === id ? null : id));
  }

  return (
    <div className="flex min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900 focus:shadow-xl focus:outline-2 focus:outline-offset-2 focus:outline-green-700"
      >
        Skip to main content
      </a>
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <Topbar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenNewJob={() => setNewJobOpen(true)}
          paletteTriggerRef={paletteTriggerRef}
          newJobTriggerRef={newJobTriggerRef}
        />
        <main id="main-content" className="min-h-0 min-w-0 flex-1">
          <div className="mx-auto w-full min-w-0 max-w-[1760px] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-zinc-900 sm:text-3xl" style={DISPLAY_FACE}>
                Dispatch
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {DAY_LABEL} · Jobs across {TECHNICIANS.length} technicians
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-6">
              <KpiRow />
              <UtilizationBullets />
              <ScheduleSection
                view={view}
                onViewChange={setView}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                pinnedTechId={pinnedTechId}
                onTogglePin={togglePin}
              />
              <JobsTable pinnedTechId={pinnedTechId} />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSwitchView={setView}
        onSetStatusFilter={setStatusFilter}
        onPinTechnician={setPinnedTechId}
        triggerRef={paletteTriggerRef}
      />
      <NewJobModal
        open={newJobOpen}
        onClose={() => setNewJobOpen(false)}
        onAssign={setPinnedTechId}
        triggerRef={newJobTriggerRef}
      />
      <TechnicianDrawer techId={pinnedTechId} onClose={() => setPinnedTechId(null)} />
    </div>
  );
}
