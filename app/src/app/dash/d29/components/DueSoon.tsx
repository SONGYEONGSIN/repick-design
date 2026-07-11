"use client";

import { useId } from "react";
import { AlarmClock } from "lucide-react";
import { useFilter } from "../context/FilterContext";
import { TODAY_ISO, getMember, getProject, priorityMeta } from "../data";
import { formatDday } from "../lib/format";
import { Avatar } from "./ui/Avatar";
import { Badge } from "./ui/Badge";
import { Card, CardHeader } from "./ui/Card";

export function DueSoon() {
  const { dueSoonTasks } = useFilter();
  const headingId = useId();

  return (
    <Card as="section" aria-labelledby={headingId}>
      <CardHeader
        title="마감 임박"
        titleId={headingId}
        description="5일 이내 마감되는 미완료 작업"
      />
      {dueSoonTasks.length === 0 ? (
        <p className="flex flex-col items-center gap-2 px-5 py-8 text-center text-sm text-zinc-500">
          <AlarmClock className="h-4 w-4 text-zinc-300" aria-hidden="true" />
          임박한 마감이 없습니다.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-50">
          {dueSoonTasks.map((task) => {
            const assignee = getMember(task.assigneeId);
            const project = getProject(task.projectId);
            const priority = priorityMeta[task.priority];
            const dday = formatDday(TODAY_ISO, task.dueDate);
            const urgent = dday === "D-DAY" || dday === "D-1";
            return (
              <li key={task.id} className="flex min-h-[44px] items-center gap-3 px-5 py-3">
                <Avatar src={assignee.avatarUrl} name={assignee.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900">{task.title}</p>
                  <p className="truncate text-xs text-zinc-500">
                    {project.name} · {assignee.name}
                  </p>
                </div>
                <Badge className={`hidden sm:inline-flex ${priority.className}`}>{priority.label}</Badge>
                <Badge
                  className={
                    urgent
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-zinc-200 bg-zinc-100 text-zinc-600"
                  }
                >
                  {dday}
                </Badge>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
