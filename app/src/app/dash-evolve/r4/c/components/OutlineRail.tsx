"use client";

import { BarChart3, Check, ChevronDown, Filter, Percent, PieChart, Table2, TrendingUp, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import type { RangeId, SegmentId } from "../lib/data";
import { RANGE_OPTIONS, SEGMENT_OPTIONS } from "../lib/data";
import { SectionLabel, SegmentedControl } from "./ui";

export interface WidgetNavItem {
  id: string;
  label: string;
  Icon: LucideIcon;
}

export const WIDGET_NAV: WidgetNavItem[] = [
  { id: "widget-wau", label: "주간 활성 사용자", Icon: TrendingUp },
  { id: "widget-mrr", label: "MRR", Icon: Wallet },
  { id: "widget-churn", label: "이탈률", Icon: Percent },
  { id: "widget-channels", label: "채널별 신규 가입", Icon: BarChart3 },
  { id: "widget-funnel", label: "활성화 퍼널", Icon: Filter },
  { id: "widget-devices", label: "디바이스 구성", Icon: PieChart },
  { id: "widget-pages", label: "상위 페이지", Icon: Table2 },
];

export default function OutlineRail({
  range,
  segment,
  onRangeChange,
  onSegmentChange,
  onNavigate,
  activeWidgetId,
}: {
  range: RangeId;
  segment: SegmentId;
  onRangeChange: (v: RangeId) => void;
  onSegmentChange: (v: SegmentId) => void;
  onNavigate: (id: string) => void;
  activeWidgetId: string | null;
}) {
  const [segmentOpen, setSegmentOpen] = useState(false);
  const activeSegment = SEGMENT_OPTIONS.find((s) => s.id === segment);

  return (
    <aside className="w-full shrink-0 border-b border-zinc-200 bg-white lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-64 lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="flex flex-col gap-5 p-4">
        {/* 공유 필터 — 전 위젯 동시 갱신 */}
        <div className="flex flex-col gap-3">
          <SectionLabel>리포트 필터</SectionLabel>

          <div className="flex flex-col gap-1.5">
            <label id="range-filter-label" className="text-xs font-medium text-zinc-600">
              기간
            </label>
            <SegmentedControl options={RANGE_OPTIONS} value={range} onChange={onRangeChange} ariaLabel="기간 선택" />
          </div>

          <div className="flex flex-col gap-1.5">
            <span id="segment-filter-label" className="text-xs font-medium text-zinc-600">
              세그먼트
            </span>
            <div className="relative">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={segmentOpen}
                aria-labelledby="segment-filter-label"
                onClick={() => setSegmentOpen((v) => !v)}
                className="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 text-left text-sm font-medium text-zinc-800 transition-colors motion-reduce:transition-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                <span className="truncate">{activeSegment?.label}</span>
                <ChevronDown className="size-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
              </button>
              {segmentOpen ? (
                <div
                  role="listbox"
                  aria-label="세그먼트 목록"
                  className="absolute left-0 top-[calc(100%+4px)] z-10 w-full overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
                >
                  {SEGMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      role="option"
                      aria-selected={opt.id === segment}
                      onClick={() => {
                        onSegmentChange(opt.id);
                        setSegmentOpen(false);
                      }}
                      className="flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm hover:bg-zinc-50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-zinc-900">{opt.label}</span>
                        <span className="block truncate text-xs text-zinc-500">{opt.hint}</span>
                      </span>
                      {opt.id === segment ? <Check className="size-3.5 shrink-0 text-indigo-600" aria-hidden="true" /> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* 위젯 아웃라인 — 클릭 시 캔버스의 해당 위젯으로 스크롤 + 하이라이트 */}
        <div className="flex flex-col gap-1.5">
          <SectionLabel>이 리포트의 위젯</SectionLabel>
          <nav aria-label="위젯 아웃라인">
            <ul className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {WIDGET_NAV.map((item) => {
                const active = item.id === activeWidgetId;
                return (
                  <li key={item.id} className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      aria-current={active ? "true" : undefined}
                      className={`flex w-full items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                        active ? "bg-indigo-50 text-indigo-700" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                      }`}
                    >
                      <item.Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  );
}
