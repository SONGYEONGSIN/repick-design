"use client";

import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { Chip, Segmented, FOCUS_RING } from "./ui";
import { SEVERITY_ORDER, SEVERITY_META, type Severity, type SortKey, type SortDir } from "./data";

export type ViewMode = "board" | "list";

export function FilterBar({
  severityFilter, onToggleSeverity, onClearSeverity,
  slaOnly, onToggleSlaOnly,
  sortKey, sortDir, onSortKeyChange, onToggleDir,
  view, onViewChange,
}: {
  severityFilter: Set<Severity>;
  onToggleSeverity: (s: Severity) => void;
  onClearSeverity: () => void;
  slaOnly: boolean;
  onToggleSlaOnly: () => void;
  sortKey: SortKey;
  sortDir: SortDir;
  onSortKeyChange: (k: SortKey) => void;
  onToggleDir: () => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by severity">
        <Chip active={severityFilter.size === 0} onClick={onClearSeverity}>
          All
        </Chip>
        {SEVERITY_ORDER.map((sev) => (
          <Chip key={sev} active={severityFilter.has(sev)} onClick={() => onToggleSeverity(sev)}>
            {SEVERITY_META[sev].label}
          </Chip>
        ))}
        <Chip active={slaOnly} onClick={onToggleSlaOnly}>
          Breaching SLA
        </Chip>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-zinc-400">Sort</span>
          <Segmented
            label="Sort incidents by"
            value={sortKey}
            onChange={onSortKeyChange}
            options={[
              { value: "sla", label: "SLA" },
              { value: "age", label: "Age" },
              { value: "severity", label: "Severity" },
            ]}
          />
          <button
            type="button"
            onClick={onToggleDir}
            aria-label={sortDir === "asc" ? "Sort ascending, activate for descending" : "Sort descending, activate for ascending"}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-200 ${FOCUS_RING}`}
          >
            {sortDir === "asc" ? (
              <ArrowUpNarrowWide className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ArrowDownWideNarrow className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <Segmented
          label="Board layout"
          value={view}
          onChange={onViewChange}
          options={[
            { value: "board", label: "Board" },
            { value: "list", label: "Compact list" },
          ]}
        />
      </div>
    </div>
  );
}
