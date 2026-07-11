"use client";

import { Hand, Radio, Timer } from "lucide-react";
import { useMemo } from "react";
import { EXECUTION_LOG, NOW } from "../lib/data";
import { formatDuration, formatRelative, formatTime } from "../lib/format";
import type { StatusFilterValue } from "./StatusFilter";
import StatusBadge from "./StatusBadge";

interface ExecutionLogTableProps {
  statusFilter: StatusFilterValue;
}

const TRIGGER_META = {
  schedule: { label: "스케줄", Icon: Timer },
  webhook: { label: "웹훅", Icon: Radio },
  manual: { label: "수동 실행", Icon: Hand },
} as const;

export default function ExecutionLogTable({ statusFilter }: ExecutionLogTableProps) {
  const rows = useMemo(
    () => (statusFilter === "all" ? EXECUTION_LOG : EXECUTION_LOG.filter((e) => e.status === statusFilter)),
    [statusFilter],
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-900/60 shadow-sm">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <caption className="sr-only">최근 워크플로 실행 로그 — 실행 ID, 워크플로, 상태, 소요시간, 시작 시각</caption>
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th scope="col" className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              실행 ID
            </th>
            <th scope="col" className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              워크플로
            </th>
            <th scope="col" className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              트리거
            </th>
            <th scope="col" className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              소요시간
            </th>
            <th scope="col" className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              시작 시각
            </th>
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
                <td className="px-4 py-3 font-mono text-xs tabular-nums text-zinc-400">{entry.id}</td>
                <td className="px-4 py-3 text-zinc-200">{entry.workflowName}</td>
                <td className="px-4 py-3 text-zinc-400">
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <trigger.Icon className="size-3.5" aria-hidden="true" />
                    {trigger.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-zinc-200">
                  {entry.durationMs === null ? (
                    <span className="text-blue-400">진행중</span>
                  ) : (
                    formatDuration(entry.durationMs)
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <time
                    dateTime={entry.startedAt.toISOString()}
                    className="text-xs tabular-nums text-zinc-400"
                    title={formatTime(entry.startedAt)}
                  >
                    {formatRelative(entry.startedAt, NOW)}
                  </time>
                </td>
                <td className="px-4 py-3 text-right">
                  <StatusBadge status={entry.status} />
                </td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-500">
                선택한 상태에 해당하는 실행 기록이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
