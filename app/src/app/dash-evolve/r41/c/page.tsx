"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Bell,
  BellRing,
  ChevronsUpDown,
  History,
  LogOut,
  Menu,
  Plus,
  Search,
  Server,
  Settings,
  Waves,
  X,
} from "lucide-react";
import AnomalyChart from "./anomaly-chart";
import AnomalyStrip from "./anomaly-strip";
import AnomalyTable from "./anomaly-table";
import CommandPalette from "./command-palette";
import {
  CURRENT_USER,
  METRICS,
  WORKSPACES,
  anomaliesForMetric,
  metricByKey,
  mostSevereAnomaly,
  withinRangePct,
  type MetricKey,
} from "./data";
import { formatMetricValue, formatSignedMetricValue } from "./format";
import { Avatar, Card, FOCUS_RING, SegmentedControl, SeverityBadge } from "./ui";

const NAV_ITEMS = [
  { label: "Overview", icon: Activity, active: true },
  { label: "Services", icon: Server, active: false },
  { label: "Alerts", icon: BellRing, active: false },
  { label: "Audit Log", icon: History, active: false },
];

function BrandLockup() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white">
        <Waves className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-semibold text-lg leading-tight text-zinc-900 [font-family:var(--font-display-grotesk)]">
          Pulsegrid
        </p>
        <p className="truncate font-normal text-xs text-zinc-500">Anomaly Console</p>
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
                item.active ? "bg-sky-50 text-sky-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
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

export default function PulsegridConsole() {
  const [metricKey, setMetricKey] = useState<MetricKey>("latency");
  const [selectedHour, setSelectedHour] = useState<string | null>(mostSevereAnomaly(metricByKey("latency"))?.hour ?? null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [workspaceIndex, setWorkspaceIndex] = useState(0);

  // When the metric changes, re-focus the most severe anomaly of the *new* metric so the readout is
  // never stale and never empty. Compared against a stored previous value during render, not inside
  // a useEffect keyed on metricKey, to avoid react-hooks/set-state-in-effect.
  const [prevMetricKey, setPrevMetricKey] = useState(metricKey);
  if (prevMetricKey !== metricKey) {
    setPrevMetricKey(metricKey);
    setSelectedHour(mostSevereAnomaly(metricByKey(metricKey))?.hour ?? null);
  }

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

  const metric = metricByKey(metricKey);
  const events = anomaliesForMetric(metric);
  const focused = events.find((e) => e.hour === selectedHour) ?? events[0] ?? null;
  const withinPct = withinRangePct(metric);

  return (
    <div className="flex min-h-screen bg-white font-normal text-zinc-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-sky-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 p-4 lg:flex">
        <BrandLockup />
        <button
          type="button"
          onClick={() => setWorkspaceIndex((i) => (i + 1) % WORKSPACES.length)}
          className={`mt-4 flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 font-medium text-xs text-zinc-600 hover:text-zinc-900 ${FOCUS_RING}`}
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
          <div aria-hidden="true" onClick={() => setMobileNavOpen(false)} className="absolute inset-0 bg-zinc-900/40" />
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
        <header className="flex h-20 items-center justify-between gap-3 border-b border-zinc-200 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className={`flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 lg:hidden ${FOCUS_RING}`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search ⌘K metrics and anomalies"
              className={`flex h-11 items-center gap-2 rounded-lg border border-zinc-200 px-3 font-normal text-sm text-zinc-600 hover:text-zinc-900 ${FOCUS_RING}`}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Search</span>
              <span className="rounded border border-zinc-200 px-1.5 py-0.5 font-normal text-xs text-zinc-500">&#8984;K</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`flex h-11 items-center gap-2 rounded-lg bg-sky-600 px-3 font-medium text-sm text-white hover:bg-sky-700 ${FOCUS_RING}`}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">New alert rule</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                aria-expanded={notifOpen}
                aria-label="Notifications"
                className={`flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 ${FOCUS_RING}`}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
              </button>
              {notifOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-lg border border-zinc-200 bg-white p-2 shadow-xl">
                  <p className="px-2 py-1 font-medium text-xs text-zinc-500">Notifications</p>
                  <p className="rounded-md px-2 py-2 font-normal text-sm text-zinc-900">
                    Latency crossed the expected range at 14:00 — 289 ms, 98 ms over band.
                  </p>
                  <p className="rounded-md px-2 py-2 font-normal text-sm text-zinc-900">
                    CPU utilization spiked to 89% at 06:00 on the checkout service pool.
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
                className={`flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 font-medium text-xs text-sky-700 hover:bg-sky-200 ${FOCUS_RING}`}
              >
                <span aria-hidden="true">{CURRENT_USER.initials}</span>
              </button>
              {avatarMenuOpen ? (
                <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-lg border border-zinc-200 bg-white p-2 shadow-xl">
                  <p className="truncate px-2 py-1 font-medium text-sm text-zinc-900">{CURRENT_USER.name}</p>
                  <p className="truncate px-2 pb-2 font-normal text-xs text-zinc-500">{CURRENT_USER.email}</p>
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
          <h1 className="font-semibold text-2xl text-zinc-900">Metric Overview</h1>
          <p className="mt-1 max-w-2xl font-normal text-sm text-zinc-600">
            Twenty-four hours of {metric.description.toLowerCase()} with the expected range band and every flagged anomaly annotated
            directly on the line.
          </p>
          <p className="mt-2 font-normal text-sm text-zinc-500">
            {events.length} active anomal{events.length === 1 ? "y" : "ies"} on {metric.shortLabel.toLowerCase()} · {withinPct}% of
            readings within the expected range
          </p>

          <div className="mt-6 grid grid-cols-12 gap-4 md:gap-6">
            <Card className="col-span-12 min-w-0 p-4 sm:p-6" as="section" aria-labelledby="chart-heading">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 id="chart-heading" className="font-semibold text-sm text-zinc-900">
                    {metric.label}
                  </h2>
                  <p className="mt-0.5 font-normal text-xs text-zinc-500">{metric.description}</p>
                </div>
                <SegmentedControl
                  label="Metric"
                  value={metricKey}
                  onChange={setMetricKey}
                  options={METRICS.map((m) => ({ value: m.key, label: m.shortLabel }))}
                />
              </div>

              <div className="mt-4">
                <AnomalyChart metric={metric} selectedHour={selectedHour} />
              </div>

              {focused ? (
                <p className="mt-4 rounded-lg bg-zinc-50 px-3 py-2 font-normal text-sm text-zinc-700">
                  Focused anomaly — <span className="font-medium text-zinc-900">{focused.hour}</span>: {metric.shortLabel} read{" "}
                  <span className="font-medium tabular-nums text-zinc-900">{formatMetricValue(metric, focused.actual)}</span>,{" "}
                  {formatSignedMetricValue(metric, focused.direction === "above" ? focused.deviation : -focused.deviation)}{" "}
                  {focused.direction === "above" ? "above" : "below"} the expected range —{" "}
                  <SeverityBadge severity={focused.severity} className="align-middle" />
                </p>
              ) : null}

              <div className="mt-5">
                <h3 className="font-semibold text-sm text-zinc-900">Active anomalies</h3>
                <p className="mt-0.5 font-normal text-xs text-zinc-500">
                  Every point flagged outside the expected range, with its exact value and deviation — always shown, not only on hover.
                </p>
                <div className="mt-3">
                  <AnomalyStrip metric={metric} events={events} selectedHour={selectedHour} onSelect={setSelectedHour} />
                </div>
              </div>
            </Card>

            <Card className="col-span-12 min-w-0 p-4 sm:p-6" as="section" aria-labelledby="table-heading">
              <h2 id="table-heading" className="font-semibold text-sm text-zinc-900">
                Anomaly event log
              </h2>
              <div className="mt-3">
                <AnomalyTable metric={metric} events={events} />
              </div>
            </Card>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelectMetric={setMetricKey}
        onSelectAnomaly={(key, hour) => {
          setMetricKey(key);
          setSelectedHour(hour);
        }}
      />
    </div>
  );
}
