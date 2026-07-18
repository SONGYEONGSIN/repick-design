"use client";

import { ArrowDownRight, ArrowUpRight, RotateCw } from "lucide-react";
import { downstreamOf, TASK_TYPE_ICON, TASK_TYPE_LABEL, taskById } from "../lib/data";
import { formatDuration } from "../lib/format";
import { BORDER, CODE, DIVIDE, FOCUS_RING, HOVER_ACTIVE_BG, STATUS, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "../lib/tokens";
import { Badge, Card, CardHeader, EyebrowLabel } from "./ui";

const STATUS_LABEL_KO: Record<string, string> = {
  success: "성공",
  running: "실행 중",
  failed: "실패",
  pending: "대기",
};

function DepChip({ id, onSelect }: { id: string; onSelect: (id: string) => void }) {
  const t = taskById(id);
  if (!t) return null;
  const tone = STATUS[t.status];
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cx(
        "inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs",
        tone.border,
        tone.bg,
        HOVER_ACTIVE_BG,
        TRANSITION,
        FOCUS_RING,
      )}
    >
      <span aria-hidden="true" className={cx("h-1.5 w-1.5 shrink-0 rounded-full", tone.dot)} />
      <span className={cx(CODE, "text-[11px]", TEXT_PRIMARY)}>{t.label}</span>
    </button>
  );
}

export default function TaskDetailPanel({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const task = taskById(selectedId);
  if (!task) return null;

  const Icon = TASK_TYPE_ICON[task.type];
  const tone = STATUS[task.status];
  const downstream = downstreamOf(task.id);

  return (
    <Card className="flex h-full min-w-0 flex-col overflow-hidden 2xl:col-span-3" padded={false}>
      <div className={cx("border-b p-4", BORDER)}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <EyebrowLabel>{TASK_TYPE_LABEL[task.type]} 태스크</EyebrowLabel>
            <h2 className={cx("mt-0.5 truncate font-mono text-sm font-semibold", TEXT_PRIMARY)}>{task.label}</h2>
          </div>
          <span className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-lg", tone.bg)}>
            <Icon size={16} aria-hidden="true" className={tone.text} />
          </span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge tone={task.status}>{STATUS_LABEL_KO[task.status]}</Badge>
          {task.retries > 0 ? (
            <span className={cx("inline-flex items-center gap-1 text-xs", TEXT_CAPTION)}>
              <RotateCw size={12} aria-hidden="true" />
              재시도 {task.retries}회
            </span>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 [scrollbar-width:thin]">
        <dl className="grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
          <div>
            <dt className={cx("text-[11px] uppercase tracking-wide", TEXT_CAPTION)}>소요 시간</dt>
            <dd className={cx("mt-0.5 font-medium tabular-nums", TEXT_PRIMARY)}>
              {task.status === "pending" ? "—" : formatDuration(task.durationSec)}
            </dd>
          </div>
          <div>
            <dt className={cx("text-[11px] uppercase tracking-wide", TEXT_CAPTION)}>시작 시각</dt>
            <dd className={cx("mt-0.5 font-medium tabular-nums", TEXT_PRIMARY)}>{task.startedAt || "—"}</dd>
          </div>
          <div className="col-span-2">
            <dt className={cx("text-[11px] uppercase tracking-wide", TEXT_CAPTION)}>오너</dt>
            <dd className={cx("mt-0.5 truncate font-medium", TEXT_PRIMARY)}>{task.owner}</dd>
          </div>
        </dl>

        <p className={cx("mt-4 text-sm leading-relaxed", TEXT_CAPTION)}>{task.note}</p>

        <div className="mt-4">
          <EyebrowLabel>업스트림 의존성</EyebrowLabel>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {task.upstream.length === 0 ? (
              <span className={cx("text-xs", TEXT_CAPTION)}>없음 (소스 태스크)</span>
            ) : (
              task.upstream.map((id) => (
                <span key={id} className="inline-flex items-center gap-1">
                  <ArrowUpRight size={12} aria-hidden="true" className={TEXT_CAPTION} />
                  <DepChip id={id} onSelect={onSelect} />
                </span>
              ))
            )}
          </div>
        </div>

        <div className="mt-3">
          <EyebrowLabel>다운스트림 의존성</EyebrowLabel>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {downstream.length === 0 ? (
              <span className={cx("text-xs", TEXT_CAPTION)}>없음 (종단 태스크)</span>
            ) : (
              downstream.map((id) => (
                <span key={id} className="inline-flex items-center gap-1">
                  <ArrowDownRight size={12} aria-hidden="true" className={TEXT_CAPTION} />
                  <DepChip id={id} onSelect={onSelect} />
                </span>
              ))
            )}
          </div>
        </div>

        <div className="mt-4">
          <CardHeader as="h3" title="로그" description="최근 실행 로그 발췌" />
          <div className={cx("mt-2 divide-y rounded-lg border", BORDER, DIVIDE, "bg-zinc-50 dark:bg-zinc-950")}>
            {task.log.map((line, i) => (
              <p key={i} className={cx("px-3 py-1.5 text-[11px] leading-relaxed", CODE, TEXT_CAPTION)}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
