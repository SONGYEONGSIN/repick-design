"use client";

import { useState } from "react";
import { FOCUS_RING, OFFICES, REGIONS, type Region } from "./data";

/**
 * First wired interaction: a native <select> filtering a fixed list of offices by region. "All
 * regions" (the default) shows every office, so the directory's core content — city, country,
 * headcount — is fully visible before anyone touches the control.
 */
export default function OfficeDirectory() {
  const [region, setRegion] = useState<Region | "all">("all");
  const visible = region === "all" ? OFFICES : OFFICES.filter((o) => o.region === region);

  return (
    <div>
      <label className="flex items-center gap-3 text-sm">
        <span className="font-semibold text-zinc-50">Region</span>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value as Region | "all")}
          className={`rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-normal text-zinc-200 ${FOCUS_RING}`}
        >
          <option value="all">All regions</option>
          {REGIONS.map((r) => (
            <option key={r.key} value={r.key}>
              {r.label}
            </option>
          ))}
        </select>
        <span className="font-normal tabular-nums text-zinc-400">
          Showing {visible.length} of {OFFICES.length}
        </span>
      </label>

      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((office) => (
          <li key={office.city} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <p className="text-base font-semibold text-zinc-50">{office.city}</p>
            <p className="mt-0.5 text-sm font-normal text-zinc-400">{office.country}</p>
            <p className="mt-3 text-xs font-normal tabular-nums uppercase tracking-[0.08em] text-zinc-400">
              Opened {office.opened} &middot; {office.headcount} people
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
