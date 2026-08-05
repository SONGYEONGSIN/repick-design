"use client";

import CaseStudyCard from "./case-study-card";
import type { CaseStudy } from "./data";

export default function CaseStudyGrid({
  caseStudies,
  totalCount,
  expandedIds,
  onToggleExpand,
}: {
  caseStudies: CaseStudy[];
  totalCount: number;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}) {
  return (
    <div>
      <p aria-live="polite" className="text-xs font-normal text-zinc-600">
        Showing <span className="font-medium tabular-nums text-zinc-900">{caseStudies.length}</span> of{" "}
        <span className="font-medium tabular-nums text-zinc-900">{totalCount}</span> case studies
      </p>

      {caseStudies.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm font-normal text-zinc-600">
          No case studies match this combination of filters. Try clearing the engagement type or a discipline chip.
        </p>
      ) : (
        <ul className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {caseStudies.map((study) => (
            <CaseStudyCard
              key={study.id}
              study={study}
              expanded={expandedIds.has(study.id)}
              onToggle={() => onToggleExpand(study.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
