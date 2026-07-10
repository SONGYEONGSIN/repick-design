"use client";

import { useId, useRef, useState } from "react";
import { CheckCircle2, FlaskConical, PauseCircle } from "lucide-react";

type Tier = "top" | "heart" | "base";

interface Note {
  name: string;
  pct: number;
  tier: Tier;
}

interface RadarPoint {
  axis: string;
  target: number;
  actual: number;
}

interface Formula {
  code: string;
  name: string;
  notes: Note[];
  radar: RadarPoint[];
}

const FORMULAS: Formula[] = [
  {
    code: "No. 07",
    name: "앰버 녹턴",
    notes: [
      { name: "베르가못", pct: 14, tier: "top" },
      { name: "핑크페퍼", pct: 8, tier: "top" },
      { name: "다마스크 로즈", pct: 16, tier: "heart" },
      { name: "아이리스", pct: 10, tier: "heart" },
      { name: "앰버그리스", pct: 20, tier: "base" },
      { name: "통카빈", pct: 14, tier: "base" },
      { name: "화이트 머스크", pct: 18, tier: "base" },
    ],
    radar: [
      { axis: "시트러스", target: 20, actual: 18 },
      { axis: "플로럴", target: 45, actual: 42 },
      { axis: "우디", target: 55, actual: 58 },
      { axis: "앰버", target: 90, actual: 85 },
      { axis: "머스크", target: 70, actual: 74 },
      { axis: "스파이시", target: 30, actual: 26 },
    ],
  },
  {
    code: "No. 12",
    name: "네롤리 블랑",
    notes: [
      { name: "시칠리아 레몬", pct: 18, tier: "top" },
      { name: "네롤리", pct: 12, tier: "top" },
      { name: "오렌지 블라섬", pct: 20, tier: "heart" },
      { name: "자스민 삼박", pct: 8, tier: "heart" },
      { name: "화이트 머스크", pct: 22, tier: "base" },
      { name: "시더우드", pct: 12, tier: "base" },
      { name: "통카빈", pct: 8, tier: "base" },
    ],
    radar: [
      { axis: "시트러스", target: 70, actual: 74 },
      { axis: "플로럴", target: 80, actual: 76 },
      { axis: "우디", target: 30, actual: 28 },
      { axis: "앰버", target: 25, actual: 22 },
      { axis: "머스크", target: 55, actual: 58 },
      { axis: "스파이시", target: 15, actual: 12 },
    ],
  },
  {
    code: "No. 03",
    name: "베티버 퓌메",
    notes: [
      { name: "자몽", pct: 10, tier: "top" },
      { name: "카다멈", pct: 6, tier: "top" },
      { name: "베티버", pct: 24, tier: "heart" },
      { name: "파출리", pct: 10, tier: "heart" },
      { name: "오크모스", pct: 18, tier: "base" },
      { name: "통카빈", pct: 12, tier: "base" },
      { name: "팔로산토", pct: 20, tier: "base" },
    ],
    radar: [
      { axis: "시트러스", target: 25, actual: 22 },
      { axis: "플로럴", target: 15, actual: 14 },
      { axis: "우디", target: 85, actual: 88 },
      { axis: "앰버", target: 35, actual: 30 },
      { axis: "머스크", target: 20, actual: 18 },
      { axis: "스파이시", target: 60, actual: 64 },
    ],
  },
];

const TIER_LABEL: Record<Tier, string> = { top: "톱 노트", heart: "하트 노트", base: "베이스 노트" };
const TIER_BG: Record<Tier, string> = {
  top: "bg-[var(--tier-top)]",
  heart: "bg-[var(--tier-heart)]",
  base: "bg-[var(--tier-base)]",
};

type BatchStatus = "macerating" | "ready" | "resting";

interface Batch {
  code: string;
  formulaCode: string;
  formulaName: string;
  start: Date;
  progressDay: number;
  totalDays: number;
  ready: Date;
  status: BatchStatus;
}

const BATCHES: Batch[] = [
  { code: "BATCH-2506-A", formulaCode: "No. 07", formulaName: "앰버 녹턴", start: new Date(2026, 4, 12), progressDay: 42, totalDays: 56, ready: new Date(2026, 6, 7), status: "macerating" },
  { code: "BATCH-2504-C", formulaCode: "No. 12", formulaName: "네롤리 블랑", start: new Date(2026, 3, 30), progressDay: 56, totalDays: 56, ready: new Date(2026, 5, 25), status: "ready" },
  { code: "BATCH-2506-B", formulaCode: "No. 03", formulaName: "베티버 퓌메", start: new Date(2026, 5, 1), progressDay: 30, totalDays: 70, ready: new Date(2026, 7, 10), status: "macerating" },
  { code: "BATCH-2502-D", formulaCode: "No. 07", formulaName: "앰버 녹턴", start: new Date(2026, 1, 18), progressDay: 56, totalDays: 56, ready: new Date(2026, 3, 15), status: "resting" },
  { code: "BATCH-2505-E", formulaCode: "No. 12", formulaName: "네롤리 블랑", start: new Date(2026, 4, 20), progressDay: 48, totalDays: 56, ready: new Date(2026, 6, 15), status: "macerating" },
  { code: "BATCH-2503-F", formulaCode: "No. 03", formulaName: "베티버 퓌메", start: new Date(2026, 2, 10), progressDay: 70, totalDays: 70, ready: new Date(2026, 4, 19), status: "ready" },
];

const STATUS_META: Record<BatchStatus, { label: string; icon: typeof FlaskConical }> = {
  macerating: { label: "숙성중", icon: FlaskConical },
  ready: { label: "완성", icon: CheckCircle2 },
  resting: { label: "휴지", icon: PauseCircle },
};

const FILTERS: { key: "all" | BatchStatus; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "macerating", label: "숙성중" },
  { key: "ready", label: "완성" },
  { key: "resting", label: "휴지" },
];

const dateFmt = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });

const AXES = ["시트러스", "플로럴", "우디", "앰버", "머스크", "스파이시"];
const AXIS_ANGLES = AXES.map((_, i) => -90 + i * 60);
const RADAR_CX = 120;
const RADAR_CY = 120;
const RADAR_R = 82;

function polarPoint(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function ringPoints(value: number): string {
  return AXIS_ANGLES.map((deg) => {
    const [x, y] = polarPoint(RADAR_CX, RADAR_CY, (value / 100) * RADAR_R, deg);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function dataPoints(values: number[]): string {
  return values
    .map((v, i) => {
      const r = (Math.max(0, Math.min(100, v)) / 100) * RADAR_R;
      const [x, y] = polarPoint(RADAR_CX, RADAR_CY, r, AXIS_ANGLES[i]);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function BenchInteractive() {
  const [activeFormula, setActiveFormula] = useState(0);
  const [filter, setFilter] = useState<"all" | BatchStatus>("all");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelId = useId();
  const radarTitleId = useId();
  const radarDescId = useId();

  const formula = FORMULAS[activeFormula];
  const visibleBatches = filter === "all" ? BATCHES : BATCHES.filter((b) => b.status === filter);

  function onTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % FORMULAS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + FORMULAS.length) % FORMULAS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = FORMULAS.length - 1;
    else return;
    event.preventDefault();
    setActiveFormula(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <>
      {/* 포뮬러 구성 */}
      <section aria-labelledby="formula-heading" className="scroll-mt-24">
        <h2 id="formula-heading" className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--ink-soft)]">
          포뮬러 구성
        </h2>

        <div role="tablist" aria-label="포뮬러 선택" className="mt-5 flex flex-wrap gap-2 border-b border-[var(--line)] pb-4">
          {FORMULAS.map((f, index) => {
            const selected = index === activeFormula;
            return (
              <button
                key={f.code}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`${panelId}-tab-${index}`}
                aria-selected={selected}
                aria-controls={`${panelId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveFormula(index)}
                onKeyDown={(e) => onTabKeyDown(e, index)}
                className={`min-h-11 rounded-full border px-5 py-2 text-sm motion-safe:transition-colors motion-safe:duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] ${
                  selected
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)]"
                    : "border-[var(--line)] bg-transparent text-[var(--ink-soft)] hover:border-[var(--ink-soft)]"
                }`}
              >
                <span className="font-[family-name:var(--font-display)] italic">{f.code}</span>{" "}
                {f.name}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${panelId}-panel`}
          aria-labelledby={`${panelId}-tab-${activeFormula}`}
          tabIndex={0}
          className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]"
        >
          <div>
            <h3 className="font-[family-name:var(--font-noto-serif)] text-2xl font-light text-[var(--ink)]">
              {formula.code} — {formula.name}
            </h3>

            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">구성 비율</p>
            <div
              aria-hidden="true"
              className="mt-3 flex h-9 w-full overflow-hidden rounded-sm border border-[var(--line)]"
            >
              {formula.notes.map((note, i) => (
                <div
                  key={note.name}
                  style={{ width: `${note.pct}%` }}
                  className={`${TIER_BG[note.tier]} ${i !== 0 ? "border-l border-[var(--bone)]" : ""}`}
                />
              ))}
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {(["top", "heart", "base"] as Tier[]).map((tier) => (
                <div key={tier}>
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                    <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${TIER_BG[tier]}`} aria-hidden="true" />
                    {TIER_LABEL[tier]}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-[var(--ink)]">
                    {formula.notes
                      .filter((n) => n.tier === tier)
                      .map((n) => (
                        <li key={n.name} className="flex items-baseline justify-between gap-3 border-b border-[var(--line)] py-1">
                          <span>{n.name}</span>
                          <span className="tabular-nums text-[var(--ink-soft)]">{n.pct}%</span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">후각 프로파일 QC · 목표 대비 실측</p>
            <svg
              viewBox="-50 -50 340 340"
              role="img"
              aria-labelledby={`${radarTitleId} ${radarDescId}`}
              className="mx-auto mt-3 w-full max-w-[260px]"
            >
              <title id={radarTitleId}>{`${formula.name} 후각 프로파일`}</title>
              <desc id={radarDescId}>
                {formula.radar.map((r) => `${r.axis} 목표 ${r.target}, 실측 ${r.actual}`).join("; ")}
              </desc>
              {[25, 50, 75, 100].map((ring) => (
                <polygon key={ring} points={ringPoints(ring)} fill="none" stroke="var(--line)" strokeWidth={1} />
              ))}
              {AXIS_ANGLES.map((deg, i) => {
                const [x, y] = polarPoint(RADAR_CX, RADAR_CY, RADAR_R, deg);
                return <line key={AXES[i]} x1={RADAR_CX} y1={RADAR_CY} x2={x} y2={y} stroke="var(--line)" strokeWidth={1} />;
              })}
              <polygon
                points={dataPoints(formula.radar.map((r) => r.target))}
                fill="none"
                stroke="var(--ink)"
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              <polygon
                points={dataPoints(formula.radar.map((r) => r.actual))}
                fill="var(--gold-deep)"
                fillOpacity={0.16}
                stroke="var(--gold-deep)"
                strokeWidth={2}
              />
              {AXIS_ANGLES.map((deg, i) => {
                const [x, y] = polarPoint(RADAR_CX, RADAR_CY, RADAR_R + 22, deg);
                const cos = Math.cos((deg * Math.PI) / 180);
                const anchor = Math.abs(cos) < 0.2 ? "middle" : cos > 0 ? "start" : "end";
                return (
                  <text key={AXES[i]} x={x} y={y} textAnchor={anchor} dominantBaseline="middle" fontSize={11} fill="var(--ink-soft)">
                    {AXES[i]}
                  </text>
                );
              })}
            </svg>
            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
              {formula.radar.map((r) => (
                <div key={r.axis} className="flex items-center justify-between gap-2 border-b border-[var(--line)] py-1">
                  <dt className="text-[var(--ink)]">{r.axis}</dt>
                  <dd className="tabular-nums text-[var(--ink-soft)]">
                    목표 {r.target} · 실측 {r.actual}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 숙성실 현황 */}
      <section aria-labelledby="maceration-heading" className="mt-20 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-4">
          <h2 id="maceration-heading" className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--ink-soft)]">
            숙성실 현황
          </h2>
          <div role="group" aria-label="숙성 상태 필터" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const selected = filter === f.key;
              const count = f.key === "all" ? BATCHES.length : BATCHES.filter((b) => b.status === f.key).length;
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFilter(f.key)}
                  className={`min-h-11 rounded-full border px-4 py-2 text-sm motion-safe:transition-colors motion-safe:duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ink)] ${
                    selected
                      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--cream)]"
                      : "border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--ink-soft)]"
                  }`}
                >
                  {f.label} <span className="tabular-nums">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-6 divide-y divide-[var(--line)]">
          {visibleBatches.map((batch) => {
            const meta = STATUS_META[batch.status];
            const Icon = meta.icon;
            const pct = Math.round((batch.progressDay / batch.totalDays) * 100);
            return (
              <li key={batch.code} className="grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                <div>
                  <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-[family-name:var(--font-display)] text-lg italic text-[var(--ink)]">{batch.code}</span>
                    <span className="text-sm text-[var(--ink-soft)]">
                      {batch.formulaCode} — {batch.formulaName}
                    </span>
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div aria-hidden="true" className="h-[3px] w-full max-w-64 flex-1 rounded-full bg-[var(--line)]">
                      <div
                        className="h-full rounded-full bg-[var(--ink)]"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs tabular-nums text-[var(--ink-soft)]">
                      {batch.progressDay}/{batch.totalDays}일차
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[var(--ink-soft)]">
                    시작 {dateFmt.format(batch.start)} · 예상 완료 {dateFmt.format(batch.ready)}
                  </p>
                </div>
                <p className="flex items-center gap-2 text-sm font-medium text-[var(--ink)] sm:justify-self-end">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                  {meta.label}
                </p>
              </li>
            );
          })}
          {visibleBatches.length === 0 ? (
            <li className="py-10 text-center text-sm text-[var(--ink-soft)]">해당 상태의 배치가 없습니다.</li>
          ) : null}
        </ul>
      </section>
    </>
  );
}
