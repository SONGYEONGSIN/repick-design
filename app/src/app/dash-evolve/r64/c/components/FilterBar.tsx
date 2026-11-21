"use client";

import { Search } from "lucide-react";
import { CATEGORIES, SEVERITY_ORDER, SEVERITY_LABEL, STATUS_LABEL, type AlertStatus, type CategoryId, type Severity, type SortMode } from "../lib/data";
import { Dropdown, FOCUS_RING, ToggleChipGroup } from "./ui";

const SEVERITY_TONE: Record<Severity, string> = {
  critical: "border-rose-300 bg-rose-50 text-rose-700",
  high: "border-orange-300 bg-orange-50 text-orange-800",
  medium: "border-amber-300 bg-amber-50 text-amber-800",
  low: "border-zinc-300 bg-zinc-100 text-zinc-700",
};

const STATUS_OPTIONS: { value: AlertStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "open", label: STATUS_LABEL.open },
  { value: "investigating", label: STATUS_LABEL.investigating },
  { value: "resolved", label: STATUS_LABEL.resolved },
  { value: "suppressed", label: STATUS_LABEL.suppressed },
];

const CATEGORY_OPTIONS: { value: CategoryId | "all"; label: string }[] = [
  { value: "all", label: "All categories" },
  ...CATEGORIES.map((c) => ({ value: c.id, label: c.label })),
];

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "severity", label: "Highest severity" },
];

export function FilterBar({
  query,
  onQueryChange,
  severities,
  onToggleSeverity,
  status,
  onStatusChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  severities: Set<Severity>;
  onToggleSeverity: (s: Severity) => void;
  status: AlertStatus | "all";
  onStatusChange: (v: AlertStatus | "all") => void;
  category: CategoryId | "all";
  onCategoryChange: (v: CategoryId | "all") => void;
  sort: SortMode;
  onSortChange: (v: SortMode) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3 border-b border-zinc-200 px-4 py-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Filter by title, asset, or source…"
          aria-label="Filter the alert feed by title, asset, or source"
          className={`h-9 min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 ${FOCUS_RING}`}
        />
      </div>
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <ToggleChipGroup
          ariaLabel="Filter by severity"
          options={SEVERITY_ORDER.map((s) => ({ value: s, label: SEVERITY_LABEL[s] }))}
          active={severities}
          onToggle={onToggleSeverity}
          toneFor={(s) => SEVERITY_TONE[s]}
        />
        <div className="ml-auto flex min-w-0 flex-wrap items-center gap-2">
          <Dropdown label="Status" ariaLabel="Filter by status" value={status} options={STATUS_OPTIONS} onChange={onStatusChange} />
          <Dropdown label="Category" ariaLabel="Filter by category" value={category} options={CATEGORY_OPTIONS} onChange={onCategoryChange} />
          <Dropdown label="Sort" ariaLabel="Sort the alert feed" value={sort} options={SORT_OPTIONS} onChange={onSortChange} />
        </div>
      </div>
    </div>
  );
}
