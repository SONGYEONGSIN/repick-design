"use client";

import { useEffect, useState } from "react";
import { Lightbulb, Plus, Target, TrendingDown, Wallet } from "lucide-react";

import { CashFlow } from "./cash-flow";
import { Sidebar, Topbar, type PrefKey } from "./chrome";
import { CardPanel, GoalsPanel, SpendingPanel, UpcomingPanel } from "./rail";
import { Transactions } from "./transactions";
import {
  FLOW,
  PERIODS,
  PREVIOUS,
  UI,
  deltaPct,
  filterTxns,
  formatMoney,
  formatPct,
  formatSigned,
  goalOf,
  goalPct,
  monthsLeft,
  periodOf,
  sortTxns,
  spendBreakdown,
  totalsOf,
  type CardId,
  type CategoryKey,
  type Lang,
  type PeriodId,
  type SortDir,
  type SortKey,
} from "./data";
import { DeltaChip, PANEL, RING, cx } from "./ui";

export default function VerdantDashboard() {
  const [lang, setLang] = useState<Lang>("en");
  const [period, setPeriod] = useState<PeriodId>("month");
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<CategoryKey | null>(null);
  const [goalId, setGoalId] = useState("safety");
  const [cardId, setCardId] = useState<CardId>("everyday");
  const [revealed, setRevealed] = useState(false);
  const [showAllRows, setShowAllRows] = useState(false);
  const [showAllCats, setShowAllCats] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [pref, setPref] = useState<PrefKey | null>(null);
  const [compact, setCompact] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(2);
  const [nav, setNav] = useState("verdant-overview");

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && (event.key === "f" || event.key === "F")) {
        event.preventDefault();
        const field = document.getElementById("verdant-search");
        if (field instanceof HTMLInputElement) field.focus();
      }
      if (event.key === "Escape") {
        setNotifOpen(false);
        setMenuOpen(false);
        setActiveBar(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const meta = periodOf(period);
  const buckets = FLOW[period];
  const totals = totalsOf(buckets);
  const before = PREVIOUS[period];
  const slices = spendBreakdown(period, totals.outCents);
  const leak = slices[0] ?? null;
  const rows = sortTxns(filterTxns(period, cat, query), sortKey, sortDir, lang);
  const goal = goalOf(goalId);
  const keptRate = totals.inCents === 0 ? 0 : (totals.netCents / totals.inCents) * 100;

  function pickPeriod(next: PeriodId) {
    setPeriod(next);
    setActiveBar(null);
    setShowAllRows(false);
  }

  function pickSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setSortDir(key === "party" ? "asc" : "desc");
  }

  function toggleRow(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleAll(ids: readonly string[], next: boolean) {
    setSelected((prev) =>
      next ? Array.from(new Set([...prev, ...ids])) : prev.filter((id) => !ids.includes(id)),
    );
  }

  function pickCat(key: CategoryKey) {
    setCat((prev) => (prev === key ? null : key));
    setShowAllRows(false);
    setExpanded(null);
  }

  const insights: { key: string; Icon: typeof Wallet; text: string }[] = [
    {
      key: "leak",
      Icon: TrendingDown,
      text:
        leak === null
          ? ""
          : lang === "ko"
            ? `${leak.label.ko}에 지출의 ${formatPct(leak.share)}가 나갔습니다. ${UI.biggestLine.ko}입니다.`
            : `${leak.label.en} took ${formatPct(leak.share)} of what you spent, ${UI.biggestLine.en}.`,
    },
    {
      key: "goal",
      Icon: Target,
      text:
        lang === "ko"
          ? `${goal.name.ko}은 ${formatPct(goalPct(goal))} 달성, 월 ${formatMoney(goal.monthlyCents)}씩이면 ${monthsLeft(goal)}개월 남았습니다.`
          : `${goal.name.en} is ${formatPct(goalPct(goal))} funded, ${monthsLeft(goal)} months to go at ${formatMoney(goal.monthlyCents)} a month.`,
    },
    {
      key: "kept",
      Icon: Wallet,
      text:
        lang === "ko"
          ? `번 돈 ${formatMoney(totals.inCents)} 중 ${formatSigned(totals.netCents)}를 남겼습니다. 수입의 ${formatPct(keptRate)}입니다.`
          : `You kept ${formatSigned(totals.netCents)} of the ${formatMoney(totals.inCents)} you earned, ${formatPct(keptRate)} of it.`,
    },
  ];

  return (
    <div lang={lang} className="min-h-dvh bg-zinc-950 text-zinc-100">
      <div className="flex min-h-dvh flex-col lg:flex-row">
        <Sidebar
          lang={lang}
          open={menuOpen}
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          active={nav}
          onNavigate={(id) => {
            setNav(id);
            setMenuOpen(false);
          }}
          pref={pref}
          onPref={(key) => setPref(pref === key ? null : key)}
          compact={compact}
          onCompact={(next) => setCompact(next)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            lang={lang}
            onLang={(next) => setLang(next)}
            query={query}
            onQuery={(next) => {
              setQuery(next);
              setShowAllRows(false);
            }}
            menuOpen={menuOpen}
            onMenu={() => setMenuOpen(!menuOpen)}
            insightsOpen={insightsOpen}
            onInsights={() => setInsightsOpen(!insightsOpen)}
            notifOpen={notifOpen}
            onNotif={() => setNotifOpen(!notifOpen)}
            unread={unread}
            onReadAll={() => setUnread(0)}
          />

          <main className="min-w-0 flex-1 px-4 pt-6 pb-16 lg:px-6">
            <section id="verdant-overview" aria-labelledby="verdant-title" className="scroll-mt-24">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="min-w-0">
                  <h1
                    id="verdant-title"
                    className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl"
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                  >
                    {UI.title[lang]}
                  </h1>
                  <p className="mt-1 text-sm text-zinc-400">
                    {`${UI.subtitle[lang]} · ${meta.span[lang]}`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    role="group"
                    aria-label={UI.periodGroup[lang]}
                    className="flex overflow-hidden rounded-full border border-zinc-800 bg-zinc-900"
                  >
                    {PERIODS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => pickPeriod(item.id)}
                        aria-pressed={item.id === period}
                        className={cx(
                          "min-h-11 px-4 text-xs motion-safe:transition-colors",
                          item.id === period
                            ? "bg-lime-300 font-medium text-zinc-950"
                            : "text-zinc-400 hover:text-zinc-100",
                          RING,
                        )}
                      >
                        {item.short[lang]}
                      </button>
                    ))}
                  </div>
                  <a
                    href="#verdant-transactions"
                    onClick={() => setNav("verdant-transactions")}
                    className={cx(
                      "inline-flex min-h-11 items-center gap-2 rounded-full bg-lime-300 px-5 text-sm font-medium text-zinc-950 motion-safe:transition-colors hover:bg-lime-200",
                      RING,
                    )}
                  >
                    <Plus className="size-4" aria-hidden="true" />
                    {UI.addTxn[lang]}
                  </a>
                </div>
              </div>

              <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="min-w-0 rounded-2xl bg-lime-300 p-4 text-zinc-950 sm:p-5">
                  <dt className="text-sm">{UI.moneyIn[lang]}</dt>
                  <dd
                    className="mt-2 text-3xl tracking-tight tabular-nums"
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                  >
                    {formatMoney(totals.inCents)}
                  </dd>
                  <dd className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span>{meta.vs[lang]}</span>
                    <DeltaChip
                      pct={deltaPct(totals.inCents, before.inCents)}
                      goodWhenUp
                      onLime
                    />
                  </dd>
                </div>

                <div className={cx(PANEL, "min-w-0 p-4 sm:p-5")}>
                  <dt className="text-sm text-zinc-400">{UI.moneyOut[lang]}</dt>
                  <dd
                    className="mt-2 text-3xl tracking-tight text-zinc-50 tabular-nums"
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                  >
                    {formatMoney(totals.outCents)}
                  </dd>
                  <dd className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                    <span>{meta.vs[lang]}</span>
                    <DeltaChip
                      pct={deltaPct(totals.outCents, before.outCents)}
                      goodWhenUp={false}
                    />
                  </dd>
                </div>

                <div className={cx(PANEL, "min-w-0 p-4 sm:p-5")}>
                  <dt className="text-sm text-zinc-400">{UI.kept[lang]}</dt>
                  <dd
                    className={cx(
                      "mt-2 text-3xl tracking-tight tabular-nums",
                      totals.netCents >= 0 ? "text-lime-300" : "text-zinc-50",
                    )}
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                  >
                    {formatSigned(totals.netCents)}
                  </dd>
                  <dd className="mt-3 text-xs text-zinc-400 tabular-nums">
                    {`${formatPct(keptRate)} ${UI.keptNote[lang]} · ${formatSigned(totals.netCents - before.netCents)} ${meta.vs[lang]}`}
                  </dd>
                </div>
              </dl>
            </section>

            <section
              id="verdant-insights"
              aria-labelledby="verdant-insights-h"
              className="mt-4 scroll-mt-24 rounded-2xl border border-lime-300/40 bg-lime-300/5 p-4 sm:p-5"
            >
              <h2
                id="verdant-insights-h"
                className="flex items-center gap-2 text-sm font-semibold tracking-wide text-lime-300"
              >
                <Lightbulb className="size-4" aria-hidden="true" />
                {UI.insights[lang]}
              </h2>
              <div id="verdant-insights-body">
                {insightsOpen ? (
                  <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {insights.map((item) => (
                      <li key={item.key} className="flex min-w-0 items-start gap-2.5">
                        <item.Icon className="mt-0.5 size-4 shrink-0 text-lime-300" aria-hidden="true" />
                        <span className="min-w-0 text-sm text-zinc-100">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-zinc-300 tabular-nums">
                    {`${leak === null ? "" : `${leak.label[lang]} ${formatPct(leak.share)} · `}${goal.name[lang]} ${formatPct(goalPct(goal))} · ${UI.kept[lang]} ${formatSigned(totals.netCents)}`}
                  </p>
                )}
              </div>
            </section>

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
              <div className="flex min-w-0 flex-col gap-4">
                <CashFlow
                  lang={lang}
                  period={period}
                  buckets={buckets}
                  totals={totals}
                  active={activeBar}
                  onActive={(index) => setActiveBar(index)}
                />
                <Transactions
                  lang={lang}
                  rows={rows}
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={pickSort}
                  selected={selected}
                  onToggleRow={toggleRow}
                  onToggleAll={toggleAll}
                  expanded={expanded}
                  onExpand={(id) => setExpanded(id)}
                  compact={compact}
                  showAll={showAllRows}
                  onShowAll={(next) => setShowAllRows(next)}
                  catFilter={cat}
                  onClearCat={() => setCat(null)}
                />
              </div>

              <div className="flex min-w-0 flex-col gap-4">
                <CardPanel
                  lang={lang}
                  cardId={cardId}
                  onCard={(id) => setCardId(id)}
                  revealed={revealed}
                  onReveal={() => setRevealed(!revealed)}
                  outCents={totals.outCents}
                />
                <GoalsPanel
                  lang={lang}
                  netCents={totals.netCents}
                  periodLabel={meta.label[lang]}
                  goalId={goalId}
                  onGoal={(id) => setGoalId(id)}
                />
                <SpendingPanel
                  lang={lang}
                  slices={slices}
                  outCents={totals.outCents}
                  activeCat={cat}
                  onCat={pickCat}
                  showAllCats={showAllCats}
                  onShowAllCats={(next) => setShowAllCats(next)}
                />
                <UpcomingPanel lang={lang} netCents={totals.netCents} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
