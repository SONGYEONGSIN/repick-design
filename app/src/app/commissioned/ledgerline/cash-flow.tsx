"use client";

import { ArrowDownLeft, ArrowDownRight, ArrowUpDown, ArrowUpRight, Minus } from "lucide-react";

import {
  UI,
  bucketsOf,
  dateShort,
  formatDelta,
  formatMoney,
  periodOf,
  round2,
  type Bucket,
  type Lang,
  type PeriodId,
  type StreamFilter,
  type Totals,
  type Txn,
} from "./data";
import { CARD, FOCUS, SHELL, TREND_TEXT, compactMoney, trendOf } from "./shell";
import type { Grain } from "./dashboard";

type Props = {
  lang: Lang;
  rows: readonly Txn[];
  period: PeriodId;
  totals: Totals;
  baseline: { in: number; out: number };
  stream: StreamFilter;
  grain: Grain;
  onGrain: (next: Grain) => void;
};

function dailyBuckets(rows: readonly Txn[], days: number): Bucket[] {
  const list: Bucket[] = [];
  for (let i = 0; i < days; i += 1) {
    const day = days - 1 - i;
    let inCents = 0;
    let outCents = 0;
    for (const row of rows) {
      if (row.day !== day) continue;
      if (row.dir === "in") inCents += row.cents;
      else outCents += row.cents;
    }
    list.push({ day, span: 1, inCents, outCents });
  }
  return list;
}

function barHeight(value: number, max: number): string {
  if (value <= 0) return "0%";
  return `${round2(Math.max(3, (value / max) * 100))}%`;
}

export default function CashFlow({
  lang,
  rows,
  period,
  totals,
  baseline,
  stream,
  grain,
  onGrain,
}: Props) {
  const days = periodOf(period).days;
  const buckets = grain === "daily" ? dailyBuckets(rows, days) : bucketsOf(rows, period);
  const maxIn = Math.max(1, ...buckets.map((b) => b.inCents));
  const maxOut = Math.max(1, ...buckets.map((b) => b.outCents));
  const last = buckets.length - 1;
  const ticks = [0, Math.floor(last / 3), Math.floor((last * 2) / 3), last].filter(
    (value, index, all) => all.indexOf(value) === index,
  );

  const inTrend = trendOf(totals.inCents, baseline.in);
  const outTrend = trendOf(totals.outCents, baseline.out);
  const InIcon = inTrend === "up" ? ArrowUpRight : inTrend === "down" ? ArrowDownRight : Minus;
  const OutIcon = outTrend === "up" ? ArrowUpRight : outTrend === "down" ? ArrowDownRight : Minus;

  const summary = `${SHELL.chartSummary[lang]} ${SHELL.highestIn[lang]} ${compactMoney(maxIn)}. ${SHELL.highestOut[lang]} ${compactMoney(maxOut)}.`;

  const grains: { id: Grain; label: string }[] = [
    { id: "grouped", label: SHELL.grouped[lang] },
    { id: "daily", label: SHELL.daily[lang] },
  ];

  return (
    <section id="cash-flow" aria-labelledby="lg-flow-heading" className={`${CARD} px-4 py-5 md:px-6`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="lg-flow-heading"
          className="inline-flex items-center gap-2 text-base font-medium text-zinc-900"
        >
          <ArrowUpDown size={18} strokeWidth={1.75} aria-hidden="true" className="text-emerald-600" />
          {SHELL.cashFlow[lang]}
        </h2>
        <div role="group" aria-label={SHELL.grain[lang]} className="flex gap-1 rounded-xl bg-zinc-100 p-1">
          {grains.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={grain === item.id}
              onClick={() => onGrain(item.id)}
              className={`h-11 rounded-lg px-4 text-sm transition-colors motion-reduce:transition-none ${FOCUS} ${
                grain === item.id
                  ? "bg-white font-medium text-zinc-900 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_248px]">
        <figure className="m-0 min-w-0">
          <div className="flex gap-3">
            <div
              style={{ fontFamily: "var(--font-display-grotesk)" }}
              className="flex h-56 w-14 shrink-0 flex-col justify-between text-[11px] text-zinc-600 tabular-nums"
            >
              <span>{compactMoney(maxIn)}</span>
              <span>$0</span>
              <span>{compactMoney(maxOut)}</span>
            </div>

            <div className="relative min-w-0 flex-1">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex justify-between">
                <span className="block w-px" />
                <span className="block w-px border-l border-dashed border-zinc-200" />
                <span className="block w-px border-l border-dashed border-zinc-200" />
                <span className="block w-px border-l border-dashed border-zinc-200" />
                <span className="block w-px" />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-zinc-200"
              />
              <div
                role="img"
                aria-label={summary}
                className={`flex h-56 items-stretch ${buckets.length > 20 ? "gap-px" : "gap-1.5"}`}
              >
                {buckets.map((bucket) => (
                  <div key={bucket.day} className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-1 items-end">
                      <div
                        style={{ height: barHeight(bucket.inCents, maxIn) }}
                        className={`w-full rounded-t-[3px] bg-teal-800 transition-opacity motion-reduce:transition-none ${
                          stream === "out" ? "opacity-20" : "opacity-100"
                        }`}
                      />
                    </div>
                    <div className="flex flex-1 items-start">
                      <div
                        style={{ height: barHeight(bucket.outCents, maxOut) }}
                        className={`w-full rounded-b-[3px] bg-emerald-500 transition-opacity motion-reduce:transition-none ${
                          stream === "in" ? "opacity-20" : "opacity-100"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{ fontFamily: "var(--font-display-grotesk)" }}
            className="mt-2 flex justify-between pl-[68px] text-[11px] text-zinc-600 tabular-nums"
          >
            {ticks.map((index) => (
              <span key={index}>{dateShort(buckets[index]?.day ?? 0, lang)}</span>
            ))}
          </div>

          <figcaption className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-zinc-600">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="block h-2.5 w-2.5 rounded-sm bg-teal-800" />
              {UI.chartAbove[lang]}
            </span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="block h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              {UI.chartBelow[lang]}
            </span>
          </figcaption>
        </figure>

        <div className="flex flex-col gap-5 lg:border-l lg:border-zinc-200 lg:pl-6">
          <div className="flex min-w-0 items-start gap-3">
            <span
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal-900 text-white"
            >
              <ArrowDownLeft size={18} strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-zinc-600">{UI.moneyIn[lang]}</h3>
              <p
                style={{ fontFamily: "var(--font-display-grotesk)" }}
                className="mt-0.5 text-2xl font-medium tracking-tight text-zinc-900 tabular-nums"
              >
                {formatMoney(totals.inCents)}
              </p>
              <p className={`mt-1 inline-flex items-center gap-1 text-xs ${TREND_TEXT[inTrend]}`}>
                <span
                  style={{ fontFamily: "var(--font-display-grotesk)" }}
                  className="font-medium tabular-nums"
                >
                  {formatDelta(totals.inCents, baseline.in, lang)}
                </span>
                <InIcon size={14} strokeWidth={2} aria-hidden="true" />
                <span className="text-zinc-600">{UI.versus[lang]}</span>
              </p>
            </div>
          </div>

          <div className="border-t border-zinc-200" />

          <div className="flex min-w-0 items-start gap-3">
            <span
              aria-hidden="true"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500 text-emerald-950"
            >
              <ArrowUpRight size={18} strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-zinc-600">{UI.moneyOut[lang]}</h3>
              <p
                style={{ fontFamily: "var(--font-display-grotesk)" }}
                className="mt-0.5 text-2xl font-medium tracking-tight text-zinc-900 tabular-nums"
              >
                {formatMoney(totals.outCents)}
              </p>
              <p className={`mt-1 inline-flex items-center gap-1 text-xs ${TREND_TEXT[outTrend]}`}>
                <span
                  style={{ fontFamily: "var(--font-display-grotesk)" }}
                  className="font-medium tabular-nums"
                >
                  {formatDelta(totals.outCents, baseline.out, lang)}
                </span>
                <OutIcon size={14} strokeWidth={2} aria-hidden="true" />
                <span className="text-zinc-600">{UI.versus[lang]}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
