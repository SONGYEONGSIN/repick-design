"use client";

import { animate, MotionConfig, motion } from "framer-motion";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Menu,
  Minus,
  Plus,
  Search,
  type LucideIcon,
} from "lucide-react";

import {
  BrandMark,
  GlobalSearch,
  MobileDrawer,
  NavList,
  NotificationsPopover,
  UserMenu,
  WorkspaceSwitcher,
} from "./app-shell";
import { CommandPalette } from "./command-palette";
import {
  ACCOUNTS,
  ACTIVITY,
  BUDGETS,
  CASHFLOW,
  CURRENT_USER,
  KPI_STATS,
  PEOPLE,
  PERIODS,
  TOTAL_BALANCE,
  TRANSACTIONS,
  TX_CATEGORIES,
  UPCOMING_INVOICES,
  WORKSPACES,
  budgetTone,
  type Direction,
  type InvoiceStatus,
  type PeriodId,
  type Transaction,
  type TxStatus,
  type Workspace,
} from "./data";
import { formatDateFull, formatDateShort, formatKRW, formatPercent, formatSignedKRW } from "./format";
import {
  Avatar,
  Badge,
  Card,
  CardHeader,
  ProgressBar,
  SegmentedControl,
  SortableTh,
  Sparkline,
  TabPanel,
  Tabs,
  cx,
  type SortDir,
} from "./primitives";
import { BORDER, DIVIDE, FOCUS_RING, NUM, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION } from "./tokens";
import { useReducedMotion } from "./use-reduced-motion";

/* ---------------------------------------------------------------------- */
/* 프레젠테이션 상수                                                        */
/* ---------------------------------------------------------------------- */

const DIRECTION_ICON: Record<Direction, LucideIcon> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
};

const TX_STATUS_TONE: Record<TxStatus, "positive" | "warning" | "negative"> = {
  완료: "positive",
  대기: "warning",
  거절: "negative",
};

const INVOICE_STATUS_TONE: Record<InvoiceStatus, "neutral" | "warning" | "negative"> = {
  예정: "neutral",
  임박: "warning",
  연체: "negative",
};

const SECTION_TO_NAV_ID: Record<string, string> = {
  top: "overview",
  transactions: "transactions",
  accounts: "accounts",
  budgets: "budgets",
  invoices: "invoices",
};

const TODAY = new Date(Date.UTC(2026, 6, 10));

type TxSortKey = "merchant" | "category" | "date" | "amount";
type ChartMode = "flow" | "income" | "expense";

const CHART_MODE_OPTIONS: { id: ChartMode; label: string }[] = [
  { id: "flow", label: "전체" },
  { id: "income", label: "수입" },
  { id: "expense", label: "지출" },
];

/* ---------------------------------------------------------------------- */
/* 차트 지오메트리 헬퍼                                                      */
/* ---------------------------------------------------------------------- */

const CHART_W = 640;
const CHART_H = 220;
const PAD_TOP = 14;
const PAD_BOTTOM = 26;
const PAD_X = 6;

function buildSeriesPath(values: number[], max: number, close: boolean) {
  const n = values.length;
  const usableH = CHART_H - PAD_TOP - PAD_BOTTOM;
  const usableW = CHART_W - PAD_X * 2;
  const points = values.map((v, i) => {
    const x = n === 1 ? CHART_W / 2 : PAD_X + (i / (n - 1)) * usableW;
    const y = PAD_TOP + (1 - v / max) * usableH;
    return { x, y };
  });
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  if (!close) return { line, points };
  const baseline = CHART_H - PAD_BOTTOM;
  const area = `${line} L ${points[points.length - 1].x.toFixed(1)} ${baseline} L ${points[0].x.toFixed(1)} ${baseline} Z`;
  return { line, area, points };
}

/* ---------------------------------------------------------------------- */
/* 숫자 카운트업 — 기간 전환 시 이전 값에서 새 값으로 부드럽게 보간               */
/* ---------------------------------------------------------------------- */

function useCountUp(target: number, reducedMotion: boolean): number {
  const [display, setDisplay] = useState(target);
  const [trackedTarget, setTrackedTarget] = useState(target);
  const fromRef = useRef(target);

  // reduced-motion 사용자는 애니메이션 없이 즉시 최종값으로 — 렌더 중 상태 조정 패턴
  // (React 공식 권장: effect 내부에서 동기적으로 setState 하지 않는다).
  if (target !== trackedTarget) {
    setTrackedTarget(target);
    if (reducedMotion) {
      setDisplay(target);
    }
  }

  // ref는 렌더 중 쓰기 금지이므로, 애니메이션 시작점(fromRef) 동기화는 effect에서만 수행한다.
  useEffect(() => {
    if (reducedMotion) {
      fromRef.current = target;
    }
  }, [reducedMotion, target]);

  useEffect(() => {
    if (reducedMotion) return;
    if (fromRef.current === target) return;
    const from = fromRef.current;
    const controls = animate(from, target, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    fromRef.current = target;
    return () => controls.stop();
  }, [target, reducedMotion]);

  return display;
}

/* ---------------------------------------------------------------------- */
/* 통계 카드                                                                */
/* ---------------------------------------------------------------------- */

function StatCard({ stat, reducedMotion }: { stat: (typeof KPI_STATS)["7"][number]; reducedMotion: boolean }) {
  const DirIcon = DIRECTION_ICON[stat.direction];
  const displayValue = useCountUp(stat.value, reducedMotion);
  return (
    <Card as="article" className="flex flex-col">
      <div className="flex items-center justify-between">
        <span className={cx("text-xs font-medium", TEXT_SECONDARY)}>{stat.label}</span>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <stat.Icon size={15} aria-hidden="true" className={TEXT_SECONDARY} />
        </span>
      </div>
      <p className={cx("mt-3 text-2xl font-semibold", TEXT_PRIMARY, NUM)}>{formatKRW(displayValue)}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <Badge tone={stat.tone} Icon={DirIcon}>
          {stat.deltaLabel}
        </Badge>
        <Sparkline
          data={stat.spark}
          tone={stat.tone}
          interactive
          formatValue={(v) => formatKRW(Math.round(v) * 1_000_000)}
        />
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------------------- */
/* 메인 컴포넌트                                                            */
/* ---------------------------------------------------------------------- */

export default function DashboardClient() {
  const [workspace, setWorkspace] = useState<Workspace>(WORKSPACES[0]);
  const [period, setPeriod] = useState<PeriodId>("7");
  const [chartMode, setChartMode] = useState<ChartMode>("flow");
  const [txCategory, setTxCategory] = useState<string>("전체");
  const [txSort, setTxSort] = useState<{ key: TxSortKey; dir: SortDir }>({ key: "date", dir: "desc" });
  const [activeSection, setActiveSection] = useState("overview");
  const [mounted, setMounted] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [trackedChartViewKey, setTrackedChartViewKey] = useState(`${period}-${chartMode}`);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const incomeGradientId = useId();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const ids = Object.keys(SECTION_TO_NAV_ID);
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const navId = SECTION_TO_NAV_ID[entry.target.id];
            if (navId) setActiveSection(navId);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        lastFocusedRef.current = document.activeElement as HTMLElement | null;
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  function openDrawer() {
    dialogRef.current?.showModal();
  }
  function closeDrawer() {
    dialogRef.current?.close();
  }

  function openPalette() {
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    setPaletteOpen(true);
  }
  function closePalette() {
    setPaletteOpen(false);
  }
  function handlePaletteNavigate(href: string) {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    el?.focus?.();
  }

  function handleSort(key: TxSortKey) {
    setTxSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  const stats = KPI_STATS[period];
  const cashflow = CASHFLOW[period];

  // 기간/보기 방식 전환 시 이전 호버 인덱스를 지운다 (렌더 중 상태 조정 패턴).
  const chartViewKey = `${period}-${chartMode}`;
  if (chartViewKey !== trackedChartViewKey) {
    setTrackedChartViewKey(chartViewKey);
    if (hoverIndex !== null) setHoverIndex(null);
  }

  const chartMax = useMemo(() => {
    const values = cashflow.flatMap((p) => [p.income, p.expense]);
    return Math.max(...values) * 1.15;
  }, [cashflow]);

  const incomeChart = useMemo(
    () => buildSeriesPath(cashflow.map((p) => p.income), chartMax, true),
    [cashflow, chartMax],
  );
  const expenseChart = useMemo(
    () => buildSeriesPath(cashflow.map((p) => p.expense), chartMax, false),
    [cashflow, chartMax],
  );

  const transactions = useMemo(() => {
    const rows: Transaction[] =
      txCategory === "전체" ? TRANSACTIONS : TRANSACTIONS.filter((t) => t.category === txCategory);
    const sorted = [...rows].sort((a, b) => {
      let cmp = 0;
      if (txSort.key === "merchant") cmp = a.merchant.localeCompare(b.merchant, "ko");
      else if (txSort.key === "category") cmp = a.category.localeCompare(b.category, "ko");
      else if (txSort.key === "date") cmp = a.date.getTime() - b.date.getTime();
      else if (txSort.key === "amount") cmp = a.amount - b.amount;
      return txSort.dir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [txCategory, txSort]);

  const invoiceTotal = UPCOMING_INVOICES.reduce((sum, i) => sum + i.amount, 0);

  return (
    <MotionConfig reducedMotion="user">
    <div style={{ colorScheme: "light dark" }} className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <a
        href="#main-content"
        className={cx(
          "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white",
          FOCUS_RING,
        )}
      >
        본문으로 건너뛰기
      </a>

      <div className="mx-auto flex w-full max-w-[1440px]">
        {/* 데스크톱 사이드바 */}
        <aside
          aria-label="사이드바"
          className={cx(
            "sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r p-4 md:flex",
            BORDER,
            "bg-white dark:bg-zinc-950",
          )}
        >
          <div className="mb-4">
            <BrandMark />
          </div>
          <div className="mb-5">
            <WorkspaceSwitcher workspace={workspace} onChange={setWorkspace} />
          </div>

          <div className="flex-1">
            <NavList activeId={activeSection} />
          </div>

          <div className={cx("mt-4 border-t pt-4", BORDER)}>
            <div className="flex items-center gap-2.5 rounded-xl px-1 py-1">
              <Avatar avatarId={CURRENT_USER.avatarId} name={CURRENT_USER.name} size={34} />
              <div className="min-w-0">
                <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{CURRENT_USER.name}</p>
                <p className={cx("truncate text-xs", TEXT_SECONDARY)}>{CURRENT_USER.role}</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {/* 상단 바 */}
          <header
            className={cx(
              "sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 backdrop-blur sm:px-6 lg:px-8",
              BORDER,
              "bg-white/90 dark:bg-zinc-950/90",
            )}
          >
            <button
              type="button"
              onClick={openDrawer}
              aria-haspopup="dialog"
              className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-full border md:hidden", BORDER, FOCUS_RING)}
            >
              <Menu size={20} aria-hidden="true" />
              <span className="sr-only">메뉴 열기</span>
            </button>
            <div className="md:hidden">
              <BrandMark compact />
            </div>

            <div className="hidden flex-1 md:block">
              <GlobalSearch onOpen={openPalette} />
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={openPalette}
                aria-haspopup="dialog"
                className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-full border md:hidden", BORDER, FOCUS_RING)}
              >
                <Search size={18} aria-hidden="true" className={TEXT_SECONDARY} />
                <span className="sr-only">검색 열기</span>
              </button>
              <button
                type="button"
                className={cx(
                  "hidden min-h-11 items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-sm font-semibold text-white hover:bg-indigo-500 sm:inline-flex",
                  TRANSITION,
                  FOCUS_RING,
                )}
              >
                <Plus size={16} aria-hidden="true" />
                송금하기
              </button>
              <NotificationsPopover />
              <UserMenu />
            </div>
          </header>

          <main
            id="main-content"
            tabIndex={-1}
            className={cx(
              "flex flex-col gap-8 px-4 py-6 outline-none sm:px-6 sm:py-8 lg:px-8",
              "transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
              reducedMotion || mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            )}
          >
            {/* 인사 + 기간 선택 */}
            <section id="top" aria-labelledby="page-title" tabIndex={-1} className="scroll-mt-24 outline-none">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className={cx("text-sm", TEXT_SECONDARY)}>{formatDateFull(TODAY)} 기준</p>
                  <h1 id="page-title" className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-3xl", TEXT_PRIMARY)}>
                    안녕하세요, {CURRENT_USER.name}님
                  </h1>
                  <p className={cx("mt-2 max-w-prose text-sm sm:text-base", TEXT_SECONDARY)}>
                    이번 달 순 현금흐름은{" "}
                    <strong className={cx("font-semibold not-italic text-emerald-700 dark:text-emerald-400", NUM)}>
                      {formatKRW(KPI_STATS["30"][3].value)}
                    </strong>
                    으로 지난달보다 안정적이에요.
                  </p>
                </div>
                <SegmentedControl
                  ariaLabel="조회 기간 선택"
                  options={PERIODS.map((p) => ({ id: p.id, label: p.label }))}
                  value={period}
                  onChange={setPeriod}
                />
              </div>
            </section>

            {/* KPI */}
            <section aria-labelledby="kpi-heading">
              <h2 id="kpi-heading" className="sr-only">
                핵심 지표
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <StatCard key={stat.id} stat={stat} reducedMotion={reducedMotion} />
                ))}
              </div>
            </section>

            {/* 현금 흐름 + 계좌 */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader
                  titleId="cashflow-heading"
                  title="현금 흐름"
                  description={`최근 ${PERIODS.find((p) => p.id === period)?.label} 수입과 지출 추이`}
                  action={
                    <Tabs
                      ariaLabel="현금 흐름 보기 방식"
                      idPrefix="cashflow"
                      options={CHART_MODE_OPTIONS}
                      value={chartMode}
                      onChange={setChartMode}
                    />
                  }
                />
                {CHART_MODE_OPTIONS.map((opt) => {
                  const n = cashflow.length;
                  // 기간 전환 직후 리셋 effect가 커밋되기 전 한 프레임 동안 이전 기간의 인덱스가
                  // 남아있을 수 있으므로 현재 데이터 길이 범위 밖이면 무시한다 (out-of-bounds 방지).
                  const hoverIdx = hoverIndex !== null && hoverIndex < n ? hoverIndex : null;
                  const hoverPoint = hoverIdx !== null ? cashflow[hoverIdx] : null;
                  const hoverX = hoverIdx !== null ? incomeChart.points[hoverIdx].x : 0;
                  const anchorY =
                    hoverIdx !== null
                      ? Math.max(PAD_TOP, Math.min(incomeChart.points[hoverIdx].y, expenseChart.points[hoverIdx].y) - 12)
                      : 0;
                  const tooltipTransform =
                    hoverIdx === 0 ? "translate(0, -100%)" : hoverIdx === n - 1 ? "translate(-100%, -100%)" : "translate(-50%, -100%)";
                  return (
                  <TabPanel key={opt.id} id={`cashflow-panel-${opt.id}`} labelledBy={`cashflow-tab-${opt.id}`}>
                    {chartMode === opt.id && (
                      <>
                        <div className="relative mt-4">
                        <svg
                          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                          role="img"
                          aria-labelledby="cashflow-svg-title"
                          className="w-full"
                          onMouseLeave={() => setHoverIndex(null)}
                        >
                          <title id="cashflow-svg-title">
                            {cashflow.map((p) => `${p.label} 수입 ${formatKRW(p.income)}, 지출 ${formatKRW(p.expense)}`).join("; ")}
                          </title>
                          <defs>
                            <linearGradient id={incomeGradientId} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" className="text-indigo-600 dark:text-indigo-400" />
                              <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-indigo-600 dark:text-indigo-400" />
                            </linearGradient>
                          </defs>
                          {[0.25, 0.5, 0.75].map((f) => (
                            <line
                              key={f}
                              x1={PAD_X}
                              x2={CHART_W - PAD_X}
                              y1={PAD_TOP + f * (CHART_H - PAD_TOP - PAD_BOTTOM)}
                              y2={PAD_TOP + f * (CHART_H - PAD_TOP - PAD_BOTTOM)}
                              className="stroke-zinc-100 dark:stroke-zinc-800"
                              strokeWidth="1"
                            />
                          ))}

                          {(opt.id === "flow" || opt.id === "income") && (
                            <>
                              <path d={incomeChart.area} fill={`url(#${incomeGradientId})`} stroke="none" />
                              <path
                                d={incomeChart.line}
                                fill="none"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="stroke-indigo-600 dark:stroke-indigo-400"
                              />
                              {incomeChart.points.map((p, i) => (
                                <circle key={i} cx={p.x} cy={p.y} r="3" className="fill-indigo-600 dark:fill-indigo-400" />
                              ))}
                            </>
                          )}

                          {(opt.id === "flow" || opt.id === "expense") && (
                            <>
                              <path
                                d={expenseChart.line}
                                fill="none"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray={opt.id === "flow" ? "4 3" : undefined}
                                className="stroke-zinc-400 dark:stroke-zinc-500"
                              />
                              {expenseChart.points.map((p, i) => (
                                <circle key={i} cx={p.x} cy={p.y} r="3" className="fill-zinc-400 dark:fill-zinc-500" />
                              ))}
                            </>
                          )}

                          {hoverIdx !== null && (
                            <line
                              x1={hoverX}
                              x2={hoverX}
                              y1={PAD_TOP}
                              y2={CHART_H - PAD_BOTTOM}
                              strokeWidth="1"
                              strokeDasharray="3 3"
                              className="stroke-zinc-300 dark:stroke-zinc-600"
                            />
                          )}
                          {hoverIdx !== null && (opt.id === "flow" || opt.id === "income") && (
                            <circle
                              cx={incomeChart.points[hoverIdx].x}
                              cy={incomeChart.points[hoverIdx].y}
                              r="5"
                              strokeWidth="2"
                              className="fill-indigo-600 stroke-white dark:fill-indigo-400 dark:stroke-zinc-950"
                            />
                          )}
                          {hoverIdx !== null && (opt.id === "flow" || opt.id === "expense") && (
                            <circle
                              cx={expenseChart.points[hoverIdx].x}
                              cy={expenseChart.points[hoverIdx].y}
                              r="5"
                              strokeWidth="2"
                              className="fill-zinc-500 stroke-white dark:fill-zinc-400 dark:stroke-zinc-950"
                            />
                          )}

                          {cashflow.map((p, i) => {
                            const x = n === 1 ? CHART_W / 2 : PAD_X + (i / (n - 1)) * (CHART_W - PAD_X * 2);
                            return (
                              <text
                                key={p.label}
                                x={x}
                                y={CHART_H - 6}
                                textAnchor="middle"
                                className={cx("fill-zinc-400 text-[10px] dark:fill-zinc-500", NUM)}
                              >
                                {p.label}
                              </text>
                            );
                          })}

                          {cashflow.map((p, i) => {
                            const x = n === 1 ? CHART_W / 2 : PAD_X + (i / (n - 1)) * (CHART_W - PAD_X * 2);
                            return (
                              <circle
                                key={`hit-${p.label}`}
                                cx={x}
                                cy={CHART_H / 2}
                                r={16}
                                fill="transparent"
                                tabIndex={0}
                                role="button"
                                aria-label={`${p.label}: 수입 ${formatKRW(p.income)}, 지출 ${formatKRW(p.expense)}`}
                                className="cursor-pointer"
                                onFocus={() => setHoverIndex(i)}
                                onBlur={() => setHoverIndex(null)}
                                onMouseEnter={() => setHoverIndex(i)}
                              />
                            );
                          })}
                        </svg>

                        {hoverPoint && (
                          <div
                            role="status"
                            aria-live="polite"
                            className={cx(
                              "pointer-events-none absolute z-10 min-w-[9.5rem] rounded-lg border px-3 py-2 text-xs shadow-lg",
                              BORDER,
                              "bg-white dark:bg-zinc-900",
                            )}
                            style={{
                              left: `${(hoverX / CHART_W) * 100}%`,
                              top: `${(anchorY / CHART_H) * 100}%`,
                              transform: tooltipTransform,
                            }}
                          >
                            <p className={cx("font-semibold", TEXT_PRIMARY)}>{hoverPoint.label}</p>
                            {(opt.id === "flow" || opt.id === "income") && (
                              <p className="mt-1 flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                                  <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                                  수입
                                </span>
                                <span className={cx("font-medium", NUM, TEXT_PRIMARY)}>{formatKRW(hoverPoint.income)}</span>
                              </p>
                            )}
                            {(opt.id === "flow" || opt.id === "expense") && (
                              <p className="mt-1 flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                                  <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                                  지출
                                </span>
                                <span className={cx("font-medium", NUM, TEXT_PRIMARY)}>{formatKRW(hoverPoint.expense)}</span>
                              </p>
                            )}
                          </div>
                        )}
                        </div>
                        <div className={cx("mt-3 flex items-center gap-4 text-xs", TEXT_SECONDARY)}>
                          {(opt.id === "flow" || opt.id === "income") && (
                            <span className="flex items-center gap-1.5">
                              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" aria-hidden="true" />
                              수입
                            </span>
                          )}
                          {(opt.id === "flow" || opt.id === "expense") && (
                            <span className="flex items-center gap-1.5">
                              <span className="h-2.5 w-2.5 rounded-full bg-zinc-400 dark:bg-zinc-500" aria-hidden="true" />
                              지출
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </TabPanel>
                  );
                })}
              </Card>

              <div id="accounts" tabIndex={-1} className="scroll-mt-24 outline-none">
                <Card className="h-full">
                  <CardHeader titleId="accounts-heading" title="계좌" description={`${ACCOUNTS.length}개 연결된 계좌`} />
                  <ul className={cx("mt-3 divide-y", DIVIDE)}>
                    {ACCOUNTS.map((acc) => (
                      <motion.li
                        key={acc.id}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                          <acc.Icon size={16} aria-hidden="true" className={TEXT_SECONDARY} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{acc.name}</p>
                          <p className={cx("truncate text-xs", TEXT_SECONDARY)}>
                            {acc.type} •••• {acc.mask}
                          </p>
                        </div>
                        <p
                          className={cx(
                            "shrink-0 text-sm font-semibold",
                            NUM,
                            acc.balance < 0 ? "text-red-700 dark:text-red-400" : TEXT_PRIMARY,
                          )}
                        >
                          {formatKRW(acc.balance)}
                        </p>
                      </motion.li>
                    ))}
                  </ul>
                  <div className={cx("mt-3 flex items-center justify-between border-t pt-3 text-sm", BORDER)}>
                    <span className={TEXT_SECONDARY}>총 잔고</span>
                    <span className={cx("font-semibold", NUM, TEXT_PRIMARY)}>{formatKRW(TOTAL_BALANCE)}</span>
                  </div>
                </Card>
              </div>
            </div>

            {/* 예산 + 거래 내역 */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div id="budgets" tabIndex={-1} className="scroll-mt-24 outline-none lg:col-span-1">
                <Card className="h-full">
                  <CardHeader titleId="budgets-heading" title="이번 달 예산" description={`${BUDGETS.length}개 카테고리`} />
                  <ul className="mt-4 flex flex-col gap-4">
                    {BUDGETS.map((b) => {
                      const tone = budgetTone(b.spent, b.total);
                      const pct = (b.spent / b.total) * 100;
                      return (
                        <motion.li key={b.id} whileHover={{ x: 3 }} transition={{ duration: 0.15, ease: "easeOut" }}>
                          <div className="flex items-center justify-between gap-2 text-sm">
                            <span className={cx("flex min-w-0 items-center gap-1.5 truncate font-medium", TEXT_PRIMARY)}>
                              <b.Icon size={14} aria-hidden="true" className={TEXT_SECONDARY} />
                              <span className="truncate">{b.label}</span>
                            </span>
                            <span className={cx("shrink-0 text-xs", NUM, TEXT_SECONDARY)}>
                              {formatKRW(b.spent)} / {formatKRW(b.total)}
                            </span>
                          </div>
                          <div className="mt-2">
                            <ProgressBar value={b.spent} max={b.total} tone={tone} label={`${b.label} 예산 사용률 ${formatPercent(pct)}`} />
                          </div>
                          {pct > 100 && (
                            <p className="mt-1 text-xs text-red-700 dark:text-red-400">예산 {formatPercent(pct - 100)} 초과</p>
                          )}
                        </motion.li>
                      );
                    })}
                  </ul>
                </Card>
              </div>

              <div id="transactions" tabIndex={-1} className="scroll-mt-24 outline-none lg:col-span-2">
                <Card padded={false} className="h-full">
                  <div className={cx("p-5 sm:p-6", "pb-0 sm:pb-0")}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <CardHeader titleId="transactions-heading" title="최근 거래" description={`${transactions.length}건`} />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-xs">
                        <span className={cx("font-medium", TEXT_SECONDARY)}>카테고리</span>
                        <select
                          value={txCategory}
                          onChange={(e) => setTxCategory(e.target.value)}
                          className={cx(
                            "h-9 rounded-lg border bg-white px-2.5 text-sm dark:bg-zinc-900",
                            BORDER,
                            TEXT_PRIMARY,
                            FOCUS_RING,
                          )}
                        >
                          {TX_CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse text-sm">
                      <caption className="sr-only">
                        최근 거래 내역. 거래처, 카테고리, 날짜, 금액 열 머리글을 눌러 정렬할 수 있습니다.
                      </caption>
                      <thead>
                        <tr className={cx("border-b", BORDER)}>
                          <SortableTh columnKey="merchant" activeKey={txSort.key} dir={txSort.dir} onSort={handleSort}>
                            거래처
                          </SortableTh>
                          <SortableTh columnKey="category" activeKey={txSort.key} dir={txSort.dir} onSort={handleSort}>
                            카테고리
                          </SortableTh>
                          <SortableTh columnKey="date" activeKey={txSort.key} dir={txSort.dir} onSort={handleSort}>
                            날짜
                          </SortableTh>
                          <SortableTh columnKey="amount" activeKey={txSort.key} dir={txSort.dir} onSort={handleSort} align="right">
                            금액
                          </SortableTh>
                          <th scope="col" className={cx("px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide", TEXT_SECONDARY)}>
                            상태
                          </th>
                        </tr>
                      </thead>
                      <tbody className={cx("divide-y", DIVIDE)}>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className={cx(TRANSITION, "hover:bg-zinc-50 dark:hover:bg-white/[0.03]")}>
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2.5">
                                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                  <tx.Icon size={14} aria-hidden="true" className={TEXT_SECONDARY} />
                                </span>
                                <span className={cx("font-medium", TEXT_PRIMARY)}>{tx.merchant}</span>
                              </div>
                            </td>
                            <td className={cx("px-3 py-3", TEXT_SECONDARY)}>{tx.category}</td>
                            <td className={cx("px-3 py-3 whitespace-nowrap", NUM, TEXT_SECONDARY)}>{formatDateShort(tx.date)}</td>
                            <td
                              className={cx(
                                "px-3 py-3 text-right font-semibold whitespace-nowrap",
                                NUM,
                                tx.amount > 0 ? "text-emerald-700 dark:text-emerald-400" : TEXT_PRIMARY,
                              )}
                            >
                              {formatSignedKRW(tx.amount)}
                            </td>
                            <td className="px-3 py-3 text-right">
                              <Badge tone={TX_STATUS_TONE[tx.status]}>{tx.status}</Badge>
                            </td>
                          </tr>
                        ))}
                        {transactions.length === 0 && (
                          <tr>
                            <td colSpan={5} className={cx("px-3 py-8 text-center text-sm", TEXT_SECONDARY)}>
                              해당 카테고리의 거래 내역이 없어요.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="h-5 sm:h-6" aria-hidden="true" />
                </Card>
              </div>
            </div>

            {/* 최근 활동 + 다가오는 청구서 */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div id="activity" tabIndex={-1} className="scroll-mt-24 outline-none">
                <Card className="h-full">
                  <CardHeader titleId="activity-heading" title="최근 활동" description="팀의 최근 작업 내역" />
                  <ul className="mt-4 flex flex-col gap-4">
                    {ACTIVITY.map((item) => {
                      const person = PEOPLE[item.personId];
                      return (
                        <motion.li
                          key={item.id}
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="flex items-start gap-3"
                        >
                          <Avatar avatarId={person.avatarId} name={person.name} size={32} />
                          <div className="min-w-0 flex-1">
                            <p className={cx("text-sm leading-snug", TEXT_PRIMARY)}>
                              <span className="font-medium">{person.name}</span>님이 {item.text}
                            </p>
                            <p className={cx("mt-0.5 flex items-center gap-1 text-xs", TEXT_SECONDARY)}>
                              <item.Icon size={12} aria-hidden="true" />
                              {item.timeLabel}
                            </p>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ul>
                </Card>
              </div>

              <div id="invoices" tabIndex={-1} className="scroll-mt-24 outline-none">
                <Card className="h-full">
                  <CardHeader
                    titleId="invoices-heading"
                    title="다가오는 청구서"
                    description={`${UPCOMING_INVOICES.length}건 · 총 ${formatKRW(invoiceTotal)}`}
                  />
                  <ul className={cx("mt-3 divide-y", DIVIDE)}>
                    {UPCOMING_INVOICES.map((inv) => (
                      <motion.li
                        key={inv.id}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                          <inv.Icon size={16} aria-hidden="true" className={TEXT_SECONDARY} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{inv.vendor}</p>
                          <p className={cx("truncate text-xs", TEXT_SECONDARY)}>{inv.dueLabel}</p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <span className={cx("text-sm font-semibold", NUM, TEXT_PRIMARY)}>{formatKRW(inv.amount)}</span>
                          <Badge tone={INVOICE_STATUS_TONE[inv.status]}>{inv.status}</Badge>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </main>

          <footer className={cx("border-t px-4 py-6 text-xs sm:px-6 lg:px-8", BORDER, TEXT_SECONDARY)}>
            <p>화면의 모든 수치는 예시 데이터입니다 · 마지막 동기화 오후 2:12</p>
          </footer>
        </div>
      </div>

      <MobileDrawer dialogRef={dialogRef} activeId={activeSection} onClose={closeDrawer} />
      <CommandPalette
        open={paletteOpen}
        onClose={closePalette}
        onNavigate={handlePaletteNavigate}
        restoreFocusRef={lastFocusedRef}
      />
    </div>
    </MotionConfig>
  );
}
