"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Blocks,
  ChevronDown,
  LayoutGrid,
  List,
  Loader2,
  PackageSearch,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  CATEGORIES,
  INTEGRATIONS,
  PRICING_OPTIONS,
  SORT_LABELS,
  formatCount,
  type Category,
  type Integration,
  type Pricing,
  type SortKey,
} from "./data";
import FilterRail from "./filter-rail";
import IntegrationCard from "./integration-card";
import DetailDrawer from "./detail-drawer";

const PAGE_SIZE = 9;

interface ActiveFilters {
  categories: Set<Category>;
  pricing: Set<Pricing>;
  minRating: number;
  verifiedOnly: boolean;
  search: string;
}

type FilterKey = keyof ActiveFilters;

function itemMatches(item: Integration, f: ActiveFilters, skip?: FilterKey): boolean {
  if (skip !== "categories" && f.categories.size > 0 && !f.categories.has(item.category)) return false;
  if (skip !== "pricing" && f.pricing.size > 0 && !f.pricing.has(item.pricing)) return false;
  if (skip !== "minRating" && f.minRating > 0 && item.rating < f.minRating) return false;
  if (skip !== "verifiedOnly" && f.verifiedOnly && item.status !== "Verified") return false;
  if (skip !== "search" && f.search.trim()) {
    const q = f.search.trim().toLowerCase();
    if (!item.name.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) return false;
  }
  return true;
}

function sortItems(items: Integration[], sortKey: SortKey): Integration[] {
  const copy = [...items];
  switch (sortKey) {
    case "installs":
      return copy.sort((a, b) => b.installs - a.installs);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case "newest":
      return copy.sort((a, b) => a.addedOrder - b.addedOrder);
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return copy;
  }
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 px-6 py-16 text-center">
      <PackageSearch className="h-10 w-10 text-zinc-400" aria-hidden="true" />
      <p className="mt-4 text-base font-semibold text-zinc-50">No integrations match your filters</p>
      <p className="mt-1.5 max-w-sm text-sm font-normal text-zinc-400">
        Try widening your category or pricing selection, or clear every filter to see the full catalog
        again.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      >
        <RotateCcw className="h-4 w-4 flex-none" aria-hidden="true" />
        Clear all filters
      </button>
    </div>
  );
}

export default function CatalogClient() {
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set());
  const [selectedPricing, setSelectedPricing] = useState<Set<Pricing>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("installs");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Integration | null>(null);
  const [installedIds, setInstalledIds] = useState<Set<string>>(new Set());
  const [scrolled, setScrolled] = useState(false);

  const loadMoreTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (loadMoreTimeout.current) clearTimeout(loadMoreTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    mobileCloseRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileFiltersOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileFiltersOpen]);

  const filters: ActiveFilters = useMemo(
    () => ({ categories: selectedCategories, pricing: selectedPricing, minRating, verifiedOnly, search }),
    [selectedCategories, selectedPricing, minRating, verifiedOnly, search],
  );

  const filterSignature = [
    [...selectedCategories].sort().join(","),
    [...selectedPricing].sort().join(","),
    minRating,
    verifiedOnly,
    search.trim().toLowerCase(),
    sortKey,
  ].join("|");

  // Reset pagination when the filter/sort criteria change. Adjusted during render (React's
  // documented pattern for derived state) rather than in an effect, so there is no extra
  // commit-then-cascade render.
  const [prevSignature, setPrevSignature] = useState(filterSignature);
  if (filterSignature !== prevSignature) {
    setPrevSignature(filterSignature);
    setVisibleCount(PAGE_SIZE);
  }

  const filteredSorted = useMemo(
    () => sortItems(INTEGRATIONS.filter((item) => itemMatches(item, filters)), sortKey),
    [filters, sortKey],
  );

  const categoryCounts = useMemo(() => {
    const counts = {} as Record<Category, number>;
    for (const category of CATEGORIES) {
      counts[category] = INTEGRATIONS.filter(
        (item) => item.category === category && itemMatches(item, filters, "categories"),
      ).length;
    }
    return counts;
  }, [filters]);

  const pricingCounts = useMemo(() => {
    const counts = {} as Record<Pricing, number>;
    for (const pricing of PRICING_OPTIONS) {
      counts[pricing] = INTEGRATIONS.filter(
        (item) => item.pricing === pricing && itemMatches(item, filters, "pricing"),
      ).length;
    }
    return counts;
  }, [filters]);

  const visibleItems = filteredSorted.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSorted.length;
  const remaining = filteredSorted.length - visibleCount;

  function toggleCategory(category: Category) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  function togglePricing(pricing: Pricing) {
    setSelectedPricing((prev) => {
      const next = new Set(prev);
      if (next.has(pricing)) next.delete(pricing);
      else next.add(pricing);
      return next;
    });
  }

  function clearAll() {
    setSelectedCategories(new Set());
    setSelectedPricing(new Set());
    setMinRating(0);
    setVerifiedOnly(false);
    setSearch("");
  }

  function handleLoadMore() {
    setLoadingMore(true);
    loadMoreTimeout.current = setTimeout(() => {
      setVisibleCount((v) => Math.min(v + PAGE_SIZE, filteredSorted.length));
      setLoadingMore(false);
    }, 350);
  }

  function toggleInstalled(id: string) {
    setInstalledIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const chips: Array<{ key: string; label: string; onRemove: () => void }> = [
    ...[...selectedCategories].map((c) => ({
      key: `cat-${c}`,
      label: c,
      onRemove: () => toggleCategory(c),
    })),
    ...[...selectedPricing].map((p) => ({
      key: `price-${p}`,
      label: p,
      onRemove: () => togglePricing(p),
    })),
    ...(minRating > 0
      ? [{ key: "rating", label: `${minRating.toFixed(1)}+ rating`, onRemove: () => setMinRating(0) }]
      : []),
    ...(verifiedOnly
      ? [{ key: "verified", label: "Verified only", onRemove: () => setVerifiedOnly(false) }]
      : []),
    ...(search.trim()
      ? [{ key: "search", label: `"${search.trim()}"`, onRemove: () => setSearch("") }]
      : []),
  ];

  const activeFilterCount = chips.length;

  const railProps = {
    selectedCategories,
    onToggleCategory: toggleCategory,
    categoryCounts,
    selectedPricing,
    onTogglePricing: togglePricing,
    pricingCounts,
    minRating,
    onChangeMinRating: setMinRating,
    verifiedOnly,
    onToggleVerified: () => setVerifiedOnly((v) => !v),
  };

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <a
        href="#catalog-results"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-emerald-400 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-zinc-950 focus-visible:outline-none"
      >
        Skip to results
      </a>

      <header
        className={`sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur transition-[padding] duration-200 motion-reduce:transition-none ${
          scrolled ? "py-2.5 shadow-lg shadow-black/30" : "py-4"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-none items-center gap-2.5">
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-emerald-400/10 ring-1 ring-emerald-400/30">
              <Blocks className="h-4.5 w-4.5 text-emerald-400" aria-hidden="true" />
            </span>
            <span
              style={{ fontFamily: "var(--font-display-grotesk)" }}
              className="text-lg font-semibold tracking-tight text-zinc-50"
            >
              Loopwire
            </span>
          </div>

          <div className="relative min-w-[10rem] flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <label htmlFor="catalog-search" className="sr-only">
              Search integrations
            </label>
            <input
              id="catalog-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search integrations"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pr-3 pl-9 text-sm font-normal text-zinc-50 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            />
          </div>

          <div className="relative flex-none">
            <label htmlFor="catalog-sort" className="sr-only">
              Sort by
            </label>
            <select
              id="catalog-sort"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="appearance-none rounded-lg border border-zinc-800 bg-zinc-900 py-2 pr-8 pl-3 text-sm font-medium text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              {(Object.entries(SORT_LABELS) as Array<[SortKey, string]>).map(([key, label]) => (
                <option key={key} value={key}>
                  Sort: {label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
          </div>

          <div role="group" aria-label="Grid or list view" className="flex flex-none gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
            <button
              type="button"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                view === "grid" ? "bg-zinc-800 font-semibold text-zinc-50" : "font-medium text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <LayoutGrid className="h-4 w-4 flex-none" aria-hidden="true" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                view === "list" ? "bg-zinc-800 font-semibold text-zinc-50" : "font-medium text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <List className="h-4 w-4 flex-none" aria-hidden="true" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="relative inline-flex flex-none items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 flex-none" aria-hidden="true" />
            Filters
            {activeFilterCount > 0 && (
              <span className="inline-flex h-4.5 min-w-4.5 flex-none items-center justify-center rounded-full bg-emerald-400 px-1 text-[11px] font-semibold tabular-nums text-zinc-950">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <p className="flex-none text-sm font-semibold tabular-nums text-zinc-50" aria-live="polite">
            {formatCount(filteredSorted.length)} <span className="font-normal text-zinc-400">integrations</span>
          </p>
          {chips.length > 0 ? (
            <ul className="flex flex-1 flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <li key={chip.key}>
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 py-1 pr-2 pl-3 text-xs font-medium text-zinc-200 transition-colors hover:border-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    {chip.label}
                    <X className="h-3 w-3 flex-none" aria-hidden="true" />
                    <span className="sr-only">Remove filter: {chip.label}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded text-xs font-medium text-emerald-300 underline underline-offset-2 hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                >
                  Clear all
                </button>
              </li>
            </ul>
          ) : (
            <p className="flex-1 text-xs font-normal text-zinc-400">No filters applied</p>
          )}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[260px_1fr] lg:px-8">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-28">
            <FilterRail idPrefix="desktop" {...railProps} />
          </div>
        </aside>

        <main id="catalog-results" className="min-w-0">
          <h1
            style={{ fontFamily: "var(--font-display-grotesk)" }}
            className="text-2xl font-semibold tracking-tight text-zinc-50"
          >
            Browse integrations
          </h1>
          <p className="mt-1.5 max-w-prose text-sm font-normal text-zinc-400">
            Connect Loopwire to the tools your team already runs. Filter by category, pricing, and
            rating to find the right fit.
          </p>

          {filteredSorted.length === 0 ? (
            <EmptyState onClear={clearAll} />
          ) : (
            <>
              <ul
                role="list"
                className={
                  view === "grid"
                    ? "mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                    : "mt-6 flex flex-col gap-3"
                }
              >
                {visibleItems.map((item, index) => (
                  <IntegrationCard
                    key={item.id}
                    item={item}
                    view={view}
                    index={index}
                    onSelect={setSelectedItem}
                  />
                ))}
              </ul>

              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-50 transition-colors hover:border-zinc-600 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loadingMore && (
                      <Loader2 className="h-4 w-4 flex-none animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    )}
                    Load {Math.min(PAGE_SIZE, remaining)} more
                    <span className="tabular-nums text-zinc-400">({remaining} remaining)</span>
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-6 animate-[rise_0.3s_ease-out_backwards] motion-reduce:animate-none"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-semibold text-zinc-50">Filters</p>
              <button
                ref={mobileCloseRef}
                type="button"
                aria-label="Close filters"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6">
              <FilterRail idPrefix="mobile" {...railProps} />
            </div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-8 w-full rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              Show {formatCount(filteredSorted.length)} results
            </button>
          </div>
        </div>
      )}

      <DetailDrawer
        item={selectedItem}
        installed={selectedItem ? installedIds.has(selectedItem.id) : false}
        onToggleInstall={() => selectedItem && toggleInstalled(selectedItem.id)}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
