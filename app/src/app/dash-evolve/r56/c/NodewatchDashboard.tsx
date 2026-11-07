"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, Table2, Construction } from "lucide-react";
import { getTopRiskId, getNode } from "./data";
import { Card, CardHeader, SegmentedControl } from "./ui";
import { Sidebar, type Section } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { KpiRow } from "./KpiRow";
import { GraphCanvas } from "./GraphCanvas";
import { DependencyTable } from "./DependencyTable";
import { DetailPanel } from "./DetailPanel";

type ViewMode = "graph" | "table";

const SECTION_META: Record<Section, { title: string; subtitle: string }> = {
  overview: {
    title: "Platform overview",
    subtitle: "A live snapshot of every service repick's platform depends on.",
  },
  map: {
    title: "Service dependency map",
    subtitle: "How repick's services call each other, and what breaks if one of them goes down.",
  },
  incidents: {
    title: "Incidents",
    subtitle: "Incident history lives in the dependency map's detail panel for now.",
  },
  deploys: {
    title: "Deploys",
    subtitle: "Release tracking for these services isn't wired up in this preview.",
  },
  settings: {
    title: "Settings",
    subtitle: "Workspace and alerting settings aren't wired up in this preview.",
  },
};

export function NodewatchDashboard() {
  const [activeSection, setActiveSection] = useState<Section>("map");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("graph");
  const [graphSelectedId, setGraphSelectedId] = useState<string | null>(null);
  const [focusRequestId, setFocusRequestId] = useState<string | null>(null);

  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());

  const registerNodeRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) nodeRefs.current.set(id, el);
    else nodeRefs.current.delete(id);
  }, []);

  // Jumps the graph to a service and gives it keyboard focus. Used by the command palette, the
  // "View top risk" action and the detail panel's dependency chips — every path that asks to
  // *reveal* a node in the map, as opposed to a plain click on a node that's already visible.
  const selectAndReveal = useCallback((id: string) => {
    setView("graph");
    setGraphSelectedId(id);
    setFocusRequestId(id);
  }, []);

  useEffect(() => {
    if (!focusRequestId) return;
    const el = nodeRefs.current.get(focusRequestId);
    if (el) {
      try {
        el.scrollIntoView({ block: "nearest", inline: "nearest" });
        el.focus({ preventScroll: true });
      } catch {
        // scrollIntoView / focus options can be unsupported in some test environments.
      }
    }
    setFocusRequestId(null);
  }, [focusRequestId]);

  // A wide spatial diagram doesn't fit a 390px phone. The graph stays available (as a horizontally
  // scrollable canvas) but the accessible table becomes the default view on narrow screens, where
  // it reads far better than a squeezed-down map ever could.
  useEffect(() => {
    try {
      if (window.matchMedia("(max-width: 639px)").matches) setView("table");
    } catch {
      // matchMedia can be unavailable in some embeds — graph stays the default there.
    }
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const topRiskId = useMemo(() => getTopRiskId(), []);
  const topRiskNode = topRiskId ? getNode(topRiskId) : undefined;

  const section = SECTION_META[activeSection];
  const showMap = activeSection === "map" || activeSection === "overview";

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar
        active={activeSection}
        onNavigate={setActiveSection}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onViewTopRisk={() => {
            if (topRiskId) selectAndReveal(topRiskId);
          }}
          topRiskLabel={topRiskNode ? topRiskNode.name : null}
        />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-5">
            <h1 className="font-[family-name:var(--font-display-wide)] text-2xl font-semibold text-zinc-900">
              {section.title}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">{section.subtitle}</p>
          </div>

          <div className="mb-6">
            <KpiRow />
          </div>

          {showMap ? (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div className="min-w-0 xl:col-span-9">
                <Card>
                  <CardHeader
                    title="Dependency graph"
                    subtitle="Select a service to trace its dependencies and blast radius."
                    action={
                      <SegmentedControl<ViewMode>
                        ariaLabel="Graph or table view"
                        value={view}
                        onChange={setView}
                        options={[
                          { value: "graph", label: "Graph", icon: LayoutGrid },
                          { value: "table", label: "Table", icon: Table2 },
                        ]}
                      />
                    }
                  />
                  {view === "graph" ? (
                    <GraphCanvas selectedId={graphSelectedId} onSelect={setGraphSelectedId} registerRef={registerNodeRef} />
                  ) : (
                    <DependencyTable />
                  )}
                </Card>
              </div>
              <div className="min-w-0 xl:col-span-3">
                <DetailPanel selectedId={graphSelectedId} onSelect={selectAndReveal} />
              </div>
            </div>
          ) : (
            <Card className="flex flex-col items-center gap-2 py-12 text-center">
              <Construction size={28} className="text-zinc-300" aria-hidden="true" />
              <p className="text-sm text-zinc-500">{section.subtitle}</p>
            </Card>
          )}
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelect={selectAndReveal} />
    </div>
  );
}
