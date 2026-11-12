"use client";

import { useEffect, useRef, useState } from "react";
import { KPIS, getKpi } from "./data";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MetricRail } from "./metric-rail";
import { DetailPane } from "./detail-pane";
import { CommandPalette } from "./command-palette";

/**
 * Page-level state is intentionally small and single-purpose:
 * - `selectedKpiId` is the ONE thing the rail controls. Changing it swaps
 *   which KPI's frame data the detail pane receives — a partial recompute
 *   (a lookup, not a page rebuild) performed once, inside `DetailPane`.
 * - `mobileNavOpen` / `paletteOpen` are unrelated app-shell concerns.
 *
 * Nothing here knows about the decomposition tree's expand/collapse state
 * or the leaf table's sort/filter state — those live inside `DetailPane`
 * and its children, untouched by rail or palette selection beyond the
 * initial swap of which KPI is being viewed.
 */
export function VarianceDashboard() {
  const [selectedKpiId, setSelectedKpiId] = useState(KPIS[0].id);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const kpi = getKpi(selectedKpiId);

  return (
    <div className="flex h-dvh min-h-dvh overflow-hidden bg-white">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          searchTriggerRef={searchTriggerRef}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-zinc-900">Variance Explorer</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Pick a KPI on the left, then drill through its decomposition tree to see exactly which
              branch is driving the number.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-3">
              <MetricRail kpis={KPIS} selectedId={selectedKpiId} onSelect={setSelectedKpiId} />
            </div>
            <div className="min-w-0 lg:col-span-9">
              <DetailPane kpi={kpi} />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        kpis={KPIS}
        onSelect={setSelectedKpiId}
        returnFocusRef={searchTriggerRef}
      />
    </div>
  );
}
