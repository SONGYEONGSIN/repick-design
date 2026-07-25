"use client";

import { useId } from "react";
import { AlertTriangle } from "lucide-react";
import { useFilter } from "../context/FilterContext";
import { clampPercent } from "../lib/format";
import { Avatar } from "./ui/Avatar";
import { Card, CardHeader } from "./ui/Card";
import { HoverTooltip } from "./ui/Tooltip";

function workloadColor(pct: number): string {
  if (pct > 100) return "bg-rose-500";
  if (pct >= 85) return "bg-amber-500";
  return "bg-emerald-500";
}

export function TeamWorkload() {
  const { members } = useFilter();
  const headingId = useId();
  const sorted = [...members].sort((a, b) => b.capacityPercent - a.capacityPercent);

  return (
    <Card as="section" aria-labelledby={headingId}>
      <CardHeader
        title="Team Workload"
        titleId={headingId}
        description="Assigned work vs. capacity · Hover a bar for details"
      />
      <ul className="space-y-4 px-5 py-5">
        {sorted.map((member) => {
          const pct = member.capacityPercent;
          const over = pct > 100;
          const tooltipId = `workload-tip-${member.id}`;
          return (
            <li key={member.id} className="flex items-center gap-3">
              <Avatar src={member.avatarUrl} name={member.name} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-zinc-900">{member.name}</p>
                  <span className="flex shrink-0 items-center gap-1 text-xs font-medium tabular-nums text-zinc-500">
                    {over ? <AlertTriangle className="h-3 w-3 text-rose-500" aria-hidden="true" /> : null}
                    <span className={over ? "text-rose-600" : "text-zinc-500"}>{pct}%</span>
                  </span>
                </div>
                <HoverTooltip
                  id={tooltipId}
                  content={
                    <span>
                      {member.name} · {member.tasksAssigned} tasks · {pct}% capacity
                      {over ? " · Overallocated" : ""}
                    </span>
                  }
                  className="mt-1.5 block w-full"
                >
                  <button
                    type="button"
                    tabIndex={0}
                    aria-describedby={tooltipId}
                    className="flex h-6 w-full items-center rounded-full focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 focus-visible:outline-none"
                  >
                    <span className="sr-only">
                      {member.name}, {member.tasksAssigned} tasks, {pct}% capacity{over ? ", overallocated" : ""}
                    </span>
                    <span
                      aria-hidden="true"
                      className="block h-2.5 w-full overflow-hidden rounded-full bg-zinc-100"
                    >
                      <span
                        className={`block h-full rounded-full ${workloadColor(pct)}`}
                        style={{ width: `${clampPercent(pct)}%` }}
                      />
                    </span>
                  </button>
                </HoverTooltip>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
