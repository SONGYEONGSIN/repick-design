"use client";

import { Radio } from "lucide-react";
import type { HeroSnapshot, Period, ThroughputPoint } from "../lib/data";
import { formatCompact, formatNumber, formatPercent } from "../lib/format";
import ThroughputChart from "./ThroughputChart";
import { DeltaChip, Segmented } from "./ui";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "today", label: "오늘" },
  { value: "7d", label: "7일" },
  { value: "30d", label: "30일" },
];

const PERIOD_LABEL: Record<Period, string> = {
  today: "오늘 (시간별)",
  "7d": "최근 7일",
  "30d": "최근 30일",
};

interface HeroBandProps {
  period: Period;
  onPeriodChange: (p: Period) => void;
  hero: HeroSnapshot;
  series: ThroughputPoint[];
}

function InlineStat({ label, value, tone = "text-zinc-900" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{label}</dt>
      <dd className={`mt-0.5 text-lg font-semibold tabular-nums ${tone}`}>{value}</dd>
    </div>
  );
}

export default function HeroBand({ period, onPeriodChange, hero, series }: HeroBandProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-8">
        {/* 좌: 히어로 숫자 + 인라인 스탯 */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70 motion-reduce:hidden" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
              <h1 id="hero-heading" className="text-sm font-semibold text-zinc-900">
                라이브 이벤트
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
                <Radio className="size-3" aria-hidden="true" />
                실시간 수집
              </span>
            </div>
            <Segmented options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} label="집계 기간" size="sm" />
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-2">
            <p className="text-4xl font-semibold tracking-tight text-zinc-900 tabular-nums sm:text-5xl">
              {formatNumber(hero.totalEvents)}
            </p>
            <DeltaChip value={hero.deltaPct} />
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            {PERIOD_LABEL[period]} 수집된 이벤트 · 약 {formatCompact(hero.totalEvents)}건
          </p>

          <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-zinc-100 pt-4">
            <InlineStat label="활성 사용자" value={formatNumber(hero.activeUsers)} />
            <InlineStat label="전환율" value={formatPercent(hero.conversionRate)} tone="text-emerald-600" />
            <InlineStat label="오류율" value={formatPercent(hero.errorRate, 2)} tone="text-rose-600" />
          </dl>
        </div>

        {/* 우: 처리량 추이 (크로스헤어 차트) */}
        <div className="min-w-0 lg:border-l lg:border-zinc-100 lg:pl-8">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">처리량 추이</h2>
            <div className="flex items-center gap-3 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-3 rounded-full bg-violet-500" aria-hidden="true" />
                이벤트
              </span>
            </div>
          </div>
          <ThroughputChart series={series} periodLabel={PERIOD_LABEL[period]} />
        </div>
      </div>
    </section>
  );
}
