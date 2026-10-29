"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  ChevronsUpDown,
  Flag,
  FlaskConical,
  History,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Split,
  Users,
  X,
} from "lucide-react";
import CommandPalette from "./command-palette";
import ComparisonBench, { type Period } from "./comparison-bench";
import {
  BENCH_CAPACITY,
  CURRENT_USER,
  DEFAULT_BENCH_IDS,
  RUNNING_COUNT,
  SIGNIFICANT_COUNT,
  TOTAL_EXPERIMENTS,
  USERS_IN_ACTIVE_TESTS,
  WORKSPACES,
} from "./data";
import ExperimentRail from "./experiment-rail";
import ExperimentsTable from "./experiments-table";
import { formatCount } from "./format";
import NewExperimentDrawer from "./new-experiment-drawer";
import { Avatar, Card, FOCUS_RING } from "./ui";

const NAV_ITEMS = [
  { label: "Overview", icon: FlaskConical, active: true },
  { label: "Experiments", icon: Split, active: false },
  { label: "Audiences", icon: Users, active: false },
  { label: "Feature Flags", icon: Flag, active: false },
  { label: "Release Log", icon: History, active: false },
];

function BrandLockup() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime-400/15 text-lime-400">
        <FlaskConical className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-semibold text-lg leading-tight text-zinc-50 [font-family:var(--font-display-wide)]">
          Varia
        </p>
        <p className="truncate font-normal text-xs text-zinc-400">Experimentation Console</p>
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
                item.active ? "bg-lime-400/10 text-lime-400" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
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

export default function VariaConsole() {
  const [pinnedIds, setPinnedIds] = useState<string[]>(DEFAULT_BENCH_IDS);
  const [period, setPeriod] = useState<Period>("full");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [newExpOpen, setNewExpOpen] = useState(false);
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

  function togglePin(id: string) {
    setPinnedIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= BENCH_CAPACITY) return [...prev.slice(1), id];
      return [...prev, id];
    });
  }

  function unpin(id: string) {
    setPinnedIds((prev) => prev.filter((p) => p !== id));
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 font-normal text-zinc-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-lime-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950"
      >
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-zinc-950 p-4 lg:flex">
        <BrandLockup />
        <button
          type="button"
          onClick={() => setWorkspaceIndex((i) => (i + 1) % WORKSPACES.length)}
          className={`mt-4 flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-white/10 px-3 font-medium text-xs text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}
        >
          <span className="truncate">{WORKSPACES[workspaceIndex]}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </button>
        <nav aria-label="Primary" className="mt-6 flex-1">
          <NavList />
        </nav>
        <div className="border-t border-white/10 pt-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <Avatar initials={CURRENT_USER.initials} className="h-8 w-8 text-xs" />
            <div className="min-w-0">
              <p className="truncate font-medium text-sm text-zinc-50">{CURRENT_USER.name}</p>
              <p className="truncate font-normal text-xs text-zinc-400">{CURRENT_USER.email}</p>
            </div>
          </div>
          <button type="button" className={`mt-1 flex h-9 w-full items-center gap-2.5 rounded-lg px-2 font-normal text-xs text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}>
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div aria-hidden="true" onClick={() => setMobileNavOpen(false)} className="absolute inset-0 bg-zinc-950/70" />
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
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className={`flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-50 lg:hidden ${FOCUS_RING}`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className={`flex h-11 items-center gap-2 rounded-lg border border-white/10 px-3 font-normal text-sm text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Search experiments</span>
              <span className="rounded border border-white/10 px-1.5 py-0.5 font-normal text-xs text-zinc-400">&#8984;K</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setNewExpOpen(true)}
              className={`flex h-11 items-center gap-2 rounded-lg bg-lime-400 px-3 font-medium text-sm text-zinc-950 hover:bg-lime-300 ${FOCUS_RING}`}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">New experiment</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                aria-expanded={notifOpen}
                aria-label="Notifications"
                className={`flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-50 ${FOCUS_RING}`}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
              </button>
              {notifOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-lg border border-white/10 bg-zinc-900 p-2 shadow-xl">
                  <p className="px-2 py-1 font-medium text-xs text-zinc-400">Notifications</p>
                  <p className="rounded-md px-2 py-2 font-normal text-sm text-zinc-50">
                    &quot;Empty-state illustration swap&quot; crossed 99% confidence and shipped to 100% of users.
                  </p>
                  <p className="rounded-md px-2 py-2 font-normal text-sm text-zinc-50">
                    &quot;In-app upgrade nudge timing&quot; was paused — the interval still straddles zero at 54% confidence.
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
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/10 font-medium text-xs text-zinc-50 hover:bg-white/15 ${FOCUS_RING}`}
              >
                <span aria-hidden="true">{CURRENT_USER.initials}</span>
              </button>
              {avatarMenuOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-lg border border-white/10 bg-zinc-900 p-2 shadow-xl">
                  <p className="truncate px-2 py-1 font-medium text-sm text-zinc-50">{CURRENT_USER.name}</p>
                  <p className="truncate px-2 pb-2 font-normal text-xs text-zinc-400">{CURRENT_USER.email}</p>
                  <button type="button" className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-50 hover:bg-white/5 ${FOCUS_RING}`}>
                    <Settings className="h-4 w-4" aria-hidden="true" />
                    Settings
                  </button>
                  <button type="button" className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-50 hover:bg-white/5 ${FOCUS_RING}`}>
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
          <h1 className="font-semibold text-2xl text-zinc-50 [font-family:var(--font-display-wide)]">Experiment Comparison Lab</h1>
          <p className="mt-1 max-w-2xl font-normal text-sm text-zinc-400">
            Pin any {BENCH_CAPACITY} experiments to compare their lift, confidence interval, and secondary metrics side by
            side — no single experiment ever hides behind a separate detail view.
          </p>
          <p className="mt-2 font-normal text-sm text-zinc-400">
            <span className="font-medium tabular-nums text-zinc-50">{RUNNING_COUNT}</span> of {TOTAL_EXPERIMENTS} experiments
            running · <span className="font-medium tabular-nums text-zinc-50">{SIGNIFICANT_COUNT}</span> have reached a
            significant result ·{" "}
            <span className="font-medium tabular-nums text-zinc-50">{formatCount(USERS_IN_ACTIVE_TESTS)}</span> users in
            active tests
          </p>

          <div className="mt-6 grid grid-cols-12 gap-4 md:gap-6">
            <Card className="col-span-12 min-w-0 p-4 sm:p-6" as="section" aria-labelledby="bench-heading">
              <h2 id="bench-heading" className="font-semibold text-sm text-zinc-50">
                Comparison bench
              </h2>
              <div className="mt-3">
                <ComparisonBench pinnedIds={pinnedIds} onUnpin={unpin} period={period} onPeriodChange={setPeriod} />
              </div>
            </Card>

            <Card className="col-span-12 min-w-0 p-4 sm:p-6" as="section" aria-labelledby="rail-heading">
              <h2 id="rail-heading" className="font-semibold text-sm text-zinc-50">
                Every experiment
              </h2>
              <p className="mt-0.5 font-normal text-xs text-zinc-400">
                Hover or focus a chip for a quick preview — pinned chips skip the preview since their full card is already
                on the bench above.
              </p>
              <div className="mt-3">
                <ExperimentRail pinnedIds={pinnedIds} onTogglePin={togglePin} />
              </div>
            </Card>

            <Card className="col-span-12 min-w-0 p-4 sm:p-6" as="section" aria-labelledby="table-heading">
              <h2 id="table-heading" className="sr-only">
                Experiment log
              </h2>
              <ExperimentsTable pinnedIds={pinnedIds} />
            </Card>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} pinnedIds={pinnedIds} onTogglePin={togglePin} />
      <NewExperimentDrawer open={newExpOpen} onClose={() => setNewExpOpen(false)} />
    </div>
  );
}
