"use client";

import { useState, type KeyboardEvent } from "react";
import {
  ChevronRight,
  Search,
  X,
  User,
  LogOut,
  Compass,
  Layers,
  TrendingUp,
} from "lucide-react";
import {
  COST_TREE,
  REGION_ORDER,
  type CostNode,
  formatCurrency,
  formatPercent,
  countMatches,
  collectAncestorIdsForMatches,
} from "./cost-data";
import SunburstChart from "./sunburst-chart";
import HierarchyTree from "./hierarchy-tree";

const DEFAULT_EXPANDED = ["root", ...REGION_ORDER];

export default function Page() {
  const [path, setPath] = useState<CostNode[]>([COST_TREE]);
  const [searchQuery, setSearchQuery] = useState("");
  const [extraExpandedIds, setExtraExpandedIds] = useState<Set<string>>(new Set());
  const [sortMode, setSortMode] = useState<"value" | "name">("value");
  const [tableOpen, setTableOpen] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false);

  const focus = path[path.length - 1];
  const parent = path.length > 1 ? path[path.length - 2] : null;
  const shareOfParent = parent ? (focus.value / parent.value) * 100 : 100;
  const shareOfTotal = (focus.value / COST_TREE.value) * 100;
  const topChild = focus.children && focus.children.length > 0
    ? focus.children.reduce((best, c) => (c.value > best.value ? c : best), focus.children[0])
    : null;

  const matchCount = countMatches(COST_TREE, searchQuery);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim().length > 0) {
      const ids = collectAncestorIdsForMatches(COST_TREE, value);
      setExtraExpandedIds((prev) => new Set([...prev, ...ids]));
    }
  };

  const handleAccountKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      setAccountOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-600 text-white">
              <Compass className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="text-sm font-bold text-zinc-900">Contour</span>
            <span className="hidden text-sm font-normal text-zinc-500 sm:inline">Cloud Spend Intelligence</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden whitespace-nowrap text-xs font-normal tabular-nums text-zinc-500 sm:inline">
              Billing period: October 2026
            </span>
            <div className="relative" onKeyDown={handleAccountKeyDown}>
              <button
                type="button"
                onClick={() => setAccountOpen((o) => !o)}
                aria-expanded={accountOpen}
                aria-controls="account-panel"
                className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-1.5 py-1 outline-offset-2 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-orange-600"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="sr-only text-xs font-medium text-zinc-700 sm:not-sr-only sm:inline">Priya Anand</span>
              </button>
              {accountOpen && (
                <div
                  id="account-panel"
                  className="absolute right-0 top-10 w-56 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg"
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-zinc-900">Priya Anand</p>
                    <p className="text-xs font-normal text-zinc-500">priya.anand@contourhq.io</p>
                  </div>
                  <hr className="my-1 border-zinc-200" />
                  <button
                    type="button"
                    onClick={() => setAccountOpen(false)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-normal text-zinc-700 outline-offset-2 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-orange-600"
                  >
                    <LogOut className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto mb-6 max-w-2xl text-center">
          <h1 className="text-2xl font-bold text-zinc-900 sm:text-3xl">Cloud Spend Allocation</h1>
          <p className="mt-1 text-sm font-normal text-zinc-500">
            Drill through every region, service and resource category to see exactly where the ${COST_TREE.value.toLocaleString("en-US")} monthly cloud bill goes.
          </p>
        </div>

        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 xl:flex-row xl:items-start xl:justify-center">
        <div className="flex w-full flex-col items-center gap-6 xl:w-auto">
        <div className="mb-2 flex w-full max-w-3xl flex-col items-center gap-3">
          <nav aria-label="Hierarchy breadcrumb" className="w-full">
            <ol className="flex flex-wrap items-center justify-center gap-1">
              {path.map((node, i) => (
                <li key={node.id} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />}
                  {i === path.length - 1 ? (
                    <span aria-current="page" className="rounded-md px-2 py-1 text-sm font-bold text-zinc-900">
                      {node.name}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPath(path.slice(0, i + 1))}
                      className="rounded-md px-2 py-1 text-sm font-normal text-zinc-500 outline-offset-2 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-orange-600"
                    >
                      {node.name}
                    </button>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="relative w-full max-w-sm">
            <label htmlFor="hierarchy-search" className="sr-only">
              Search cost categories
            </label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
            <input
              id="hierarchy-search"
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search regions, services, categories..."
              className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-9 pr-9 text-sm font-normal text-zinc-900 outline-offset-2 placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-orange-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-zinc-600 outline-offset-2 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-orange-600"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
          {searchQuery.trim().length > 0 && (
            <p className="text-xs font-normal text-zinc-500" role="status">
              {matchCount > 0
                ? `${matchCount} categor${matchCount === 1 ? "y" : "ies"} match "${searchQuery.trim()}" — expanded below.`
                : `No categories match "${searchQuery.trim()}".`}
            </p>
          )}
        </div>

        <h2 className="sr-only">Spend breakdown</h2>
        <section className="mx-auto mb-10 flex max-w-4xl flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
          <SunburstChart path={path} onSetPath={setPath} />

          <div className="w-full max-w-sm flex-shrink-0 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">Current focus</p>
            <p className="mt-1 text-lg font-bold text-zinc-900">{focus.name}</p>
            <p className="text-2xl font-bold tabular-nums text-zinc-900">{formatCurrency(focus.value)}</p>

            <dl className="mt-4 space-y-2.5 border-t border-zinc-200 pt-4">
              {parent && (
                <div className="flex items-center justify-between gap-2">
                  <dt className="flex items-center gap-1.5 text-sm font-normal text-zinc-600">
                    <Layers className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
                    Share of {parent.name}
                  </dt>
                  <dd className="text-sm font-medium tabular-nums text-zinc-900">{formatPercent(shareOfParent)}</dd>
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-sm font-normal text-zinc-600">
                  <TrendingUp className="h-3.5 w-3.5 text-zinc-600" aria-hidden="true" />
                  Share of total spend
                </dt>
                <dd className="text-sm font-medium tabular-nums text-zinc-900">{formatPercent(shareOfTotal)}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-sm font-normal text-zinc-600">Subcategories</dt>
                <dd className="text-sm font-medium tabular-nums text-zinc-900">{focus.children?.length ?? 0}</dd>
              </div>
              {topChild && (
                <div className="flex items-center justify-between gap-2 border-t border-zinc-200 pt-2.5">
                  <dt className="truncate text-sm font-normal text-zinc-600">Largest: {topChild.name}</dt>
                  <dd className="whitespace-nowrap text-sm font-medium tabular-nums text-zinc-900">
                    {formatPercent((topChild.value / focus.value) * 100)}
                  </dd>
                </div>
              )}
            </dl>

            {path.length >= 2 && (
              <p className="mt-4 text-xs font-normal text-zinc-500">
                Segments are shaded in {path[1].name}&apos;s color family; the label and breadcrumb always carry the name — color is never the only cue.
              </p>
            )}
          </div>
        </section>
        </div>

        <div className="mx-auto w-full max-w-3xl xl:mx-0 xl:w-[600px] xl:max-w-none xl:flex-shrink-0">
        <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
            <p className="text-sm font-medium text-zinc-700">
              Accessible fallback: the same hierarchy as a keyboard-navigable list
            </p>
            <button
              type="button"
              onClick={() => setTableOpen((o) => !o)}
              aria-expanded={tableOpen}
              className="rounded-md px-2 py-1 text-xs font-medium text-orange-700 outline-offset-2 hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-orange-600"
            >
              {tableOpen ? "Hide table" : "Show table"}
            </button>
          </div>
          {tableOpen && (
            <div className="px-5 py-4">
              <HierarchyTree
                root={COST_TREE}
                defaultExpandedIds={DEFAULT_EXPANDED}
                onFocusNode={(chain) => setPath(chain)}
                currentFocusId={focus.id}
                searchQuery={searchQuery}
                extraExpandedIds={extraExpandedIds}
                sortMode={sortMode}
                onSortModeChange={setSortMode}
              />
            </div>
          )}
        </section>
        </div>
        </div>
      </main>
    </div>
  );
}
