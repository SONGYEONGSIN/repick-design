"use client";

/**
 * Quorum — Trust & Safety 심사 콘솔.
 *
 * 매크로 골격은 피드 중심이다: 콘텐츠 영역에는 좌·우 보조 페인이 없고, 세로로 흐르는
 * 결정 스트림 하나가 전체 폭을 쓴다. 상단 sticky 요약 스트립은 스트림의 상태를 그대로
 * 반영한다 — 결정을 내리면 ① 그 건이 접히고 ② 카운터가 재계산되고 ③ 다음 미결 건으로
 * 초점이 이동한다. 단일 `selectedId` 를 여러 위젯에 흘려보내는 배선은 쓰지 않는다.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Bell,
  BookOpen,
  Building2,
  CheckCheck,
  ChevronsUpDown,
  ClipboardList,
  Inbox,
  ListFilter,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Timer,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import {
  DECISION_META,
  PERIOD_LABELS,
  RESOLVED_BEFORE_SESSION,
  REVIEW_ITEMS,
  SEVERITY_META,
  THROUGHPUT_TREND,
  numberFormat,
  type DecisionKind,
  type PeriodKey,
  type Severity,
} from "./data";
import { ReviewCard } from "./ReviewCard";
import { CommandPalette, type Command } from "./CommandPalette";
import {
  Avatar,
  Dropdown,
  FieldLabel,
  FOCUS,
  SegmentedControl,
  Sparkline,
  cn,
  useBodyScrollLock,
  type SegmentOption,
} from "./ui";

const DISPLAY_WIDE = { fontFamily: "var(--font-display-wide)" } as const;

type SeverityFilter = Severity | "all";
type SortMode = "sla" | "reports" | "severity";

const SEVERITY_OPTIONS: ReadonlyArray<SegmentOption<SeverityFilter>> = [
  { value: "all", label: "전체" },
  { value: "high", label: "높음" },
  { value: "medium", label: "보통" },
  { value: "low", label: "낮음" },
];

const PERIOD_OPTIONS: ReadonlyArray<SegmentOption<PeriodKey>> = [
  { value: "24h", label: "24시간" },
  { value: "7d", label: "7일" },
  { value: "30d", label: "30일" },
];

const SORT_OPTIONS: ReadonlyArray<SegmentOption<SortMode>> = [
  { value: "sla", label: "SLA 임박순" },
  { value: "reports", label: "신고 많은순" },
  { value: "severity", label: "심각도순" },
];

const SEVERITY_RANK: Record<Severity, number> = { high: 0, medium: 1, low: 2 };

type NavItem = {
  key: string;
  label: string;
  icon: typeof Inbox;
  count: number | null;
  active: boolean;
};

const NAV_SECTIONS: Array<{ label: string; items: NavItem[] }> = [
  {
    label: "심사",
    items: [
      { key: "queue", label: "심사 큐", icon: Inbox, count: 10, active: true },
      { key: "assigned", label: "내 배정", icon: ClipboardList, count: 4, active: false },
      { key: "escalations", label: "에스컬레이션", icon: ShieldAlert, count: 2, active: false },
    ],
  },
  {
    label: "분석",
    items: [
      { key: "policy", label: "정책 성과", icon: TrendingUp, count: null, active: false },
      { key: "reporters", label: "신고자 신뢰도", icon: Users, count: null, active: false },
    ],
  },
  {
    label: "운영",
    items: [
      { key: "library", label: "정책 라이브러리", icon: BookOpen, count: null, active: false },
      { key: "settings", label: "워크스페이스 설정", icon: Settings, count: null, active: false },
    ],
  },
];

const END_KEY = "__queue-end";

export function QueueConsole() {
  const [decisions, setDecisions] = useState<Record<string, DecisionKind>>({});
  const [expandedId, setExpandedId] = useState<string | null>(REVIEW_ITEMS[0].id);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [period, setPeriod] = useState<PeriodKey>("24h");
  const [sortMode, setSortMode] = useState<SortMode>("sla");
  const [pendingOnly, setPendingOnly] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const anchors = useRef(new Map<string, HTMLElement | null>());
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);
  // The actual DOM ref lookup happens only inside the effect below (refs are safe to read there).
  // `requestFocus` itself touches no ref — it only sets state — because it is reachable from
  // `commands` (`run: jumpToNextPending`), which flows into `<CommandPalette commands={commands} />`
  // as a render-time value; a ref-touching function embedded there is a render-phase ref read.
  const [focusTarget, setFocusTarget] = useState<{ id: string; token: number } | null>(null);

  const register = useCallback((id: string, node: HTMLElement | null) => {
    if (node) anchors.current.set(id, node);
    else anchors.current.delete(id);
  }, []);

  const requestFocus = useCallback((id: string) => {
    setFocusTarget((prev) => ({ id, token: (prev?.token ?? 0) + 1 }));
  }, []);

  useEffect(() => {
    if (!focusTarget) return;
    anchors.current.get(focusTarget.id)?.focus();
  }, [focusTarget]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useBodyScrollLock(drawerOpen);

  /* ------------------------------------------------------------- 파생값 */

  const counters = useMemo(() => {
    const decidedIds = Object.keys(decisions);
    const pendingItems = REVIEW_ITEMS.filter((item) => !decisions[item.id]);
    const tally = { keep: 0, remove: 0, escalate: 0 };
    decidedIds.forEach((id) => {
      tally[decisions[id]] += 1;
    });
    return {
      pending: pendingItems.length,
      resolvedToday: RESOLVED_BEFORE_SESSION + decidedIds.length,
      sessionDecided: decidedIds.length,
      slaRisk: pendingItems.filter((item) => item.slaMinutes <= 60).length,
      tally,
    };
  }, [decisions]);

  const visible = useMemo(() => {
    const filtered = REVIEW_ITEMS.filter((item) => {
      if (severityFilter !== "all" && item.severity !== severityFilter) return false;
      if (pendingOnly && decisions[item.id]) return false;
      return true;
    });
    return [...filtered].sort((a, b) => {
      let delta = 0;
      if (sortMode === "sla") delta = a.slaMinutes - b.slaMinutes;
      else if (sortMode === "reports") delta = b.reports - a.reports;
      else delta = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || a.slaMinutes - b.slaMinutes;
      return delta === 0 ? a.id.localeCompare(b.id) : delta;
    });
  }, [decisions, pendingOnly, severityFilter, sortMode]);

  /* ------------------------------------------------------------- 핸들러 */

  function advanceFrom(id: string | null, nextDecisions: Record<string, DecisionKind>) {
    const order = visible.map((item) => item.id);
    const start = id === null ? -1 : order.indexOf(id);
    for (let step = 1; step <= order.length; step += 1) {
      const candidate = order[(start + step + order.length) % order.length];
      if (!nextDecisions[candidate]) return candidate;
    }
    return null;
  }

  function handleDecide(id: string, kind: DecisionKind) {
    const nextDecisions = { ...decisions, [id]: kind };
    const nextId = advanceFrom(id, nextDecisions);
    const remaining = REVIEW_ITEMS.filter((item) => !nextDecisions[item.id]).length;
    setDecisions(nextDecisions);
    setExpandedId(nextId);
    requestFocus(nextId ?? END_KEY);
    setAnnouncement(
      nextId
        ? `${id} 건을 ${DECISION_META[kind].label}으로 처리했습니다. 남은 미결 ${remaining}건. 다음 건 ${nextId}로 이동합니다.`
        : `${id} 건을 ${DECISION_META[kind].label}으로 처리했습니다. 조건에 맞는 미결 건이 더 없습니다.`,
    );
  }

  function handleUndo(id: string) {
    const nextDecisions = { ...decisions };
    delete nextDecisions[id];
    setDecisions(nextDecisions);
    setAnnouncement(`${id} 건의 결정을 되돌렸습니다.`);
  }

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function jumpToNextPending() {
    const nextId = advanceFrom(expandedId, decisions);
    setExpandedId(nextId);
    requestFocus(nextId ?? END_KEY);
    setAnnouncement(nextId ? `${nextId} 건으로 이동했습니다.` : "미결 건이 없습니다.");
  }

  function resetSession() {
    setDecisions({});
    setExpandedId(REVIEW_ITEMS[0].id);
    setAnnouncement("이번 세션의 결정을 모두 되돌렸습니다.");
  }

  function resetFilters() {
    setSeverityFilter("all");
    setPendingOnly(false);
    setAnnouncement("필터를 초기화했습니다.");
  }

  // 커맨드는 렌더마다 현재 필터/큐 상태를 읽어 라벨이 살아 있어야 하므로 메모하지 않는다.
  const commands: Command[] = (() => {
    const list: Command[] = [
      {
        id: "jump-next",
        group: "이동",
        label: "다음 미결 건으로 이동",
        hint: "큐 전진",
        keywords: "next pending jump 다음",
        run: jumpToNextPending,
      },
      {
        id: "pending-only",
        group: "필터",
        label: pendingOnly ? "결정한 건도 함께 보기" : "미결 건만 보기",
        hint: pendingOnly ? "전체" : "미결",
        keywords: "pending filter 미결 필터",
        run: () => setPendingOnly((prev) => !prev),
      },
      {
        id: "reset-filters",
        group: "필터",
        label: "필터 초기화",
        hint: "전체 큐",
        keywords: "reset clear 초기화",
        run: resetFilters,
      },
    ];
    SEVERITY_OPTIONS.forEach((option) => {
      list.push({
        id: `sev-${option.value}`,
        group: "심각도",
        label: option.value === "all" ? "심각도 전체 보기" : `심각도 ${option.label} 건만 보기`,
        hint: option.label,
        keywords: `severity ${option.value} 심각도`,
        run: () => setSeverityFilter(option.value),
      });
    });
    PERIOD_OPTIONS.forEach((option) => {
      list.push({
        id: `period-${option.value}`,
        group: "기간",
        label: `유입 추이를 ${option.label} 기준으로 보기`,
        hint: option.label,
        keywords: `period range ${option.value} 기간`,
        run: () => setPeriod(option.value),
      });
    });
    SORT_OPTIONS.forEach((option) => {
      list.push({
        id: `sort-${option.value}`,
        group: "정렬",
        label: `${option.label}으로 정렬`,
        hint: option.label,
        keywords: `sort order ${option.value} 정렬`,
        run: () => setSortMode(option.value),
      });
    });
    list.push({
      id: "reset-session",
      group: "큐",
      label: "이번 세션 결정 되돌리기",
      hint: `${counters.sessionDecided}건`,
      keywords: "undo reset session 되돌리기",
      run: resetSession,
    });
    return list;
  })();

  const allDecided = counters.pending === 0;

  return (
    <div className="flex min-h-screen w-full flex-1 bg-zinc-50 text-zinc-900">
      <a
        href="#queue-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-violet-600 focus:px-4 focus:py-2.5 focus:text-sm focus:text-white"
      >
        본문으로 건너뛰기
      </a>

      {/* ------------------------------------------------------ 앱 셸 사이드바 */}
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <SidebarContent />
      </aside>

      {/* 모바일 드로어 */}
      {drawerOpen ? (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onKeyDown={(event) => {
            if (event.key === "Escape") setDrawerOpen(false);
          }}
          role="presentation"
        >
          <button
            type="button"
            aria-label="탐색 메뉴 닫기"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-zinc-900/30"
          />
          <div className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col border-r border-zinc-200 bg-white">
            <SidebarContent onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* ------------------------------------------------------------ 상단바 */}
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
          <div className="flex h-16 items-center gap-2 px-4 sm:gap-3 sm:px-6">
            <button
              type="button"
              aria-label="탐색 메뉴 열기"
              onClick={() => setDrawerOpen(true)}
              className={cn(
                "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 lg:hidden",
                FOCUS,
              )}
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>

            <button
              ref={searchButtonRef}
              type="button"
              onClick={() => setPaletteOpen(true)}
              className={cn(
                "relative inline-flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-white motion-reduce:transition-none sm:max-w-md",
                FOCUS,
              )}
            >
              <Search className="h-4 w-4 shrink-0" aria-hidden />
              <span className="sr-only truncate sm:not-sr-only">모더레이션 검색</span>
              <span className="ml-auto hidden shrink-0 rounded border border-zinc-300 bg-white px-1.5 py-0.5 text-[11px] text-zinc-600 lg:inline">
                ⌘K
              </span>
            </button>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              <button
                type="button"
                className={cn(
                  "hidden h-11 items-center gap-2 rounded-lg bg-violet-600 px-4 text-sm text-white transition-colors hover:bg-violet-700 motion-reduce:transition-none md:inline-flex",
                  FOCUS,
                )}
              >
                <Plus className="h-4 w-4" aria-hidden />
                정책 규칙 추가
              </button>
              <button
                type="button"
                aria-label="알림 3건"
                className={cn(
                  "relative inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
                  FOCUS,
                )}
              >
                <Bell className="h-5 w-5" aria-hidden />
                <span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] tabular-nums text-white">
                  3
                </span>
              </button>
              <button
                type="button"
                aria-label="계정 메뉴 — 임세라"
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50",
                  FOCUS,
                )}
              >
                <Avatar name="임세라" tint={0} />
              </button>
            </div>
          </div>
        </header>

        <main id="queue-main" className="min-w-0 flex-1">
          {/* ------------------------------------------------------ 페이지 제목 */}
          <div className="mx-auto w-full max-w-[1720px] px-4 pb-4 pt-6 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <div className="min-w-0">
                <p
                  className="text-[11px] uppercase tracking-[0.22em] text-zinc-500"
                  style={DISPLAY_WIDE}
                >
                  Trust &amp; Safety
                </p>
                <h1 className="mt-1 text-2xl font-medium leading-tight text-zinc-900 sm:text-[28px]">
                  심사 큐
                </h1>
              </div>
              <p className="text-sm text-zinc-600">
                {PERIOD_LABELS[period]} 유입 기준 · 정렬{" "}
                {SORT_OPTIONS.find((option) => option.value === sortMode)?.label} · 심각도{" "}
                {severityFilter === "all" ? "전체" : SEVERITY_META[severityFilter].label}
              </p>
            </div>
          </div>

          {/* -------------------------------------------- sticky 요약 스트립 */}
          <div className="border-y border-zinc-200 bg-white lg:sticky lg:top-16 lg:z-20">
            <div className="mx-auto w-full max-w-[1720px] px-4 py-4 sm:px-6">
              <h2 className="sr-only">큐 요약</h2>
              <div className="grid grid-cols-12 gap-x-4 gap-y-4 sm:gap-x-6">
                <Counter
                  icon={Inbox}
                  label="미결 심사"
                  value={counters.pending}
                  unit="건"
                  caption={`전체 ${REVIEW_ITEMS.length}건 중`}
                />
                <Counter
                  icon={CheckCheck}
                  label="오늘 처리"
                  value={counters.resolvedToday}
                  unit="건"
                  caption={`이번 세션 ${counters.sessionDecided}건 포함`}
                  trend={THROUGHPUT_TREND}
                />
                <Counter
                  icon={Timer}
                  label="SLA 임박"
                  value={counters.slaRisk}
                  unit="건"
                  caption="잔여 60분 이하"
                  urgent={counters.slaRisk > 0}
                />
                <Counter
                  icon={ShieldAlert}
                  label="상급 보류"
                  value={counters.tally.escalate}
                  unit="건"
                  caption="정책팀 재검토 대기"
                />
                <Counter
                  icon={Activity}
                  label="중앙 처리시간"
                  value="2:41"
                  unit=""
                  caption="목표 3:00 이내"
                />

                <div className="col-span-12 min-w-0 sm:col-span-8 xl:col-span-2">
                  <FieldLabel>큐 구성</FieldLabel>
                  <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                    <span
                      className="block h-full bg-zinc-400 transition-[width] duration-300 motion-reduce:transition-none"
                      style={{ width: `${(counters.tally.keep / REVIEW_ITEMS.length) * 100}%` }}
                    />
                    <span
                      className="block h-full bg-violet-600 transition-[width] duration-300 motion-reduce:transition-none"
                      style={{ width: `${(counters.tally.remove / REVIEW_ITEMS.length) * 100}%` }}
                    />
                    <span
                      className="block h-full bg-violet-300 transition-[width] duration-300 motion-reduce:transition-none"
                      style={{ width: `${(counters.tally.escalate / REVIEW_ITEMS.length) * 100}%` }}
                    />
                  </div>
                  <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-600">
                    <CompositionLegend swatch="bg-zinc-400" label="유지" value={counters.tally.keep} />
                    <CompositionLegend swatch="bg-violet-600" label="차단" value={counters.tally.remove} />
                    <CompositionLegend swatch="bg-violet-300" label="보류" value={counters.tally.escalate} />
                    <CompositionLegend swatch="bg-zinc-200" label="미결" value={counters.pending} />
                  </ul>
                </div>
              </div>

              {/* 컨트롤 행 */}
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-4">
                <SegmentedControl
                  size="sm"
                  label="심각도 필터"
                  options={SEVERITY_OPTIONS}
                  value={severityFilter}
                  onChange={setSeverityFilter}
                />
                <SegmentedControl
                  size="sm"
                  label="유입 추이 기간"
                  options={PERIOD_OPTIONS}
                  value={period}
                  onChange={setPeriod}
                />
                <Dropdown
                  label="정렬"
                  icon={ListFilter}
                  options={SORT_OPTIONS}
                  value={sortMode}
                  onChange={setSortMode}
                />
                <button
                  type="button"
                  aria-pressed={pendingOnly}
                  onClick={() => setPendingOnly((prev) => !prev)}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors motion-reduce:transition-none",
                    FOCUS,
                    pendingOnly
                      ? "border-violet-300 bg-violet-50 text-violet-800"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300",
                  )}
                >
                  <Inbox className="h-4 w-4 shrink-0" aria-hidden />
                  미결만
                </button>
                <p className="ml-auto text-xs text-zinc-600">
                  <span className="tabular-nums text-zinc-900">{visible.length}</span>건 표시 · 전체{" "}
                  <span className="tabular-nums text-zinc-900">{REVIEW_ITEMS.length}</span>건
                </p>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------- 결정 스트림 */}
          <div className="mx-auto w-full max-w-[1720px] px-4 py-6 sm:px-6">
            <h2
              tabIndex={-1}
              ref={(node) => {
                register(END_KEY, node);
              }}
              className={cn("text-sm font-medium text-zinc-800", FOCUS)}
            >
              결정 스트림
              <span className="ml-2 text-zinc-600">
                — 카드를 펼쳐 증거를 확인하고 결정하면 큐가 전진합니다
              </span>
            </h2>

            <div className="mt-3 grid grid-cols-12 gap-3">
              {visible.map((item) => (
                <ReviewCard
                  key={item.id}
                  item={item}
                  decision={decisions[item.id] ?? null}
                  expanded={expandedId === item.id}
                  period={period}
                  onToggle={handleToggle}
                  onDecide={handleDecide}
                  onUndo={handleUndo}
                  onRegister={register}
                />
              ))}

              {visible.length === 0 ? (
                <div className="col-span-12 rounded-xl border border-zinc-200 bg-white px-6 py-14 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-50">
                    <CheckCheck className="h-6 w-6 text-violet-700" aria-hidden />
                  </span>
                  <p className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900" style={DISPLAY_WIDE}>
                    {allDecided ? "ALL CLEAR" : "NO MATCHES"}
                  </p>
                  <h3 className="mt-2 text-base font-medium text-zinc-900">
                    {allDecided ? "큐를 모두 비웠습니다" : "조건에 맞는 심사 건이 없습니다"}
                  </h3>
                  <p className="mx-auto mt-1 max-w-md text-sm text-zinc-600">
                    {allDecided
                      ? `이번 세션에서 ${counters.sessionDecided}건을 처리했습니다. 새 신고는 접수되는 대로 이 스트림에 쌓입니다.`
                      : "심각도 필터나 미결 조건을 바꾸면 다시 표시됩니다."}
                  </p>
                  <button
                    type="button"
                    onClick={allDecided ? resetSession : resetFilters}
                    className={cn(
                      "mt-5 inline-flex h-11 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-800 hover:bg-zinc-50",
                      FOCUS,
                    )}
                  >
                    {allDecided ? "이번 세션 결정 되돌리기" : "필터 초기화"}
                  </button>
                </div>
              ) : null}
            </div>

            {allDecided && visible.length > 0 ? (
              <p className="mt-4 rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
                미결 건이 남아 있지 않습니다. 이번 세션에서 {counters.sessionDecided}건을 처리했습니다.
              </p>
            ) : null}
          </div>
        </main>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <CommandPalette
        open={paletteOpen}
        commands={commands}
        onClose={() => {
          setPaletteOpen(false);
          searchButtonRef.current?.focus();
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------------- 사이드바 */

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-zinc-200 px-4">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600">
          <ShieldCheck className="h-5 w-5 text-white" aria-hidden />
        </span>
        <span
          className="min-w-0 truncate text-[17px] font-semibold tracking-tight text-zinc-900"
          style={DISPLAY_WIDE}
        >
          QUORUM
        </span>
        {onClose ? (
          <button
            type="button"
            aria-label="탐색 메뉴 닫기"
            onClick={onClose}
            className={cn(
              "ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
              FOCUS,
            )}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="px-3 py-3">
        <button
          type="button"
          className={cn(
            "flex h-11 w-full items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 text-left hover:bg-zinc-50",
            FOCUS,
          )}
        >
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded bg-zinc-100">
            <Building2 className="h-3.5 w-3.5 text-zinc-700" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm text-zinc-900">Nimbus Social</span>
            <span className="block truncate text-[11px] text-zinc-600">KR 운영 워크스페이스</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
        </button>
      </div>

      <nav
        aria-label={onClose ? "모바일 탐색" : "주요 탐색"}
        className="min-h-0 flex-1 overflow-y-auto px-3 pb-3"
      >
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-4">
            <p className="px-2 pb-1.5 text-[11px] uppercase tracking-[0.14em] text-zinc-500">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.key}>
                  <a
                    href="#queue-main"
                    aria-current={item.active ? "page" : undefined}
                    className={cn(
                      "flex h-10 items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors motion-reduce:transition-none",
                      FOCUS,
                      item.active
                        ? "bg-violet-50 font-medium text-violet-900"
                        : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900",
                    )}
                  >
                    <item.icon
                      className={cn("h-4 w-4 shrink-0", item.active ? "text-violet-700" : "text-zinc-500")}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.count !== null ? (
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-1.5 py-0.5 text-[11px] tabular-nums",
                          item.active ? "bg-violet-600 text-white" : "bg-zinc-100 text-zinc-700",
                        )}
                      >
                        {item.count}
                      </span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-zinc-200 p-3">
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-zinc-50",
            FOCUS,
          )}
        >
          <Avatar name="임세라" tint={0} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm text-zinc-900">임세라</span>
            <span className="block truncate text-[11px] text-zinc-600">시니어 모더레이터 · 팀 KR-2</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
        </button>
      </div>
    </>
  );
}

/* --------------------------------------------------------------- 카운터 */

function Counter({
  icon: Icon,
  label,
  value,
  unit,
  caption,
  trend,
  urgent,
}: {
  icon: typeof Inbox;
  label: string;
  value: number | string;
  unit: string;
  caption: string;
  trend?: number[];
  urgent?: boolean;
}) {
  return (
    <div className="col-span-6 min-w-0 sm:col-span-4 xl:col-span-2">
      <p className="flex items-center gap-1.5">
        <Icon
          className={cn("h-3.5 w-3.5 shrink-0", urgent ? "text-violet-700" : "text-zinc-500")}
          aria-hidden
        />
        <FieldLabel>{label}</FieldLabel>
      </p>
      <p className="mt-1.5 flex items-baseline gap-1.5">
        <span
          className={cn(
            "text-[22px] font-medium leading-none tabular-nums",
            urgent ? "text-violet-800" : "text-zinc-900",
          )}
        >
          {typeof value === "number" ? numberFormat.format(value) : value}
        </span>
        {unit ? <span className="text-xs text-zinc-500">{unit}</span> : null}
        {trend ? (
          <span className="ml-auto text-violet-500">
            <Sparkline values={trend} label="최근 7일 처리량 추이" />
          </span>
        ) : null}
      </p>
      <p className="mt-1 text-xs leading-5 text-zinc-600">{caption}</p>
    </div>
  );
}

function CompositionLegend({ swatch, label, value }: { swatch: string; label: string; value: number }) {
  return (
    <li className="flex items-center gap-1.5">
      <span aria-hidden className={cn("h-2 w-2 rounded-sm", swatch)} />
      {label} <span className="tabular-nums text-zinc-900">{value}</span>
    </li>
  );
}
