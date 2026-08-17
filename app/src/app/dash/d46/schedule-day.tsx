"use client";

import { Coffee } from "lucide-react";
import AgendaList from "./agenda";
import { DAYS, getDay, isOffShift, jobsFor, TECHNICIANS, UNASSIGNED_JOBS, type DayId, type SelectedKey, type Status } from "./data";
import { formatTimeRangeCompact } from "./format";
import { BORDER, FOCUS_RING, NUM, STATUS_TONE, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Avatar, Card, CardHeader } from "./ui";

const WINDOW_START = 8;
const WINDOW_END = 18;
const WINDOW_HOURS = WINDOW_END - WINDOW_START;
const TICKS = [8, 10, 12, 14, 16, 18];

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Day timeline — the alternate orientation of the same dominant visualization, selected by the
 * Week/Day toggle. One horizontal row per technician spanning the 8:00–18:00 shift window; job
 * blocks are positioned with plain percentage arithmetic (no trig, but still rounded to 2 decimals
 * for hydration-stable SVG-style coordinates). Because a very short job's block can be too narrow to
 * hold its own label, every row also carries a plain-text job list underneath — so the key values
 * (time, customer, status) stay always-visible regardless of block width, never hover-only.
 */
export default function ScheduleDay({
  selectedDay,
  onSelectDay,
  activeStatuses,
  selectedKey,
}: {
  selectedDay: DayId;
  onSelectDay: (day: DayId) => void;
  activeStatuses: Set<Status>;
  selectedKey: SelectedKey;
}) {
  const day = getDay(selectedDay);
  const unassignedToday = UNASSIGNED_JOBS.filter((j) => j.day === selectedDay && activeStatuses.has(j.status));

  return (
    <Card as="section" ariaLabelledBy="day-schedule-heading" padded={false} className="overflow-hidden">
      <div className="p-4 sm:p-5">
        <CardHeader as="h2" titleId="day-schedule-heading" title="Day timeline" description="8:00 AM–6:00 PM shift window, one row per technician" />

        <div role="radiogroup" aria-label="Select a day" className="mt-3 flex flex-wrap gap-1.5">
          {DAYS.map((d) => {
            const active = d.id === selectedDay;
            return (
              <button
                key={d.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onSelectDay(d.id)}
                className={cx(
                  "flex h-9 flex-col items-center justify-center rounded-lg border px-3",
                  TRANSITION,
                  FOCUS_RING,
                  active ? "border-amber-300 bg-amber-50" : cx(BORDER, "bg-white hover:bg-zinc-50"),
                )}
              >
                <span className={cx("text-[11px] font-semibold leading-tight", active ? "text-amber-800" : TEXT_PRIMARY)}>{d.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={cx("hidden border-t px-4 pb-4 sm:px-5 sm:pb-5 lg:block", BORDER)}>
        <div className="flex text-[10px] font-medium uppercase tracking-wide">
          <div className="w-36 shrink-0" aria-hidden="true" />
          <div className={cx("flex flex-1 justify-between px-0.5", TEXT_CAPTION)}>
            {TICKS.map((h) => (
              <span key={h}>{h > 12 ? `${h - 12}p` : h === 12 ? "12p" : `${h}a`}</span>
            ))}
          </div>
        </div>

        <ul className="mt-1 flex flex-col">
          {TECHNICIANS.map((tech) => {
            const jobs = jobsFor(selectedDay, tech.id).filter((j) => activeStatuses.has(j.status));
            const off = isOffShift(tech.id, selectedDay);
            const selected = selectedKey === tech.id;
            return (
              <li key={tech.id} className={cx("flex items-start gap-3 border-b border-zinc-100 py-2.5 last:border-0", TRANSITION, selected && "bg-amber-50/60 rounded-lg")}>
                <div className="flex w-36 shrink-0 items-center gap-2 pl-1">
                  <Avatar avatarId={tech.avatarId} name={tech.name} size={22} />
                  <span className={cx("min-w-0 truncate text-[12.5px] font-medium", TEXT_PRIMARY)}>{tech.name}</span>
                </div>

                <div className="min-w-0 flex-1">
                  {off ? (
                    <div className={cx("flex h-7 items-center gap-1.5 rounded-md px-2", "bg-zinc-50")}>
                      <Coffee size={12} aria-hidden="true" className="shrink-0 text-zinc-600" />
                      <span className={cx("text-[11px] font-medium", TEXT_CAPTION_MUTED)}>Off shift — no jobs scheduled</span>
                    </div>
                  ) : (
                    <>
                      <div className="relative h-7 rounded-md bg-zinc-50" aria-hidden="true">
                        {jobs.map((job) => {
                          const left = round2(Math.max(0, ((job.startHour - WINDOW_START) / WINDOW_HOURS) * 100));
                          const width = round2(Math.min(100 - left, (job.durationHours / WINDOW_HOURS) * 100));
                          const tone = STATUS_TONE[job.status];
                          return (
                            <div
                              key={job.id}
                              className={cx("absolute top-0.5 bottom-0.5 overflow-hidden rounded border px-1", tone.bg, tone.border)}
                              style={{ left: `${left}%`, width: `${width}%` }}
                            >
                              <span className={cx("block truncate text-[10px] font-medium leading-[24px]", tone.text)}>{job.customer}</span>
                            </div>
                          );
                        })}
                      </div>
                      {jobs.length === 0 ? (
                        <p className={cx("mt-1 text-[11px]", TEXT_CAPTION)}>No jobs match the current filters.</p>
                      ) : (
                        <p className={cx("mt-1 text-[11px] leading-snug", TEXT_CAPTION_MUTED, NUM)}>
                          {jobs.map((job, i) => (
                            <span key={job.id}>
                              {i > 0 ? " · " : ""}
                              {formatTimeRangeCompact(job.startHour, job.durationHours)} {job.customer}
                            </span>
                          ))}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className={cx("mt-2 rounded-lg border p-2.5", selectedKey === "unassigned" ? "border-red-300 bg-red-50" : cx(BORDER, "bg-white"))}>
          <p className={cx("text-[11px] font-semibold uppercase tracking-wide", "text-red-700")}>Unassigned — {day.label}</p>
          {unassignedToday.length === 0 ? (
            <p className={cx("mt-0.5 text-[11px]", TEXT_CAPTION_MUTED)}>None — every job today has a technician.</p>
          ) : (
            <p className={cx("mt-0.5 text-[11px] leading-snug", "text-red-800", NUM)}>
              {unassignedToday.map((job, i) => (
                <span key={job.id}>
                  {i > 0 ? " · " : ""}
                  {formatTimeRangeCompact(job.startHour, job.durationHours)} {job.customer} ({job.jobLabel})
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      <div className="border-t p-4 lg:hidden">
        <AgendaList days={[day]} activeStatuses={activeStatuses} selectedKey={selectedKey} />
      </div>
    </Card>
  );
}
