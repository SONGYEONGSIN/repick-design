"use client";

import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import CaseStudyGrid from "./case-study-grid";
import FilterToolbar, { type SortKey } from "./filter-toolbar";
import IdentityBar from "./identity-bar";
import { CASE_STUDIES, PROFILE, STATS, type Discipline, type EngagementType } from "./data";

export default function ProfileClient() {
  const [activeDisciplines, setActiveDisciplines] = useState<Set<Discipline>>(new Set());
  const [engagementFilter, setEngagementFilter] = useState<EngagementType | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  function toggleDiscipline(d: Discipline) {
    setActiveDisciplines((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filteredAndSorted = useMemo(() => {
    const filtered = CASE_STUDIES.filter((c) => {
      const disciplineMatch = activeDisciplines.size === 0 || activeDisciplines.has(c.discipline);
      const engagementMatch = engagementFilter === "all" || c.engagementType === engagementFilter;
      return disciplineMatch && engagementMatch;
    });

    const sorted = [...filtered];
    if (sortKey === "recent") sorted.sort((a, b) => b.year - a.year);
    else if (sortKey === "impact") sorted.sort((a, b) => b.impactScore - a.impactScore);
    else sorted.sort((a, b) => b.durationWeeks - a.durationWeeks);
    return sorted;
  }, [activeDisciplines, engagementFilter, sortKey]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <IdentityBar />
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <section aria-labelledby="about-heading" className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6">
          <h2 id="about-heading" className="text-sm font-semibold text-zinc-900">
            About
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-normal leading-relaxed text-zinc-700">{PROFILE.bio}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-zinc-200 pt-4">
            <p className="inline-flex items-center gap-1.5 text-xs font-normal text-zinc-600">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-blue-600" />
              {PROFILE.location}
            </p>
            <p className="text-xs font-normal text-zinc-600">
              {PROFILE.platform} member <span aria-hidden="true">&middot;</span> {PROFILE.handle}
            </p>
          </div>

          <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-zinc-200 pt-4" aria-label="Specialties">
            {PROFILE.specialties.map((s) => (
              <li
                key={s}
                className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="case-studies-heading" className="mt-8">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="case-studies-heading" className="text-sm font-semibold text-zinc-900">
              Case studies
            </h2>
            <p className="text-xs font-normal text-zinc-600">Filter, sort, and expand any case for full metrics.</p>
          </div>

          <FilterToolbar
            caseStudies={CASE_STUDIES}
            activeDisciplines={activeDisciplines}
            onToggleDiscipline={toggleDiscipline}
            engagementFilter={engagementFilter}
            onSetEngagementFilter={setEngagementFilter}
            sortKey={sortKey}
            onSetSortKey={setSortKey}
          />

          <div className="mt-5">
            <CaseStudyGrid
              caseStudies={filteredAndSorted}
              totalCount={CASE_STUDIES.length}
              expandedIds={expandedIds}
              onToggleExpand={toggleExpand}
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs font-normal text-zinc-600 sm:px-6">
          {PROFILE.name} has completed{" "}
          <span className="font-medium tabular-nums text-zinc-900">{STATS.completedEngagements}</span> engagements on{" "}
          {PROFILE.platform} across onboarding, conversion, retention, and design-systems work. The{" "}
          <span className="font-medium tabular-nums text-zinc-900">{CASE_STUDIES.length}</span> case studies above
          are representative highlights.
        </div>
      </footer>
    </div>
  );
}
