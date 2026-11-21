"use client";

import { useState } from "react";
import { Pin, AlertTriangle, MapPin } from "lucide-react";
import {
  getJobsForTech, getTechUtilization, statusFilterMatches, formatRange, pctFmt,
  type Job, type StatusFilter, type Technician, type TechnicianId,
} from "./data";
import { Badge, InitialsAvatar, NUM, FOCUS_RING } from "./ui";

function statusTone(status: Job["status"]): "success" | "strong" | "muted" | "neutral" {
  if (status === "completed") return "success";
  if (status === "in_progress") return "strong";
  if (status === "cancelled") return "muted";
  return "neutral";
}

const STATUS_SHORT: Record<Job["status"], string> = {
  scheduled: "Scheduled",
  in_progress: "En route",
  completed: "Done",
  cancelled: "Cancelled",
};

function JobCard({ job }: { job: Job }) {
  // Ephemeral, local-only inspector state — hover or focus (or a tap, for touch) reveals the job's
  // address inline, inside this card and nowhere else. It never reads or writes `pinnedTechId` or
  // any other shared state.
  const [expanded, setExpanded] = useState(false);
  const cancelled = job.status === "cancelled";

  return (
    <button
      type="button"
      aria-expanded={expanded}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
      onClick={() => setExpanded((v) => !v)}
      className={`flex w-full min-w-0 flex-col gap-1.5 rounded-lg border p-2.5 text-left transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
        cancelled ? "border-dashed border-zinc-200 bg-zinc-50 opacity-70" : "border-zinc-200 bg-white hover:border-green-200 hover:bg-green-50/40"
      }`}
    >
      <div className="flex min-w-0 items-center justify-between gap-2">
        <span className={`shrink-0 whitespace-nowrap text-xs text-zinc-500 ${NUM}`}>{formatRange(job.start, job.duration)}</span>
        <Badge tone={statusTone(job.status)}>{STATUS_SHORT[job.status]}</Badge>
      </div>
      <p className={`block w-full truncate text-sm font-medium ${cancelled ? "text-zinc-500 line-through" : "text-zinc-900"}`}>
        {job.title}
      </p>
      <div className="flex min-w-0 items-center gap-1.5">
        <InitialsAvatar name={job.customer} size={20} />
        <span className="min-w-0 flex-1 truncate text-xs text-zinc-600">{job.customer}</span>
        {job.priority === "urgent" ? <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-zinc-900" aria-hidden="true" /> : null}
      </div>
      {expanded ? (
        <p className="mt-0.5 flex min-w-0 items-start gap-1 text-xs text-zinc-500">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="block min-w-0 flex-1 truncate">
            {job.address}
            {job.priority === "urgent" ? " · Urgent priority" : ""}
          </span>
        </p>
      ) : null}
    </button>
  );
}

function ColumnHeader({
  tech, pinned, onTogglePin,
}: {
  tech: Technician;
  pinned: boolean;
  onTogglePin: () => void;
}) {
  const util = getTechUtilization(tech);
  return (
    <h3 className="min-w-0">
      <button
        type="button"
        aria-pressed={pinned}
        onClick={onTogglePin}
        className={`flex w-full min-w-0 items-center gap-2 rounded-lg border p-2.5 text-left transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
          pinned ? "border-green-700 bg-green-50" : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
        }`}
      >
        <InitialsAvatar name={tech.name} size={28} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-zinc-900">{tech.name}</span>
          <span className="block truncate text-[11px] text-zinc-500">{tech.role}</span>
        </span>
        <span className={`shrink-0 whitespace-nowrap text-[11px] font-medium text-zinc-600 ${NUM}`}>{pctFmt.format(util.utilization)}</span>
        <Pin className={`h-3.5 w-3.5 shrink-0 ${pinned ? "text-green-700" : "text-zinc-500"}`} aria-hidden="true" />
      </button>
    </h3>
  );
}

export function DispatchBoard({
  statusFilter,
  technicians,
  pinnedTechId,
  onTogglePin,
}: {
  statusFilter: StatusFilter;
  technicians: Technician[];
  pinnedTechId: TechnicianId | null;
  onTogglePin: (id: TechnicianId) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {technicians.map((tech) => {
        const jobs = getJobsForTech(tech.id).filter((job) => statusFilterMatches(job, statusFilter));
        return (
          <div key={tech.id} className="flex min-w-0 flex-col gap-2">
            <ColumnHeader tech={tech} pinned={pinnedTechId === tech.id} onTogglePin={() => onTogglePin(tech.id)} />
            <div className="flex min-w-0 flex-col gap-2 overflow-y-auto rounded-lg border border-zinc-100 bg-zinc-50/50 p-2" style={{ maxHeight: 420 }}>
              {jobs.length === 0 ? (
                <p className="px-2 py-6 text-center text-xs text-zinc-500">No jobs match this filter.</p>
              ) : (
                jobs.map((job) => <JobCard key={job.id} job={job} />)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
