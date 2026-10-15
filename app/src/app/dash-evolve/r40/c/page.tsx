"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronsUpDown,
  GitBranch,
  Inbox,
  LayoutGrid,
  LogOut,
  Menu,
  Phone,
  Plug,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Timer,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import CommandPalette from "./command-palette";
import KpiTile from "./kpi-tile";
import PathSummaryTable from "./path-summary-table";
import ProcessMap from "./process-map";
import RecentIncidentsTable from "./recent-incidents-table";
import SelectedStepDetail from "./selected-step-detail";
import SlaCard from "./sla-card";
import TrendCard from "./trend-card";
import {
  CURRENT_USER,
  EDGE_STATS,
  NODE_CURRENT,
  PERIOD_LABEL,
  WORKSPACES,
  type PeriodId,
  type SelectedTarget,
} from "./data";

const focusRing =
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400";

const NAV_ITEMS: { label: string; icon: LucideIcon; active: boolean }[] = [
  { label: "Overview", icon: LayoutGrid, active: true },
  { label: "Incidents", icon: AlertTriangle, active: false },
  { label: "On-call", icon: Phone, active: false },
  { label: "Runbooks", icon: GitBranch, active: false },
  { label: "Integrations", icon: Plug, active: false },
];

function mainPathAvgHours(period: PeriodId): number {
  const stats = EDGE_STATS[period];
  const ids = ["detected-triaged", "triaged-investigating", "investigating-mitigating", "mitigating-resolved"];
  return ids.reduce((sum, id) => sum + (stats.find((s) => s.id === id)?.avgWaitHours ?? 0), 0);
}

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
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-400">
        <Workflow className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-semibold text-lg text-zinc-50">Tracewell</p>
        <p className="truncate font-normal text-xs text-zinc-400">Incident flow console</p>
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
              className={`flex h-10 w-full items-center gap-2.5 rounded-lg px-3 font-medium text-sm motion-safe:transition-colors ${focusRing} ${
                item.active ? "bg-cyan-400/10 text-cyan-300" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
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

export default function TracewellConsole() {
  const [period, setPeriod] = useState<PeriodId>("30d");
  const [selected, setSelected] = useState<SelectedTarget | null>(null);
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

  const openIncidents =
    NODE_CURRENT.detected +
    NODE_CURRENT.triaged +
    NODE_CURRENT.investigating +
    NODE_CURRENT.escalated +
    NODE_CURRENT.mitigating +
    NODE_CURRENT.reopened;

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
            className={`flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-white/10 px-3 font-medium text-xs text-zinc-400 hover:text-zinc-50 ${focusRing}`}
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
                    className={`flex h-9 w-full items-center truncate rounded-md px-2.5 text-left font-normal text-sm text-zinc-50 hover:bg-white/5 ${focusRing}`}
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
            className={`mt-1 flex h-9 w-full items-center gap-2.5 rounded-lg px-2 font-normal text-xs text-zinc-400 hover:text-zinc-50 ${focusRing}`}
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
            className={`absolute inset-0 bg-zinc-950/70 ${focusRing}`}
          />
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
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-50 lg:hidden ${focusRing}`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className={`flex h-11 items-center gap-2 rounded-lg border border-white/10 px-3 font-normal text-sm text-zinc-400 hover:text-zinc-50 ${focusRing}`}
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
              className={`flex h-11 items-center gap-2 rounded-lg bg-cyan-500 px-3 font-medium text-sm text-zinc-950 hover:bg-cyan-400 ${focusRing}`}
            >
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              New incident
            </button>

            <div ref={notifRef} className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                aria-expanded={notifOpen}
                aria-label="Notifications"
                className={`flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-50 ${focusRing}`}
              >
                <Bell className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>
              {notifOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-lg border border-white/10 bg-zinc-900 p-2 shadow-xl">
                  <p className="px-2 py-1 font-medium text-xs text-zinc-400 uppercase tracking-wide">Notifications</p>
                  <p className="rounded-md px-2 py-2 font-normal text-sm text-zinc-50">
                    INC-4819 has been in Escalated for over 12 hours.
                  </p>
                  <p className="rounded-md px-2 py-2 font-normal text-sm text-zinc-50">
                    INC-4793 was reopened by the customer.
                  </p>
                </div>
              ) : null}
            </div>

            <div ref={avatarRef} className="relative">
              <button
                type="button"
                onClick={() => setAvatarOpen((o) => !o)}
                aria-expanded={avatarOpen}
                aria-label={`Account menu for ${CURRENT_USER.name}`}
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/10 font-medium text-xs text-zinc-50 hover:bg-white/15 ${focusRing}`}
              >
                <span aria-hidden="true">{CURRENT_USER.initials}</span>
              </button>
              {avatarOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-lg border border-white/10 bg-zinc-900 p-2 shadow-xl">
                  <p className="truncate px-2 py-1 font-medium text-sm text-zinc-50">{CURRENT_USER.name}</p>
                  <p className="truncate px-2 pb-2 font-normal text-xs text-zinc-400">{CURRENT_USER.email}</p>
                  <button
                    type="button"
                    className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-50 hover:bg-white/5 ${focusRing}`}
                  >
                    <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Settings
                  </button>
                  <button
                    type="button"
                    className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-50 hover:bg-white/5 ${focusRing}`}
                  >
                    <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {/* Main content: rail-free dense bento grid */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-semibold text-2xl text-zinc-50">Process console</h1>
              <p className="mt-1 max-w-2xl font-normal text-sm text-zinc-400">
                How tickets actually move through resolution, with every count and transition volume shown plainly —
                {" "}
                {PERIOD_LABEL[period].toLowerCase()}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className={`flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 font-medium text-xs text-zinc-400 hover:text-zinc-50 ${focusRing}`}
            >
              <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Clear selection
            </button>
          </div>

          <div className="mt-6 grid grid-cols-12 gap-4">
            <div className="col-span-12 min-w-0">
              <ProcessMap period={period} onPeriodChange={setPeriod} selected={selected} onSelect={setSelected} />
            </div>

            <div className="col-span-12 min-w-0 lg:col-span-7">
              <PathSummaryTable period={period} />
            </div>
            <div className="col-span-12 min-w-0 lg:col-span-5">
              <SelectedStepDetail selected={selected} period={period} />
            </div>

            <div className="col-span-6 min-w-0 lg:col-span-3">
              <KpiTile
                icon={Inbox}
                label="Open incidents"
                value={String(openIncidents)}
                delta="+6 vs yesterday"
                direction="up"
              />
            </div>
            <div className="col-span-6 min-w-0 lg:col-span-3">
              <KpiTile
                icon={CheckCircle2}
                label="Resolved (24h)"
                value={String(NODE_CURRENT.resolved)}
                delta="+4 vs yesterday"
                direction="up"
              />
            </div>
            <div className="col-span-6 min-w-0 lg:col-span-3">
              <KpiTile
                icon={Timer}
                label="Median resolve time"
                value={`${mainPathAvgHours(period).toFixed(1)}h`}
                delta={`Main path, ${PERIOD_LABEL[period].toLowerCase()}`}
                direction="flat"
              />
            </div>
            <div className="col-span-6 min-w-0 lg:col-span-3">
              <KpiTile
                icon={AlertTriangle}
                label="Reopened now"
                value={String(NODE_CURRENT.reopened)}
                delta="steady vs yesterday"
                direction="flat"
              />
            </div>

            <div className="col-span-12 min-w-0 lg:col-span-8">
              <RecentIncidentsTable />
            </div>
            <div className="col-span-12 flex min-w-0 flex-col gap-4 lg:col-span-4">
              <TrendCard />
              <SlaCard />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
