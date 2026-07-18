"use client";

import { CheckCircle2, CircleDashed, Loader2, XCircle } from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { EDGES, GRAPH_VB, TASK_TYPE_ICON, TASKS, taskById, taskPos, type Task, type TaskStatus } from "../lib/data";
import { formatDuration } from "../lib/format";
import { round2 } from "../lib/math";
import { FOCUS_RING_INSET, STATUS, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "../lib/tokens";

const NODE_HALF_W = 56;

const STATUS_ICON: Record<TaskStatus, typeof CheckCircle2> = {
  success: CheckCircle2,
  running: Loader2,
  failed: XCircle,
  pending: CircleDashed,
};

const STATUS_LABEL_KO: Record<TaskStatus, string> = {
  success: "성공",
  running: "실행 중",
  failed: "실패",
  pending: "대기",
};

function edgePath(from: Task, to: Task): string {
  const a = taskPos(from);
  const b = taskPos(to);
  const x1 = round2(a.x + NODE_HALF_W);
  const y1 = round2(a.y);
  const x2 = round2(b.x - NODE_HALF_W);
  const y2 = round2(b.y);
  const cx1 = round2(x1 + (x2 - x1) * 0.5);
  const cx2 = round2(x2 - (x2 - x1) * 0.5);
  return `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;
}

export default function DagCanvas({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const selected = taskById(selectedId);
  const connectedTaskIds = new Set<string>();
  if (selected) {
    connectedTaskIds.add(selected.id);
    selected.upstream.forEach((u) => connectedTaskIds.add(u));
    TASKS.filter((t) => t.upstream.includes(selected.id)).forEach((t) => connectedTaskIds.add(t.id));
  }

  function isEdgeHighlighted(fromId: string, toId: string): boolean {
    if (!selected) return false;
    return (fromId === selected.id || toId === selected.id) && connectedTaskIds.has(fromId) && connectedTaskIds.has(toId);
  }

  function onNodeKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, task: Task) {
    const byCol = (col: number, lane: number) =>
      TASKS.filter((t) => t.col === col).sort((a, b) => Math.abs(a.lane - lane) - Math.abs(b.lane - lane))[0];
    let target: Task | undefined;
    if (e.key === "ArrowRight") target = byCol(task.col + 1, task.lane);
    else if (e.key === "ArrowLeft") target = byCol(task.col - 1, task.lane);
    else if (e.key === "ArrowDown") target = TASKS.find((t) => t.col === task.col && t.lane === task.lane + 1);
    else if (e.key === "ArrowUp") target = TASKS.find((t) => t.col === task.col && t.lane === task.lane - 1);
    if (target) {
      e.preventDefault();
      onSelect(target.id);
      document.getElementById(`dag-node-${target.id}`)?.focus();
    }
  }

  return (
    <div className="overflow-x-auto [scrollbar-width:thin]" role="group" aria-label="nightly_orders_pipeline 태스크 그래프, 좌우로 스크롤 가능">
      <div className="relative min-w-[860px] w-full" style={{ aspectRatio: `${GRAPH_VB.w} / ${GRAPH_VB.h}` }}>
        <svg
          viewBox={`0 0 ${GRAPH_VB.w} ${GRAPH_VB.h}`}
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
          focusable="false"
        >
          {EDGES.map((edge) => {
            const from = taskById(edge.from);
            const to = taskById(edge.to);
            if (!from || !to) return null;
            const highlighted = isEdgeHighlighted(edge.from, edge.to);
            return (
              <path
                key={`${edge.from}-${edge.to}`}
                d={edgePath(from, to)}
                fill="none"
                strokeWidth={highlighted ? 2.25 : 1.5}
                className={cx(
                  TRANSITION,
                  highlighted
                    ? "stroke-violet-500 dark:stroke-violet-400"
                    : selected
                      ? "stroke-zinc-200 dark:stroke-zinc-800"
                      : "stroke-zinc-300 dark:stroke-zinc-700",
                )}
              />
            );
          })}
        </svg>

        {TASKS.map((task) => {
          const pos = taskPos(task);
          const Icon = TASK_TYPE_ICON[task.type];
          const StatIcon = STATUS_ICON[task.status];
          const tone = STATUS[task.status];
          const isSelected = task.id === selectedId;
          const isDimmed = Boolean(selected) && !connectedTaskIds.has(task.id);
          return (
            <button
              key={task.id}
              id={`dag-node-${task.id}`}
              type="button"
              onClick={() => onSelect(task.id)}
              onKeyDown={(e) => onNodeKeyDown(e, task)}
              aria-pressed={isSelected}
              aria-label={`${task.label} 태스크, 상태 ${STATUS_LABEL_KO[task.status]}, 소요 시간 ${
                task.status === "pending" ? "없음" : formatDuration(task.durationSec)
              }, 재시도 ${task.retries}회. 클릭하면 상세 패널에 로그와 의존 관계가 표시됩니다.`}
              style={{ left: `${round2((pos.x / GRAPH_VB.w) * 100)}%`, top: `${round2((pos.y / GRAPH_VB.h) * 100)}%` }}
              className={cx(
                "absolute w-28 -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 p-2 text-left shadow-sm",
                TRANSITION,
                FOCUS_RING_INSET,
                isDimmed ? "opacity-40" : "opacity-100",
                isSelected ? "border-violet-500 ring-2 ring-violet-200 dark:ring-violet-500/30" : tone.border,
                "bg-white dark:bg-zinc-900",
              )}
            >
              <span className="flex items-center gap-1.5">
                <span className={cx("grid h-5 w-5 shrink-0 place-items-center rounded-md", tone.bg)}>
                  <Icon size={11} aria-hidden="true" className={tone.text} />
                </span>
                <span className={cx("truncate font-mono text-[11px] font-medium", TEXT_PRIMARY)}>{task.label}</span>
              </span>
              <span className="mt-1.5 flex items-center justify-between gap-1">
                <span className={cx("inline-flex items-center gap-1 text-[11px] font-medium", tone.text)}>
                  <StatIcon
                    size={11}
                    aria-hidden="true"
                    className={task.status === "running" ? "motion-safe:animate-spin" : undefined}
                  />
                  {STATUS_LABEL_KO[task.status]}
                </span>
                <span className={cx("text-[11px] tabular-nums", TEXT_CAPTION)}>
                  {task.status === "pending" ? "—" : formatDuration(task.durationSec)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DagLegend() {
  const items: TaskStatus[] = ["success", "running", "failed", "pending"];
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map((s) => {
        const Icon = STATUS_ICON[s];
        return (
          <li key={s} className={cx("inline-flex items-center gap-1.5 text-xs", TEXT_CAPTION)}>
            <Icon size={12} aria-hidden="true" className={STATUS[s].text} />
            {STATUS_LABEL_KO[s]}
          </li>
        );
      })}
    </ul>
  );
}
