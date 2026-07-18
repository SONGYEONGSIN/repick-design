"use client";

import { useMemo, useState } from "react";
import { RANGE_OPTIONS, runsInRange, type RangeId, type Run, type RunStatus } from "../lib/data";
import { formatDuration } from "../lib/format";
import { BORDER, DIVIDE, HOVER_ROW, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "../lib/tokens";
import { Badge, Card, CardHeader, SegmentedControl, SortableTh, type SortDir } from "./ui";

const TOTAL_TASKS = 14;

const TRIGGER_LABEL: Record<Run["trigger"], string> = { schedule: "스케줄", manual: "수동", api: "API" };
const STATUS_LABEL_KO: Record<RunStatus, string> = { success: "성공", failed: "실패", running: "실행 중" };

type FilterId = "all" | RunStatus;
const FILTER_OPTIONS: { id: FilterId; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "success", label: "성공" },
  { id: "failed", label: "실패" },
  { id: "running", label: "실행 중" },
];

type SortKey = "started" | "duration" | "status";
const STATUS_RANK: Record<RunStatus, number> = { failed: 0, running: 1, success: 2 };

export default function RunHistoryTable({ range }: { range: RangeId }) {
  const [filter, setFilter] = useState<FilterId>("all");
  const [sortKey, setSortKey] = useState<SortKey>("started");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const rows = useMemo(() => {
    const inRange = runsInRange(range);
    const filtered = filter === "all" ? inRange : inRange.filter((r) => r.status === filter);
    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "started") cmp = a.daysAgo - b.daysAgo;
      else if (sortKey === "duration") cmp = a.durationSec - b.durationSec;
      else cmp = STATUS_RANK[a.status] - STATUS_RANK[b.status];
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [range, filter, sortKey, sortDir]);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "started" ? "asc" : "desc");
    }
  }

  const rangeLabel = RANGE_OPTIONS.find((o) => o.id === range)?.label ?? range;

  return (
    <Card padded={false}>
      <div className="p-4 sm:p-5">
        <CardHeader
          title="런 히스토리"
          titleId="run-history-heading"
          description={`nightly_orders_pipeline · 최근 ${rangeLabel} · ${rows.length}건`}
          action={
            <SegmentedControl ariaLabel="상태 필터" options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
          }
        />
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <div className="min-w-[720px] lg:min-w-0">
            <table className="w-full table-fixed border-collapse text-sm" aria-labelledby="run-history-heading">
              <caption className="sr-only">nightly_orders_pipeline 런 히스토리, 상태 및 소요 시간 기준 정렬 가능</caption>
              <colgroup>
                <col style={{ width: "14%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "19%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "18%" }} />
              </colgroup>
              <thead>
                <tr className={cx("border-b", BORDER)}>
                  <th scope="col" className={cx("py-2 pl-3 text-left text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                    런 ID
                  </th>
                  <th scope="col" className={cx("py-2 text-left text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                    트리거
                  </th>
                  <SortableTh columnKey="started" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                    시작
                  </SortableTh>
                  <SortableTh columnKey="duration" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    소요 시간
                  </SortableTh>
                  <th scope="col" className={cx("py-2 pl-3 text-left text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                    태스크
                  </th>
                  <SortableTh columnKey="status" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                    상태
                  </SortableTh>
                </tr>
              </thead>
              <tbody className={cx("divide-y", DIVIDE)}>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={cx("px-3 py-8 text-center text-sm", TEXT_CAPTION)}>
                      조건에 맞는 런이 없습니다.
                    </td>
                  </tr>
                ) : (
                  rows.map((run) => (
                    <tr key={run.id} className={cx(HOVER_ROW, "transition-colors motion-reduce:transition-none")}>
                      <td className={cx("py-2.5 pl-3 text-left font-mono text-xs", NUM, TEXT_SECONDARY)}>{run.id}</td>
                      <td className={cx("py-2.5 text-left text-xs", TEXT_CAPTION)}>{TRIGGER_LABEL[run.trigger]}</td>
                      <td className={cx("py-2.5 whitespace-nowrap text-left text-xs", NUM, TEXT_SECONDARY)}>
                        {run.dateLabel} {run.timeLabel}
                      </td>
                      <td className={cx("py-2.5 whitespace-nowrap text-right text-xs", NUM, TEXT_SECONDARY)}>
                        {formatDuration(run.durationSec)}
                      </td>
                      <td className="py-2.5 pl-3 text-left">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={cx("whitespace-nowrap text-xs", NUM, TEXT_PRIMARY)}>
                            {run.succeeded}/{TOTAL_TASKS}
                          </span>
                          {run.failed > 0 ? (
                            <Badge tone="failed">
                              <span className={NUM}>{run.failed}</span>&nbsp;실패
                            </Badge>
                          ) : null}
                        </div>
                      </td>
                      <td className="py-2.5 text-left">
                        <Badge tone={run.status}>{STATUS_LABEL_KO[run.status]}</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}
