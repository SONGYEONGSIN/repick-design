"use client";

import { ArrowRight, Scissors } from "lucide-react";
import {
  DAYS,
  formatBroadcastTime,
  formatKRWCompact,
  formatPercent,
  type DaySummary,
  type ReviewItem,
} from "./data";
import { ReviewBadge } from "./review-status";
import { cn } from "./cn";

interface WeeklyReportProps {
  summary: DaySummary[];
  reviewQueue: ReviewItem[];
  selectedDay: number;
  selectedProgramId: string | null;
  onJump: (dayIndex: number, programId: string) => void;
}

export function WeeklyReport({ summary, reviewQueue, selectedDay, selectedProgramId, onJump }: WeeklyReportProps) {
  return (
    <div className="min-w-0 border-t border-[var(--rule-strong)] bg-[var(--paper)]">
      <div className="flex items-center gap-2 border-b border-dashed border-[var(--rule-strong)] px-3 py-1.5 text-[10px] text-[var(--ink-soft)] sm:px-4">
        <Scissors className="h-3 w-3" aria-hidden="true" />
        <span className="font-mono tracking-widest">사본 보관용 · 주간 리포트</span>
      </div>
      <div className="flex flex-col gap-3 p-3 lg:flex-row sm:p-4">
        <section aria-labelledby="wk-ledger-h" className="min-w-0 overflow-x-auto border border-[var(--rule-strong)] p-3 lg:basis-[42%]">
          <h2 id="wk-ledger-h" className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--ink-soft)]">
            주간 성과 요약 · {DAYS[0]}~{DAYS[6]}
          </h2>
          <table className="w-full min-w-[480px] border-separate border-spacing-0 text-[11px]">
            <caption className="sr-only">요일별 채널 가동 지표 — 평균 시청률, 총 광고매출, 생방송/재방송 편성 수, 심의 확인 필요 건수, 결방 건수</caption>
            <thead>
              <tr>
                <th scope="col" className="border-b border-[var(--rule-strong)] px-2 py-1.5 text-left font-medium text-[var(--ink-soft)]">
                  지표
                </th>
                {summary.map((d) => (
                  <th
                    key={d.dayIndex}
                    scope="col"
                    className={cn(
                      "border-b border-[var(--rule-strong)] px-1.5 py-1.5 text-center font-mono",
                      d.dayIndex === selectedDay && "bg-[var(--ballpoint-12)]",
                    )}
                  >
                    <span className="block font-bold text-[var(--ink)]">{d.label}</span>
                    <span className="block text-[9px] font-normal tabular-nums text-[var(--ink-soft)]">{d.dateLabel}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <MetricRow label="평균 시청률" selectedDay={selectedDay} summary={summary} get={(d) => formatPercent(d.avgRating)} />
              <MetricRow label="총 광고매출" selectedDay={selectedDay} summary={summary} get={(d) => formatKRWCompact(d.totalAdRevenue)} />
              <MetricRow label="생방송 편성" selectedDay={selectedDay} summary={summary} get={(d) => `${d.liveCount}건`} />
              <MetricRow label="재방송 편성" selectedDay={selectedDay} summary={summary} get={(d) => `${d.rerunCount}건`} />
              <MetricRow
                label="심의 확인 필요"
                selectedDay={selectedDay}
                summary={summary}
                get={(d) => `${d.reviewFlags}건`}
                emphasizeWhen={(d) => d.reviewFlags > 0}
              />
              <MetricRow
                label="결방"
                selectedDay={selectedDay}
                summary={summary}
                get={(d) => (d.preemptedCount > 0 ? `${d.preemptedCount}건` : "—")}
                emphasizeWhen={(d) => d.preemptedCount > 0}
                last
              />
            </tbody>
          </table>
        </section>

        <section aria-labelledby="wk-review-h" className="min-w-0 overflow-x-auto border border-[var(--rule-strong)] p-3 [contain:paint] lg:basis-[58%]">
          <h2 id="wk-review-h" className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--ink-soft)]">
            심의 일정
          </h2>
          <table className="w-full min-w-[560px] border-separate border-spacing-0 text-[11px]">
            <caption className="sr-only">방영 예정 프로그램의 심의 구분, 마감, 상태 — 열의 이동 버튼으로 편성표에서 확인 가능</caption>
            <thead>
              <tr>
                {["프로그램", "채널", "방영", "구분", "마감", "상태"].map((h) => (
                  <th key={h} scope="col" className="border-b border-[var(--rule-strong)] px-2 py-1.5 text-left font-medium text-[var(--ink-soft)]">
                    {h}
                  </th>
                ))}
                <th scope="col" className="border-b border-[var(--rule-strong)] px-2 py-1.5">
                  <span className="sr-only">이동</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {reviewQueue.map((item) => {
                const active = item.programId === selectedProgramId;
                return (
                  <tr key={item.id} className={cn(active && "bg-[var(--ballpoint-12)]")}>
                    <td className="border-b border-[var(--rule)] px-2 py-1.5 font-medium text-[var(--ink)]">
                      <span className="line-clamp-1 max-w-[16ch]">{item.title}</span>
                    </td>
                    <td className="border-b border-[var(--rule)] px-2 py-1.5 text-[var(--ink-soft)]">{item.channelName}</td>
                    <td className="border-b border-[var(--rule)] px-2 py-1.5 font-mono tabular-nums text-[var(--ink-soft)]">
                      {DAYS[item.dayIndex]} {formatBroadcastTime(item.startRaw)}
                    </td>
                    <td className="border-b border-[var(--rule)] px-2 py-1.5 text-[var(--ink-soft)]">{item.kind}</td>
                    <td className="border-b border-[var(--rule)] px-2 py-1.5 font-mono tabular-nums text-[var(--ink-soft)]">
                      {DAYS[item.dayIndex]} {formatBroadcastTime(item.deadlineRaw)}
                    </td>
                    <td className="border-b border-[var(--rule)] px-2 py-1.5">
                      <ReviewBadge status={item.reviewStatus} />
                    </td>
                    <td className="border-b border-[var(--rule)] px-1 py-1.5">
                      <button
                        type="button"
                        onClick={() => onJump(item.dayIndex, item.programId)}
                        className="inline-flex items-center gap-1 rounded-sm border border-[var(--rule-strong)] px-1.5 py-1 text-[10px] font-semibold text-[var(--ballpoint)] transition-colors hover:border-[var(--ballpoint)] hover:bg-[var(--ballpoint-12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ballpoint)] motion-reduce:transition-none"
                      >
                        편성표 보기
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {reviewQueue.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-2 py-4 text-center text-[var(--ink-soft)]">
                    이번 주 확인이 필요한 심의 항목이 없습니다.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

function MetricRow({
  label,
  summary,
  selectedDay,
  get,
  emphasizeWhen,
  last,
}: {
  label: string;
  summary: DaySummary[];
  selectedDay: number;
  get: (d: DaySummary) => string;
  emphasizeWhen?: (d: DaySummary) => boolean;
  last?: boolean;
}) {
  return (
    <tr>
      <th
        scope="row"
        className={cn(
          "px-2 py-1.5 text-left font-medium text-[var(--ink-soft)]",
          !last && "border-b border-[var(--rule)]",
        )}
      >
        {label}
      </th>
      {summary.map((d) => (
        <td
          key={d.dayIndex}
          className={cn(
            "px-1.5 py-1.5 text-center font-mono tabular-nums text-[var(--ink)]",
            !last && "border-b border-[var(--rule)]",
            d.dayIndex === selectedDay && "bg-[var(--ballpoint-12)]",
            emphasizeWhen?.(d) && "font-bold text-[var(--stamp)]",
          )}
        >
          {get(d)}
        </td>
      ))}
    </tr>
  );
}
