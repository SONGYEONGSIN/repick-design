"use client";

import { ArrowDownLeft, ArrowDownRight, ArrowLeftRight, ArrowUpRight, Minus } from "lucide-react";

import {
  UI,
  formatDelta,
  formatMoney,
  periodOf,
  type Account,
  type Lang,
  type PeriodId,
  type StreamFilter,
  type Totals,
} from "./data";
import { FOCUS_DARK, SHELL, TREND_TEXT_DARK, trendOf } from "./shell";

type Props = {
  lang: Lang;
  account: Account;
  period: PeriodId;
  totals: Totals;
  baseline: { in: number; out: number };
  stream: StreamFilter;
  onStream: (next: StreamFilter) => void;
};

export default function HeroBand({
  lang,
  account,
  period,
  totals,
  baseline,
  stream,
  onStream,
}: Props) {
  const trend = trendOf(totals.inCents, baseline.in);
  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;

  const choices: { id: StreamFilter; label: string; icon: typeof ArrowLeftRight }[] = [
    { id: "all", label: SHELL.allMovement[lang], icon: ArrowLeftRight },
    { id: "in", label: UI.moneyIn[lang], icon: ArrowDownLeft },
    { id: "out", label: UI.moneyOut[lang], icon: ArrowUpRight },
  ];

  return (
    <section
      id="overview"
      className="relative isolate overflow-hidden rounded-2xl bg-teal-900 px-5 py-6 md:px-8 md:py-7"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 420 160"
        preserveAspectRatio="xMaxYMid slice"
        className="pointer-events-none absolute inset-y-0 right-0 -z-10 h-full w-2/3"
      >
        <g className="stroke-white/10" fill="none" strokeWidth="14">
          <rect x="250" y="-40" width="120" height="230" rx="60" transform="rotate(-24 310 75)" />
          <rect x="330" y="-10" width="120" height="230" rx="60" transform="rotate(-24 390 105)" />
          <rect x="180" y="10" width="120" height="230" rx="60" transform="rotate(-24 240 125)" />
        </g>
      </svg>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-sm font-medium text-teal-100">
            {UI.balance[lang]}
            <span className="text-teal-200/80"> · {account.name[lang]} ····{account.last4}</span>
          </h1>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p
              style={{ fontFamily: "var(--font-display-grotesk)" }}
              className="text-4xl font-medium tracking-tight text-white tabular-nums md:text-5xl"
            >
              {formatMoney(account.balance)}
            </p>
            <p className={`inline-flex items-center gap-1 text-sm ${TREND_TEXT_DARK[trend]}`}>
              <span
                style={{ fontFamily: "var(--font-display-grotesk)" }}
                className="font-medium tabular-nums"
              >
                {formatDelta(totals.inCents, baseline.in, lang)}
              </span>
              <TrendIcon size={16} strokeWidth={2} aria-hidden="true" />
              <span className="text-teal-100">
                {UI.moneyIn[lang]} {UI.versus[lang]}
              </span>
            </p>
          </div>
          <p className="mt-1 text-xs text-teal-200">
            {periodOf(period).label[lang]} · {totals.inCount + totals.outCount} {UI.count[lang]}
          </p>
        </div>

        <div
          role="group"
          aria-label={UI.filterGroup[lang]}
          className="flex flex-wrap gap-2 lg:shrink-0"
        >
          {choices.map((choice) => {
            const on = choice.id === stream;
            return (
              <button
                key={choice.id}
                type="button"
                aria-pressed={on}
                onClick={() => onStream(choice.id)}
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm transition-colors motion-reduce:transition-none ${FOCUS_DARK} ${
                  on
                    ? "bg-emerald-500 font-medium text-emerald-950"
                    : "bg-white/10 text-white ring-1 ring-white/15 ring-inset hover:bg-white/20"
                }`}
              >
                <choice.icon size={16} strokeWidth={2} aria-hidden="true" />
                {choice.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
