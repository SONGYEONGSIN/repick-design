"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TEAMS, TICKETS, TeamId } from "./data";
import { teamSummary } from "./stats";
import { SURFACE, TEXT } from "./tokens";
import { Sidebar, MobileDrawer, NavSection } from "./Sidebar";
import { Topbar } from "./Topbar";
import { BoxPlotPanel } from "./BoxPlotPanel";
import { TicketFeed } from "./TicketFeed";
import { DetailPanel } from "./DetailPanel";
import { CommandPalette } from "./CommandPalette";

const TEAM_SUMMARIES = TEAMS.map((t) => teamSummary(t.id));

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Page() {
  const [activeNav, setActiveNav] = useState<NavSection>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [workspace, setWorkspace] = useState("repick Support — Global");

  // Two independently-scoped selection pins driven by the box plot: clicking a team sets
  // both, but each has its own clear control so they do not reset each other.
  const [feedTeamFilter, setFeedTeamFilter] = useState<TeamId | null>(null);
  const [detailTeam, setDetailTeam] = useState<TeamId | null>(null);

  const overviewRef = useRef<HTMLDivElement>(null);
  const ticketsRef = useRef<HTMLDivElement>(null);
  const teamsRef = useRef<HTMLDivElement>(null);
  const reportsRef = useRef<HTMLDivElement>(null);

  const navigate = useCallback(
    (section: NavSection) => {
      setActiveNav(section);
      const el =
        section === "overview"
          ? overviewRef.current
          : section === "tickets"
            ? ticketsRef.current
            : section === "teams"
              ? teamsRef.current
              : reportsRef.current;
      el?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    },
    [overviewRef, ticketsRef, teamsRef, reportsRef],
  );

  const handleSelectTeam = useCallback((id: TeamId) => {
    setFeedTeamFilter(id);
    setDetailTeam(id);
  }, []);

  const closePalette = useCallback(() => {
    setPaletteOpen(false);
    document.getElementById("topbar-search-trigger")?.focus();
  }, []);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
    document.getElementById("topbar-mobile-nav-trigger")?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={`flex min-h-screen w-full ${SURFACE.page} ${TEXT.primary}`}>
      <Sidebar activeNav={activeNav} onNavigate={navigate} workspace={workspace} onChangeWorkspace={setWorkspace} />
      <MobileDrawer
        open={mobileNavOpen}
        onClose={closeMobileNav}
        activeNav={activeNav}
        onNavigate={navigate}
        workspace={workspace}
        onChangeWorkspace={setWorkspace}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6">
          <div ref={overviewRef} className="mb-6">
            <h1 className="text-xl font-semibold tabular-nums tracking-tight">Support Ticket Resolution Health</h1>
            <p className={`mt-1 text-sm ${TEXT.muted}`}>
              Resolution-time distribution by team, with live ticket activity and SLA pulse for repick support operations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div ref={reportsRef} className="min-w-0 xl:order-1 xl:col-span-3">
              <DetailPanel detailTeam={detailTeam} onClearDetail={() => setDetailTeam(null)} />
            </div>

            <div ref={ticketsRef} className="min-w-0 xl:order-2 xl:col-span-6">
              <TicketFeed tickets={TICKETS} teamFilter={feedTeamFilter} onClearTeamFilter={() => setFeedTeamFilter(null)} />
            </div>

            <div ref={teamsRef} className="min-w-0 xl:order-3 xl:col-span-3">
              <BoxPlotPanel summaries={TEAM_SUMMARIES} selectedTeam={detailTeam} onSelectTeam={handleSelectTeam} />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={closePalette}
        onNavigate={navigate}
        onSelectTeam={handleSelectTeam}
        onClearFilters={() => {
          setFeedTeamFilter(null);
          setDetailTeam(null);
        }}
      />
    </div>
  );
}
