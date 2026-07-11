"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Hand, Radio, Timer } from "lucide-react";
import { useMemo, useState } from "react";
import { EXECUTION_LOG, NOW } from "../lib/data";
import { formatDuration, formatRelative, formatTime } from "../lib/format";
import StatusBadge from "./StatusBadge";

interface ExecutionLogTableProps {
  workflowId: string;
}

type SortKey = "startedAt" | "durationMs";
type SortDir = "asc" | "desc";

const TRIGGER_META = {
  schedule: { label: "스케줄", Icon: Timer },
  webhook: { label: "웹훅", Icon: Radio },
  manual: { label: "수동 실행", Icon: Hand },
} as const;

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "durationMs", label: "소요시간" },
  { key: "startedAt", label: "시작 시각" },
];

/** 선택된 워크플로 하나로 스코프된 실행 로그 — 소요시간/시작시각 정렬 가능. */
export default function ExecutionLogTable({ workflowId }: ExecutionLogTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("startedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const filtered = EXECUTION_LOG.filter((e) => e.workflowId === workflowId);
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = sortKey === "startedAt" ? a.startedAt.getTime() : (a.durationMs ?? -1);
      const bv = sortKey === "startedAt" ? b.startedAt.getTime() : (b.durationMs ?? -1);
      return (av - bv) * dir;
    });
  }, [workflowId, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-900/60 shadow-sm">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <caption className="sr-only">선택한 워크플로의 최근 실행 기록 — 실행 ID, 트리거, 소요시간, 시작 시각, 상태 기준 정렬 가능</caption>
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th scope="col" className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              실행 ID
            </th>
            <th scope="col" className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              트리거
            </th>
            {COLUMNS.map((col) => {
              const active = col.key === sortKey;
              const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
              return (
                <th key={col.key} scope="col" aria-sort={ariaSort} className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className="inline-flex min-h-[32px] items-center gap-1 rounded-md px-1.5 text-[11px] font-medium uppercase tracking-wider text-zinc-500 transition-colors hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                  >
                    {col.label}
                    {active ? (
                      sortDir === "asc" ? (
                        <ArrowUp className="size-3" aria-hidden="true" />
                      ) : (
                        <ArrowDown className="size-3" aria-hidden="true" />
                      )
                    ) : (
                      <ArrowUpDown className="size-3 text-zinc-600" aria-hidden="true" />
                    )}
                  </button>
                </th>
              );
            })}
            <th scope="col" className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              상태
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((entry) => {
            const trigger = TRIGGER_META[entry.triggeredBy];
            return (
              <tr key={entry.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs tabular-nums text-zinc-400">{entry.id}</td>
                <td className="whitespace-nowrap px-4 py-3 text-zinc-400">
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <trigger.Icon className="size-3.5" aria-hidden="true" />
                    {trigger.label}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-zinc-200">
                  {entry.durationMs === null ? (
                    <span className="text-blue-400">진행중</span>
                  ) : (
                    formatDuration(entry.durationMs)
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <time
                    dateTime={entry.startedAt.toISOString()}
                    className="text-xs tabular-nums text-zinc-400"
                    title={formatTime(entry.startedAt)}
                  >
                    {formatRelative(entry.startedAt, NOW)}
                  </time>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <StatusBadge status={entry.status} />
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-500">
                이 워크플로의 실행 기록이 아직 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
