"use client";

import { useState } from "react";
import { STAGE_META, STAGE_ORDER, type Finding, type Stage } from "./data";
import { daysOpen, slaTargetDays } from "./format";
import { FindingCard } from "./FindingCard";

type SortKey = "urgency" | "severity" | "newest";

const SORT_LABEL: Record<SortKey, string> = {
  urgency: "SLA urgency",
  severity: "Severity",
  newest: "Newest",
};

const SEVERITY_RANK: Record<Finding["severity"], number> = { critical: 0, high: 1, medium: 2, low: 3 };

function sortFindings(list: Finding[], key: SortKey, todayISO: string): Finding[] {
  const withScore = list.map((f) => ({
    f,
    ratio: daysOpen(f, todayISO) / slaTargetDays(f.severity),
  }));
  withScore.sort((a, b) => {
    switch (key) {
      case "urgency":
        return b.ratio - a.ratio;
      case "severity":
        return SEVERITY_RANK[a.f.severity] - SEVERITY_RANK[b.f.severity];
      case "newest":
        return b.f.discoveredISO.localeCompare(a.f.discoveredISO);
      default:
        return 0;
    }
  });
  return withScore.map((w) => w.f);
}

export function Board({
  grouped,
  selectedId,
  onOpen,
  onAdvance,
  todayISO,
}: {
  grouped: Record<Stage, Finding[]>;
  selectedId: string | null;
  onOpen: (id: string) => void;
  onAdvance: (id: string) => void;
  todayISO: string;
}) {
  return (
    <div className="grid h-full min-h-0 auto-rows-fr gap-4 pb-1 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
      {STAGE_ORDER.map((stage) => (
        <BoardColumn
          key={stage}
          stage={stage}
          findings={grouped[stage]}
          selectedId={selectedId}
          onOpen={onOpen}
          onAdvance={onAdvance}
          todayISO={todayISO}
        />
      ))}
    </div>
  );
}

function BoardColumn({
  stage,
  findings,
  selectedId,
  onOpen,
  onAdvance,
  todayISO,
}: {
  stage: Stage;
  findings: Finding[];
  selectedId: string | null;
  onOpen: (id: string) => void;
  onAdvance: (id: string) => void;
  todayISO: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("urgency");
  const meta = STAGE_META[stage];
  const headingId = `col-${stage}-heading`;
  const selectId = `col-${stage}-sort`;
  const sorted = sortFindings(findings, sortKey, todayISO);

  return (
    <section
      aria-labelledby={headingId}
      className="flex min-h-0 min-w-0 flex-col rounded-xl border border-zinc-200 bg-zinc-50/70"
    >
      <div className="shrink-0 rounded-t-xl border-b border-zinc-200 bg-white px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <h2 id={headingId} className="truncate text-sm font-semibold text-zinc-900">
              {meta.label}
            </h2>
            <span className="shrink-0 rounded-full bg-zinc-100 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-600 tabular-nums">
              {findings.length}
            </span>
          </div>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <label htmlFor={selectId} className="sr-only">
            Sort {meta.label} column by
          </label>
          <select
            id={selectId}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="h-7 w-full rounded-md border border-zinc-200 bg-zinc-50 px-1.5 text-[11px] font-medium text-zinc-600 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:outline-none"
          >
            {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
              <option key={k} value={k}>
                Sort: {SORT_LABEL[k]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 p-2.5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:[scrollbar-width:thin]">
        {sorted.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-200 px-3 py-6 text-center text-xs text-zinc-500">
            No findings match the current filters.
          </p>
        ) : (
          sorted.map((f) => (
            <FindingCard
              key={f.id}
              finding={f}
              selected={f.id === selectedId}
              onOpen={onOpen}
              onAdvance={onAdvance}
              todayISO={todayISO}
            />
          ))
        )}
      </div>
    </section>
  );
}
