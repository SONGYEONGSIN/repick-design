"use client";

import Image from "next/image";
import { Ban, CheckCircle2, Circle, Flag, ListTodo, TriangleAlert } from "lucide-react";
import {
  CAPACITY_PER_WEEK,
  MILESTONES,
  Member,
  RESOURCE_LOAD,
  STATUS_META,
  TASKS,
  Task,
  WEEKS,
} from "../lib/data";
import { formatDayRange, hoursFormatter } from "../lib/format";
import { Badge, Card, EyebrowLabel, ProgressBar } from "./ui";

const STATUS_ICON = {
  "on-track": Circle,
  "at-risk": TriangleAlert,
  blocked: Ban,
  done: CheckCircle2,
} as const;

const CURRENT_WEEK_INDEX = 6; // week of Jul 13, containing "today" (Jul 15)

export default function DetailRail({
  task,
  member,
}: {
  task: Task | undefined;
  member: Member | undefined;
}) {
  const atRisk = TASKS.filter((t) => t.status === "at-risk").length;
  const blocked = TASKS.filter((t) => t.status === "blocked").length;
  const done = TASKS.filter((t) => t.status === "done").length;
  const upcomingMilestones = MILESTONES.filter((m) => m.status !== "done").length;

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <h2 className="text-sm font-semibold text-zinc-900">Task detail</h2>

        {task && member ? (
          <div className="mt-3">
            <TaskDetail task={task} member={member} />
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-sm text-zinc-600">
              Select a bar on the timeline to see its detail and the assignee&rsquo;s
              weekly workload here.
            </p>
          </div>
        )}
      </Card>

      {task && member ? (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-zinc-900">Team workload</h3>
          <p className="mt-0.5 text-xs text-zinc-600">
            {member.name}&rsquo;s booked hours vs. {hoursFormatter.format(CAPACITY_PER_WEEK)}h/week capacity
          </p>
          <ResourceLoadChart memberId={member.id} />
        </Card>
      ) : (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-zinc-900">Program pulse</h3>
          <dl className="mt-3 grid grid-cols-2 gap-2">
            <StatTile label="At risk" value={atRisk} icon={TriangleAlert} tone="text-amber-700 bg-amber-50 border-amber-200" />
            <StatTile label="Blocked" value={blocked} icon={Ban} tone="text-rose-700 bg-rose-50 border-rose-200" />
            <StatTile label="Done" value={done} icon={CheckCircle2} tone="text-emerald-700 bg-emerald-50 border-emerald-200" />
            <StatTile label="Milestones left" value={upcomingMilestones} icon={Flag} tone="text-zinc-700 bg-zinc-50 border-zinc-200" />
          </dl>
        </Card>
      )}
    </div>
  );
}

function TaskDetail({ task, member }: { task: Task; member: Member }) {
  const meta = STATUS_META[task.status];
  const Icon = STATUS_ICON[task.status];
  const dateRange = formatDayRange(task.startDay, task.durationDays, WEEKS);

  return (
    <div>
      <p className="text-base font-semibold leading-snug text-zinc-900">{task.title}</p>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Badge className={meta.badgeClass}>
          <Icon className="h-3 w-3" aria-hidden="true" />
          {meta.label}
        </Badge>
        <span className="text-xs text-zinc-600">{dateRange}</span>
      </div>

      <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50 p-2.5">
        <Image
          src={member.avatar}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-zinc-900">{member.name}</p>
          <p className="truncate text-[11px] text-zinc-500">{member.role}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <EyebrowLabel>Progress</EyebrowLabel>
          <span className="text-xs font-medium tabular-nums text-zinc-700">
            {task.progress}%
          </span>
        </div>
        <div className="mt-1.5">
          <ProgressBar
            value={task.progress}
            className={meta.barClass}
            ariaLabel={`${task.title} progress: ${task.progress}%`}
          />
        </div>
      </div>

      <div className="mt-4">
        <EyebrowLabel>Notes</EyebrowLabel>
        <ul className="mt-1.5 space-y-1.5">
          {task.notes.map((note, i) => (
            <li key={i} className="flex gap-1.5 text-xs text-zinc-700">
              <ListTodo className="mt-0.5 h-3 w-3 shrink-0 text-zinc-400" aria-hidden="true" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Flag;
  tone: string;
}) {
  return (
    <div className={`rounded-lg border p-2.5 ${tone}`}>
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <dt className="text-[11px] font-medium uppercase tracking-wide">{label}</dt>
      </div>
      <dd className="mt-1 text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function ResourceLoadChart({ memberId }: { memberId: string }) {
  const data = RESOURCE_LOAD[memberId] ?? [];
  const maxScale = CAPACITY_PER_WEEK * 1.3;
  const overCount = data.filter((h) => h > CAPACITY_PER_WEEK).length;
  const currentHours = data[CURRENT_WEEK_INDEX] ?? 0;

  return (
    <div className="mt-3">
      <div className="flex items-end gap-1" style={{ height: 96 }}>
        {data.map((hours, i) => {
          const heightPct = Math.min(100, Math.round((hours / maxScale) * 100));
          const over = hours > CAPACITY_PER_WEEK;
          const isCurrent = i === CURRENT_WEEK_INDEX;
          return (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <div
                className={`w-full rounded-sm ${over ? "bg-amber-500" : "bg-indigo-400"} ${
                  isCurrent ? "ring-2 ring-zinc-900" : ""
                }`}
                style={{ height: `${heightPct}%` }}
                title={`${WEEKS[i]?.label ?? ""}: ${hoursFormatter.format(hours)}h`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-500">
        <span>{WEEKS[0].label}</span>
        <span>{WEEKS[WEEKS.length - 1].label}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-700">
        <span className="tabular-nums">
          This week: <strong className="font-semibold">{hoursFormatter.format(currentHours)}h</strong>
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-sm bg-amber-500" aria-hidden="true" />
          {overCount} week{overCount === 1 ? "" : "s"} over capacity
        </span>
      </div>
    </div>
  );
}
