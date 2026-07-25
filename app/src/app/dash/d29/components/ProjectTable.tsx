"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useFilter } from "../context/FilterContext";
import { getMember, priorityMeta, statusMeta, type Project } from "../data";
import { formatDate } from "../lib/format";
import { Avatar } from "./ui/Avatar";
import { Badge } from "./ui/Badge";
import { Card, CardHeader } from "./ui/Card";
import { ProgressBar } from "./ui/ProgressBar";

type SortKey = "name" | "progress" | "dueDate" | "priority";
type SortDirection = "asc" | "desc";

const PRIORITY_RANK: Record<Project["priority"], number> = { high: 3, medium: 2, low: 1 };

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "name", label: "Project" },
  { key: "priority", label: "Priority" },
  { key: "progress", label: "Progress", align: "right" },
  { key: "dueDate", label: "Due Date", align: "right" },
];

export function ProjectTable() {
  const { projects } = useFilter();
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [direction, setDirection] = useState<SortDirection>("asc");

  const sorted = useMemo(() => {
    const copy = [...projects];
    copy.sort((a, b) => {
      let diff = 0;
      if (sortKey === "name") diff = a.name.localeCompare(b.name, "en");
      else if (sortKey === "progress") diff = a.progress - b.progress;
      else if (sortKey === "dueDate") diff = a.dueDate.localeCompare(b.dueDate);
      else diff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      return direction === "asc" ? diff : -diff;
    });
    return copy;
  }, [projects, sortKey, direction]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection("asc");
    }
  }

  return (
    <Card as="section" aria-labelledby="project-table-heading">
      <CardHeader
        title="Project Progress"
        titleId="project-table-heading"
        description={`${projects.length} projects total · Click a column header to sort`}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm lg:min-w-0 lg:table-fixed">
          <caption className="sr-only">List of projects with owner, priority, progress, and due date</caption>
          <colgroup>
            <col />
            <col className="lg:w-[108px]" />
            <col className="lg:w-[188px]" />
            <col className="lg:w-[108px]" />
            <col className="lg:w-[108px]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-100">
              {COLUMNS.map((col) => {
                const active = sortKey === col.key;
                const ariaSort = active ? (direction === "asc" ? "ascending" : "descending") : "none";
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={`px-5 py-2.5 text-xs font-medium tracking-wide text-zinc-500 uppercase ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className={`inline-flex min-h-[44px] items-center gap-1 rounded focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
                        col.align === "right" ? "flex-row-reverse" : ""
                      } ${active ? "text-zinc-900" : "hover:text-zinc-700"}`}
                    >
                      {col.label}
                      {active ? (
                        direction === "asc" ? (
                          <ArrowUp className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          <ArrowDown className="h-3 w-3" aria-hidden="true" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-zinc-300" aria-hidden="true" />
                      )}
                    </button>
                  </th>
                );
              })}
              <th scope="col" className="px-5 py-2.5 text-right text-xs font-medium tracking-wide text-zinc-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((project) => {
              const owner = getMember(project.ownerId);
              const status = statusMeta[project.status];
              const priority = priorityMeta[project.priority];
              return (
                <tr key={project.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/70">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar src={owner.avatarUrl} name={owner.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-900">{project.name}</p>
                        <p className="truncate text-xs text-zinc-500">
                          {owner.name} · {project.tasksDone}/{project.tasksTotal} tasks
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge className={priority.className}>{priority.label}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2.5">
                      <span className="w-24">
                        <ProgressBar
                          value={project.progress}
                          label={`${project.name} progress ${project.progress}%`}
                          barClassName={
                            project.status === "delayed"
                              ? "bg-rose-500"
                              : project.status === "at_risk"
                                ? "bg-amber-500"
                                : "bg-indigo-600"
                          }
                        />
                      </span>
                      <span className="w-9 shrink-0 text-right text-sm tabular-nums text-zinc-700">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right text-sm whitespace-nowrap tabular-nums text-zinc-600">
                    {formatDate(project.dueDate)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Badge className={status.className}>{status.label}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
