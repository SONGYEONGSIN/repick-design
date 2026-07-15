"use client";

import { useEffect, useMemo, useState } from "react";
import { Ban, CheckCircle2, Circle, Diamond, TriangleAlert } from "lucide-react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import FilterBar, { ViewMode } from "./FilterBar";
import Gantt, { GanttRow } from "./Gantt";
import DetailRail from "./DetailRail";
import MilestonesTable from "./MilestonesTable";
import CommandPalette from "./CommandPalette";
import { Card } from "./ui";
import {
  MEMBERS,
  MILESTONES,
  STATUS_META,
  TaskStatus,
  memberById,
  taskById,
  tasksForMember,
} from "../lib/data";

const LEGEND_STATUSES: TaskStatus[] = ["on-track", "at-risk", "blocked", "done"];
const LEGEND_ICON = {
  "on-track": Circle,
  "at-risk": TriangleAlert,
  blocked: Ban,
  done: CheckCircle2,
} as const;

export default function TracklineClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("week");
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(
    () => new Set(MEMBERS.map((m) => m.id))
  );
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>("t-marcus-2");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Keep the detail rail in sync: if the active filters change and the
  // current selection falls outside them, clear it so the rail and timeline
  // never disagree. Adjusted during render (not in an effect) — see
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevMemberFilter, setPrevMemberFilter] = useState(selectedMemberIds);
  const [prevStatusFilter, setPrevStatusFilter] = useState(statusFilter);
  if (selectedMemberIds !== prevMemberFilter || statusFilter !== prevStatusFilter) {
    setPrevMemberFilter(selectedMemberIds);
    setPrevStatusFilter(statusFilter);
    if (selectedTaskId) {
      const task = taskById(selectedTaskId);
      const memberOk = !!task && selectedMemberIds.has(task.memberId);
      const statusOk = !!task && (statusFilter === "all" || task.status === statusFilter);
      if (!task || !memberOk || !statusOk) setSelectedTaskId(null);
    }
  }

  const rows: GanttRow[] = useMemo(() => {
    return MEMBERS.filter((m) => selectedMemberIds.has(m.id)).map((member) => ({
      member,
      tasks: tasksForMember(member.id).filter(
        (t) => statusFilter === "all" || t.status === statusFilter
      ),
    }));
  }, [selectedMemberIds, statusFilter]);

  const selectedTask = selectedTaskId ? taskById(selectedTaskId) : undefined;
  const selectedMember = selectedTask ? memberById(selectedTask.memberId) : undefined;

  function toggleMember(id: string) {
    setSelectedMemberIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllMembers() {
    setSelectedMemberIds((prev) =>
      prev.size === MEMBERS.length ? new Set() : new Set(MEMBERS.map((m) => m.id))
    );
  }

  return (
    <div className="flex h-dvh min-h-dvh overflow-hidden bg-zinc-50 text-zinc-900">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <main id="main-content" className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto grid max-w-[1800px] grid-cols-12 gap-4 p-4 xl:gap-6 xl:p-6">
            <div className="col-span-12 min-w-0 lg:col-span-8 xl:col-span-9">
              <div className="mb-4">
                <h1 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl">
                  Q3 Platform Roadmap
                </h1>
                <p className="mt-0.5 text-sm text-zinc-600">
                  Resource timeline across 8 team members, Jun 1 – Sep 20, 2026.
                </p>
              </div>

              <h2 className="sr-only">Timeline</h2>
              <Card className="min-w-0">
                <FilterBar
                  view={view}
                  onViewChange={setView}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  selectedMemberIds={selectedMemberIds}
                  onToggleMember={toggleMember}
                  onSelectAllMembers={selectAllMembers}
                />

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2.5 sm:px-5">
                  {LEGEND_STATUSES.map((s) => {
                    const meta = STATUS_META[s];
                    const Icon = LEGEND_ICON[s];
                    return (
                      <span key={s} className="flex items-center gap-1.5 text-xs text-zinc-600">
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-sm ${meta.barClass}`}
                        >
                          <Icon className="h-2.5 w-2.5 text-white" aria-hidden="true" strokeWidth={2.5} />
                        </span>
                        {meta.label}
                      </span>
                    );
                  })}
                  <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                    <Diamond className="h-3.5 w-3.5 fill-zinc-400 text-zinc-500" aria-hidden="true" />
                    Milestone
                  </span>
                </div>

                <Gantt
                  view={view}
                  rows={rows}
                  milestones={MILESTONES}
                  selectedTaskId={selectedTaskId}
                  onSelectTask={setSelectedTaskId}
                />
              </Card>

              <div className="mt-4">
                <MilestonesTable milestones={MILESTONES} />
              </div>
            </div>

            <aside aria-label="Task detail" className="col-span-12 min-w-0 lg:col-span-4 xl:col-span-3">
              <DetailRail task={selectedTask} member={selectedMember} />
            </aside>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelectTask={setSelectedTaskId}
      />
    </div>
  );
}
