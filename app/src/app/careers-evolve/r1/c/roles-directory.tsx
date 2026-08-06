"use client";

import { useState } from "react";
import { ChevronDown, ChevronsDownUp, ChevronsUpDown, MapPin, Clock } from "lucide-react";
import { FOCUS_RING, type Department } from "./data";

/**
 * Department-grouped role list. Two wired interactions live here:
 *  1. Per-department expand/collapse — real state (`expanded`), every group starts closed, no
 *     all-open-by-default shortcut.
 *  2. "Expand all" / "collapse all" control — derived from the same state, so it never drifts out
 *     of sync with what's actually open (no separate boolean to forget to update).
 * Group headers are native <button>s wrapping an <h3>, with the role count computed from
 * `roles.length` rather than typed by hand, so the header can never claim a stale total.
 */
export default function RolesDirectory({ departments }: { departments: Department[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(departments.map((d) => [d.slug, false]))
  );

  const allExpanded = departments.every((d) => expanded[d.slug]);

  function toggleAll() {
    const next = !allExpanded;
    setExpanded(Object.fromEntries(departments.map((d) => [d.slug, next])));
  }

  function toggleOne(slug: string) {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-end">
        <button
          type="button"
          onClick={toggleAll}
          className={`inline-flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:border-fuchsia-300 hover:text-fuchsia-700 ${FOCUS_RING}`}
        >
          {allExpanded ? (
            <ChevronsDownUp aria-hidden="true" className="h-4 w-4" />
          ) : (
            <ChevronsUpDown aria-hidden="true" className="h-4 w-4" />
          )}
          {allExpanded ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <div className="divide-y divide-zinc-200 border-y border-zinc-200">
        {departments.map((dept) => {
          const isOpen = Boolean(expanded[dept.slug]);
          const triggerId = `dept-trigger-${dept.slug}`;
          const panelId = `dept-panel-${dept.slug}`;

          return (
            <div key={dept.slug}>
              <h3 className="m-0">
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleOne(dept.slug)}
                  className={`flex w-full items-center justify-between gap-4 py-5 text-left ${FOCUS_RING}`}
                >
                  <span className="text-base font-semibold text-zinc-900">
                    {dept.name}{" "}
                    <span className="font-medium text-zinc-500">({dept.roles.length})</span>
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-5 w-5 shrink-0 text-fuchsia-600 transition-transform duration-200 motion-reduce:transition-none ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
              </h3>

              <div id={panelId} role="region" aria-labelledby={triggerId} hidden={!isOpen} className="pb-5">
                <ul className="flex flex-col gap-3">
                  {dept.roles.map((role) => (
                    <li
                      key={role.title}
                      className="flex flex-col gap-2 rounded-lg border border-zinc-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-6 min-w-9 items-center justify-center rounded border border-fuchsia-200 bg-fuchsia-50 px-1.5 text-xs font-medium tabular-nums text-fuchsia-700">
                          {role.level}
                        </span>
                        <span className="font-medium text-zinc-900">{role.title}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pl-11 text-sm text-zinc-600 sm:pl-0">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin aria-hidden="true" className="h-4 w-4 text-zinc-400" />
                          {role.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock aria-hidden="true" className="h-4 w-4 text-zinc-400" />
                          {role.type}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
