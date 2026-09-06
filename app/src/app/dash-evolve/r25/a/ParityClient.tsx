"use client";

import { AlertTriangle, CheckCircle2, Clock3, GitCompareArrows } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CommandPalette from "./CommandPalette";
import PinnedTray from "./PinnedTray";
import ReconciliationGrid from "./ReconciliationGrid";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TrendChart from "./TrendChart";
import {
  FLAGGED_COUNT,
  LAST_SYNC_HOURS,
  MATCH_RATE,
  MATCH_RATE_TREND,
  NET_VALUE,
  RECON_LINES,
  TOTAL_LINES,
  TREND_SERIES,
  filterLines,
  formatHoursAgo,
  formatInt,
  formatPct,
  formatUSD,
  type Period,
  type StatusFilter,
  type WarehouseFilter,
} from "./data";
import { APP_BG, BORDER, NUM, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Card, Eyebrow, Segmented, Sparkline } from "./ui";

const PERIOD_OPTIONS: { id: Period; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
];

export default function ParityClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("7d");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [warehouseFilter, setWarehouseFilter] = useState<WarehouseFilter>("all");
  const [search, setSearch] = useState("");

  // The pin is a single id, deliberately separate from the grid's own sort/filter state above —
  // see PinnedTray and ReconciliationGrid for the split this drives.
  const [pinnedId, setPinnedId] = useState<string | null>("l21");

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

  const filteredRows = useMemo(
    () => filterLines(RECON_LINES, { status: statusFilter, warehouse: warehouseFilter, search }),
    [statusFilter, warehouseFilter, search],
  );

  const pinnedLine = pinnedId ? RECON_LINES.find((l) => l.id === pinnedId) ?? null : null;
  const isPinFilteredOut = pinnedLine !== null && !filteredRows.some((l) => l.id === pinnedLine.id);

  function togglePin(id: string) {
    setPinnedId((cur) => (cur === id ? null : id));
  }

  function clearFilters() {
    setStatusFilter("all");
    setWarehouseFilter("all");
    setSearch("");
  }

  const trend = TREND_SERIES[period];
  const netIsShortfall = NET_VALUE < 0;

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Parity · Cycle 42 · ${formatInt(TOTAL_LINES)} lines`}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Inventory reconciliation</h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                Pinning a line cross-references it in the tray below without touching the grid&rsquo;s own filters; hovering or
                focusing a SKU shows a scan trail that vanishes the moment you look away.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4">
            <Card className="col-span-12 min-w-0">
              <div className="grid grid-cols-12 gap-x-6 gap-y-4">
                <div className="col-span-12 min-w-0 sm:col-span-6 lg:col-span-4">
                  <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Net unreconciled value</p>
                  <p className={cx("mt-1.5 flex items-center gap-2 text-3xl font-semibold leading-none", NUM, netIsShortfall ? "text-red-400" : "text-green-400")}>
                    <AlertTriangle size={20} aria-hidden="true" />
                    {formatUSD(NET_VALUE)}
                  </p>
                  <p className={cx("mt-2 text-xs font-normal", TEXT_AUX)}>{`${netIsShortfall ? "Shortfall" : "Surplus"} across ${formatInt(TOTAL_LINES)} lines this cycle`}</p>
                </div>

                <div className="col-span-12 min-w-0 sm:col-span-6 lg:col-span-4">
                  <div className="grid h-full grid-cols-3 divide-x divide-white/10">
                    <div className="min-w-0 pr-3">
                      <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Flagged</p>
                      <p className={cx("mt-1.5 flex items-center gap-1.5 text-lg font-semibold", NUM, TEXT_PRIMARY)}>
                        <Clock3 size={14} aria-hidden="true" className={TEXT_AUX} />
                        {formatInt(FLAGGED_COUNT)}
                      </p>
                      <p className={cx("mt-1 text-[11px] font-normal", TEXT_AUX)}>need review</p>
                    </div>
                    <div className="min-w-0 px-3">
                      <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Matched</p>
                      <p className={cx("mt-1.5 flex items-center gap-1.5 text-lg font-semibold", NUM, TEXT_PRIMARY)}>
                        <CheckCircle2 size={14} aria-hidden="true" className="text-green-400" />
                        {formatPct(MATCH_RATE)}
                      </p>
                      <Sparkline values={MATCH_RATE_TREND} className="mt-1" colorClass="stroke-green-400" />
                    </div>
                    <div className="min-w-0 pl-3">
                      <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Last sync</p>
                      <p className={cx("mt-1.5 text-lg font-semibold", NUM, TEXT_PRIMARY)}>{formatHoursAgo(LAST_SYNC_HOURS)}</p>
                      <p className={cx("mt-1 text-[11px] font-normal", TEXT_AUX)}>warehouse scanners</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 min-w-0 lg:col-span-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Value trend</p>
                    <Segmented ariaLabel="Trend period" options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />
                  </div>
                  <div className="mt-2">
                    <TrendChart labels={trend.labels} values={trend.values} />
                  </div>
                </div>
              </div>
            </Card>

            <div className="col-span-12 min-w-0">
              <PinnedTray line={pinnedLine} isFilteredOut={isPinFilteredOut} onUnpin={() => setPinnedId(null)} onClearFilters={clearFilters} />
            </div>

            <Card padded={false} className="col-span-12 min-w-0">
              <div className="p-3 sm:p-4">
                <div className="mb-3 flex items-center gap-1.5">
                  <GitCompareArrows size={14} aria-hidden="true" className={TEXT_AUX} />
                  <h2 className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>Reconciliation lines</h2>
                  <span className={cx("ml-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium", BORDER, SURFACE_INSET, TEXT_MUTED)}>{`Sorted for triage`}</span>
                </div>
                <ReconciliationGrid
                  rows={filteredRows}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  warehouseFilter={warehouseFilter}
                  onWarehouseFilterChange={setWarehouseFilter}
                  search={search}
                  onSearchChange={setSearch}
                  pinnedId={pinnedId}
                  onTogglePin={togglePin}
                />
              </div>
            </Card>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectLine={(id) => setPinnedId(id)} /> : null}
    </div>
  );
}
