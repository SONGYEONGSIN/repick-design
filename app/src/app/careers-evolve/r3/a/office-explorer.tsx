"use client";

import { useId, useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { DEPARTMENTS, FOCUS_RING, HQ_ID, OFFICES, ROLES, type Department, type OfficeId } from "./data";
import TimezoneOverlap from "./timezone-overlap";

const ALL_OFFICES = "all" as const;
type OfficeFilter = OfficeId | typeof ALL_OFFICES;
const ALL_TEAMS = "All teams" as const;
type DeptFilter = Department | typeof ALL_TEAMS;

const TAB_ORDER: OfficeFilter[] = [ALL_OFFICES, ...OFFICES.map((o) => o.id)];

/**
 * The page's primary browsing axis: geography, not a filter chip bolted onto a flat list. A real
 * ARIA tablist (roving tabindex, arrow-key nav) switches between "All offices" and each of the four
 * offices; a native <select> narrows by team on top of whichever office scope is active; a text
 * input narrows further by keyword. None of the three ever fully hides the inventory — the default
 * state (all offices, all teams, empty query) already renders all fourteen real job titles with no
 * click required, and every narrower state keeps at least the "no matches, clear filters" affordance
 * rather than collapsing to nothing silently. A fourth, non-filtering interaction — the timezone-
 * overlap panel in the sidebar — recomputes from the same office selection, so switching tabs also
 * changes what the sidebar shows, not just the list.
 */
export default function OfficeExplorer() {
  const [activeOffice, setActiveOffice] = useState<OfficeFilter>(ALL_OFFICES);
  const [activeDept, setActiveDept] = useState<DeptFilter>(ALL_TEAMS);
  const [query, setQuery] = useState("");
  const searchId = useId();
  const deptId = useId();

  const hq = OFFICES.find((o) => o.id === HQ_ID)!;
  const activeOfficeObj = activeOffice === ALL_OFFICES ? null : OFFICES.find((o) => o.id === activeOffice) ?? null;
  const visibleOffices = activeOfficeObj ? [activeOfficeObj] : OFFICES;

  function onTabKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const currentIndex = TAB_ORDER.indexOf(activeOffice);
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = TAB_ORDER[(currentIndex + dir + TAB_ORDER.length) % TAB_ORDER.length];
    setActiveOffice(next);
    document.getElementById(`office-tab-${next}`)?.focus();
  }

  const filteredRoles = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ROLES.filter((r) => {
      if (activeOffice !== ALL_OFFICES && r.officeId !== activeOffice) return false;
      if (activeDept !== ALL_TEAMS && r.department !== activeDept) return false;
      if (q && !r.title.toLowerCase().includes(q) && !r.department.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [activeOffice, activeDept, query]);

  const grouped = useMemo(
    () => visibleOffices.map((office) => ({ office, roles: filteredRoles.filter((r) => r.officeId === office.id) })),
    [visibleOffices, filteredRoles],
  );

  function clearFilters() {
    setActiveDept(ALL_TEAMS);
    setQuery("");
  }

  return (
    <div>
      {/* Office rail — the primary axis */}
      <div
        role="tablist"
        aria-label="Browse open roles by office"
        onKeyDown={onTabKeyDown}
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible"
      >
        <OfficeTab
          id="all"
          label="All offices"
          sublabel={`${ROLES.length} roles`}
          isActive={activeOffice === ALL_OFFICES}
          onSelect={() => setActiveOffice(ALL_OFFICES)}
        />
        {OFFICES.map((office) => {
          const count = ROLES.filter((r) => r.officeId === office.id).length;
          return (
            <OfficeTab
              key={office.id}
              id={office.id}
              label={office.city}
              sublabel={`${office.tag} · ${count} role${count === 1 ? "" : "s"}`}
              isActive={activeOffice === office.id}
              onSelect={() => setActiveOffice(office.id)}
            />
          );
        })}
      </div>

      <div
        id="office-panel"
        role="tabpanel"
        aria-labelledby={`office-tab-${activeOffice}`}
        tabIndex={0}
        className={`mt-8 grid gap-8 lg:grid-cols-[1fr_320px] ${FOCUS_RING}`}
      >
        <div className="min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <label htmlFor={searchId} className="block text-sm font-semibold text-zinc-900">
                Search roles
              </label>
              <div className="relative mt-1.5">
                <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try &ldquo;compliance&rdquo; or &ldquo;engineer&rdquo;"
                  className={`w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm font-normal text-zinc-900 placeholder:text-zinc-400 ${FOCUS_RING}`}
                />
              </div>
            </div>
            <div>
              <label htmlFor={deptId} className="block text-sm font-semibold text-zinc-900">
                Team
              </label>
              <select
                id={deptId}
                value={activeDept}
                onChange={(e) => setActiveDept(e.target.value as DeptFilter)}
                className={`mt-1.5 w-full rounded-lg border border-zinc-300 bg-white py-2 pl-3 pr-8 text-sm font-normal text-zinc-900 sm:w-auto ${FOCUS_RING}`}
              >
                <option value={ALL_TEAMS}>All teams</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p aria-live="polite" className="mt-5 text-sm font-normal tabular-nums text-zinc-600">
            Showing {filteredRoles.length} of {ROLES.length} open roles
            {activeOfficeObj ? ` in ${activeOfficeObj.city}` : ""}
            {activeDept !== ALL_TEAMS ? ` · ${activeDept}` : ""}
          </p>

          {filteredRoles.length === 0 ? (
            <p className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-sm font-normal text-zinc-600">
              No roles match that combination.{" "}
              <button type="button" onClick={clearFilters} className={`rounded font-semibold text-amber-800 underline underline-offset-2 ${FOCUS_RING}`}>
                Clear filters
              </button>
            </p>
          ) : (
            <div className="mt-4 space-y-8">
              {grouped.map(({ office, roles }) =>
                roles.length === 0 ? null : (
                  <div key={office.id}>
                    {activeOffice === ALL_OFFICES && (
                      <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-900">
                        <MapPin aria-hidden="true" className="h-4 w-4 flex-none text-amber-700" />
                        {office.city}, {office.region}
                        <span className="font-normal text-zinc-500">— {office.tag}</span>
                      </h3>
                    )}
                    <ul className="mt-3 space-y-2">
                      {roles.map((role) => (
                        <li
                          key={role.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4"
                        >
                          <div className="min-w-0">
                            <p className="text-base font-semibold text-zinc-900">{role.title}</p>
                            <p className="mt-0.5 text-sm font-normal text-zinc-600">
                              {role.department} · {office.city} · {role.type}
                            </p>
                          </div>
                          <a
                            href={`mailto:jobs@isoline.io?subject=${encodeURIComponent(`${role.title} — ${office.city}`)}`}
                            className={`inline-flex flex-none items-center gap-1 rounded-full border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-900 hover:border-amber-600 hover:text-amber-800 ${FOCUS_RING}`}
                          >
                            Apply
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        <aside aria-label="Office details" className="h-fit space-y-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              {activeOfficeObj ? `${activeOfficeObj.city}, ${activeOfficeObj.region}` : "All four offices"}
            </h3>
            <p className="mt-1 text-sm font-normal leading-relaxed text-zinc-600">
              {activeOfficeObj
                ? activeOfficeObj.blurb
                : `${OFFICES.reduce((sum, o) => sum + o.headcount, 0)} people across four time zones, all reporting into one HQ.`}
            </p>
          </div>

          {activeOfficeObj && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-sm font-normal leading-relaxed text-zinc-800">{activeOfficeObj.perk}</p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-zinc-900">Overlap with HQ (Austin)</h4>
            <div className="mt-3">
              <TimezoneOverlap offices={visibleOffices} hq={hq} />
            </div>
          </div>

          {!activeOfficeObj && (
            <dl className="grid grid-cols-2 gap-3 border-t border-zinc-200 pt-4">
              {OFFICES.map((o) => (
                <div key={o.id}>
                  <dt className="text-xs font-normal uppercase tracking-wide text-zinc-500">{o.city}</dt>
                  <dd className="text-lg font-semibold tabular-nums text-zinc-900">{o.headcount}</dd>
                </div>
              ))}
            </dl>
          )}
        </aside>
      </div>
    </div>
  );
}

function OfficeTab({
  id,
  label,
  sublabel,
  isActive,
  onSelect,
}: {
  id: string;
  label: string;
  sublabel: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      id={`office-tab-${id}`}
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls="office-panel"
      tabIndex={isActive ? 0 : -1}
      onClick={onSelect}
      className={`flex flex-none flex-col items-start gap-0.5 rounded-xl border px-4 py-2.5 text-left ${FOCUS_RING} ${
        isActive
          ? "border-amber-600 bg-amber-50 text-zinc-900"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
      }`}
    >
      <span className={`text-sm ${isActive ? "font-semibold text-zinc-900" : "font-normal"}`}>{label}</span>
      <span className={`text-xs tabular-nums ${isActive ? "font-normal text-amber-800" : "font-normal text-zinc-500"}`}>{sublabel}</span>
    </button>
  );
}
