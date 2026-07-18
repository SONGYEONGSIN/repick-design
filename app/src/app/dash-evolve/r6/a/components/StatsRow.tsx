"use client";

import { Clock3, PlayCircle, Timer } from "lucide-react";
import { PIPELINE, RANGE_OPTIONS, runsInRange, type RangeId } from "../lib/data";
import { formatDuration, formatPct } from "../lib/format";
import { BORDER, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "../lib/tokens";
import { Card, SegmentedControl } from "./ui";

export default function StatsRow({ range, onRangeChange }: { range: RangeId; onRangeChange: (r: RangeId) => void }) {
  const runs = runsInRange(range);
  const completed = runs.filter((r) => r.status !== "running");
  const succeeded = completed.filter((r) => r.status === "success").length;
  const failed = completed.filter((r) => r.status === "failed").length;
  const running = runs.filter((r) => r.status === "running").length;
  const successRate = completed.length > 0 ? (succeeded / completed.length) * 100 : null;
  const avgDuration =
    completed.length > 0 ? Math.round(completed.reduce((sum, r) => sum + r.durationSec, 0) / completed.length) : null;

  const rangeLabel = RANGE_OPTIONS.find((o) => o.id === range)?.label ?? range;

  return (
    <Card>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          <div>
            <p className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>{rangeLabel} 성공률</p>
            <p className={cx("mt-1 text-4xl font-semibold tracking-tight", NUM, TEXT_PRIMARY)}>
              {successRate === null ? "—" : formatPct(successRate)}
            </p>
            <p className={cx("mt-1 text-xs", NUM, TEXT_CAPTION)}>
              완료 {completed.length}건 중 성공 {succeeded} · 실패 {failed}
              {running > 0 ? ` · 진행 중 ${running}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <InlineStat
              Icon={Timer}
              label="평균 소요 시간"
              value={avgDuration === null ? "—" : formatDuration(avgDuration)}
            />
            <InlineStat Icon={Clock3} label="다음 실행 예정" value={PIPELINE.nextRun} />
            <InlineStat Icon={PlayCircle} label="스케줄" value={PIPELINE.schedule} />
          </div>
        </div>

        <div className="shrink-0">
          <SegmentedControl
            ariaLabel="집계 기간"
            options={RANGE_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
            value={range}
            onChange={onRangeChange}
          />
        </div>
      </div>
    </Card>
  );
}

function InlineStat({ Icon, label, value }: { Icon: typeof Timer; label: string; value: string }) {
  return (
    <div className={cx("flex items-start gap-2 border-l pl-3", BORDER)}>
      <Icon size={15} aria-hidden="true" className={cx("mt-0.5 shrink-0", TEXT_CAPTION)} />
      <div className="min-w-0">
        <p className={cx("text-[11px] uppercase tracking-wide", TEXT_CAPTION)}>{label}</p>
        <p className={cx("mt-0.5 text-sm font-semibold", NUM, TEXT_SECONDARY)}>{value}</p>
      </div>
    </div>
  );
}
