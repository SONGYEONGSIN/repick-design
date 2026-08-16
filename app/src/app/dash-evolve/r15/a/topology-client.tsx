"use client";

import { AlertOctagon, AlertTriangle, Gauge, ListChecks, ShieldCheck, Table2, Waypoints, X } from "lucide-react";
import { useEffect, useState } from "react";
import CommandPalette from "./command-palette";
import {
  ACTIVE_INCIDENT_NODES,
  AVG_CRITICAL_EDGE_LATENCY_MS,
  CRITICAL_EDGE_COUNT,
  HEALTHY_COUNT,
  NODES,
  NODE_MAP,
  PLATFORM_P99_MS,
  TIER_ORDER,
  WORKSPACES,
  type NodeId,
} from "./data";
import DetailPanel from "./detail-panel";
import { formatMs } from "./format";
import LiveMeshChart from "./live-mesh-chart";
import Sidebar from "./sidebar";
import { BORDER, DISPLAY_FONT, FOCUS_RING, HEALTH_ORDER, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import Topbar from "./topbar";
import TopologyGraph from "./topology-graph";
import TopologyTable from "./topology-table";
import { Card, CardHeader, HealthBadge, SegmentedControl, StatItem } from "./ui";

type View = "graph" | "table";

export default function TopologyClient() {
  const [view, setView] = useState<View>("graph");
  const [selectedId, setSelectedId] = useState<NodeId | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSelect(id: NodeId) {
    setSelectedId(id);
    setPaletteOpen(false);
  }

  const selectedNode = selectedId ? NODE_MAP[selectedId] : null;

  return (
    <div className="flex h-dvh min-h-dvh overflow-hidden bg-zinc-950 text-zinc-50">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="flex w-full flex-col gap-5 p-4 sm:p-6 lg:p-8">
            <header className="flex flex-col gap-5">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="min-w-0">
                  <h1 style={DISPLAY_FONT} className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Service topology
                  </h1>
                  <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>
                    {WORKSPACES[0].name} &middot; {NODES.length} services across {TIER_ORDER.length} tiers
                  </p>
                </div>
                <LiveMeshChart />
              </div>

              <dl className="flex flex-wrap gap-x-8 gap-y-3">
                <StatItem Icon={ListChecks} label="Services monitored" value={NODES.length} />
                <StatItem Icon={ShieldCheck} label="Healthy" value={`${HEALTHY_COUNT} of ${NODES.length}`} />
                <StatItem
                  Icon={AlertTriangle}
                  label="Active incidents"
                  value={ACTIVE_INCIDENT_NODES.length}
                  valueClassName={ACTIVE_INCIDENT_NODES.length > 0 ? "text-amber-400" : undefined}
                />
                <StatItem
                  Icon={AlertOctagon}
                  label="Critical dependencies"
                  value={CRITICAL_EDGE_COUNT}
                  valueClassName={CRITICAL_EDGE_COUNT > 0 ? "text-rose-400" : undefined}
                />
                <StatItem Icon={Gauge} label="Platform P99" value={formatMs(PLATFORM_P99_MS)} />
              </dl>

              {ACTIVE_INCIDENT_NODES.length > 0 ? <IncidentBanner /> : null}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <SegmentedControl
                  ariaLabel="Select topology view"
                  value={view}
                  onChange={setView}
                  options={[
                    { id: "graph", label: "Topology", Icon: Waypoints },
                    { id: "table", label: "Table", Icon: Table2 },
                  ]}
                />

                {selectedNode ? (
                  <div className={cx("flex h-9 items-center gap-2 rounded-full border py-0.5 pl-3 pr-1.5", BORDER, "bg-zinc-900/60")}>
                    <span className={cx("text-xs", TEXT_CAPTION)}>Focused:</span>
                    <span className={cx("text-xs font-semibold", TEXT_PRIMARY)}>{selectedNode.label}</span>
                    <HealthBadge health={selectedNode.health} />
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      aria-label={`Clear focus on ${selectedNode.label}`}
                      className={cx("grid h-6 w-6 place-items-center rounded-full", "hover:bg-white/10", TRANSITION, FOCUS_RING)}
                    >
                      <X size={12} aria-hidden="true" className={TEXT_CAPTION} />
                    </button>
                  </div>
                ) : null}
              </div>
            </header>

            <Card padded={false} className="p-4 sm:p-5">
              <CardHeader
                as="h2"
                title={view === "graph" ? "Dependency graph" : "Adjacency list"}
                description={
                  view === "graph"
                    ? "Layered by tier — edge, core, support, data. Select a service to trace its calls."
                    : "The full accessible fallback for the graph — every relationship, sortable and filterable."
                }
                action={view === "graph" ? <Legend /> : null}
              />

              <div className="mt-4">
                {view === "graph" ? <TopologyGraph selectedId={selectedId} onSelect={handleSelect} /> : <TopologyTable selectedId={selectedId} onSelect={handleSelect} />}
              </div>

              {view === "graph" ? (
                <p className={cx("mt-4 border-t pt-3 text-xs", BORDER, TEXT_CAPTION)}>
                  Screen-reader users: the graph above is a supplementary view. Switch to{" "}
                  <button type="button" onClick={() => setView("table")} className={cx("font-medium underline underline-offset-2", TEXT_PRIMARY, FOCUS_RING, "rounded")}>
                    Table view
                  </button>{" "}
                  for the complete data as a sortable list.
                </p>
              ) : null}
            </Card>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectNode={handleSelect} /> : null}
      <DetailPanel nodeId={selectedId} onClose={() => setSelectedId(null)} onSelect={handleSelect} />
    </div>
  );
}

function Legend() {
  return (
    <ul className="flex flex-wrap items-center gap-3" aria-label="Health legend">
      {HEALTH_ORDER.slice()
        .reverse()
        .map((h) => (
          <li key={h}>
            <HealthBadge health={h} />
          </li>
        ))}
    </ul>
  );
}

function IncidentBanner() {
  const critical = ACTIVE_INCIDENT_NODES.find((n) => n.health === "critical");
  if (!critical) return null;
  const affected = ACTIVE_INCIDENT_NODES.length;
  return (
    <div role="alert" className={cx("flex items-start gap-3 rounded-2xl border p-4", "border-rose-500/25 bg-rose-500/[0.07]")}>
      <AlertOctagon size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-rose-400" />
      <div className="min-w-0">
        <p className={cx("text-sm font-semibold", TEXT_PRIMARY)}>
          {critical.label} is critical — {CRITICAL_EDGE_COUNT} dependency edges are degraded, averaging {formatMs(AVG_CRITICAL_EDGE_LATENCY_MS)}
        </p>
        <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>{affected} services currently show a non-healthy status. Open a node in the graph or table for its full incident detail.</p>
      </div>
    </div>
  );
}
