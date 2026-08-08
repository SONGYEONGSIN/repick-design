"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, LayoutGrid, MapPin } from "lucide-react";
import {
  DEPARTMENTS,
  DEPARTMENT_LABELS,
  FOCUS_RING,
  LOCATIONS,
  LOCATION_LABELS,
  ROLES,
  type Department,
  type Location,
  type Role,
} from "./data";

type GroupBy = "department" | "location";

const GROUP_OPTIONS: { key: GroupBy; label: string }[] = [
  { key: "department", label: "By department" },
  { key: "location", label: "By location" },
];

/**
 * First and second wired interactions live here. (1) A regroup toggle recomputes the board's
 * columns between department and location — every role stays on screen in either grouping, so the
 * careers content contract (real titles visible with no click) holds under both states, not just
 * the default one. (2) Selecting a role card swaps a single persistent detail panel rendered
 * alongside the board, rather than a drawer or an inline expansion — the panel is a plain <button>
 * selection, so it is reachable purely by Tab and activated with Enter or Space.
 */
export default function RoleBoard() {
  const [groupBy, setGroupBy] = useState<GroupBy>("department");
  const [selectedId, setSelectedId] = useState<string>(ROLES[0].id);

  const selected = useMemo(() => ROLES.find((r) => r.id === selectedId) ?? ROLES[0], [selectedId]);

  const columns = useMemo(() => {
    if (groupBy === "department") {
      return DEPARTMENTS.map((key) => ({
        key,
        label: DEPARTMENT_LABELS[key as Department],
        roles: ROLES.filter((r) => r.department === key),
      }));
    }
    return LOCATIONS.map((key) => ({
      key,
      label: LOCATION_LABELS[key as Location],
      roles: ROLES.filter((r) => r.location === key),
    }));
  }, [groupBy]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div role="group" aria-label="Group open roles by" className="inline-flex rounded-full border border-zinc-800 bg-zinc-900/60 p-1">
          {GROUP_OPTIONS.map((opt) => {
            const active = groupBy === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                aria-pressed={active}
                onClick={() => setGroupBy(opt.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${FOCUS_RING} ${
                  active ? "bg-violet-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <section key={col.key} aria-labelledby={`col-${col.key}`} className="min-w-0">
              <h3
                id={`col-${col.key}`}
                className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400"
              >
                <span>{col.label}</span>
                <span className="tabular-nums text-zinc-500">{col.roles.length}</span>
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {col.roles.map((role) => {
                  const active = role.id === selectedId;
                  return (
                    <li key={role.id}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelectedId(role.id)}
                        className={`w-full rounded-xl border p-3 text-left transition-colors ${FOCUS_RING} ${
                          active
                            ? "border-violet-400 bg-violet-400/10"
                            : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                        }`}
                      >
                        <span className="block text-sm font-semibold leading-snug text-zinc-50">{role.title}</span>
                        <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-normal text-zinc-400">
                          <span className="rounded-full border border-zinc-700 px-1.5 py-0.5 text-zinc-300">{role.band}</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin aria-hidden="true" className="h-3 w-3" />
                            {LOCATION_LABELS[role.location]}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <aside className="lg:col-span-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 lg:sticky lg:top-24" aria-live="polite">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-violet-300">
            <LayoutGrid aria-hidden="true" className="h-3.5 w-3.5" />
            Selected role
          </p>
          <h3 className="mt-3 text-xl font-bold leading-snug text-zinc-50">{selected.title}</h3>
          <p className="mt-1 text-sm font-normal text-zinc-400">
            {DEPARTMENT_LABELS[selected.department]} &middot; {LOCATION_LABELS[selected.location]} &middot; {selected.band}
          </p>
          <p className="mt-4 text-sm font-normal leading-relaxed text-zinc-300">{selected.summary}</p>

          <div className="mt-5">
            <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">What you&apos;ll do</h4>
            <ul className="mt-2 space-y-1.5">
              {selected.responsibilities.map((item) => (
                <li key={item} className="text-sm font-normal leading-relaxed text-zinc-300">
                  &bull; {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5">
            <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">What we&apos;re looking for</h4>
            <ul className="mt-2 space-y-1.5">
              {selected.requirements.map((item) => (
                <li key={item} className="text-sm font-normal leading-relaxed text-zinc-300">
                  &bull; {item}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={`mailto:jobs@loomwork.io?subject=${encodeURIComponent(`Application: ${selected.title}`)}`}
            className={`mt-6 inline-flex items-center gap-1.5 rounded-full bg-violet-400 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-violet-300 ${FOCUS_RING}`}
          >
            Apply for this role
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </aside>
    </div>
  );
}
