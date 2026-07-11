"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { NOW, WORKFLOWS, lastRunAt, type ExecStatus } from "../lib/data";
import { formatDuration, formatNumber, formatPercent, formatRelative } from "../lib/format";
import type { StatusFilterValue } from "./StatusFilter";
import StatusBadge from "./StatusBadge";
import Sparkline from "./Sparkline";

interface WorkflowTableProps {
  statusFilter: StatusFilterValue;
}

type SortKey = "executions" | "successRate" | "avgDurationMs" | "lastRunAt";
type SortDir = "asc" | "desc";

interface Row {
  id: string;
  name: string;
  category: string;
  executions: number;
  successRate: number;
  avgDurationMs: number;
  lastStatus: ExecStatus;
  sparkline: number[];
  lastRunAt: Date;
}

const COLUMNS: { key: SortKey; label: string; align: "left" | "right" }[] = [
  { key: "executions", label: "실행 횟수", align: "right" },
  { key: "successRate", label: "성공률", align: "right" },
  { key: "avgDurationMs", label: "평균 소요시간", align: "right" },
  { key: "lastRunAt", label: "마지막 실행", align: "right" },
];

export default function WorkflowTable({ statusFilter }: WorkflowTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("executions");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows: Row[] = useMemo(
    () =>
      WORKFLOWS.map((w) => ({
        id: w.id,
        name: w.name,
        category: w.category,
        executions: w.executions,
        successRate: ((w.executions - w.failed) / w.executions) * 100,
        avgDurationMs: w.avgDurationMs,
        lastStatus: w.lastStatus,
        sparkline: w.sparkline,
        lastRunAt: lastRunAt(w.id),
      })),
    [],
  );

  const filteredSorted = useMemo(() => {
    const filtered = statusFilter === "all" ? rows : rows.filter((r) => r.lastStatus === statusFilter);
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = sortKey === "lastRunAt" ? a.lastRunAt.getTime() : a[sortKey];
      const bv = sortKey === "lastRunAt" ? b.lastRunAt.getTime() : b[sortKey];
      return (av - bv) * dir;
    });
  }, [rows, statusFilter, sortKey, sortDir]);

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
      <table className="w-full min-w-[820px] border-collapse text-sm">
        <caption className="sr-only">워크플로별 실행 성능 — 실행 횟수, 성공률, 평균 소요시간, 마지막 실행 기준 정렬 가능</caption>
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th scope="col" className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              워크플로
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
              추이
            </th>
            <th scope="col" className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              최근 상태
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSorted.map((row) => (
            <tr key={row.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
              <td className="px-4 py-3">
                <p className="font-medium text-zinc-100">{row.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
                  <span className="font-mono tabular-nums">{row.id}</span>
                  <span aria-hidden="true">·</span>
                  <span>{row.category}</span>
                </p>
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-zinc-200">
                {formatNumber(row.executions)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-zinc-200">
                {formatPercent(row.successRate)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-zinc-200">
                {formatDuration(row.avgDurationMs)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-zinc-400">
                {formatRelative(row.lastRunAt, NOW)}
              </td>
              <td className="px-4 py-3 text-right">
                <Sparkline
                  values={row.sparkline}
                  label={`${row.name} 최근 7일 실행 추이`}
                  className="ml-auto text-indigo-400"
                />
              </td>
              <td className="px-4 py-3 text-right">
                <StatusBadge status={row.lastStatus} />
              </td>
            </tr>
          ))}
          {filteredSorted.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length + 3} className="px-4 py-10 text-center text-sm text-zinc-500">
                선택한 상태에 해당하는 워크플로가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
