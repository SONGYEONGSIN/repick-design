"use client";

import Image from "next/image";
import { Ban, CheckCircle2, Circle, TriangleAlert } from "lucide-react";
import {
  MILESTONE_STATUS_META,
  MONTHS,
  Member,
  Milestone,
  STATUS_META,
  TODAY_DAY,
  TOTAL_DAYS,
  Task,
  WEEKS,
} from "../lib/data";
import { dayToPercent, formatDayRange } from "../lib/format";
import type { ViewMode } from "./FilterBar";

const STATUS_ICON = {
  "on-track": Circle,
  "at-risk": TriangleAlert,
  blocked: Ban,
  done: CheckCircle2,
} as const;

const ROW_H = "h-14";
const LABEL_W = "w-40 sm:w-48";

export interface GanttRow {
  member: Member;
  tasks: Task[];
}

export default function Gantt({
  view,
  rows,
  milestones,
  selectedTaskId,
  onSelectTask,
}: {
  view: ViewMode;
  rows: GanttRow[];
  milestones: Milestone[];
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
}) {
  const todayPct = dayToPercent(TODAY_DAY, TOTAL_DAYS);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[860px] lg:min-w-0">
        <div className="flex">
          {/* Label column */}
          <div className={`sticky left-0 z-10 ${LABEL_W} shrink-0 border-r border-zinc-200 bg-white`}>
            <div className="flex h-9 items-center px-3">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Team
              </span>
            </div>
            <div className="flex h-10 items-center border-t border-zinc-100 px-3">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Milestones
              </span>
            </div>
            {rows.map((row) => (
              <div
                key={row.member.id}
                className={`flex ${ROW_H} items-center gap-2 border-t border-zinc-100 px-3`}
              >
                <Image
                  src={row.member.avatar}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-zinc-900">
                    {row.member.name}
                  </p>
                  <p className="truncate text-[11px] text-zinc-500">{row.member.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline column */}
          <div className="relative min-w-0 flex-1">
            {/* Gridlines + today baseline, span full chart height */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              {view === "week"
                ? WEEKS.map((w) => (
                    <div
                      key={w.index}
                      className="absolute top-0 bottom-0 border-l border-zinc-100"
                      style={{ left: `${dayToPercent(w.startDay, TOTAL_DAYS)}%` }}
                    />
                  ))
                : MONTHS.map((m) => (
                    <div
                      key={m.label}
                      className="absolute top-0 bottom-0 border-l border-zinc-200"
                      style={{ left: `${dayToPercent(m.startDay, TOTAL_DAYS)}%` }}
                    />
                  ))}
              <div
                className="absolute top-0 bottom-0 border-l-2 border-dashed border-indigo-400"
                style={{ left: `${todayPct}%` }}
              />
            </div>

            {/* Axis header */}
            <div className="relative h-9 border-b border-zinc-200">
              {view === "week"
                ? WEEKS.map((w) => (
                    <span
                      key={w.index}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-zinc-500"
                      style={{ left: `${dayToPercent(w.startDay, TOTAL_DAYS)}%` }}
                    >
                      {w.label}
                    </span>
                  ))
                : MONTHS.map((m) => (
                    <span
                      key={m.label}
                      className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-1 text-[11px] font-semibold text-zinc-600"
                      style={{ left: `${dayToPercent(m.startDay, TOTAL_DAYS)}%` }}
                    >
                      {m.label}
                    </span>
                  ))}
              <span
                className="absolute -top-0.5 -translate-x-1/2 whitespace-nowrap rounded-b-md bg-indigo-700 px-1.5 py-0.5 text-[10px] font-semibold text-white"
                style={{ left: `${todayPct}%` }}
              >
                Today · Jul 15
              </span>
            </div>

            {/* Milestone lane */}
            <div className="relative h-10 border-b border-zinc-100">
              {milestones.map((ms) => {
                const meta = MILESTONE_STATUS_META[ms.status];
                const Icon = ms.status === "done" ? CheckCircle2 : ms.status === "at-risk" ? TriangleAlert : null;
                return (
                  <button
                    key={ms.id}
                    type="button"
                    title={`${ms.label} — ${meta.label}`}
                    aria-label={`Milestone: ${ms.label}, status ${meta.label}`}
                    className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 rounded-sm"
                    style={{ left: `${dayToPercent(ms.day, TOTAL_DAYS)}%` }}
                  >
                    <span
                      className={`flex h-3.5 w-3.5 rotate-45 items-center justify-center border ${meta.diamondClass}`}
                    >
                      {Icon ? (
                        <Icon
                          className={`h-2 w-2 -rotate-45 ${ms.status === "at-risk" ? "text-white" : "text-white"}`}
                          aria-hidden="true"
                          strokeWidth={3}
                        />
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Member swimlanes */}
            {rows.length === 0 ? (
              <div className="relative flex h-20 items-center justify-center text-sm text-zinc-500">
                No team members selected. Choose at least one member to see the timeline.
              </div>
            ) : null}
            {rows.map((row) => (
              <div key={row.member.id} className={`relative ${ROW_H} border-t border-zinc-100`}>
                {row.tasks.length === 0 ? (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                    No tasks match the current filters
                  </span>
                ) : (
                  row.tasks.map((task) => {
                    const meta = STATUS_META[task.status];
                    const Icon = STATUS_ICON[task.status];
                    const left = dayToPercent(task.startDay, TOTAL_DAYS);
                    const width = dayToPercent(task.durationDays, TOTAL_DAYS);
                    const selected = task.id === selectedTaskId;
                    const dateRange = formatDayRange(task.startDay, task.durationDays, WEEKS);
                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => onSelectTask(task.id)}
                        aria-pressed={selected}
                        aria-label={`${task.title}, assigned to ${row.member.name}, status ${meta.label}, ${dateRange}, ${task.progress}% complete`}
                        title={task.title}
                        className={`absolute top-1/2 flex h-7 -translate-y-1/2 items-center gap-1 overflow-hidden rounded-md px-1.5 text-left outline-none transition-shadow motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
                          meta.barClass
                        } ${selected ? "ring-2 ring-zinc-900 ring-offset-1" : ""}`}
                        style={{ left: `${left}%`, width: `${Math.max(width, 3)}%` }}
                      >
                        <Icon className="h-3 w-3 shrink-0 text-white" aria-hidden="true" strokeWidth={2.5} />
                        <span className="truncate text-[11px] font-medium text-white">
                          {task.title}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
