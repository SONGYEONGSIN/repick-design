"use client";

import { useEffect, useMemo, useState } from "react";
import { Truck, Navigation, AlertTriangle, TrendingUp } from "lucide-react";
import {
  ACTIVE_VEHICLES,
  DELAYED_COUNT,
  DELIVERY_HISTORY,
  EN_ROUTE_COUNT,
  FLEET_TOTAL,
  ON_TIME_RATE_PCT,
  VEHICLES,
  type ZoneId,
} from "./data";
import { ALL_STATUS_OPTIONS } from "./status-meta";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { FilterBar } from "./filter-bar";
import { MapPanel, type Selection } from "./map-panel";
import { HistoryTable } from "./history-table";
import { DetailRail } from "./detail-rail";
import { CommandPalette } from "./command-palette";
import { Card, CaptionLabel, KpiStat } from "./ui";

const ALL_STATUS_KEYS = new Set(ALL_STATUS_OPTIONS.map((o) => o.key));

export function DashboardClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeZone, setActiveZone] = useState<ZoneId | "all">("all");
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(ALL_STATUS_KEYS);
  const [selection, setSelection] = useState<Selection | null>(null);

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

  const filteredVehicles = useMemo(
    () =>
      VEHICLES.filter(
        (v) => (activeZone === "all" || v.zoneId === activeZone) && selectedStatuses.has(v.status),
      ),
    [activeZone, selectedStatuses],
  );

  const filteredHistory = useMemo(
    () =>
      DELIVERY_HISTORY.filter(
        (d) => (activeZone === "all" || d.zoneId === activeZone) && selectedStatuses.has(d.status),
      ),
    [activeZone, selectedStatuses],
  );

  function toggleStatus(key: string) {
    setSelectedStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function selectVehicle(id: string) {
    setSelection({ type: "vehicle", id });
  }

  function selectDelivery(id: string) {
    setSelection({ type: "delivery", id });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenSidebar={() => setSidebarOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />

          <div className="mx-auto flex w-full min-w-0 max-w-[1920px] flex-1 flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-start">
            <main className="flex min-w-0 flex-1 flex-col gap-6">
              <header>
                <h1 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
                  Live fleet map
                </h1>
                <p className="mt-1 text-sm text-zinc-400">
                  Northline Logistics · {FLEET_TOTAL} vehicles across 5 delivery zones
                </p>
              </header>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <KpiStat
                  label="Active vehicles"
                  value={`${ACTIVE_VEHICLES}/${FLEET_TOTAL}`}
                  sub="En route or loading"
                  icon={Truck}
                />
                <KpiStat
                  label="En route now"
                  value={String(EN_ROUTE_COUNT)}
                  sub="Live deliveries"
                  icon={Navigation}
                />
                <KpiStat
                  label="Delayed"
                  value={String(DELAYED_COUNT)}
                  sub="Needs attention"
                  icon={AlertTriangle}
                />
                <KpiStat
                  label="On-time rate"
                  value={`${ON_TIME_RATE_PCT}%`}
                  sub="Concluded today"
                  icon={TrendingUp}
                />
              </div>

              <section aria-labelledby="map-heading" className="min-w-0">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 id="map-heading" className="text-base font-semibold text-zinc-100">
                    Live map
                  </h2>
                  <span className="text-xs text-zinc-400">
                    <span className="tabular-nums">{filteredVehicles.length}</span> of{" "}
                    <span className="tabular-nums">{FLEET_TOTAL}</span> vehicles shown
                  </span>
                </div>
                <Card padded={false} className="min-w-0 p-3 sm:p-4">
                  <div className="mb-3">
                    <FilterBar
                      activeZone={activeZone}
                      onZoneChange={setActiveZone}
                      selectedStatuses={selectedStatuses}
                      onToggleStatus={toggleStatus}
                      onSelectAllStatuses={() => setSelectedStatuses(new Set(ALL_STATUS_KEYS))}
                    />
                  </div>
                  <MapPanel
                    vehicles={filteredVehicles}
                    activeZone={activeZone}
                    selection={selection}
                    onSelectVehicle={selectVehicle}
                  />
                </Card>
              </section>

              <section aria-labelledby="history-heading" className="min-w-0">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 id="history-heading" className="text-base font-semibold text-zinc-100">
                    Delivery history
                  </h2>
                  <CaptionLabel>
                    <span className="tabular-nums">{filteredHistory.length}</span> record
                    {filteredHistory.length === 1 ? "" : "s"}
                  </CaptionLabel>
                </div>
                <Card padded={false} className="min-w-0 p-2 sm:p-3">
                  <HistoryTable
                    rows={filteredHistory}
                    selectedId={selection?.type === "delivery" ? selection.id : null}
                    onSelectDelivery={selectDelivery}
                  />
                </Card>
              </section>
            </main>

            <aside className="w-full min-w-0 shrink-0 lg:sticky lg:top-[89px] lg:w-96">
              <DetailRail
                selection={selection}
                onSelectVehicle={selectVehicle}
                onSelectDelivery={selectDelivery}
              />
            </aside>
          </div>
        </div>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelectVehicle={selectVehicle}
        onSelectDelivery={selectDelivery}
      />
    </div>
  );
}
