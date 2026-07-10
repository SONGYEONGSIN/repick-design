"use client";

import { useMemo, useRef, useState } from "react";
import { Archivo, Fraunces, Space_Mono } from "next/font/google";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import styles from "./d19.module.css";
import {
  CATEGORY_LABEL,
  SEASONS,
  SEASON_ORDER,
  type Category,
  type LookStatus,
  type CategoryShare,
  type SeasonId,
} from "./data";

const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const ui = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
  display: "swap",
});

const dataMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono-data",
  display: "swap",
});

type CategoryFilter = Category | "ALL";

const unitsFormatter = new Intl.NumberFormat("fr-FR");
const priceFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const deltaFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const reachFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const dateFormatter = new Intl.DateTimeFormat("ko-KR", { dateStyle: "long" });

const STATUS_STYLE: Record<LookStatus, string> = {
  SAMPLE: "border-[var(--line)] text-[var(--ink-soft)]",
  FITTED: "border-[var(--ink-soft)] text-[var(--ink-soft)]",
  CONFIRMED: "border-[var(--ink)] text-[var(--ink)]",
  SHIPPED: "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]",
  "SOLD OUT": "border-[var(--accent)] text-[var(--accent)]",
};

const DOOR_SHADE = [
  "bg-neutral-200 text-neutral-900",
  "bg-neutral-300 text-neutral-900",
  "bg-neutral-400 text-neutral-900",
  "bg-neutral-500 text-white",
  "bg-neutral-500 text-white",
  "bg-neutral-600 text-white",
  "bg-neutral-700 text-white",
  "bg-neutral-800 text-white",
  "bg-neutral-900 text-white",
  "bg-black text-white",
];

function doorShade(index: number): string {
  const bucket = Math.min(9, Math.max(0, Math.floor(index / 10)));
  return DOOR_SHADE[bucket];
}

function chipClass(active: boolean): string {
  return [
    "min-h-11 min-w-11 shrink-0 whitespace-nowrap border px-3.5 text-xs uppercase tracking-[0.06em]",
    "motion-safe:transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
    active
      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
      : "border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]",
  ].join(" ");
}

function Sparkline({ data, max = 100, className }: { data: number[]; max?: number; className?: string }) {
  const w = 100;
  const h = 32;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - (Math.min(v, max) / max) * h}`)
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function ShareBars({
  shares,
  activeCategory,
}: {
  shares: CategoryShare[];
  activeCategory: CategoryFilter;
}) {
  return (
    <ul role="list" className="flex flex-col gap-3">
      {shares.map((s) => {
        const isActive = activeCategory === s.category;
        return (
          <li key={s.category} className="flex items-center gap-3">
            <span
              className={`w-24 shrink-0 text-[11px] uppercase tracking-[0.08em] ${
                isActive ? "text-[var(--ink)]" : "text-[var(--ink-soft)]"
              }`}
            >
              {CATEGORY_LABEL[s.category]}
            </span>
            <span className="relative h-2 flex-1 overflow-hidden bg-[var(--line)]">
              <span
                className={`absolute inset-y-0 left-0 ${isActive ? "bg-[var(--accent)]" : "bg-[var(--ink)]"}`}
                style={{ width: `${s.pct}%` }}
              />
            </span>
            <span
              className={`${styles.dataFont} w-9 shrink-0 text-right text-xs tabular-nums text-[var(--ink-soft)]`}
            >
              {s.pct}%
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function DashboardClient() {
  const [seasonId, setSeasonId] = useState<SeasonId>("SS26");
  const [category, setCategory] = useState<CategoryFilter>("ALL");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const season = SEASONS[seasonId];

  const filteredLooks = useMemo(
    () => (category === "ALL" ? season.looks : season.looks.filter((l) => l.category === category)),
    [season, category],
  );

  const avgSellThrough = useMemo(() => {
    if (filteredLooks.length === 0) return 0;
    const sum = filteredLooks.reduce((acc, l) => acc + l.sellThrough, 0);
    return Math.round(sum / filteredLooks.length);
  }, [filteredLooks]);

  function focusTab(index: number) {
    const bounded = (index + SEASON_ORDER.length) % SEASON_ORDER.length;
    setSeasonId(SEASON_ORDER[bounded]);
    tabRefs.current[bounded]?.focus();
  }

  function handleTabKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusTab(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusTab(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(SEASON_ORDER.length - 1);
    }
  }

  return (
    <div className={`${display.variable} ${ui.variable} ${dataMono.variable} ${styles.root} ${styles.body} min-h-dvh`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--paper)]"
      >
        본문으로 건너뛰기
      </a>

      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex items-baseline gap-3">
            <h1 className={`${styles.display} text-3xl italic tracking-tight sm:text-4xl`}>Planche</h1>
            <span className="hidden text-[10px] uppercase tracking-[0.15em] text-[var(--ink-soft)] sm:inline">
              Collection Command
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="border border-[var(--line)] px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] text-[var(--ink-soft)]">
              Lucerne Maison
            </span>
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`${styles.dataFont} flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ink)] text-xs text-[var(--paper)]`}
              >
                MC
              </span>
              <span className="sr-only">로그인 사용자: Marie Chastain · Lucerne Maison MD팀</span>
            </div>
          </div>
        </div>
        <nav
          aria-label="섹션 이동"
          className={`${styles.hideScrollbar} flex gap-6 overflow-x-auto border-t border-[var(--line)] px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] text-[var(--ink-soft)] sm:px-6 lg:px-10`}
        >
          <a
            className="shrink-0 whitespace-nowrap hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            href="#overview"
          >
            개요
          </a>
          <a
            className="shrink-0 whitespace-nowrap hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            href="#lineup"
          >
            룩북
          </a>
          <a
            className="shrink-0 whitespace-nowrap hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            href="#retail"
          >
            리테일
          </a>
          <a
            className="shrink-0 whitespace-nowrap hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            href="#press"
          >
            프레스
          </a>
        </nav>
      </header>

      <div className="border-b border-[var(--line)]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div
            role="tablist"
            aria-label="시즌 선택"
            className={`${styles.hideScrollbar} flex gap-6 overflow-x-auto`}
          >
            {SEASON_ORDER.map((id, i) => {
              const active = id === seasonId;
              return (
                <button
                  key={id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${id}`}
                  type="button"
                  aria-selected={active}
                  aria-controls="season-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => setSeasonId(id)}
                  onKeyDown={(e) => handleTabKeyDown(e, i)}
                  className={`flex min-h-11 shrink-0 items-center whitespace-nowrap border-b-2 px-1 text-sm uppercase tracking-[0.08em] motion-safe:transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
                    active
                      ? "border-[var(--ink)] text-[var(--ink)]"
                      : "border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]"
                  }`}
                >
                  {SEASONS[id].label}
                </button>
              );
            })}
          </div>
          <div
            role="group"
            aria-label="카테고리 필터"
            className={`${styles.hideScrollbar} flex gap-2 overflow-x-auto`}
          >
            <button type="button" onClick={() => setCategory("ALL")} aria-pressed={category === "ALL"} className={chipClass(category === "ALL")}>
              ALL
            </button>
            {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={chipClass(category === c)}
              >
                {CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main id="main-content" className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6 lg:px-10">
        <div id="season-panel" role="tabpanel" aria-labelledby={`tab-${seasonId}`} tabIndex={-1} className="outline-none">
          <section id="overview" className="grid grid-cols-1 gap-10 border-b border-[var(--line)] py-10 md:grid-cols-12 md:gap-8 lg:py-14">
            <div className="md:col-span-7">
              <h2 id="overview-heading" className="sr-only">
                시즌 개요 및 셀스루
              </h2>
              <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--ink-soft)]">
                SELL-THROUGH — {category === "ALL" ? "전 카테고리" : CATEGORY_LABEL[category]} · {season.fullLabel}
              </p>
              <p className={`${styles.display} mt-1 text-[4.5rem] italic leading-[0.9] tabular-nums sm:text-[6rem] lg:text-[7rem]`}>
                {avgSellThrough}
                <span className="align-top text-3xl not-italic sm:text-4xl">%</span>
              </p>
              <p className="mt-3 flex items-center gap-1.5 text-sm text-[var(--ink-soft)]">
                {season.sellThroughDelta >= 0 ? (
                  <ArrowUpRight aria-hidden="true" size={16} className="text-[var(--accent)]" />
                ) : (
                  <ArrowDownRight aria-hidden="true" size={16} className="text-[var(--accent)]" />
                )}
                <span>
                  {season.sellThroughDelta >= 0 ? "+" : "−"}
                  {deltaFormatter.format(Math.abs(season.sellThroughDelta))}pt · 전년 동시즌 동일 경과일 대비
                </span>
              </p>
              <div className="mt-10">
                <ShareBars shares={season.categoryShare} activeCategory={category} />
              </div>
            </div>

            <div className="md:col-span-5 md:border-l md:border-[var(--line)] md:pl-8">
              <h2 className="text-[11px] uppercase tracking-[0.08em] text-[var(--ink-soft)]">RUNWAY → RETAIL</h2>
              <ol className="mt-4 flex flex-col">
                {season.pipeline.map((stage) => {
                  const isCurrent = stage.stage === season.currentStage;
                  const isActive = stage.count > 0;
                  return (
                    <li
                      key={stage.stage}
                      className="relative flex items-center gap-4 border-l border-[var(--line)] py-3 pl-5 last:pb-0"
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute -left-[5px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border ${
                          isCurrent
                            ? "border-[var(--accent)] bg-[var(--accent)]"
                            : isActive
                              ? "border-[var(--ink)] bg-[var(--ink)]"
                              : "border-[var(--line)] bg-[var(--paper)]"
                        }`}
                      />
                      <span className="flex-1 text-sm uppercase tracking-[0.06em]">
                        {stage.stage}
                        {isCurrent && <span className="ml-2 text-[10px] text-[var(--accent)]">현재 단계</span>}
                      </span>
                      <span className={`${styles.dataFont} tabular-nums text-sm text-[var(--ink-soft)]`}>
                        {String(stage.count).padStart(2, "0")}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          <section aria-label="시즌 지표" className="border-b border-[var(--line)] py-8">
            <dl className="grid grid-cols-1 divide-y divide-[var(--line)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="py-4 sm:py-0 sm:pr-6">
                <dt className="text-[11px] uppercase tracking-[0.08em] text-[var(--ink-soft)]">오더 유닛</dt>
                <dd className={`${styles.dataFont} mt-1 text-3xl tabular-nums`}>{unitsFormatter.format(season.unitsOrdered)}</dd>
                <Sparkline data={season.orderPace} className="mt-3 h-6 w-full text-[var(--ink-soft)]" />
              </div>
              <div className="py-4 sm:py-0 sm:px-6">
                <dt className="text-[11px] uppercase tracking-[0.08em] text-[var(--ink-soft)]">평균 판가</dt>
                <dd className={`${styles.dataFont} mt-1 text-3xl tabular-nums`}>{priceFormatter.format(season.avgSellPrice)}</dd>
                <p className="mt-3 h-6 text-[11px] text-[var(--ink-soft)]">단위: 소비자가 기준</p>
              </div>
              <div className="py-4 sm:py-0 sm:pl-6">
                <dt className="text-[11px] uppercase tracking-[0.08em] text-[var(--ink-soft)]">프레스 플레이스먼트</dt>
                <dd className={`${styles.dataFont} mt-1 text-3xl tabular-nums`}>{season.pressPlacements}</dd>
                <p className="mt-3 h-6 text-[11px] text-[var(--ink-soft)]">시즌 누적 편집 기사 수</p>
              </div>
            </dl>
          </section>

          <section id="lineup" aria-labelledby="lineup-heading" className="border-b border-[var(--line)] py-10 lg:py-14">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <h2 id="lineup-heading" className={`${styles.display} text-2xl italic sm:text-3xl`}>
                Lookbook Lineup
              </h2>
              <p className={`${styles.dataFont} text-xs text-[var(--ink-soft)]`}>
                {String(filteredLooks.length).padStart(2, "0")} LOOKS
              </p>
            </div>
            {filteredLooks.length === 0 ? (
              <p className="border border-dashed border-[var(--line)] px-6 py-12 text-center text-sm text-[var(--ink-soft)]">
                이 카테고리에는 해당 시즌 룩이 없습니다.
              </p>
            ) : (
              <ul
                role="list"
                className={`grid grid-cols-1 gap-px border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4 ${styles.revealGrid}`}
              >
                {filteredLooks.map((look) => (
                  <li
                    key={look.id}
                    className={`group flex flex-col justify-between gap-6 bg-[var(--paper)] p-5 ${styles.reveal} ${
                      look.hero ? "sm:col-span-2" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`${styles.dataFont} text-xs text-[var(--ink-soft)]`}>{look.id}</span>
                      <span
                        className={`inline-flex items-center border px-2 py-0.5 text-[10px] uppercase tracking-[0.06em] ${STATUS_STYLE[look.status]}`}
                      >
                        {look.status}
                      </span>
                    </div>
                    <div>
                      <h3 className={`${styles.display} text-lg italic leading-snug`}>{look.title}</h3>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[var(--ink-soft)]">
                        {CATEGORY_LABEL[look.category]}
                      </p>
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className={`${styles.dataFont} text-2xl tabular-nums`}>{look.sellThrough}%</p>
                        <p className="mt-1 text-[11px] text-[var(--ink-soft)]">{priceFormatter.format(look.price)}</p>
                      </div>
                      <Sparkline
                        data={look.velocity}
                        className="h-8 w-20 text-[var(--ink-soft)] motion-safe:transition-colors group-hover:text-[var(--accent)]"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="grid grid-cols-1 gap-10 py-10 lg:grid-cols-12 lg:gap-8 lg:py-14">
            <div id="retail" className="lg:col-span-7">
              <h2 id="retail-heading" className={`${styles.display} mb-6 text-2xl italic sm:text-3xl`}>
                Retail Doors
              </h2>
              <table className="w-full border-collapse text-sm">
                <caption className="mb-4 text-left text-[11px] uppercase tracking-[0.08em] text-[var(--ink-soft)]">
                  시즌별 리테일 도어 퍼포먼스 인덱스 (0–100)
                </caption>
                <thead>
                  <tr className="border-b border-[var(--line)] text-left text-[11px] uppercase tracking-[0.06em] text-[var(--ink-soft)]">
                    <th scope="col" className="py-2 pr-3 font-normal">
                      도어
                    </th>
                    <th scope="col" className="py-2 pr-3 font-normal">
                      시티
                    </th>
                    <th scope="col" className="py-2 pl-3 text-right font-normal">
                      인덱스
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {season.retailDoors.map((door) => (
                    <tr key={door.name} className="border-b border-[var(--line)] last:border-b-0">
                      <th scope="row" className={`${styles.display} py-3 pr-3 text-left text-base font-normal italic`}>
                        {door.name}
                      </th>
                      <td className="py-3 pr-3 text-[var(--ink-soft)]">{door.city}</td>
                      <td className="py-3 pl-3 text-right">
                        <span
                          className={`inline-flex min-w-[3.5rem] items-center justify-center gap-1 px-2 py-1 ${styles.dataFont} text-xs tabular-nums ${doorShade(door.index)}`}
                        >
                          {door.index >= 90 && <span aria-hidden="true">★</span>}
                          {door.index}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div id="press" className="lg:col-span-5 lg:border-l lg:border-[var(--line)] lg:pl-8">
              <h2 id="press-heading" className={`${styles.display} mb-6 text-2xl italic sm:text-3xl`}>
                Press &amp; Editorial
              </h2>
              <ol className="flex flex-col divide-y divide-[var(--line)]">
                {season.press.map((p, i) => {
                  const look = season.looks.find((l) => l.id === p.lookId);
                  return (
                    <li key={`${p.outlet}-${p.lookId}`} className="flex items-baseline justify-between gap-4 py-3">
                      <span>
                        <span className={`${styles.dataFont} mr-3 text-xs text-[var(--ink-soft)]`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className={`${styles.display} italic`}>{p.outlet}</span>
                        <span className="ml-2 text-[11px] text-[var(--ink-soft)]">
                          — LOOK {p.lookId}
                          {look ? ` · ${look.title}` : ""}
                        </span>
                      </span>
                      <span className={`${styles.dataFont} shrink-0 tabular-nums text-sm`}>
                        {reachFormatter.format(p.reach)}M
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-[var(--line)] py-8">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 text-[11px] uppercase tracking-[0.08em] text-[var(--ink-soft)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <p>Planche — Collection Command · {season.fullLabel}</p>
          <p>스냅샷 기준일 {dateFormatter.format(new Date(`${season.snapshotDate}T00:00:00Z`))}</p>
        </div>
      </footer>
    </div>
  );
}
