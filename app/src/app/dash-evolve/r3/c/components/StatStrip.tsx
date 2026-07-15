import { CalendarClock, PieChart, TrendingUp, Wallet } from "lucide-react";
import {
  AVG_DEAL_SIZE,
  CLOSING_THIS_MONTH,
  OPEN_DEALS,
  PIPELINE_TREND,
  PIPELINE_VALUE,
  WIN_RATE,
} from "../lib/data";
import { formatCurrencyCompact } from "../lib/format";
import { Card, Sparkline } from "./ui";

export default function StatStrip() {
  const trendValues = PIPELINE_TREND.map((p) => p.value);

  return (
    <Card as="div" className="p-0">
      <dl className="grid grid-cols-1 divide-y divide-zinc-100 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
        <div className="relative px-4 py-3.5">
          <dt className="min-w-0 pl-11 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            <span className="absolute left-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600" aria-hidden="true">
              <Wallet className="size-4" />
            </span>
            파이프라인 총액
          </dt>
          <dd className="mt-0.5 flex min-w-0 items-center gap-2 pl-11">
            <span className="text-lg font-semibold tabular-nums text-zinc-900">
              {formatCurrencyCompact(PIPELINE_VALUE)}
            </span>
            <span className="text-indigo-500">
              <Sparkline points={trendValues} width={56} height={20} />
            </span>
          </dd>
        </div>

        <div className="relative px-4 py-3.5">
          <dt className="min-w-0 pl-11 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            <span className="absolute left-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-blue-50 text-blue-600" aria-hidden="true">
              <PieChart className="size-4" />
            </span>
            진행 중 딜
          </dt>
          <dd className="mt-0.5 min-w-0 pl-11 text-lg font-semibold tabular-nums text-zinc-900">{OPEN_DEALS.length}건</dd>
        </div>

        <div className="relative px-4 py-3.5">
          <dt className="min-w-0 pl-11 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            <span className="absolute left-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-amber-50 text-amber-600" aria-hidden="true">
              <CalendarClock className="size-4" />
            </span>
            이번 달 마감 예정
          </dt>
          <dd className="mt-0.5 min-w-0 pl-11 text-lg font-semibold tabular-nums text-zinc-900">{CLOSING_THIS_MONTH}건</dd>
        </div>

        <div className="relative px-4 py-3.5">
          <dt className="min-w-0 pl-11 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            <span className="absolute left-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600" aria-hidden="true">
              <TrendingUp className="size-4" />
            </span>
            평균 딜 규모
          </dt>
          <dd className="mt-0.5 min-w-0 pl-11 text-lg font-semibold tabular-nums text-zinc-900">
            {formatCurrencyCompact(AVG_DEAL_SIZE)}
          </dd>
        </div>

        <div className="relative px-4 py-3.5">
          <dt className="min-w-0 pl-11 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            <span className="absolute left-4 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg bg-violet-50 text-violet-600" aria-hidden="true">
              <TrendingUp className="size-4" />
            </span>
            전체 승률
          </dt>
          <dd className="mt-0.5 min-w-0 pl-11 text-lg font-semibold tabular-nums text-zinc-900">{WIN_RATE}%</dd>
        </div>
      </dl>
    </Card>
  );
}
