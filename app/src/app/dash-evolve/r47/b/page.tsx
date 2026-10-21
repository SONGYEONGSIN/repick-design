"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Flame, Gauge, ListChecks, Plus, Radio, TimerReset } from "lucide-react";
import {
  INITIAL_INCIDENTS,
  computeActiveStats,
  computeUptimePct,
  nextIncidentId,
  worstCell,
  type FeedFilter,
  type Incident,
  type PinnedKey,
} from "./data";
import { formatMinutes, formatPercent } from "./format";
import { DesktopSidebar, MobileSidebarDrawer } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette, type PaletteAction } from "./command-palette";
import { IncidentFeed } from "./feed";
import { ServiceRegionHeatmap } from "./heatmap";
import { PinnedCellCard } from "./pinned-cell-card";
import { ErrorBudgetCard } from "./error-budget-card";
import { ResponderLoadCard } from "./responder-load-card";
import type { DraftIncident } from "./composer";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

export default function Page() {
  // ---------------------------------------------------------------------------------------------
  // Ordinary app/data state — incidents list, composer visibility, the shared feed view filter,
  // and UI chrome (mobile nav, command palette). None of these is an "identity selection".
  // ---------------------------------------------------------------------------------------------
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [composerOpen, setComposerOpen] = useState(false);
  const [feedFilter, setFeedFilter] = useState<FeedFilter>("all");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  /**
   * TIER-3 SELECTION FAN-OUT — the two independently-scoped mechanisms this round asks for.
   *
   * (a) `pinnedKey` — written ONLY by `ServiceRegionHeatmap`'s `onPin` callback (a click on a
   *     matrix cell), read ONLY by `PinnedCellCard`. Nothing else in this file ever reads
   *     `pinnedKey`, and it is never passed to `IncidentFeed`, the incidents table, or anywhere
   *     else. Defaults to the dataset's worst error-rate cell, so the card is never empty.
   *
   * (b) The feed's hover/focus "ephemeral inspector" (`hoverId`) lives entirely inside
   *     `feed.tsx` — it is never lifted here, never read by this file, and never shared with
   *     `pinnedKey`. Verify with `grep -rn "hoverId" app/src/app/dash-evolve/r47/b` — every
   *     match is inside `feed.tsx`.
   *
   * These two states have different producers, different consumers, different lifetimes (the
   * pin persists until the next click; the inspector reverts the instant hover/focus ends), and
   * neither is ever threaded into a second consumer — the failure mode this round calls out.
   */
  const [pinnedKey, setPinnedKey] = useState<PinnedKey>(() => {
    const worst = worstCell("errorRate");
    return { serviceId: worst.serviceId, regionId: worst.regionId };
  });

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

  function handleAddIncident(draft: DraftIncident) {
    setIncidents((prev) => [{ id: nextIncidentId(prev), ...draft }, ...prev]);
    setComposerOpen(false);
    scrollToId("feed-section");
  }

  const stats = computeActiveStats(incidents);
  const uptimePct = computeUptimePct(incidents);

  const paletteActions: PaletteAction[] = [
    { id: "goto-feed", label: "Go to Incident Feed", hint: "Jump", icon: Radio, onRun: () => scrollToId("feed-section") },
    { id: "goto-heatmap", label: "Go to Error Surface heatmap", hint: "Jump", icon: Gauge, onRun: () => scrollToId("heatmap-section") },
    { id: "goto-budget", label: "Go to Error Budget Burn", hint: "Jump", icon: TimerReset, onRun: () => scrollToId("budget-section") },
    {
      id: "declare",
      label: "Declare a new incident",
      hint: "Action",
      icon: Plus,
      onRun: () => {
        setComposerOpen(true);
        scrollToId("feed-section");
      },
    },
    { id: "filter-all", label: "Filter: Show all incidents", hint: "Filter", icon: ListChecks, onRun: () => setFeedFilter("all") },
    { id: "filter-critical", label: "Filter: Critical only", hint: "Filter", icon: Flame, onRun: () => setFeedFilter("critical") },
    { id: "filter-resolved", label: "Filter: Resolved only", hint: "Filter", icon: CheckCircle2, onRun: () => setFeedFilter("resolved") },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
      <DesktopSidebar />
      <MobileSidebarDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          onDeclareIncident={() => {
            setComposerOpen(true);
            scrollToId("feed-section");
          }}
        />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <header className="min-w-0">
            <h1 className="text-2xl text-zinc-50 [font-family:var(--font-display-wide)] sm:text-3xl">Incident Command</h1>
            <p className="mt-1 max-w-2xl font-normal text-sm text-zinc-400">
              Keelwatch reliability console — live incidents, the service × region error surface, and this month&apos;s
              error-budget burn, in one feed-centric view.
            </p>

            <dl className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 shrink-0 text-rose-400" aria-hidden="true" />
                <dt className="font-normal text-xs text-zinc-400">Active</dt>
                <dd className="font-medium text-sm tabular-nums text-zinc-50">{stats.activeCount}</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 shrink-0 text-rose-400" aria-hidden="true" />
                <dt className="font-normal text-xs text-zinc-400">Critical</dt>
                <dd className="font-medium text-sm tabular-nums text-zinc-50">{stats.criticalActiveCount}</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <TimerReset className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                <dt className="font-normal text-xs text-zinc-400">MTTR</dt>
                <dd className="font-medium text-sm tabular-nums text-zinc-50">{formatMinutes(stats.mttrMinutes)}</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <Gauge className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                <dt className="font-normal text-xs text-zinc-400">Uptime (30d)</dt>
                <dd className="font-medium text-sm tabular-nums text-zinc-50">{formatPercent(uptimePct, 2)}</dd>
              </div>
            </dl>
          </header>

          <div className="mt-6 grid grid-cols-12 gap-4 sm:gap-6">
            <div className="col-span-12 min-w-0 lg:col-span-7 xl:col-span-8">
              <IncidentFeed
                incidents={incidents}
                feedFilter={feedFilter}
                onFeedFilterChange={setFeedFilter}
                composerOpen={composerOpen}
                onCloseComposer={() => setComposerOpen(false)}
                onAddIncident={handleAddIncident}
              />
            </div>

            <aside className="col-span-12 flex min-w-0 flex-col gap-4 sm:gap-6 lg:col-span-5 xl:col-span-4">
              <PinnedCellCard pinnedKey={pinnedKey} />
              <ErrorBudgetCard incidents={incidents} />
              <ResponderLoadCard incidents={incidents} />
            </aside>

            <div className="col-span-12 min-w-0">
              <ServiceRegionHeatmap onPin={setPinnedKey} />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} actions={paletteActions} />
    </div>
  );
}
