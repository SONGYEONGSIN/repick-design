"use client";

import { useEffect, useState } from "react";
import { NODES, EDGES, TOTAL_CALLS_PER_MIN, MEDIAN_P99_MS, AT_RISK_COUNT, intFormat, compactFormat } from "./data";
import { Card, SegmentedControl } from "./ui";
import { DesktopSidebar, MobileDrawer } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { ServiceGraph } from "./ServiceGraph";
import { GraphLegend, InspectorPanel } from "./SideRail";
import { AdjacencyTable } from "./AdjacencyTable";

type Encoding = "latency" | "error";

const KPI_ITEMS: { label: string; value: string; emphasis?: boolean }[] = [
  { label: "Services monitored", value: intFormat.format(NODES.length) },
  { label: "Active edges", value: intFormat.format(EDGES.length) },
  { label: "Total traffic", value: `${compactFormat.format(TOTAL_CALLS_PER_MIN)}/min` },
  { label: "Median p99", value: `${MEDIAN_P99_MS}ms` },
  { label: "Services at risk", value: intFormat.format(AT_RISK_COUNT), emphasis: AT_RISK_COUNT > 0 },
];

export function NodelineClient() {
  const [encoding, setEncoding] = useState<Encoding>("latency");
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // ---------------------------------------------------------------------------------------------
  // Selection blast radius, drawn explicitly: `pinnedId`/`hoverId` (folded into `activeId` below)
  // are read by exactly two things — ServiceGraph's own highlight pass and InspectorPanel. Neither
  // KPI_ITEMS above nor AdjacencyTable ever receive this state; both are computed once from the
  // static NODES/EDGES module data and stay untouched while a viewer clicks around the graph. A
  // click pins a node (persists after the pointer leaves); hover/focus alone only previews.
  // ---------------------------------------------------------------------------------------------
  const activeId = pinnedId ?? hoverId;

  function togglePinFromGraph(id: string) {
    setPinnedId((prev) => (prev === id ? null : id));
  }
  function selectNode(id: string) {
    setPinnedId(id);
  }

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

  return (
    <div className="flex h-screen flex-col bg-zinc-50 text-zinc-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-teal-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus:ring-2 focus:ring-teal-900 focus:ring-offset-2"
      >
        Skip to content
      </a>

      <div className="flex min-h-0 flex-1">
        <DesktopSidebar />
        <MobileDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenMenu={() => setMobileMenuOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />

          <main id="main-content" tabIndex={-1} className="min-h-0 flex-1 overflow-y-auto p-4 outline-none sm:p-6 lg:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Service Dependency Graph</h1>
                <p className="mt-1 text-sm text-zinc-500">Call topology across the checkout platform · last 15 minutes</p>
              </div>
            </div>

            <Card className="mt-4">
              <div className="grid grid-cols-2 divide-x divide-y divide-zinc-100 sm:grid-cols-5 sm:divide-y-0">
                {KPI_ITEMS.map((item) => (
                  <div key={item.label} className="min-w-0 px-5 py-3.5">
                    <p className="truncate text-[11px] font-medium uppercase tracking-wide text-zinc-500">{item.label}</p>
                    <p
                      className={`mt-1 text-lg font-semibold ${item.emphasis ? "text-rose-700" : "text-zinc-900"}`}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <div className="mt-4 grid grid-cols-12 gap-4 lg:gap-6">
              <Card className="col-span-12 p-4 sm:p-5 lg:col-span-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-zinc-900">Live call topology</h2>
                  <SegmentedControl
                    ariaLabel="Graph color encoding"
                    value={encoding}
                    onChange={setEncoding}
                    options={[
                      { value: "latency", label: "Latency" },
                      { value: "error", label: "Error rate" },
                    ]}
                  />
                </div>
                <div className="mt-4">
                  <ServiceGraph encoding={encoding} pinnedId={pinnedId} activeId={activeId} onHover={setHoverId} onPin={togglePinFromGraph} />
                </div>
              </Card>

              <div className="col-span-12 flex flex-col gap-4 lg:col-span-4">
                <GraphLegend encoding={encoding} />
                <InspectorPanel activeId={activeId} pinnedId={pinnedId} onClear={() => setPinnedId(null)} />
              </div>
            </div>

            <Card className="mt-4 mb-2 sm:mt-6">
              <div className="border-b border-zinc-200 px-4 py-3.5 sm:px-5">
                <h2 className="text-sm font-semibold text-zinc-900">Adjacency list</h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Every call edge as Source → Target → Value — the required accessible fallback for the graph above.
                </p>
              </div>
              <AdjacencyTable onSelectNode={selectNode} />
            </Card>
          </main>
        </div>
      </div>

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} onSelect={selectNode} />}
    </div>
  );
}
