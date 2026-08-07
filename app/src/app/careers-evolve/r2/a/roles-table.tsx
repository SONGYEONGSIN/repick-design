"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { FOCUS_RING, ROLES, type Role } from "./data";

type SortKey = "title" | "team" | "location";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "title", label: "Role" },
  { key: "team", label: "Team" },
  { key: "location", label: "Location" },
];

/**
 * First and second wired interactions live here: a real semantic <table> with three
 * aria-sort-enabled column headers (client-side sort of the fixed ROLES array — no fetch, no
 * randomness), and a text search box that filters rows live. All 10 roles render unconditionally
 * before either control is touched — the table itself is the always-visible proof this round's
 * careers delta requires, independent of sort or filter state.
 */
export default function RolesTable() {
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? ROLES.filter(
          (r) => r.title.toLowerCase().includes(q) || r.team.toLowerCase().includes(q) || r.location.toLowerCase().includes(q),
        )
      : ROLES;
    const sorted = [...filtered].sort((a, b) => {
      const cmp = a[sortKey].localeCompare(b[sortKey]);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [query, sortKey, sortDir]);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div>
      <label className="relative block max-w-sm">
        <span className="sr-only">Search roles</span>
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, team, or location"
          className={`w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 text-sm font-normal text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
        />
      </label>
      <p className="mt-3 text-sm font-normal tabular-nums text-zinc-600">
        Showing {rows.length} of {ROLES.length}
      </p>

      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">Open roles at Ridgeline, sortable by role, team, or location</caption>
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              {COLUMNS.map((col) => {
                const isActive = col.key === sortKey;
                const ariaSort = isActive ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                return (
                  <th key={col.key} scope="col" aria-sort={ariaSort} className="w-1/4 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onSort(col.key)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-700 ${FOCUS_RING}`}
                    >
                      {col.label}
                      {isActive ? (
                        sortDir === "asc" ? (
                          <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />
                        )
                      ) : (
                        <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5 text-zinc-400" />
                      )}
                    </button>
                  </th>
                );
              })}
              <th scope="col" className="w-1/4 px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-700">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {rows.map((role) => (
              <RoleRow key={role.id} role={role} />
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm font-normal text-zinc-600">
                  No roles match &ldquo;{query}&rdquo;.{" "}
                  <button type="button" onClick={() => setQuery("")} className={`font-semibold text-orange-800 underline ${FOCUS_RING}`}>
                    Clear search
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoleRow({ role }: { role: Role }) {
  return (
    <tr>
      <td className="px-4 py-3 text-sm font-semibold text-zinc-900">{role.title}</td>
      <td className="px-4 py-3 text-sm font-normal text-zinc-700">{role.team}</td>
      <td className="px-4 py-3 text-sm font-normal text-zinc-700">{role.location}</td>
      <td className="px-4 py-3 text-sm font-normal text-zinc-700">{role.type}</td>
    </tr>
  );
}
