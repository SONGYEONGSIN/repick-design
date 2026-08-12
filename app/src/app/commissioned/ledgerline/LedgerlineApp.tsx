"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarClock,
  Landmark,
  Languages,
  PiggyBank,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";

import StreamFeed from "./StreamFeed";
import {
  ACCOUNTS,
  BASELINE,
  CATEGORY,
  METHOD,
  PERIODS,
  SCHEDULED,
  UI,
  accountOf,
  bucketsOf,
  byCategory,
  byDay,
  dateShort,
  formatDelta,
  formatMoney,
  formatNet,
  formatPct,
  periodOf,
  round2,
  totalsOf,
  txnsFor,
  type AccountId,
  type Bucket,
  type Group,
  type Lang,
  type PeriodId,
  type StreamFilter,
} from "./data";

const CHART_W = 720;
const CHART_H = 180;
const CHART_BASE = 90;
const CHART_ARM = 76;

const SHARE_TONE: readonly string[] = [
  "bg-rose-600",
  "bg-rose-500",
  "bg-rose-400",
  "bg-rose-300",
  "bg-zinc-500",
  "bg-zinc-400",
  "bg-zinc-300",
];

function AccountGlyph({ id, className }: { id: AccountId; className: string }) {
  if (id === "payroll") return <Users aria-hidden="true" className={className} />;
  if (id === "reserve") return <PiggyBank aria-hidden="true" className={className} />;
  return <Wallet aria-hidden="true" className={className} />;
}

function Figure({
  label,
  value,
  delta,
  basis,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  basis: string;
  tone: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">{label}</dt>
      <dd className="mt-1">
        <span
          className={`block text-2xl font-semibold tabular-nums md:text-[28px] ${tone}`}
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          {value}
        </span>
        <span className="mt-1 block text-xs font-normal text-zinc-600">
          <span
            className="font-medium text-zinc-900 tabular-nums"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            {delta}
          </span>{" "}
          {basis}
        </span>
      </dd>
    </div>
  );
}

function DivergingFlow({
  buckets,
  lang,
  max,
}: {
  buckets: Bucket[];
  lang: Lang;
  max: number;
}) {
  const slot = buckets.length > 0 ? CHART_W / buckets.length : CHART_W;
  const barW = round2(Math.min(slot * 0.46, 44));

  return (
    <div>
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        preserveAspectRatio="none"
        className="h-44 w-full"
      >
        <rect x="0" y={CHART_BASE - 0.5} width={CHART_W} height="1" className="fill-zinc-300" />
        {buckets.map((bucket, index) => {
          const x = round2(index * slot + (slot - barW) / 2);
          const inH = max > 0 ? round2((bucket.inCents / max) * CHART_ARM) : 0;
          const outH = max > 0 ? round2((bucket.outCents / max) * CHART_ARM) : 0;
          return (
            <g key={bucket.day}>
              {inH > 0 ? (
                <rect
                  x={x}
                  y={round2(CHART_BASE - 5 - inH)}
                  width={barW}
                  height={inH}
                  rx="2"
                  className="fill-zinc-800"
                />
              ) : null}
              {outH > 0 ? (
                <rect
                  x={x}
                  y={CHART_BASE + 5}
                  width={barW}
                  height={outH}
                  rx="2"
                  className="fill-rose-500"
                />
              ) : null}
            </g>
          );
        })}
      </svg>

      <div
        className="mt-2 grid gap-1"
        style={{ gridTemplateColumns: `repeat(${Math.max(buckets.length, 1)}, minmax(0, 1fr))` }}
      >
        {buckets.map((bucket) => (
          <span
            key={bucket.day}
            className="truncate text-center text-[10px] font-normal text-zinc-600"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            {dateShort(bucket.day, lang)}
          </span>
        ))}
      </div>

      <div className="relative">
        <ul className="sr-only">
          {buckets.map((bucket) => (
            <li key={bucket.day}>
              {dateShort(bucket.day, lang)} {UI.filterIn[lang]} {formatMoney(bucket.inCents)}{" "}
              {UI.filterOut[lang]} {formatMoney(bucket.outCents)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function RankedSources({ groups, total, lang }: { groups: Group[]; total: number; lang: Lang }) {
  return (
    <section
      aria-labelledby="ledgerline-sources"
      className="h-full rounded-2xl border border-zinc-200 bg-white p-4"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="ledgerline-sources" className="text-base font-semibold text-zinc-900">
          {UI.cameFrom[lang]}
        </h2>
        <ArrowDownLeft aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-700" />
      </div>
      <p className="mt-1 text-xs font-normal text-zinc-600">
        {UI.totalIn[lang]}{" "}
        <span
          className="font-medium tabular-nums text-zinc-900"
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          {formatMoney(total)}
        </span>
      </p>
      {groups.length === 0 ? (
        <p className="mt-4 text-sm font-normal text-zinc-600">{UI.empty[lang]}</p>
      ) : (
        <ol className="mt-4 space-y-3.5">
          {groups.map((group) => {
            const pct = total > 0 ? (group.cents / total) * 100 : 0;
            return (
              <li key={group.key} className="min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium text-zinc-900">
                    {group.label[lang]}
                  </span>
                  <span
                    className="shrink-0 whitespace-nowrap text-sm font-medium tabular-nums text-zinc-900"
                    style={{ fontFamily: "var(--font-display-mono)" }}
                  >
                    {formatMoney(group.cents)}
                  </span>
                </div>
                <div aria-hidden="true" className="mt-1.5 h-1.5 w-full rounded-full bg-zinc-100">
                  <div
                    className="h-1.5 rounded-full bg-zinc-800"
                    style={{ width: `${round2(pct)}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] font-normal text-zinc-600">
                  <span style={{ fontFamily: "var(--font-display-mono)" }}>{formatPct(pct)}</span>{" "}
                  {UI.share[lang]} · <span style={{ fontFamily: "var(--font-display-mono)" }}>{group.count}</span>{" "}
                  {UI.count[lang]}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function DestinationMeter({ groups, total, lang }: { groups: Group[]; total: number; lang: Lang }) {
  return (
    <section
      aria-labelledby="ledgerline-dests"
      className="h-full rounded-2xl border border-zinc-200 bg-white p-4"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="ledgerline-dests" className="text-base font-semibold text-zinc-900">
          {UI.wentTo[lang]}
        </h2>
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-rose-700" />
      </div>
      <p className="mt-1 text-xs font-normal text-zinc-600">
        {UI.totalOut[lang]}{" "}
        <span
          className="font-medium tabular-nums text-rose-700"
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          {formatMoney(total)}
        </span>
      </p>
      {groups.length === 0 ? (
        <p className="mt-4 text-sm font-normal text-zinc-600">{UI.empty[lang]}</p>
      ) : (
        <>
          <div aria-hidden="true" className="mt-3 flex h-2 w-full gap-0.5 overflow-hidden rounded-full">
            {groups.map((group, index) => (
              <span
                key={group.key}
                className={SHARE_TONE[index] ?? "bg-zinc-200"}
                style={{ width: `${round2(total > 0 ? (group.cents / total) * 100 : 0)}%` }}
              />
            ))}
          </div>
          <ul className="mt-3 space-y-2">
            {groups.map((group, index) => {
              const pct = total > 0 ? (group.cents / total) * 100 : 0;
              return (
                <li key={group.key} className="flex items-baseline gap-2">
                  <span
                    aria-hidden="true"
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${SHARE_TONE[index] ?? "bg-zinc-200"}`}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm font-normal text-zinc-900">
                    {group.label[lang]}
                  </span>
                  <span className="shrink-0 text-[11px] font-normal text-zinc-600">
                    <span style={{ fontFamily: "var(--font-display-mono)" }}>{formatPct(pct)}</span>
                  </span>
                  <span
                    className="w-24 shrink-0 whitespace-nowrap text-right text-sm font-medium tabular-nums text-zinc-900"
                    style={{ fontFamily: "var(--font-display-mono)" }}
                  >
                    {formatMoney(group.cents)}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}

export default function LedgerlineApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [period, setPeriod] = useState<PeriodId>("30d");
  const [account, setAccount] = useState<AccountId>("operating");
  const [filter, setFilter] = useState<StreamFilter>("all");

  const active = accountOf(account);
  const span = periodOf(period);
  const rows = txnsFor(account, period);
  const totals = totalsOf(rows);
  const baseline = BASELINE[account][period];
  const baselineNet = baseline.in - baseline.out;
  const buckets = bucketsOf(rows, period);
  const chartMax = Math.max(1, ...buckets.map((b) => Math.max(b.inCents, b.outCents)));
  const sources = byCategory(rows, "in");
  const destinations = byCategory(rows, "out");
  const visible = filter === "all" ? rows : rows.filter((row) => row.dir === filter);
  const dayGroups = byDay(visible);
  const upcoming = SCHEDULED.filter((item) => item.account === account);

  return (
    <div lang={lang} className="min-h-screen bg-zinc-50 font-normal text-zinc-900">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 md:px-8">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white">
            <Landmark aria-hidden="true" className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span
              className="block text-sm font-semibold uppercase tracking-[0.18em] text-zinc-900"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              Ledgerline
            </span>
            <span className="block text-[11px] font-normal text-zinc-600">
              {UI.wordmarkTag[lang]}
            </span>
          </span>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label={UI.period[lang]}
              className="flex items-center gap-1 rounded-full bg-zinc-100 p-1"
            >
              {PERIODS.map((item) => {
                const on = item.id === period;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setPeriod(item.id)}
                    className={`inline-flex h-11 items-center rounded-full px-4 text-sm font-medium tabular-nums transition-colors duration-150 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 ${
                      on ? "bg-rose-600 text-white" : "text-zinc-700 hover:bg-white"
                    }`}
                  >
                    {item.short[lang]}
                  </button>
                );
              })}
            </div>

            <div
              role="group"
              aria-label={UI.language[lang]}
              className="flex items-center gap-1 rounded-full bg-zinc-100 p-1"
            >
              <span className="flex h-11 w-9 items-center justify-center text-zinc-700">
                <Languages aria-hidden="true" className="h-4 w-4" />
              </span>
              {(["en", "ko"] as const).map((code) => {
                const on = code === lang;
                return (
                  <button
                    key={code}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setLang(code)}
                    className={`inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition-colors duration-150 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 ${
                      on ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-white"
                    }`}
                  >
                    {code === "en" ? "EN" : "KO"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] px-4 pb-16 md:px-8">
        <nav aria-label={UI.accounts[lang]} className="flex flex-wrap gap-2 pt-4">
          {ACCOUNTS.map((item) => {
            const on = item.id === account;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={on}
                onClick={() => setAccount(item.id)}
                className={`inline-flex h-11 min-w-0 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-150 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 ${
                  on
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400"
                }`}
              >
                <AccountGlyph id={item.id} className="h-4 w-4 shrink-0" />
                <span className="truncate font-medium">{item.name[lang]}</span>
                <span
                  className={`whitespace-nowrap text-xs font-normal tabular-nums ${
                    on ? "text-zinc-300" : "text-zinc-600"
                  }`}
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  ···· {item.last4}
                </span>
              </button>
            );
          })}
        </nav>

        <section
          aria-labelledby="ledgerline-title"
          className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 md:p-6"
        >
          <h1
            id="ledgerline-title"
            className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl"
          >
            {UI.pageTitle[lang]}
          </h1>

          {lang === "en" ? (
            <p className="mt-2 max-w-3xl text-sm font-normal leading-6 text-zinc-600">
              Over the {span.label.en}, the {active.name.en.toLowerCase()} account took in{" "}
              <span
                className="font-medium tabular-nums text-zinc-900"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                {formatMoney(totals.inCents)}
              </span>{" "}
              from {sources.length} sources and released{" "}
              <span
                className="font-medium tabular-nums text-rose-700"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                {formatMoney(totals.outCents)}
              </span>{" "}
              across {destinations.length} destinations.
            </p>
          ) : (
            <p className="mt-2 max-w-3xl text-sm font-normal leading-6 text-zinc-600">
              {span.label.ko} 동안 {active.name.ko}에 {sources.length}개 출처에서{" "}
              <span
                className="font-medium tabular-nums text-zinc-900"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                {formatMoney(totals.inCents)}
              </span>{" "}
              만큼 들어오고, {destinations.length}개 항목으로{" "}
              <span
                className="font-medium tabular-nums text-rose-700"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                {formatMoney(totals.outCents)}
              </span>{" "}
              만큼 나갔습니다.
            </p>
          )}

          <dl className="mt-5 flex flex-wrap items-start gap-x-10 gap-y-5 border-t border-zinc-200 pt-4">
            <Figure
              label={UI.moneyIn[lang]}
              value={formatMoney(totals.inCents)}
              delta={formatDelta(totals.inCents, baseline.in, lang)}
              basis={`${UI.versus[lang]} ${formatMoney(baseline.in)}`}
              tone="text-zinc-900"
            />
            <Figure
              label={UI.moneyOut[lang]}
              value={formatMoney(totals.outCents)}
              delta={formatDelta(totals.outCents, baseline.out, lang)}
              basis={`${UI.versus[lang]} ${formatMoney(baseline.out)}`}
              tone="text-rose-700"
            />
            <Figure
              label={UI.net[lang]}
              value={formatNet(totals.netCents)}
              delta={formatNet(totals.netCents - baselineNet)}
              basis={`${UI.versus[lang]} ${formatNet(baselineNet)}`}
              tone={totals.netCents >= 0 ? "text-zinc-900" : "text-rose-700"}
            />
          </dl>

          <div className="mt-6 border-t border-zinc-200 pt-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-sm font-medium text-zinc-900">{UI.chartTitle[lang]}</h2>
              <p className="flex flex-wrap items-center gap-4 text-[11px] font-normal text-zinc-600">
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-zinc-800" />
                  {UI.chartAbove[lang]}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
                  {UI.chartBelow[lang]}
                </span>
              </p>
            </div>
            <div className="mt-3">
              <DivergingFlow buckets={buckets} lang={lang} max={chartMax} />
            </div>
          </div>
        </section>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="order-2 min-w-0 lg:order-1 lg:col-span-4 xl:col-span-3">
            <RankedSources groups={sources} total={totals.inCents} lang={lang} />
          </div>

          <div className="order-1 min-w-0 lg:order-2 lg:col-span-8 xl:col-span-6">
            <StreamFeed
              lang={lang}
              filter={filter}
              onFilter={setFilter}
              groups={dayGroups}
              total={visible.length}
            />
          </div>

          <div className="order-3 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-3 xl:col-span-3 xl:grid-cols-1">
            <section
              aria-label={UI.holder[lang]}
              className="relative min-w-0 overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900 p-5 text-white"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 320 200"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
              >
                <defs>
                  <linearGradient id="ledgerline-card" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#18181b" />
                    <stop offset="0.6" stopColor="#27272a" />
                    <stop offset="1" stopColor="#881337" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="320" height="200" fill="url(#ledgerline-card)" />
                <path
                  d="M0 168 L320 108"
                  stroke="#f43f5e"
                  strokeOpacity="0.4"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M0 186 L320 132"
                  stroke="#fda4af"
                  strokeOpacity="0.25"
                  strokeWidth="1"
                  fill="none"
                />
                <circle cx="278" cy="44" r="26" fill="#f43f5e" fillOpacity="0.18" />
                <circle cx="248" cy="44" r="26" fill="#fafafa" fillOpacity="0.1" />
              </svg>
              <div className="relative">
                <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-300">
                  {UI.balance[lang]}
                </p>
                <p
                  className="mt-1 text-2xl font-semibold tabular-nums text-white"
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  {formatMoney(active.balance)}
                </p>
                <p className="mt-6 text-sm font-medium text-white">
                  {active.name[lang]}{" "}
                  <span className="font-normal text-zinc-300">{active.kind[lang]}</span>
                </p>
                <p
                  className="mt-0.5 text-xs font-normal tabular-nums text-zinc-300"
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  ···· ···· ···· {active.last4}
                </p>
              </div>
            </section>

            <DestinationMeter groups={destinations} total={totals.outCents} lang={lang} />

            <section
              aria-labelledby="ledgerline-scheduled"
              className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h2 id="ledgerline-scheduled" className="text-base font-semibold text-zinc-900">
                  {UI.scheduled[lang]}
                </h2>
                <CalendarClock aria-hidden="true" className="h-4 w-4 shrink-0 text-zinc-700" />
              </div>
              <ul className="mt-3 space-y-3">
                {upcoming.map((item) => (
                  <li key={item.id} className="flex items-baseline gap-3">
                    <span
                      className="w-12 shrink-0 whitespace-nowrap text-xs font-medium tabular-nums text-zinc-700"
                      style={{ fontFamily: "var(--font-display-mono)" }}
                    >
                      {dateShort(item.day, lang)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-normal text-zinc-900">
                        {item.party[lang]}
                      </span>
                      <span className="block truncate text-[11px] font-normal text-zinc-600">
                        {CATEGORY[item.cat][lang]} · {METHOD[item.method][lang]}
                      </span>
                    </span>
                    <span
                      className="shrink-0 whitespace-nowrap text-sm font-medium tabular-nums text-rose-700"
                      style={{ fontFamily: "var(--font-display-mono)" }}
                    >
                      -{formatMoney(item.cents)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
