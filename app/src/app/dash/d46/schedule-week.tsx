"use client";

import { AlertTriangle, CheckCircle2, Clock, Coffee, PlayCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AgendaList from "./agenda";
import { DAYS, isOffShift, jobsFor, TECHNICIANS, UNASSIGNED_JOBS, WEEK_LABEL, type Job, type SelectedKey, type Status } from "./data";
import { formatTimeRangeCompact } from "./format";
import { BORDER, STATUS_TONE, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Avatar, Card, CardHeader } from "./ui";

const STATUS_ICON: Record<Status, LucideIcon> = {
  scheduled: Clock,
  "in-progress": PlayCircle,
  completed: CheckCircle2,
  unassigned: AlertTriangle,
};

const STATUS_SR_LABEL: Record<Status, string> = {
  scheduled: "Scheduled",
  "in-progress": "In progress",
  completed: "Completed",
  unassigned: "Unassigned",
};

function JobChip({ job }: { job: Job }) {
  const tone = STATUS_TONE[job.status];
  const Icon = STATUS_ICON[job.status];
  return (
    <div className={cx("rounded-lg border-l-2 px-1.5 py-1", tone.border, "bg-white")}>
      <div className="flex items-center gap-1">
        <Icon size={10} aria-hidden="true" className={cx("shrink-0", tone.text)} />
        <span className={cx("truncate text-[11px] font-medium tabular-nums", TEXT_CAPTION_MUTED)}>{formatTimeRangeCompact(job.startHour, job.durationHours)}</span>
        <span className="sr-only">{STATUS_SR_LABEL[job.status]}</span>
      </div>
      <p className={cx("truncate text-[11.5px] font-medium leading-tight", TEXT_PRIMARY)}>{job.customer}</p>
    </div>
  );
}

/**
 * Week grid — the page's dominant visualization. A real `<table>` (caption + scope, no aria-grid
 * reinvention) with `table-fixed` + colgroup `%` widths, so it never needs a horizontal scrollbar at
 * any of the required desktop widths; below `lg` it is replaced entirely by `AgendaList` (a day-list
 * view), per dash-brief-v3's grid-craft rule that a 6-row × 5-column table cannot be forced into
 * 390px. Every job chip shows its time, customer and status as always-visible text — never
 * hover-only — satisfying the "single dominant visualization" completeness rule.
 */
export default function ScheduleWeek({
  activeStatuses,
  selectedKey,
}: {
  activeStatuses: Set<Status>;
  selectedKey: SelectedKey;
}) {
  return (
    <Card as="section" ariaLabelledBy="week-schedule-heading" padded={false} className="overflow-hidden">
      <div className="p-4 sm:p-5">
        <CardHeader as="h2" titleId="week-schedule-heading" title="Week schedule" description={`${WEEK_LABEL} · every technician, Monday through Friday`} />
      </div>

      <div className={cx("hidden border-t px-4 pb-4 sm:px-5 sm:pb-5 lg:block", BORDER)}>
        <table className={cx("w-full table-fixed border-collapse text-sm")}>
          <caption className="sr-only">Weekly dispatch schedule: one row per technician, one column per weekday, showing job time, customer and status.</caption>
          <colgroup>
            <col className="w-[20%]" />
            {DAYS.map((d) => (
              <col key={d.id} className="w-[16%]" />
            ))}
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              <th scope="col" className={cx("px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                Technician
              </th>
              {DAYS.map((d) => (
                <th key={d.id} scope="col" className={cx("px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                  {d.label} <span className="font-normal normal-case">{d.dateLabel}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TECHNICIANS.map((tech) => {
              const selected = selectedKey === tech.id;
              return (
                <tr key={tech.id} className={cx("border-b border-zinc-100 align-top", TRANSITION, selected && "bg-amber-50/60")}>
                  <th scope="row" className="px-2 py-2.5 text-left align-top font-normal">
                    <span className="flex min-w-0 items-center gap-2">
                      <Avatar avatarId={tech.avatarId} name={tech.name} size={24} />
                      <span className="min-w-0">
                        <span className={cx("block truncate text-[13px] font-medium", TEXT_PRIMARY)}>{tech.name}</span>
                        <span className={cx("block truncate text-[11px]", TEXT_CAPTION)}>{tech.role}</span>
                      </span>
                    </span>
                  </th>
                  {DAYS.map((day) => {
                    const jobs = jobsFor(day.id, tech.id).filter((j) => activeStatuses.has(j.status));
                    const off = isOffShift(tech.id, day.id);
                    return (
                      <td key={day.id} className="px-1.5 py-2 align-top">
                        {off ? (
                          <div className={cx("flex items-center gap-1 rounded-lg px-1.5 py-2", "bg-zinc-50")}>
                            <Coffee size={11} aria-hidden="true" className="shrink-0 text-zinc-600" />
                            <span className={cx("text-[11px] font-medium", TEXT_CAPTION_MUTED)}>Off shift</span>
                          </div>
                        ) : jobs.length === 0 ? (
                          <p className={cx("px-1 py-2 text-[11px]", TEXT_CAPTION)}>No jobs</p>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {jobs.map((job) => (
                              <JobChip key={job.id} job={job} />
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            <tr className={cx(selectedKey === "unassigned" && "bg-red-50/60", TRANSITION)}>
              <th scope="row" className="px-2 py-2.5 text-left align-top font-normal">
                <span className="flex items-center gap-2">
                  <span className={cx("grid h-6 w-6 shrink-0 place-items-center rounded-full border", BORDER, "bg-red-50")}>
                    <AlertTriangle size={12} aria-hidden="true" className="text-red-600" />
                  </span>
                  <span className={cx("block text-[13px] font-medium", TEXT_PRIMARY)}>Unassigned</span>
                </span>
              </th>
              {DAYS.map((day) => {
                const jobs = UNASSIGNED_JOBS.filter((j) => j.day === day.id && activeStatuses.has(j.status));
                return (
                  <td key={day.id} className="px-1.5 py-2 align-top">
                    {jobs.length === 0 ? (
                      <p className={cx("px-1 py-2 text-[11px]", TEXT_CAPTION)}>None</p>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {jobs.map((job) => (
                          <JobChip key={job.id} job={job} />
                        ))}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border-t p-4 lg:hidden">
        <AgendaList days={DAYS} activeStatuses={activeStatuses} selectedKey={selectedKey} />
      </div>
    </Card>
  );
}
