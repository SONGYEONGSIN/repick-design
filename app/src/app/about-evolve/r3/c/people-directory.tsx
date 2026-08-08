"use client";

import { useId, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { PEOPLE, FOCUS_RING } from "./data";
import AvatarMonogram from "./avatar-monogram";

/**
 * Third wired interaction: a type-to-filter quick-find over the full sixteen-person roster —
 * deliberately a text input, not a <select> or chip filters. It matches name, role, team, and
 * region as one string, so "Lisbon-adjacent backend engineer" style queries ("Europe backend")
 * work without a second control. The full roster renders with no query (proof up front, matching
 * the always-visible-by-default pattern the rest of the page uses), the match count is in a live
 * region so it's announced on every keystroke, and an explicit empty state replaces a blank list
 * rather than leaving one behind.
 */
export default function PeopleDirectory() {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const countId = useId();

  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalized) return PEOPLE;
    return PEOPLE.filter((p) =>
      `${p.name} ${p.role} ${p.team} ${p.region}`.toLowerCase().includes(normalized)
    );
  }, [normalized]);

  return (
    <div>
      <div className="max-w-sm">
        <label htmlFor={inputId} className="block text-sm font-semibold text-zinc-200">
          Quick-find
        </label>
        <div className="relative mt-2">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
          />
          <input
            id={inputId}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, role, team, or region"
            aria-describedby={countId}
            className={`w-full rounded-lg border border-zinc-800 bg-zinc-900/60 py-2.5 pl-9 pr-9 text-sm font-normal text-zinc-50 placeholder:text-zinc-500 ${FOCUS_RING}`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear quick-find"
              className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-500 hover:text-zinc-200 ${FOCUS_RING}`}
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          )}
        </div>
        <p id={countId} aria-live="polite" className="mt-2 text-sm font-normal tabular-nums text-zinc-400">
          Showing {results.length} of {PEOPLE.length}
        </p>
      </div>

      {results.length > 0 ? (
        <ul className="mt-6 divide-y divide-zinc-800 border-y border-zinc-800">
          {results.map((p) => (
            <li key={p.id} className="grid grid-cols-1 items-center gap-3 py-3.5 sm:grid-cols-[1fr_1fr_auto]">
              <div className="flex min-w-0 items-center gap-3">
                <AvatarMonogram initials={p.initials} accent={p.accent} className="h-9 w-9 flex-none" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-50">{p.name}</p>
                  <p className="truncate text-sm font-normal text-zinc-400">{p.role}</p>
                </div>
              </div>
              <p className="truncate text-sm font-normal text-zinc-400 sm:pl-12">{p.team}</p>
              <p className="text-sm font-normal tabular-nums text-zinc-500 sm:text-right">{p.region}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-zinc-800 p-6 text-center">
          <p className="text-sm font-semibold text-zinc-200">No matches for &ldquo;{query}&rdquo;</p>
          <p className="mt-1 text-sm font-normal text-zinc-400">
            Try a first name, a role like &ldquo;engineer,&rdquo; or a region like &ldquo;Europe.&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
