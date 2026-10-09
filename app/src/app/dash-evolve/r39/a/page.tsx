"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  ChevronsUpDown,
  Database,
  GitBranch,
  History,
  LineChart,
  LogOut,
  Menu,
  RotateCcw,
  Search,
  Settings,
  TrendingDown,
  TrendingUp,
  Workflow,
  X,
} from "lucide-react";
import CommandPalette from "./command-palette";
import DecompositionTree from "./decomposition-tree";
import { CURRENT_USER, KPIS, MAX_ABS_ROOT_VALUE, WORKSPACE_LABEL, type KpiDefinition } from "./data";
import { allExpandableIds, defaultExpandedIds, formatMoneyK } from "./utils";

const NAV_ITEMS = [
  { label: "Variance Explorer", icon: GitBranch, active: true },
  { label: "Forecasts", icon: LineChart, active: false },
  { label: "Ledger Sync", icon: Database, active: false },
  { label: "Audit Trail", icon: History, active: false },
];

const WORKSPACES = [WORKSPACE_LABEL, "Northline Wholesale · Q3 FY26"];

// KPIS is a fixed, non-empty, hand-authored constant, so this head element is
// always defined; naming it once avoids repeated non-null assertions below.
const DEFAULT_KPI: KpiDefinition = KPIS[0]!;

function BrandLockup() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-400">
        <Workflow className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-semibold text-lg leading-tight text-zinc-50 [font-family:var(--font-display-wide)]">
          Ledgerline
        </p>
        <p className="truncate font-normal text-xs text-zinc-400">RevOps / FinOps Console</p>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.label}>
            <button
              type="button"
              aria-current={item.active ? "page" : undefined}
              onClick={onNavigate}
              className={`flex h-10 w-full items-center gap-2.5 rounded-lg px-3 font-medium text-sm motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
                item.active
                  ? "bg-emerald-400/10 text-emerald-400"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function LedgerlineConsole() {
  const [selectedKpiId, setSelectedKpiId] = useState(DEFAULT_KPI.id);
  const [prevSelectedKpiId, setPrevSelectedKpiId] = useState(DEFAULT_KPI.id);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => defaultExpandedIds(DEFAULT_KPI.root));
  const [pinnedId, setPinnedId] = useState(DEFAULT_KPI.root.id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [workspaceIndex, setWorkspaceIndex] = useState(0);

  // Selection-fanout: choosing a KPI in the rail recomputes ONLY the
  // decomposition tree's root context (which tree, its default expansion,
  // and which node is pinned/inspected). This is the React-recommended
  // "adjusting state when a prop/value changes" pattern — compare the
  // current selection to a stored copy of the previous one during render,
  // and call setState directly in the render body if they differ. It is
  // intentionally NOT done inside a useEffect keyed on selectedKpiId, which
  // is the derived-state-in-effect anti-pattern this candidate must avoid.
  if (selectedKpiId !== prevSelectedKpiId) {
    setPrevSelectedKpiId(selectedKpiId);
    const nextKpi = KPIS.find((kpi) => kpi.id === selectedKpiId) ?? DEFAULT_KPI;
    setExpandedIds(defaultExpandedIds(nextKpi.root));
    setPinnedId(nextKpi.root.id);
    setHoveredId(null);
    setFocusedId(null);
  }

  const selectedKpi: KpiDefinition = KPIS.find((kpi) => kpi.id === selectedKpiId) ?? DEFAULT_KPI;

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleExpandAll() {
    setExpandedIds(allExpandableIds(selectedKpi.root));
  }

  function handleCollapseAll() {
    setExpandedIds(new Set());
  }

  function handleResetView() {
    setExpandedIds(defaultExpandedIds(selectedKpi.root));
    setPinnedId(selectedKpi.root.id);
  }

  const focusRing =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400";

  return (
    <div className="flex min-h-screen bg-zinc-950 font-normal text-zinc-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-zinc-950 p-4 lg:flex">
        <BrandLockup />
        <button
          type="button"
          onClick={() => setWorkspaceIndex((i) => (i + 1) % WORKSPACES.length)}
          className={`mt-4 flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-white/10 px-3 font-medium text-xs text-zinc-400 hover:text-zinc-50 ${focusRing}`}
        >
          <span className="truncate">{WORKSPACES[workspaceIndex]}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </button>
        <nav aria-label="Primary" className="mt-6 flex-1">
          <NavList />
        </nav>
        <div className="border-t border-white/10 pt-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 font-medium text-xs text-zinc-50">
              {CURRENT_USER.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium text-sm text-zinc-50">{CURRENT_USER.name}</p>
              <p className="truncate font-normal text-xs text-zinc-400">{CURRENT_USER.email}</p>
            </div>
          </div>
          <button
            type="button"
            className={`mt-1 flex h-9 w-full items-center gap-2.5 rounded-lg px-2 font-normal text-xs text-zinc-400 hover:text-zinc-50 ${focusRing}`}
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-zinc-950/70" />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-white/10 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <BrandLockup />
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-50 ${focusRing}`}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Primary" className="mt-6 flex-1">
              <NavList onNavigate={() => setMobileNavOpen(false)} />
            </nav>
            <div className="border-t border-white/10 pt-3">
              <p className="truncate px-2 font-medium text-sm text-zinc-50">{CURRENT_USER.name}</p>
              <p className="truncate px-2 font-normal text-xs text-zinc-400">{CURRENT_USER.email}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-20 items-center justify-between gap-3 border-b border-white/10 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className={`flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-50 lg:hidden ${focusRing}`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className={`flex h-11 items-center gap-2 rounded-lg border border-white/10 px-3 font-normal text-sm text-zinc-400 hover:text-zinc-50 ${focusRing}`}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Search metrics</span>
              <span className="rounded border border-white/10 px-1.5 py-0.5 font-normal text-xs text-zinc-400">
                &#8984;K
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetView}
              className={`flex h-11 items-center gap-2 rounded-lg bg-emerald-500 px-3 font-medium text-sm text-zinc-950 hover:bg-emerald-400 ${focusRing}`}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Reset Decomposition</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((open) => !open)}
                aria-expanded={notifOpen}
                aria-label="Notifications"
                className={`flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-50 ${focusRing}`}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
              </button>
              {notifOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-64 rounded-lg border border-white/10 bg-zinc-900 p-2 shadow-xl">
                  <p className="px-2 py-1 font-medium text-xs text-zinc-400">Notifications</p>
                  <p className="rounded-md px-2 py-2 font-normal text-sm text-zinc-50">
                    Gross Margin Variance closed 8 points tighter than last review.
                  </p>
                  <p className="rounded-md px-2 py-2 font-normal text-sm text-zinc-50">
                    Operating Spend Variance flagged: Cloud Infrastructure Spend over threshold.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setAvatarMenuOpen((open) => !open)}
                aria-expanded={avatarMenuOpen}
                aria-label={`Account menu for ${CURRENT_USER.name}`}
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/10 font-medium text-xs text-zinc-50 hover:bg-white/15 ${focusRing}`}
              >
                {CURRENT_USER.initials}
              </button>
              {avatarMenuOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-lg border border-white/10 bg-zinc-900 p-2 shadow-xl">
                  <p className="truncate px-2 py-1 font-medium text-sm text-zinc-50">{CURRENT_USER.name}</p>
                  <p className="truncate px-2 pb-2 font-normal text-xs text-zinc-400">{CURRENT_USER.email}</p>
                  <button
                    type="button"
                    className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-50 hover:bg-white/5 ${focusRing}`}
                  >
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    Settings
                  </button>
                  <button
                    type="button"
                    className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-50 hover:bg-white/5 ${focusRing}`}
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <h1 className="font-semibold text-2xl text-zinc-50">Variance Decomposition</h1>
          <p className="mt-1 max-w-2xl font-normal text-sm text-zinc-400">
            Select a metric to see why it moved. Each branch of the tree below breaks its parent&apos;s variance
            into the drivers that explain it, down to the root cause.
          </p>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
            <section aria-labelledby="rail-heading" className="w-full shrink-0 lg:w-72">
              <h2 id="rail-heading" className="font-semibold text-sm text-zinc-50">
                Metrics
              </h2>
              <ul className="mt-2 space-y-2">
                {KPIS.map((kpi) => {
                  const isSelected = kpi.id === selectedKpiId;
                  const magnitude = Math.round((Math.abs(kpi.root.value) / MAX_ABS_ROOT_VALUE) * 100);
                  return (
                    <li key={kpi.id}>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedKpiId(kpi.id)}
                        className={`w-full min-w-0 rounded-lg border px-3 py-2.5 text-left motion-safe:transition-colors ${focusRing} ${
                          isSelected
                            ? "border-emerald-400/40 bg-emerald-400/10"
                            : "border-white/10 bg-transparent hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="min-w-0 truncate font-medium text-sm text-zinc-50">{kpi.label}</span>
                          {isSelected ? (
                            <Check className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                          ) : null}
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <span className="min-w-0 truncate font-normal text-xs text-zinc-400">
                            {kpi.category} &middot; {kpi.periodLabel}
                          </span>
                          <span className="shrink-0 font-medium text-sm tabular-nums text-zinc-50">
                            {formatMoneyK(kpi.root.value)}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          {kpi.trend === "down" ? (
                            <TrendingDown className="h-3.5 w-3.5 shrink-0 text-rose-400" aria-hidden="true" />
                          ) : (
                            <TrendingUp className="h-3.5 w-3.5 shrink-0 text-rose-400" aria-hidden="true" />
                          )}
                          <span className="font-normal text-xs text-rose-400">
                            {kpi.trend === "down" ? "Unfavorable" : "Over budget"}
                          </span>
                          <div className="ml-auto h-1.5 w-16 shrink-0 rounded-full bg-white/10">
                            <div
                              className="h-1.5 rounded-full bg-rose-400"
                              style={{ width: `${magnitude}%` }}
                            />
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            <div className="min-w-0 flex-1">
              <DecompositionTree
                kpi={selectedKpi}
                expandedIds={expandedIds}
                onToggleExpand={toggleExpand}
                onExpandAll={handleExpandAll}
                onCollapseAll={handleCollapseAll}
                pinnedId={pinnedId}
                onPin={setPinnedId}
                hoveredId={hoveredId}
                onHover={setHoveredId}
                focusedId={focusedId}
                onFocusNode={setFocusedId}
              />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        kpis={KPIS}
        onSelect={setSelectedKpiId}
      />
    </div>
  );
}
