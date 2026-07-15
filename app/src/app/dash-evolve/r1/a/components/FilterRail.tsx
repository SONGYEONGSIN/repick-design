"use client";

import { Bookmark, TrendingUp } from "lucide-react";
import type { EventCategory, Source } from "../lib/data";
import { INGEST_RATE_NOW, INGEST_RATE_SERIES } from "../lib/data";
import { formatNumber } from "../lib/format";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  Card,
  SOURCE_META,
  SOURCE_ORDER,
  Sparkline,
} from "./ui";

export type TypeFilter = EventCategory | "all";
export type SourceFilter = Source | "all";

interface FilterRailProps {
  typeFilter: TypeFilter;
  onTypeChange: (t: TypeFilter) => void;
  sourceFilter: SourceFilter;
  onSourceChange: (s: SourceFilter) => void;
  typeCounts: Record<EventCategory, number>;
  sourceCounts: Record<Source, number>;
  totalCount: number;
}

function FacetButton({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex min-h-[34px] w-full items-center gap-2 rounded-lg px-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
        active ? "bg-violet-50 font-medium text-violet-700" : "text-zinc-600 hover:bg-zinc-50"
      }`}
    >
      {children}
      <span
        className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
          active ? "bg-violet-100 text-violet-700" : "bg-zinc-100 text-zinc-500"
        }`}
      >
        {formatNumber(count)}
      </span>
    </button>
  );
}

const SAVED_VIEWS = ["고가치 전환", "결제 이탈 위험", "오류 급증 소스"];

export default function FilterRail({
  typeFilter,
  onTypeChange,
  sourceFilter,
  onSourceChange,
  typeCounts,
  sourceCounts,
  totalCount,
}: FilterRailProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* 실시간 처리율 요약 */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">실시간 처리율</h2>
          <TrendingUp className="size-3.5 text-emerald-500" aria-hidden="true" />
        </div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <p className="text-2xl font-semibold tabular-nums text-zinc-900">
            {formatNumber(INGEST_RATE_NOW)}
            <span className="ml-1 text-xs font-normal text-zinc-400">건/초</span>
          </p>
          <Sparkline
            values={INGEST_RATE_SERIES}
            label="최근 60초 처리율 추이"
            className="h-7 w-20 text-emerald-500"
            width={80}
            height={28}
          />
        </div>
      </Card>

      {/* 필터 */}
      <Card className="p-4">
        <fieldset>
          <legend className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">이벤트 유형</legend>
          <div className="mt-2 space-y-0.5">
            <FacetButton active={typeFilter === "all"} onClick={() => onTypeChange("all")} count={totalCount}>
              <span className="size-4 shrink-0" aria-hidden="true" />
              전체
            </FacetButton>
            {CATEGORY_ORDER.map((cat) => {
              const meta = CATEGORY_META[cat];
              return (
                <FacetButton
                  key={cat}
                  active={typeFilter === cat}
                  onClick={() => onTypeChange(cat)}
                  count={typeCounts[cat]}
                >
                  <meta.Icon className={`size-4 shrink-0 ${typeFilter === cat ? "" : "text-zinc-400"}`} aria-hidden="true" />
                  {meta.label}
                </FacetButton>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-4 border-t border-zinc-100 pt-4">
          <legend className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">소스</legend>
          <div className="mt-2 space-y-0.5">
            <FacetButton active={sourceFilter === "all"} onClick={() => onSourceChange("all")} count={totalCount}>
              <span className="size-4 shrink-0" aria-hidden="true" />
              전체
            </FacetButton>
            {SOURCE_ORDER.map((src) => {
              const meta = SOURCE_META[src];
              return (
                <FacetButton
                  key={src}
                  active={sourceFilter === src}
                  onClick={() => onSourceChange(src)}
                  count={sourceCounts[src]}
                >
                  <meta.Icon className={`size-4 shrink-0 ${sourceFilter === src ? "" : "text-zinc-400"}`} aria-hidden="true" />
                  {meta.label}
                </FacetButton>
              );
            })}
          </div>
        </fieldset>
      </Card>

      {/* 저장된 뷰 */}
      <Card className="p-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">저장된 뷰</h2>
        <ul className="mt-2 space-y-0.5">
          {SAVED_VIEWS.map((view) => (
            <li key={view}>
              <button
                type="button"
                className="flex min-h-[34px] w-full items-center gap-2 rounded-lg px-2.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                <Bookmark className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                <span className="truncate">{view}</span>
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
