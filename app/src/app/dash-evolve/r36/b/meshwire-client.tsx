"use client";

import { useCallback, useState } from "react";
import AdjacencyTable from "./adjacency-table";
import CommandPalette from "./command-palette";
import { EDGES, NODES } from "./data";
import GraphCanvas from "./graph-canvas";
import IncidentTimeline from "./incident-timeline";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { APP_BG, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHead } from "./ui";

export default function MeshwireClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [focusRequest, setFocusRequest] = useState<{ id: string; token: number } | null>(null);

  const handleSelectFromPalette = useCallback((id: string) => {
    setPaletteOpen(false);
    setFocusRequest((prev) => ({ id, token: (prev?.token ?? 0) + 1 }));
  }, []);
  const clearFocusRequest = useCallback(() => setFocusRequest(null), []);

  const unhealthyNodeCount = NODES.filter((n) => n.status !== "healthy").length;

  return (
    <div className={cx("flex min-h-screen", APP_BG)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-12 gap-4 lg:gap-6">
              <div className="col-span-12 min-w-0">
                <h1 className={cx("text-xl font-semibold tracking-tight", TEXT_PRIMARY)} style={{ fontFamily: "var(--font-display-mono)" }}>
                  Service Topology
                </h1>
                <p className={cx("mt-1 text-xs font-normal", TEXT_AUX)}>
                  {NODES.length} services, {EDGES.length} dependencies, {unhealthyNodeCount} degraded or down right now.
                </p>
              </div>

              <div className="col-span-12 min-w-0">
                <Card>
                  <CardHead title="Dependency graph" hint="Fixed concentric-ring layout — no physics simulation. Click a service for details; the layout never reflows on click." />
                  <div className="mt-4">
                    <GraphCanvas focusRequest={focusRequest} onFocusHandled={clearFocusRequest} />
                  </div>
                </Card>
              </div>

              <div className="col-span-12 min-w-0">
                <Card>
                  <CardHead title="Adjacency list" hint="The required accessible fallback for the graph above — every node and every edge, as a real sortable table." />
                  <div className="mt-4">
                    <AdjacencyTable />
                  </div>
                </Card>
              </div>

              <div className="col-span-12 min-w-0">
                <Card>
                  <CardHead title="Incident timeline" hint="Independent of the graph above — selecting a service never filters or reorders this feed." />
                  <div className="mt-2">
                    <IncidentTimeline />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectNode={handleSelectFromPalette} /> : null}
    </div>
  );
}
