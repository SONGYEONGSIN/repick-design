"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { WORKFLOWS, lastRunAt, periodTotals, workflowSuccessRate } from "../lib/data";
import { formatNumber, formatPercent } from "../lib/format";
import AlertCard from "./AlertCard";
import CreditsCard from "./CreditsCard";
import scrollStyles from "./scroll.module.css";
import StatusFilter, { type StatusFilterValue } from "./StatusFilter";
import WorkflowListItem from "./WorkflowListItem";

type ListSortKey = "executions" | "successRate" | "lastRunAt";

const SORT_OPTIONS: { value: ListSortKey; label: string }[] = [
  { value: "executions", label: "실행 횟수순" },
  { value: "successRate", label: "성공률순" },
  { value: "lastRunAt", label: "최근 실행순" },
];

const STATUS_OPTIONS: StatusFilterValue[] = ["all", "success", "failed", "running", "warning"];

interface WorkflowListRailProps {
  selectedId: string;
  onSelect: (id: string) => void;
  open: boolean;
  onClose: () => void;
}

/** 화면의 마스터 — 워크플로 목록 레일. 검색·상태 필터·정렬 + 워크스페이스 요약 스트립. */
export default function WorkflowListRail({ selectedId, onSelect, open, onClose }: WorkflowListRailProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("all");
  const [sortKey, setSortKey] = useState<ListSortKey>("executions");

  const statusCounts = useMemo(() => {
    const counts = Object.fromEntries(STATUS_OPTIONS.map((s) => [s, 0])) as Record<StatusFilterValue, number>;
    counts.all = WORKFLOWS.length;
    for (const w of WORKFLOWS) counts[w.lastStatus] += 1;
    return counts;
  }, []);

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = WORKFLOWS.filter((w) => {
      if (statusFilter !== "all" && w.lastStatus !== statusFilter) return false;
      if (!q) return true;
      return w.name.toLowerCase().includes(q) || w.category.toLowerCase().includes(q);
    });
    return [...filtered].sort((a, b) => {
      if (sortKey === "executions") return b.executions - a.executions;
      if (sortKey === "successRate") return workflowSuccessRate(b) - workflowSuccessRate(a);
      return lastRunAt(b.id).getTime() - lastRunAt(a.id).getTime();
    });
  }, [search, statusFilter, sortKey]);

  const overview = periodTotals("30d");

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="목록 닫기"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-zinc-950/70 backdrop-blur-sm lg:hidden"
        />
      )}
      <div
        className={`flex-col overflow-hidden bg-zinc-950 lg:static lg:inset-auto lg:top-auto lg:z-auto lg:flex lg:h-full lg:w-[320px] lg:shrink-0 lg:max-h-none lg:rounded-none lg:border-b-0 lg:border-r lg:border-white/10 lg:shadow-none ${
          open
            ? "fixed inset-x-0 top-16 z-40 flex max-h-[calc(100dvh-4rem)] rounded-b-2xl border-b border-white/10 shadow-2xl"
            : "hidden"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 px-4 pt-4 sm:px-5">
          <p className="text-lg font-semibold tracking-tight text-zinc-50">워크플로</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="목록 닫기"
            className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 lg:hidden"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="shrink-0 space-y-2.5 px-4 pt-3 pb-3 sm:px-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">
              최근 30일 실행{" "}
              <span className="font-medium tabular-nums text-zinc-200">{formatNumber(overview.total)}</span>
            </span>
            <span className="text-zinc-500">
              성공률{" "}
              <span className="font-medium tabular-nums text-emerald-400">{formatPercent(overview.successRate)}</span>
            </span>
          </div>
          <AlertCard onSelectWorkflow={onSelect} />
        </div>

        <div className="shrink-0 space-y-2.5 border-t border-white/5 px-4 py-3 sm:px-5">
          <label htmlFor="workflow-search" className="sr-only">
            워크플로 검색
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-zinc-500"
              aria-hidden="true"
            />
            <input
              id="workflow-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름 또는 카테고리 검색"
              className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] pr-3 pl-8 text-sm text-zinc-200 placeholder:text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            />
          </div>

          <StatusFilter value={statusFilter} onChange={setStatusFilter} counts={statusCounts} />

          <div className="flex items-center justify-end gap-1.5">
            <label htmlFor="workflow-sort" className="text-xs text-zinc-500">
              정렬
            </label>
            <select
              id="workflow-sort"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as ListSortKey)}
              className="min-h-[32px] rounded-md border border-white/10 bg-white/[0.03] px-2 text-xs text-zinc-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <nav
          aria-label="워크플로 목록"
          className={`min-h-0 flex-1 overflow-y-auto px-2 pb-2 sm:px-3 ${scrollStyles.thinScroll}`}
        >
          {filteredSorted.length === 0 ? (
            <p className="px-2.5 py-8 text-center text-sm text-zinc-500">조건에 맞는 워크플로가 없습니다.</p>
          ) : (
            <ul className="space-y-0.5">
              {filteredSorted.map((w) => (
                <WorkflowListItem
                  key={w.id}
                  workflow={w}
                  selected={w.id === selectedId}
                  onSelect={() => onSelect(w.id)}
                />
              ))}
            </ul>
          )}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-3 sm:p-4">
          <CreditsCard />
        </div>
      </div>
    </>
  );
}
