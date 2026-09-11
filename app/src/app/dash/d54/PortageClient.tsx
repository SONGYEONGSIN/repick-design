"use client";

import { AlertTriangle, CheckCircle2, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import CityMap, { type MapLayer } from "./CityMap";
import CommandPalette from "./CommandPalette";
import ManifestTable from "./ManifestTable";
import PinnedRoutePanel from "./PinnedRoutePanel";
import RouteRail from "./RouteRail";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TrendChart, { type Period } from "./TrendChart";
import ZoneLoadPanel from "./ZoneLoadPanel";
import { ACTIVE_ROUTES, HUB_NAME, ITEMS_TODAY, NEEDS_ATTENTION_ROUTES, ON_TIME_RATE_7D, ROUTES, formatInt, formatPct1 } from "./data";
import { APP_BG, NUM, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";
import { Card, Eyebrow } from "./ui";

export default function PortageClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mapLayer, setMapLayer] = useState<MapLayer>("routes");
  const [period, setPeriod] = useState<Period>("7d");
  const [pinnedRouteId, setPinnedRouteId] = useState<string | null>(null);
  const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function togglePin(id: string) {
    setPinnedRouteId((cur) => (cur === id ? null : id));
  }

  const needsAttention = NEEDS_ATTENTION_ROUTES.length;

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Portage · ${HUB_NAME} · ${ROUTES.length} routes today`}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Dispatch board</h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                Hovering a van on the map is a momentary inspector — it clears the instant you look away. Pinning a route updates the detail card and its
                highlight on the map, but the zone load summary keeps showing the full city on purpose.
              </p>
            </div>
          </div>

          <h2 className="sr-only font-medium">Operations summary</h2>
          <Card className="mt-4" padded={false}>
            <dl className="grid grid-cols-2 divide-x divide-y divide-white/10 sm:grid-cols-4 sm:divide-y-0">
              <StatCell label="Active routes" value={formatInt(ACTIVE_ROUTES.length)} Icon={Truck} hint={`of ${ROUTES.length} total today`} />
              <StatCell
                label="Needs attention"
                value={formatInt(needsAttention)}
                Icon={AlertTriangle}
                hint="at-risk or delayed"
                tone={needsAttention > 0 ? "warn" : "default"}
              />
              <StatCell label="On-time rate" value={formatPct1(ON_TIME_RATE_7D)} Icon={CheckCircle2} hint="trailing 7 days" />
              <StatCell label="Items collected" value={formatInt(ITEMS_TODAY)} Icon={Package} hint="citywide, today" />
            </dl>
          </Card>

          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 min-w-0 xl:col-span-8">
              <Card>
                <CityMap
                  layer={mapLayer}
                  onLayerChange={setMapLayer}
                  pinnedRouteId={pinnedRouteId}
                  hoveredRouteId={hoveredRouteId}
                  onHoverRoute={setHoveredRouteId}
                  onLeaveRoute={() => setHoveredRouteId(null)}
                  onTogglePin={togglePin}
                />
              </Card>
            </div>
            <div className="col-span-12 min-w-0 xl:col-span-4">
              <Card className="h-full">
                <RouteRail pinnedRouteId={pinnedRouteId} hoveredRouteId={hoveredRouteId} onHoverRoute={setHoveredRouteId} onLeaveRoute={() => setHoveredRouteId(null)} onTogglePin={togglePin} />
              </Card>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 min-w-0 lg:col-span-6">
              <Card className="h-full">
                <PinnedRoutePanel pinnedRouteId={pinnedRouteId} />
              </Card>
            </div>
            <div className="col-span-12 min-w-0 lg:col-span-6">
              <Card className="h-full">
                <ZoneLoadPanel />
              </Card>
            </div>
          </div>

          <div className="mt-4">
            <Card>
              <TrendChart period={period} onPeriodChange={setPeriod} />
            </Card>
          </div>

          <div className="mt-4">
            <Card>
              <ManifestTable />
            </Card>
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onSelectRoute={(id) => {
            setPinnedRouteId(id);
            setHoveredRouteId(null);
          }}
        />
      ) : null}
    </div>
  );
}

function StatCell({
  label,
  value,
  hint,
  Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  hint: string;
  Icon: typeof Truck;
  tone?: "default" | "warn";
}) {
  return (
    <div className="p-4">
      <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", tone === "warn" ? "text-orange-300" : TEXT_AUX)}>{label}</dt>
      <dd className="mt-1.5">
        <span className="flex items-center gap-1.5">
          <Icon size={16} aria-hidden="true" className={tone === "warn" ? "text-orange-400" : "text-blue-400"} />
          <span className={cx(NUM, "text-2xl font-semibold leading-none", TEXT_PRIMARY)}>{value}</span>
        </span>
        <span className={cx("mt-2 block text-[11px] font-normal", TEXT_AUX)}>{hint}</span>
      </dd>
    </div>
  );
}
