"use client";

import { useState } from "react";
import { Pin, MapPin } from "lucide-react";
import {
  DAY_START, DAY_SPAN, getJobsForTech, getTechUtilization, statusFilterMatches, formatRange, pctFmt, STATUS_LABEL,
  type Job, type StatusFilter, type Technician, type TechnicianId,
} from "./data";
import { InitialsAvatar, NUM, FOCUS_RING } from "./ui";

const HOUR_MARKS = [420, 540, 660, 780, 900, 1020, 1080];

function hourMarkLabel(minute: number): string {
  const hour24 = Math.floor(minute / 60);
  const period = hour24 >= 12 ? "p" : "a";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}${period}`;
}

/** Fill class for a job bar — the same neutral-plus-one-accent language as the board's status
 *  badges: green for done, a solid dark neutral for in progress, light zinc for scheduled, a
 *  dashed outline for cancelled. No second saturated hue. */
function barClass(status: Job["status"]): string {
  // `completed` carries white label text on top of the fill, so it needs the 4.5:1 text-contrast
  // shade (green-700), not the 3:1 non-text shade used for the bullet-chart bars elsewhere.
  if (status === "completed") return "bg-green-700";
  if (status === "in_progress") return "bg-zinc-900";
  if (status === "cancelled") return "border border-dashed border-zinc-300 bg-zinc-50";
  return "bg-zinc-300";
}

function TimelineRow({
  tech, jobs, pinned, onTogglePin,
}: {
  tech: Technician;
  jobs: Job[];
  pinned: boolean;
  onTogglePin: () => void;
}) {
  // Ephemeral, local-only inspector state — which job (if any) is hovered or focused on THIS row's
  // timeline. It drives one shared detail line that lives inside this row's own flow (never an
  // absolutely-positioned per-bar decoration), and it never reaches `pinnedTechId` or any other
  // shared state.
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hovered = jobs.find((job) => job.id === hoveredId) ?? null;
  const util = getTechUtilization(tech);

  return (
    <div className="flex min-w-0 items-start gap-3 py-2">
      <h3 className="w-20 min-w-0 shrink-0 sm:w-40">
        <button
          type="button"
          aria-pressed={pinned}
          onClick={onTogglePin}
          className={`flex w-full min-w-0 items-center gap-1.5 rounded-lg border p-2 text-left transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
            pinned ? "border-green-700 bg-green-50" : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
          }`}
        >
          <span className="hidden shrink-0 sm:block">
            <InitialsAvatar name={tech.name} size={24} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-zinc-900">{tech.name}</span>
            <span className={`block truncate text-[10px] text-zinc-500 ${NUM}`}>{pctFmt.format(util.utilization)}</span>
          </span>
          <Pin className={`h-3 w-3 shrink-0 ${pinned ? "text-green-700" : "text-zinc-500"}`} aria-hidden="true" />
        </button>
      </h3>

      <div className="min-w-0 flex-1">
        <div className="relative h-11 min-w-0 rounded-md border border-zinc-100 bg-zinc-50/60">
          {jobs.map((job) => {
            const leftPct = ((job.start - DAY_START) / DAY_SPAN) * 100;
            const widthPct = (job.duration / DAY_SPAN) * 100;
            const isHovered = hoveredId === job.id;
            return (
              <button
                key={job.id}
                type="button"
                aria-pressed={isHovered}
                onMouseEnter={() => setHoveredId(job.id)}
                onMouseLeave={() => setHoveredId((id) => (id === job.id ? null : id))}
                onFocus={() => setHoveredId(job.id)}
                onBlur={() => setHoveredId((id) => (id === job.id ? null : id))}
                onClick={() => setHoveredId((id) => (id === job.id ? null : job.id))}
                style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                className={`absolute inset-y-0.5 flex items-center overflow-hidden rounded px-1 text-left transition-colors motion-reduce:transition-none ${FOCUS_RING} ${barClass(job.status)} ${isHovered ? "ring-2 ring-green-700 ring-offset-1" : ""}`}
              >
                <span className="sr-only">
                  {job.title}, {job.customer}, {formatRange(job.start, job.duration)}, {STATUS_LABEL[job.status]}
                </span>
                <span
                  aria-hidden="true"
                  className={`block w-full truncate text-[10px] font-medium leading-none ${job.status === "in_progress" || job.status === "completed" ? "text-white" : "text-zinc-700"}`}
                >
                  {job.title}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-1 min-h-[1rem] text-xs text-zinc-600" role="status">
          {hovered ? (
            <span className="flex min-w-0 items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="min-w-0 truncate">
                {hovered.title} · {hovered.customer} · {formatRange(hovered.start, hovered.duration)} · {hovered.address}
              </span>
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

export function DayTimeline({
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
    <div className="min-w-0">
      <div aria-hidden="true" className="mb-1 flex min-w-0 items-center gap-3">
        <span className="w-20 shrink-0 sm:w-40" />
        <div className="relative min-w-0 flex-1" style={{ height: 14 }}>
          {HOUR_MARKS.map((m) => (
            <span
              key={m}
              style={{ left: `${((m - DAY_START) / DAY_SPAN) * 100}%` }}
              className="absolute top-0 -translate-x-1/2 text-[10px] text-zinc-500 first:translate-x-0 last:-translate-x-full"
            >
              {hourMarkLabel(m)}
            </span>
          ))}
        </div>
      </div>
      <div className="flex min-w-0 flex-col divide-y divide-zinc-100">
        {technicians.map((tech) => {
          const jobs = getJobsForTech(tech.id).filter((job) => statusFilterMatches(job, statusFilter));
          return (
            <TimelineRow key={tech.id} tech={tech} jobs={jobs} pinned={pinnedTechId === tech.id} onTogglePin={() => onTogglePin(tech.id)} />
          );
        })}
      </div>
    </div>
  );
}
