"use client";

import { Building2, ShieldCheck, Star, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CommandPalette from "./CommandPalette";
import CompareTray from "./CompareTray";
import FacetPanel from "./FacetPanel";
import ResultsGrid, { COMPARE_MAX } from "./ResultsGrid";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import {
  AVERAGE_SCORE,
  EMPTY_FILTERS,
  SUPPLIERS,
  TOTAL_SUPPLIERS,
  VERIFIED_COUNT,
  activeFilterCount,
  sortSuppliers,
  supplierById,
  supplierMatches,
  type Filters,
  type SortId,
  type ViewMode,
} from "./data";
import { APP_BG, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";

export default function SourcemarkClient() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortId>("relevance");
  const [view, setView] = useState<ViewMode>("grid");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [facetDrawerOpen, setFacetDrawerOpen] = useState(false);
  const [compareTrayOpen, setCompareTrayOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

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

  const filteredSorted = useMemo(() => {
    const matched = SUPPLIERS.filter((s) => supplierMatches(s, filters, search));
    return sortSuppliers(matched, sort);
  }, [filters, search, sort]);

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= COMPARE_MAX) return prev;
      if (prev.length === 0) setCompareTrayOpen(true);
      return [...prev, id];
    });
  }

  function removeFromCompare(id: string) {
    setCompareIds((prev) => prev.filter((x) => x !== id));
  }

  function selectSupplierFromPalette(name: string) {
    setSearch(name);
  }

  const compareSuppliers = useMemo(
    () =>
      compareIds
        .map((id) => supplierById(id))
        .filter((s): s is NonNullable<typeof s> => Boolean(s)),
    [compareIds],
  );

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", APP_BG, TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto flex max-w-[1680px] flex-col gap-4 p-4 sm:p-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>Browse Suppliers</h1>
                <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Sourcemark directory · {TOTAL_SUPPLIERS} suppliers across 6 categories and 5 regions</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <InlineStat icon={Building2} label="Suppliers" value={String(TOTAL_SUPPLIERS)} />
                <InlineStat icon={ShieldCheck} label="Verified" value={String(VERIFIED_COUNT)} />
                <InlineStat icon={Star} label="Avg. rating" value={AVERAGE_SCORE.toFixed(1)} />
              </div>
            </header>

            <div className="flex flex-col items-start gap-4 lg:flex-row">
              <FacetPanel filters={filters} onChange={setFilters} mobileOpen={facetDrawerOpen} onCloseMobile={() => setFacetDrawerOpen(false)} />
              <ResultsGrid
                suppliers={filteredSorted}
                totalCount={TOTAL_SUPPLIERS}
                search={search}
                onSearchChange={setSearch}
                sort={sort}
                onSortChange={setSort}
                view={view}
                onViewChange={setView}
                compareIds={compareIds}
                onToggleCompare={toggleCompare}
                activeFilterCount={activeFilterCount(filters)}
                onOpenMobileFilters={() => setFacetDrawerOpen(true)}
              />
            </div>
          </div>
        </main>
      </div>

      <CompareTray suppliers={compareSuppliers} open={compareTrayOpen} onOpenChange={setCompareTrayOpen} onRemove={removeFromCompare} />

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectSupplier={selectSupplierFromPalette} /> : null}
    </div>
  );
}

function InlineStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <Icon size={12} aria-hidden="true" className={TEXT_CAPTION} />
        <span className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>{label}</span>
      </div>
      <p className={cx("mt-0.5 truncate text-lg font-semibold", NUM, TEXT_PRIMARY)}>{value}</p>
    </div>
  );
}
