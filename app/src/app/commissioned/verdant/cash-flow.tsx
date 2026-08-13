"use client";

import { X } from "lucide-react";

import {
  UI,
  formatCompact,
  formatMoney,
  formatSigned,
  periodOf,
  round2,
  type Bucket,
  type Lang,
  type PeriodId,
  type Totals,
} from "./data";
import { HATCH, PANEL, RING, cx } from "./ui";

export function CashFlow({
  lang,
  period,
  buckets,
  totals,
  active,
  onActive,
}: {
  lang: Lang;
  period: PeriodId;
  buckets: readonly Bucket[];
  totals: Totals;
  active: number | null;
  onActive: (index: number | null) => void;
}) {
  const nets = buckets.map((bucket) => bucket.inCents - bucket.outCents);
  const maxPos = Math.max(0, ...nets);
  const maxNeg = Math.max(0, ...nets.map((net) => -net));
  const span = maxPos + maxNeg === 0 ? 1 : maxPos + maxNeg;
  const baseline = round2((maxPos / span) * 100);
  const current = active === null ? null : (buckets[active] ?? null);
  const currentNet = current === null ? 0 : current.inCents - current.outCents;
  const meta = periodOf(period);

  const ticks: { value: number; top: number }[] = [{ value: maxPos, top: 0 }];
  if (maxPos > 0) ticks.push({ value: maxPos / 2, top: round2(baseline / 2) });
  ticks.push({ value: 0, top: baseline });
  if (maxNeg > 0) ticks.push({ value: -maxNeg, top: 100 });

  return (
    <section
      id="verdant-cashflow"
      aria-labelledby="verdant-cashflow-h"
      className={cx(PANEL, "scroll-mt-24 p-4 sm:p-5")}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2
            id="verdant-cashflow-h"
            className="text-sm font-semibold tracking-wide text-zinc-100"
          >
            {UI.cashflow[lang]}
          </h2>
          <p
            className="mt-2 text-3xl tracking-tight text-lime-300 tabular-nums sm:text-4xl"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            {formatSigned(totals.netCents)}
          </p>
          <p className="mt-1 text-sm text-zinc-400 tabular-nums">
            {`${UI.moneyIn[lang]} ${formatMoney(totals.inCents)} · ${UI.moneyOut[lang]} ${formatMoney(totals.outCents)}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
            {meta.span[lang]}
          </span>
          {active !== null ? (
            <button
              type="button"
              onClick={() => onActive(null)}
              className={cx(
                "inline-flex min-h-11 items-center gap-1.5 rounded-full border border-zinc-700 px-3 text-xs text-zinc-300 motion-safe:transition-colors hover:text-zinc-100",
                RING,
              )}
            >
              <X className="size-3.5" aria-hidden="true" />
              {UI.clearBar[lang]}
            </button>
          ) : null}
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-400">
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-3 w-4 rounded-[3px] bg-gradient-to-t from-emerald-950 to-lime-300"
          />
          {UI.surplus[lang]}
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-3 w-4 rounded-[3px] border border-zinc-500 bg-zinc-800 text-zinc-500"
            style={HATCH}
          />
          {UI.deficit[lang]}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block w-4 border-t border-dashed border-zinc-400" />
          {UI.breakEven[lang]}
        </li>
      </ul>

      <div className="mt-4 flex gap-2">
        <div className="relative h-56 w-12 shrink-0 sm:h-64">
          {ticks.map((tick, index) => (
            <span
              key={`tick-${index}`}
              className="absolute right-0 -translate-y-1/2 text-[10px] text-zinc-400 tabular-nums"
              style={{ top: `${tick.top}%` }}
            >
              {formatCompact(tick.value)}
            </span>
          ))}
        </div>

        <div className="relative h-56 min-w-0 flex-1 sm:h-64">
          <div className="flex h-full items-stretch gap-1 sm:gap-2">
            {buckets.map((bucket, index) => {
              const net = bucket.inCents - bucket.outCents;
              const height = Math.max(round2((Math.abs(net) / span) * 100), 0.9);
              const top = net >= 0 ? round2(baseline - height) : baseline;
              const on = active === index;
              const geometry = { top: `${top}%`, height: `${height}%` };
              return (
                <button
                  key={bucket.key}
                  type="button"
                  onClick={() => onActive(on ? null : index)}
                  onMouseEnter={() => onActive(index)}
                  onFocus={() => onActive(index)}
                  aria-pressed={on}
                  aria-label={`${bucket.label[lang]} — ${UI.moneyIn[lang]} ${formatMoney(bucket.inCents)}, ${UI.moneyOut[lang]} ${formatMoney(bucket.outCents)}, ${UI.net[lang]} ${formatSigned(net)}`}
                  className={cx("relative h-full min-w-0 flex-1 rounded-md", RING)}
                >
                  <span
                    aria-hidden="true"
                    className={cx(
                      "absolute inset-x-0 rounded-[4px]",
                      net >= 0
                        ? "bg-gradient-to-t from-emerald-950 to-lime-300"
                        : "border border-zinc-500 bg-zinc-800",
                      on && "ring-2 ring-lime-300 ring-offset-1 ring-offset-zinc-900",
                    )}
                    style={geometry}
                  />
                  {net < 0 ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 rounded-[4px] text-zinc-500"
                      style={{ ...HATCH, ...geometry }}
                    />
                  ) : null}
                  {on ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 rounded-[4px] text-lime-300/50"
                      style={{ ...HATCH, ...geometry }}
                    />
                  ) : null}
                  {on ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-50 ring-2 ring-zinc-950"
                      style={{ top: `${baseline}%` }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 z-10 border-t border-dashed border-zinc-400"
            style={{ top: `${baseline}%` }}
          />

          {current !== null ? (
            <div
              className={cx(
                "pointer-events-none absolute top-0 z-10 w-40 rounded-xl bg-lime-300 p-3 text-zinc-950 shadow-xl",
                active !== null && active < buckets.length / 2 ? "left-0" : "right-0",
              )}
            >
              <dl className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <dt className="flex items-center gap-1.5 text-xs">
                    <span aria-hidden="true" className="size-2 rounded-full bg-zinc-950" />
                    {UI.inShort[lang]}
                  </dt>
                  <dd className="text-xs tabular-nums">{formatMoney(current.inCents)}</dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="flex items-center gap-1.5 text-xs">
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full border border-zinc-950"
                    />
                    {UI.outShort[lang]}
                  </dt>
                  <dd className="text-xs tabular-nums">{formatMoney(current.outCents)}</dd>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2 border-t border-zinc-950/20 pt-1">
                  <dt className="text-xs font-medium">{UI.net[lang]}</dt>
                  <dd className="text-sm font-medium tabular-nums">{formatSigned(currentNet)}</dd>
                </div>
              </dl>
              <p className="mt-1.5 text-[11px] text-zinc-950/70">{current.label[lang]}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-2 flex gap-2">
        <span className="w-12 shrink-0" />
        <div className="flex min-w-0 flex-1 gap-1 sm:gap-2">
          {buckets.map((bucket, index) => (
            <span
              key={bucket.key}
              className={cx(
                "block min-w-0 flex-1 truncate text-center text-[10px]",
                active === index ? "text-lime-300" : "text-zinc-400",
              )}
            >
              {bucket.short[lang]}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-400">
        {active === null ? UI.pickBar[lang] : UI.cashflowNote[lang]}
      </p>
    </section>
  );
}
