"use client";

import {
  Atom,
  ArrowDownRight,
  ArrowUpRight,
  BatteryCharging,
  CircleAlert,
  CircleCheck,
  Flame,
  Sun,
  TriangleAlert,
  Wind,
  Zap,
} from "lucide-react";
import {
  FREQ_STATUS_LABEL,
  GEN_SOURCES,
  GEN_TYPE_LABEL,
  LOAD_TIER_LABEL,
  SUBSTATIONS,
  hzFormatter,
  loadTier,
  mwFormatter,
  mwhFormatter,
  pctFormatter,
  type FreqStatus,
  type Snapshot,
} from "./data";
import { StatusPill } from "./ui";

const RULER_MIN = -150;
const RULER_MAX = 150;
const RULER_W = 560;
const RULER_H = 64;
const RULER_MARGIN = { left: 36, right: 36 };
const PLOT_W = RULER_W - RULER_MARGIN.left - RULER_MARGIN.right;
const TICKS = [-150, -100, -50, 0, 50, 100, 150];

const round2 = (n: number) => Math.round(n * 100) / 100;

function xForDeviation(mHz: number) {
  const clamped = Math.max(RULER_MIN, Math.min(RULER_MAX, mHz));
  return round2(RULER_MARGIN.left + ((clamped - RULER_MIN) / (RULER_MAX - RULER_MIN)) * PLOT_W);
}

const STATUS_ICON: Record<FreqStatus, typeof CircleCheck> = {
  normal: CircleCheck,
  caution: CircleAlert,
  alarm: TriangleAlert,
};

const STATUS_COLOR: Record<FreqStatus, string> = {
  normal: "var(--amber-strong)",
  caution: "var(--caution)",
  alarm: "var(--alarm)",
};

export function FrequencyRuler({ snapshot }: { snapshot: Snapshot }) {
  const deviationMHz = Math.round((snapshot.frequencyHz - 60) * 1000);
  const StatusIcon = STATUS_ICON[snapshot.freqStatus];
  const color = STATUS_COLOR[snapshot.freqStatus];
  const trend = snapshot.freqTrendMHz;
  const trendMin = Math.min(...trend, -20);
  const trendMax = Math.max(...trend, 20);
  const sparkW = RULER_W;
  const sparkH = 32;
  const sparkPoints = trend
    .map((v, i) => {
      const x = round2((i / (trend.length - 1)) * sparkW);
      const y = round2(sparkH - ((v - trendMin) / (trendMax - trendMin || 1)) * sparkH);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <p className="flex items-baseline gap-2 font-mono text-4xl font-semibold tabular-nums tracking-tight text-[var(--ink-0)] md:text-5xl">
          {hzFormatter.format(snapshot.frequencyHz)}
          <span className="text-base font-medium text-[var(--ink-2)]">Hz</span>
        </p>
        <StatusPill tone={snapshot.freqStatus} icon={<StatusIcon aria-hidden size={13} />}>
          {FREQ_STATUS_LABEL[snapshot.freqStatus]} · {deviationMHz >= 0 ? "+" : ""}
          {deviationMHz}mHz
        </StatusPill>
      </div>

      <svg
        viewBox={`0 0 ${RULER_W} ${RULER_H}`}
        className="mt-4 h-auto w-full"
        role="img"
        aria-label={`계통주파수 편차 눈금. 기준 60.000헤르츠 대비 ${deviationMHz >= 0 ? "+" : ""}${deviationMHz}밀리헤르츠, ${FREQ_STATUS_LABEL[snapshot.freqStatus]} 상태`}
      >
        <g aria-hidden="true">
          {/* 대역 배경: 정상(중앙) / 주의 / 경보 */}
          <rect x={xForDeviation(-50)} y={18} width={xForDeviation(50) - xForDeviation(-50)} height={14} fill="var(--amber-dim)" opacity={0.5} />
          <rect x={xForDeviation(-100)} y={18} width={xForDeviation(-50) - xForDeviation(-100)} height={14} fill="var(--caution)" opacity={0.18} />
          <rect x={xForDeviation(50)} y={18} width={xForDeviation(100) - xForDeviation(50)} height={14} fill="var(--caution)" opacity={0.18} />
          <rect x={xForDeviation(-150)} y={18} width={xForDeviation(-100) - xForDeviation(-150)} height={14} fill="var(--alarm)" opacity={0.16} />
          <rect x={xForDeviation(100)} y={18} width={xForDeviation(150) - xForDeviation(100)} height={14} fill="var(--alarm)" opacity={0.16} />

          {TICKS.map((t) => (
            <g key={t}>
              <line x1={xForDeviation(t)} x2={xForDeviation(t)} y1={16} y2={34} stroke="var(--hair-strong)" strokeWidth={1} />
              <text x={xForDeviation(t)} y={48} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="var(--ink-2)">
                {t > 0 ? `+${t}` : t}
              </text>
            </g>
          ))}
        </g>

        {/* 편차 마커 */}
        <polygon
          points={`${xForDeviation(deviationMHz) - 6},10 ${xForDeviation(deviationMHz) + 6},10 ${xForDeviation(deviationMHz)},22`}
          fill={color}
        />
        <line
          x1={xForDeviation(deviationMHz)}
          x2={xForDeviation(deviationMHz)}
          y1={10}
          y2={32}
          stroke={color}
          strokeWidth={1.5}
        />
      </svg>

      <div className="mt-3 border-t border-[var(--hair)] pt-3">
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--ink-2)]">추이(최근 12틱)</p>
        <svg viewBox={`0 0 ${sparkW} ${sparkH}`} className="mt-1.5 h-8 w-full" role="img" aria-label="계통주파수 편차 최근 추이 스파크라인">
          <polyline points={sparkPoints} fill="none" stroke="var(--cyan)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export function EssBand({ snapshot }: { snapshot: Snapshot }) {
  const isCharging = snapshot.essFlowMW < 0;
  const energyMWh = round2((snapshot.essSocPct / 100) * snapshot.essCapacityMWh);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-baseline gap-1.5 font-mono text-3xl font-semibold tabular-nums tracking-tight text-[var(--ink-0)]">
          {pctFormatter.format(snapshot.essSocPct)}
          <span className="text-sm font-medium text-[var(--ink-2)]">% SOC</span>
        </p>
        <span
          className={`inline-flex items-center gap-1 font-mono text-sm font-medium tabular-nums ${isCharging ? "text-[var(--cyan)]" : "text-[var(--amber-strong)]"}`}
        >
          {isCharging ? <ArrowDownRight aria-hidden size={16} /> : <ArrowUpRight aria-hidden size={16} />}
          {isCharging ? "충전" : "방전"} {mwFormatter.format(Math.abs(snapshot.essFlowMW))}MW
        </span>
      </div>

      <div
        role="img"
        aria-label={`중앙 ESS 스테이션 충전율 ${pctFormatter.format(snapshot.essSocPct)}퍼센트, 저장 에너지 ${mwhFormatter.format(energyMWh)}메가와트시, 현재 ${isCharging ? "충전" : "방전"} 중`}
        className="mt-3 h-3 w-full overflow-hidden rounded-full border border-[var(--hair-strong)] bg-[var(--bg-2)]"
      >
        <div
          className={isCharging ? "h-full bg-[var(--cyan)]" : "h-full bg-[var(--amber)]"}
          style={{ width: `${snapshot.essSocPct}%` }}
        />
      </div>
      <p className="mt-2 font-mono text-xs tabular-nums text-[var(--ink-2)]">
        <BatteryCharging aria-hidden size={12} className="mr-1 inline-block align-text-bottom" />
        저장량 {mwhFormatter.format(energyMWh)} / {mwhFormatter.format(snapshot.essCapacityMWh)} MWh
      </p>
    </div>
  );
}

const TYPE_ICON = { solar: Sun, wind: Wind, nuclear: Atom, lng: Flame, ess: Zap } as const;

export function SelectedDetail({ selectedId, snapshot }: { selectedId: string | null; snapshot: Snapshot }) {
  if (!selectedId) {
    return (
      <p aria-live="polite" className="text-sm leading-relaxed text-[var(--ink-2)]">
        단선 결선도, 급전 순위 스택, 변전소 현황 중 하나를 선택하면 이 자리에 설비 상세 정보가
        표시됩니다.
      </p>
    );
  }

  const gen = GEN_SOURCES.find((g) => g.id === selectedId);
  if (gen) {
    const state = snapshot.gens.find((g) => g.genId === gen.id);
    const Icon = TYPE_ICON[gen.type];
    const isCharging = (state?.outputMW ?? 0) < 0;
    const isOpen = state?.breaker === "open";
    const utilizationPct = gen.type === "ess" ? null : Math.round(((state?.outputMW ?? 0) / gen.capacityMW) * 100);
    return (
      <div aria-live="polite">
        <div className="flex items-center gap-2 text-[var(--ink-1)]">
          <Icon aria-hidden size={16} />
          <p className="font-mono text-xs uppercase tracking-[0.1em]">{GEN_TYPE_LABEL[gen.type]} 발전기 · {gen.tag}</p>
        </div>
        <h3 className="mt-1 text-base font-semibold tracking-tight text-[var(--ink-0)]">{gen.name}</h3>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-[var(--ink-2)]">모선</dt>
            <dd className="font-mono tabular-nums text-[var(--ink-0)]">BUS-{gen.bus}</dd>
          </div>
          <div>
            <dt className="text-[var(--ink-2)]">차단기</dt>
            <dd className="font-mono tabular-nums text-[var(--ink-0)]">{isOpen ? "개방" : "폐로"}</dd>
          </div>
          <div>
            <dt className="text-[var(--ink-2)]">설비용량</dt>
            <dd className="font-mono tabular-nums text-[var(--ink-0)]">{mwFormatter.format(gen.capacityMW)} MW</dd>
          </div>
          <div>
            <dt className="text-[var(--ink-2)]">{isCharging ? "충전출력" : "현재출력"}</dt>
            <dd className="font-mono tabular-nums text-[var(--ink-0)]">
              {mwFormatter.format(Math.abs(state?.outputMW ?? 0))} MW
            </dd>
          </div>
          {utilizationPct !== null ? (
            <div className="col-span-2">
              <dt className="text-[var(--ink-2)]">가동률</dt>
              <dd className="font-mono tabular-nums text-[var(--ink-0)]">{utilizationPct}%</dd>
            </div>
          ) : null}
        </dl>
      </div>
    );
  }

  const sub = SUBSTATIONS.find((s) => s.id === selectedId);
  if (sub) {
    const state = snapshot.subs.find((s) => s.subId === sub.id);
    const ratio = ((state?.loadMW ?? 0) / sub.capacityMW) * 100;
    const tier = loadTier(ratio);
    return (
      <div aria-live="polite">
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--ink-1)]">
          변전소 · {sub.tag} · {sub.voltage}
        </p>
        <h3 className="mt-1 text-base font-semibold tracking-tight text-[var(--ink-0)]">{sub.name}</h3>
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <dt className="text-[var(--ink-2)]">모선</dt>
            <dd className="font-mono tabular-nums text-[var(--ink-0)]">BUS-{sub.bus}</dd>
          </div>
          <div>
            <dt className="text-[var(--ink-2)]">상태</dt>
            <dd className="font-mono tabular-nums text-[var(--ink-0)]">{LOAD_TIER_LABEL[tier]}</dd>
          </div>
          <div>
            <dt className="text-[var(--ink-2)]">설비용량</dt>
            <dd className="font-mono tabular-nums text-[var(--ink-0)]">{mwFormatter.format(sub.capacityMW)} MW</dd>
          </div>
          <div>
            <dt className="text-[var(--ink-2)]">현재부하</dt>
            <dd className="font-mono tabular-nums text-[var(--ink-0)]">{mwFormatter.format(state?.loadMW ?? 0)} MW</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-[var(--ink-2)]">부하율</dt>
            <dd className="font-mono tabular-nums text-[var(--ink-0)]">{pctFormatter.format(ratio)}%</dd>
          </div>
        </dl>
      </div>
    );
  }

  return null;
}
