"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Gauge, Package, Wallet } from "lucide-react";
import {
  METRICS,
  NETWORK,
  NETWORK_ON_TIME_RATE,
  WORKSPACES,
  ZONES,
  ZONE_BY_ID,
  formatCurrency,
  formatVolume,
  type MetricKey,
} from "./data";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import RegionRail from "./region-rail";
import RegionMap from "./region-map";
import DetailPanel from "./detail-panel";
import CommandPalette from "./command-palette";
import { Card, SegmentedControl } from "./ui";

// Default focus: the worst-performing zone on load, since that's what a network-ops reviewer
// wants to see first. This is the one place the `selectedId` state starts non-empty — everywhere
// else it only changes through an explicit user action (rail row, map region, or the palette).
const DEFAULT_SELECTED_ID = "SE-01";

const METRIC_OPTIONS: { value: MetricKey; label: string }[] = [
  { value: "onTime", label: METRICS.onTime.shortLabel },
  { value: "incidents", label: METRICS.incidents.shortLabel },
  { value: "revenue", label: METRICS.revenue.shortLabel },
];

export default function RouteConsole() {
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [metric, setMetric] = useState<MetricKey>("onTime");

  // Persistent selection: drives the detail panel only. Deliberately NOT the same state as the
  // map's hover/focus preview (owned locally inside RegionMap) — see the comment there. Selecting
  // a row/region updates this; previewing one never does.
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_SELECTED_ID);
  const selectedZone = ZONE_BY_ID[selectedId] ?? ZONES[0];

  const handleSelect = useCallback((id: string) => setSelectedId(id), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-dvh w-full bg-zinc-950 font-sans text-zinc-50">
      {/* Inert while the command palette is open, so background content can't receive focus or
          stray clicks behind the overlay — the palette itself lives outside this wrapper. */}
      <div className="contents" inert={paletteOpen}>
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:rounded-lg focus-visible:bg-zinc-50 focus-visible:px-4 focus-visible:py-2 focus-visible:text-[13px] focus-visible:font-medium focus-visible:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6cc0b3]"
        >
          Skip to main content
        </a>

        <Sidebar workspace={workspace} setWorkspace={setWorkspace} mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main
          id="main-content"
          tabIndex={-1}
          className="flex w-full flex-1 flex-col gap-5 px-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#6cc0b3] sm:px-6 sm:py-6 lg:px-8 lg:py-7"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1
                className="text-[24px] font-semibold leading-tight tracking-tight text-zinc-50 sm:text-[28px]"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                Network delivery performance
              </h1>
              <p className="mt-1 text-[13px] font-normal text-zinc-400">
                <span className="font-semibold tabular-nums text-zinc-50">{ZONES.length}</span> regional zones ·{" "}
                <span className="font-semibold tabular-nums text-zinc-50">{NETWORK.depotCount}</span> depots · updated through{" "}
                <span className="font-medium text-zinc-50">Sep 30, 2026</span>
              </p>
            </div>
            <div className="flex flex-col items-start gap-1.5 sm:items-end">
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Map shows</span>
              <SegmentedControl label="Map metric" value={metric} onChange={setMetric} options={METRIC_OPTIONS} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <KpiCard
              icon={Gauge}
              label="Network on-time rate"
              value={`${NETWORK_ON_TIME_RATE.toFixed(1)}%`}
              caption="Volume-weighted across all zones"
            />
            <KpiCard icon={Package} label="Weekly volume" value={formatVolume(NETWORK.totalVolume)} caption="Parcels moved per week" />
            <KpiCard
              icon={AlertTriangle}
              label="Open delay incidents"
              value={formatVolume(NETWORK.totalIncidents)}
              caption="Logged across the network this week"
            />
            <KpiCard icon={Wallet} label="Revenue at risk" value={formatCurrency(NETWORK.totalRevenueAtRisk)} caption="SLA penalty exposure" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4 lg:flex-row lg:items-start">
            <Card className="min-w-0 w-full lg:w-[312px] lg:shrink-0" role="region" aria-labelledby="zones-heading">
              <div className="border-b border-white/10 px-4 py-3">
                <h2 id="zones-heading" className="text-[13.5px] font-semibold text-zinc-50">
                  Zones
                </h2>
                <p className="mt-0.5 text-[11.5px] font-normal text-zinc-400">Sort, filter, or search — select a row to inspect it.</p>
              </div>
              <RegionRail zones={ZONES} metric={metric} selectedId={selectedId} onSelect={handleSelect} />
            </Card>

            <div className="flex min-w-0 flex-1 flex-col gap-4 2xl:flex-row 2xl:items-start">
              <Card className="min-w-0 w-full p-4 2xl:flex-1" role="region" aria-labelledby="map-heading">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 id="map-heading" className="text-[13.5px] font-semibold text-zinc-50">
                      Zone map
                    </h2>
                    <p className="mt-0.5 text-[11.5px] font-normal text-zinc-400">
                      Hue = status, shading = {METRICS[metric].label.toLowerCase()}. Hover or Tab a zone for its exact value.
                    </p>
                  </div>
                  <MapLegend />
                </div>
                <div className="mt-4">
                  <RegionMap zones={ZONES} metric={metric} selectedId={selectedId} onSelect={handleSelect} />
                </div>
              </Card>

              <div className="min-w-0 2xl:w-[380px] 2xl:shrink-0">
                <DetailPanel zone={selectedZone} />
              </div>
            </div>
          </div>
        </main>
        </div>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} zones={ZONES} metric={metric} onSelectZone={handleSelect} />
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  caption,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <Card className="p-3.5 sm:p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#3f9c90]/15 text-[#8fcdc2]">
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <p className="truncate text-[11px] font-medium uppercase tracking-wider text-zinc-400">{label}</p>
      </div>
      <p className="mt-2 text-[22px] font-semibold leading-none tabular-nums text-zinc-50">{value}</p>
      <p className="mt-1.5 text-[11.5px] font-normal text-zinc-400">{caption}</p>
    </Card>
  );
}

function MapLegend() {
  const items: { color: string; label: string }[] = [
    { color: "#3f9c90", label: "On track" },
    { color: "#c7923f", label: "Watch" },
    { color: "#bc5656", label: "At risk" },
  ];
  return (
    <ul className="flex items-center gap-3" aria-label="Zone status color key">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5 text-[11px] font-normal text-zinc-400">
          <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
