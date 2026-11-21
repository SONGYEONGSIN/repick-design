"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { TECHNICIANS, DAY_LABEL, DAY_START, DAY_END, formatClock, type BoardView, type StatusFilter, type TechnicianId } from "./data";
import { Card, SegmentedControl, DISPLAY_FACE, FOCUS_RING } from "./ui";
import { DispatchBoard } from "./DispatchBoard";
import { DayTimeline } from "./DayTimeline";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "scheduled", label: "Scheduled" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

const VIEW_OPTIONS: { value: BoardView; label: string }[] = [
  { value: "board", label: "Board" },
  { value: "calendar", label: "Calendar" },
];

export function ScheduleSection({
  view,
  onViewChange,
  statusFilter,
  onStatusFilterChange,
  pinnedTechId,
  onTogglePin,
}: {
  view: BoardView;
  onViewChange: (v: BoardView) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (f: StatusFilter) => void;
  pinnedTechId: TechnicianId | null;
  onTogglePin: (id: TechnicianId) => void;
}) {
  // Technician filter — a second, independent filter axis local to this section only. It narrows
  // which columns/rows render below; it is unrelated to `pinnedTechId` (selection) and unrelated to
  // the utilization bullet grid, which always shows every technician regardless of this control.
  const [techFilter, setTechFilter] = useState<"all" | TechnicianId>("all");
  const visibleTechnicians = techFilter === "all" ? TECHNICIANS : TECHNICIANS.filter((t) => t.id === techFilter);

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-zinc-900 sm:text-xl" style={DISPLAY_FACE}>
            {"Today's dispatch"}
          </h2>
          <p className="truncate text-xs text-zinc-500">
            {DAY_LABEL} · {formatClock(DAY_START)} – {formatClock(DAY_END)}
          </p>
        </div>
        <SegmentedControl label="Schedule view" options={VIEW_OPTIONS} value={view} onChange={onViewChange} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SegmentedControl label="Filter jobs by status" options={STATUS_OPTIONS} value={statusFilter} onChange={onStatusFilterChange} />
        <label className="flex h-11 min-w-0 shrink-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3">
          <Filter className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
          <span className="sr-only">Filter by technician</span>
          <select
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value as "all" | TechnicianId)}
            className={`h-full min-w-0 max-w-[12rem] bg-transparent text-sm text-zinc-900 ${FOCUS_RING}`}
          >
            <option value="all">All technicians</option>
            {TECHNICIANS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {view === "board" ? (
        <DispatchBoard statusFilter={statusFilter} technicians={visibleTechnicians} pinnedTechId={pinnedTechId} onTogglePin={onTogglePin} />
      ) : (
        <DayTimeline statusFilter={statusFilter} technicians={visibleTechnicians} pinnedTechId={pinnedTechId} onTogglePin={onTogglePin} />
      )}
    </Card>
  );
}
