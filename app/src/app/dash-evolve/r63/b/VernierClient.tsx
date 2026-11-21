"use client";

import { useEffect, useRef, useState } from "react";
import { MobileSidebar, Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { Hero } from "./Hero";
import { StatTiles } from "./StatTiles";
import { FlagTable } from "./FlagTable";
import { FlagDetailPanel } from "./FlagDetailPanel";
import type { FlagStatus } from "./data";

export function VernierClient() {
  // Row-selection axis — scoped only to FlagDetailPanel. The hero and stat tiles above deliberately
  // do not read this state; see the comment in Hero.tsx. The waffle tile's own hover/pin inspector
  // (in StatTiles.tsx) is a second, fully separate axis that reads and writes none of this either.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FlagStatus | "all">("all");

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const paletteTriggerRef = useRef<HTMLButtonElement>(null);

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

  function selectFlag(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  function jumpToTable() {
    document.getElementById("flag-table")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex min-h-screen bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900 focus:shadow-xl focus:outline-2 focus:outline-offset-2 focus:outline-lime-700"
      >
        Skip to main content
      </a>
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} paletteTriggerRef={paletteTriggerRef} />
        <main id="main-content" className="min-h-0 min-w-0 flex-1">
          <div className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-2">
              <h1 className="text-xl font-semibold text-zinc-900">Flags</h1>
              <p className="text-sm text-zinc-500">Northwind Retail · production</p>
            </div>

            <div className="mt-4 grid grid-cols-12 items-start gap-4">
              <div className="col-span-12 min-w-0 lg:col-span-4">
                <Hero />
              </div>
              <div className="col-span-12 min-w-0 lg:col-span-8">
                <StatTiles />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-12 items-start gap-4">
              <div className="col-span-12 min-w-0 lg:col-span-8">
                <FlagTable statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} selectedId={selectedId} onSelect={selectFlag} />
              </div>
              <div className="col-span-12 min-w-0 lg:col-span-4 lg:self-stretch">
                <FlagDetailPanel selectedId={selectedId} />
              </div>
            </div>
          </div>
        </main>
      </div>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelectFlag={selectFlag}
        onSetStatusFilter={setStatusFilter}
        onJumpToTable={jumpToTable}
        triggerRef={paletteTriggerRef}
      />
    </div>
  );
}
