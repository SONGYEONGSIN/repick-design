"use client";

import { AlertTriangle, ArrowDownRight, Calendar, Gauge, PackageSearch } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CommandPalette from "./CommandPalette";
import ForecastChart from "./ForecastChart";
import Sidebar from "./Sidebar";
import SkuTable from "./SkuTable";
import Topbar from "./Topbar";
import { AT_RISK_COUNT, WAREHOUSE_OPTIONS, buildSeries, findCrossDay, formatInt, reorderPoint, type Horizon, type WarehouseId } from "./data";
import { APP_BG, BORDER, NUM, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHead, Eyebrow, Segmented } from "./ui";

type HorizonId = "30" | "60" | "90";
const HORIZON_OPTIONS: { id: HorizonId; label: string }[] = [
  { id: "30", label: "30D" },
  { id: "60", label: "60D" },
  { id: "90", label: "90D" },
];

export default function FlowlineClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [horizonId, setHorizonId] = useState<HorizonId>("60");
  const horizon: Horizon = Number(horizonId) as Horizon;
  const [warehouse, setWarehouse] = useState<WarehouseId>("all");

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

  const scale = WAREHOUSE_OPTIONS.find((w) => w.id === warehouse)?.scale ?? 1;
  const series = useMemo(() => buildSeries(horizon, scale), [horizon, scale]);
  const reorder = reorderPoint(scale);
  const today = series.find((p) => p.day === 0) ?? series[0];
  const last = series[series.length - 1];
  const avgBurn = (today.value - last.value) / horizon;
  const cover = Math.round((today.value / avgBurn) * 10) / 10;
  const crossDay = findCrossDay(series, reorder);

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Network inventory · ${WAREHOUSE_OPTIONS.find((w) => w.id === warehouse)?.label}`}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Inventory forecast</h1>
            </div>
          </div>

          {/* Hero: a headline number with inline stat chips beside it, not a four-tile KPI row —
              the brief's own "inline stats" variant on the layout-archetype list. */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-3">
              <span className={cx("flex items-baseline gap-1 text-5xl font-semibold leading-none tracking-tight sm:text-6xl", NUM, TEXT_PRIMARY)}>
                {cover.toFixed(1)}
                <span className={cx("text-lg font-medium", TEXT_MUTED)}>days of cover</span>
              </span>
              <span className={cx("mb-1 flex items-center gap-1 text-sm font-medium text-rose-400")}>
                <ArrowDownRight size={16} aria-hidden="true" />
                {`${formatInt(Math.round(avgBurn))}/day burn`}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium", BORDER, SURFACE_INSET, TEXT_MUTED)}>
                <Calendar size={13} aria-hidden="true" className={TEXT_AUX} />
                {crossDay !== null ? `Reorder point in ${crossDay}d` : `Reorder point outside ${horizon}d horizon`}
              </span>
              <span
                className={cx(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                  AT_RISK_COUNT > 0 ? "border-rose-800/60 bg-rose-950/40 text-rose-300" : cx(BORDER, SURFACE_INSET, TEXT_MUTED),
                )}
              >
                <AlertTriangle size={13} aria-hidden="true" />
                {`${AT_RISK_COUNT} SKU${AT_RISK_COUNT === 1 ? "" : "s"} at critical cover`}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Card>
              <CardHead
                title="Projected network inventory"
                Icon={Gauge}
                hint="Solid is measured, dashed is forecast — the shaded band widens with forecast uncertainty."
                action={
                  <div className="flex flex-wrap items-center gap-2">
                    <Segmented options={WAREHOUSE_OPTIONS.map((w) => ({ id: w.id, label: w.label }))} value={warehouse} onChange={setWarehouse} ariaLabel="Warehouse scope" />
                    <Segmented options={HORIZON_OPTIONS} value={horizonId} onChange={setHorizonId} ariaLabel="Forecast horizon" />
                  </div>
                }
              />
              <div className="mt-3">
                <ForecastChart points={series} reorder={reorder} horizon={horizon} />
              </div>
            </Card>
          </div>

          <div className="mt-4">
            <Card>
              <CardHead title="SKU cover" Icon={PackageSearch} hint="Every SKU across both warehouses — its own filter and sort apply independently of the forecast scope above." />
              <div className="mt-3">
                <SkuTable />
              </div>
            </Card>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectSku={() => setPaletteOpen(false)} /> : null}
    </div>
  );
}
