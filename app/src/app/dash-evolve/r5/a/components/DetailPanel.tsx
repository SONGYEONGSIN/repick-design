"use client";

import { useMemo, type ReactNode } from "react";
import { generateFills, type Instrument } from "../lib/data";
import { formatPct, formatRate, formatSizeUsd, formatUsdCompact } from "../lib/format";
import { BORDER, DIVIDE, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "../lib/tokens";
import { Badge, Card, CardHeader, ProgressBar } from "./ui";

function StatRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <dt className={cx("text-xs", TEXT_CAPTION)}>{label}</dt>
      <dd className={cx("text-sm font-medium", NUM, TEXT_PRIMARY)}>{children}</dd>
    </div>
  );
}

export default function DetailPanel({ instrument }: { instrument: Instrument }) {
  const fills = useMemo(() => generateFills(instrument), [instrument]);
  const rangePct = clampRangePct(instrument);

  return (
    <div className="flex h-auto w-full shrink-0 flex-col gap-4 lg:h-full lg:w-80 xl:w-96">
      <Card className="shrink-0">
        <CardHeader
          title="상세 지표"
          description={`${instrument.pair} · ${instrument.base}/${instrument.quote}`}
        />
        <dl className={cx("mt-2 divide-y", DIVIDE)}>
          <StatRow label="스팟 환율">{formatRate(instrument.last, instrument)}</StatRow>
          <StatRow label="당일 레인지">
            {formatRate(instrument.dayLow, instrument)} – {formatRate(instrument.dayHigh, instrument)}
          </StatRow>
          <StatRow label="20일 변동성">{formatPct(instrument.volatility20d)}</StatRow>
          <StatRow label="포워드 포인트">
            {instrument.forwardPoints >= 0 ? "+" : ""}
            {instrument.forwardPoints.toFixed(1)} pips
          </StatRow>
          <StatRow label="순 익스포저">
            {instrument.exposure === "Flat" ? (
              <span className={cx("text-sm font-medium", TEXT_CAPTION)}>노출 없음</span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Badge tone={instrument.exposure === "Long" ? "positive" : "warning"}>{instrument.exposure === "Long" ? "매입" : "매도"}</Badge>
                {formatUsdCompact(instrument.exposureAmountUsd)}
              </span>
            )}
          </StatRow>
        </dl>

        {instrument.hedgeRatioPct !== null ? (
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className={cx("text-xs", TEXT_CAPTION)}>헤지 비율</span>
              <span className={cx("text-xs font-semibold", NUM, instrument.hedgeRatioPct < 60 ? "text-amber-700 dark:text-amber-400" : TEXT_PRIMARY)}>
                {instrument.hedgeRatioPct}%
              </span>
            </div>
            <ProgressBar value={instrument.hedgeRatioPct} tone={instrument.hedgeRatioPct < 60 ? "warning" : "positive"} label={`${instrument.pair} 헤지 비율`} />
          </div>
        ) : null}

        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[10px]">
            <span aria-hidden="true" className={TEXT_CAPTION}>
              {formatRate(instrument.dayLow, instrument)}
            </span>
            <span aria-hidden="true" className={TEXT_CAPTION}>
              {formatRate(instrument.dayHigh, instrument)}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label={`${instrument.pair} 당일 레인지 내 현재가 위치`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(rangePct)}
            className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
          >
            <span className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-zinc-300 to-zinc-400 dark:from-zinc-700 dark:to-zinc-600" aria-hidden="true" />
            <span
              className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-blue-600 dark:border-zinc-900 dark:bg-blue-400"
              style={{ left: `${rangePct}%` }}
              aria-hidden="true"
            />
          </div>
        </div>
      </Card>

      <Card padded={false} className="flex h-72 min-h-0 flex-col overflow-hidden lg:h-auto lg:flex-1">
        <div className={cx("shrink-0 border-b px-4 py-3", BORDER)}>
          <CardHeader as="h3" title="최근 체결" description={`${instrument.pair} 주문북 로그`} />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <table className="w-full table-fixed border-collapse text-sm">
            <caption className="sr-only">{instrument.pair}의 최근 체결 내역</caption>
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[30%]" />
              <col className="w-[30%]" />
              <col className="w-[18%]" />
            </colgroup>
            <thead>
              <tr className={cx("border-b text-[11px] font-semibold uppercase tracking-wide", BORDER, TEXT_CAPTION)}>
                <th scope="col" className="px-4 py-2 text-left">
                  구분
                </th>
                <th scope="col" className="py-2 text-right">
                  규모
                </th>
                <th scope="col" className="py-2 text-right">
                  체결가
                </th>
                <th scope="col" className="py-2 pr-4 text-right">
                  시각
                </th>
              </tr>
            </thead>
            <tbody className={cx("divide-y", DIVIDE)}>
              {fills.map((fill) => (
                <tr key={fill.id}>
                  <td className="px-4 py-2">
                    <Badge tone={fill.side === "매수" ? "positive" : "negative"}>{fill.side}</Badge>
                  </td>
                  <td className={cx("py-2 text-right", NUM, TEXT_PRIMARY)}>{formatSizeUsd(fill.sizeUsd)}</td>
                  <td className={cx("py-2 text-right", NUM, TEXT_PRIMARY)}>{formatRate(fill.rate, instrument)}</td>
                  <td className={cx("whitespace-nowrap py-2 pr-4 text-right", NUM, TEXT_CAPTION)}>{fill.timeLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function clampRangePct(instrument: Instrument): number {
  const span = instrument.dayHigh - instrument.dayLow || 1;
  const pct = ((instrument.last - instrument.dayLow) / span) * 100;
  return Math.min(100, Math.max(0, pct));
}
