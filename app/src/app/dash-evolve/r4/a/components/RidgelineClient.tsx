"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import FilterBar, { RailFilter, RailView } from "./FilterBar";
import ListRail from "./ListRail";
import IssueTable from "./IssueTable";
import DetailPane from "./DetailPane";
import CommandPalette from "./CommandPalette";
import {
  CURRENT_USER_ID,
  ISSUES,
  Issue,
  IssueStatus,
  Priority,
  SortKey,
} from "../lib/data";
import { compareIssues } from "../lib/format";

const DEFAULT_SELECTED_ID = "COR-482";

export default function RidgelineClient() {
  const [issues, setIssues] = useState<Issue[]>(ISSUES);
  const [selectedId, setSelectedId] = useState<string | null>(DEFAULT_SELECTED_ID);
  const [mobilePane, setMobilePane] = useState<"list" | "detail">("list");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const [railView, setRailView] = useState<RailView>("list");
  const [railFilter, setRailFilter] = useState<RailFilter>("all");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updated");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

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

  const filteredIssues = useMemo(() => {
    const q = query.trim().toLowerCase();
    return issues.filter((issue) => {
      if (railFilter === "mine" && issue.assigneeId !== CURRENT_USER_ID) return false;
      if (railFilter === "urgent" && issue.priority !== "urgent") return false;
      if (q && !issue.title.toLowerCase().includes(q) && !issue.id.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [issues, railFilter, query]);

  const sortedIssues = useMemo(
    () => [...filteredIssues].sort((a, b) => compareIssues(a, b, sortKey, sortDir)),
    [filteredIssues, sortKey, sortDir]
  );

  const selectedIssue = issues.find((i) => i.id === selectedId);

  function handleSelect(id: string) {
    setSelectedId(id);
    setMobilePane("detail");
  }

  function handleSelectFromTable(id: string) {
    handleSelect(id);
    setRailView("list");
  }

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "id" ? "asc" : "desc");
    }
  }

  function handleChangeStatus(issueId: string, status: IssueStatus) {
    setIssues((prev) =>
      prev.map((issue) => (issue.id === issueId ? { ...issue, status, updatedLabel: "Just now" } : issue))
    );
  }

  function handleChangePriority(issueId: string, priority: Priority) {
    setIssues((prev) =>
      prev.map((issue) => (issue.id === issueId ? { ...issue, priority, updatedLabel: "Just now" } : issue))
    );
  }

  function handleToggleSubIssue(issueId: string, subIssueId: string) {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id !== issueId || !issue.subIssues) return issue;
        return {
          ...issue,
          updatedLabel: "Just now",
          subIssues: issue.subIssues.map((sub) =>
            sub.id === subIssueId ? { ...sub, done: !sub.done } : sub
          ),
        };
      })
    );
  }

  return (
    <div className="flex h-dvh min-h-dvh overflow-hidden bg-white text-zinc-900">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        <FilterBar
          view={railView}
          onViewChange={setRailView}
          filter={railFilter}
          onFilterChange={setRailFilter}
          query={query}
          onQueryChange={setQuery}
          resultCount={filteredIssues.length}
        />

        <main id="main-content" className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {railView === "table" ? (
            <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
              <IssueTable
                issues={sortedIssues}
                selectedId={selectedId}
                onSelect={handleSelectFromTable}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
              />
            </div>
          ) : (
            <div className="flex min-h-0 flex-1">
              <div
                className={`${
                  mobilePane === "detail" ? "hidden lg:block" : "block"
                } w-full shrink-0 overflow-y-auto border-zinc-200 lg:w-[380px] lg:border-r`}
              >
                <ListRail issues={filteredIssues} selectedId={selectedId} onSelect={handleSelect} />
              </div>
              <div className={`${mobilePane === "list" ? "hidden lg:block" : "block"} min-w-0 flex-1`}>
                <DetailPane
                  issue={selectedIssue}
                  onBack={() => setMobilePane("list")}
                  onChangeStatus={handleChangeStatus}
                  onChangePriority={handleChangePriority}
                  onToggleSubIssue={handleToggleSubIssue}
                  className="h-full"
                />
              </div>
            </div>
          )}
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onSelectIssue={handleSelectFromTable}
      />
    </div>
  );
}
