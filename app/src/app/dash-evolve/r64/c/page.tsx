"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  ALERTS,
  CATEGORIES,
  DEFAULT_PINNED_ID,
  SEVERITY_ORDER,
  WORKSPACES,
  alertOf,
  alertsWithinPeriod,
  type AlertFilters,
  type Period,
  type Severity,
} from "./lib/data";
import { Sidebar, SidebarContent, type NavId } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { QueuePanel } from "./components/QueuePanel";
import { AlertFeed } from "./components/AlertFeed";
import { InspectorPanel } from "./components/InspectorPanel";
import { CommandPalette, type PaletteCommand } from "./components/CommandPalette";
import { FOCUS_RING } from "./components/ui";

const DEFAULT_FILTERS: AlertFilters = {
  period: "24h",
  severities: new Set(SEVERITY_ORDER),
  status: "all",
  category: "all",
  query: "",
  sort: "newest",
};

export default function Page() {
  const [filters, setFilters] = useState<AlertFilters>(DEFAULT_FILTERS);

  // Selection axis #1 (persistent): which alert is pinned. Threaded to exactly one consumer,
  // InspectorPanel — see its own comment for what it deliberately does not read.
  const [pinnedId, setPinnedId] = useState(DEFAULT_PINNED_ID);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavId>("feed");
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);

  const pinnedAlert = useMemo(() => alertOf(pinnedId), [pinnedId]);

  function setPeriod(period: Period) {
    setFilters((f) => ({ ...f, period }));
  }

  // ⌘K / Ctrl+K opens the command palette globally; Escape closes whichever overlay is open.
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

  const periodAlertCount = alertsWithinPeriod(filters.period).length;

  const commands: PaletteCommand[] = useMemo(() => {
    const periodCommands: PaletteCommand[] = [
      { id: "period-1h", label: "Show last 1 hour", hint: "Period", run: () => setPeriod("1h") },
      { id: "period-24h", label: "Show last 24 hours", hint: "Period", run: () => setPeriod("24h") },
      { id: "period-7d", label: "Show last 7 days", hint: "Period", run: () => setPeriod("7d") },
    ];
    const severityCommands: PaletteCommand[] = [
      { id: "sev-all", label: "Show every severity", hint: "Filter", run: () => setFilters((f) => ({ ...f, severities: new Set(SEVERITY_ORDER) })) },
      { id: "sev-critical", label: "Show critical only", hint: "Filter", run: () => setFilters((f) => ({ ...f, severities: new Set<Severity>(["critical"]) })) },
      { id: "sev-high", label: "Show high and critical only", hint: "Filter", run: () => setFilters((f) => ({ ...f, severities: new Set<Severity>(["critical", "high"]) })) },
    ];
    const resetCommand: PaletteCommand = {
      id: "reset-filters",
      label: "Clear all feed filters",
      hint: "Filter",
      run: () => setFilters((f) => ({ ...DEFAULT_FILTERS, period: f.period })),
    };
    const categoryCommands: PaletteCommand[] = CATEGORIES.map((c) => ({
      id: `cat-${c.id}`,
      label: `Filter to ${c.label}`,
      hint: "Category",
      run: () => setFilters((f) => ({ ...f, category: c.id })),
    }));
    const pinCommands: PaletteCommand[] = ALERTS.map((a) => ({
      id: `pin-${a.id}`,
      label: `Pin ${a.title}`,
      hint: a.id,
      run: () => setPinnedId(a.id),
    }));
    return [...periodCommands, ...severityCommands, resetCommand, ...categoryCommands, ...pinCommands];
  }, []);

  const sidebarProps = {
    activeNav,
    onNavigate: (id: NavId) => {
      setActiveNav(id);
      setMobileNavOpen(false);
    },
    workspace,
    workspaceOpen,
    onToggleWorkspace: () => setWorkspaceOpen((v) => !v),
    onSelectWorkspace: (w: string) => {
      setWorkspace(w);
      setWorkspaceOpen(false);
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 text-zinc-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-orange-700 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <Sidebar {...sidebarProps} />

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" tabIndex={-1} aria-label="Close navigation menu" onClick={() => setMobileNavOpen(false)} className="fixed inset-0 bg-zinc-900/40" />
          <div className="relative z-10 flex h-full w-72 max-w-[85vw] border-r border-zinc-200 bg-white">
            <SidebarContent {...sidebarProps} />
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation menu"
              className={`absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenDrawer={() => setMobileNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 overflow-y-auto">
          <div className="min-w-0 px-4 py-5 sm:px-6 sm:py-6">
            <div className="min-w-0">
              <h1 style={{ fontFamily: "var(--font-display-grotesk)" }} className="text-xl font-medium tracking-tight text-zinc-900 sm:text-2xl">
                Alert feed
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {workspace} · {periodAlertCount} alert{periodAlertCount === 1 ? "" : "s"} in the last {filters.period}
              </p>
            </div>

            <div className="mt-5 flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start">
              <div className="min-w-0 w-full shrink-0 xl:sticky xl:top-20 xl:w-[300px] xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto">
                <QueuePanel period={filters.period} onPeriodChange={setPeriod} />
              </div>

              <div className="min-w-0 w-full flex-1">
                <AlertFeed filters={filters} onFiltersChange={setFilters} pinnedId={pinnedId} onPin={setPinnedId} />
              </div>

              <div className="min-w-0 w-full shrink-0 xl:sticky xl:top-20 xl:w-[360px] xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto">
                <InspectorPanel alert={pinnedAlert} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} commands={commands} /> : null}
    </div>
  );
}
