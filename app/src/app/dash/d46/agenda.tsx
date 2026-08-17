"use client";

import { AlertTriangle, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getTechnician, JOBS, type DayInfo, type SelectedKey, type Status } from "./data";
import { formatTimeRange } from "./format";
import { BORDER, NUM, STATUS_TONE, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Avatar, StatusBadge } from "./ui";

const STATUS_ICON: Record<Status, LucideIcon> = {
  scheduled: Clock,
  "in-progress": PlayCircle,
  completed: CheckCircle2,
  unassigned: AlertTriangle,
};

/**
 * Mobile fallback for both calendar views (per dash-brief-v3 grid-craft rules: a 5-day-by-6-tech
 * table cannot be forced into 390px, so at narrow widths the grid collapses into a day-grouped
 * agenda list instead of a scrolling table). Renders inside `<section aria-label>`, one `<h3>` per
 * day plus a plain job list — no table markup, so it never needs an `overflow-x-auto` wrapper and
 * never risks the sr-only/containing-block trap that a horizontally-scrolled table would.
 */
export default function AgendaList({
  days,
  activeStatuses,
  selectedKey,
  className,
}: {
  days: DayInfo[];
  activeStatuses: Set<Status>;
  selectedKey: SelectedKey;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-col gap-4", className)}>
      {days.map((day) => {
        const dayJobs = JOBS.filter((j) => j.day === day.id && activeStatuses.has(j.status)).sort((a, b) => a.startHour - b.startHour);
        return (
          <section key={day.id} aria-label={`${day.label}, ${day.dateLabel}`} className={cx("rounded-xl border", BORDER, "bg-white")}>
            <div className={cx("flex items-baseline justify-between border-b px-3 py-2", BORDER)}>
              <h3 className={cx("text-sm font-semibold", TEXT_PRIMARY)}>{day.label}</h3>
              <span className={cx("text-xs", TEXT_CAPTION)}>{day.dateLabel}</span>
            </div>
            {dayJobs.length === 0 ? (
              <p className={cx("px-3 py-3 text-sm", TEXT_CAPTION)}>No jobs match the current filters.</p>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {dayJobs.map((job) => {
                  const tech = getTechnician(job.techId);
                  const tone = STATUS_TONE[job.status];
                  const Icon = STATUS_ICON[job.status];
                  const highlighted = selectedKey !== null && (job.techId === selectedKey || (selectedKey === "unassigned" && job.status === "unassigned"));
                  return (
                    <li key={job.id} className={cx("flex items-start gap-2.5 px-3 py-2.5", TRANSITION, highlighted && "bg-amber-50")}>
                      {tech ? (
                        <Avatar avatarId={tech.avatarId} name={tech.name} size={26} />
                      ) : (
                        <span className={cx("grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full border", BORDER, "bg-red-50")}>
                          <AlertTriangle size={13} aria-hidden="true" className="text-red-600" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{job.customer}</p>
                        <p className={cx("truncate text-xs", TEXT_CAPTION_MUTED)}>
                          {tech ? tech.name : "Unassigned"} &middot; {job.jobLabel}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className={cx("text-xs whitespace-nowrap", NUM, TEXT_CAPTION)}>{formatTimeRange(job.startHour, job.durationHours)}</span>
                        <StatusBadge tone={tone} Icon={Icon}>
                          {job.status === "in-progress" ? "Active" : job.status === "scheduled" ? "Upcoming" : job.status === "completed" ? "Done" : "Unassigned"}
                        </StatusBadge>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
