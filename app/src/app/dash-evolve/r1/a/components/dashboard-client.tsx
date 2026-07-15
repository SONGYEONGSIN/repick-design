"use client";

import { useEffect, useMemo, useState } from "react";
import { AlarmClockOff, LayoutList, Table2 } from "lucide-react";
import {
  EVENTS,
  HERO,
  THROUGHPUT,
  type EventCategory,
  type Period,
  type Source,
} from "../lib/data";
import { formatNumber } from "../lib/format";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import HeroBand from "./HeroBand";
import FilterRail, { type SourceFilter, type TypeFilter } from "./FilterRail";
import EventFeed from "./EventFeed";
import EventTable from "./EventTable";
import ContextRail from "./ContextRail";
import CommandPalette from "./CommandPalette";
import { CATEGORY_ORDER, Card, SOURCE_ORDER } from "./ui";

export type FeedView = "timeline" | "table";

const VIEW_OPTIONS: { value: FeedView; label: string; Icon: typeof LayoutList }[] = [
  { value: "timeline", label: "타임라인", Icon: LayoutList },
  { value: "table", label: "테이블", Icon: Table2 },
];

/**
 * Rivet — 실시간 고객 이벤트 인텔리전스 플랫폼.
 * 아키타입: 피드 중심 (중앙 라이브 이벤트 스트림/테이블 + 좌 필터 레일 + 우 탭형 컨텍스트 레일).
 * 인터랙션: ① 처리량 차트 크로스헤어 툴팁 ② 유형/소스 필터 + 테이블 열 정렬(지연·시각)
 * ③ 기간·타임라인/테이블 세그먼트 토글 ④ 필터→피드·테이블·컨텍스트 레일·히어로 동시 동기화
 * ⑤ ⌘K 명령 팔레트(필터·뷰·기간 실행).
 */
export default function DashboardClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("today");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [view, setView] = useState<FeedView>("timeline");
  const [errorOnly, setErrorOnly] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const totalCount = EVENTS.length;

  const typeCounts = useMemo(() => {
    const counts = {} as Record<EventCategory, number>;
    for (const cat of CATEGORY_ORDER) counts[cat] = 0;
    for (const e of EVENTS) counts[e.category] += 1;
    return counts;
  }, []);

  const sourceCounts = useMemo(() => {
    const counts = {} as Record<Source, number>;
    for (const src of SOURCE_ORDER) counts[src] = 0;
    for (const e of EVENTS) counts[e.source] += 1;
    return counts;
  }, []);

  const filteredEvents = useMemo(
    () =>
      EVENTS.filter(
        (e) =>
          (typeFilter === "all" || e.category === typeFilter) &&
          (sourceFilter === "all" || e.source === sourceFilter),
      ),
    [typeFilter, sourceFilter],
  );

  function clearErrorOnly() {
    setTypeFilter("all");
    setErrorOnly(false);
  }

  function handleTypeChange(t: TypeFilter) {
    setTypeFilter(t);
    if (t !== "error") setErrorOnly(false);
  }

  return (
    <div className="flex min-h-dvh bg-zinc-50 font-sans text-zinc-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />

        <main className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col gap-5 p-4 sm:p-6">
          <HeroBand period={period} onPeriodChange={setPeriod} hero={HERO[period]} series={THROUGHPUT[period]} />

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[248px_minmax(0,1fr)_280px]">
            <div className="min-w-0">
              <FilterRail
                typeFilter={typeFilter}
                onTypeChange={handleTypeChange}
                sourceFilter={sourceFilter}
                onSourceChange={setSourceFilter}
                typeCounts={typeCounts}
                sourceCounts={sourceCounts}
                totalCount={totalCount}
              />
            </div>

            <Card as="section" className="min-w-0 overflow-hidden" aria-labelledby="feed-heading">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3.5 sm:px-5">
                <div className="min-w-0">
                  <h2 id="feed-heading" className="text-sm font-semibold text-zinc-900">
                    라이브 이벤트
                  </h2>
                  <p className="mt-0.5 text-xs tabular-nums text-zinc-500">
                    {formatNumber(filteredEvents.length)}건 표시 중 · 총 {formatNumber(totalCount)}건
                  </p>
                </div>
                <div
                  role="radiogroup"
                  aria-label="피드 보기 전환"
                  className="inline-flex shrink-0 items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5"
                >
                  {VIEW_OPTIONS.map((opt) => {
                    const active = opt.value === view;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setView(opt.value)}
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
                          active ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200" : "text-zinc-500 hover:text-zinc-800"
                        }`}
                      >
                        <opt.Icon className="size-3.5" aria-hidden="true" />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {errorOnly && (
                <div className="flex items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800 sm:px-5">
                  <span>오류 이벤트만 표시 중입니다.</span>
                  <button
                    type="button"
                    onClick={clearErrorOnly}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-amber-800 hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                  >
                    <AlarmClockOff className="size-3.5" aria-hidden="true" />
                    필터 해제
                  </button>
                </div>
              )}

              {view === "timeline" ? <EventFeed events={filteredEvents} /> : <EventTable events={filteredEvents} />}
            </Card>

            <ContextRail typeFilter={typeFilter} onTypeChange={handleTypeChange} />
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        setTypeFilter={handleTypeChange}
        setView={setView}
        setPeriod={setPeriod}
        setErrorOnly={setErrorOnly}
      />
    </div>
  );
}
