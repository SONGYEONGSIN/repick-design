"use client";

import { useId, useMemo, useState } from "react";
import { ArrowRight, LifeBuoy, Search } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Search-focused archetype. The search input is the page's subject — */
/* it filters a fixed, deterministic listing catalog as the visitor   */
/* types, so it always behaves the same way (no live network call).   */
/* ------------------------------------------------------------------ */

const CATALOG = [
  "Vintage bicycles",
  "Standing desks",
  "Film cameras",
  "Mechanical keyboards",
  "Espresso machines",
  "Turntables",
  "Hiking boots",
  "Camping tents",
  "Electric kettles",
  "Bookshelves",
];

const POPULAR_CATEGORIES = ["Vintage bicycles", "Turntables", "Camping tents", "Standing desks"];

export default function NotFoundClient() {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const listboxId = useId();

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return CATALOG.filter((item) => item.toLowerCase().includes(trimmed)).slice(0, 5);
  }, [query]);

  return (
    <div className="flex min-h-dvh flex-col bg-white text-neutral-900">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-6 sm:px-10">
        <span className="text-sm font-semibold tracking-tight text-neutral-900">Harbor</span>
        <a
          href="/"
          className="text-sm font-normal text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 rounded"
        >
          Home
        </a>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-6 py-12 text-center sm:px-10">
        <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">404</span>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          We couldn&apos;t find that listing.
        </h1>
        <p className="mt-3 max-w-md text-sm font-normal leading-relaxed text-neutral-600">
          It may have sold, been taken down by its seller, or the link was mistyped. Try
          searching for it below.
        </p>

        <div className="relative mt-8 w-full max-w-md text-left">
          <label htmlFor={inputId} className="sr-only">
            Search Harbor listings
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            />
            <input
              id={inputId}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search listings, e.g. “camera”"
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls={listboxId}
              autoComplete="off"
              className="block w-full rounded-lg border border-neutral-300 bg-white py-3 pl-10 pr-3.5 text-sm text-neutral-900 shadow-sm outline-none transition-colors placeholder:text-neutral-400 focus-visible:border-teal-600 focus-visible:ring-2 focus-visible:ring-teal-600"
            />
          </div>

          <p className="sr-only" aria-live="polite">
            {query.trim()
              ? `${results.length} matching listing${results.length === 1 ? "" : "s"}`
              : ""}
          </p>

          {results.length > 0 && (
            <ul
              id={listboxId}
              role="listbox"
              aria-label="Matching listings"
              className="mt-2 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm"
            >
              {results.map((item) => (
                <li key={item} role="option" aria-selected={false}>
                  <button
                    type="button"
                    onClick={() => setQuery(item)}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-normal text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600"
                  >
                    <Search className="h-3.5 w-3.5 flex-none text-neutral-400" aria-hidden="true" />
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {query.trim().length > 0 && results.length === 0 && (
            <p className="mt-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm font-normal text-neutral-500">
              No listings match &ldquo;{query.trim()}&rdquo;.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {POPULAR_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setQuery(category)}
              className="rounded-full border border-neutral-300 bg-white px-3.5 py-1.5 text-sm font-normal text-neutral-600 transition-colors hover:border-teal-600 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              {category}
            </button>
          ))}
        </div>

        <a
          href="/"
          className="mt-9 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          Back to home
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>

        <a
          href="mailto:support@harbor.market"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-normal text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 rounded"
        >
          <LifeBuoy className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
          Contact support
        </a>
      </main>
    </div>
  );
}
