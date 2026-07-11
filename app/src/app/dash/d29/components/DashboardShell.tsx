"use client";

import { useEffect, useState } from "react";
import { FilterProvider } from "../context/FilterContext";
import { ActivityFeed } from "./ActivityFeed";
import { CommandPalette } from "./CommandPalette";
import { DueSoon } from "./DueSoon";
import { KpiRow } from "./KpiRow";
import { MyTasks } from "./MyTasks";
import { ProjectFilterBar } from "./ProjectFilterBar";
import { ProjectTable } from "./ProjectTable";
import { Sidebar } from "./Sidebar";
import { TeamWorkload } from "./TeamWorkload";
import { TimelineGantt } from "./TimelineGantt";
import { TopBar } from "./TopBar";

export function DashboardShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <FilterProvider>
      <div className="flex min-h-screen bg-zinc-50">
        <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            onOpenPalette={() => setPaletteOpen(true)}
            onOpenMobileMenu={() => setMobileNavOpen(true)}
          />

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-w-0 max-w-[1600px] flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                    프로젝트 대시보드
                  </h1>
                  <p className="mt-0.5 text-sm text-zinc-500">
                    Nova Studio 워크스페이스의 프로젝트·작업·팀 현황
                  </p>
                </div>
              </div>

              <ProjectFilterBar />

              <KpiRow />

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 min-w-0 lg:col-span-8">
                  <ProjectTable />
                </div>
                <div className="col-span-12 min-w-0 lg:col-span-4">
                  <TeamWorkload />
                </div>

                <div className="col-span-12 min-w-0 lg:col-span-8">
                  <TimelineGantt />
                </div>
                <div className="col-span-12 min-w-0 lg:col-span-4">
                  <DueSoon />
                </div>

                <div className="col-span-12 min-w-0 lg:col-span-8">
                  <MyTasks />
                </div>
                <div className="col-span-12 min-w-0 lg:col-span-4">
                  <ActivityFeed />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </FilterProvider>
  );
}
