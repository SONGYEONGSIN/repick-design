"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Radar,
  Users,
  CalendarDays,
  FileText,
  Menu,
  X,
  Flame,
  ShieldAlert,
  Target,
  TrendingUp,
  Timer,
} from "lucide-react";
import styles from "./theme.module.css";
import CourtDiagram from "./CourtDiagram";
import QuarterBars from "./QuarterBars";
import {
  AWAY,
  AWAY_SCORE,
  GAME_STATUS,
  HOME,
  HOME_SCORE,
  MOMENTUM,
  PLAYERS,
  QUARTER_SCORES,
  SHOTS,
  TEAM_TOTALS,
  loadTier,
  pct,
  type Player,
  type Quarter,
} from "./data";

const focusRingCream =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--bo-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bo-cream)]";
const focusRingInk =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--bo-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bo-ink)]";

const NAV_ITEMS = [
  { label: "매치 콘솔", icon: LayoutDashboard, current: true },
  { label: "전술보드", icon: Radar, current: false },
  { label: "선수단", icon: Users, current: false },
  { label: "경기 일정", icon: CalendarDays, current: false },
  { label: "리포트", icon: FileText, current: false },
] as const;

const QUARTER_FILTERS: { id: "all" | Quarter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: 1, label: "1Q" },
  { id: 2, label: "2Q" },
  { id: 3, label: "3Q" },
];

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-[2.75rem]">
      <span className="font-mono text-sm md:text-base font-bold tabular-nums">{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-[var(--bo-ink)]/60">{label}</span>
    </div>
  );
}

function FoulPips({ fouls }: { fouls: number }) {
  const trouble = fouls >= 4;
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-[3px]" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`${styles.tag} h-3.5 w-2.5 ${
              i < fouls ? (trouble ? "bg-[var(--bo-red)]" : "bg-[var(--bo-ink)]") : "bg-[var(--bo-cream-dim)] border border-[var(--bo-ink)]/30"
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-bold font-mono tabular-nums ${trouble ? "text-[var(--bo-red-text)]" : "text-[var(--bo-ink)]"}`}>
        {fouls}/5{trouble ? " 파울트러블" : ""}
      </span>
    </div>
  );
}

function LoadBar({ load }: { load: number }) {
  const tier = loadTier(load);
  const fillColor =
    tier.tone === "high" ? "var(--bo-red)" : tier.tone === "elevated" ? "var(--bo-orange)" : "var(--bo-ink)";
  const fillWidth = Math.max(0, Math.min(98, (load / 100) * 98));
  return (
    <div className="flex items-center gap-2 min-w-[7.5rem]">
      <svg
        viewBox="0 0 100 14"
        preserveAspectRatio="none"
        role="img"
        aria-label={`체력 부하 ${load}, ${tier.label} 단계`}
        className="h-3.5 flex-1"
      >
        <rect x={1} y={1} width={98} height={12} fill="var(--bo-cream-dim)" stroke="var(--bo-ink)" strokeWidth={2} />
        <rect x={1} y={1} width={fillWidth} height={12} fill={fillColor} />
      </svg>
      <span className="text-xs font-mono font-bold tabular-nums w-8 text-right">{load}</span>
      <span className="text-[10px] font-bold uppercase tracking-wide w-8">{tier.label}</span>
    </div>
  );
}

function NavList({ variant }: { variant: "rail" | "drawer" }) {
  return (
    <ul className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ label, icon: Icon, current }) => (
        <li key={label}>
          <button
            type="button"
            aria-current={current ? "page" : undefined}
            className={`group relative flex w-full items-center gap-3 py-3 pl-4 pr-3 text-sm font-bold tracking-wide transition-colors ${focusRingInk} ${
              current
                ? "bg-[var(--bo-orange)] text-[var(--bo-ink)]"
                : "text-[var(--bo-cream)]/75 hover:bg-white/5 hover:text-[var(--bo-cream)]"
            }`}
          >
            {current && (
              <span
                aria-hidden="true"
                className={`${styles.chevron} absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1.5 bg-[var(--bo-cream)]`}
              />
            )}
            <Icon aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={2.25} />
            <span>{label}</span>
          </button>
        </li>
      ))}
      {variant === "drawer" && <li className="h-px bg-white/10 my-2" aria-hidden="true" />}
    </ul>
  );
}

export default function MatchConsole() {
  const [navOpen, setNavOpen] = useState(false);
  const [quarterFilter, setQuarterFilter] = useState<"all" | Quarter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const liveRegionId = useId();

  useEffect(() => {
    if (!navOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setNavOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  const filteredShots = useMemo(
    () => SHOTS.filter((s) => quarterFilter === "all" || s.q === quarterFilter),
    [quarterFilter]
  );
  const madeCount = filteredShots.filter((s) => s.made).length;
  const shotFgPct = pct(madeCount, filteredShots.length);
  const selectedPlayer: Player | null = useMemo(
    () => PLAYERS.find((p) => p.id === selectedId) ?? null,
    [selectedId]
  );

  const attentionPlayers = PLAYERS.filter((p) => p.load >= 85 || p.fouls >= 4);

  const teamFgPct = pct(TEAM_TOTALS.fgm, TEAM_TOTALS.fga);
  const team3pPct = pct(TEAM_TOTALS.tpm, TEAM_TOTALS.tpa);
  const teamFtPct = pct(TEAM_TOTALS.ftm, TEAM_TOTALS.fta);

  const minV = Math.min(...MOMENTUM);
  const maxV = Math.max(...MOMENTUM);
  const range = maxV - minV || 1;
  const sparkW = 240;
  const sparkH = 64;
  const pad = 6;
  const sparkCoords = MOMENTUM.map((v, i) => ({
    x: pad + (i / (MOMENTUM.length - 1)) * (sparkW - 2 * pad),
    y: sparkH - pad - ((v - minV) / range) * (sparkH - 2 * pad),
  }));
  const sparkPoints = sparkCoords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const lastPoint = sparkCoords[sparkCoords.length - 1];
  const lastMargin = MOMENTUM[MOMENTUM.length - 1];
  const zeroY = sparkH - pad - ((0 - minV) / range) * (sparkH - 2 * pad);

  return (
    <div className={`${styles.theme} min-h-screen bg-[var(--bo-cream)] text-[var(--bo-ink)]`}>
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-[var(--bo-orange)] focus:text-[var(--bo-ink)] focus:px-4 focus:py-2 focus:font-bold ${focusRingCream}`}
      >
        본문으로 바로가기
      </a>

      <div className="flex">
        {/* 데스크톱 사이드 레일 */}
        <aside
          aria-label="주 내비게이션"
          className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:fixed md:inset-y-0 md:left-0 bg-[var(--bo-ink)] border-r-8 border-[var(--bo-orange)]"
        >
          <div className="px-5 pt-6 pb-5 border-b border-white/10">
            <p className="font-mono text-2xl font-black tracking-tight text-[var(--bo-cream)]">
              BOX<span className="text-[var(--bo-orange)]">OUT</span>
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--bo-cream)]/50">
              코칭 콘솔
            </p>
          </div>
          <nav className="relative flex-1 py-4" aria-label="대시보드 섹션">
            <NavList variant="rail" />
          </nav>
          <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--bo-orange)] font-mono text-sm font-black text-[var(--bo-ink)]"
            >
              JS
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[var(--bo-cream)]">장선호 코치</p>
              <p className="truncate text-[11px] text-[var(--bo-cream)]/55">서울 볼트 코칭스태프</p>
            </div>
          </div>
        </aside>

        {/* 모바일 드로어 */}
        {navOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <button
              type="button"
              aria-label="메뉴 닫기"
              onClick={() => setNavOpen(false)}
              className="absolute inset-0 bg-[var(--bo-ink)]/70"
            />
            <nav
              aria-label="주 내비게이션"
              className="relative z-10 flex h-full w-72 max-w-[80vw] flex-col bg-[var(--bo-ink)] border-r-8 border-[var(--bo-orange)]"
            >
              <div className="flex items-center justify-between px-5 pt-6 pb-5 border-b border-white/10">
                <p className="font-mono text-xl font-black tracking-tight text-[var(--bo-cream)]">
                  BOX<span className="text-[var(--bo-orange)]">OUT</span>
                </p>
                <button
                  type="button"
                  onClick={() => setNavOpen(false)}
                  aria-label="메뉴 닫기"
                  className={`p-2 text-[var(--bo-cream)] ${focusRingInk}`}
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
              <div className="relative flex-1 overflow-y-auto py-4">
                <NavList variant="drawer" />
              </div>
            </nav>
          </div>
        )}

        {/* 메인 콘텐츠 */}
        <div className="flex-1 md:ml-60 min-w-0">
          {/* 상단 바 */}
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b-4 border-[var(--bo-ink)] bg-[var(--bo-cream)]/95 backdrop-blur px-4 py-3 md:px-8">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setNavOpen(true)}
                aria-label="메뉴 열기"
                aria-expanded={navOpen}
                aria-controls="mobile-nav"
                className={`md:hidden p-2 -ml-2 border-2 border-[var(--bo-ink)] ${focusRingCream}`}
              >
                <Menu aria-hidden="true" className="h-5 w-5" />
              </button>
              <p className="truncate text-xs md:text-sm font-bold uppercase tracking-[0.14em] text-[var(--bo-ink)]/70">
                매치 콘솔 <span aria-hidden="true">/</span> {HOME.short} vs {AWAY.short}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={`${styles.tag} inline-flex items-center gap-1.5 bg-[var(--bo-ink)] px-3 py-1.5 text-[var(--bo-cream)]`}
              >
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full bg-[var(--bo-orange)] ${styles.livePulse}`}
                />
                <span className="font-mono text-xs font-bold tabular-nums">
                  {GAME_STATUS.quarter} · {GAME_STATUS.clock}
                </span>
              </span>
            </div>
          </header>

          <main id="main-content" className="mx-auto max-w-[1400px] px-4 py-6 md:px-8 md:py-8 space-y-6 md:space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                매치 콘솔
                <span className="sr-only">
                  : {HOME.name} 대 {AWAY.name}, {GAME_STATUS.snapshotLabel}
                </span>
              </h1>
              <p className="mt-1 text-sm text-[var(--bo-ink)]/70">
                {HOME.name} <span aria-hidden="true">VS</span> {AWAY.name} · {GAME_STATUS.snapshotLabel}
              </p>
            </div>

            {/* 스코어보드 */}
            <section aria-label="스코어보드" className={`${styles.enter} grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]`}>
              <div className="overflow-hidden border-4 border-[var(--bo-ink)] bg-[var(--bo-cream-dim)]">
                <div className={`${styles.halftone} flex flex-wrap items-end justify-center gap-4 px-5 py-6 md:gap-8 md:px-8 md:py-8`}>
                  <div className="text-center">
                    <p className={`${styles.tag} inline-block bg-[var(--bo-orange)] px-3 py-1 text-xs md:text-sm font-bold uppercase tracking-[0.14em] text-[var(--bo-ink)]`}>
                      {HOME.short}
                    </p>
                    <p className="font-mono text-7xl md:text-8xl font-black leading-none tabular-nums text-[var(--bo-ink)]">
                      {HOME_SCORE}
                    </p>
                  </div>
                  <p className="pb-3 font-mono text-2xl md:text-3xl font-black text-[var(--bo-ink)]/50" aria-hidden="true">
                    :
                  </p>
                  <div className="text-center">
                    <p className={`${styles.tag} inline-block bg-[var(--bo-ink)] px-3 py-1 text-xs md:text-sm font-bold uppercase tracking-[0.14em] text-[var(--bo-cream)]`}>
                      {AWAY.short}
                    </p>
                    <p className="font-mono text-7xl md:text-8xl font-black leading-none tabular-nums text-[var(--bo-ink)]">
                      {AWAY_SCORE}
                    </p>
                  </div>
                </div>
                <p className="sr-only">
                  현재 스코어 {HOME.name} {HOME_SCORE}점, {AWAY.name} {AWAY_SCORE}점
                </p>

                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t-2 border-[var(--bo-ink)] bg-[var(--bo-cream)] px-5 py-4">
                  <StatCell label="홈 팀파울(3Q)" value={3} />
                  <StatCell label="원정 팀파울(3Q)" value={4} />
                  <StatCell label="홈 타임아웃" value="3 남음" />
                  <StatCell label="원정 타임아웃" value="2 남음" />
                </div>
              </div>

              <div className="flex flex-col gap-4 border-4 border-[var(--bo-ink)] bg-[var(--bo-cream-dim)] p-5">
                <div className="flex items-center gap-2">
                  <TrendingUp aria-hidden="true" className="h-4 w-4" />
                  <h2 className="text-sm font-black uppercase tracking-wide">경기 흐름</h2>
                </div>
                <svg
                  viewBox={`0 0 ${sparkW} ${sparkH}`}
                  role="img"
                  aria-label={`득실차 흐름, 현재 마진 ${lastMargin > 0 ? "+" : ""}${lastMargin}점`}
                  className="w-full h-auto"
                >
                  <line x1={0} y1={zeroY} x2={sparkW} y2={zeroY} stroke="var(--bo-ink)" strokeOpacity={0.25} strokeDasharray="4 4" strokeWidth={1.5} />
                  <polyline points={sparkPoints} fill="none" stroke="var(--bo-orange)" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
                  <circle
                    cx={lastPoint.x}
                    cy={lastPoint.y}
                    r={4.5}
                    fill="var(--bo-ink)"
                  />
                </svg>
                <p className="text-xs text-[var(--bo-ink)]/70">
                  현재 서울 볼트 <span className="font-mono font-bold text-[var(--bo-ink)]">{lastMargin > 0 ? "+" : ""}{lastMargin}</span> 점 차 리드
                </p>
              </div>
            </section>

            {/* 주의 선수 */}
            {attentionPlayers.length > 0 && (
              <section aria-labelledby="attention-heading" className="border-4 border-[var(--bo-red)] bg-[var(--bo-cream-dim)] px-5 py-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert aria-hidden="true" className="h-4 w-4 text-[var(--bo-red)]" />
                  <h2 id="attention-heading" className="text-sm font-black uppercase tracking-wide">
                    코치 주의 필요
                  </h2>
                </div>
                <ul className="mt-3 flex flex-wrap gap-3">
                  {attentionPlayers.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-2 border-2 border-[var(--bo-ink)] bg-[var(--bo-cream)] px-3 py-1.5 text-xs font-bold"
                    >
                      <span className="font-mono">#{p.no}</span>
                      <span>{p.name}</span>
                      <span className="text-[var(--bo-ink)]/40" aria-hidden="true">
                        ·
                      </span>
                      {p.load >= 85 && (
                        <span className="inline-flex items-center gap-1 text-[var(--bo-red-text)]">
                          <Flame aria-hidden="true" className="h-3.5 w-3.5" /> 부하 {p.load}
                        </span>
                      )}
                      {p.fouls >= 4 && (
                        <span className="inline-flex items-center gap-1 text-[var(--bo-red-text)]">
                          파울 {p.fouls}/5
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 슛 차트 + 쿼터/슈팅 스플릿 */}
            <section aria-label="슛 차트 및 팀 분석" className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_1fr]">
              <div className="border-4 border-[var(--bo-ink)] bg-[var(--bo-cream)] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Target aria-hidden="true" className="h-4 w-4" />
                    <h2 className="text-sm font-black uppercase tracking-wide">슛 차트 · {HOME.short}</h2>
                  </div>
                  <div role="group" aria-label="쿼터 필터" className="flex gap-1">
                    {QUARTER_FILTERS.map((f) => {
                      const active = quarterFilter === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setQuarterFilter(f.id)}
                          className={`min-w-[2.75rem] min-h-[2.75rem] px-2 text-xs font-bold border-2 border-[var(--bo-ink)] transition-colors ${focusRingCream} ${
                            active ? "bg-[var(--bo-orange)] text-[var(--bo-ink)]" : "bg-[var(--bo-cream)] text-[var(--bo-ink)] hover:bg-[var(--bo-cream-dim)]"
                          }`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <p id={liveRegionId} aria-live="polite" className="mt-3 text-xs font-bold text-[var(--bo-ink)]/70">
                  표시 중 슛 {filteredShots.length}개 · 야투 {shotFgPct}%
                  {selectedPlayer ? ` · 강조: #${selectedPlayer.no} ${selectedPlayer.name}` : ""}
                </p>

                <div className="mt-3">
                  <CourtDiagram shots={filteredShots} selectedPlayer={selectedPlayer} />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[var(--bo-orange)] border border-[var(--bo-ink)]" />
                      성공
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true" className="text-[var(--bo-red-text)] font-black">
                        ✕
                      </span>
                      실패
                    </span>
                  </div>
                  {selectedPlayer && (
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className={`text-xs font-bold underline underline-offset-2 ${focusRingCream}`}
                    >
                      강조 해제
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="border-4 border-[var(--bo-ink)] bg-[var(--bo-cream)] p-5">
                  <h2 className="text-sm font-black uppercase tracking-wide">쿼터별 득점</h2>
                  <div className="mt-3">
                    <QuarterBars data={QUARTER_SCORES} homeAbbr={HOME.abbr} awayAbbr={AWAY.abbr} />
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs font-bold">
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true" className="h-3 w-3 bg-[var(--bo-orange)] border border-[var(--bo-ink)]" />
                      {HOME.abbr}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span aria-hidden="true" className="h-3 w-3 bg-[var(--bo-cream-dim)] border border-[var(--bo-ink)]" />
                      {AWAY.abbr}
                    </span>
                  </div>
                </div>

                <div className="border-4 border-[var(--bo-ink)] bg-[var(--bo-cream)] p-5">
                  <h2 className="text-sm font-black uppercase tracking-wide">팀 슈팅 스플릿</h2>
                  <dl className="mt-3 space-y-3">
                    {[
                      { label: "야투 FG%", value: teamFgPct, frac: `${TEAM_TOTALS.fgm}/${TEAM_TOTALS.fga}` },
                      { label: "3점 3P%", value: team3pPct, frac: `${TEAM_TOTALS.tpm}/${TEAM_TOTALS.tpa}` },
                      { label: "자유투 FT%", value: teamFtPct, frac: `${TEAM_TOTALS.ftm}/${TEAM_TOTALS.fta}` },
                    ].map((row) => (
                      <div key={row.label}>
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <dt>{row.label}</dt>
                          <dd className="font-mono tabular-nums">
                            {row.value}% <span className="text-[var(--bo-ink)]/50">({row.frac})</span>
                          </dd>
                        </div>
                        <svg
                          viewBox="0 0 100 16"
                          preserveAspectRatio="none"
                          role="img"
                          aria-label={`${row.label} ${row.value}퍼센트`}
                          className="h-4 w-full"
                        >
                          <rect x={1} y={1} width={98} height={14} fill="var(--bo-cream-dim)" stroke="var(--bo-ink)" strokeWidth={2} />
                          <rect x={1} y={1} width={Math.max(0, Math.min(98, (row.value / 100) * 98))} height={14} fill="var(--bo-orange)" />
                        </svg>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </section>

            {/* 박스 스코어 */}
            <section aria-label="박스 스코어" className="border-4 border-[var(--bo-ink)] bg-[var(--bo-cream)]">
              <div className="flex items-center gap-2 border-b-4 border-[var(--bo-ink)] px-5 py-4">
                <Timer aria-hidden="true" className="h-4 w-4" />
                <h2 className="text-sm font-black uppercase tracking-wide">박스 스코어 · {HOME.name}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] border-collapse text-xs md:text-sm">
                  <caption className="sr-only">
                    {HOME.name} 선수별 박스 스코어. 이름 버튼을 선택하면 슛 차트에서 해당 선수 슛이 강조됩니다.
                  </caption>
                  <thead>
                    <tr className="border-b-2 border-[var(--bo-ink)] bg-[var(--bo-cream-dim)] text-left">
                      <th scope="col" className="sticky left-0 z-10 bg-[var(--bo-cream-dim)] px-4 py-2.5 font-black">
                        선수
                      </th>
                      <th scope="col" className="px-2 py-2.5 font-black text-center">MIN</th>
                      <th scope="col" className="px-2 py-2.5 font-black text-center">PTS</th>
                      <th scope="col" className="px-2 py-2.5 font-black text-center">REB</th>
                      <th scope="col" className="px-2 py-2.5 font-black text-center">AST</th>
                      <th scope="col" className="px-2 py-2.5 font-black text-center">STL</th>
                      <th scope="col" className="px-2 py-2.5 font-black text-center">BLK</th>
                      <th scope="col" className="px-2 py-2.5 font-black text-center">TO</th>
                      <th scope="col" className="px-2 py-2.5 font-black text-center">FG</th>
                      <th scope="col" className="px-2 py-2.5 font-black text-center">3P</th>
                      <th scope="col" className="px-2 py-2.5 font-black text-center">+/-</th>
                      <th scope="col" className="px-3 py-2.5 font-black">파울</th>
                      <th scope="col" className="px-3 py-2.5 font-black">부하</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLAYERS.map((p) => {
                      const isSelected = selectedId === p.id;
                      return (
                        <tr
                          key={p.id}
                          className={`border-b border-[var(--bo-ink)]/15 ${isSelected ? "bg-[var(--bo-orange)]/15" : "odd:bg-[var(--bo-cream-dim)]/40"}`}
                        >
                          <th scope="row" className={`sticky left-0 z-10 px-2 py-2 text-left font-normal ${isSelected ? "bg-[var(--bo-orange)]/15" : "bg-[var(--bo-cream)] odd:bg-[var(--bo-cream-dim)]/40"}`}>
                            <button
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => setSelectedId(isSelected ? null : p.id)}
                              className={`flex w-full items-center gap-2 px-2 py-2 text-left ${focusRingCream}`}
                            >
                              <span className="font-mono text-[11px] font-bold text-[var(--bo-ink)]/50 w-6 shrink-0">
                                #{p.no}
                              </span>
                              <span className="min-w-0">
                                <span className="block font-bold truncate">
                                  {p.name}
                                  {!p.starter && <span className="ml-1 text-[10px] font-bold text-[var(--bo-ink)]/45">(교체)</span>}
                                </span>
                                <span className="block text-[10px] font-bold uppercase text-[var(--bo-ink)]/50">{p.pos}</span>
                              </span>
                            </button>
                          </th>
                          <td className="px-2 py-2 text-center font-mono tabular-nums">{p.min}</td>
                          <td className="px-2 py-2 text-center font-mono font-bold tabular-nums">{p.pts}</td>
                          <td className="px-2 py-2 text-center font-mono tabular-nums">{p.reb}</td>
                          <td className="px-2 py-2 text-center font-mono tabular-nums">{p.ast}</td>
                          <td className="px-2 py-2 text-center font-mono tabular-nums">{p.stl}</td>
                          <td className="px-2 py-2 text-center font-mono tabular-nums">{p.blk}</td>
                          <td className="px-2 py-2 text-center font-mono tabular-nums">{p.to}</td>
                          <td className="px-2 py-2 text-center font-mono tabular-nums whitespace-nowrap">
                            {p.fgm}-{p.fga}
                          </td>
                          <td className="px-2 py-2 text-center font-mono tabular-nums whitespace-nowrap">
                            {p.tpm}-{p.tpa}
                          </td>
                          <td
                            className={`px-2 py-2 text-center font-mono font-bold tabular-nums ${
                              p.plusMinus > 0 ? "text-[var(--bo-orange)]" : p.plusMinus < 0 ? "text-[var(--bo-red-text)]" : ""
                            }`}
                          >
                            {p.plusMinus > 0 ? "+" : ""}
                            {p.plusMinus}
                          </td>
                          <td className="px-3 py-2">
                            <FoulPips fouls={p.fouls} />
                          </td>
                          <td className="px-3 py-2">
                            <LoadBar load={p.load} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <p className="pb-4 text-center text-[11px] text-[var(--bo-ink)]/45">
              BOXOUT 매치 콘솔 · 데이터는 시연용 스냅샷이며 실시간 갱신되지 않습니다.
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
