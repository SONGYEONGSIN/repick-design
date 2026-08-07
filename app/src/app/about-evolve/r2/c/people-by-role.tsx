"use client";

import { useState } from "react";
import { FOCUS_RING, PEOPLE, ROLES, type Role } from "./data";

/**
 * Second wired interaction: a native <select> filtering a fixed roster by function. Default is
 * "All functions" — all 10 names and titles are visible on load, the People-section content
 * contract this delta requires, before the visitor ever opens the dropdown.
 */
export default function PeopleByRole() {
  const [role, setRole] = useState<Role | "all">("all");
  const visible = role === "all" ? PEOPLE : PEOPLE.filter((p) => p.role === role);

  return (
    <div>
      <label className="flex items-center gap-3 text-sm">
        <span className="font-semibold text-zinc-50">Function</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role | "all")}
          className={`rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-normal text-zinc-200 ${FOCUS_RING}`}
        >
          <option value="all">All functions</option>
          {ROLES.map((r) => (
            <option key={r.key} value={r.key}>
              {r.label}
            </option>
          ))}
        </select>
        <span className="font-normal tabular-nums text-zinc-400">
          Showing {visible.length} of {PEOPLE.length}
        </span>
      </label>

      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visible.map((person) => (
          <li key={person.name} className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: person.accent }}
            >
              {person.initials}
            </span>
            <span>
              <span className="block text-sm font-semibold text-zinc-50">{person.name}</span>
              <span className="block text-sm font-normal text-zinc-400">{person.title}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
