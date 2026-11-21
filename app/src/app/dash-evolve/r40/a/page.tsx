"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertOctagon,
  Bell,
  ChevronsUpDown,
  Download,
  Gauge,
  Hexagon,
  History,
  LogOut,
  Menu,
  Settings,
  Search,
  MapPinned,
  X,
} from "lucide-react";
import CommandPalette from "./command-palette";
import HexMap from "./hex-map";
import IncidentFeed from "./incident-feed";
import RegionTable from "./region-table";
import {
  ACTIVE_INCIDENTS,
  AVG_LATENCY_MS,
  AVG_UPTIME_PCT,
  CURRENT_USER,
  FEED,
  LATENCY_TREND_MS,
  MOST_SEVERE_REGION_ID,
  REGIONS,
  REGIONS_AT_RISK,
  TOTAL_REGIONS,
  regionById,
} from "./data";
import { formatMs, formatPercent } from "./format";
import { Avatar, Card, FOCUS_RING, ProgressBar, Sparkline } from "./ui";

const NAV_ITEMS = [
  { label: "Network Map", icon: Hexagon, active: true },
  { label: "Incidents", icon: AlertOctagon, active: false },
  { label: "Latency", icon: Gauge, active: false },
  { label: "Audit Log", icon: History, active: false },
];

const WORKSPACES = ["Isobar — Production", "Isobar — Staging"];

function BrandLockup() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-400/15 text-green-400">
        <Hexagon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-semibold text-lg leading-tight text-zinc-50 [font-family:var(--font-display-mono)]">
          Isobar
        </p>
        <p className="truncate font-normal text-xs text-zinc-400">Edge Network Console</p>
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
                item.active ? "bg-green-400/10 text-green-400" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50"
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

export default function IsobarConsole() {
  const [pinnedRegionId, setPinnedRegionId] = useState(MOST_SEVERE_REGION_ID);
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

  const pinnedRegion = regionById(pinnedRegionId) ?? REGIONS[0]!;

  const kpis = [
    {
      label: "Global Uptime",
      value: formatPercent(AVG_UPTIME_PCT),
      icon: Activity,
      accent: "text-green-400",
      trail: <ProgressBar pct={AVG_UPTIME_PCT} className="mt-2" />,
    },
    {
      label: "Active Incidents",
      value: String(ACTIVE_INCIDENTS),
      icon: AlertOctagon,
      accent: ACTIVE_INCIDENTS > 0 ? "text-red-400" : "text-green-400",
      trail: <p className="mt-2 text-xs text-zinc-400">Across {REGIONS_AT_RISK} regions</p>,
    },
    {
      label: "Regions at Risk",
      value: `${REGIONS_AT_RISK} / ${TOTAL_REGIONS}`,
      icon: MapPinned,
      accent: REGIONS_AT_RISK > 0 ? "text-amber-400" : "text-green-400",
      trail: <p className="mt-2 text-xs text-zinc-400">Degraded or critical</p>,
    },
    {
      label: "Avg Edge Latency",
      value: formatMs(AVG_LATENCY_MS),
      icon: Gauge,
      accent: "text-zinc-50",
      trail: <Sparkline values={LATENCY_TREND_MS} className="mt-2" stroke="stroke-zinc-400" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 font-normal text-zinc-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-green-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-950"
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
          <div
            aria-hidden="true"
            onClick={() => setMobileNavOpen(false)}
            className="absolute inset-0 bg-zinc-950/70"
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
              <span className="sr-only sm:not-sr-only">Search regions</span>
              <span className="rounded border border-white/10 px-1.5 py-0.5 font-normal text-xs text-zinc-400">&#8984;K</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`flex h-11 items-center gap-2 rounded-lg bg-green-500 px-3 font-medium text-sm text-zinc-950 hover:bg-green-400 ${FOCUS_RING}`}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Export Report</span>
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
                    Singapore (SIN) now has 2 ongoing incidents — error rate and a BGP route flap.
                  </p>
                  <p className="rounded-md px-2 py-2 font-normal text-sm text-zinc-50">
                    Frankfurt (FRA) origin shield latency crossed the alert threshold 1h 8m ago.
                  </p>
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setAvatarMenuOpen((o) => !o)}
                aria-expanded={avatarMenuOpen}
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/10 font-medium text-xs text-zinc-50 hover:bg-white/15 ${FOCUS_RING}`}
              >
                <span aria-hidden="true">{CURRENT_USER.initials}</span>
                <span className="sr-only">Account menu for {CURRENT_USER.name}</span>
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
          <h1 className="font-semibold text-2xl text-zinc-50">Edge Network Overview</h1>
          <p className="mt-1 max-w-2xl font-normal text-sm text-zinc-400">
            Sixteen points of presence, live incident feed, and per-region health at a glance. Pinned region:{" "}
            <span className="font-medium text-zinc-50">{pinnedRegion.name}</span>.
          </p>

          <div className="mt-6 grid grid-cols-12 gap-4 md:gap-6">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <Card key={kpi.label} className="col-span-12 min-w-0 p-4 sm:col-span-6 lg:col-span-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-[11px] uppercase tracking-[0.04em] text-zinc-400">{kpi.label}</p>
                    <Icon className={`h-4 w-4 shrink-0 ${kpi.accent}`} aria-hidden="true" />
                  </div>
                  <p className="mt-2 font-semibold text-2xl tabular-nums text-zinc-50">{kpi.value}</p>
                  {kpi.trail}
                </Card>
              );
            })}

            <Card className="col-span-12 min-w-0 p-4 sm:p-5 lg:col-span-7" as="section" aria-labelledby="feed-heading">
              <h2 id="feed-heading" className="font-semibold text-sm text-zinc-50">
                Incident Feed
              </h2>
              <div className="mt-3">
                <IncidentFeed items={FEED} pinnedRegionId={pinnedRegionId} onPin={setPinnedRegionId} />
              </div>
            </Card>

            <div className="col-span-12 flex min-w-0 flex-col gap-4 md:gap-6 lg:col-span-5">
              <Card className="min-w-0 p-4 sm:p-5" as="section" aria-labelledby="map-heading">
                <h2 id="map-heading" className="font-semibold text-sm text-zinc-50">
                  Region Health — Hex Grid
                </h2>
                <p className="mt-0.5 text-xs text-zinc-400">Uptime and open incidents are always shown on each tile.</p>
                <div className="mt-3">
                  <HexMap regions={REGIONS} pinnedId={pinnedRegionId} onPin={setPinnedRegionId} />
                </div>
              </Card>

              <Card className="min-w-0 p-4 sm:p-5" as="section" aria-labelledby="table-heading">
                <h2 id="table-heading" className="sr-only">
                  Region table
                </h2>
                <RegionTable regions={REGIONS} pinnedId={pinnedRegionId} />
              </Card>
            </div>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelectRegion={setPinnedRegionId} />
    </div>
  );
}
