"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  ChevronsUpDown,
  FileBarChart2,
  Gauge,
  Headset,
  LogOut,
  Menu,
  RotateCcw,
  Search,
  Settings,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import CapacityChart from "./capacity-chart";
import CommandPalette from "./command-palette";
import ControlPanel from "./control-panel";
import { formatInt, formatPercent, formatSignedInt, formatWeekRange } from "./format";
import { DEFAULT_INPUTS, type SimInputs, computeProjection, peakWeekIndex } from "./sim";
import { Avatar, Card, FOCUS_RING, GapIndicator } from "./ui";
import WeekTable from "./week-table";

const CURRENT_USER = { name: "Priya Narayanan", email: "priya.narayanan@shiftcast.io", initials: "PN" };
const WORKSPACES = ["NA Support Org", "EMEA Support Org", "APAC Support Org"];

const NAV_ITEMS = [
  { label: "Overview", icon: Gauge, active: true },
  { label: "Scenarios", icon: SlidersHorizontal, active: false },
  { label: "Staffing", icon: Users, active: false },
  { label: "Reports", icon: FileBarChart2, active: false },
];

function BrandLockup() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-700 text-white">
        <Headset className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-semibold text-lg leading-tight text-zinc-900 [font-family:var(--font-display-mono)]">Shiftcast</p>
        <p className="truncate font-normal text-xs text-zinc-600">Capacity Planner</p>
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
                item.active ? "bg-green-50 text-green-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
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

export default function ShiftcastCapacityPlanner() {
  const [inputs, setInputs] = useState<SimInputs>(DEFAULT_INPUTS);
  const [pinnedWeek, setPinnedWeek] = useState<number>(() => peakWeekIndex(computeProjection(DEFAULT_INPUTS)));
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [workspaceIndex, setWorkspaceIndex] = useState(0);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const rows = computeProjection(inputs);
  // Derived, never stored: if the horizon just shrank, these fall back to the last valid index
  // without any extra render-cycle state sync — growing the horizon back simply restores the
  // original pin/hover, since the raw state was never overwritten.
  const effectivePinnedWeek = Math.min(pinnedWeek, rows.length - 1);
  const effectiveHoveredWeek = hoveredWeek !== null && hoveredWeek < rows.length ? hoveredWeek : null;

  const peakIdx = peakWeekIndex(rows);
  const peakRow = rows[peakIdx];
  const breachCount = rows.filter((r) => r.breach).length;
  const avgAttainment = Math.round(rows.reduce((sum, r) => sum + r.attainmentPct, 0) / rows.length);

  function resetScenario() {
    setInputs(DEFAULT_INPUTS);
    setPinnedWeek(peakWeekIndex(computeProjection(DEFAULT_INPUTS)));
    setHoveredWeek(null);
  }

  return (
    <div className="flex min-h-screen bg-white font-normal text-zinc-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-green-700 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 p-4 lg:flex">
        <BrandLockup />
        <button
          type="button"
          onClick={() => setWorkspaceIndex((i) => (i + 1) % WORKSPACES.length)}
          className={`mt-4 flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 font-medium text-xs text-zinc-700 hover:text-zinc-900 ${FOCUS_RING}`}
        >
          <span className="truncate">{WORKSPACES[workspaceIndex]}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </button>
        <nav aria-label="Primary" className="mt-6 flex-1">
          <NavList />
        </nav>
        <div className="border-t border-zinc-200 pt-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <Avatar initials={CURRENT_USER.initials} className="h-8 w-8 text-xs" />
            <div className="min-w-0">
              <p className="truncate font-medium text-sm text-zinc-900">{CURRENT_USER.name}</p>
              <p className="truncate font-normal text-xs text-zinc-600">{CURRENT_USER.email}</p>
            </div>
          </div>
          <button type="button" className={`mt-1 flex h-9 w-full items-center gap-2.5 rounded-lg px-2 font-normal text-xs text-zinc-600 hover:text-zinc-900 ${FOCUS_RING}`}>
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div aria-hidden="true" onClick={() => setMobileNavOpen(false)} className="absolute inset-0 bg-zinc-900/40" />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <BrandLockup />
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:text-zinc-900 ${FOCUS_RING}`}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Primary" className="mt-6 flex-1">
              <NavList onNavigate={() => setMobileNavOpen(false)} />
            </nav>
            <div className="border-t border-zinc-200 pt-3">
              <p className="truncate px-2 font-medium text-sm text-zinc-900">{CURRENT_USER.name}</p>
              <p className="truncate px-2 font-normal text-xs text-zinc-600">{CURRENT_USER.email}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-20 items-center justify-between gap-3 border-b border-zinc-200 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className={`flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:text-zinc-900 lg:hidden ${FOCUS_RING}`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className={`flex h-11 items-center gap-2 rounded-lg border border-zinc-200 px-3 font-normal text-sm text-zinc-700 hover:text-zinc-900 ${FOCUS_RING}`}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Search</span>
              <span className="rounded border border-zinc-200 px-1.5 py-0.5 font-normal text-xs text-zinc-600">&#8984;K</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetScenario}
              className={`flex h-11 items-center gap-2 rounded-lg bg-green-700 px-3 font-medium text-sm text-white hover:bg-green-800 ${FOCUS_RING}`}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">New scenario</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                aria-expanded={notifOpen}
                aria-label="Notifications"
                className={`flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:text-zinc-900 ${FOCUS_RING}`}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
              </button>
              {notifOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-lg border border-zinc-200 bg-white p-2 shadow-xl">
                  <p className="px-2 py-1 font-medium text-xs text-zinc-600">Notifications</p>
                  <p className="rounded-md px-2 py-2 font-normal text-sm text-zinc-900">
                    Week of {formatWeekRange(peakIdx)} now projects an SLA breach at current staffing.
                  </p>
                  <p className="rounded-md px-2 py-2 font-normal text-sm text-zinc-900">
                    The &ldquo;Recommended hiring&rdquo; preset would close most of this horizon&rsquo;s breach weeks.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setAvatarMenuOpen((o) => !o)}
                aria-expanded={avatarMenuOpen}
                aria-label={`${CURRENT_USER.initials}, account menu for ${CURRENT_USER.name}`}
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-green-100 font-medium text-xs text-green-700 hover:bg-green-200 ${FOCUS_RING}`}
              >
                <span aria-hidden="true">{CURRENT_USER.initials}</span>
              </button>
              {avatarMenuOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-lg border border-zinc-200 bg-white p-2 shadow-xl">
                  <p className="truncate px-2 py-1 font-medium text-sm text-zinc-900">{CURRENT_USER.name}</p>
                  <p className="truncate px-2 pb-2 font-normal text-xs text-zinc-600">{CURRENT_USER.email}</p>
                  <button type="button" className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-900 hover:bg-zinc-50 ${FOCUS_RING}`}>
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    Settings
                  </button>
                  <button type="button" className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-900 hover:bg-zinc-50 ${FOCUS_RING}`}>
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main id="main-content" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <h1 className="font-semibold text-2xl text-zinc-900 [font-family:var(--font-display-mono)]">Capacity planner</h1>
          <p className="mt-1 max-w-2xl font-normal text-sm text-zinc-600">
            A live what-if simulator for support staffing: tune volume, handle time, shrinkage and hiring on the left, and watch the
            {" "}{inputs.horizon}-week demand-versus-capacity projection recompute instantly on the right.
          </p>

          <div className="mt-6 grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 min-w-0 lg:col-span-4 lg:sticky lg:top-6 lg:self-start">
              <Card as="section" aria-labelledby="controls-heading">
                <ControlPanel inputs={inputs} onChange={setInputs} />
              </Card>
            </div>

            <div className="col-span-12 flex min-w-0 flex-col gap-4 lg:col-span-8 md:gap-6">
              <Card as="section" aria-labelledby="hero-heading" className="min-w-0 p-4 sm:p-6">
                <h2 id="hero-heading" className="font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-600">
                  Staffing outlook
                </h2>
                <div className="mt-2 flex flex-wrap items-end gap-3">
                  <p className="font-semibold text-5xl tabular-nums text-zinc-900 [font-family:var(--font-display-mono)] sm:text-6xl">
                    {formatInt(peakRow.requiredHeadcount)}
                  </p>
                  <p className="pb-1.5 font-normal text-sm text-zinc-600">
                    agents required in the busiest week — {formatWeekRange(peakIdx)}
                  </p>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-4 border-t border-zinc-100 pt-4 sm:grid-cols-3">
                  <div>
                    <p className="font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-600">Breach weeks</p>
                    <p className="mt-1 font-semibold text-lg tabular-nums text-zinc-900">
                      {breachCount} <span className="font-normal text-sm text-zinc-600">of {rows.length}</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-600">Avg. attainment</p>
                    <p className="mt-1 font-semibold text-lg tabular-nums text-zinc-900">{formatPercent(avgAttainment)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-600">Peak-week gap</p>
                    <p className={`mt-1 flex items-center gap-1 font-semibold text-lg tabular-nums ${peakRow.gap >= 0 ? "text-green-700" : "text-red-700"}`}>
                      <GapIndicator gap={peakRow.gap} className="h-4 w-4" />
                      {formatSignedInt(peakRow.gap)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card as="section" aria-labelledby="chart-heading" className="min-w-0 p-4 sm:p-6">
                <h2 id="chart-heading" className="font-semibold text-sm text-zinc-900">
                  Demand vs. scheduled capacity
                </h2>
                <p className="mt-0.5 font-normal text-xs text-zinc-600">
                  Click any week to pin it (expands below) or hover/focus one to preview it without changing the pin.
                </p>
                <div className="mt-4">
                  <CapacityChart
                    rows={rows}
                    pinnedWeek={effectivePinnedWeek}
                    hoveredWeek={effectiveHoveredWeek}
                    onHoverWeek={setHoveredWeek}
                    onPinWeek={setPinnedWeek}
                  />
                </div>
              </Card>

              <Card as="section" aria-labelledby="table-heading" className="min-w-0 p-4 sm:p-6">
                <h2 id="table-heading" className="font-semibold text-sm text-zinc-900">
                  {rows.length}-week staffing plan
                </h2>
                <div className="mt-3">
                  <WeekTable rows={rows} pinnedWeek={effectivePinnedWeek} onPinWeek={setPinnedWeek} onHoverWeek={setHoveredWeek} />
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        inputs={inputs}
        onJumpToWeek={(index) => {
          setPinnedWeek(index);
          setHoveredWeek(null);
        }}
        onApplyPreset={(preset) => setInputs(preset.inputs)}
      />
    </div>
  );
}
