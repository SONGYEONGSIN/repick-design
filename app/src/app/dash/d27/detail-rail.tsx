"use client";

import { useMemo } from "react";
import { MonitorPlay, Clock, UserRound, TrendingUp, Banknote } from "lucide-react";
import {
  adSlotMap,
  channelOf,
  formatBroadcastTime,
  formatKRW,
  formatPercent,
  ratingTrace,
  type ProgramSlot,
} from "./data";
import { GenreIcon } from "./genre-icon";
import { ReviewBadge } from "./review-status";
import { cn } from "./cn";

export function DetailRail({ program }: { program: ProgramSlot | null }) {
  const trace = useMemo(() => (program ? ratingTrace(program) : []), [program]);
  const slots = useMemo(() => (program ? adSlotMap(program) : []), [program]);

  if (!program) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 border border-[var(--rule-strong)] bg-[var(--paper)] p-8 text-center">
        <MonitorPlay className="h-8 w-8 text-[var(--ink-soft)]" aria-hidden="true" />
        <p className="max-w-[22ch] text-sm text-[var(--ink-soft)]">
          편성표에서 프로그램을 선택하면 상세 정보, 시청률 추이, 광고 슬롯이 여기에 표시됩니다.
        </p>
      </div>
    );
  }

  const channel = channelOf(program.channelId);
  const peak = trace.reduce((m, p) => Math.max(m, p.value), 0);
  const sold = slots.filter((s) => s.status === "sold").length;
  const hold = slots.filter((s) => s.status === "hold").length;
  const open = slots.filter((s) => s.status === "open").length;
  const soldRevenue = slots.filter((s) => s.status === "sold").reduce((s, x) => s + x.price, 0);

  return (
    <div className="flex h-full flex-col gap-3">
      <h2 className="sr-only">선택한 프로그램 상세</h2>

      {/* 프로그램 상세 */}
      <section className="border border-[var(--rule-strong)] bg-[var(--paper)] p-3.5 sm:p-4" aria-labelledby="rail-detail-h">
        <h3 id="rail-detail-h" className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--ink-soft)]">
          프로그램 상세
        </h3>

        <div className="mb-2 flex items-center gap-1.5 text-[11px] text-[var(--ink-soft)]">
          {channel ? <GenreIcon genre={channel.focus} className="h-3.5 w-3.5" /> : null}
          <span className="font-mono tabular-nums">CH.{channel?.no}</span>
          <span>{channel?.name}</span>
          <span aria-hidden="true">·</span>
          <span>{program.genre}</span>
        </div>

        <p className="text-lg font-bold leading-snug text-[var(--ink)]">{program.title}</p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {program.live ? (
            <span className="rounded-sm bg-[var(--stamp)] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
              LIVE 생방송
            </span>
          ) : null}
          {program.rerun ? (
            <span className="rounded-sm border border-[var(--rule-strong)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--ink-soft)]">
              R 재방송
            </span>
          ) : null}
          <ReviewBadge status={program.reviewStatus} />
        </div>

        {program.preempted ? (
          <p className="mt-2 border border-[var(--stamp)] bg-[var(--stamp-12)] px-2 py-1.5 text-[12px] font-medium text-[var(--stamp)]">
            결방 사유 — {program.preempted.reason}
          </p>
        ) : null}
        {!program.preempted && program.reviewNote ? (
          <p className="mt-2 border border-dashed border-[var(--rule-strong)] px-2 py-1.5 text-[12px] text-[var(--ink-soft)]">
            심의 메모 — {program.reviewNote}
          </p>
        ) : null}

        <p className="mt-2.5 text-[12.5px] leading-relaxed text-[var(--ink-soft)]">{program.synopsis}</p>

        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-dashed border-[var(--rule-strong)] pt-2.5">
          <DetailField icon={<Clock className="h-3 w-3" aria-hidden="true" />} label="방영">
            <span className="font-mono tabular-nums">
              {formatBroadcastTime(program.startRaw)}–{formatBroadcastTime(program.endRaw)}
            </span>
            <span className="ml-1 text-[var(--ink-soft)]">({program.duration}분)</span>
          </DetailField>
          <DetailField icon={<UserRound className="h-3 w-3" aria-hidden="true" />} label="담당 PD">
            {program.pd}
          </DetailField>
          <DetailField icon={<TrendingUp className="h-3 w-3" aria-hidden="true" />} label="평균 시청률">
            <span className="font-mono tabular-nums">{formatPercent(program.rating)}</span>
          </DetailField>
          <DetailField icon={<Banknote className="h-3 w-3" aria-hidden="true" />} label="예상 광고매출">
            <span className="font-mono tabular-nums">{formatKRW(program.adRevenue)}</span>
          </DetailField>
        </dl>
      </section>

      {/* 시청률 추이 */}
      <section className="border border-[var(--rule-strong)] bg-[var(--paper)] p-3.5 sm:p-4" aria-labelledby="rail-rating-h">
        <h3 id="rail-rating-h" className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--ink-soft)]">
          시청률 추이 · 10분 단위
        </h3>
        <div className="mb-2 flex items-baseline gap-4">
          <span className="font-mono text-2xl font-bold tabular-nums text-[var(--ink)]">
            {formatPercent(program.rating)}
            <span className="ml-1 text-xs font-normal text-[var(--ink-soft)]">평균</span>
          </span>
          <span className="font-mono text-sm font-semibold tabular-nums text-[var(--stamp)]">
            {formatPercent(peak)}
            <span className="ml-1 text-xs font-normal text-[var(--ink-soft)]">최고</span>
          </span>
        </div>

        <div
          role="img"
          aria-label={`${program.title} 시청률 추이. 방영 시작부터 ${program.duration}분간 평균 ${formatPercent(program.rating)}, 최고 ${formatPercent(peak)}.`}
          className="relative h-24 border border-[var(--rule)] bg-[repeating-linear-gradient(0deg,var(--rule)_0,var(--rule)_1px,transparent_1px,transparent_8px)] px-1.5 pb-4 pt-2"
        >
          <div className="flex h-full items-end gap-[3px]">
            {trace.map((point) => (
              <div
                key={point.minute}
                className="min-w-[3px] flex-1 border border-b-0 border-[var(--ink)] bg-[var(--ink)]"
                style={{ height: `${Math.min(100, (point.value / Math.max(peak, 1)) * 100)}%` }}
                title={`${point.minute}분 · ${formatPercent(point.value)}`}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-1.5 bottom-0.5 flex justify-between font-mono text-[9px] tabular-nums text-[var(--ink-soft)]">
            <span>0분</span>
            <span>{Math.round(program.duration / 2)}분</span>
            <span>{program.duration}분</span>
          </div>
        </div>
        <table className="sr-only">
          <caption>{program.title} 구간별 시청률</caption>
          <thead>
            <tr>
              <th scope="col">경과 시간</th>
              <th scope="col">시청률</th>
            </tr>
          </thead>
          <tbody>
            {trace.map((point) => (
              <tr key={point.minute}>
                <td>{point.minute}분</td>
                <td>{formatPercent(point.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 광고 슬롯 */}
      <section className="border border-[var(--rule-strong)] bg-[var(--paper)] p-3.5 sm:p-4" aria-labelledby="rail-ad-h">
        <h3 id="rail-ad-h" className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--ink-soft)]">
          광고 슬롯 판매 현황
        </h3>
        <div className="mb-3 flex items-center gap-3 font-mono text-[11px] tabular-nums text-[var(--ink-soft)]">
          <span className="text-[var(--ink)]">판매 {sold}</span>
          <span>보류 {hold}</span>
          <span>공석 {open}</span>
          <span className="ml-auto font-semibold text-[var(--ink)]">{formatKRW(soldRevenue)}</span>
        </div>
        <ul className="flex flex-wrap gap-1.5" aria-label="광고 슬롯 목록">
          {slots.map((slot) => (
            <li
              key={slot.index}
              title={
                slot.status === "sold"
                  ? `${slot.breakIndex + 1}교 ${slot.index + 1}번 · 판매완료 · ${slot.advertiser} · ${formatKRW(slot.price)}`
                  : slot.status === "hold"
                    ? `${slot.breakIndex + 1}교 ${slot.index + 1}번 · 보류 · ${formatKRW(slot.price)}`
                    : `${slot.breakIndex + 1}교 ${slot.index + 1}번 · 공석 · ${formatKRW(slot.price)}`
              }
              className={cn(
                "flex w-[64px] flex-col items-start gap-0.5 border px-1.5 py-1 text-[10px] leading-tight",
                slot.status === "sold" && "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]",
                slot.status === "hold" && "border-dashed border-[var(--ink-soft)] text-[var(--ink-soft)]",
                slot.status === "open" && "border-dashed border-[var(--ballpoint)] text-[var(--ballpoint)]",
              )}
            >
              <span className="font-mono font-bold tabular-nums">
                {slot.breakIndex + 1}-{slot.index + 1}
              </span>
              <span className="truncate w-full">
                {slot.status === "sold" ? slot.advertiser : slot.status === "hold" ? "보류" : "공석"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function DetailField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-[var(--ink-soft)]">
        {icon}
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-[12.5px] font-medium text-[var(--ink)]">{children}</dd>
    </div>
  );
}
