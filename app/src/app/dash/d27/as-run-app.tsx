"use client";

import { useCallback, useMemo, useRef, useState, type CSSProperties } from "react";
import { Bell, Stamp, Ban } from "lucide-react";
import {
  DATE_LABELS,
  DAYS,
  NOW_DAY_INDEX,
  NOW_RAW,
  STATION_NAME,
  WEEKDAY_PRIME_INDEX,
  WEEKEND_PRIME_INDEX,
  WEEK_LABEL,
  findProgram,
  type DaySchedule,
  type DaySummary,
  type ReviewItem,
} from "./data";
import { LogSheet } from "./log-sheet";
import { DetailRail } from "./detail-rail";
import { WeeklyReport } from "./weekly-report";
import { cn } from "./cn";

const PAPER_VARS = {
  "--paper": "#f4f0e6",
  "--paper-alt": "#eae3cf",
  "--ink": "#201d17",
  "--ink-soft": "#4a4433",
  "--rule": "#d8cead",
  "--rule-strong": "#8f8262",
  "--stamp": "#8f2620",
  "--stamp-12": "rgba(143, 38, 32, 0.10)",
  "--ballpoint": "#1a4275",
  "--ballpoint-12": "rgba(26, 66, 117, 0.10)",
} as CSSProperties;

function defaultProgramIdFor(dayIndex: number): string {
  const isWeekend = dayIndex >= 5;
  const slot = isWeekend ? WEEKEND_PRIME_INDEX : WEEKDAY_PRIME_INDEX;
  return `a1-d${dayIndex}-s${slot}`;
}

interface AsRunAppProps {
  week: DaySchedule[];
  summary: DaySummary[];
  reviewQueue: ReviewItem[];
  defaultProgramId: string;
}

export function AsRunApp({ week, summary, reviewQueue, defaultProgramId }: AsRunAppProps) {
  const [dayIndex, setDayIndex] = useState(NOW_DAY_INDEX);
  const [selectedId, setSelectedId] = useState<string | null>(defaultProgramId);
  const sheetRef = useRef<HTMLDivElement>(null);

  const day = week[dayIndex];
  const selectedProgram = useMemo(() => findProgram(week, selectedId), [week, selectedId]);

  const handleSelectDay = useCallback(
    (nextDay: number) => {
      setDayIndex(nextDay);
      setSelectedId((prev) => {
        if (!prev) return defaultProgramIdFor(nextDay);
        const match = prev.match(/^(.+)-d\d+-s(\d+)$/);
        if (!match) return defaultProgramIdFor(nextDay);
        const candidateId = `${match[1]}-d${nextDay}-s${match[2]}`;
        return findProgram(week, candidateId) ? candidateId : defaultProgramIdFor(nextDay);
      });
    },
    [week],
  );

  const handleJump = useCallback((targetDay: number, programId: string) => {
    setDayIndex(targetDay);
    setSelectedId(programId);
    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sheetRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, []);

  return (
    <div
      className="flex min-h-dvh w-full flex-col overflow-x-clip bg-[var(--paper)] text-[var(--ink)]"
      style={PAPER_VARS}
    >
      <header className="min-w-0 shrink-0 border-b border-[var(--rule-strong)] bg-[var(--paper-alt)] px-3 py-2.5 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-[var(--ink)] font-mono text-xs font-black text-[var(--ink)]"
            >
              AR
            </div>
            <div className="leading-tight">
              <h1 className="font-mono text-base font-black tracking-[0.08em] text-[var(--ink)] sm:text-lg">
                AS-RUN
              </h1>
              <p className="font-display text-sm italic text-[var(--ink-soft)]">일일 편성 트래픽 로그</p>
            </div>
            <div className="hidden h-8 w-px bg-[var(--rule-strong)] sm:block" aria-hidden="true" />
            <div className="hidden flex-col text-[11px] leading-tight text-[var(--ink-soft)] sm:flex">
              <span className="font-semibold text-[var(--ink)]">{STATION_NAME}</span>
              <span className="font-mono tabular-nums">{WEEK_LABEL}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden -rotate-3 items-center gap-1.5 border-2 border-[var(--stamp)] px-2 py-1 font-mono text-[10px] font-bold tracking-widest text-[var(--stamp)] sm:inline-flex">
              <Stamp className="h-3.5 w-3.5" aria-hidden="true" />
              편성심의 승인
            </span>
            <button
              type="button"
              aria-label="알림 3건 확인"
              className="relative flex h-11 w-11 items-center justify-center border border-[var(--rule-strong)] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ballpoint)] motion-reduce:transition-none"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--stamp)]" aria-hidden="true" />
            </button>
            <div className="flex items-center gap-2 border border-[var(--rule-strong)] py-1 pl-1 pr-3">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ink)] font-mono text-[11px] font-bold text-[var(--paper)]"
              >
                강
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[12px] font-semibold text-[var(--ink)]">강지현</span>
                <span className="text-[10px] text-[var(--ink-soft)]">편성PD · 트래픽팀</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <nav aria-label="편성 요일 선택" className="min-w-0 shrink-0 border-b border-[var(--rule-strong)] bg-[var(--paper)] px-3 py-2 sm:px-4">
        <div role="group" aria-label="요일" className="flex gap-1.5 overflow-x-auto pb-0.5">
          {DAYS.map((label, i) => {
            const active = i === dayIndex;
            const hasPreempt = summary[i].preemptedCount > 0;
            return (
              <button
                key={label}
                type="button"
                onClick={() => handleSelectDay(i)}
                aria-pressed={active}
                className={cn(
                  "flex min-w-[64px] shrink-0 flex-col items-center gap-0.5 border px-2.5 py-1.5 transition-colors motion-reduce:transition-none",
                  active
                    ? "border-[var(--ballpoint)] bg-[var(--ballpoint-12)]"
                    : "border-[var(--rule-strong)] hover:bg-[var(--paper-alt)]",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ballpoint)]",
                )}
              >
                <span className={cn("text-[13px] font-bold", active ? "text-[var(--ballpoint)]" : "text-[var(--ink)]")}>
                  {label}
                </span>
                <span className="font-mono text-[9px] tabular-nums text-[var(--ink-soft)]">{DATE_LABELS[i]}</span>
                {hasPreempt ? (
                  <Ban className="h-2.5 w-2.5 text-[var(--stamp)]" aria-hidden="true" />
                ) : (
                  <span className="h-2.5" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="min-w-0 flex flex-1 flex-col gap-3 p-3 sm:p-4 lg:flex-row">
        <div ref={sheetRef} className="min-w-0 flex-1 scroll-mt-4 h-[460px] sm:h-[540px] lg:h-[640px]">
          <LogSheet
            day={day}
            selectedId={selectedId}
            onSelect={setSelectedId}
            showNow={dayIndex === NOW_DAY_INDEX}
            nowRaw={NOW_RAW}
          />
        </div>
        <div className="min-w-0 w-full shrink-0 lg:h-[640px] lg:w-[380px] lg:overflow-y-auto">
          <DetailRail program={selectedProgram} />
        </div>
      </main>

      <WeeklyReport
        summary={summary}
        reviewQueue={reviewQueue}
        selectedDay={dayIndex}
        selectedProgramId={selectedId}
        onJump={handleJump}
      />

      <footer className="min-w-0 shrink-0 border-t border-[var(--rule-strong)] bg-[var(--paper-alt)] px-3 py-2 text-center text-[10px] text-[var(--ink-soft)] sm:px-4">
        본 서식은 사내 편성 트래픽 관리 표준을 따릅니다 · AS-RUN v1.0 · {STATION_NAME} 편성운영팀 발행
      </footer>
    </div>
  );
}
