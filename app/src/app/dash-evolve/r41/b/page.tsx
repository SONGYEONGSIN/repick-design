"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  AlertTriangle,
  Bell,
  Boxes,
  ChevronsUpDown,
  Download,
  FileBarChart2,
  LayoutGrid,
  LogOut,
  Menu,
  PieChart,
  Search,
  Settings,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import AllocationTable from "./allocation-table";
import CommandPalette from "./command-palette";
import DetailPanel from "./detail-panel";
import DonutChart from "./donut-chart";
import SupportStats from "./support-stats";
import {
  CURRENT_USER,
  PERIOD_DATA,
  PERIOD_LABEL,
  SPEND_HISTORY,
  WORKSPACES,
  categoryDeltaPct,
  largestCategory,
  periodBudget,
  periodTotal,
  topMover,
  type CategoryId,
  type PeriodId,
} from "./data";
import { Card, CardHeading, FOCUS_RING, SegmentedControl } from "./ui";

const NAV_ITEMS: { label: string; icon: LucideIcon; active: boolean }[] = [
  { label: "Overview", icon: LayoutGrid, active: false },
  { label: "Cost Explorer", icon: PieChart, active: true },
  { label: "Budgets", icon: Wallet, active: false },
  { label: "Anomalies", icon: AlertTriangle, active: false },
  { label: "Reports", icon: FileBarChart2, active: false },
];

const PERIOD_OPTIONS: { value: PeriodId; label: string }[] = [
  { value: "this-month", label: "This Month" },
  { value: "last-month", label: "Last Month" },
  { value: "quarter", label: "Quarter" },
];

function useClickOutside(ref: RefObject<HTMLElement | null>, enabled: boolean, onOutside: () => void) {
  useEffect(() => {
    if (!enabled) return undefined;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, enabled, onOutside]);
}

function BrandLockup() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400">
        <Boxes className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p
          className="truncate font-semibold text-lg text-zinc-50"
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          Outlay
        </p>
        <p className="truncate font-normal text-xs text-zinc-400">Cloud cost console</p>
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
              className={`flex h-10 w-full items-center gap-2.5 rounded-lg px-3 font-medium text-sm motion-safe:transition-colors ${FOCUS_RING} ${
                item.active ? "bg-rose-500/10 text-rose-300" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
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

export default function OutlayConsole() {
  const [period, setPeriod] = useState<PeriodId>("this-month");
  const [selectedId, setSelectedId] = useState<CategoryId>(largestCategory("this-month").id);
  const [hoveredId, setHoveredId] = useState<CategoryId | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspaceIndex, setWorkspaceIndex] = useState(0);

  const notifRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  useClickOutside(notifRef, notifOpen, () => setNotifOpen(false));
  useClickOutside(avatarRef, avatarOpen, () => setAvatarOpen(false));
  useClickOutside(workspaceRef, workspaceOpen, () => setWorkspaceOpen(false));

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handlePeriodChange(next: PeriodId) {
    setPeriod(next);
    setSelectedId(largestCategory(next).id);
  }

  const periodData = PERIOD_DATA[period];
  const categories = periodData.categories;
  const total = periodTotal(period);
  const budget = periodBudget(period);
  const largest = largestCategory(period);
  const mover = topMover(period);
  const moverDeltaPct = categoryDeltaPct(mover);
  const selectedCategory = categories.find((c) => c.id === selectedId) ?? largest;

  return (
    <div className="flex min-h-screen bg-zinc-950 font-normal text-zinc-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-zinc-950 p-4 lg:flex">
        <BrandLockup />
        <div ref={workspaceRef} className="relative mt-4">
          <button
            type="button"
            onClick={() => setWorkspaceOpen((o) => !o)}
            aria-expanded={workspaceOpen}
            aria-haspopup="listbox"
            className={`flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-white/10 px-3 font-medium text-xs text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}
          >
            <span className="truncate">{WORKSPACES[workspaceIndex]}</span>
            <ChevronsUpDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </button>
          {workspaceOpen ? (
            <ul role="listbox" aria-label="Workspaces" className="absolute left-0 top-full z-40 mt-2 w-full rounded-lg border border-white/10 bg-zinc-900 p-1 shadow-xl">
              {WORKSPACES.map((ws, i) => (
                <li key={ws} role="option" aria-selected={i === workspaceIndex}>
                  <button
                    type="button"
                    onClick={() => {
                      setWorkspaceIndex(i);
                      setWorkspaceOpen(false);
                    }}
                    className={`flex h-9 w-full items-center truncate rounded-md px-2.5 text-left font-normal text-sm text-zinc-50 hover:bg-white/5 ${FOCUS_RING}`}
                  >
                    {ws}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
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
            className={`mt-1 flex h-9 w-full items-center gap-2.5 rounded-lg px-2 font-normal text-xs text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileNavOpen(false)}
            className={`absolute inset-0 bg-zinc-950/70 ${FOCUS_RING}`}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-white/10 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <BrandLockup />
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}
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
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-50 lg:hidden ${FOCUS_RING}`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className={`flex h-11 items-center gap-2 rounded-lg border border-white/10 px-3 font-normal text-sm text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}
            >
              <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Search</span>
              <span className="hidden rounded border border-white/10 px-1.5 py-0.5 font-normal text-xs text-zinc-400 sm:inline">
                &#8984;K
              </span>
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className={`flex h-11 items-center gap-2 rounded-lg bg-rose-600 px-3 font-medium text-sm text-white hover:bg-rose-500 ${FOCUS_RING}`}
            >
              <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Export report</span>
              <span className="sr-only sm:hidden">Export report</span>
            </button>

            <div ref={notifRef} className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                aria-expanded={notifOpen}
                aria-label="Notifications"
                className={`flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}
              >
                <Bell className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>
              {notifOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-lg border border-white/10 bg-zinc-900 p-2 shadow-xl">
                  <p className="px-2 py-1 font-medium text-xs uppercase tracking-wide text-zinc-400">Notifications</p>
                  <p className="rounded-md px-2 py-2 font-normal text-sm text-zinc-50">
                    Compute spend is tracking 5.5% above last month.
                  </p>
                  <p className="rounded-md px-2 py-2 font-normal text-sm text-zinc-50">
                    Observability budget crossed 90% of its allocation.
                  </p>
                </div>
              ) : null}
            </div>

            <div ref={avatarRef} className="relative">
              <button
                type="button"
                onClick={() => setAvatarOpen((o) => !o)}
                aria-expanded={avatarOpen}
                aria-label={`${CURRENT_USER.initials}, account menu for ${CURRENT_USER.name}`}
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/10 font-medium text-xs text-zinc-50 hover:bg-white/15 ${FOCUS_RING}`}
              >
                <span aria-hidden="true">{CURRENT_USER.initials}</span>
              </button>
              {avatarOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-lg border border-white/10 bg-zinc-900 p-2 shadow-xl">
                  <p className="truncate px-2 py-1 font-medium text-sm text-zinc-50">{CURRENT_USER.name}</p>
                  <p className="truncate px-2 pb-2 font-normal text-xs text-zinc-400">{CURRENT_USER.email}</p>
                  <button
                    type="button"
                    className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-50 hover:bg-white/5 ${FOCUS_RING}`}
                  >
                    <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Settings
                  </button>
                  <button
                    type="button"
                    className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-50 hover:bg-white/5 ${FOCUS_RING}`}
                  >
                    <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {/* Main content: donut-dominant 2-column layout */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1
                className="font-semibold text-2xl text-zinc-50"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                Cost allocation
              </h1>
              <p className="mt-1 max-w-2xl font-normal text-sm text-zinc-400">
                Where cloud spend is going, broken down by service category — {PERIOD_LABEL[period].toLowerCase()}.
              </p>
            </div>
            <SegmentedControl
              ariaLabel="Period"
              value={period}
              onChange={handlePeriodChange}
              options={PERIOD_OPTIONS}
            />
          </div>

          <div className="mt-6 grid grid-cols-12 gap-4">
            <div className="col-span-12 min-w-0 lg:col-span-7">
              <Card>
                <CardHeading
                  title="Spend by category"
                  subtitle={`${PERIOD_LABEL[period]} · ${categories.length} categories · click a segment for its own detail`}
                />
                <div className="mt-5">
                  <DonutChart
                    categories={categories}
                    total={total}
                    selectedId={selectedId}
                    hoveredId={hoveredId}
                    largestId={largest.id}
                    onSelect={setSelectedId}
                    onHover={setHoveredId}
                    totalLabel={PERIOD_LABEL[period]}
                  />
                </div>
              </Card>
            </div>

            <div className="col-span-12 flex min-w-0 flex-col gap-4 lg:col-span-5">
              <SupportStats
                total={total}
                budget={budget}
                spendHistory={SPEND_HISTORY}
                mover={mover}
                moverDeltaPct={moverDeltaPct}
                comparisonLabel={periodData.comparisonLabel}
              />
              <DetailPanel
                category={selectedCategory}
                total={total}
                isLargest={selectedCategory.id === largest.id}
                comparisonLabel={periodData.comparisonLabel}
              />
            </div>

            <div className="col-span-12 min-w-0">
              <AllocationTable categories={categories} total={total} periodLabel={PERIOD_LABEL[period]} />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
