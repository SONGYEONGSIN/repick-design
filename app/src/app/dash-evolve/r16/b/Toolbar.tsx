"use client";

import { Search, Rows3, Rows2, Columns3 } from "lucide-react";
import { STATUSES, WAREHOUSES, type Status, type Warehouse } from "./data";
import { Popover } from "./Popover";
import { FOCUS_RING } from "./ui";
import type { Density, GroupBy, OptionalColumn } from "./columns";
import { OPTIONAL_COLUMN_LABEL } from "./columns";

export function Toolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  warehouseFilter,
  onWarehouseFilterChange,
  groupBy,
  onGroupByChange,
  density,
  onDensityChange,
  optionalCols,
  onToggleOptionalCol,
  resultCount,
  totalCount,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: Status | "All";
  onStatusFilterChange: (v: Status | "All") => void;
  warehouseFilter: Warehouse | "All";
  onWarehouseFilterChange: (v: Warehouse | "All") => void;
  groupBy: GroupBy;
  onGroupByChange: (v: GroupBy) => void;
  density: Density;
  onDensityChange: (v: Density) => void;
  optionalCols: Record<OptionalColumn, boolean>;
  onToggleOptionalCol: (col: OptionalColumn) => void;
  resultCount: number;
  totalCount: number;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-zinc-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex h-11 min-w-[220px] flex-1 items-center sm:flex-none sm:w-72">
          <span className="sr-only">Search SKUs by name or code</span>
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-zinc-400" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search SKU or product name…"
            className={`h-11 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
        </label>

        <div
          className="min-w-0 max-w-full flex-1 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-1 sm:flex-none"
          role="group"
          aria-label="Filter by status"
        >
          <div className="flex h-9 w-max items-center gap-1">
            {(["All", ...STATUSES] as const).map((s) => {
              const active = statusFilter === s;
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onStatusFilterChange(s)}
                  className={`h-full shrink-0 whitespace-nowrap rounded-md px-2.5 text-xs font-semibold transition-colors ${FOCUS_RING} ${
                    active ? "bg-white text-blue-700 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm">
          <span className="text-zinc-500">Warehouse</span>
          <select
            value={warehouseFilter}
            onChange={(e) => onWarehouseFilterChange(e.target.value as Warehouse | "All")}
            className={`h-full rounded-md bg-transparent text-sm font-semibold text-zinc-900 ${FOCUS_RING}`}
          >
            <option value="All">All</option>
            {WAREHOUSES.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </label>

        <label className="flex h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm">
          <span className="text-zinc-500">Group by</span>
          <select
            value={groupBy}
            onChange={(e) => onGroupByChange(e.target.value as GroupBy)}
            className={`h-full rounded-md bg-transparent text-sm font-semibold text-zinc-900 ${FOCUS_RING}`}
          >
            <option value="none">None</option>
            <option value="category">Category</option>
            <option value="warehouse">Warehouse</option>
          </select>
        </label>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="flex h-11 items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1" role="group" aria-label="Row density">
            <button
              type="button"
              aria-pressed={density === "comfortable"}
              onClick={() => onDensityChange("comfortable")}
              className={`flex h-full items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-colors ${FOCUS_RING} ${
                density === "comfortable" ? "bg-white text-blue-700 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Rows3 className="h-3.5 w-3.5" aria-hidden="true" />
              Comfortable
            </button>
            <button
              type="button"
              aria-pressed={density === "compact"}
              onClick={() => onDensityChange("compact")}
              className={`flex h-full items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-colors ${FOCUS_RING} ${
                density === "compact" ? "bg-white text-blue-700 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Rows2 className="h-3.5 w-3.5" aria-hidden="true" />
              Compact
            </button>
          </div>

          <Popover
            label={
              <>
                <Columns3 className="h-4 w-4" aria-hidden="true" />
                <span>Columns</span>
              </>
            }
            align="right"
            render={() => (
              <fieldset>
                <legend className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  Optional columns
                </legend>
                {(Object.keys(optionalCols) as OptionalColumn[]).map((col) => (
                  <label
                    key={col}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
                  >
                    <input
                      type="checkbox"
                      checked={optionalCols[col]}
                      onChange={() => onToggleOptionalCol(col)}
                      className={`h-4 w-4 rounded border-zinc-300 text-blue-600 ${FOCUS_RING}`}
                    />
                    {OPTIONAL_COLUMN_LABEL[col]}
                  </label>
                ))}
              </fieldset>
            )}
          />
        </div>
      </div>
      <p className="text-xs text-zinc-500">
        Showing <span className="font-semibold text-zinc-700 tabular-nums">{resultCount}</span> of{" "}
        <span className="tabular-nums">{totalCount}</span> SKUs
      </p>
    </div>
  );
}
