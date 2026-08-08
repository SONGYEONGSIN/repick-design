"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FOCUS_RING, LOCATION_LABELS, ROLES, TEAM_LABELS, type Location, type Team } from "./data";

const TEAMS = Object.keys(TEAM_LABELS) as Team[];
const LOCATIONS = Object.keys(LOCATION_LABELS) as Location[];

/**
 * First and second wired interactions: a real <fieldset>/<legend> faceted checkbox filter (team +
 * location, both facets empty = show all) driving an always-visible card grid, plus a per-card
 * native <details> that adds responsibilities copy without ever hiding the title. With no boxes
 * checked, every one of the 8 roles renders — the careers content contract holds at the
 * default/no-interaction state.
 */
export default function RoleFilterGrid() {
  const [teams, setTeams] = useState<Set<Team>>(new Set());
  const [locations, setLocations] = useState<Set<Location>>(new Set());

  const rows = useMemo(() => {
    return ROLES.filter((r) => (teams.size === 0 || teams.has(r.team)) && (locations.size === 0 || locations.has(r.location)));
  }, [teams, locations]);

  function toggle<T extends string>(set: Set<T>, setSet: (s: Set<T>) => void, key: T) {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSet(next);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-8">
        <fieldset>
          <legend className="text-sm font-semibold text-zinc-50">Team</legend>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {TEAMS.map((t) => (
              <label key={t} className="inline-flex items-center gap-2 text-sm font-normal text-zinc-300">
                <input
                  type="checkbox"
                  checked={teams.has(t)}
                  onChange={() => toggle(teams, setTeams, t)}
                  className={`h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-teal-400 ${FOCUS_RING}`}
                />
                {TEAM_LABELS[t]}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm font-semibold text-zinc-50">Location</legend>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {LOCATIONS.map((l) => (
              <label key={l} className="inline-flex items-center gap-2 text-sm font-normal text-zinc-300">
                <input
                  type="checkbox"
                  checked={locations.has(l)}
                  onChange={() => toggle(locations, setLocations, l)}
                  className={`h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-teal-400 ${FOCUS_RING}`}
                />
                {LOCATION_LABELS[l]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <p className="mt-4 text-sm font-normal tabular-nums text-zinc-400">
        Showing {rows.length} of {ROLES.length}
      </p>

      {rows.length === 0 ? (
        <p className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-sm font-normal text-zinc-400">
          No roles match that combination.{" "}
          <button
            type="button"
            onClick={() => {
              setTeams(new Set());
              setLocations(new Set());
            }}
            className={`font-semibold text-teal-300 underline ${FOCUS_RING}`}
          >
            Clear filters
          </button>
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {rows.map((role) => (
            <li key={role.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <details>
                <summary className={`flex cursor-pointer list-none items-start justify-between gap-3 ${FOCUS_RING}`}>
                  <span>
                    <span className="block text-base font-semibold text-zinc-50">{role.title}</span>
                    <span className="mt-0.5 block text-sm font-normal text-zinc-400">
                      {TEAM_LABELS[role.team]} &middot; {LOCATION_LABELS[role.location]} &middot; {role.compNote}
                    </span>
                  </span>
                  <ChevronDown aria-hidden="true" className="mt-1 h-4 w-4 flex-none text-zinc-400" />
                </summary>
                <ul className="mt-3 space-y-1.5 border-t border-zinc-800 pt-3">
                  {role.responsibilities.map((r) => (
                    <li key={r} className="text-sm font-normal leading-relaxed text-zinc-300">
                      &bull; {r}
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
