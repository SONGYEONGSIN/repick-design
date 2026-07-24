"use client";

import { useEffect, useMemo, useState } from "react";
import {
  closedByPeriod,
  deals as ALL_DEALS,
  getOwner,
  periodMeta,
  trendByPeriod,
  type Deal,
  type Period,
  type Stage,
} from "./data";
import type { BoardControls, SortKey, SortState, ViewMode } from "./types";
import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";
import { Toolbar } from "./toolbar";
import { StatBar, type StatBarData } from "./stat-bar";
import { Board } from "./board";
import { DealList } from "./deal-list";
import { CommandPalette } from "./command-palette";

const STAGE_RANK: Record<Stage, number> = { lead: 0, qualify: 1, proposal: 2, negotiation: 3 };
const DEFAULT_DIR: Record<SortKey, "asc" | "desc"> = {
  amount: "desc",
  probability: "desc",
  closeDate: "asc",
  company: "asc",
  stage: "asc",
};

function compareDeals(a: Deal, b: Deal, sort: SortState): number {
  let diff = 0;
  switch (sort.key) {
    case "amount":
      diff = a.amount - b.amount;
      break;
    case "probability":
      diff = a.probability - b.probability;
      break;
    case "closeDate":
      diff = a.closeDate.localeCompare(b.closeDate);
      break;
    case "company":
      diff = a.company.localeCompare(b.company, "ko");
      break;
    case "stage":
      diff = STAGE_RANK[a.stage] - STAGE_RANK[b.stage];
      break;
  }
  if (diff === 0) diff = b.amount - a.amount; // 안정적 2차 정렬
  return sort.dir === "asc" ? diff : -diff;
}

export function BoardApp() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("board");
  const [period, setPeriod] = useState<Period>("quarter");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [sort, setSort] = useState<SortState>({ key: "amount", dir: "desc" });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // 담당자 필터 → 정렬 적용 (보드·리스트·스탯바가 함께 반응)
  const filteredSorted = useMemo(() => {
    const base = ownerFilter === "all" ? ALL_DEALS : ALL_DEALS.filter((d) => d.ownerId === ownerFilter);
    return [...base].sort((a, b) => compareDeals(a, b, sort));
  }, [ownerFilter, sort]);

  const grouped = useMemo(() => {
    const g = { lead: [], qualify: [], proposal: [], negotiation: [] } as Record<Stage, Deal[]>;
    for (const d of filteredSorted) g[d.stage].push(d);
    return g;
  }, [filteredSorted]);

  const statData: StatBarData = useMemo(() => {
    const totalPipeline = filteredSorted.reduce((acc, d) => acc + d.amount, 0);
    const weightedForecast = Math.round(
      filteredSorted.reduce((acc, d) => acc + (d.amount * d.probability) / 100, 0)
    );
    const openCount = filteredSorted.length;
    const avgDeal = openCount === 0 ? 0 : Math.round(totalPipeline / openCount);
    const closed = closedByPeriod[period];
    const totalClosed = closed.wonCount + closed.lostCount;
    const winRate = totalClosed === 0 ? 0 : Math.round((closed.wonCount / totalClosed) * 100);
    const trend = trendByPeriod[period];
    return {
      scopeLabel: ownerFilter === "all" ? "전체 팀" : getOwner(ownerFilter).name,
      totalPipeline,
      weightedForecast,
      openCount,
      periodLabel: periodMeta[period].label,
      wonAmount: closed.wonAmount,
      wonCount: closed.wonCount,
      winRate,
      avgDeal,
      trend: trend.points,
      trendUnit: trend.unit,
    };
  }, [filteredSorted, ownerFilter, period]);

  const controls: BoardControls = {
    view,
    setView,
    period,
    setPeriod,
    ownerFilter,
    setOwnerFilter,
    sort,
    setSort,
  };

  function handleHeaderSort(key: SortKey) {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: DEFAULT_DIR[key] }
    );
  }

  const totalOpen = ALL_DEALS.length;

  return (
    <div className="flex min-h-screen bg-zinc-50 lg:h-screen lg:overflow-hidden">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col lg:overflow-hidden">
        <TopBar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileMenu={() => setMobileNavOpen(true)}
        />

        <main className="flex min-w-0 flex-1 flex-col lg:min-h-0 lg:overflow-hidden">
          <div className="mx-auto flex w-full max-w-[1760px] flex-1 flex-col gap-4 px-4 py-5 sm:px-6 lg:min-h-0 lg:overflow-hidden">
            {/* 페이지 헤더 + 컨트롤 */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900">영업 파이프라인</h1>
                <p className="mt-0.5 text-sm text-zinc-500">
                  Northwind Sales · 진행 거래 {statData.openCount}
                  {ownerFilter === "all" ? `건 (전체 ${totalOpen}건)` : `건 · ${statData.scopeLabel} 담당`}
                </p>
              </div>
              <Toolbar controls={controls} />
            </div>

            <StatBar data={statData} />

            {/* 메인 영역 — 칸반 보드가 주인공(기본), 리스트 뷰는 정렬 테이블 */}
            {view === "board" ? (
              <div className="min-w-0 flex-1 lg:min-h-0">
                <Board grouped={grouped} />
              </div>
            ) : (
              <div className="min-w-0 flex-1 lg:min-h-0 lg:overflow-y-auto lg:[scrollbar-width:thin]">
                <DealList deals={filteredSorted} sort={sort} onSort={handleHeaderSort} />
              </div>
            )}
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
