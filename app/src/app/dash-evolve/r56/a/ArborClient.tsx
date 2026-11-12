"use client";

import { useCallback, useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import DetailPanel from "./DetailPanel";
import FacilityTable from "./FacilityTable";
import type { PeriodMode } from "./data";
import Sidebar from "./Sidebar";
import SlopeChart from "./SlopeChart";
import TickerHeader from "./TickerHeader";
import Topbar from "./Topbar";
import { APP_BG, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";
import { Card } from "./ui";

export default function ArborClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mode, setMode] = useState<PeriodMode>("qoq");

  // Ephemeral, row-local disclosure in the slope chart. Clicking a facility row here only
  // toggles its own inline breakdown — it never touches pinnedFacilityId below.
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  // Independently-scoped pin, set only by the facility table or the command palette.
  const [pinnedFacilityId, setPinnedFacilityId] = useState<string | null>(null);

  const toggleExpandedRow = useCallback((id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  }, []);

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

  return (
    <div className={cx("min-h-screen", APP_BG, TEXT_PRIMARY)}>
      <div className="flex min-h-screen">
        <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />
          <TickerHeader mode={mode} />

          <main id="main-content" className="min-w-0 flex-1 p-4 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h1 className={cx("text-lg font-semibold tracking-tight", TEXT_PRIMARY)}>Facility ESG scorecard</h1>
              <p className={cx("mt-1 text-sm font-normal", TEXT_AUX)}>Q4 2026 reporting cycle · 12 facilities across repick&apos;s resale and refurbishment network.</p>
            </div>

            <div className="grid grid-cols-12 gap-4 sm:gap-5">
              <div className="col-span-12 min-w-0 xl:col-span-8">
                <Card>
                  <SlopeChart mode={mode} onModeChange={setMode} expandedId={expandedRowId} onToggleExpanded={toggleExpandedRow} />
                </Card>
              </div>

              <div className="col-span-12 min-w-0 xl:col-span-4">
                <DetailPanel facilityId={pinnedFacilityId} onClear={() => setPinnedFacilityId(null)} />
              </div>

              <div className="col-span-12 min-w-0">
                <Card>
                  <FacilityTable mode={mode} pinnedId={pinnedFacilityId} onPin={(id) => setPinnedFacilityId((prev) => (prev === id ? null : id))} />
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>

      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onSelectFacility={(id) => {
            setPinnedFacilityId(id);
          }}
        />
      ) : null}
    </div>
  );
}
