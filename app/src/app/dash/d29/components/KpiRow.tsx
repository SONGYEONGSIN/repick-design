"use client";

import { AlertCircle, CheckCircle2, FolderKanban, Users } from "lucide-react";
import { useFilter } from "../context/FilterContext";
import { formatNumber } from "../lib/format";
import { Card } from "./ui/Card";

export function KpiRow() {
  const { kpis } = useFilter();

  const items = [
    {
      id: "active",
      label: "Active Projects",
      value: kpis.activeProjects,
      unit: "projects",
      icon: FolderKanban,
      accent: "bg-indigo-50 text-indigo-600",
    },
    {
      id: "done",
      label: "Tasks Completed This Week",
      value: kpis.completedThisWeek,
      unit: "tasks",
      icon: CheckCircle2,
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      id: "due",
      label: "Due Soon (5 days)",
      value: kpis.dueSoonCount,
      unit: "tasks",
      icon: AlertCircle,
      accent: "bg-amber-50 text-amber-600",
    },
    {
      id: "workload",
      label: "Avg. Team Workload",
      value: kpis.avgWorkload,
      unit: "%",
      icon: Users,
      accent: "bg-zinc-100 text-zinc-600",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.id} className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">{item.label}</p>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.accent}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold tabular-nums text-zinc-900">
              {formatNumber(item.value)}
              <span className="ml-1 text-sm font-medium text-zinc-400">{item.unit}</span>
            </p>
          </Card>
        );
      })}
    </div>
  );
}
