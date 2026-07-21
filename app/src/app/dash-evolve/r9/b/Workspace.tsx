"use client";

import { Activity, AlertTriangle, Gauge, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import DetailPanel from "./DetailPanel";
import NetworkGraph, { type MetricMode } from "./NetworkGraph";
import ServiceTable from "./ServiceTable";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import {
  AT_RISK_COUNT,
  formatPercent,
  formatVolume,
  NODE_MAP,
  RELIABILITY_META,
  SLOW_COUNT,
  TOTAL_REQUEST_VOLUME,
  WEIGHTED_ERROR_RATE,
} from "./data";
import { BORDER, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHeader, EyebrowLabel, SegmentedControl } from "./ui";

const METRIC_OPTIONS: { id: MetricMode; label: string }[] = [
  { id: "reliability", label: "안정성" },
  { id: "latency", label: "응답 지연" },
];

function InlineStat({ Icon, label, value, valueClass }: { Icon: typeof Activity; label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <Icon size={14} aria-hidden="true" className={TEXT_CAPTION} />
      </span>
      <div className="min-w-0">
        <EyebrowLabel>{label}</EyebrowLabel>
        <p className={cx("truncate text-sm font-semibold leading-tight", NUM, valueClass ?? TEXT_PRIMARY)}>{value}</p>
      </div>
    </div>
  );
}

export default function Workspace() {
  const [selectedId, setSelectedId] = useState<string | null>("payments-service");
  const [panelOpen, setPanelOpen] = useState(false);
  const [metricMode, setMetricMode] = useState<MetricMode>("reliability");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSelect(id: string) {
    setSelectedId(id);
    setPanelOpen(true);
  }

  const selectedNode = selectedId ? (NODE_MAP[selectedId] ?? null) : null;

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", "bg-zinc-50 dark:bg-zinc-950", TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-4 p-4 sm:p-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>서비스 의존성 그래프</h1>
                <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Bramwell Commerce · Platform Reliability 워크스페이스</p>
              </div>
            </header>

            <Card className="min-w-0" padded={false}>
              <div className="p-4 sm:p-5">
                <CardHeader
                  title="서비스 메시"
                  titleId="mesh-graph-heading"
                  description="노드 = 마이크로서비스, 선 = 호출 의존성(점선은 이벤트 버스 경유). 노드 크기는 요청량, 색은 선택한 지표를 인코딩합니다. 클릭하면 상세 패널과 테이블이 동기화됩니다."
                  action={<SegmentedControl ariaLabel="그래프 색 인코딩" options={METRIC_OPTIONS} value={metricMode} onChange={setMetricMode} />}
                />

                <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3">
                  <InlineStat Icon={Activity} label="전체 요청량" value={formatVolume(TOTAL_REQUEST_VOLUME)} />
                  <span aria-hidden="true" className={cx("hidden h-8 w-px sm:block", "bg-zinc-200 dark:bg-zinc-800")} />
                  <InlineStat Icon={Gauge} label="가중평균 오류율" value={formatPercent(WEIGHTED_ERROR_RATE)} />
                  <span aria-hidden="true" className={cx("hidden h-8 w-px sm:block", "bg-zinc-200 dark:bg-zinc-800")} />
                  <InlineStat
                    Icon={AlertTriangle}
                    label="위험 서비스"
                    value={`${AT_RISK_COUNT}개`}
                    valueClass={AT_RISK_COUNT > 0 ? "text-amber-700 dark:text-amber-300" : undefined}
                  />
                  <span aria-hidden="true" className={cx("hidden h-8 w-px sm:block", "bg-zinc-200 dark:bg-zinc-800")} />
                  <InlineStat Icon={Timer} label="느린 응답(P99≥350ms)" value={`${SLOW_COUNT}개`} valueClass={SLOW_COUNT > 0 ? "text-rose-700 dark:text-rose-300" : undefined} />

                  <div className="ml-auto flex flex-wrap items-center gap-3">
                    {(["healthy", "degraded", "critical"] as const).map((s) => {
                      const m = RELIABILITY_META[s];
                      return (
                        <span key={s} className={cx("inline-flex items-center gap-1.5 text-xs font-medium", m.text)}>
                          <span aria-hidden="true" className={cx("h-2 w-2 rounded-full", m.dot)} />
                          {m.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={cx("border-t p-4 sm:p-6", BORDER)} role="group" aria-labelledby="mesh-graph-heading">
                <NetworkGraph metricMode={metricMode} selectedId={selectedId} onSelect={handleSelect} />
              </div>
            </Card>

            <ServiceTable selectedId={selectedId} onSelect={handleSelect} />
          </div>
        </main>
      </div>

      <DetailPanel node={selectedNode} open={panelOpen} onClose={() => setPanelOpen(false)} onSelect={handleSelect} />

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectNode={handleSelect} /> : null}
    </div>
  );
}
