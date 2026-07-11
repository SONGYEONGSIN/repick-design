"use client";

import { useId } from "react";
import { CheckCircle2, FilePlus, MessageSquare, Pencil } from "lucide-react";
import { useFilter } from "../context/FilterContext";
import { getMember, getProject, type ActivityType } from "../data";
import { Avatar } from "./ui/Avatar";
import { Card, CardHeader } from "./ui/Card";

const TYPE_ICON: Record<ActivityType, typeof CheckCircle2> = {
  complete: CheckCircle2,
  comment: MessageSquare,
  create: FilePlus,
  update: Pencil,
};

const TYPE_ACCENT: Record<ActivityType, string> = {
  complete: "bg-emerald-50 text-emerald-600",
  comment: "bg-indigo-50 text-indigo-600",
  create: "bg-amber-50 text-amber-600",
  update: "bg-zinc-100 text-zinc-500",
};

export function ActivityFeed() {
  const { activities } = useFilter();
  const headingId = useId();

  return (
    <Card as="section" aria-labelledby={headingId}>
      <CardHeader title="최근 활동" titleId={headingId} description="팀의 최신 업데이트" />
      {activities.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-zinc-500">최근 활동이 없습니다.</p>
      ) : (
        <ul className="space-y-4 px-5 py-5">
          {activities.map((activity) => {
            const actor = getMember(activity.actorId);
            const project = getProject(activity.projectId);
            const Icon = TYPE_ICON[activity.type];
            return (
              <li key={activity.id} className="flex gap-3">
                <span className="relative shrink-0">
                  <Avatar src={actor.avatarUrl} name={actor.name} size="sm" />
                  <span
                    className={`absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border border-white ${TYPE_ACCENT[activity.type]}`}
                    aria-hidden="true"
                  >
                    <Icon className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-zinc-700">
                    <span className="font-medium text-zinc-900">{actor.name}</span>
                    {"님이 "}
                    <span className="font-medium text-zinc-900">{activity.target}</span>
                    {`을(를) ${activity.action}`}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {project.name} · {activity.time}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
