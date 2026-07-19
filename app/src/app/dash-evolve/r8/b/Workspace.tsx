"use client";

import { ArrowDownRight, ArrowUpRight, Gauge, TrendingUp, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import AccountsTable, { type FilterId } from "./AccountsTable";
import ChatDock from "./ChatDock";
import CommandPalette from "./CommandPalette";
import RevenueChart from "./RevenueChart";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import {
  ACCOUNTS,
  INITIAL_THREAD,
  INSIGHT_CARDS,
  QUICK_REPLIES,
  REVENUE_TOTAL,
  WORKSPACES,
  accountById,
  churnRatePct,
  formatCount,
  formatPct,
  formatUsd,
  latestTotalMrr,
  mrrDeltaPct,
  netRevenueRetentionPct,
  timeForIndex,
  type ChartWindow,
  type ChatMessage,
  type CopilotAction,
  type RegionId,
} from "./data";
import { NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { Card, Sparkline } from "./ui";

const DESKTOP_DOCK_QUERY = "(min-width: 1280px)";
function subscribeDesktopDock(callback: () => void) {
  const mql = window.matchMedia(DESKTOP_DOCK_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getDesktopDockSnapshot() {
  return window.matchMedia(DESKTOP_DOCK_QUERY).matches;
}
function getDesktopDockServerSnapshot() {
  return false;
}

export default function Workspace() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [chatMobileOpen, setChatMobileOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<FilterId>("all");
  const [focusRegion, setFocusRegion] = useState<RegionId | null>(null);
  const [chartWindow, setChartWindow] = useState<ChartWindow>("full");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [thread, setThread] = useState<ChatMessage[]>(INITIAL_THREAD);

  /** xl(1280px) 이상에서만 도크가 상시 컬럼 — 그 아래는 시트 토글. 리사이즈에 반응(SSR 안전). */
  const isDesktopDock = useSyncExternalStore(subscribeDesktopDock, getDesktopDockSnapshot, getDesktopDockServerSnapshot);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const applyActions = useCallback((actions: CopilotAction[]) => {
    for (const action of actions) {
      if (action.type === "focus-region") setFocusRegion(action.region);
      else if (action.type === "filter-status") setStatusFilter(action.status);
      else if (action.type === "set-window") setChartWindow(action.window);
      else if (action.type === "select-account") {
        setSelectedAccountId(action.id);
        setStatusFilter("all");
        const acc = accountById(action.id);
        if (acc) setFocusRegion(acc.region);
      }
    }
  }, []);

  const handleQuickReply = useCallback(
    (id: string) => {
      const qr = QUICK_REPLIES.find((q) => q.id === id);
      if (!qr) return;
      applyActions(qr.actions);
      setThread((prev) => {
        const userMsg: ChatMessage = { id: `u-${prev.length}`, role: "user", text: qr.userText, time: timeForIndex(prev.length) };
        const assistantMsg: ChatMessage = {
          id: `a-${prev.length + 1}`,
          role: "assistant",
          text: qr.reply,
          time: timeForIndex(prev.length + 1),
        };
        return [...prev, userMsg, assistantMsg];
      });
    },
    [applyActions],
  );

  const handleInsightClick = useCallback(
    (id: string) => {
      const card = INSIGHT_CARDS.find((c) => c.id === id);
      if (!card) return;
      applyActions(card.actions);
      setThread((prev) => {
        const assistantMsg: ChatMessage = { id: `a-${prev.length + 1}`, role: "assistant", text: card.reply, time: timeForIndex(prev.length) };
        return [...prev, assistantMsg];
      });
    },
    [applyActions],
  );

  function revealAccount(id: string) {
    setSelectedAccountId(id);
    setStatusFilter("all");
    const acc = accountById(id);
    if (acc) setFocusRegion(acc.region);
  }

  function toggleFocusRegion(r: RegionId) {
    setFocusRegion((cur) => (cur === r ? null : r));
  }

  const heroDelta = mrrDeltaPct();
  const heroPositive = heroDelta >= 0;
  const activeCount = ACCOUNTS.length;
  const churn = churnRatePct();
  const nrr = netRevenueRetentionPct();
  const workspace = WORKSPACES[0];

  const selectedAccount = useMemo(() => (selectedAccountId ? accountById(selectedAccountId) : undefined), [selectedAccountId]);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onToggleChat={() => {
            if (isDesktopDock) setChatCollapsed((v) => !v);
            else setChatMobileOpen((v) => !v);
          }}
          chatVisible={isDesktopDock ? !chatCollapsed : chatMobileOpen}
        />

        <main id="main-content" className="min-w-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className={cx("text-xl font-semibold tracking-tight", TEXT_PRIMARY)}>매출 개요</h1>
                <p className={cx("mt-1 text-sm", TEXT_CAPTION)}>{workspace.name} · 지난 동기화 6분 전</p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 sm:gap-5">
              {/* 히어로 숫자 — KPI 4카드 가로줄 대신 히어로+보조지표로 변주 */}
              <Card className="col-span-12 min-w-0 lg:col-span-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>합산 MRR</p>
                    <p className={cx("mt-1 text-3xl font-semibold tracking-tight sm:text-4xl", NUM, TEXT_PRIMARY)}>
                      {formatUsd(latestTotalMrr())}
                    </p>
                    <p className={cx("mt-1.5 inline-flex items-center gap-1 text-sm font-medium", NUM, heroPositive ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300")}>
                      {heroPositive ? <ArrowUpRight size={15} aria-hidden="true" /> : <ArrowDownRight size={15} aria-hidden="true" />}
                      {formatPct(heroDelta)} 전주 대비
                    </p>
                  </div>
                  <div className="h-14 w-28 shrink-0 sm:h-16 sm:w-32">
                    <Sparkline values={REVENUE_TOTAL} stroke="stroke-blue-500 dark:stroke-blue-400" fill="fill-blue-500 dark:fill-blue-400" />
                  </div>
                </div>
              </Card>

              {/* 인라인 보조 지표 3종 — 균일 4카드 대신 한 카드 내 인라인 스탯 */}
              <Card className="col-span-12 min-w-0 lg:col-span-7">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <InlineStat
                    Icon={Users}
                    label="활성 계정"
                    value={formatCount(activeCount)}
                    caption="전 리전 합계"
                  />
                  <InlineStat
                    Icon={Gauge}
                    label="위험 비중"
                    value={`${churn.toFixed(1)}%`}
                    caption={`위험 계정 ${ACCOUNTS.filter((a) => a.status === "at-risk").length}곳`}
                    tone={churn > 20 ? "down" : "flat"}
                  />
                  <InlineStat
                    Icon={TrendingUp}
                    label="순 매출 유지율"
                    value={`${nrr.toFixed(1)}%`}
                    caption="상태 가중 파생값"
                    tone={nrr >= 100 ? "up" : "flat"}
                  />
                </div>
              </Card>

              {/* 크로스헤어 차트 — 풀폭, 8/4 조합이 아님 */}
              <Card className="col-span-12 min-w-0">
                <RevenueChart
                  window={chartWindow}
                  onWindowChange={setChartWindow}
                  focusRegion={focusRegion}
                  onToggleFocusRegion={toggleFocusRegion}
                  pulseRegion={selectedAccount?.region ?? null}
                />
              </Card>

              {/* 계정 테이블 — 확장형 상세 행으로 별도 상세 레일 없이 동기화 */}
              <div className="col-span-12 min-w-0">
                <AccountsTable
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  selectedId={selectedAccountId}
                  onSelect={setSelectedAccountId}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      <ChatDock
        thread={thread}
        onQuickReply={handleQuickReply}
        onInsightClick={handleInsightClick}
        collapsed={chatCollapsed}
        onToggleCollapse={() => setChatCollapsed((v) => !v)}
        mobileOpen={chatMobileOpen}
        onCloseMobile={() => setChatMobileOpen(false)}
      />

      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onSelectAccount={(id) => revealAccount(id)}
        />
      ) : null}
    </div>
  );
}

function InlineStat({
  Icon,
  label,
  value,
  caption,
  tone = "flat",
}: {
  Icon: typeof Users;
  label: string;
  value: string;
  caption: string;
  tone?: "up" | "down" | "flat";
}) {
  const toneText =
    tone === "up"
      ? "text-emerald-700 dark:text-emerald-300"
      : tone === "down"
        ? "text-rose-700 dark:text-rose-300"
        : TEXT_PRIMARY;
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-100 dark:bg-white/5">
        <Icon size={15} aria-hidden="true" className={TEXT_SECONDARY} />
      </span>
      <div className="min-w-0">
        <p className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>{label}</p>
        <p className={cx("mt-0.5 text-lg font-semibold tracking-tight", NUM, toneText)}>{value}</p>
        <p className={cx("truncate text-[11px]", TEXT_CAPTION)}>{caption}</p>
      </div>
    </div>
  );
}
