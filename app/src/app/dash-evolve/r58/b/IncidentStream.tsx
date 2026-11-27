"use client";

import { Clock, Server } from "lucide-react";
import { Card, CardTitle, SeverityBadge, StatusBadge, SegmentedControl } from "./ui";
import { ActivitySparkline } from "./ActivitySparkline";
import type { Incident, Severity } from "./data";

type SortMode = "newest" | "severity";

const SEVERITY_RANK: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };

function sortIncidents(rows: Incident[], mode: SortMode): Incident[] {
  if (mode === "newest") return rows; // INCIDENTS is already authored most-recent-first
  return [...rows].sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
}

export function IncidentStream({
  incidents,
  sortMode,
  onSortChange,
  selectedId,
  onSelect,
  totalCount,
}: {
  incidents: Incident[];
  sortMode: SortMode;
  onSortChange: (m: SortMode) => void;
  selectedId: string | null;
  onSelect: (incident: Incident) => void;
  totalCount: number;
}) {
  const rows = sortIncidents(incidents, sortMode);

  return (
    <Card className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle>Activity feed</CardTitle>
          <p className="mt-0.5 text-xs font-normal text-zinc-500">
            Showing {rows.length} of {totalCount} incidents
          </p>
        </div>
        <SegmentedControl
          label="Sort incidents"
          value={sortMode}
          onChange={onSortChange}
          options={[
            { value: "newest", label: "Newest" },
            { value: "severity", label: "Severity" },
          ]}
        />
      </div>

      <div className="mt-4 border-t border-zinc-100 pt-4">
        <ActivitySparkline />
      </div>

      <ul className="mt-4 min-w-0 space-y-2">
        {rows.map((incident) => {
          const isSelected = selectedId === incident.id;
          return (
            <li key={incident.id}>
              <button
                type="button"
                onClick={() => onSelect(incident)}
                aria-pressed={isSelected}
                className={`flex w-full min-w-0 flex-col gap-1.5 rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                  isSelected ? "border-emerald-300 bg-emerald-50/60" : "border-transparent hover:bg-zinc-50"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <SeverityBadge severity={incident.severity} />
                  <StatusBadge status={incident.status} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">{incident.title}</span>
                </div>
                <div className="flex min-w-0 items-center gap-3 text-xs font-normal text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                    <span className="tabular-nums">{incident.time}</span>
                  </span>
                  <span className="flex min-w-0 items-center gap-1">
                    <Server className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                    <span className="min-w-0 truncate">{incident.service}</span>
                  </span>
                </div>
              </button>
            </li>
          );
        })}
        {rows.length === 0 && <p className="py-6 text-center text-sm font-normal text-zinc-500">No incidents match the current filters.</p>}
      </ul>
    </Card>
  );
}
