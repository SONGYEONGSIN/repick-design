"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_MONTH_INDEX,
  MONTHS,
  TODAY_ISO,
  WAREHOUSES,
  WAREHOUSE_BY_ID,
  buildMonthGrid,
  formatPercent,
  metricDeltaPct,
  type Metric,
  type WarehouseId,
} from "./data";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { KpiRow } from "./KpiRow";
import { ShippingCalendar } from "./ShippingCalendar";
import { DayDetailPanel } from "./DayDetailPanel";
import { ExceptionsTable } from "./ExceptionsTable";
import { Tabs, downloadCsv } from "./ui";

export function Dashboard() {
  const [warehouseId, setWarehouseId] = useState<WarehouseId>("newark");
  const [metric, setMetric] = useState<Metric>("shipped");
  const [monthIndex, setMonthIndex] = useState(DEFAULT_MONTH_INDEX);
  const [pinnedIso, setPinnedIso] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // A pin is scoped to the warehouse it was set on — cleared whenever the
  // warehouse changes. Adjusted during render (React's documented pattern
  // for state that tracks a prop) rather than in an effect, so there's no
  // extra render tick and no synchronous setState-in-effect.
  const [prevWarehouseId, setPrevWarehouseId] = useState(warehouseId);
  if (warehouseId !== prevWarehouseId) {
    setPrevWarehouseId(warehouseId);
    setPinnedIso(null);
  }

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const warehouse = WAREHOUSE_BY_ID[warehouseId];

  const togglePin = useCallback((iso: string) => {
    setPinnedIso((prev) => (prev === iso ? null : iso));
  }, []);

  const navigateTo = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.focus({ preventScroll: true });
  }, []);

  const handleExport = useCallback(() => {
    const month = MONTHS[monthIndex];
    const grid = buildMonthGrid(monthIndex, warehouseId).filter((c) => c.inMonth && c.record);
    const rows = grid.map((c) => {
      const r = c.record!;
      return [
        r.iso,
        r.isFuture ? "" : (r.shippedUnits ?? ""),
        r.shippedTarget,
        r.isFuture ? "" : formatPercent(r.onTimePct ?? 0, 1),
        formatPercent(r.onTimeTarget, 0),
        r.isFuture ? "scheduled" : String(metricDeltaPct(r, "shipped")),
      ];
    });
    downloadCsv(
      `loadline-${warehouseId}-${month.key}.csv`,
      ["Date", "Units shipped", "Daily target", "On-time %", "On-time target", "Shipped delta vs target (%)"],
      rows,
    );
  }, [monthIndex, warehouseId]);

  return (
    <div className="flex min-h-screen bg-white text-zinc-900">
      <div className="contents" inert={paletteOpen}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>

        <AppSidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} onExport={handleExport} />

          <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 px-4 py-6 focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-emerald-700 sm:px-6 lg:px-8 lg:py-8">
            <div className="mb-5 flex flex-col gap-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{warehouse.region} region</p>
              <h1 className="text-2xl font-semibold text-zinc-900" style={{ fontFamily: "var(--font-display-wide)" }}>{warehouse.name}</h1>
              <p className="text-sm font-normal text-zinc-500">Managed by {warehouse.manager} — daily shipments read actual-vs-target the instant you look.</p>
            </div>

            <div className="mb-5" id="warehouse-tabpanel">
              <Tabs
                label="Choose warehouse"
                panelId="warehouse-tabpanel-content"
                items={WAREHOUSES.map((w) => ({ id: w.id, label: w.city }))}
                value={warehouseId}
                onChange={(id) => setWarehouseId(id as WarehouseId)}
              />
            </div>

            <div id="warehouse-tabpanel-content" role="tabpanel" aria-label={`${warehouse.name} metrics`} className="mb-6">
              <KpiRow warehouseId={warehouseId} />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <div id="shipping-calendar" tabIndex={-1} className="min-w-0 rounded-xl focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-emerald-700 xl:col-span-8">
                <ShippingCalendar
                  warehouseId={warehouseId}
                  metric={metric}
                  onMetricChange={setMetric}
                  monthIndex={monthIndex}
                  onMonthIndexChange={(i) => setMonthIndex(Math.max(0, Math.min(MONTHS.length - 1, i)))}
                  pinnedIso={pinnedIso}
                  onTogglePin={togglePin}
                />
              </div>

              <section id="day-detail" aria-label="Pinned day detail" className="min-w-0 xl:col-span-4">
                <DayDetailPanel warehouseId={warehouseId} warehouseName={warehouse.name} pinnedIso={pinnedIso} onClearPin={() => setPinnedIso(null)} />
              </section>
            </div>

            <div className="mt-6">
              <ExceptionsTable warehouseId={warehouseId} warehouseName={warehouse.name} />
            </div>
          </main>
        </div>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={navigateTo}
        currentWarehouseId={warehouseId}
        onSelectWarehouse={setWarehouseId}
        currentMetric={metric}
        onSelectMetric={setMetric}
        onPinToday={() => {
          setMonthIndex(DEFAULT_MONTH_INDEX);
          setPinnedIso(TODAY_ISO);
        }}
        onClearPin={() => setPinnedIso(null)}
        onExport={handleExport}
      />
    </div>
  );
}
