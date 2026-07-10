import type { Metadata } from "next";
import {
  LayoutGrid,
  FolderKanban,
  Server,
  Clapperboard,
  Users,
  Settings,
  Bell,
  Search,
  ChevronsUpDown,
} from "lucide-react";
import { RadialGauge } from "./RadialGauge";
import { DashboardClient } from "./dashboard-client";
import { KPI, SLATE, WORKSPACE, CURRENT_USER } from "./data";
import styles from "./d20.module.css";

export const metadata: Metadata = {
  title: "데일리즈 — 렌더팜 & 샷 파이프라인 관제",
  description: "VFX 스튜디오의 렌더팜 잡 큐, GPU 클러스터 부하, 시퀀스 샷 진행과 데일리즈 리뷰를 한 화면에서 관제합니다.",
};

const NAV_ITEMS = [
  { id: "overview", label: "개요", Icon: LayoutGrid, active: true },
  { id: "projects", label: "프로젝트", Icon: FolderKanban, active: false },
  { id: "farm", label: "렌더팜", Icon: Server, active: false },
  { id: "dailies", label: "데일리즈", Icon: Clapperboard, active: false },
  { id: "team", label: "팀", Icon: Users, active: false },
  { id: "settings", label: "설정", Icon: Settings, active: false },
] as const;

const MOBILE_NAV_ITEMS = NAV_ITEMS.filter((item) => item.id !== "team");

const numberFormatter = new Intl.NumberFormat("ko-KR");

export default function Dashboard() {
  return (
    <div className={`${styles.theme} min-h-screen`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-[var(--dg-amber)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
      >
        메인 콘텐츠로 건너뛰기
      </a>

      <div aria-hidden="true" className={styles.grain} />

      <div className={styles.content}>
        {/* 데스크톱 아이콘 레일 */}
        <nav
          aria-label="주 메뉴"
          className="fixed inset-y-0 left-0 z-40 hidden w-16 flex-col items-center gap-1 border-r border-[var(--dg-border)] bg-[var(--dg-panel)] py-4 md:flex"
        >
          <div
            aria-hidden="true"
            className="mb-4 flex h-9 w-9 items-center justify-center rounded-md bg-[var(--dg-amber)] font-display text-lg font-bold text-black italic"
          >
            D
          </div>
          {NAV_ITEMS.map(({ id, label, Icon, active }) => (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-current={active ? "page" : undefined}
              title={label}
              className={`flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dg-amber)] ${
                active
                  ? "bg-[var(--dg-amber-soft)] text-[var(--dg-amber)]"
                  : "text-[var(--dg-text-dim)] hover:bg-[var(--dg-panel-raised)] hover:text-[var(--dg-text)]"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden />
            </button>
          ))}
        </nav>

        <div className="flex min-h-screen flex-col pb-20 md:pb-0 md:pl-16">
          {/* 상단 헤더 */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[var(--dg-border)] bg-[var(--dg-panel)]/90 px-4 backdrop-blur md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <span className="font-display text-xl leading-none font-semibold text-[var(--dg-text)] italic">
                DAILIES
              </span>
              <span className="hidden font-mono text-[10px] tracking-[0.15em] text-[var(--dg-text-faint)] uppercase sm:inline">
                Studio OS
              </span>
              <button
                type="button"
                className="ml-2 hidden min-h-9 items-center gap-1.5 rounded-md border border-[var(--dg-border)] px-3 py-1.5 text-sm text-[var(--dg-text-dim)] transition-colors hover:border-[var(--dg-border-strong)] hover:text-[var(--dg-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dg-amber)] sm:flex"
              >
                {WORKSPACE}
                <ChevronsUpDown className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="dash-search" className="sr-only">
                샷, 잡 ID 검색
              </label>
              <div className="relative hidden md:block">
                <Search
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--dg-text-faint)]"
                />
                <input
                  id="dash-search"
                  type="search"
                  placeholder="샷, 잡 ID 검색"
                  className="h-9 w-56 rounded-md border border-[var(--dg-border)] bg-[var(--dg-bg)] pr-3 pl-9 text-sm text-[var(--dg-text)] placeholder:text-[var(--dg-text-faint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dg-amber)]"
                />
              </div>
              <button
                type="button"
                aria-label="알림"
                className="relative flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-md text-[var(--dg-text-dim)] transition-colors hover:bg-[var(--dg-panel-raised)] hover:text-[var(--dg-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dg-amber)]"
              >
                <Bell className="h-5 w-5" aria-hidden />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[var(--dg-red)]" aria-hidden />
              </button>
              <div className="flex items-center gap-2 rounded-md py-1 pr-1 pl-2">
                <span className="hidden text-right leading-tight sm:block">
                  <span className="block text-sm font-medium text-[var(--dg-text)]">{CURRENT_USER.name}</span>
                  <span className="block text-xs text-[var(--dg-text-faint)]">{CURRENT_USER.role}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--dg-teal-soft)] font-mono text-xs font-semibold text-[var(--dg-teal)]"
                >
                  {CURRENT_USER.initials}
                </span>
              </div>
            </div>
          </header>

          <main id="main-content" className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 md:px-8 md:py-10">
            {/* 슬레이트 히어로 */}
            <section aria-labelledby="page-title" className="overflow-hidden rounded-xl border border-[var(--dg-border)] bg-[var(--dg-panel)]">
              <div aria-hidden="true" className={`h-2.5 ${styles.clapperStripes}`} />
              <div className="p-5 md:p-8">
                <p className="font-mono text-xs tracking-[0.15em] text-[var(--dg-text-faint)] uppercase">
                  {SLATE.production} · {SLATE.episode}
                </p>
                <h1 id="page-title" className="mt-2 text-2xl font-semibold text-[var(--dg-text)] md:text-3xl">
                  {SLATE.sequence} 파이프라인 관제
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-[var(--dg-text-dim)]">
                  렌더팜과 샷 진행 상황, 오늘의 데일리즈 리뷰를 한 화면에서 관제합니다.
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--dg-border)] pt-6 sm:grid-cols-4 lg:grid-cols-8">
                  {[
                    ["DIR", SLATE.director],
                    ["VFX SUP", SLATE.supervisor],
                    ["SEQ", SLATE.sequence],
                    ["ROLL", SLATE.roll],
                    ["STATUS", SLATE.status],
                    ["DATE", SLATE.date],
                  ].map(([label, value]) => (
                    <div key={label} className="min-w-0">
                      <dt className="font-mono text-[10px] tracking-[0.1em] text-[var(--dg-text-faint)] uppercase">{label}</dt>
                      <dd className="mt-0.5 truncate text-sm font-medium text-[var(--dg-text)]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            {/* 핵심 지표 게이지 */}
            <section aria-labelledby="kpi-heading" className="mt-6">
              <h2 id="kpi-heading" className="sr-only">
                핵심 지표
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <RadialGauge
                  label={KPI.gpuLoad.label}
                  displayValue={String(KPI.gpuLoad.value)}
                  unit={KPI.gpuLoad.unit}
                  context={KPI.gpuLoad.context}
                  percent={KPI.gpuLoad.value}
                  tone="amber"
                  animationIndex={0}
                />
                <RadialGauge
                  label={KPI.queueDepth.label}
                  displayValue={String(KPI.queueDepth.value)}
                  unit={KPI.queueDepth.unit}
                  context={KPI.queueDepth.context}
                  percent={(KPI.queueDepth.value / KPI.queueDepth.capacity) * 100}
                  tone="amber"
                  animationIndex={1}
                />
                <RadialGauge
                  label={KPI.framesToday.label}
                  displayValue={numberFormatter.format(KPI.framesToday.value)}
                  unit={KPI.framesToday.unit}
                  context={KPI.framesToday.context}
                  percent={(KPI.framesToday.value / KPI.framesToday.target) * 100}
                  tone="teal"
                  animationIndex={2}
                />
                <RadialGauge
                  label={KPI.approvedToday.label}
                  displayValue={`${KPI.approvedToday.value}/${KPI.approvedToday.total}`}
                  unit={KPI.approvedToday.unit}
                  context={KPI.approvedToday.context}
                  percent={(KPI.approvedToday.value / KPI.approvedToday.total) * 100}
                  tone="teal"
                  animationIndex={3}
                />
              </div>
            </section>

            <DashboardClient />
          </main>

          <footer className="border-t border-[var(--dg-border)] px-4 py-4 text-center font-mono text-[11px] text-[var(--dg-text-faint)] md:px-8">
            DAILIES STUDIO OS · {WORKSPACE} · 프레임 눈금 및 렌더 통계는 스냅샷 기준 더미 데이터입니다.
          </footer>
        </div>

        {/* 모바일 하단 내비게이션 */}
        <nav
          aria-label="주 메뉴 (모바일)"
          className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-[var(--dg-border)] bg-[var(--dg-panel)]/95 backdrop-blur md:hidden"
        >
          {MOBILE_NAV_ITEMS.map(({ id, label, Icon, active }) => (
            <button
              key={id}
              type="button"
              aria-current={active ? "page" : undefined}
              className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--dg-amber)] ${
                active ? "text-[var(--dg-amber)]" : "text-[var(--dg-text-dim)]"
              }`}
            >
              <Icon className="h-5 w-5" aria-hidden />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
