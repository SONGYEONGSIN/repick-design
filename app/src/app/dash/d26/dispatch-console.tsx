"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BatteryCharging,
  Gauge,
  LayoutGrid,
  Percent,
  Rows3,
  ScrollText,
  Table2,
  Workflow,
  Zap,
} from "lucide-react";
import {
  EVENTS,
  GEN_SOURCES,
  GEN_TYPE_LABEL,
  SNAPSHOTS,
  SUBSTATIONS,
  hzFormatter,
  loadTier,
  mwFormatter,
  pctFormatter,
  type GenType,
} from "./data";
import { EssBand, FrequencyRuler, SelectedDetail } from "./instrument-cluster";
import OneLineDiagram from "./one-line-diagram";
import MeritOrderStack from "./merit-order-stack";
import DailyMixCurve from "./daily-mix-curve";
import SubstationTable from "./substation-table";
import EventLog from "./event-log";
import { KpiCard, Panel } from "./ui";
import styles from "./console.module.css";

const NAV_ITEMS = [
  { id: "overview", label: "개요", icon: LayoutGrid },
  { id: "sld", label: "결선도", icon: Workflow },
  { id: "dispatch", label: "급전순위", icon: Rows3 },
  { id: "daily", label: "수급곡선", icon: Activity },
  { id: "substations", label: "변전소", icon: Table2 },
  { id: "events", label: "이벤트", icon: ScrollText },
] as const;

const FILTERS: { value: GenType | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "solar", label: "태양광" },
  { value: "wind", label: "풍력" },
  { value: "nuclear", label: "원자력" },
  { value: "lng", label: "LNG" },
  { value: "ess", label: "ESS" },
];

const ALARM_COUNT = EVENTS.filter((e) => e.severity === "alarm").length;

export default function DispatchConsole() {
  const [snapshotIndex, setSnapshotIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<GenType | "all">("all");

  const snapshot = SNAPSHOTS[snapshotIndex];

  const totalDemandMW = useMemo(() => snapshot.subs.reduce((sum, s) => sum + s.loadMW, 0), [snapshot]);
  const totalGenMW = useMemo(
    () =>
      snapshot.gens
        .filter((g) => GEN_SOURCES.find((gen) => gen.id === g.genId)?.type !== "ess")
        .reduce((sum, g) => sum + g.outputMW, 0),
    [snapshot],
  );
  const onlineCount = useMemo(() => snapshot.gens.filter((g) => g.breaker === "closed").length, [snapshot]);
  const elevatedSubCount = useMemo(
    () =>
      snapshot.subs.filter((s) => {
        const sub = SUBSTATIONS.find((x) => x.id === s.subId);
        if (!sub) return false;
        return loadTier((s.loadMW / sub.capacityMW) * 100) !== "normal";
      }).length,
    [snapshot],
  );
  const deviationMHz = Math.round((snapshot.frequencyHz - 60) * 1000);
  const isCharging = snapshot.essFlowMW < 0;

  return (
    <div className={`${styles.root} flex h-dvh flex-col overflow-hidden`}>
      <div aria-hidden className={styles.powerStrip} />

      <div className="flex min-h-0 flex-1">
        <nav aria-label="주요 섹션" className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-[var(--hair)] bg-[var(--bg-1)] py-4 md:w-16">
          <span aria-hidden className="mb-3 font-mono text-xs font-bold tracking-tight text-[var(--amber-strong)]">
            60
          </span>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              title={label}
              className="flex h-11 w-11 items-center justify-center rounded-sm text-[var(--ink-2)] transition-colors hover:bg-[var(--bg-2)] hover:text-[var(--ink-0)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
            >
              <Icon aria-hidden size={18} />
              <span className="sr-only">{label} 섹션으로 이동</span>
            </a>
          ))}
        </nav>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-[var(--hair)] bg-[var(--bg-1)] px-4 py-3 md:px-6">
            <div className="flex items-baseline gap-3">
              <h1 className="font-mono text-xl font-bold tracking-tight text-[var(--ink-0)]">
                60<span className="text-[var(--amber-strong)]">HZ</span>
              </h1>
              <p className="hidden text-sm text-[var(--ink-2)] sm:block">계통 급전 콘솔 · 중부 계통관제센터</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div role="group" aria-label="조회 시점 선택" className="flex overflow-hidden rounded-sm border border-[var(--hair-strong)]">
                {SNAPSHOTS.map((snap, index) => (
                  <button
                    key={snap.id}
                    type="button"
                    aria-pressed={index === snapshotIndex}
                    onClick={() => setSnapshotIndex(index)}
                    className={`inline-flex min-h-11 items-center border-r border-[var(--hair-strong)] px-3 font-mono text-xs tabular-nums last:border-r-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--focus-ring)] ${
                      index === snapshotIndex
                        ? "bg-[var(--amber-dim)] text-[var(--amber-strong)]"
                        : "bg-[var(--bg-2)] text-[var(--ink-2)] hover:text-[var(--ink-0)]"
                    }`}
                  >
                    {snap.timeLabel}
                    <span className="ml-1.5 hidden md:inline">{snap.label}</span>
                  </button>
                ))}
              </div>

              <div className="hidden items-center gap-2 border-l border-[var(--hair)] pl-4 lg:flex">
                <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-2)] font-mono text-xs font-semibold text-[var(--ink-1)]">
                  김도
                </span>
                <div className="leading-tight">
                  <p className="text-xs font-medium text-[var(--ink-0)]">급전원 김도윤</p>
                  <p className="font-mono text-[11px] text-[var(--ink-2)]">
                    {ALARM_COUNT > 0 ? `미해결 경보 ${ALARM_COUNT}건` : "경보 없음"}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <p className="border-b border-[var(--hair)] bg-[var(--bg-0)] px-4 py-1.5 font-mono text-xs tabular-nums text-[var(--ink-2)] md:px-6">
            스냅샷 조회 · 기준시각 {snapshot.asOf} (실시간 스트림 아님)
          </p>

          <main className={`${styles.scrollX} min-w-0 flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6`}>
            <section id="overview" aria-labelledby="overview-heading" className="mb-6">
              <h2 id="overview-heading" className="sr-only">
                핵심 지표
              </h2>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-[var(--hair)] bg-[var(--hair)] sm:grid-cols-5">
                <KpiCard
                  label="계통주파수"
                  value={hzFormatter.format(snapshot.frequencyHz)}
                  unit="Hz"
                  delta={`기준대비 ${deviationMHz >= 0 ? "+" : ""}${deviationMHz}mHz`}
                  icon={<Gauge aria-hidden size={13} />}
                />
                <KpiCard
                  label="총수요"
                  value={mwFormatter.format(totalDemandMW)}
                  unit="MW"
                  delta={elevatedSubCount > 0 ? `${elevatedSubCount}개 변전소 주의 이상` : "전 변전소 정상"}
                  deltaTone={elevatedSubCount > 0 ? "up" : "normal"}
                  icon={<Activity aria-hidden size={13} />}
                />
                <KpiCard
                  label="총발전"
                  value={mwFormatter.format(totalGenMW)}
                  unit="MW"
                  delta={`${onlineCount}/${GEN_SOURCES.length}기 가동`}
                  icon={<Zap aria-hidden size={13} />}
                />
                <KpiCard
                  label="예비율"
                  value={pctFormatter.format(snapshot.reservePct)}
                  unit="%"
                  delta={snapshot.reservePct < 10 ? "예비력 타이트" : "여유 충분"}
                  deltaTone={snapshot.reservePct < 10 ? "up" : "normal"}
                  icon={<Percent aria-hidden size={13} />}
                />
                <KpiCard
                  label="ESS SOC"
                  value={pctFormatter.format(snapshot.essSocPct)}
                  unit="%"
                  delta={isCharging ? "충전 중" : "방전 중"}
                  deltaTone={isCharging ? "down" : "up"}
                  icon={<BatteryCharging aria-hidden size={13} />}
                  className="col-span-2 sm:col-span-1"
                />
              </div>
            </section>

            <div className="grid grid-cols-12 gap-4 md:gap-6">
              <Panel
                id="sld"
                code="SLD-01"
                eyebrow="SINGLE-LINE DIAGRAM"
                title="단선 결선도"
                className={`${styles.fadeIn} col-span-12 xl:col-span-8`}
                action={<FilterGroup filter={filter} onChange={setFilter} />}
              >
                <OneLineDiagram snapshot={snapshot} selectedId={selectedId} onSelect={setSelectedId} filter={filter} />
              </Panel>

              <div className="col-span-12 flex min-w-0 flex-col gap-4 md:gap-6 xl:col-span-4">
                <Panel id="freq" code="FRQ-01" eyebrow="SYSTEM FREQUENCY" title="계통 주파수" className={styles.fadeIn}>
                  <FrequencyRuler snapshot={snapshot} />
                </Panel>
                <Panel id="detail" code="DET-01" eyebrow="SELECTED ASSET" title="선택 설비 상세" className={styles.fadeIn}>
                  <SelectedDetail selectedId={selectedId} snapshot={snapshot} />
                </Panel>
              </div>

              <Panel
                id="dispatch"
                code="DSP-01"
                eyebrow="MERIT ORDER"
                title="급전 순위 스택"
                className={`${styles.fadeIn} col-span-12 mt-2 lg:col-span-7`}
              >
                <MeritOrderStack snapshot={snapshot} selectedId={selectedId} onSelect={setSelectedId} filter={filter} />
              </Panel>

              <Panel
                id="ess"
                code="ESS-01"
                eyebrow="STORAGE"
                title="중앙 ESS 스테이션"
                className={`${styles.fadeIn} col-span-12 mt-2 min-w-0 md:col-span-6 lg:col-span-5`}
              >
                <EssBand snapshot={snapshot} />
              </Panel>

              <Panel
                id="daily"
                code="MIX-01"
                eyebrow="DAILY SUPPLY-DEMAND"
                title="일일 수급 곡선"
                className={`${styles.fadeIn} col-span-12 mt-2 lg:col-span-7`}
              >
                <DailyMixCurve activeHour={snapshot.hour} activeLabel={`${snapshot.timeLabel} · ${snapshot.label}`} />
              </Panel>

              <Panel
                id="substations"
                code="SUB-01"
                eyebrow="SUBSTATION LOAD"
                title="변전소 부하 현황"
                className={`${styles.fadeIn} col-span-12 mt-2 min-w-0 md:col-span-6 lg:col-span-5`}
              >
                <SubstationTable snapshot={snapshot} selectedId={selectedId} onSelect={setSelectedId} />
              </Panel>

              <Panel
                id="events"
                code="LOG-01"
                eyebrow="EVENT LOG"
                title="이벤트 로그"
                className={`${styles.fadeIn} col-span-12 mt-2`}
              >
                <EventLog />
              </Panel>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ filter, onChange }: { filter: GenType | "all"; onChange: (value: GenType | "all") => void }) {
  return (
    <div role="group" aria-label="발전원 필터 (결선도·급전순위 스택 공통 적용)" className="flex flex-wrap gap-1.5">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          aria-pressed={filter === f.value}
          onClick={() => onChange(f.value)}
          className={`inline-flex min-h-11 items-center rounded-full border px-3 font-mono text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] ${
            filter === f.value
              ? "border-[var(--amber)] bg-[var(--amber-dim)] text-[var(--amber-strong)]"
              : "border-[var(--hair-strong)] text-[var(--ink-2)] hover:text-[var(--ink-0)]"
          }`}
        >
          {f.value === "all" ? f.label : `${GEN_TYPE_LABEL[f.value]}`}
        </button>
      ))}
    </div>
  );
}
