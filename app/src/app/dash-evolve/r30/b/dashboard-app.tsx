"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KanbanSquare } from "lucide-react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import CommandPalette from "./command-palette";
import { FilterBar, type ViewMode } from "./filter-bar";
import { Board } from "./board";
import { CompactList } from "./compact-list";
import { InspectorStrip } from "./inspector-strip";
import { HoverPreview } from "./hover-preview";
import { FOCUS_RING } from "./ui";
import {
  INCIDENTS,
  TOTALS,
  getIncident,
  slaFor,
  compareIncidents,
  formatMinutes,
  formatCount,
  type Severity,
  type SortKey,
  type SortDir,
} from "./data";

interface Hovered {
  id: string;
  rect: DOMRect;
}

export default function DashboardApp() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const [pinnedId, setPinnedId] = useState<string | null>("inc-111");
  const [hovered, setHovered] = useState<Hovered | null>(null);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  const [severityFilter, setSeverityFilter] = useState<Set<Severity>>(() => new Set());
  const [slaOnly, setSlaOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("sla");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [view, setView] = useState<ViewMode>("board");

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const lastScrolledRef = useRef<string | null>(null);
  useEffect(() => {
    if (!scrollTarget || lastScrolledRef.current === scrollTarget) return;
    lastScrolledRef.current = scrollTarget;
    const el = document.getElementById(`card-${scrollTarget}`);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [scrollTarget]);

  const handlePin = useCallback((id: string) => {
    setPinnedId((current) => (current === id ? null : id));
  }, []);

  const handleHoverStart = useCallback((id: string, rect: DOMRect) => {
    setHovered({ id, rect });
  }, []);
  const handleHoverEnd = useCallback((id: string) => {
    setHovered((h) => (h && h.id === id ? null : h));
  }, []);

  const handleToggleSeverity = useCallback((sev: Severity) => {
    setSeverityFilter((prev) => {
      const next = new Set(prev);
      if (next.has(sev)) next.delete(sev);
      else next.add(sev);
      return next;
    });
  }, []);
  const handleClearSeverity = useCallback(() => setSeverityFilter(new Set()), []);
  const handleToggleSlaOnly = useCallback(() => setSlaOnly((v) => !v), []);
  const handleToggleDir = useCallback(() => setSortDir((d) => (d === "asc" ? "desc" : "asc")), []);

  const handlePaletteSelect = useCallback((id: string) => {
    setSeverityFilter(new Set());
    setSlaOnly(false);
    setView("board");
    setPinnedId(id);
    setScrollTarget(id);
  }, []);

  const filtered = useMemo(() => {
    return INCIDENTS.filter((i) => {
      if (severityFilter.size > 0 && !severityFilter.has(i.severity)) return false;
      if (slaOnly) {
        const s = slaFor(i).state;
        if (!(s === "at-risk" || s === "breached" || s === "missed")) return false;
      }
      return true;
    });
  }, [severityFilter, slaOnly]);

  const sortedForList = useMemo(
    () => [...filtered].sort((a, b) => compareIncidents(a, b, sortKey, sortDir)),
    [filtered, sortKey, sortDir]
  );

  const pinnedIncident = pinnedId ? getIncident(pinnedId) ?? null : null;
  const hoveredIncident = hovered && hovered.id !== pinnedId ? getIncident(hovered.id) : undefined;

  return (
    <div className="flex bg-zinc-950 xl:h-dvh xl:overflow-hidden">
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-emerald-400 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-950 ${FOCUS_RING}`}
      >
        Skip to main content
      </a>

      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col xl:overflow-hidden">
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />

        <main
          id="main-content"
          className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 xl:min-h-0 xl:overflow-y-hidden"
        >
          <div className="shrink-0">
            <div className="flex items-center gap-2 text-emerald-400">
              <KanbanSquare className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Incident response</span>
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">Command board</h1>
            <p className="mt-1 max-w-2xl text-sm text-zinc-400">
              Every open and recently-resolved incident across Aurora Systems&rsquo; production services, grouped by
              stage.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-white/10 py-3">
              <InlineStat label="Open incidents" value={formatCount(TOTALS.openCount)} />
              <Divider />
              <InlineStat label="SEV1 open" value={formatCount(TOTALS.sev1OpenCount)} tone="text-red-400" />
              <Divider />
              <InlineStat label="Breaching SLA" value={formatCount(TOTALS.breachingCount)} tone="text-amber-400" />
              <Divider />
              <InlineStat label="Avg. time to resolve" value={formatMinutes(TOTALS.avgResolveMin)} />
            </div>
          </div>

          <div className="shrink-0">
            <FilterBar
              severityFilter={severityFilter}
              onToggleSeverity={handleToggleSeverity}
              onClearSeverity={handleClearSeverity}
              slaOnly={slaOnly}
              onToggleSlaOnly={handleToggleSlaOnly}
              sortKey={sortKey}
              sortDir={sortDir}
              onSortKeyChange={setSortKey}
              onToggleDir={handleToggleDir}
              view={view}
              onViewChange={setView}
            />
          </div>

          <div className="shrink-0">
            <InspectorStrip incident={pinnedIncident} onClear={() => setPinnedId(null)} />
          </div>

          <div className="min-h-0 flex-1 xl:flex xl:flex-col">
            {view === "board" ? (
              <Board
                incidents={filtered}
                sortKey={sortKey}
                sortDir={sortDir}
                pinnedId={pinnedId}
                onPin={handlePin}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
              />
            ) : (
              <div className="min-h-0 flex-1 rounded-xl border border-white/10 bg-zinc-900 p-3 xl:overflow-y-auto">
                <CompactList
                  incidents={sortedForList}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={setSortKey}
                  pinnedId={pinnedId}
                  onPin={handlePin}
                  onHoverStart={handleHoverStart}
                  onHoverEnd={handleHoverEnd}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelect={handlePaletteSelect} />

      {hovered && hoveredIncident && <HoverPreview incident={hoveredIncident} anchor={hovered.rect} />}
    </div>
  );
}

function InlineStat({ label, value, tone = "text-zinc-50" }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{label}</p>
      <p className={`mt-0.5 text-sm font-semibold tabular-nums ${tone}`}>{value}</p>
    </div>
  );
}

function Divider() {
  return <div aria-hidden="true" className="hidden h-8 w-px bg-white/10 sm:block" />;
}
