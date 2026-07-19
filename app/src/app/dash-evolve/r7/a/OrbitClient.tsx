"use client";

import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import DetailPanel from "./DetailPanel";
import OrbitCanvas from "./OrbitCanvas";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TransitionTable from "./TransitionTable";
import {
  CUSTOMERS,
  PERIODS,
  STAGE_META,
  STAGE_ORDER,
  avgHealth,
  churnRisk,
  formatCount,
  netExpansions,
  stageCounts,
  visibleCustomers,
  type FilterId,
  type PeriodId,
} from "./data";
import { BORDER, FOCUS_RING, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Card, CardHeader, EyebrowLabel, SegmentedControl } from "./ui";

const COUNTS = stageCounts();

export default function OrbitClient() {
  const [selectedId, setSelectedId] = useState(CUSTOMERS[0].id);
  const [filter, setFilter] = useState<FilterId>("all");
  const [period, setPeriod] = useState<PeriodId>("30d");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", "bg-zinc-50 dark:bg-zinc-950", TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-4 p-4 sm:p-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>고객 라이프사이클 궤도</h1>
                <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Northwind Cloud · 고객 성공팀 워크스페이스</p>
              </div>
            </header>

            <StatBand filter={filter} period={period} onPeriodChange={setPeriod} />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <Card className="min-w-0 xl:col-span-8" padded={false}>
                <div className="p-4 sm:p-5">
                  <CardHeader
                    title="라이프사이클 궤도"
                    titleId="orbit-heading"
                    description="점 = 고객 계정. 안쪽=초기 단계, 바깥 밴드=확장 단계, 밴드 안 위치는 헬스 스코어입니다."
                  />
                  <div className="mt-3">
                    <FilterChips filter={filter} onFilterChange={setFilter} />
                  </div>
                </div>
                <div className={cx("border-t p-4 sm:p-6", BORDER)}>
                  <OrbitCanvas period={period} filter={filter} selectedId={selectedId} onSelect={setSelectedId} />
                </div>
              </Card>

              <div className="min-w-0 xl:col-span-4">
                <DetailPanel selectedId={selectedId} period={period} />
              </div>
            </div>

            <TransitionTable selectedId={selectedId} onSelect={setSelectedId} />
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectCustomer={setSelectedId} /> : null}
    </div>
  );
}

/* ------------------------------------------------------------- Stat band */

function healthColor(avg: number): string {
  if (avg >= 70) return "text-emerald-700 dark:text-emerald-300";
  if (avg >= 45) return "text-amber-700 dark:text-amber-300";
  return "text-rose-700 dark:text-rose-300";
}

function SubStat({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="min-w-0">
      <EyebrowLabel>{label}</EyebrowLabel>
      <p className={cx("mt-0.5 text-xl font-semibold tabular-nums", valueClass ?? TEXT_PRIMARY)}>{value}</p>
    </div>
  );
}

function StatBand({ filter, period, onPeriodChange }: { filter: FilterId; period: PeriodId; onPeriodChange: (p: PeriodId) => void }) {
  const visible = visibleCustomers(filter);
  const count = visible.length;
  const avg = avgHealth(visible, period);
  const risk = churnRisk(visible, period);
  const expansions = netExpansions();
  const label = filter === "all" ? "전체 계정" : `${STAGE_META[filter].label} 계정`;

  return (
    <Card>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <EyebrowLabel>표시 계정</EyebrowLabel>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
              라이브
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2.5">
            <span className={cx("text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl", TEXT_PRIMARY)}>{count}</span>
            <span className={cx("text-sm", TEXT_CAPTION)}>{label}</span>
          </div>
          <p className={cx("mt-1 text-xs tabular-nums", TEXT_CAPTION)}>
            전체 {formatCount(CUSTOMERS.length)}개 계정 중 · 헬스 {period.toUpperCase()} 기준
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <SubStat label="평균 헬스" value={`${avg}점`} valueClass={healthColor(avg)} />
          <span aria-hidden="true" className={cx("hidden h-8 w-px sm:block", "bg-zinc-200 dark:bg-zinc-800")} />
          <SubStat label="순 확장 (분기)" value={`+${expansions}`} valueClass="text-indigo-700 dark:text-indigo-300" />
          <span aria-hidden="true" className={cx("hidden h-8 w-px sm:block", "bg-zinc-200 dark:bg-zinc-800")} />
          <SubStat label="이탈 위험" value={`${risk}곳`} valueClass={risk > 0 ? "text-rose-700 dark:text-rose-300" : TEXT_PRIMARY} />
          <div className="pl-1">
            <SegmentedControl ariaLabel="헬스 산정 기간" options={PERIODS} value={period} onChange={onPeriodChange} />
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------- Filter chips */

function FilterChips({ filter, onFilterChange }: { filter: FilterId; onFilterChange: (f: FilterId) => void }) {
  const chips: { id: FilterId; label: string; count: number; dot?: string }[] = [
    { id: "all", label: "전체", count: CUSTOMERS.length },
    ...STAGE_ORDER.map((s) => ({ id: s as FilterId, label: STAGE_META[s].label, count: COUNTS[s], dot: STAGE_META[s].chipDot })),
  ];

  return (
    <div role="group" aria-label="라이프사이클 단계 필터" className="flex flex-wrap items-center gap-1.5">
      {chips.map((chip) => {
        const active = filter === chip.id;
        return (
          <button
            key={chip.id}
            type="button"
            aria-pressed={active}
            onClick={() => onFilterChange(active && chip.id !== "all" ? "all" : chip.id)}
            className={cx(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
              TRANSITION,
              FOCUS_RING,
              active
                ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/15 dark:text-indigo-200"
                : cx("border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"),
            )}
          >
            {chip.dot ? <span aria-hidden="true" className={cx("h-2 w-2 rounded-full", chip.dot)} /> : null}
            {chip.label}
            <span className={cx("tabular-nums", active ? "text-indigo-600 dark:text-indigo-300" : "text-zinc-500 dark:text-zinc-400")}>
              {chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
