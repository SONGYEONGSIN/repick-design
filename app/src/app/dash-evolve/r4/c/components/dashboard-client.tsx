"use client";

import { Percent, Wallet } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RangeId, SegmentId } from "../lib/data";
import { RANGE_OPTIONS, SEGMENT_OPTIONS, getScenario } from "../lib/data";
import { formatCurrency, formatPercent } from "../lib/format";
import type { Command } from "./CommandPalette";
import CommandPalette from "./CommandPalette";
import GlobalSidebar from "./GlobalSidebar";
import OutlineRail, { WIDGET_NAV } from "./OutlineRail";
import Topbar from "./Topbar";
import BarWidget from "./widgets/BarWidget";
import DonutWidget from "./widgets/DonutWidget";
import FunnelWidget from "./widgets/FunnelWidget";
import MetricWidget from "./widgets/MetricWidget";
import TableWidget from "./widgets/TableWidget";
import TrendWidget from "./widgets/TrendWidget";

export default function DashboardClient() {
  const [range, setRange] = useState<RangeId>("30d");
  const [segment, setSegment] = useState<SegmentId>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [highlightedWidgetId, setHighlightedWidgetId] = useState<string | null>(null);
  const highlightTimeout = useRef<number | null>(null);

  const scenario = getScenario(range, segment);
  const segmentMeta = SEGMENT_OPTIONS.find((s) => s.id === segment);
  const rangeMeta = RANGE_OPTIONS.find((r) => r.id === range);

  const scrollToWidget = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

    if (highlightTimeout.current !== null) window.clearTimeout(highlightTimeout.current);
    setHighlightedWidgetId(id);
    highlightTimeout.current = window.setTimeout(() => setHighlightedWidgetId(null), 1800);
  }, []);

  useEffect(() => {
    return () => {
      if (highlightTimeout.current !== null) window.clearTimeout(highlightTimeout.current);
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const commands: Command[] = [
    ...WIDGET_NAV.map((w) => ({ id: `nav-${w.id}`, label: `위젯: ${w.label}로 이동`, hint: "캔버스로 스크롤" })),
    ...RANGE_OPTIONS.map((r) => ({ id: `range-${r.id}`, label: `기간을 "${r.label}"로 설정`, hint: "공유 필터" })),
    ...SEGMENT_OPTIONS.map((s) => ({ id: `segment-${s.id}`, label: `세그먼트를 "${s.label}"로 설정`, hint: "공유 필터" })),
  ];

  const runCommand = useCallback(
    (id: string) => {
      setPaletteOpen(false);
      if (id.startsWith("nav-")) {
        scrollToWidget(id.replace("nav-", ""));
      } else if (id.startsWith("range-")) {
        setRange(id.replace("range-", "") as RangeId);
      } else if (id.startsWith("segment-")) {
        setSegment(id.replace("segment-", "") as SegmentId);
      }
    },
    [scrollToWidget]
  );

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <GlobalSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} onSearchClick={() => setPaletteOpen(true)} />

        <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
          <OutlineRail
            range={range}
            segment={segment}
            onRangeChange={setRange}
            onSegmentChange={setSegment}
            onNavigate={scrollToWidget}
            activeWidgetId={highlightedWidgetId}
          />

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-w-0 max-w-[1760px] flex-col gap-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-zinc-900">주간 제품 리포트</h1>
                  <p className="mt-1 text-sm text-zinc-500">
                    {segmentMeta?.label} · {rangeMeta?.label} 기준으로 모든 위젯이 함께 갱신됩니다.
                  </p>
                </div>
                <p className="text-xs text-zinc-500">마지막 동기화 07월 15일 23:50</p>
              </div>

              <div className="grid grid-cols-12 gap-4 sm:gap-5">
                <TrendWidget
                  id="widget-wau"
                  highlighted={highlightedWidgetId === "widget-wau"}
                  title="주간 활성 사용자"
                  subtitle="선택한 기간의 활성 사용자 추세"
                  data={scenario.wau}
                />

                <div className="col-span-12 flex min-w-0 flex-col gap-4 sm:gap-5 lg:col-span-4">
                  <MetricWidget
                    id="widget-mrr"
                    highlighted={highlightedWidgetId === "widget-mrr"}
                    label="MRR"
                    Icon={Wallet}
                    value={formatCurrency(scenario.kpis.mrr.value)}
                    deltaPct={scenario.kpis.mrr.deltaPct}
                    spark={scenario.kpis.mrr.spark}
                    className="flex-1"
                  />
                  <MetricWidget
                    id="widget-churn"
                    highlighted={highlightedWidgetId === "widget-churn"}
                    label="이탈률"
                    Icon={Percent}
                    value={formatPercent(scenario.kpis.churn.value)}
                    deltaPct={scenario.kpis.churn.deltaPct}
                    invertDelta
                    spark={scenario.kpis.churn.spark}
                    className="flex-1"
                  />
                </div>

                <BarWidget
                  id="widget-channels"
                  highlighted={highlightedWidgetId === "widget-channels"}
                  title="채널별 신규 가입"
                  subtitle="유입 채널별 신규 가입 수"
                  data={scenario.channels}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                />
                <FunnelWidget
                  id="widget-funnel"
                  highlighted={highlightedWidgetId === "widget-funnel"}
                  title="활성화 퍼널"
                  subtitle="방문부터 유료 전환까지"
                  data={scenario.funnel}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                />
                <DonutWidget
                  id="widget-devices"
                  highlighted={highlightedWidgetId === "widget-devices"}
                  title="디바이스 구성"
                  subtitle="세션 기준 디바이스 비중"
                  data={scenario.devices}
                  className="col-span-12 lg:col-span-4"
                />

                <TableWidget
                  id="widget-pages"
                  highlighted={highlightedWidgetId === "widget-pages"}
                  title="상위 페이지"
                  subtitle="조회수 기준 상위 페이지 성과 breakdown"
                  data={scenario.pages}
                />
              </div>
            </div>
          </main>
        </div>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} commands={commands} onRun={runCommand} /> : null}
    </div>
  );
}
