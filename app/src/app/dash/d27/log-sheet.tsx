"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Ban, Pin } from "lucide-react";
import {
  formatBroadcastTime,
  formatPercent,
  type DaySchedule,
  type ProgramSlot,
} from "./data";
import { GenreIcon } from "./genre-icon";
import { reviewLabel } from "./review-status";
import { cn } from "./cn";

const HALF_HOUR_PX = 56;
const PX_PER_MIN = HALF_HOUR_PX / 30;
const CHANNEL_COL_PX = 172;

function pxFor(min: number): number {
  return Math.round(min * PX_PER_MIN);
}

const DAYPARTS: { label: string; fromRaw: number }[] = [
  { label: "조기", fromRaw: 360 },
  { label: "오전", fromRaw: 540 },
  { label: "주간", fromRaw: 750 },
  { label: "저녁", fromRaw: 1050 },
  { label: "프라임", fromRaw: 1200 },
  { label: "심야", fromRaw: 1380 },
];

interface LogSheetProps {
  day: DaySchedule;
  selectedId: string | null;
  onSelect: (id: string) => void;
  showNow: boolean;
  nowRaw: number;
}

export function LogSheet({ day, selectedId, onSelect, showNow, nowRaw }: LogSheetProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollFade = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollFade();
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(updateScrollFade);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScrollFade, day]);

  const starts = useMemo(() => {
    const arr: number[] = [];
    let acc = 0;
    for (const d of day.durations) {
      arr.push(acc);
      acc += d;
    }
    return arr;
  }, [day.durations]);

  const jumpTo = useCallback((fromRaw: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({
      left: Math.max(0, pxFor(fromRaw - 360) - 24),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, []);

  const nowLeft = showNow ? pxFor(nowRaw - 360) : 0;

  return (
    <div className="flex h-full min-h-0 flex-col border border-[var(--rule-strong)] bg-[var(--paper)]">
      {/* 서식 상단 표제 */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-dashed border-[var(--rule-strong)] px-3 py-1.5 sm:px-4">
        <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--ink-soft)]">
          FORM AS-RUN-07 · EPG
        </span>
        <div className="flex items-center gap-1 overflow-x-auto" role="group" aria-label="시간대 바로가기">
          {DAYPARTS.map((dp) => (
            <button
              key={dp.label}
              type="button"
              onClick={() => jumpTo(dp.fromRaw)}
              className="shrink-0 rounded-sm border border-[var(--rule-strong)] px-2 py-1 font-mono text-[10px] font-semibold tracking-wide text-[var(--ink-soft)] transition-colors hover:border-[var(--ballpoint)] hover:text-[var(--ballpoint)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ballpoint)] motion-reduce:transition-none"
            >
              {dp.label}
            </button>
          ))}
          {showNow ? (
            <button
              type="button"
              onClick={() => jumpTo(nowRaw - 30)}
              className="shrink-0 rounded-sm border border-[var(--stamp)] bg-[var(--stamp-12)] px-2 py-1 font-mono text-[10px] font-bold tracking-wide text-[var(--stamp)] transition-colors hover:bg-[var(--stamp)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--stamp)] motion-reduce:transition-none"
            >
              지금
            </button>
          ) : null}
        </div>
      </div>

      {/* 스크롤 시트 본문 */}
      <div className="relative min-h-0 flex-1">
        <div ref={scrollRef} onScroll={updateScrollFade} className="h-full overflow-auto">
          <div className="relative w-max">
            <table className="table-fixed border-separate border-spacing-0">
              <caption className="sr-only">
                {day.dayIndex}요일 아우로라방송 8개 채널 편성표. 06:00부터 다음날 02:00까지, 채널별
                프로그램을 선택하면 상세 정보와 시청률, 광고 슬롯이 오른쪽 패널에 표시됩니다.
              </caption>
              <colgroup>
                <col style={{ width: CHANNEL_COL_PX }} />
                {day.durations.map((d, i) => (
                  <col key={i} style={{ width: pxFor(d) }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 top-0 z-30 border-b border-r border-[var(--rule-strong)] bg-[var(--paper-alt)] px-3 py-2 text-left align-middle font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--ink-soft)]"
                  >
                    채널
                  </th>
                  {starts.map((offset, i) => {
                    const startRaw = 360 + offset;
                    const isHour = startRaw % 60 === 0;
                    return (
                      <th
                        key={i}
                        scope="col"
                        className="sticky top-0 z-20 border-b border-r border-[var(--rule-strong)] bg-[var(--paper-alt)] px-1 py-2 text-center align-bottom"
                      >
                        {isHour ? (
                          <span className="font-mono text-[11px] font-bold tabular-nums text-[var(--ink)]">
                            {formatBroadcastTime(startRaw)}
                          </span>
                        ) : (
                          <span aria-hidden="true" className="mx-auto block h-2 w-px bg-[var(--rule-strong)]" />
                        )}
                        <span className="sr-only">{formatBroadcastTime(startRaw)}부터 {day.durations[i]}분</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {day.rows.map((row) => (
                  <tr key={row.channel.id}>
                    <th
                      scope="row"
                      className="sticky left-0 z-10 border-b border-r border-[var(--rule-strong)] bg-[var(--paper-alt)] px-3 py-2 text-left align-middle"
                    >
                      <span className="flex items-center gap-2">
                        <GenreIcon genre={row.channel.focus} className="h-4 w-4 shrink-0 text-[var(--ink-soft)]" />
                        <span className="flex flex-col leading-tight">
                          <span className="font-mono text-[10px] tabular-nums text-[var(--ink-soft)]">
                            CH.{row.channel.no}
                          </span>
                          <span className="text-[13px] font-semibold text-[var(--ink)]">{row.channel.name}</span>
                        </span>
                      </span>
                    </th>
                    {row.programs.map((program) => (
                      <ProgramCell
                        key={program.id}
                        program={program}
                        channelName={row.channel.name}
                        selected={selectedId === program.id}
                        onSelect={onSelect}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {showNow ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 z-40"
                style={{ left: CHANNEL_COL_PX + nowLeft }}
              >
                <div className="h-full w-px bg-[var(--stamp)]" />
                <div className="sticky top-6 -ml-2.5 flex w-5 flex-col items-center">
                  <Pin className="h-3.5 w-3.5 -rotate-45 text-[var(--stamp)]" aria-hidden="true" />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {canScrollRight ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-50 w-8 bg-gradient-to-l from-[var(--paper)] to-transparent"
          />
        ) : null}
        {canScrollLeft ? (
          <div
            aria-hidden="true"
            style={{ left: CHANNEL_COL_PX }}
            className="pointer-events-none absolute inset-y-0 z-50 w-8 bg-gradient-to-r from-[var(--paper)] to-transparent"
          />
        ) : null}
      </div>

      {/* 범례 */}
      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-t border-dashed border-[var(--rule-strong)] px-3 py-1.5 text-[10px] text-[var(--ink-soft)] sm:px-4">
        <LegendItem swatch={<span className="rounded-sm bg-[var(--stamp)] px-1 text-[9px] font-bold text-white">LIVE</span>} label="생방송" />
        <LegendItem swatch={<span className="font-mono text-[10px] font-bold text-[var(--ink-soft)]">R</span>} label="재방송" />
        <LegendItem swatch={<Ban className="h-3 w-3 text-[var(--stamp)]" aria-hidden="true" />} label="결방" />
        <LegendItem swatch={<span className="h-1.5 w-1.5 rounded-full border border-[var(--stamp)]" aria-hidden="true" />} label="심의대기" />
        <LegendItem swatch={<span className="h-1.5 w-1.5 rounded-full bg-[var(--stamp)]" aria-hidden="true" />} label="재심의요청" />
        {showNow ? (
          <LegendItem swatch={<span className="h-2.5 w-px bg-[var(--stamp)]" aria-hidden="true" />} label={`지금(${formatBroadcastTime(nowRaw)})`} />
        ) : null}
      </div>
    </div>
  );
}

function LegendItem({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex h-4 items-center justify-center">{swatch}</span>
      {label}
    </span>
  );
}

function ProgramCell({
  program,
  channelName,
  selected,
  onSelect,
}: {
  program: ProgramSlot;
  channelName: string;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const compact = program.duration <= 30;
  const flagged = program.reviewStatus === "pending" || program.reviewStatus === "rejected";

  const ariaLabel = [
    channelName,
    program.genre,
    program.title,
    `${formatBroadcastTime(program.startRaw)}~${formatBroadcastTime(program.endRaw)}`,
    `평균 시청률 ${formatPercent(program.rating)}`,
    program.live ? "생방송" : null,
    program.rerun ? "재방송" : null,
    program.preempted ? `결방(${program.preempted.reason})` : null,
    `심의 ${reviewLabel(program.reviewStatus)}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <td className="p-0 align-top">
      <button
        type="button"
        onClick={() => onSelect(program.id)}
        aria-pressed={selected}
        aria-label={ariaLabel}
        title={program.title}
        className={cn(
          "scroll-mt-16 scroll-ml-44 flex h-20 w-full flex-col items-start justify-between gap-1 border-b border-r border-[var(--rule)] px-1.5 py-1.5 text-left transition-colors motion-reduce:transition-none",
          "hover:bg-[var(--paper-alt)] focus-visible:relative focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ballpoint)]",
          selected
            ? "bg-[var(--ballpoint-12)] ring-1 ring-inset ring-[var(--ballpoint)]"
            : "bg-transparent",
        )}
        style={
          program.preempted
            ? {
                backgroundImage:
                  "repeating-linear-gradient(135deg, var(--rule-strong) 0, var(--rule-strong) 1px, transparent 1px, transparent 7px)",
              }
            : undefined
        }
      >
        {program.preempted ? (
          <>
            <span className="flex items-center gap-1 text-[var(--stamp)]">
              <Ban className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="text-[10px] font-bold">결방</span>
            </span>
            {!compact ? (
              <span className="line-clamp-2 text-[11px] font-medium leading-tight text-[var(--ink-soft)]">
                {program.preempted.reason}
              </span>
            ) : null}
          </>
        ) : (
          <>
            <span className="flex w-full items-center justify-between gap-1">
              <GenreIcon genre={program.genre} className="h-3 w-3 shrink-0 text-[var(--ink-soft)]" />
              {program.live ? (
                <span className="rounded-sm bg-[var(--stamp)] px-1 text-[9px] font-bold tracking-wide text-white">
                  LIVE
                </span>
              ) : program.rerun ? (
                <span className="font-mono text-[9px] font-bold text-[var(--ink-soft)]">R</span>
              ) : null}
            </span>
            <span className="line-clamp-2 text-[12px] font-semibold leading-tight text-[var(--ink)]">
              {program.title}
            </span>
            <span className="flex w-full items-center justify-between gap-1">
              <span className="font-mono text-[10px] tabular-nums text-[var(--ink-soft)]">
                {formatBroadcastTime(program.startRaw)}
              </span>
              {flagged && !compact ? (
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full",
                    program.reviewStatus === "rejected" ? "bg-[var(--stamp)]" : "border border-[var(--stamp)]",
                  )}
                  aria-hidden="true"
                />
              ) : null}
            </span>
          </>
        )}
      </button>
    </td>
  );
}
