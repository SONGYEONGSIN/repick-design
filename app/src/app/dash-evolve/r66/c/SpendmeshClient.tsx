"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, Table as TableIcon } from "lucide-react";
import { Topbar } from "./Topbar";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { SearchOverlay } from "./SearchOverlay";
import { NewAlertModal } from "./NewAlertModal";
import { ToastStack, type Toast } from "./ToastStack";
import { KpiStrip } from "./KpiStrip";
import { Treemap } from "./Treemap";
import { FallbackTable } from "./FallbackTable";
import { SelectionDrawer, type Selection } from "./SelectionDrawer";
import {
  PERIOD_COMPARE,
  PERIOD_DATA,
  PERIOD_LABEL,
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  computeKpis,
  teamName,
  type Period,
  type ServiceCategory,
  type TeamId,
} from "./data";
import { CATEGORY_STYLE, SegmentedControl } from "./ui";

type ViewMode = "treemap" | "table";

const VIEW_OPTIONS: { value: ViewMode; label: string; icon: typeof LayoutGrid }[] = [
  { value: "treemap", label: "Treemap", icon: LayoutGrid },
  { value: "table", label: "Table", icon: TableIcon },
];

export function SpendmeshClient() {
  const [period, setPeriod] = useState<Period>("this-month");
  const [view, setView] = useState<ViewMode>("treemap");
  const [isCompact, setIsCompact] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [highlightRowId, setHighlightRowId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toastIdRef = useRef(0);
  const rowRefs = useRef<Map<string, HTMLTableRowElement>>(new Map());

  const teams = PERIOD_DATA[period];
  const compareTeams = PERIOD_COMPARE[period];
  const kpis = useMemo(() => computeKpis(period), [period]);

  // Below 640px there isn't enough room for a legible treemap tile grid (smallest categories
  // would render under the 24px target-size floor) — the fallback table becomes the only view,
  // per the brief's own "switch to table by default on narrow viewports" option. This reads the
  // real viewport via `matchMedia`, which is unavailable at render/SSR time, so it has to live in
  // an effect rather than be computed inline.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!highlightRowId) return;
    const el = rowRefs.current.get(highlightRowId);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    const t = setTimeout(() => setHighlightRowId(null), 2200);
    return () => clearTimeout(t);
  }, [highlightRowId]);

  function pushToast(message: string) {
    toastIdRef.current += 1;
    const id = toastIdRef.current;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }

  // These overlays (selection drawer, search, new-alert modal, mobile nav) are mutually
  // exclusive — each manages its own focus-on-open/restore-on-close and body-scroll lock in an
  // effect scoped to its own mount lifetime, so never letting two be mounted at once keeps that
  // bookkeeping from stepping on itself.
  function openSearch() {
    setSelection(null);
    setAlertOpen(false);
    setMobileNavOpen(false);
    setSearchOpen(true);
  }

  function openNewAlert() {
    setSelection(null);
    setSearchOpen(false);
    setMobileNavOpen(false);
    setAlertOpen(true);
  }

  function openMobileNav() {
    setSelection(null);
    setSearchOpen(false);
    setAlertOpen(false);
    setMobileNavOpen(true);
  }

  function handleSelect(teamId: TeamId, category: ServiceCategory) {
    setSearchOpen(false);
    setAlertOpen(false);
    setMobileNavOpen(false);
    setSelection({ teamId, category });
  }

  function handleJumpToTable(teamId: TeamId, category: ServiceCategory) {
    setSelection(null);
    setView("table");
    setHighlightRowId(`row-${teamId}-${category}`);
  }

  function handleCreateAlert(teamId: TeamId, threshold: number) {
    pushToast(`New alert created — notify when ${teamName(teamId)} crosses $${threshold.toLocaleString("en-US")}/mo.`);
  }

  function handleNavPlaceholder(label: string) {
    pushToast(`${label} isn't wired up in this preview yet.`);
  }

  const effectiveView: ViewMode = isCompact ? "table" : view;

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col bg-zinc-950 text-zinc-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-xl focus:bg-violet-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-zinc-50"
      >
        Skip to main content
      </a>

      <Topbar
        onOpenSearch={openSearch}
        onOpenMobileNav={openMobileNav}
        onOpenNewAlert={openNewAlert}
        onNavPlaceholder={handleNavPlaceholder}
      />
      <MobileNavDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onOpenSearch={openSearch}
        onOpenNewAlert={openNewAlert}
        onNavPlaceholder={handleNavPlaceholder}
      />

      <main id="main-content" className="flex min-w-0 flex-1 flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-6 xl:px-10">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-zinc-50">Cost allocation</h1>
          <p className="mt-0.5 text-sm font-normal text-zinc-400">Service &times; team spend across the Acme Cloud workspace.</p>
        </div>

        <KpiStrip kpis={kpis} period={period} onPeriodChange={setPeriod} />

        <section aria-labelledby="alloc-heading" className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-4">
              <h2 id="alloc-heading" className="text-sm font-medium text-zinc-50">
                Spend by team &amp; service
              </h2>
              {effectiveView === "treemap" && (
                <ul className="flex min-w-0 flex-wrap items-center gap-2.5" aria-label="Category color key">
                  {CATEGORY_ORDER.map((category) => (
                    <li key={category} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] font-normal text-zinc-400">
                      <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-sm ${CATEGORY_STYLE[category].fill} ${CATEGORY_STYLE[category].dashed ? "border border-dashed border-white/40" : ""}`} />
                      {CATEGORY_LABEL[category]}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {!isCompact ? (
              <SegmentedControl options={VIEW_OPTIONS} value={view} onChange={setView} label="View mode" />
            ) : (
              <span className="text-xs font-normal text-zinc-400">Table view on narrow screens</span>
            )}
          </div>

          {effectiveView === "treemap" ? (
            <div className="relative h-[420px] sm:h-[480px] lg:h-[560px] xl:h-[640px]">
              <Treemap teams={teams} compareTeams={compareTeams} selected={selection} onSelect={handleSelect} />
            </div>
          ) : (
            <FallbackTable
              teams={teams}
              period={PERIOD_LABEL[period]}
              highlightId={highlightRowId}
              rowRefSetter={(id, el) => {
                if (el) rowRefs.current.set(id, el);
                else rowRefs.current.delete(id);
              }}
              onSelect={handleSelect}
            />
          )}
        </section>
      </main>

      <SelectionDrawer selection={selection} period={period} onClose={() => setSelection(null)} onJumpToTable={handleJumpToTable} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} teams={teams} onSelect={handleSelect} />
      <NewAlertModal
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        defaultTeamId={kpis.largestTeamId}
        defaultThreshold={Math.round(kpis.largestTeamCost / 10000) * 10000}
        onCreate={handleCreateAlert}
      />
      <ToastStack toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
