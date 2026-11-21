"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { HeroPanel } from "./HeroPanel";
import { RankedBarChart } from "./RankedBarChart";
import { PinnedZoneCard } from "./PinnedZoneCard";
import { TaskPanel, type TaskTab } from "./TaskPanel";
import { FOCUS } from "./ui";
import type { ZoneId, TrendWindow } from "./data";

export function DockwiseClient() {
  const [trendWindow, setTrendWindow] = useState<TrendWindow>("7d");
  const [hoveredZoneId, setHoveredZoneId] = useState<ZoneId | null>(null);
  const [pinnedZoneId, setPinnedZoneId] = useState<ZoneId | null>(null);
  const [activeTab, setActiveTab] = useState<TaskTab>("queue");
  const [paletteOpen, setPaletteOpen] = useState(false);

  function togglePin(id: ZoneId) {
    setPinnedZoneId((prev) => (prev === id ? null : id));
  }

  function scrollToId(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToTasks() {
    setActiveTab("queue");
    scrollToId("task-panel");
  }

  return (
    <div className="flex min-h-screen w-full min-w-0 bg-zinc-50 text-zinc-900">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-green-700 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white ${FOCUS}`}
      >
        Skip to content
      </a>

      <Sidebar />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 space-y-4 px-4 py-5 sm:px-6 sm:py-6">
          <h1 className="font-[family-name:var(--font-display-grotesk)] text-xl font-semibold text-zinc-900">Overview</h1>

          <HeroPanel trendWindow={trendWindow} onWindowChange={setTrendWindow} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div id="zone-ranking" className="min-w-0 lg:col-span-8">
              <RankedBarChart
                hoveredZoneId={hoveredZoneId}
                onHover={setHoveredZoneId}
                pinnedZoneId={pinnedZoneId}
                onTogglePin={togglePin}
              />
            </div>
            <div className="min-w-0 lg:col-span-4">
              <PinnedZoneCard zoneId={pinnedZoneId} onClear={() => setPinnedZoneId(null)} />
            </div>
          </div>

          <TaskPanel activeTab={activeTab} onTabChange={setActiveTab} />
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        setWindow={setTrendWindow}
        clearPin={() => setPinnedZoneId(null)}
        scrollToRanking={() => scrollToId("zone-ranking")}
        scrollToTasks={scrollToTasks}
      />
    </div>
  );
}
