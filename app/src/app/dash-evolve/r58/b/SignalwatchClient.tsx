"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { KpiRow } from "./KpiRow";
import { SeverityFilterRail } from "./SeverityFilterRail";
import { IncidentStream } from "./IncidentStream";
import { InspectorPanel } from "./InspectorPanel";
import { INCIDENTS, SEVERITIES, type Incident, type Severity } from "./data";

type SortMode = "newest" | "severity";

export function SignalwatchClient() {
  const [activeSeverities, setActiveSeverities] = useState<Set<Severity>>(new Set(SEVERITIES));
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);

  function toggleSeverity(s: Severity) {
    setActiveSeverities((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  function filterToService(service: string) {
    setServiceFilter(service);
  }

  const visibleIncidents = INCIDENTS.filter(
    (i) => activeSeverities.has(i.severity) && (serviceFilter === null || i.service === serviceFilter),
  );

  const pinned: Incident | null = pinnedId ? INCIDENTS.find((i) => i.id === pinnedId) ?? null : null;

  function scrollToId(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex min-h-screen w-full min-w-0 bg-zinc-50 text-zinc-900">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} />

        <main className="min-w-0 flex-1 space-y-4 px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-[family-name:var(--font-display-grotesk)] text-xl font-semibold text-zinc-900">
              Incidents
            </h1>
            {serviceFilter && (
              <button
                type="button"
                onClick={() => setServiceFilter(null)}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600"
              >
                Service: {serviceFilter} · clear
              </button>
            )}
          </div>

          <KpiRow pinned={pinned} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-3">
              <SeverityFilterRail active={activeSeverities} onToggle={toggleSeverity} />
            </div>

            <div className="min-w-0 lg:col-span-6">
              <IncidentStream
                incidents={visibleIncidents}
                sortMode={sortMode}
                onSortChange={setSortMode}
                selectedId={pinnedId}
                onSelect={(incident) => setPinnedId((prev) => (prev === incident.id ? null : incident.id))}
                totalCount={INCIDENTS.length}
              />
            </div>

            <div className="min-w-0 lg:col-span-3">
              <InspectorPanel incident={pinned} onClear={() => setPinnedId(null)} />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        filterService={filterToService}
        clearFilters={() => {
          setActiveSeverities(new Set(SEVERITIES));
          setServiceFilter(null);
        }}
        scrollToInspector={() => scrollToId("incident-inspector")}
      />
    </div>
  );
}
