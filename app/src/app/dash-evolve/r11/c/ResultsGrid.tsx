"use client";

import { LayoutGrid, List, PackageSearch, SlidersHorizontal, X } from "lucide-react";
import { SORT_OPTIONS, type Supplier, type SortId, type ViewMode } from "./data";
import { SupplierCard, SupplierRow } from "./SupplierCard";
import { BORDER, FOCUS_RING, NUM, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Dropdown, SegmentedControl } from "./ui";

const COMPARE_MAX = 4;

export default function ResultsGrid({
  suppliers,
  totalCount,
  search,
  onSearchChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  compareIds,
  onToggleCompare,
  activeFilterCount,
  onOpenMobileFilters,
}: {
  suppliers: Supplier[];
  totalCount: number;
  search: string;
  onSearchChange: (v: string) => void;
  sort: SortId;
  onSortChange: (v: SortId) => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  activeFilterCount: number;
  onOpenMobileFilters: () => void;
}) {
  return (
    <section aria-labelledby="results-heading" className="min-w-0 flex-1">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 id="results-heading" className="sr-only">
          Supplier results
        </h2>

        <button
          type="button"
          onClick={onOpenMobileFilters}
          className={cx("flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium lg:hidden", BORDER, "bg-white dark:bg-zinc-900", TEXT_PRIMARY, TRANSITION, FOCUS_RING)}
        >
          <SlidersHorizontal size={13} aria-hidden="true" />
          Filters
          {activeFilterCount > 0 ? (
            <span className="ml-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white dark:bg-blue-500">{activeFilterCount}</span>
          ) : null}
        </button>

        <div className="relative min-w-[9rem] flex-1 sm:max-w-xs">
          <label htmlFor="supplier-search" className="sr-only">
            Search within results
          </label>
          <input
            id="supplier-search"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, region, city…"
            className={cx("h-9 w-full rounded-lg border pl-3 pr-8 text-xs", BORDER, "bg-white placeholder:text-zinc-400 dark:bg-zinc-900 dark:placeholder:text-zinc-500", TEXT_PRIMARY, TRANSITION, FOCUS_RING)}
          />
          {search ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onSearchChange("")}
              className={cx("absolute right-1.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md", TEXT_CAPTION, "hover:bg-zinc-100 dark:hover:bg-white/5", FOCUS_RING)}
            >
              <X size={13} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Dropdown label="Sort" ariaLabel="Sort results" options={SORT_OPTIONS} value={sort} onChange={(id) => onSortChange(id as SortId)} />
          <SegmentedControl
            ariaLabel="Results layout"
            value={view}
            onChange={onViewChange}
            options={[
              { id: "grid" as ViewMode, label: "Grid", Icon: LayoutGrid },
              { id: "list" as ViewMode, label: "List", Icon: List },
            ]}
          />
        </div>
      </div>

      <p className={cx("mb-3 text-xs", NUM, TEXT_CAPTION)}>
        Showing <span className="font-semibold text-zinc-700 dark:text-zinc-200">{suppliers.length}</span> of {totalCount} suppliers
        {compareIds.length > 0 ? ` · ${compareIds.length}/${COMPARE_MAX} in compare` : ""}
      </p>

      {suppliers.length === 0 ? (
        <div className={cx("flex flex-col items-center gap-2 rounded-2xl border border-dashed p-12 text-center", BORDER)}>
          <PackageSearch size={28} aria-hidden="true" className={TEXT_CAPTION} />
          <p className={cx("text-sm font-medium", TEXT_PRIMARY)}>No suppliers match these filters</p>
          <p className={cx("text-xs", TEXT_CAPTION)}>Try clearing a facet or broadening your search.</p>
        </div>
      ) : view === "grid" ? (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {suppliers.map((s) => (
            <SupplierCard
              key={s.id}
              supplier={s}
              compareChecked={compareIds.includes(s.id)}
              compareDisabled={compareIds.length >= COMPARE_MAX && !compareIds.includes(s.id)}
              onToggleCompare={() => onToggleCompare(s.id)}
            />
          ))}
        </ul>
      ) : (
        <ul className={cx("overflow-hidden rounded-2xl border", BORDER, "bg-white dark:bg-zinc-900")}>
          {suppliers.map((s) => (
            <SupplierRow
              key={s.id}
              supplier={s}
              compareChecked={compareIds.includes(s.id)}
              compareDisabled={compareIds.length >= COMPARE_MAX && !compareIds.includes(s.id)}
              onToggleCompare={() => onToggleCompare(s.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export { COMPARE_MAX };
