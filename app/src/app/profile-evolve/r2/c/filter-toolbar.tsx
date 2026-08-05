"use client";

import { Check, ListFilter } from "lucide-react";
import { DISCIPLINES, ENGAGEMENT_TYPES, type CaseStudy, type Discipline, type EngagementType } from "./data";

export type SortKey = "recent" | "impact" | "duration";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export default function FilterToolbar({
  caseStudies,
  activeDisciplines,
  onToggleDiscipline,
  engagementFilter,
  onSetEngagementFilter,
  sortKey,
  onSetSortKey,
}: {
  caseStudies: CaseStudy[];
  activeDisciplines: Set<Discipline>;
  onToggleDiscipline: (d: Discipline) => void;
  engagementFilter: EngagementType | "all";
  onSetEngagementFilter: (v: EngagementType | "all") => void;
  sortKey: SortKey;
  onSetSortKey: (v: SortKey) => void;
}) {
  const disciplineCounts = DISCIPLINES.reduce<Record<Discipline, number>>((acc, d) => {
    acc[d] = caseStudies.filter((c) => c.discipline === d).length;
    return acc;
  }, {} as Record<Discipline, number>);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-zinc-600">
          <ListFilter aria-hidden="true" className="h-3.5 w-3.5" />
          Discipline
        </p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter case studies by discipline">
          {DISCIPLINES.map((d) => {
            const active = activeDisciplines.has(d);
            return (
              <button
                key={d}
                type="button"
                aria-pressed={active}
                onClick={() => onToggleDiscipline(d)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${FOCUS_RING} ${
                  active
                    ? "border-blue-700 bg-blue-50 text-blue-700"
                    : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
                }`}
              >
                {active ? <Check aria-hidden="true" className="h-3 w-3" /> : null}
                {d}
                <span className="tabular-nums text-zinc-600">{disciplineCounts[d]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-zinc-200 pt-4 sm:grid-cols-2">
        <fieldset>
          <legend className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-600">Engagement type</legend>
          <div className="inline-flex flex-wrap gap-1 rounded-lg bg-zinc-100 p-1">
            {(["all", ...ENGAGEMENT_TYPES] as const).map((option) => {
              const label = option === "all" ? "All" : option;
              const checked = engagementFilter === option;
              return (
                <label
                  key={option}
                  className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600 has-[:focus-visible]:ring-offset-2 ${
                    checked ? "bg-white text-blue-700 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <input
                    type="radio"
                    name="engagement-type"
                    value={option}
                    checked={checked}
                    onChange={() => onSetEngagementFilter(option)}
                    className="sr-only"
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="sort-key" className="mb-2 block text-xs font-medium uppercase tracking-wide text-zinc-600">
            Sort by
          </label>
          <select
            id="sort-key"
            value={sortKey}
            onChange={(e) => onSetSortKey(e.target.value as SortKey)}
            className={`w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-normal text-zinc-900 ${FOCUS_RING}`}
          >
            <option value="recent">Most recent</option>
            <option value="impact">Highest impact</option>
            <option value="duration">Longest engagement</option>
          </select>
        </div>
      </div>
    </div>
  );
}
