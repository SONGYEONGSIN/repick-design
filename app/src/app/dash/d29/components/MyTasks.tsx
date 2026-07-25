"use client";

import { useId, useState } from "react";
import { Columns3, List } from "lucide-react";
import { useFilter } from "../context/FilterContext";
import { getProject, priorityMeta, taskStatusMeta, type Task, type TaskStatus } from "../data";
import { formatDate } from "../lib/format";
import { Badge } from "./ui/Badge";
import { Card, CardHeader } from "./ui/Card";

type ViewMode = "list" | "board";

const BOARD_COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export function MyTasks() {
  const { myTasks } = useFilter();
  const [view, setView] = useState<ViewMode>("list");
  const headingId = useId();

  return (
    <Card as="section" aria-labelledby={headingId}>
      <CardHeader
        title="My Tasks"
        titleId={headingId}
        description={`${myTasks.length} · assigned to me under the current filter`}
        action={
          <div
            role="group"
            aria-label="Switch view"
            className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5"
          >
            <ViewToggleButton
              active={view === "list"}
              onClick={() => setView("list")}
              icon={List}
              label="List view"
            />
            <ViewToggleButton
              active={view === "board"}
              onClick={() => setView("board")}
              icon={Columns3}
              label="Board view"
            />
          </div>
        }
      />

      {myTasks.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-zinc-500">
          No tasks match the current filter.
        </p>
      ) : view === "list" ? (
        <ListView tasks={myTasks} />
      ) : (
        <BoardView tasks={myTasks} />
      )}
    </Card>
  );
}

function ViewToggleButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof List;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
        active ? "bg-white text-indigo-600 shadow-sm" : "text-zinc-400 hover:text-zinc-600"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function ListView({ tasks }: { tasks: Task[] }) {
  return (
    <ul className="divide-y divide-zinc-50">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </ul>
  );
}

function TaskRow({ task }: { task: Task }) {
  const project = getProject(task.projectId);
  const priority = priorityMeta[task.priority];
  const status = taskStatusMeta[task.status];
  const isDone = task.status === "done";

  return (
    <li className="flex min-h-[44px] items-center gap-3 px-5 py-3">
      <input
        type="checkbox"
        defaultChecked={isDone}
        aria-label={`Mark "${task.title}" complete`}
        className="h-4 w-4 shrink-0 rounded border-zinc-300 text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500"
      />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${isDone ? "text-zinc-400 line-through" : "text-zinc-900"}`}>
          {task.title}
        </p>
        <p className="truncate text-xs text-zinc-500">{project.name}</p>
      </div>
      <Badge className={`hidden sm:inline-flex ${priority.className}`}>{priority.label}</Badge>
      <Badge className={status.className}>{status.label}</Badge>
      <span className="w-14 shrink-0 text-right text-xs tabular-nums text-zinc-500">
        {formatDate(task.dueDate)}
      </span>
    </li>
  );
}

function BoardView({ tasks }: { tasks: Task[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
      {BOARD_COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div key={col.key} className="min-w-0 rounded-lg bg-zinc-50 p-3">
            <div className="mb-2 flex items-center justify-between px-1">
              <h3 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">{col.label}</h3>
              <span className="text-xs font-medium tabular-nums text-zinc-400">{columnTasks.length}</span>
            </div>
            <ul className="space-y-2">
              {columnTasks.map((task) => {
                const project = getProject(task.projectId);
                const priority = priorityMeta[task.priority];
                return (
                  <li
                    key={task.id}
                    className="min-w-0 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm"
                  >
                    <p
                      className={`text-sm font-medium ${
                        task.status === "done" ? "text-zinc-400 line-through" : "text-zinc-900"
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-zinc-500">{project.name}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <Badge className={priority.className}>{priority.label}</Badge>
                      <span className="text-xs tabular-nums text-zinc-400">{formatDate(task.dueDate)}</span>
                    </div>
                  </li>
                );
              })}
              {columnTasks.length === 0 ? (
                <li className="rounded-lg border border-dashed border-zinc-200 p-3 text-center text-xs text-zinc-400">
                  None
                </li>
              ) : null}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
