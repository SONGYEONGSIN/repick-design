"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Waypoints, X } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CommandPalette from "./CommandPalette";
import GraphCanvas from "./GraphCanvas";
import Legend from "./Legend";
import AdjacencyTable from "./AdjacencyTable";
import SummaryStrip from "./SummaryStrip";
import NodeTable from "./NodeTable";
import { EDGE_BY_ID, NODE_BY_ID, STATUS_META, formatRps, nodesToCsv, NODES, FOCUS_RING, type GroupBy } from "./data";
import { Card, SectionLabel } from "./ui";

export default function DashboardApp() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupBy>("tier");
  const [pinnedNodeId, setPinnedNodeId] = useState<string | null>("fraud-service");
  const [pinnedEdgeId, setPinnedEdgeId] = useState<string | null>(null);

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const handlePinNode = useCallback((id: string) => {
    setPinnedNodeId((current) => (current === id ? null : id));
  }, []);

  const handlePinEdge = useCallback((id: string) => {
    setPinnedEdgeId((current) => (current === id ? null : id));
  }, []);

  const handleExport = useCallback(() => {
    const csv = nodesToCsv(NODES);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "meshline-topology.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const pinnedEdge = pinnedEdgeId ? EDGE_BY_ID.get(pinnedEdgeId) ?? null : null;

  return (
    <div className="flex min-h-dvh bg-zinc-50">
      <a
        href="#main-content"
        className={`sr-only font-medium focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-rose-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          onExport={handleExport}
        />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-rose-600">
                  <Waypoints className="h-5 w-5" aria-hidden="true" />
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">Observability</span>
                </div>
                <h1 className="mt-1 font-[family-name:var(--font-display-wide)] text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                  Service topology
                </h1>
                <p className="mt-1 max-w-2xl text-sm font-normal text-zinc-600">
                  Every production service and the calls between them for Northgate Commerce. Error rate and
                  throughput are always printed on the node — no click required to read them.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div
                  role="group"
                  aria-label="Group graph by"
                  className="flex h-11 items-center rounded-lg border border-zinc-200 bg-white p-1"
                >
                  {(["tier", "domain"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      aria-pressed={groupBy === g}
                      onClick={() => setGroupBy(g)}
                      className={`flex h-full items-center rounded-md px-3.5 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                        groupBy === g ? "bg-rose-600 text-white" : "text-zinc-600 hover:bg-zinc-100"
                      }`}
                    >
                      {g === "tier" ? "By tier" : "By domain"}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleExport}
                  className={`flex h-11 items-center gap-1.5 whitespace-nowrap rounded-lg bg-rose-600 px-4 text-sm font-medium text-white transition-colors hover:bg-rose-500 motion-reduce:transition-none ${FOCUS_RING}`}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Export CSV
                </button>
              </div>
            </div>

            <SummaryStrip pinnedNodeId={pinnedNodeId} onClearPin={() => setPinnedNodeId(null)} />

            <Card padded={false} className="overflow-hidden">
              <div className="flex flex-col gap-4 border-b border-zinc-200 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
                <div className="min-w-0">
                  <SectionLabel>Topology</SectionLabel>
                  <h2 className="mt-0.5 text-sm font-semibold text-zinc-900">Dependency graph</h2>
                  <p className="mt-1 max-w-xl text-xs font-normal text-zinc-600">
                    Grouped by {groupBy === "tier" ? "architecture tier" : "team domain"}. Tab through services and
                    connections, or hover for detail; click a service to focus it above, or a connection to trace it
                    here.
                  </p>
                  <div className="mt-3">
                    <Legend />
                  </div>
                </div>

                {/* Persistent-pin axis #2: a different widget cluster from the summary strip's
                    Focused-service card, driven only by pinning an edge — never by the node pin. */}
                <div className="w-full shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 sm:w-72">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-600">Traced dependency</p>
                  {pinnedEdge ? (
                    <div className="mt-1.5 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold tabular-nums text-zinc-900">
                          {NODE_BY_ID.get(pinnedEdge.from)!.fullName} &rarr; {NODE_BY_ID.get(pinnedEdge.to)!.fullName}
                        </p>
                        <p className={`mt-0.5 text-xs font-medium ${STATUS_META[pinnedEdge.status].text}`}>
                          {STATUS_META[pinnedEdge.status].label} &middot; ~{formatRps(pinnedEdge.weightRps)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPinnedEdgeId(null)}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 ${FOCUS_RING}`}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">Clear traced dependency</span>
                      </button>
                    </div>
                  ) : (
                    <p className="mt-1.5 text-sm font-normal text-zinc-600">Click any connection to trace it here</p>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <GraphCanvas
                  groupBy={groupBy}
                  pinnedNodeId={pinnedNodeId}
                  pinnedEdgeId={pinnedEdgeId}
                  onPinNode={handlePinNode}
                  onPinEdge={handlePinEdge}
                />
              </div>

              <AdjacencyTable />
            </Card>

            <Card>
              <SectionLabel>Directory</SectionLabel>
              <h2 className="mt-0.5 mb-4 text-sm font-semibold text-zinc-900">All services</h2>
              <NodeTable pinnedNodeId={pinnedNodeId} onPinNode={handlePinNode} />
            </Card>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelect={handlePinNode} />
    </div>
  );
}
