"use client";

import { TriangleAlert } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import type { EventCategory } from "../lib/data";
import { CATEGORY_DISTRIBUTION, SOURCE_DISTRIBUTION } from "../lib/data";
import { formatCompact, formatPercent } from "../lib/format";
import type { TypeFilter } from "./FilterRail";
import { CATEGORY_META, Card, ProgressBar, SOURCE_META, Sparkline } from "./ui";

type Tab = "distribution" | "sources";

interface ContextRailProps {
  typeFilter: TypeFilter;
  onTypeChange: (t: TypeFilter) => void;
}

const TABS: { id: Tab; label: string }[] = [
  { id: "distribution", label: "유형 분포" },
  { id: "sources", label: "상위 소스" },
];

export default function ContextRail({ typeFilter, onTypeChange }: ContextRailProps) {
  const [tab, setTab] = useState<Tab>("distribution");

  function onTabKey(e: KeyboardEvent<HTMLDivElement>) {
    const idx = TABS.findIndex((t) => t.id === tab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setTab(TABS[(idx + 1) % TABS.length].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setTab(TABS[(idx - 1 + TABS.length) % TABS.length].id);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <div role="tablist" aria-label="이벤트 요약 보기" onKeyDown={onTabKey} className="flex gap-1 rounded-lg bg-zinc-50 p-0.5">
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`ctx-tab-${t.id}`}
                aria-selected={active}
                aria-controls={`ctx-panel-${t.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setTab(t.id)}
                className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
                  active ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "distribution" && (
          <div id="ctx-panel-distribution" role="tabpanel" aria-labelledby="ctx-tab-distribution" className="mt-4 space-y-3">
            <p className="text-[11px] text-zinc-400">막대를 누르면 해당 유형으로 피드가 필터됩니다.</p>
            {CATEGORY_DISTRIBUTION.map((row) => {
              const meta = CATEGORY_META[row.category];
              const active = typeFilter === row.category;
              return (
                <button
                  key={row.category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onTypeChange(active ? "all" : (row.category as EventCategory))}
                  className={`block w-full rounded-lg px-2 py-1.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
                    active ? "bg-violet-50 ring-1 ring-violet-200" : "hover:bg-zinc-50"
                  }`}
                >
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-zinc-700">
                      <span className={`size-2 rounded-full ${meta.dot}`} aria-hidden="true" />
                      {meta.label}
                    </span>
                    <span className="tabular-nums text-zinc-500">
                      {formatPercent(row.share)} · {formatCompact(row.count)}
                    </span>
                  </div>
                  <ProgressBar value={row.share} tone={meta.bar} />
                </button>
              );
            })}
          </div>
        )}

        {tab === "sources" && (
          <div id="ctx-panel-sources" role="tabpanel" aria-labelledby="ctx-tab-sources" className="mt-4 space-y-2.5">
            {SOURCE_DISTRIBUTION.map((row) => {
              const meta = SOURCE_META[row.source];
              return (
                <div key={row.source} className="flex items-center gap-3 rounded-lg px-2 py-1.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                    <meta.Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-medium text-zinc-700">{meta.label}</span>
                      <span className="tabular-nums text-zinc-500">
                        {formatPercent(row.share)} · {formatCompact(row.count)}
                      </span>
                    </div>
                    <div className="mt-1">
                      <ProgressBar value={row.share} tone="bg-zinc-400" />
                    </div>
                  </div>
                  <Sparkline
                    values={row.trend}
                    label={`${meta.label} 7일 추이`}
                    className="h-6 w-12 text-zinc-300"
                    width={48}
                    height={24}
                  />
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* 알림 카드 */}
      <Card className="border-amber-200 bg-amber-50/60 p-4">
        <div className="flex gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <TriangleAlert className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-amber-900">오류율 상승 감지</h3>
            <p className="mt-1 text-xs leading-relaxed text-amber-800/90">
              <span className="font-medium">서버</span> 소스의 오류율이 지난 1시간 평균 대비{" "}
              <span className="tabular-nums font-medium">+2.4%p</span> 상승했습니다.
            </p>
            <button
              type="button"
              onClick={() => onTypeChange("error")}
              className="mt-2 inline-flex items-center rounded-md bg-white px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200 transition-colors hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              오류 이벤트 보기
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
