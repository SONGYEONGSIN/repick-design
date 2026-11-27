"use client";

import { useCallback, useEffect, useState } from "react";
import { BreakdownTable } from "./BreakdownTable";
import { CommandPalette } from "./CommandPalette";
import { KpiRow } from "./KpiRow";
import { MekkoBoard } from "./MekkoBoard";
import { RegionSpotlight } from "./RegionSpotlight";
import { DesktopSidebar, MobileSidebarDrawer } from "./Sidebar";
import { Topbar } from "./Topbar";
import { REGIONS, TIERS, regionTotal, regionsByRank, type MekkoView } from "./data";
import { formatArrExact } from "./format";
import { FOCUS_RING, downloadCsv, cn } from "./ui";

export function Dashboard() {
  const [view, setView] = useState<MekkoView>("share");
  // Scoped to exactly one consumer — RegionSpotlight. The Mekko board and the fallback table
  // never read this value; they always render every region. Defaults to the largest region
  // (North America) so the spotlight card is never an empty placeholder at first paint.
  const [pinnedRegionId, setPinnedRegionId] = useState<string>(() => regionsByRank()[0].id);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleExport = useCallback(() => {
    const header = ["Region", ...TIERS.map((t) => t.label), "Total"];
    const rows = REGIONS.map((r) => [r.name, ...TIERS.map((t) => formatArrExact(r.tiers[t.id])), formatArrExact(regionTotal(r))]);
    downloadCsv("kelvin-revenue-mix-q4-2026.csv", header, rows);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <div className="contents" inert={paletteOpen}>
        <a
          href="#main-content"
          className={cn(
            "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border focus:border-white/10 focus:bg-zinc-900 focus:px-4 focus:py-2 focus:font-medium focus:text-sm focus:text-zinc-50",
            FOCUS_RING,
          )}
        >
          Skip to main content
        </a>

        <DesktopSidebar />
        <MobileSidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} onExport={handleExport} />

          <main
            id="main-content"
            tabIndex={-1}
            className="min-h-0 flex-1 overflow-y-auto px-4 py-6 focus:outline-2 focus:outline-offset-4 focus:outline-teal-400 sm:px-6 lg:px-8 lg:py-8"
          >
            <div className="mb-5">
              <p className="font-medium text-[11px] uppercase tracking-wide text-zinc-400">Finance &amp; RevOps</p>
              <h1 className="text-2xl font-semibold text-zinc-50" style={{ fontFamily: "var(--font-display-mono)" }}>
                Revenue Mix Board
              </h1>
              <p className="mt-1 max-w-2xl font-normal text-sm text-zinc-400">
                Annual recurring revenue across regions and plan tiers for Q4 2026 — read the mix at a glance, then pin a region or drill into the full
                table for exact figures.
              </p>
            </div>

            <div className="mb-6">
              <KpiRow />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="min-w-0 xl:col-span-8">
                <MekkoBoard view={view} onViewChange={setView} pinnedRegionId={pinnedRegionId} onPinRegion={setPinnedRegionId} />
              </div>
              <div className="min-w-0 xl:col-span-4">
                <RegionSpotlight pinnedRegionId={pinnedRegionId} onClearPin={() => setPinnedRegionId(regionsByRank()[0].id)} />
              </div>
            </div>

            <div className="mt-6">
              <BreakdownTable />
            </div>
          </main>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelectRegion={setPinnedRegionId} onSetView={setView} onExport={handleExport} />
    </div>
  );
}
