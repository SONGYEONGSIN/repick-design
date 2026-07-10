"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Columns3,
  FileText,
  Image as ImageIcon,
  Menu,
  Newspaper,
  PenLine,
  Printer,
  Rows3,
  Stamp,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import styles from "./forme.module.css";
import {
  articles,
  countByStage,
  countdownLabel,
  deadlineLabel,
  desks,
  editingCount,
  editionDateLabel,
  editionKind,
  editionNumber,
  filledSlotCount,
  frontPageColumnTotal,
  frontPageSlots,
  nowLabel,
  stageLabel,
  stageOrder,
  totalSlotCount,
  type Article,
  type DeskId,
  type Stage,
} from "./data";

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--guide)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)]";

const stageStyles: Record<
  Stage,
  { icon: LucideIcon; text: string; chipBg: string }
> = {
  reporting: { icon: FileText, text: "text-[var(--stage-reporting)]", chipBg: "bg-[var(--stage-reporting)]" },
  editing: { icon: PenLine, text: "text-[var(--stage-editing)]", chipBg: "bg-[var(--stage-editing)]" },
  typeset: { icon: Columns3, text: "text-[var(--stage-typeset)]", chipBg: "bg-[var(--stage-typeset)]" },
  press: { icon: Printer, text: "text-[var(--stage-press)]", chipBg: "bg-[var(--stage-press)]" },
};

const deskLabel = (id: DeskId): string => desks.find((d) => d.id === id)?.label ?? id;

function StageBadge({ stage }: { stage: Stage }) {
  const meta = stageStyles[stage];
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-current px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
        meta.text
      )}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {stageLabel[stage]}
    </span>
  );
}

function CropMarks() {
  return (
    <>
      <span className={cn(styles.cropCorner, "absolute -left-0.5 -top-0.5")} aria-hidden="true" />
      <span className={cn(styles.cropCorner, "absolute -right-0.5 -top-0.5 rotate-90")} aria-hidden="true" />
      <span className={cn(styles.cropCorner, "absolute -bottom-0.5 -left-0.5 -rotate-90")} aria-hidden="true" />
      <span className={cn(styles.cropCorner, "absolute -bottom-0.5 -right-0.5 rotate-180")} aria-hidden="true" />
    </>
  );
}

export default function ForemeDashboard() {
  const [selectedId, setSelectedId] = useState<string>("top");
  const [activeDesk, setActiveDesk] = useState<DeskId | "all">("all");
  const [navOpen, setNavOpen] = useState(false);

  const selectedArticle = useMemo<Article>(
    () => articles.find((a) => a.id === selectedId) ?? articles[0],
    [selectedId]
  );

  const filteredArticles = useMemo(
    () => (activeDesk === "all" ? articles : articles.filter((a) => a.desk === activeDesk)),
    [activeDesk]
  );

  const currentStageIndex = stageOrder.indexOf(selectedArticle.stage);

  function selectArticle(id: string) {
    setSelectedId(id);
  }

  function selectDesk(id: DeskId | "all") {
    setActiveDesk(id);
    setNavOpen(false);
  }

  return (
    <div className={cn(styles.root, "flex flex-col text-[var(--ink)] lg:h-screen lg:overflow-hidden")}>
      {/* ── 마스트헤드 ───────────────────────────────────────────── */}
      <header className="border-b-2 border-[var(--ink)] px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-expanded={navOpen}
              aria-controls="desk-nav"
              onClick={() => setNavOpen((v) => !v)}
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded border border-[var(--ink)] lg:hidden",
                FOCUS_RING
              )}
            >
              {navOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
              <span className="sr-only">데스크 메뉴 {navOpen ? "닫기" : "열기"}</span>
            </button>
            <Newspaper className="hidden h-7 w-7 shrink-0 sm:block" aria-hidden="true" />
            <h1 className="[font-family:var(--font-nameplate)] truncate text-3xl tracking-tight sm:text-4xl">
              FORME
            </h1>
          </div>
          <div className="hidden shrink-0 flex-col items-end font-mono text-[11px] tabular-nums text-[var(--ink-dim)] md:flex">
            <span>{editionNumber} · {editionKind}</span>
            <span>{editionDateLabel}</span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--rule)] pt-2 font-mono text-[11px] uppercase tracking-wide text-[var(--ink-dim)]">
          <span className="flex items-center gap-1 tabular-nums">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            기준 시각 {nowLabel}
          </span>
          <span className="flex items-center gap-1 tabular-nums text-[var(--accent)]">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            마감 {deadlineLabel} · {countdownLabel} 남음
          </span>
          <span className="tabular-nums md:hidden">{editionNumber} · {editionDateLabel}</span>
        </div>
      </header>

      {/* ── 본문 3분할 ───────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[240px_1fr_380px] lg:overflow-hidden">
        {/* 데스크 내비게이션 */}
        <nav
          id="desk-nav"
          aria-label="데스크 내비게이션"
          className={cn(
            navOpen ? "flex" : "hidden",
            "min-w-0 flex-col gap-4 border-b border-[var(--rule)] px-4 py-4 lg:flex lg:border-b-0 lg:border-r lg:overflow-y-auto lg:py-6",
            styles.scrollPane
          )}
        >
          <ul className="flex flex-col gap-1">
            <li>
              <button
                type="button"
                aria-pressed={activeDesk === "all"}
                onClick={() => selectDesk("all")}
                className={cn(
                  "flex w-full min-h-[44px] items-center justify-between gap-2 rounded px-2 py-2 text-sm transition-colors",
                  activeDesk === "all" ? "bg-[var(--ink)] text-[var(--paper)]" : "hover:bg-[var(--paper-dim)]",
                  FOCUS_RING
                )}
              >
                <span>전체 지면</span>
                <span className="font-mono text-xs tabular-nums">{articles.length}</span>
              </button>
            </li>
            {desks.map((d) => {
              const count = articles.filter((a) => a.desk === d.id).length;
              const active = activeDesk === d.id;
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => selectDesk(d.id)}
                    className={cn(
                      "flex w-full min-h-[44px] items-center justify-between gap-2 rounded px-2 py-2 text-sm transition-colors",
                      active ? "bg-[var(--ink)] text-[var(--paper)]" : "hover:bg-[var(--paper-dim)]",
                      FOCUS_RING
                    )}
                  >
                    <span className="flex items-center gap-1">
                      <ChevronRight className={cn("h-3.5 w-3.5 shrink-0", active ? "opacity-100" : "opacity-0")} aria-hidden="true" />
                      {d.label}
                    </span>
                    <span className="font-mono text-xs tabular-nums">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto flex items-center gap-2 border-t border-[var(--rule)] pt-3 font-mono text-[11px] text-[var(--ink-dim)]">
            <User className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>김도윤 · 편집기자</span>
          </div>
        </nav>

        {/* 메인: KPI + 지면 배치도 + 데스크 진행률 + 파이프라인 */}
        <main className={cn("min-w-0 min-h-0 flex-1 lg:overflow-y-auto", styles.scrollPane)}>
          {/* KPI */}
          <section aria-labelledby="kpi-heading" className="border-b border-[var(--rule)] px-4 py-4 sm:px-6">
            <h2 id="kpi-heading" className="sr-only">오늘의 지표</h2>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="min-w-0 border-l-2 border-[var(--ink)] pl-3">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-dim)]">마감까지</dt>
                <dd className="mt-0.5 font-mono text-3xl font-bold tabular-nums sm:text-4xl">{countdownLabel}</dd>
                <dd className="font-mono text-[10px] tabular-nums text-[var(--ink-dim)]">{deadlineLabel} 초판 인쇄</dd>
              </div>
              <div className="min-w-0 border-l-2 border-[var(--ink)] pl-3">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-dim)]">확정 지면</dt>
                <dd className="mt-0.5 font-mono text-3xl font-bold tabular-nums sm:text-4xl">
                  {filledSlotCount}/{totalSlotCount}
                </dd>
                <dd className="font-mono text-[10px] text-[var(--ink-dim)]">1면 배치 현황</dd>
              </div>
              <div className="min-w-0 border-l-2 border-[var(--ink)] pl-3">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-dim)]">교정 대기</dt>
                <dd className="mt-0.5 font-mono text-3xl font-bold tabular-nums sm:text-4xl">{editingCount}건</dd>
                <dd className="font-mono text-[10px] text-[var(--ink-dim)]">전체 지면 기준</dd>
              </div>
              <div className="min-w-0 border-l-2 border-[var(--ink)] pl-3">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-dim)]">총 단수</dt>
                <dd className="mt-0.5 font-mono text-3xl font-bold tabular-nums sm:text-4xl">{frontPageColumnTotal}단</dd>
                <dd className="font-mono text-[10px] text-[var(--ink-dim)]">오늘자 1면 기준</dd>
              </div>
            </dl>

            {/* 판갈이 진행률 */}
            <div className="mt-4">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--ink-dim)]">
                <span>판갈이 진행률</span>
                <span className="tabular-nums">{articles.length}건 전체</span>
              </div>
              <div
                role="img"
                aria-label={`판갈이 진행률: ${stageOrder
                  .map((s) => `${stageLabel[s]} ${countByStage(articles, s)}건`)
                  .join(", ")}`}
                className="mt-1 flex h-3 w-full overflow-hidden rounded-sm border border-[var(--rule)] bg-[var(--paper-dim)]"
              >
                {stageOrder.map((stage) => {
                  const count = countByStage(articles, stage);
                  if (count === 0) return null;
                  const pct = (count / articles.length) * 100;
                  return (
                    <span
                      key={stage}
                      className={stageStyles[stage].chipBg}
                      style={{ width: `${pct.toFixed(2)}%` }}
                    />
                  );
                })}
              </div>
              <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-[var(--ink-dim)]">
                {stageOrder.map((stage) => (
                  <li key={stage} className="flex items-center gap-1">
                    <span className={cn("h-2 w-2 rounded-full", stageStyles[stage].chipBg)} aria-hidden="true" />
                    {stageLabel[stage]} {countByStage(articles, stage)}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 지면 배치도 */}
          <section aria-labelledby="layoutmap-heading" className="border-b border-[var(--rule)] px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="layoutmap-heading" className="flex items-center gap-2 text-lg font-bold">
                <Rows3 className="h-4 w-4" aria-hidden="true" />
                1면 지면 배치도
              </h2>
              <p className="font-mono text-[11px] tabular-nums text-[var(--ink-dim)]">
                {activeDesk === "all" ? "전체" : deskLabel(activeDesk)} · {filteredArticles.length}건 표시
              </p>
            </div>
            <p id="layoutmap-desc" className="sr-only">
              지면 배치도는 아래 기사 파이프라인 목록과 연동됩니다. 블록을 선택하면 우측 상세 패널과 목록에서
              동일한 기사가 함께 강조됩니다.
            </p>
            <div
              aria-describedby="layoutmap-desc"
              className={cn(
                styles.guideGrid,
                "relative mt-3 grid aspect-[5/6] grid-cols-6 grid-rows-5 gap-2 border-2 border-[var(--ink)] bg-[var(--paper)] p-2 sm:aspect-[4/3]"
              )}
            >
              {frontPageSlots.map((slot) => {
                if (slot.type === "ad") {
                  return (
                    <div
                      key={slot.id}
                      className={cn(
                        slot.gridClass,
                        "flex min-w-0 flex-col items-center justify-center gap-1 border border-dashed border-[var(--rule-strong)] px-2 text-center"
                      )}
                    >
                      <Stamp className="h-4 w-4 text-[var(--ink-dim)]" aria-hidden="true" />
                      <p className="font-mono text-[10px] leading-tight text-[var(--ink-dim)]">{slot.label}</p>
                    </div>
                  );
                }
                if (slot.type === "empty") {
                  return (
                    <div
                      key={slot.id}
                      className={cn(
                        slot.gridClass,
                        "flex min-w-0 items-center justify-center border border-dashed border-[var(--rule-strong)] px-2 text-center"
                      )}
                    >
                      <p className="font-mono text-[10px] text-[var(--ink-dim)]">{slot.label}</p>
                    </div>
                  );
                }

                const article = articles.find((a) => a.id === slot.articleId);
                if (!article) return null;
                const isSelected = selectedId === article.id;
                const isDimmed = activeDesk !== "all" && article.desk !== activeDesk;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => selectArticle(article.id)}
                    aria-pressed={isSelected}
                    aria-label={`${article.headline} · ${deskLabel(article.desk)} · ${article.byline} 기자 · ${stageLabel[article.stage]}`}
                    className={cn(
                      slot.gridClass,
                      "relative flex min-w-0 flex-col items-start gap-1 overflow-hidden border px-2 py-1.5 text-left transition-opacity duration-[var(--motion-duration)]",
                      isSelected ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--paper-dim)]",
                      isDimmed ? "opacity-40" : "opacity-100",
                      FOCUS_RING
                    )}
                  >
                    {isSelected && <CropMarks />}
                    <div className="flex w-full items-center justify-between gap-1">
                      <StageBadge stage={article.stage} />
                      {article.kind === "photo" && <ImageIcon className="h-3.5 w-3.5 shrink-0 text-[var(--ink-dim)]" aria-hidden="true" />}
                    </div>
                    <p className="[font-family:var(--font-serif-kr)] line-clamp-3 text-sm font-semibold leading-snug">
                      {article.headline}
                    </p>
                    <p className="mt-auto w-full truncate pt-0.5 font-mono text-[10px] tabular-nums text-[var(--ink-dim)]">
                      {deskLabel(article.desk)} · {article.byline} · {article.columns > 0 ? `${article.columns}단` : "사진 1점"}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 데스크별 진행률 */}
          <section aria-labelledby="deskprogress-heading" className="border-b border-[var(--rule)] px-4 py-4 sm:px-6">
            <h2 id="deskprogress-heading" className="text-lg font-bold">데스크별 진행률</h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {desks.map((d) => {
                const list = articles.filter((a) => a.desk === d.id);
                const total = list.length;
                const active = activeDesk === d.id;
                return (
                  <li key={d.id} className="min-w-0">
                    <button
                      type="button"
                      onClick={() => selectDesk(active ? "all" : d.id)}
                      aria-pressed={active}
                      className={cn("w-full min-w-0 text-left", FOCUS_RING)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("truncate text-sm", active && "font-bold")}>{d.label}</span>
                        <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--ink-dim)]">{total}건</span>
                      </div>
                      <div
                        role="img"
                        aria-label={`${d.label} 진행 현황: ${stageOrder
                          .map((s) => `${stageLabel[s]} ${countByStage(list, s)}건`)
                          .join(", ")}`}
                        className={cn(
                          "mt-1 flex h-2.5 w-full overflow-hidden rounded-sm border bg-[var(--paper-dim)]",
                          active ? "border-[var(--ink)]" : "border-[var(--rule)]"
                        )}
                      >
                        {stageOrder.map((stage) => {
                          const count = countByStage(list, stage);
                          if (count === 0 || total === 0) return null;
                          const pct = (count / total) * 100;
                          return (
                            <span
                              key={stage}
                              className={stageStyles[stage].chipBg}
                              style={{ width: `${pct.toFixed(2)}%` }}
                            />
                          );
                        })}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* 기사 파이프라인 */}
          <section aria-labelledby="pipeline-heading" className="px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="pipeline-heading" className="text-lg font-bold">기사 파이프라인</h2>
              <p className="font-mono text-[11px] tabular-nums text-[var(--ink-dim)]">
                취재 → 교정 → 조판 → 인쇄
              </p>
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <caption className="sr-only">
                  기사 파이프라인: 상태, 제목, 데스크, 기자, 지면, 단수, 마감 순으로 정렬된 목록. 제목을 선택하면
                  지면 배치도 및 상세 패널과 연동됩니다.
                </caption>
                <thead>
                  <tr className="border-b-2 border-[var(--ink)] text-left font-mono text-[10px] uppercase tracking-wider text-[var(--ink-dim)]">
                    <th scope="col" className="py-2 pr-2 font-normal">상태</th>
                    <th scope="col" className="py-2 pr-2 font-normal">제목</th>
                    <th scope="col" className="py-2 pr-2 font-normal">데스크</th>
                    <th scope="col" className="py-2 pr-2 font-normal">기자</th>
                    <th scope="col" className="py-2 pr-2 font-normal">지면</th>
                    <th scope="col" className="py-2 pr-2 font-normal text-right">단수</th>
                    <th scope="col" className="py-2 pl-2 font-normal text-right">마감</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((a) => {
                    const isSelected = selectedId === a.id;
                    return (
                      <tr
                        key={a.id}
                        className={cn(
                          "border-b border-[var(--rule)] transition-colors",
                          isSelected && "bg-[var(--accent-soft)]"
                        )}
                      >
                        <td className="py-2 pr-2 align-middle">
                          <StageBadge stage={a.stage} />
                        </td>
                        <td className="py-2 pr-2 align-middle">
                          <button
                            type="button"
                            onClick={() => selectArticle(a.id)}
                            aria-pressed={isSelected}
                            className={cn(
                              "min-h-[44px] text-left font-medium underline-offset-4 hover:underline",
                              FOCUS_RING
                            )}
                          >
                            {a.headline}
                          </button>
                        </td>
                        <td className="py-2 pr-2 align-middle text-[var(--ink-dim)]">{deskLabel(a.desk)}</td>
                        <td className="py-2 pr-2 align-middle text-[var(--ink-dim)]">{a.byline}</td>
                        <td className="py-2 pr-2 align-middle text-[var(--ink-dim)]">{a.page}</td>
                        <td className="py-2 pr-2 align-middle text-right font-mono tabular-nums text-[var(--ink-dim)]">
                          {a.columns > 0 ? `${a.columns}단` : "—"}
                        </td>
                        <td className="py-2 pl-2 align-middle text-right font-mono tabular-nums text-[var(--ink-dim)]">
                          {a.deadline}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {/* 인스펙터 */}
        <aside
          aria-label="선택 기사 상세"
          className={cn("min-w-0 min-h-0 border-t border-[var(--rule)] px-4 py-4 lg:border-t-0 lg:border-l lg:overflow-y-auto lg:py-6 sm:px-6", styles.scrollPane)}
        >
          <h2 className="text-lg font-bold">선택 기사</h2>
          <div key={selectedArticle.id} aria-live="polite" aria-atomic="true" className={cn("mt-3 min-w-0", styles.inspectorEnter)}>
            <StageBadge stage={selectedArticle.stage} />
            <p className="[font-family:var(--font-serif-kr)] mt-2 text-xl font-bold leading-snug">
              {selectedArticle.headline}
            </p>

            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-y border-[var(--rule)] py-3 font-mono text-xs">
              <div className="min-w-0">
                <dt className="text-[10px] uppercase tracking-wider text-[var(--ink-dim)]">데스크</dt>
                <dd className="truncate">{deskLabel(selectedArticle.desk)}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] uppercase tracking-wider text-[var(--ink-dim)]">기자</dt>
                <dd className="truncate">{selectedArticle.byline}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] uppercase tracking-wider text-[var(--ink-dim)]">지면</dt>
                <dd className="tabular-nums">{selectedArticle.page}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-[10px] uppercase tracking-wider text-[var(--ink-dim)]">단수</dt>
                <dd className="tabular-nums">
                  {selectedArticle.columns > 0 ? `${selectedArticle.columns}단` : "사진 1점"}
                </dd>
              </div>
              <div className="col-span-2 min-w-0">
                <dt className="text-[10px] uppercase tracking-wider text-[var(--ink-dim)]">마감</dt>
                <dd className="tabular-nums">{selectedArticle.deadline}</dd>
              </div>
            </dl>

            <h3 className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[var(--ink-dim)]">진행 단계</h3>
            <ol aria-label="진행 단계" className="mt-1.5 flex items-stretch gap-1">
              {stageOrder.map((stage, i) => {
                const state = i < currentStageIndex ? "done" : i === currentStageIndex ? "current" : "pending";
                const meta = stageStyles[stage];
                const Icon = meta.icon;
                return (
                  <li
                    key={stage}
                    aria-current={state === "current" ? "step" : undefined}
                    className="min-w-0 flex-1"
                  >
                    <div
                      className={cn(
                        "flex items-center gap-1 rounded border px-1.5 py-1",
                        state === "pending" ? "border-[var(--rule)] text-[var(--ink-dim)]" : cn("border-current", meta.text)
                      )}
                    >
                      {state === "done" ? (
                        <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
                      ) : (
                        <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                      )}
                      <span className="truncate font-mono text-[9px] uppercase">{stageLabel[stage]}</span>
                    </div>
                  </li>
                );
              })}
            </ol>

            <h3 className="mt-4 font-mono text-[10px] uppercase tracking-wider text-[var(--ink-dim)]">취지</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[var(--ink)]">{selectedArticle.synopsis}</p>

            <h3 className="mt-4 font-mono text-[10px] uppercase tracking-wider text-[var(--ink-dim)]">교정 메모</h3>
            {selectedArticle.notes.length > 0 ? (
              <ul className="mt-1.5 flex flex-col gap-2">
                {selectedArticle.notes.map((note, i) => (
                  <li key={i} className="border-l-2 border-[var(--rule-strong)] pl-2 text-xs leading-relaxed">
                    <p className="font-mono text-[10px] tabular-nums text-[var(--ink-dim)]">
                      {note.author} · {note.time}
                    </p>
                    <p>{note.text}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-xs text-[var(--ink-dim)]">등록된 메모가 없습니다.</p>
            )}
          </div>
        </aside>
      </div>

      {/* ── 상태 바 ─────────────────────────────────────────────── */}
      <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t-2 border-[var(--ink)] px-4 py-2 font-mono text-[10px] uppercase tracking-wide text-[var(--ink-dim)] sm:px-6">
        <span className="flex items-center gap-1">
          <User className="h-3.5 w-3.5" aria-hidden="true" />
          김도윤 · 편집기자 · 편집국 워크스페이스
        </span>
        <span className="tabular-nums">초판 12,000부 예정</span>
        <span className="hidden sm:inline">Tab 이동 · Enter/Space 선택</span>
      </footer>
    </div>
  );
}
