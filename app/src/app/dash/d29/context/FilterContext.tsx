"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  CURRENT_USER_ID,
  TODAY_ISO,
  activities,
  getProject,
  members,
  projects,
  tasks,
  type ActivityItem,
  type Member,
  type Project,
  type Task,
} from "../data";
import { dayDiff } from "../lib/format";

export type ProjectFilterValue = "all" | string;

interface FilterContextValue {
  selectedProjectId: ProjectFilterValue;
  setSelectedProjectId: (id: ProjectFilterValue) => void;
  selectedProject: Project | null;
  allProjects: Project[];
  projects: Project[];
  members: Member[];
  tasks: Task[];
  myTasks: Task[];
  dueSoonTasks: Task[];
  activities: ActivityItem[];
  kpis: {
    activeProjects: number;
    completedThisWeek: number;
    dueSoonCount: number;
    avgWorkload: number;
  };
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedProjectId, setSelectedProjectId] = useState<ProjectFilterValue>("all");

  const value = useMemo<FilterContextValue>(() => {
    const selectedProject = selectedProjectId === "all" ? null : getProject(selectedProjectId);

    const filteredProjects =
      selectedProjectId === "all" ? projects : projects.filter((p) => p.id === selectedProjectId);

    const filteredMembers =
      selectedProjectId === "all"
        ? members
        : members.filter((m) => m.projectIds.includes(selectedProjectId));

    const filteredTasks =
      selectedProjectId === "all" ? tasks : tasks.filter((t) => t.projectId === selectedProjectId);

    const myTasks = filteredTasks.filter((t) => t.assigneeId === CURRENT_USER_ID);

    const dueSoonTasks = filteredTasks
      .filter((t) => t.status !== "done" && dayDiff(TODAY_ISO, t.dueDate) >= 0 && dayDiff(TODAY_ISO, t.dueDate) <= 4)
      .sort((a, b) => dayDiff(TODAY_ISO, a.dueDate) - dayDiff(TODAY_ISO, b.dueDate));

    const filteredActivities =
      selectedProjectId === "all" ? activities : activities.filter((a) => a.projectId === selectedProjectId);

    const avgWorkload =
      filteredMembers.length === 0
        ? 0
        : Math.round(filteredMembers.reduce((sum, m) => sum + m.capacityPercent, 0) / filteredMembers.length);

    return {
      selectedProjectId,
      setSelectedProjectId,
      selectedProject,
      allProjects: projects,
      projects: filteredProjects,
      members: filteredMembers,
      tasks: filteredTasks,
      myTasks,
      dueSoonTasks,
      activities: filteredActivities,
      kpis: {
        activeProjects: filteredProjects.length,
        completedThisWeek: filteredTasks.filter((t) => t.status === "done").length,
        dueSoonCount: dueSoonTasks.length,
        avgWorkload,
      },
    };
  }, [selectedProjectId]);

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilter(): FilterContextValue {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used within FilterProvider");
  return ctx;
}
