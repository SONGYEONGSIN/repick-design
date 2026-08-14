"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Bell,
  Clock,
  Languages,
  Link2,
  RotateCcw,
  Search,
  Target,
  TrendingUp,
  Wrench,
  X,
  ZapOff,
} from "lucide-react";

import { AreaChart, MiniBars } from "./charts";
import { COPY, type Dict } from "./copy";
import { AudiencePanel, DeltaTag, FlowPanel, LinkTable } from "./panels";
import {
  PEAK_RATIO,
  PERIODS,
  PERIOD_IDS,
  REPORT_STAMP,
  SEND_RATIO,
  TODOS,
  fmtInt,
  type Lang,
  type PeriodId,
  type Severity,
  type TodoId,
  type TodoStatus,
} from "./data";

const SEV_STYLE: Record<Severity, string> = {
  critical: "border-red-200 bg-red-50 text-red-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  opportunity: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const SEV_ICON: Record<Severity, typeof ZapOff> = {
  critical: ZapOff,
  warning: Clock,
  opportunity: TrendingUp,
};

function todoText(t: Dict, id: TodoId) {
  const items = t.todo.items;
  if (id === "broken") return items.broken;
  if (id === "mobile") return items.mobile;
  return {
    title: items.timing.title(PEAK_RATIO),
    evidence: items.timing.evidence(PEAK_RATIO, SEND_RATIO),
    barsNote: items.timing.barsNote,
    action: items.timing.action,
  };
}

const CTRL =
  "inline-flex h-11 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900";

export default function HoplineDashboard() {
  // 기본은 영문이다. 갤러리 등재 작품은 `page-brief-repo` §1의 "글로벌 벤치마크 정합"이 적용되고,
  // 그 근거는 카탈로그가 Linear·Stripe와 나란히 비교된다는 것이다 — 기본 화면이 영문이어야 비교가
  // 성립한다. 한국어는 토글로 남아 기능이 죽지 않고, 한 화면 혼용은 여전히 0이다(2026-08-12 등재 판단).
  const [lang, setLang] = useState<Lang>("en");
  const [periodId, setPeriodId] = useState<PeriodId>("7d");
  const [focus, setFocus] = useState<TodoId | null>(null);
  const [status, setStatus] = useState<Record<TodoId, TodoStatus>>({
    broken: "open",
    mobile: "open",
    timing: "open",
  });

  const t = COPY[lang];
  const period = PERIODS[periodId];
  const focused = TODOS.find((item) => item.id === focus);
  const markerIndex = focused ? period.labels.indexOf(focused.marker) : -1;
  const handled = TODOS.filter((item) => status[item.id] !== "open").length;

  const setTodo = (id: TodoId, next: TodoStatus) => {
    setStatus((prev) => ({ ...prev, [id]: next }));
    if (next !== "open" && focus === id) setFocus(null);
  };

  return (
    <div lang={lang} className="min-h-screen bg-zinc-50 font-normal text-zinc-900">
      <a
        href="#hopline-todo-section"
        className="sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-4 focus-visible:z-30 focus-visible:rounded-lg focus-visible:bg-zinc-900 focus-visible:px-3 focus-visible:py-2 focus-visible:text-sm focus-visible:text-white focus-visible:not-sr-only"
      >
        {t.skipToWork}
      </a>

      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="flex w-full flex-wrap items-center gap-2 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-600">
              <Link2 className="h-4.5 w-4.5 text-white" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span
                className="block text-base leading-tight font-semibold tracking-tight text-zinc-900"
                style={{ fontFamily: "var(--font-display-mono)"}}
              >
                {t.brand}
              </span>
              <span className="block truncate text-[11px] leading-tight text-zinc-500">
                {t.workspace}
              </span>
            </span>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={`${CTRL} w-full border border-zinc-200 bg-white px-3 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 sm:w-56`}
            >
              <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{t.header.search}</span>
              <span
                className="ml-auto hidden rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[11px] text-zinc-600 sm:block"
                style={{ fontFamily: "var(--font-display-mono)"}}
              >
                {t.header.searchKey}
              </span>
            </button>

            <div
              className="inline-flex rounded-lg border border-zinc-200 bg-white"
              role="group"
              aria-label={t.header.period}
            >
              {PERIOD_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={periodId === id}
                  onClick={() => setPeriodId(id)}
                  className={`${CTRL} px-3 ${
                    periodId === id
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  {t.periods[id]}
                </button>
              ))}
            </div>

            <div
              className="inline-flex items-center rounded-lg border border-zinc-200 bg-white"
              role="group"
              aria-label={t.header.language}
            >
              <Languages
                className="ml-2.5 h-4 w-4 shrink-0 text-zinc-500"
                aria-hidden="true"
              />
              {(["ko", "en"] as const).map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={lang === id}
                  onClick={() => setLang(id)}
                  className={`${CTRL} px-2.5 ${
                    lang === id
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  <span style={{ fontFamily: "var(--font-display-mono)"}}>
                    {id === "ko" ? t.header.langKo : t.header.langEn}
                  </span>
                  <span className="sr-only">
                    {id === "ko" ? t.header.langKoName : t.header.langEnName}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-label={t.header.notifications}
              className={`${CTRL} relative w-11 border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900`}
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-orange-600" />
            </button>

            <button
              type="button"
              aria-label={t.header.account}
              className={`${CTRL} w-11 border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300`}
              style={{ fontFamily: "var(--font-display-mono)"}}
            >
              {t.header.accountInitials}
            </button>
          </div>
        </div>
      </header>

      <main className="w-full px-4 pt-8 sm:px-6">
        {/* 2 — reading band */}
        <section aria-labelledby="hopline-band">
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-4">
              <h1
                id="hopline-band"
                className="text-2xl font-semibold tracking-tight text-zinc-900"
              >
                {t.band.h1}
              </h1>
              <p className="mt-2 text-sm text-zinc-600">{t.band.lede}</p>
              <p className="mt-6 text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
                {t.band.totalLabel}
              </p>
              <p
                className="mt-1 text-5xl leading-none font-semibold tabular-nums text-zinc-900"
                style={{ fontFamily: "var(--font-display-mono)"}}
              >
                {fmtInt(period.total)}
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-2">
                <DeltaTag value={period.deltaPct} t={t} />
                <span className="text-xs text-zinc-500">{t.band.vsPrev}</span>
              </p>
              <p className="mt-4 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
                {t.header.updated}{" "}
                <span className="tabular-nums" style={{ fontFamily: "var(--font-display-mono)"}}>
                  {REPORT_STAMP}
                </span>
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-sm font-medium text-zinc-900">
                  {t.band.chartTitle}
                </h2>
                <p className="text-xs text-zinc-500">{t.band.chartHelp}</p>
              </div>
              <div className="mt-4">
                <AreaChart
                  values={period.values}
                  labels={period.labels}
                  markerIndex={markerIndex}
                  srCaption={t.band.srCaption}
                  srDate={t.band.srDate}
                  srValue={t.band.srValue}
                  format={fmtInt}
                />
              </div>
              <div className="mt-3 min-h-10">
                {focused && markerIndex >= 0 ? (
                  <p className="flex flex-wrap items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-xs text-zinc-700">
                    <Target
                      className="h-3.5 w-3.5 shrink-0 text-zinc-600"
                      aria-hidden="true"
                    />
                    <span className="font-medium">{t.band.markerPrefix}</span>
                    <span
                      className="tabular-nums"
                      style={{ fontFamily: "var(--font-display-mono)"}}
                    >
                      {focused.marker}
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {todoText(t, focused.id).title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFocus(null)}
                      className="rounded font-medium text-zinc-700 underline underline-offset-2 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                    >
                      {t.band.clearMarker}
                    </button>
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                id: "unique",
                label: t.band.uniqueLabel,
                value: fmtInt(period.unique),
                delta: period.uniqueDeltaPct,
                read: t.band.uniqueRead,
              },
              {
                id: "broken",
                label: t.band.brokenLabel,
                value: fmtInt(period.brokenClicks),
                delta: period.brokenDeltaPct,
                read: t.band.brokenRead,
              },
            ].map((kpi) => (
              <li
                key={kpi.id}
                className="min-w-0 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <p className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
                  {kpi.label}
                </p>
                <p className="mt-2 flex flex-wrap items-baseline gap-3">
                  <span
                    className="text-2xl font-semibold tabular-nums text-zinc-900"
                    style={{ fontFamily: "var(--font-display-mono)"}}
                  >
                    {kpi.value}
                  </span>
                  <DeltaTag value={kpi.delta} t={t} className="text-xs" />
                </p>
                <p className="mt-2 text-xs text-zinc-600">
                  <span className="font-medium text-zinc-700">
                    {t.band.read}:
                  </span>{" "}
                  {kpi.read}
                </p>
              </li>
            ))}
            <li className="min-w-0 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
                {t.band.activeLabel}
              </p>
              <p className="mt-2 flex flex-wrap items-baseline gap-3">
                <span
                  className="text-2xl font-semibold tabular-nums text-zinc-900"
                  style={{ fontFamily: "var(--font-display-mono)"}}
                >
                  {fmtInt(period.activeLinks)}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="tabular-nums" style={{ fontFamily: "var(--font-display-mono)"}}>
                    {`+${period.activeDelta}`}
                  </span>
                  <span className="sr-only">{t.common.up}</span>
                </span>
              </p>
              <p className="mt-2 text-xs text-zinc-600">
                <span className="font-medium text-zinc-700">{t.band.read}:</span>{" "}
                {t.band.activeRead}
              </p>
            </li>
          </ul>
        </section>

        {/* 3 — do this */}
        <section
          id="hopline-todo-section"
          aria-labelledby="hopline-todo"
          className="mt-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h2
                id="hopline-todo"
                className="text-lg font-semibold tracking-tight text-zinc-900"
              >
                {t.todo.h2}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-zinc-600">
                {t.todo.lede}
              </p>
            </div>
            <p className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
              {t.todo.counter(handled, TODOS.length)}
            </p>
          </div>

          <ol className="mt-4 grid gap-4 lg:grid-cols-3">
            {TODOS.map((todo, index) => {
              const copy = todoText(t, todo.id);
              const state = status[todo.id];
              const SevIcon = SEV_ICON[todo.severity];
              const on = focus === todo.id;

              if (state !== "open") {
                const note =
                  state === "queued"
                    ? t.todo.queuedNote
                    : state === "snoozed"
                      ? t.todo.snoozedNote
                      : t.todo.dismissedNote;
                return (
                  <li
                    key={todo.id}
                    className="flex min-w-0 flex-col rounded-xl border border-dashed border-zinc-300 bg-white p-5"
                  >
                    <p className="text-sm font-medium text-zinc-700">
                      {copy.title}
                    </p>
                    <p className="mt-2 text-xs text-zinc-600">{note}</p>
                    <button
                      type="button"
                      onClick={() => setTodo(todo.id, "open")}
                      className="mt-auto inline-flex items-center gap-1.5 self-start rounded-lg pt-4 text-xs font-medium text-zinc-700 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      {t.todo.undo}
                    </button>
                  </li>
                );
              }

              return (
                <li
                  key={todo.id}
                  className="flex min-w-0 flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-medium tabular-nums text-zinc-500"
                      style={{ fontFamily: "var(--font-display-mono)"}}
                    >
                      {`0${index + 1}`}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${SEV_STYLE[todo.severity]}`}
                    >
                      <SevIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
                      {t.todo.severity[todo.severity]}
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm leading-snug font-medium text-zinc-900">
                    {copy.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                    <span className="font-medium text-zinc-700">
                      {t.todo.evidence}:
                    </span>{" "}
                    {copy.evidence}
                  </p>

                  <div className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50 p-3">
                    <MiniBars values={todo.bars} highlight={todo.highlight} />
                    <p className="mt-2 text-[11px] text-zinc-600">
                      {copy.barsNote}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setTodo(todo.id, "queued")}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-orange-700 px-3.5 text-sm font-medium text-white transition-colors motion-reduce:transition-none hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
                    >
                      <Wrench className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {copy.action}
                    </button>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setFocus(on ? null : todo.id)}
                      className={`inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${
                        on
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
                      }`}
                    >
                      <Target className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {on ? t.todo.hideOnChart : t.todo.showOnChart}
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setTodo(todo.id, "snoozed")}
                      className="inline-flex items-center gap-1.5 rounded text-xs font-medium text-zinc-600 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                    >
                      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {t.todo.snooze}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTodo(todo.id, "dismissed")}
                      className="inline-flex items-center gap-1.5 rounded text-xs font-medium text-zinc-600 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                    >
                      <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {t.todo.dismiss}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <AudiencePanel t={t} />
        <FlowPanel t={t} period={period} />
        <LinkTable t={t} period={period} />
      </main>
    </div>
  );
}
