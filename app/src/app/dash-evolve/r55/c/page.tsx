"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  FACILITIES,
  METRICS,
  DEFAULT_PINNED_ID,
  PRIOR_LABEL,
  CURRENT_LABEL,
  WORKSPACES,
  type MetricId,
  type SortMode,
} from "./lib/data";
import { Sidebar, SidebarContent, type NavId } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { StatTicker } from "./components/StatTicker";
import { FilterBar } from "./components/FilterBar";
import { SlopeChart } from "./components/SlopeChart";
import { FacilityDrawer } from "./components/FacilityDrawer";
import { CommandPalette, type PaletteCommand } from "./components/CommandPalette";
import { Card, CardHeader, SegmentedControl, FOCUS_RING } from "./components/ui";

export default function Page() {
  // The metric toggle — the "view" control that decides which score drives the slope chart and
  // (partially) the stat ticker above it.
  const [metricId, setMetricId] = useState<MetricId>("emissions");

  // Real sort + filter state for the chart, independent of the metric toggle.
  const [sortMode, setSortMode] = useState<SortMode>("improvement");
  const [declineOnly, setDeclineOnly] = useState(false);

  // Selection surface #1: a persistent "pin" that drives exactly one widget — the detail drawer.
  // Pre-populated with the biggest quarter-over-quarter decliner so the drawer is never empty
  // whenever it is shown.
  const [pinnedId, setPinnedId] = useState(DEFAULT_PINNED_ID);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavId>("overview");
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);

  const pinnedFacility = useMemo(
    () => FACILITIES.find((f) => f.id === pinnedId) ?? FACILITIES[0],
    [pinnedId],
  );

  function handlePin(id: string) {
    setPinnedId(id);
    setDrawerOpen(true);
  }

  // ⌘K / Ctrl+K opens the command palette globally; Escape closes the drawer when it's open and
  // the palette isn't already handling its own Escape.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "Escape" && !paletteOpen) {
        if (drawerOpen) setDrawerOpen(false);
        if (mobileNavOpen) setMobileNavOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen, mobileNavOpen, paletteOpen]);

  const activeMetric = METRICS.find((m) => m.id === metricId)!;

  const commands: PaletteCommand[] = useMemo(() => {
    const metricCommands: PaletteCommand[] = METRICS.map((m) => ({
      id: `metric-${m.id}`,
      label: `Switch to ${m.shortLabel} view`,
      hint: "Metric",
      run: () => setMetricId(m.id),
    }));
    const sortCommands: PaletteCommand[] = [
      { id: "sort-improvement", label: "Sort by biggest improvement", hint: "Sort", run: () => setSortMode("improvement") },
      { id: "sort-decline", label: "Sort by biggest decline", hint: "Sort", run: () => setSortMode("decline") },
      { id: "sort-name", label: "Sort alphabetically", hint: "Sort", run: () => setSortMode("name") },
    ];
    const filterCommand: PaletteCommand = {
      id: "toggle-decline-only",
      label: declineOnly ? "Show all facilities" : "Show declining facilities only",
      hint: "Filter",
      run: () => setDeclineOnly((v) => !v),
    };
    const pinCommands: PaletteCommand[] = FACILITIES.map((f) => ({
      id: `pin-${f.id}`,
      label: `Pin ${f.name}`,
      hint: f.regionCode,
      run: () => handlePin(f.id),
    }));
    return [...metricCommands, ...sortCommands, filterCommand, ...pinCommands];
  }, [declineOnly]);

  const sidebarProps = {
    activeNav,
    onNavigate: (id: NavId) => {
      setActiveNav(id);
      setMobileNavOpen(false);
    },
    workspace,
    workspaceOpen,
    onToggleWorkspace: () => setWorkspaceOpen((v) => !v),
    onSelectWorkspace: (w: string) => {
      setWorkspace(w);
      setWorkspaceOpen(false);
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white text-zinc-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-lime-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <Sidebar {...sidebarProps} />

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close navigation menu"
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 bg-zinc-900/40"
          />
          <div className="relative z-10 flex h-full w-72 max-w-[85vw] border-r border-zinc-200 bg-white">
            <SidebarContent {...sidebarProps} />
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation menu"
              className={`absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenDrawer={() => setMobileNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 overflow-y-auto">
          <StatTicker activeMetric={metricId} />

          <div className="grid min-w-0 grid-cols-12 gap-4 px-4 py-5 sm:px-6 sm:py-6">
            <div className="col-span-12 min-w-0 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
                  ESG Facility Scorecard
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  {workspace} · {CURRENT_LABEL} vs. {PRIOR_LABEL}
                </p>
              </div>
            </div>

            <div className="col-span-12 min-w-0">
              <Card className="min-w-0">
                <CardHeader
                  title="Quarter-over-quarter scorecard"
                  subtitle={activeMetric.description}
                  action={
                    <SegmentedControl
                      ariaLabel="Active metric"
                      value={metricId}
                      onChange={setMetricId}
                      options={METRICS.map((m) => ({ value: m.id, label: m.shortLabel }))}
                    />
                  }
                />
                <FilterBar
                  sortMode={sortMode}
                  onSortChange={setSortMode}
                  declineOnly={declineOnly}
                  onDeclineOnlyChange={setDeclineOnly}
                />
                <SlopeChart
                  metricId={metricId}
                  sortMode={sortMode}
                  declineOnly={declineOnly}
                  pinnedId={pinnedId}
                  onPin={handlePin}
                />
              </Card>
            </div>
          </div>
        </main>
      </div>

      <FacilityDrawer facility={pinnedFacility} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} commands={commands} /> : null}
    </div>
  );
}
