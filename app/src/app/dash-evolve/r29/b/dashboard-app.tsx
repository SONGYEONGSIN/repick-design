"use client";

import { useCallback, useMemo, useState } from "react";
import { EVENTS, getEvent, type Severity } from "./data";
import { Sidebar, MobileDrawer } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette, useCommandPalette } from "./command-palette";
import { Feed } from "./feed";
import { NetworkGraphCard } from "./network-graph";
import { RiskStripCard } from "./risk-strip";
import { FOCUS_RING } from "./ui";

const DEFAULT_FOCUS_EVENT = EVENTS.find((e) => e.severity === "critical") ?? EVENTS[0];

export default function DashboardApp() {
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleTogglePin = useCallback((id: string) => {
    setPinnedId((prev) => (prev === id ? null : id));
  }, []);

  const clearPin = useCallback(() => setPinnedId(null), []);

  const pinEvent = useCallback((id: string) => setPinnedId(id), []);

  const scrollToGraph = useCallback(() => {
    document.getElementById("access-graph-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  const scrollToRisk = useCallback(() => {
    document.getElementById("risk-strip-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
  const handleNewInvestigation = useCallback(() => {
    setSeverityFilter("all");
    document.getElementById("event-stream")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const palette = useCommandPalette({
    setSeverityFilter, pinEvent, clearPin, scrollToGraph, scrollToRisk,
  });

  const pinnedEvent = useMemo(() => (pinnedId ? getEvent(pinnedId) : null), [pinnedId]);
  const focusEvent = pinnedEvent ?? DEFAULT_FOCUS_EVENT;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-zinc-900 focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-white ${FOCUS_RING}`}
      >
        Skip to main content
      </a>
      <Sidebar />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMenu={() => setDrawerOpen(true)}
          onOpenSearch={() => palette.setOpen(true)}
          onNewInvestigation={handleNewInvestigation}
        />

        <main id="main-content" className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Live Feed</h1>
            <p className="mt-1 text-sm font-normal text-zinc-500">
              Real-time access-anomaly signal across every account and service in Northwind Cloud.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_380px] lg:gap-6">
            <div id="event-stream" className="min-w-0">
              <Feed
                severityFilter={severityFilter}
                onSeverityFilterChange={setSeverityFilter}
                pinnedId={pinnedId}
                onTogglePin={handleTogglePin}
              />
            </div>

            <div className="space-y-5 lg:space-y-6">
              <div id="access-graph-card">
                <NetworkGraphCard
                  focusEvent={focusEvent}
                  pinned={pinnedEvent !== null}
                  onClearPin={clearPin}
                  headingId="access-graph-heading"
                />
              </div>
              <div id="risk-strip-card">
                <RiskStripCard pinnedEvent={pinnedEvent} headingId="risk-strip-heading" />
              </div>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={palette.open} onClose={() => palette.setOpen(false)} commands={palette.commands} />
    </div>
  );
}
