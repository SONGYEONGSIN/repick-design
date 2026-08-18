"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PackageCheck, TriangleAlert, PackageX, Archive } from "lucide-react";
import { SKUS, USD, INT, type Sku, type Status, type Warehouse } from "./data";
import type { Density, GroupBy, OptionalColumn, SortDir, SortKey } from "./columns";
import { AppShell } from "./AppShell";
import { Toolbar } from "./Toolbar";
import { DataGrid } from "./DataGrid";
import { DetailSheet } from "./DetailSheet";
import { CommandPalette } from "./CommandPalette";

const STATUS_STAT_ICON: Record<Status, typeof PackageCheck> = {
  Healthy: PackageCheck,
  "Low Stock": TriangleAlert,
  Backorder: PackageX,
  Discontinued: Archive,
};

function toCsv(rows: Sku[]): string {
  const header = ["SKU", "Product", "Category", "Warehouse", "Status", "On Hand", "Reorder Point", "Unit Value", "Total Value"];
  const lines = rows.map((r) =>
    [r.code, r.name, r.category, r.warehouse, r.status, r.onHand, r.reorderPoint, r.unitValue, r.totalValue]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [warehouseFilter, setWarehouseFilter] = useState<Warehouse | "All">("All");
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const [density, setDensity] = useState<Density>("comfortable");
  const [optionalCols, setOptionalCols] = useState<Record<OptionalColumn, boolean>>({
    warehouse: true,
    reorderPoint: true,
    unitValue: true,
  });
  const [sortKey, setSortKey] = useState<SortKey>("totalValue");
  const [sortDir, setSortDir] = useState<SortDir>("descending");
  const [selectedSku, setSelectedSku] = useState<Sku | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        lastTriggerRef.current = document.activeElement as HTMLElement;
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function openPalette() {
    lastTriggerRef.current = document.activeElement as HTMLElement;
    setPaletteOpen(true);
  }

  function closePalette() {
    setPaletteOpen(false);
    (lastTriggerRef.current ?? searchButtonRef.current)?.focus();
  }

  function openDetail(sku: Sku) {
    lastTriggerRef.current = document.activeElement as HTMLElement;
    setSelectedSku(sku);
  }

  function closeDetail() {
    setSelectedSku(null);
    lastTriggerRef.current?.focus();
  }

  function handleSelectFromPalette(sku: Sku) {
    setPaletteOpen(false);
    setSelectedSku(sku);
  }

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "ascending" ? "descending" : "ascending"));
    } else {
      setSortKey(key);
      setSortDir("ascending");
    }
  }

  function toggleOptionalCol(col: OptionalColumn) {
    setOptionalCols((prev) => ({ ...prev, [col]: !prev[col] }));
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SKUS.filter((s) => {
      if (statusFilter !== "All" && s.status !== statusFilter) return false;
      if (warehouseFilter !== "All" && s.warehouse !== warehouseFilter) return false;
      if (q && !s.name.toLowerCase().includes(q) && !s.code.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, statusFilter, warehouseFilter]);

  function handleExportCsv() {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stockloom-inventory.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const totalValue = useMemo(() => SKUS.reduce((sum, s) => sum + s.totalValue, 0), []);
  const statusCounts = useMemo(() => {
    const counts: Record<Status, number> = { Healthy: 0, "Low Stock": 0, Backorder: 0, Discontinued: 0 };
    for (const s of SKUS) counts[s.status] += 1;
    return counts;
  }, []);

  return (
    <AppShell onOpenPalette={openPalette} onExportCsv={handleExportCsv} searchButtonRef={searchButtonRef}>
      <div className="border-b border-zinc-200 bg-white px-4 py-5 sm:px-6">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">Inventory grid</h1>
        <dl className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-zinc-500">
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Total SKUs</dt>
            <dd>
              <span className="font-semibold tabular-nums text-zinc-700">{INT.format(SKUS.length)}</span> SKUs across 3
              warehouses
            </dd>
          </div>
          {(Object.keys(statusCounts) as Status[]).map((s) => {
            const Icon = STATUS_STAT_ICON[s];
            return (
              <div key={s} className="flex items-center gap-1.5">
                <dt className="sr-only">{s} count</dt>
                <dd className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                  <span className="font-semibold tabular-nums text-zinc-700">{statusCounts[s]}</span> {s}
                </dd>
              </div>
            );
          })}
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">Total inventory value</dt>
            <dd>
              <span className="font-semibold tabular-nums text-zinc-700">{USD.format(totalValue)}</span> total value
            </dd>
          </div>
        </dl>
      </div>

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        warehouseFilter={warehouseFilter}
        onWarehouseFilterChange={setWarehouseFilter}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        density={density}
        onDensityChange={setDensity}
        optionalCols={optionalCols}
        onToggleOptionalCol={toggleOptionalCol}
        resultCount={filtered.length}
        totalCount={SKUS.length}
      />

      <div className="min-w-0 flex-1 px-4 py-4 sm:px-6">
        <DataGrid
          rows={filtered}
          groupBy={groupBy}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          optionalCols={optionalCols}
          density={density}
          onRowClick={openDetail}
        />
      </div>

      <DetailSheet sku={selectedSku} onClose={closeDetail} />
      {paletteOpen ? <CommandPalette onClose={closePalette} skus={SKUS} onSelectSku={handleSelectFromPalette} /> : null}
    </AppShell>
  );
}
