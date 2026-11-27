"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { GROUPS, PERIODS, WORKSPACES, type PeriodId } from "./lib/data";
import { Sidebar, SidebarContent, type NavId } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { HeroStats } from "./components/HeroStats";
import { BulletGrid, type GroupFilter } from "./components/BulletGrid";
import { RolesTable, STATUS_OPTIONS, type StatusFilter } from "./components/RolesTable";
import { CommandPalette, type PaletteCommand } from "./components/CommandPalette";
import { FOCUS_RING } from "./components/ui";

export default function Page() {
  const [period, setPeriod] = useState<PeriodId>("qtd");
  const [groupFilter, setGroupFilter] = useState<GroupFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("open");

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavId>("overview");
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);

  const overviewRef = useRef<HTMLDivElement | null>(null);
  const headcountRef = useRef<HTMLDivElement | null>(null);
  const pipelineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "Escape" && !paletteOpen) {
        if (mobileNavOpen) setMobileNavOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileNavOpen, paletteOpen]);

  function navigate(id: NavId) {
    setActiveNav(id);
    setMobileNavOpen(false);
    const ref = id === "overview" ? overviewRef : id === "headcount" ? headcountRef : id === "pipeline" ? pipelineRef : null;
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const commands: PaletteCommand[] = useMemo(() => {
    const periodCommands: PaletteCommand[] = PERIODS.map((p) => ({
      id: `period-${p.id}`,
      label: `Show ${p.label} in the overview`,
      hint: "Period",
      run: () => setPeriod(p.id),
    }));
    const groupCommands: PaletteCommand[] = [
      { id: "group-all", label: "Show all department groups", hint: "Headcount", run: () => setGroupFilter("all") },
      ...GROUPS.map((g) => ({ id: `group-${g}`, label: `Filter headcount to ${g}`, hint: "Headcount", run: () => setGroupFilter(g) })),
    ];
    const statusCommands: PaletteCommand[] = STATUS_OPTIONS.map((s) => ({
      id: `status-${s.value}`,
      label: `Filter the pipeline to ${s.label}`,
      hint: "Pipeline",
      run: () => setStatusFilter(s.value),
    }));
    const resetCommand: PaletteCommand = {
      id: "reset-filters",
      label: "Reset headcount and pipeline filters",
      hint: "Reset",
      run: () => {
        setGroupFilter("all");
        setStatusFilter("open");
      },
    };
    return [...periodCommands, ...groupCommands, ...statusCommands, resetCommand];
  }, []);

  const sidebarProps = {
    activeNav,
    onNavigate: navigate,
    workspace,
    workspaceOpen,
    onToggleWorkspace: () => setWorkspaceOpen((v) => !v),
    onSelectWorkspace: (w: string) => {
      setWorkspace(w);
      setWorkspaceOpen(false);
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-lime-400 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-950"
      >
        Skip to content
      </a>

      <Sidebar {...sidebarProps} />

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" tabIndex={-1} aria-label="Close navigation menu" onClick={() => setMobileNavOpen(false)} className="fixed inset-0 bg-zinc-950/60" />
          <div className="relative z-10 flex h-full w-72 max-w-[85vw] border-r border-white/10 bg-zinc-950">
            <SidebarContent {...sidebarProps} />
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation menu"
              className={`absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-100 ${FOCUS_RING}`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenDrawer={() => setMobileNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto min-w-0 max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
            <div ref={overviewRef} className="min-w-0 scroll-mt-20">
              <h1 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">Workforce overview</h1>
              <p className="mt-1 text-sm text-zinc-400">{workspace} · headcount and hiring pipeline across every department</p>
            </div>

            <div className="mt-5 min-w-0">
              <HeroStats period={period} onPeriodChange={setPeriod} />
            </div>

            <div ref={headcountRef} className="mt-6 min-w-0 scroll-mt-20">
              <BulletGrid groupFilter={groupFilter} onGroupFilterChange={setGroupFilter} />
            </div>

            <div ref={pipelineRef} className="mt-6 min-w-0 scroll-mt-20 pb-6">
              <RolesTable statusFilter={statusFilter} onStatusFilterChange={setStatusFilter} />
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} commands={commands} /> : null}
    </div>
  );
}
