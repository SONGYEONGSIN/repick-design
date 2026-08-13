"use client";

import { useState } from "react";

import {
  UI,
  dateShort,
  dayDate,
  formatMoney,
  formatNet,
  round2,
  type Bucket,
  type Lang,
  type StreamFilter,
} from "./data";
import { SHELL, cn } from "./ui";

function rangeLabel(bucket: Bucket, lang: Lang): string {
  if (bucket.span <= 1) return dateShort(bucket.day, lang);
  return `${dateShort(bucket.day + bucket.span - 1, lang)} - ${dateShort(bucket.day, lang)}`;
}

function barHeight(value: number, max: number): string {
  if (value <= 0 || max <= 0) return "0%";
  return `${round2(Math.max(1.5, (value / max) * 100))}%`;
}

export function FlowChart({
  buckets,
  lang,
  flow,
}: {
  buckets: readonly Bucket[];
  lang: Lang;
  flow: StreamFilter;
}) {
  const [activeDay, setActiveDay] = useState<number | null>(null);

  let max = 0;
  let totalIn = 0;
  let totalOut = 0;
  for (const bucket of buckets) {
    if (bucket.inCents > max) max = bucket.inCents;
    if (bucket.outCents > max) max = bucket.outCents;
    totalIn += bucket.inCents;
    totalOut += bucket.outCents;
  }

  const active = buckets.find((bucket) => bucket.day === activeDay) ?? null;
  const readIn = active ? active.inCents : totalIn;
  const readOut = active ? active.outCents : totalOut;
  const readLabel = active ? rangeLabel(active, lang) : SHELL.chartWindow[lang];
  const dimIn = flow === "out";
  const dimOut = flow === "in";

  return (
    <div className="min-w-0">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-5 gap-y-2">
        <p className="min-w-0 text-xs text-zinc-600 tabular-nums">
          <span className="mr-1.5 inline-block rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-700">
            {readLabel}
          </span>
        </p>
        <p className="min-w-0 text-xs text-zinc-600">
          {UI.totalIn[lang]}{" "}
          <span
            className="text-[15px] font-medium text-rose-700 tabular-nums"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            {formatMoney(readIn)}
          </span>
        </p>
        <p className="min-w-0 text-xs text-zinc-600">
          {UI.totalOut[lang]}{" "}
          <span
            className="text-[15px] font-medium text-zinc-900 tabular-nums"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            {formatMoney(readOut)}
          </span>
        </p>
        <p className="min-w-0 text-xs text-zinc-600">
          {UI.net[lang]}{" "}
          <span
            className="text-[15px] font-medium text-zinc-900 tabular-nums"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            {formatNet(readIn - readOut)}
          </span>
        </p>
      </div>

      <div className="relative mt-4 h-56 min-w-0">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-px -translate-y-px bg-zinc-300"
        />
        <div
          role="group"
          aria-label={UI.chartTitle[lang]}
          className="flex h-full min-w-0 items-stretch gap-1"
        >
          {buckets.map((bucket) => {
            const isActive = bucket.day === activeDay;
            return (
              <button
                key={bucket.day}
                type="button"
                onMouseEnter={() => setActiveDay(bucket.day)}
                onMouseLeave={() => setActiveDay(null)}
                onFocus={() => setActiveDay(bucket.day)}
                onBlur={() => setActiveDay(null)}
                aria-label={`${rangeLabel(bucket, lang)}: ${UI.totalIn[lang]} ${formatMoney(
                  bucket.inCents,
                )}, ${UI.totalOut[lang]} ${formatMoney(bucket.outCents)}`}
                className={cn(
                  "flex h-full min-w-0 flex-1 flex-col rounded-md transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-1",
                  isActive ? "bg-rose-50" : "hover:bg-zinc-50",
                )}
              >
                <span className="flex h-28 w-full items-end justify-center px-0.5">
                  <span
                    className={cn(
                      "w-full max-w-[26px] rounded-t-sm bg-rose-500",
                      dimIn && "opacity-25",
                    )}
                    style={{ height: barHeight(bucket.inCents, max) }}
                  />
                </span>
                <span className="flex h-28 w-full items-start justify-center px-0.5">
                  <span
                    className={cn(
                      "w-full max-w-[26px] rounded-b-sm bg-zinc-500",
                      dimOut && "opacity-25",
                    )}
                    style={{ height: barHeight(bucket.outCents, max) }}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div aria-hidden="true" className="mt-2 flex min-w-0 items-center gap-1">
        {buckets.map((bucket) => (
          <span
            key={bucket.day}
            className={cn(
              "min-w-0 flex-1 truncate text-center text-[10px] leading-none tabular-nums",
              bucket.day === activeDay ? "text-rose-700" : "text-zinc-600",
            )}
          >
            <span className="md:hidden">{dayDate(bucket.day).date}</span>
            <span className="hidden md:inline">{dateShort(bucket.day, lang)}</span>
          </span>
        ))}
      </div>

      <div className="mt-4 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-zinc-100 pt-3 text-[11px] text-zinc-600">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
          {UI.chartAbove[lang]}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-zinc-500" />
          {UI.chartBelow[lang]}
        </span>
        <span className="min-w-0">{SHELL.chartHint[lang]}</span>
      </div>
    </div>
  );
}
