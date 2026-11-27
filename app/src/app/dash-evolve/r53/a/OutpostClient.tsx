"use client";

// Outpost — Risk Ops signal feed.
// Three independently-scoped selection axes live in this tree and are never cross-wired:
//   A. selectedId (this file) -> Inspector's Case Inspector. Set only by a feed row click/Enter.
//   B. the hover/focus state inside SignalVolumeChart -> its own crosshair tooltip. Fully local to
//      that component; nothing here reads it and it never touches the feed or the inspector.
//   C. pinnedIds (this file) -> the "Pinned" tile inside Inspector's Queue Summary card only.
// Comments at each axis's definition point back to this note.

import { useCallback, useEffect, useMemo, useState } from "react";
import { Sidebar, type Section } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { SignalVolumeChart } from "./SignalVolumeChart";
import { FeedTable } from "./FeedTable";
import { FiltersPanel } from "./FiltersPanel";
import { Inspector } from "./Inspector";
import { QueuesView, RulesView, ReportsView, SettingsView } from "./SectionViews";
import { SegmentedControl } from "./ui";
import { EVENTS, riskTier, type Channel, type RiskTier, type Status } from "./data";

const SECTION_TITLE: Record<Section, string> = {
  feed: "Signal feed",
  queues: "Queues",
  rules: "Detection rules",
  reports: "Reports",
  settings: "Settings",
};

type StatusView = "all" | Status;

const EMPTY_RISK: Record<RiskTier, boolean> = { high: true, medium: true, low: true };
const EMPTY_CHANNEL: Record<Channel, boolean> = { card: true, ach: true, wire: true, p2p: true };

export function OutpostClient() {
  const [section, setSection] = useState<Section>("feed");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Axis A: row selection -> Case Inspector. See the file-level comment above.
  const [selectedId, setSelectedId] = useState<string | null>(EVENTS[EVENTS.length - 1].id);
  // Axis C: pin toggles -> Queue Summary's "Pinned" tile only. See the file-level comment above.
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(() => new Set());

  const [riskFilter, setRiskFilter] = useState<Record<RiskTier, boolean>>(EMPTY_RISK);
  const [channelFilter, setChannelFilter] = useState<Record<Channel, boolean>>(EMPTY_CHANNEL);
  const [statusView, setStatusView] = useState<StatusView>("all");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const visibleRows = useMemo(
    () =>
      EVENTS.filter(
        (e) =>
          riskFilter[riskTier(e.riskScore)] &&
          channelFilter[e.channel] &&
          (statusView === "all" || e.status === statusView)
      ),
    [riskFilter, channelFilter, statusView]
  );

  const selectedEvent = useMemo(() => EVENTS.find((e) => e.id === selectedId) ?? null, [selectedId]);

  const toggleRisk = useCallback((t: RiskTier) => setRiskFilter((p) => ({ ...p, [t]: !p[t] })), []);
  const toggleChannel = useCallback((c: Channel) => setChannelFilter((p) => ({ ...p, [c]: !p[c] })), []);
  const clearFilters = useCallback(() => {
    setRiskFilter(EMPTY_RISK);
    setChannelFilter(EMPTY_CHANNEL);
    setStatusView("all");
  }, []);
  const togglePin = useCallback((id: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const filterHighOnly = useCallback(() => {
    setRiskFilter({ high: true, medium: false, low: false });
  }, []);

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
      <Sidebar active={section} onNavigate={setSection} mobileOpen={mobileNavOpen} onMobileClose={() => setMobileNavOpen(false)} />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar
          title={SECTION_TITLE[section]}
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onNewRule={() => setSection("rules")}
        />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto w-full max-w-[1840px]">
            {section === "feed" ? (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="min-w-0 xl:col-span-3 2xl:col-span-2">
                  <FiltersPanel
                    riskFilter={riskFilter}
                    onToggleRisk={toggleRisk}
                    channelFilter={channelFilter}
                    onToggleChannel={toggleChannel}
                    onClear={clearFilters}
                    resultCount={visibleRows.length}
                  />
                </div>

                <div className="min-w-0 space-y-4 xl:col-span-9 2xl:col-span-7">
                  <SignalVolumeChart />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold text-zinc-50">Live feed</h2>
                    <SegmentedControl
                      ariaLabel="Filter feed by status"
                      value={statusView}
                      onChange={setStatusView}
                      options={[
                        { value: "all", label: "All" },
                        { value: "open", label: "Open" },
                        { value: "escalated", label: "Escalated" },
                        { value: "resolved", label: "Resolved" },
                      ]}
                    />
                  </div>

                  <FeedTable
                    rows={visibleRows}
                    selectedId={selectedId}
                    onSelectRow={setSelectedId}
                    pinnedIds={pinnedIds}
                    onTogglePin={togglePin}
                  />
                </div>

                <div className="min-w-0 xl:col-span-12 2xl:col-span-3">
                  <Inspector selected={selectedEvent} pinnedCount={pinnedIds.size} />
                </div>
              </div>
            ) : null}

            {section === "queues" ? <QueuesView /> : null}
            {section === "rules" ? <RulesView /> : null}
            {section === "reports" ? <ReportsView /> : null}
            {section === "settings" ? <SettingsView /> : null}
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={setSection}
        onFilterHighOnly={filterHighOnly}
      />
    </div>
  );
}
