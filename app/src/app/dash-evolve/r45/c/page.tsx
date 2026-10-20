"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  ChevronsUpDown,
  FileBarChart2,
  Gauge,
  Inbox,
  LogOut,
  Menu,
  Plus,
  Route,
  Search,
  Settings,
  Users,
  Workflow,
  X,
} from "lucide-react";
import AdjacencyTable from "./adjacency-table";
import ChordDiagram from "./chord-diagram";
import CommandPalette from "./command-palette";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  CURRENT_USER,
  DEFAULT_PERIOD,
  DEPARTMENTS,
  FEED_EVENTS,
  FLOWS_BY_PERIOD,
  NAV_SECTIONS,
  PERIODS,
  SLA_ALERTS,
  TREND_PRIOR,
  WORKSPACES,
  busiestPair,
  grandTotal,
  type NavIconName,
  type Period,
} from "./data";
import { formatCount, formatShare } from "./format";
import NewRuleDrawer from "./new-rule-drawer";
import RoutingFeed from "./routing-feed";
import { Avatar, Card, FOCUS_RING, SegmentedControl, Sparkline } from "./ui";

const NAV_ICONS: Record<NavIconName, typeof Gauge> = { Gauge, Route, Inbox, Users, FileBarChart2 };

function BrandLockup() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
        <Workflow className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-lg leading-tight text-zinc-900" style={{ fontFamily: "var(--font-display-grotesk)" }}>
          {BRAND_NAME}
        </p>
        <p className="truncate font-normal text-xs text-zinc-500">{BRAND_TAGLINE}</p>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      {NAV_SECTIONS.map((item) => {
        const Icon = NAV_ICONS[item.icon];
        return (
          <li key={item.label}>
            <button
              type="button"
              aria-current={item.active ? "page" : undefined}
              onClick={onNavigate}
              className={`flex h-10 w-full items-center gap-2.5 rounded-lg px-3 font-medium text-sm motion-safe:transition-colors ${FOCUS_RING} ${
                item.active ? "bg-rose-50 text-rose-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
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

function KpiCard({ label, value, subtext, trend }: { label: string; value: string; subtext: string; trend?: number[] }) {
  return (
    <Card className="col-span-12 min-w-0 p-4 sm:col-span-6 xl:col-span-3">
      <p className="font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">{label}</p>
      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <p className="truncate tabular-nums text-xl text-zinc-900">{value}</p>
        {trend ? <Sparkline values={trend} className="shrink-0" /> : null}
      </div>
      <p className="mt-0.5 truncate font-normal text-xs text-zinc-500">{subtext}</p>
    </Card>
  );
}

export default function SwitchboardConsole() {
  const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [newRuleOpen, setNewRuleOpen] = useState(false);
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

  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? period;
  const flows = FLOWS_BY_PERIOD[period];
  const grand = grandTotal(flows);
  const busiest = busiestPair(flows);
  const busiestDeptA = DEPARTMENTS.find((d) => d.id === busiest.a);
  const busiestDeptB = DEPARTMENTS.find((d) => d.id === busiest.b);
  const urgentCount = FEED_EVENTS.filter((e) => e.priority === "urgent").length;
  const trend = [...TREND_PRIOR[period], grand];

  return (
    <div className="flex min-h-screen bg-zinc-50 font-normal text-zinc-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-rose-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-white p-4 lg:flex">
        <BrandLockup />
        <button
          type="button"
          onClick={() => setWorkspaceIndex((i) => (i + 1) % WORKSPACES.length)}
          className={`mt-4 flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-zinc-200 px-3 font-medium text-xs text-zinc-600 hover:text-zinc-900 ${FOCUS_RING}`}
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
              <p className="truncate font-normal text-xs text-zinc-500">{CURRENT_USER.email}</p>
            </div>
          </div>
          <button type="button" className={`mt-1 flex h-9 w-full items-center gap-2.5 rounded-lg px-2 font-normal text-xs text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}>
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div aria-hidden="true" onClick={() => setMobileNavOpen(false)} className="absolute inset-0 bg-zinc-900/30" />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-zinc-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <BrandLockup />
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Primary" className="mt-6 flex-1">
              <NavList onNavigate={() => setMobileNavOpen(false)} />
            </nav>
            <div className="border-t border-zinc-200 pt-3">
              <p className="truncate px-2 font-medium text-sm text-zinc-900">{CURRENT_USER.name}</p>
              <p className="truncate px-2 font-normal text-xs text-zinc-500">{CURRENT_USER.email}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-20 items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 lg:hidden ${FOCUS_RING}`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className={`flex h-11 items-center gap-2 rounded-lg border border-zinc-200 px-3 font-normal text-sm text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
            >
              <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Search departments or run a command</span>
              <span className="hidden rounded border border-zinc-200 px-1.5 py-0.5 font-normal text-xs text-zinc-500 sm:inline">&#8984;K</span>
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setNewRuleOpen(true)}
              className={`flex h-11 items-center gap-2 rounded-lg bg-rose-600 px-3 font-medium text-sm text-white hover:bg-rose-700 ${FOCUS_RING}`}
            >
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">New routing rule</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                aria-expanded={notifOpen}
                className={`flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
              >
                <Bell className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="sr-only">Notifications</span>
              </button>
              {notifOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-lg border border-zinc-200 bg-white p-2 shadow-xl">
                  <p className="px-2 py-1 font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">SLA risk</p>
                  {SLA_ALERTS.map((alert) => (
                    <p key={alert.id} className="rounded-md px-2 py-2 font-normal text-sm text-zinc-700">
                      {alert.message}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setAvatarMenuOpen((o) => !o)}
                aria-expanded={avatarMenuOpen}
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 font-medium text-xs text-zinc-700 hover:bg-zinc-200 ${FOCUS_RING}`}
              >
                <span aria-hidden="true">{CURRENT_USER.initials}</span>
                <span className="sr-only">Account menu for {CURRENT_USER.name}</span>
              </button>
              {avatarMenuOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-lg border border-zinc-200 bg-white p-2 shadow-xl">
                  <p className="truncate px-2 py-1 font-medium text-sm text-zinc-900">{CURRENT_USER.name}</p>
                  <p className="truncate px-2 pb-2 font-normal text-xs text-zinc-500">{CURRENT_USER.email}</p>
                  <button
                    type="button"
                    onClick={() => setAvatarMenuOpen(false)}
                    className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
                  >
                    <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => setAvatarMenuOpen(false)}
                    className={`flex h-9 w-full items-center gap-2.5 rounded-md px-2 font-normal text-sm text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
                  >
                    <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main id="main-content" className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-semibold text-2xl text-zinc-900" style={{ fontFamily: "var(--font-display-grotesk)" }}>
                Routing overview
              </h1>
              <p className="mt-1 max-w-2xl font-normal text-sm text-zinc-600">
                Live handoffs across six departments. The routing map&apos;s busiest pair and every department&apos;s totals stay on screen by
                default &mdash; nothing below is hover-only.
              </p>
            </div>
            <SegmentedControl<Period> label="Reporting period" options={PERIODS.map((p) => ({ value: p.value, label: p.label }))} value={period} onChange={setPeriod} />
          </div>

          <div className="mt-6 grid grid-cols-12 gap-4 md:gap-6">
            <KpiCard label="Total handoffs" value={formatCount(grand)} subtext={`${periodLabel} · 6-period trend`} trend={trend} />
            <KpiCard label="Departments routing" value={formatCount(DEPARTMENTS.length)} subtext="active this period" />
            <KpiCard
              label="Busiest pair share"
              value={formatShare(busiest.combined, grand)}
              subtext={busiestDeptA && busiestDeptB ? `${busiestDeptA.short} ↔ ${busiestDeptB.short}` : ""}
            />
            <KpiCard label="Urgent in queue" value={formatCount(urgentCount)} subtext="needs routing review" />

            <Card className="col-span-12 min-w-0 p-4 sm:p-6 lg:col-span-7" as="section" aria-labelledby="feed-heading">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="feed-heading" className="font-semibold text-sm text-zinc-900">
                  Routing feed
                </h2>
                <span className="font-normal text-xs text-zinc-500">Most recent first</span>
              </div>
              <div className="mt-3">
                <RoutingFeed />
              </div>
            </Card>

            <Card className="col-span-12 min-w-0 p-4 sm:p-6 lg:col-span-5 lg:sticky lg:top-6 lg:self-start" as="section" aria-labelledby="chord-heading">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="chord-heading" className="font-semibold text-sm text-zinc-900">
                  Department routing map
                </h2>
                <span className="font-normal text-xs text-zinc-500">{periodLabel}</span>
              </div>
              <div className="mt-3">
                <ChordDiagram period={period} />
              </div>
            </Card>

            <Card className="col-span-12 min-w-0 p-4 sm:p-6" as="section" aria-labelledby="matrix-heading">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="matrix-heading" className="font-semibold text-sm text-zinc-900">
                  Full handoff matrix
                </h2>
                <span className="font-normal text-xs text-zinc-500">Accessible data view &mdash; sortable, same data as the map above</span>
              </div>
              <div className="mt-3">
                <AdjacencyTable period={period} />
              </div>
            </Card>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSetPeriod={setPeriod} onOpenNewRule={() => setNewRuleOpen(true)} />
      <NewRuleDrawer open={newRuleOpen} onClose={() => setNewRuleOpen(false)} />
    </div>
  );
}
