"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search, Users } from "lucide-react";
import { DEPARTMENTS, PEOPLE, type Department } from "./data";
import { MonogramAvatar } from "./team-avatar";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

type DepartmentFilter = Department | "All";

function matchesQuery(name: string, role: string, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === "") return true;
  return name.toLowerCase().includes(q) || role.toLowerCase().includes(q);
}

export function TeamDirectory() {
  const [department, setDepartment] = useState<DepartmentFilter>("All");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return PEOPLE.filter(
      (p) =>
        (department === "All" || p.department === department) &&
        matchesQuery(p.name, p.role, query),
    );
  }, [department, query]);

  const clearFilters = () => {
    setDepartment("All");
    setQuery("");
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div
          role="group"
          aria-label="Filter by department"
          className="flex flex-wrap gap-2"
        >
          {(["All", ...DEPARTMENTS] as DepartmentFilter[]).map((dept) => {
            const active = department === dept;
            return (
              <button
                key={dept}
                type="button"
                aria-pressed={active}
                onClick={() => setDepartment(dept)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${FOCUS_RING} ${
                  active
                    ? "border-teal-700 bg-teal-700 text-white"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-teal-700 hover:text-teal-700"
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>

        <div className="w-full sm:w-64">
          <label
            htmlFor="team-search"
            className="mb-1 block text-sm font-medium text-zinc-700"
          >
            Search by name or role
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            />
            <input
              id="team-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Marta, Design"
              className={`w-full rounded-full border border-zinc-300 bg-white py-1.5 pl-9 pr-3.5 text-sm text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
            />
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-zinc-600" aria-live="polite">
        Showing <span className="tabular-nums font-medium text-zinc-900">{filtered.length}</span>{" "}
        of <span className="tabular-nums">{PEOPLE.length}</span> people
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
          <Users className="mx-auto h-8 w-8 text-zinc-500" aria-hidden="true" />
          <p className="mt-3 text-sm text-zinc-700">
            No one matches that department and search combination.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className={`mt-4 rounded-full border border-teal-700 px-4 py-1.5 text-sm font-medium text-teal-700 hover:bg-teal-50 ${FOCUS_RING}`}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((person) => {
            const expanded = expandedId === person.id;
            const panelId = `bio-${person.id}`;
            const nameId = `name-${person.id}`;
            return (
              <li
                key={person.id}
                className="min-w-0 rounded-2xl border border-zinc-200 bg-white"
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() =>
                    setExpandedId((prev) => (prev === person.id ? null : person.id))
                  }
                  className={`flex w-full min-w-0 items-center gap-3 rounded-2xl p-4 text-left ${FOCUS_RING}`}
                >
                  <MonogramAvatar name={person.name} size={48} />
                  <span className="min-w-0 flex-1">
                    <h3 id={nameId} className="truncate font-medium text-zinc-900">
                      {person.name}
                    </h3>
                    <span className="block truncate text-sm text-zinc-600">
                      {person.role}
                    </span>
                    <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                      {person.department}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform motion-reduce:transition-none ${
                      expanded ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={nameId}
                      aria-hidden={!expanded}
                      className="px-4 pb-4"
                    >
                      <p className="border-t border-zinc-100 pt-3 text-sm font-normal leading-relaxed text-zinc-700">
                        {person.bio}
                      </p>
                      <p className="mt-2 text-xs text-zinc-600">
                        Based in {person.office}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
