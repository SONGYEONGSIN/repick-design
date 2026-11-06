"use client";

import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CommandPalette from "./command-palette";
import ComparisonTable from "./comparison-table";
import { AXES, VENDORS, DEFAULT_VENDOR_ID, type VendorId } from "./data";
import { type ViewMode } from "./format";
import LegendPanel from "./legend-panel";
import RadarChart from "./radar-chart";
import ScorecardDrawer from "./scorecard-drawer";
import Sidebar from "./sidebar";
import StatStrip from "./stat-strip";
import TopBar from "./topbar";

export default function CalibreScorecardConsole() {
  const [pinnedId, setPinnedId] = useState<VendorId>(DEFAULT_VENDOR_ID);
  const [hoveredVendorId, setHoveredVendorId] = useState<VendorId | null>(null);
  const [hoveredAxisIndex, setHoveredAxisIndex] = useState<number | null>(null);
  const [view, setView] = useState<ViewMode>("raw");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scorecardOpen, setScorecardOpen] = useState(false);

  const pinnedVendor = useMemo(
    () => VENDORS.find((v) => v.id === pinnedId) ?? VENDORS[0]!,
    [pinnedId],
  );
  const hoveredVendorForStrip = useMemo(
    () =>
      hoveredVendorId && hoveredVendorId !== pinnedId
        ? VENDORS.find((v) => v.id === hoveredVendorId) ?? null
        : null,
    [hoveredVendorId, pinnedId],
  );

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
    <div className="flex min-h-screen bg-white">
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-zinc-900/30"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl">
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                <X className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-5">
            <h1 className="text-2xl font-semibold text-zinc-900 [font-family:var(--font-display-wide)]">
              Supplier Scorecards
            </h1>
            <p className="mt-1 text-sm font-normal text-zinc-500">
              Hardware Sourcing · Precision Fasteners
            </p>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-normal text-zinc-600">
            <span>{VENDORS.length} suppliers shortlisted</span>
            <span>{AXES.length} evaluation axes</span>
            <span>Sourcing window: Q4 FY26</span>
            <span>
              Pinned supplier: <span className="font-medium text-zinc-800">{pinnedVendor.shortName}</span>
            </span>
          </div>

          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            <section
              aria-labelledby="chart-heading"
              className="col-span-12 min-w-0 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="chart-heading" className="text-base font-semibold text-zinc-900">
                  Multi-Axis Supplier Comparison
                </h2>
                <div role="group" aria-label="Score view" className="flex rounded-lg bg-zinc-100 p-1">
                  <button
                    type="button"
                    aria-pressed={view === "raw"}
                    onClick={() => setView("raw")}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${
                      view === "raw" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    Raw Score
                  </button>
                  <button
                    type="button"
                    aria-pressed={view === "percentile"}
                    onClick={() => setView("percentile")}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${
                      view === "percentile"
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    Percentile Rank
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <RadarChart
                  vendors={VENDORS}
                  axes={AXES}
                  view={view}
                  pinnedId={pinnedId}
                  hoveredId={hoveredVendorId}
                  onHoverVendor={setHoveredVendorId}
                  hoveredAxisIndex={hoveredAxisIndex}
                  onHoverAxis={setHoveredAxisIndex}
                />
              </div>

              <div className="mt-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-zinc-900">
                    Pinned readout — {pinnedVendor.shortName}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setScorecardOpen(true)}
                    className="rounded text-sm font-medium text-rose-700 motion-safe:transition-colors hover:text-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                  >
                    View full scorecard
                  </button>
                </div>
                <StatStrip
                  axes={AXES}
                  pinnedVendor={pinnedVendor}
                  hoveredVendor={hoveredVendorForStrip}
                  view={view}
                />
              </div>
            </section>

            <section
              aria-labelledby="legend-heading"
              className="col-span-12 min-w-0 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-5"
            >
              <h2 id="legend-heading" className="mb-3 text-base font-semibold text-zinc-900">
                Legend &amp; Weighting
              </h2>
              <LegendPanel
                vendors={VENDORS}
                axes={AXES}
                pinnedId={pinnedId}
                hoveredId={hoveredVendorId}
                view={view}
                onPin={setPinnedId}
                onHover={setHoveredVendorId}
              />
            </section>

            <section
              aria-labelledby="table-heading"
              className="col-span-12 min-w-0 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <h2 id="table-heading" className="text-base font-semibold text-zinc-900">
                Scorecard Detail
              </h2>
              <p className="mt-1 text-sm font-normal text-zinc-500">
                Accessible data view — the same scores as the radar above, sortable by any column.
              </p>
              <div className="mt-4">
                <ComparisonTable vendors={VENDORS} axes={AXES} view={view} pinnedId={pinnedId} onPin={setPinnedId} />
              </div>
            </section>
          </div>
        </main>
      </div>

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        vendors={VENDORS}
        onPin={setPinnedId}
        view={view}
        onSetView={setView}
        onOpenDrawer={() => setScorecardOpen(true)}
      />

      <ScorecardDrawer
        vendor={scorecardOpen ? pinnedVendor : null}
        axes={AXES}
        view={view}
        onClose={() => setScorecardOpen(false)}
      />
    </div>
  );
}
