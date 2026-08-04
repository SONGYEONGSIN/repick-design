"use client";

import { Eye } from "lucide-react";
import type { Grade, Listing } from "./data";
import { GRADE_INFO, GRADES } from "./data";
import ListingArt from "./listing-art";

export type ListingSort = "recommended" | "price-asc" | "price-desc" | "watchers";

const SORT_LABEL: Record<ListingSort, string> = {
  recommended: "Recommended",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  watchers: "Most watched",
};

function sortListings(items: Listing[], sort: ListingSort): Listing[] {
  const copy = [...items];
  if (sort === "price-asc") copy.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") copy.sort((a, b) => b.price - a.price);
  else if (sort === "watchers") copy.sort((a, b) => b.watchers - a.watchers);
  return copy;
}

export default function ListingsPanel({
  id,
  labelledBy,
  listings,
  total,
  grade,
  onGradeChange,
  sort,
  onSortChange,
}: {
  id: string;
  labelledBy: string;
  listings: Listing[];
  total: number;
  grade: Grade | "All";
  onGradeChange: (g: Grade | "All") => void;
  sort: ListingSort;
  onSortChange: (s: ListingSort) => void;
}) {
  const sorted = sortListings(listings, sort);

  return (
    <div id={id} role="tabpanel" aria-labelledby={labelledBy} tabIndex={0} className="focus-visible:outline-none">
      <h2 className="sr-only">Listings</h2>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by condition grade">
          <button
            type="button"
            onClick={() => onGradeChange("All")}
            aria-pressed={grade === "All"}
            className={`min-h-9 rounded-full px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 ${
              grade === "All" ? "bg-rose-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            All
          </button>
          {GRADES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onGradeChange(g)}
              aria-pressed={grade === g}
              title={GRADE_INFO[g].blurb}
              className={`min-h-9 rounded-full px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 ${
                grade === g ? "bg-rose-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="hidden sm:inline">Sort</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ListingSort)}
            className="min-h-9 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 text-sm font-medium text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
          >
            {(Object.keys(SORT_LABEL) as ListingSort[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABEL[key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-3 text-sm text-zinc-400" role="status">
        Showing <span className="tabular-nums font-medium text-zinc-200">{sorted.length}</span> of{" "}
        <span className="tabular-nums font-medium text-zinc-200">{total}</span> active listings
      </p>

      {sorted.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-zinc-800 px-4 py-10 text-center text-sm text-zinc-400">
          No active listings match this condition grade right now.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {sorted.map((item) => (
            <li key={item.id} className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-2.5 transition-colors hover:border-zinc-700">
              <ListingArt slug={item.slug} title={item.title} icon={item.icon} />
              <div className="mt-2.5 flex items-center gap-1 text-xs font-medium text-rose-300">
                <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" aria-hidden="true" />
                {item.grade}
              </div>
              <h3 className="mt-1 truncate text-sm font-medium text-zinc-100" title={item.title}>
                {item.title}
              </h3>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="tabular-nums text-base font-semibold text-zinc-50">${item.price.toLocaleString()}</span>
                <span className="flex items-center gap-1 text-xs text-zinc-400">
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="tabular-nums">{item.watchers}</span>
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-400">{item.postedLabel}</p>
            </li>
          ))}
        </ul>
      )}

      <details className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
        <summary className="cursor-pointer select-none text-sm font-medium text-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400">
          How condition grades work
        </summary>
        <ul className="mt-3 space-y-2 text-sm text-zinc-400">
          {GRADES.map((g) => (
            <li key={g}>
              <span className="font-medium text-zinc-200">{g}:</span> {GRADE_INFO[g].blurb}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
