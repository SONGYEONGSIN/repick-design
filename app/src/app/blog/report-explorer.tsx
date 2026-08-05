"use client";

// app/src/app/blog-evolve/r2/b/report-explorer.tsx
//
// The main interactive controller. Search and category filtering feed both display modes from one
// derived list; the Feed/Compare toggle switches between a chart-forward single-column list and a
// semantic sortable table — the "index scannable for findings, not just headlines" structure this
// candidate is built around. Feed ordering and table ordering are independent state, since a card
// list and a table read naturally in different default orders.
import { useId, useMemo, useState } from "react";
import { LayoutList, Rows3, Search, Table2, X } from "lucide-react";
import { CATEGORIES, REPORTS, TOTAL_REPORTS, metricDelta, type CategoryId } from "./data";
import FeedCard from "./feed-card";
import CompareTable from "./compare-table";

type View = "feed" | "compare";
type FeedSort = "newest" | "effect" | "sampled";

const FEED_SORT_LABEL: Record<FeedSort, string> = {
  newest: "Newest first",
  effect: "Largest effect size",
  sampled: "Most sampled",
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export default function ReportExplorer() {
  const [query, setQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<Set<CategoryId>>(() => new Set());
  const [view, setView] = useState<View>("feed");
  const [feedSort, setFeedSort] = useState<FeedSort>("newest");

  const searchId = useId();
  const sortId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return REPORTS.filter((r) => {
      if (activeCategories.size > 0 && !activeCategories.has(r.category)) return false;
      if (!q) return true;
      const catLabel = CATEGORIES.find((c) => c.id === r.category)?.label ?? "";
      return (
        r.title.toLowerCase().includes(q) ||
        r.dek.toLowerCase().includes(q) ||
        r.excerpt.toLowerCase().includes(q) ||
        r.author.name.toLowerCase().includes(q) ||
        catLabel.toLowerCase().includes(q)
      );
    });
  }, [query, activeCategories]);

  const feedOrdered = useMemo(() => {
    const copy = [...filtered];
    if (feedSort === "effect") {
      copy.sort((a, b) => Math.abs(metricDelta(b.metric).value) - Math.abs(metricDelta(a.metric).value));
    } else if (feedSort === "sampled") {
      copy.sort((a, b) => b.sampleSize - a.sampleSize);
    } else {
      copy.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
    }
    return copy;
  }, [filtered, feedSort]);

  function toggleCategory(id: CategoryId) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearFilters() {
    setQuery("");
    setActiveCategories(new Set());
  }

  const hasActiveFilters = query.trim().length > 0 || activeCategories.size > 0;

  return (
    <section id="report-index" aria-labelledby="report-index-heading" className="min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 id="report-index-heading" className="text-lg font-semibold text-zinc-50">
            Report index
          </h2>
          <p className="mt-1 text-sm font-normal text-zinc-400">
            Compare findings directly, or read the feed with baselines shown inline.
          </p>
        </div>

        <div role="group" aria-label="Display mode" className="flex shrink-0 gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
          <button
            type="button"
            onClick={() => setView("feed")}
            aria-pressed={view === "feed"}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors ${FOCUS_RING} ${
              view === "feed" ? "bg-emerald-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-50"
            }`}
          >
            <Rows3 aria-hidden="true" className="h-4 w-4" />
            Feed
          </button>
          <button
            type="button"
            onClick={() => setView("compare")}
            aria-pressed={view === "compare"}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors ${FOCUS_RING} ${
              view === "compare" ? "bg-emerald-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-50"
            }`}
          >
            <Table2 aria-hidden="true" className="h-4 w-4" />
            Compare
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = activeCategories.has(c.id);
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCategory(c.id)}
                aria-pressed={active}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors ${FOCUS_RING} ${
                  active
                    ? "border-emerald-400 bg-emerald-400 text-zinc-950"
                    : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:text-zinc-50"
                }`}
              >
                <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <label htmlFor={searchId} className="sr-only">
              Search reports
            </label>
            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reports…"
              className="min-h-10 w-full min-w-0 rounded-lg border border-zinc-800 bg-zinc-900 py-2 pr-3 pl-9 text-sm text-zinc-50 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:w-56"
            />
          </div>

          {view === "feed" && (
            <label className="flex items-center gap-2 text-sm text-zinc-400">
              <span className="hidden sm:inline">Sort</span>
              <LayoutList aria-hidden="true" className="h-4 w-4 sm:hidden" />
              <select
                id={sortId}
                value={feedSort}
                onChange={(e) => setFeedSort(e.target.value as FeedSort)}
                aria-label="Sort feed"
                className="min-h-10 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 text-sm font-medium text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                {(Object.keys(FEED_SORT_LABEL) as FeedSort[]).map((key) => (
                  <option key={key} value={key}>
                    {FEED_SORT_LABEL[key]}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-zinc-400" role="status">
        Showing <span className="font-medium tabular-nums text-zinc-50">{filtered.length}</span> of{" "}
        <span className="font-medium tabular-nums text-zinc-50">{TOTAL_REPORTS}</span> reports
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-zinc-800 px-4 py-12 text-center">
          <p className="text-sm text-zinc-400">No reports match the current filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className={`mt-3 inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-zinc-800 px-3.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-900 ${FOCUS_RING}`}
          >
            <X aria-hidden="true" className="h-4 w-4" />
            Clear filters
          </button>
        </div>
      ) : view === "feed" ? (
        <ul className="mt-5 flex flex-col gap-4">
          {feedOrdered.map((report) => (
            <FeedCard key={report.slug} report={report} />
          ))}
        </ul>
      ) : (
        <div className="mt-5">
          <CompareTable reports={filtered} />
        </div>
      )}

      {hasActiveFilters && (
        <div className="mt-4">
          <button
            type="button"
            onClick={clearFilters}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-50 ${FOCUS_RING}`}
          >
            <X aria-hidden="true" className="h-4 w-4" />
            Clear all filters
          </button>
        </div>
      )}
    </section>
  );
}
