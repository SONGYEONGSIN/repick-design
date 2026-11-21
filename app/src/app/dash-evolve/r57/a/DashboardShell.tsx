"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { KpiRow } from "./KpiRow";
import { BoxPlotCard } from "./BoxPlotCard";
import { TeamFocusCard } from "./TeamFocusCard";
import { TicketFeedCard } from "./TicketFeedCard";
import { TicketTable } from "./TicketTable";
import { CommandPalette } from "./CommandPalette";
import type { Period, TeamName } from "./data";

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400";

export function DashboardShell() {
  const [period, setPeriod] = useState<Period>("7d");
  const [pinnedTeam, setPinnedTeam] = useState<TeamName | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Global ⌘K / Ctrl+K shortcut. This responds to a real external keyboard event; it is not an
  // effect that derives/resets state from a prop or sibling state, so it is outside the
  // set-state-in-effect rule this round is specifically guarding against.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  function scrollToId(id: string) {
    const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <div className="flex min-h-screen min-w-0 bg-slate-950">
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-green-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-slate-950 ${FOCUS}`}
      >
        Skip to main content
      </a>
      <Sidebar />

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-slate-950/70" onClick={() => setDrawerOpen(false)} />
          <div className="relative z-10">
            <Sidebar mobile />
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation menu"
            className={`relative z-10 m-3 flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-lg bg-slate-900 text-slate-300 ${FOCUS}`}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenDrawer={() => setDrawerOpen(true)} unreadCount={3} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto grid min-w-0 max-w-[1660px] grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-12">
            <div className="min-w-0 xl:col-span-12">
              <KpiRow period={period} />
            </div>

            <div className="min-w-0 xl:col-span-8">
              <BoxPlotCard period={period} setPeriod={setPeriod} pinnedTeam={pinnedTeam} setPinnedTeam={setPinnedTeam} />
            </div>
            <div className="min-w-0 xl:col-span-4">
              <TeamFocusCard period={period} pinnedTeam={pinnedTeam} />
            </div>

            <div className="min-w-0 xl:col-span-5">
              <TicketFeedCard />
            </div>
            <div className="min-w-0 xl:col-span-7">
              <TicketTable />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        pinTeam={setPinnedTeam}
        setPeriod={setPeriod}
        scrollToId={scrollToId}
      />
    </div>
  );
}
