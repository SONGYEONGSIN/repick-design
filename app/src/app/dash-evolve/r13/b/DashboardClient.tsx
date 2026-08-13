"use client";

import { useCallback, useEffect, useState } from "react";
import ActivityFeed from "./components/ActivityFeed";
import AlertsPanel from "./components/AlertsPanel";
import CommandPalette from "./components/CommandPalette";
import EnvironmentPanel from "./components/EnvironmentPanel";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { BRAND, EVENT_BY_ID, type EnvironmentId, type EventStatus, type Period } from "./data";
import { TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";

export default function DashboardClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const [period, setPeriod] = useState<Period>("24h");
  const [envFilter, setEnvFilter] = useState<EnvironmentId | "all">("all");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "all">("all");
  const [actorQuery, setActorQuery] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

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

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleToggleEnvFromPanel = useCallback((id: EnvironmentId) => {
    setEnvFilter((prev) => (prev === id ? "all" : id));
  }, []);

  function handleJumpToEvent(id: string) {
    setSelectedId(id);
    setExpandedIds((prev) => new Set(prev).add(id));
    setPaletteOpen(false);
  }

  function handleJumpToEnvironment(id: EnvironmentId) {
    setEnvFilter(id);
    setPaletteOpen(false);
  }

  const selectedEvent = selectedId !== null ? (EVENT_BY_ID[selectedId] ?? null) : null;

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden bg-zinc-950", TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto flex max-w-[1680px] flex-col gap-4 p-4 sm:p-6">
            <header className="min-w-0">
              <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)} style={{ fontFamily: "var(--font-display-wide)" }}>
                {BRAND.name}
              </h1>
              <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>{BRAND.tagline} &middot; Core Platform workspace</p>
            </header>

            <div className="flex min-w-0 flex-col items-start gap-4 lg:flex-row">
              <div className="order-2 w-full shrink-0 lg:order-1 lg:w-[280px]">
                <EnvironmentPanel activeEnvironmentId={selectedEvent?.environment ?? null} filterEnvironmentId={envFilter} onToggleFilter={handleToggleEnvFromPanel} />
              </div>

              <div className="order-1 min-w-0 w-full flex-1 lg:order-2">
                <ActivityFeed
                  period={period}
                  onPeriodChange={setPeriod}
                  envFilter={envFilter}
                  onEnvFilterChange={setEnvFilter}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  actorQuery={actorQuery}
                  onActorQueryChange={setActorQuery}
                  selectedId={selectedId}
                  onSelect={handleSelect}
                  expandedIds={expandedIds}
                  onToggleExpand={handleToggleExpand}
                />
              </div>

              <div className="order-3 w-full shrink-0 lg:w-[320px]">
                <AlertsPanel selectedEventId={selectedId} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onJumpToEvent={handleJumpToEvent} onJumpToEnvironment={handleJumpToEnvironment} /> : null}
    </div>
  );
}
