"use client";

import { useId, useMemo, useState, useSyncExternalStore } from "react";
import {
  Amphora,
  Bell,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Clock,
  Droplets,
  FlaskConical,
  Gauge,
  MapPin,
  PackageCheck,
  ScrollText,
  Stamp,
  ThermometerSun,
  TriangleAlert,
  Truck,
} from "lucide-react";
import styles from "./texture.module.css";
import {
  INITIAL_TASKS,
  QUALITY_LOG,
  SHIPPING_QUEUE,
  STATUS_HEX,
  STATUS_META,
  TREND_LABELS,
  TREND_METRIC_META,
  TYPE_META,
  VESSELS,
  gradeCounts,
  progressPct,
  summarize,
  type Grade,
  type Task,
  type TrendMetric,
  type Vessel,
  type VesselStatus,
  type VesselType,
} from "./data";

/* ------------------------------------------------------------------ */
/* 공통 상수 & 훅                                                       */
/* ------------------------------------------------------------------ */

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B14A2A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4E9D8]";

const VINTAGE = "font-[family-name:var(--font-vintage)]";

const SUMMARY = summarize(VESSELS);
const GRADE_COUNTS = gradeCounts(VESSELS);
const OPEN_TASK_INITIAL = INITIAL_TASKS.filter((t) => !t.done).length;

const STATUS_ICON: Record<VesselStatus, typeof CheckCircle2> = {
  정상: CheckCircle2,
  주의: TriangleAlert,
  점검필요: CircleAlert,
  출고대기: PackageCheck,
};

const TYPE_FILTERS: { key: "전체" | VesselType }[] = [
  { key: "전체" },
  { key: "된장" },
  { key: "고추장" },
  { key: "간장" },
  { key: "막걸리" },
];

function typeCount(key: "전체" | VesselType): number {
  return key === "전체" ? VESSELS.length : VESSELS.filter((v) => v.type === key).length;
}

/** OS의 '동작 줄이기' 설정을 matchMedia로 직접 구독한다. JS로 트리거하는
 * scrollIntoView의 smooth/auto 분기에만 사용 — 진입 모션은 순수 CSS
 * 미디어쿼리(texture.module.css)로 별도 처리한다. */
function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}

/* ------------------------------------------------------------------ */
/* 작은 표시 컴포넌트                                                    */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-sm border-2 border-dashed border-[#2B1B10]/35 bg-[#EADFC7] px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-[#6B4226] uppercase">
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: VesselStatus }) {
  const meta = STATUS_META[status];
  const Icon = STATUS_ICON[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${meta.bg} ${meta.fg}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.5} />
      {meta.label}
    </span>
  );
}

/** 등급을 밀랍 인장 형태로 표시. 색이 아닌 글자(특/상/중/하)로 등급을
 * 구분하므로 색맹 사용자도 동일하게 인지할 수 있다. */
function GradeStamp({ grade }: { grade: Grade }) {
  return (
    <span
      className="relative -rotate-6 inline-grid h-14 w-14 shrink-0 place-items-center rounded-full border-[3px] border-double border-[#8C2F1B] text-[#8C2F1B]"
      aria-hidden="true"
    >
      <span className="absolute inset-1 rounded-full border border-dashed border-[#8C2F1B]/60" />
      <span className={`${VINTAGE} text-xl font-bold`}>{grade}</span>
    </span>
  );
}

const GRADE_SWATCH_CLASS: Record<Grade, string> = {
  특: "bg-[#8C2F1B]",
  상: "bg-[#B14A2A]",
  중: "bg-[#C48A1E]",
  하: "bg-[#8C6A2F]",
};

/* ------------------------------------------------------------------ */
/* 아날로그 다이얼 게이지 — 회전 바늘 방식(호(arc) 경로 계산 없이 rotate만 사용)  */
/* ------------------------------------------------------------------ */

function DialGauge({
  value,
  min,
  max,
  label,
  unit,
  color,
  size = 104,
}: {
  value: number;
  min: number;
  max: number;
  label: string;
  unit: string;
  color: string;
  size?: number;
}) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const angle = -150 + pct * 300;
  const ticks = Array.from({ length: 13 }, (_, i) => -150 + i * 25);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
        <circle cx="60" cy="60" r="52" fill="#FBF3E4" stroke="#2B1B10" strokeOpacity="0.15" strokeWidth="2" />
        <circle cx="60" cy="60" r="40" fill="none" stroke={color} strokeOpacity="0.18" strokeWidth="7" />
        {ticks.map((t, i) => (
          <line
            key={t}
            x1="60"
            y1="14"
            x2="60"
            y2={i % 3 === 0 ? 21 : 18}
            stroke="#2B1B10"
            strokeOpacity={i % 3 === 0 ? 0.55 : 0.28}
            strokeWidth={i % 3 === 0 ? 1.6 : 1}
            transform={`rotate(${t} 60 60)`}
          />
        ))}
        <g transform={`rotate(${angle} 60 60)`}>
          <line x1="60" y1="60" x2="60" y2="26" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
        </g>
        <circle cx="60" cy="60" r="6" fill={color} stroke="#FBF3E4" strokeWidth="1.5" />
      </svg>
      <p className="text-center leading-tight">
        <span className={`${VINTAGE} block text-lg font-bold text-[#2B1B10]`}>
          {value}
          <span className="text-xs font-semibold text-[#6B4226]">{unit}</span>
        </span>
        <span className="block text-[11px] font-bold tracking-wide text-[#6B4226]">{label}</span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 추이 스파크라인 — 브릭스/온도/산도 토글                                  */
/* ------------------------------------------------------------------ */

function TrendChart({ vessel, metric }: { vessel: Vessel; metric: TrendMetric }) {
  const titleId = useId();
  const gradId = useId();
  const meta = TREND_METRIC_META[metric];
  const points = vessel[meta.key];
  const width = 300;
  const height = 108;
  const padTop = 10;
  const padBottom = 22;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const spread = max - min || 1;
  const stepX = width / (points.length - 1 || 1);

  const coords = points.map((v, i) => ({
    x: i * stepX,
    y: height - padBottom - ((v - min) / spread) * (height - padTop - padBottom),
    v,
    label: TREND_LABELS[i] ?? `${i + 1}주 전`,
  }));
  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height - padBottom} L0,${height - padBottom} Z`;

  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={titleId} className="w-full">
        <title id={titleId}>
          {vessel.name} {meta.label} 추이 차트, 최저 {min}
          {meta.unit}, 최고 {max}
          {meta.unit}
        </title>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2={width}
            y1={padTop + (height - padTop - padBottom) * f}
            y2={padTop + (height - padTop - padBottom) * f}
            stroke="#2B1B10"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        ))}
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={meta.color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={meta.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradId})`} />
        <path d={line} fill="none" stroke={meta.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map(
          (c, i) =>
            i % 2 === 0 && (
              <text key={c.label} x={c.x} y={height - 4} fontSize="9" textAnchor="middle" fill="#6B4226">
                {c.label}
              </text>
            ),
        )}
        <circle
          cx={coords[coords.length - 1].x}
          cy={coords[coords.length - 1].y}
          r="4"
          fill={meta.color}
          stroke="#FBF3E4"
          strokeWidth="1.5"
        />
      </svg>
      <figcaption className="sr-only">
        <table>
          <caption>
            {vessel.name} {meta.label} 추이 상세 수치
          </caption>
          <thead>
            <tr>
              <th scope="col">시점</th>
              <th scope="col">
                {meta.label}({meta.unit})
              </th>
            </tr>
          </thead>
          <tbody>
            {coords.map((c) => (
              <tr key={c.label}>
                <td>{c.label}</td>
                <td>{c.v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* 등급 분포 도넛                                                        */
/* ------------------------------------------------------------------ */

function GradeDonut() {
  const size = 148;
  const r = 50;
  const circ = 2 * Math.PI * r;
  const total = VESSELS.length;
  const order: Grade[] = ["특", "상", "중", "하"];
  const colors: Record<Grade, string> = { 특: "#8C2F1B", 상: "#B14A2A", 중: "#C48A1E", 하: "#8C6A2F" };
  let acc = 0;
  const segments = order.map((g) => {
    const value = GRADE_COUNTS[g];
    const frac = value / total;
    const dash = `${(frac * circ).toFixed(2)} ${(circ - frac * circ).toFixed(2)}`;
    const dashOffset = -(acc * circ);
    acc += frac;
    return { g, value, frac, dash, dashOffset, color: colors[g] };
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="relative h-[148px] w-[148px] shrink-0">
        <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#E4D5B7" strokeWidth="16" />
          {segments.map((s) => (
            <circle
              key={s.g}
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="16"
              strokeDasharray={s.dash}
              strokeDashoffset={s.dashOffset}
              transform="rotate(-90 60 60)"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${VINTAGE} text-2xl font-bold text-[#2B1B10]`}>{total}</span>
          <span className="text-[11px] font-bold text-[#6B4226]">전체 독</span>
        </div>
      </div>
      <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-2 sm:w-auto">
        {segments.map((s) => (
          <li key={s.g} className="flex items-center gap-2 text-sm">
            <span aria-hidden="true" className={`h-3 w-3 shrink-0 rounded-sm ${GRADE_SWATCH_CLASS[s.g]}`} />
            <span className="font-bold text-[#2B1B10]">{s.g}급</span>
            <span className="text-[#6B4226]">
              {s.value}독 · {Math.round(s.frac * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 숙성 진행률 랭킹 — 눈금자 막대                                          */
/* ------------------------------------------------------------------ */

function RulerBar({ vessel }: { vessel: Vessel }) {
  const pct = progressPct(vessel);
  const width = 220;
  const barW = (pct / 100) * width;
  const color = STATUS_HEX[vessel.status];

  return (
    <li className="flex items-center gap-3">
      <span className="w-24 shrink-0 truncate text-right text-xs font-bold text-[#4A3423]">{vessel.name}</span>
      <svg viewBox={`0 0 ${width} 18`} width="100%" height="18" className="flex-1" aria-hidden="true">
        <rect x="0" y="3" width={width} height="12" rx="2" fill="#E4D5B7" />
        {Array.from({ length: 22 }).map((_, i) => (
          <line
            key={i}
            x1={i * (width / 22)}
            y1="3"
            x2={i * (width / 22)}
            y2="15"
            stroke="#2B1B10"
            strokeOpacity="0.14"
            strokeWidth="1"
          />
        ))}
        <rect x="0" y="3" width={barW} height="12" rx="2" fill={color} />
      </svg>
      <span className="w-10 shrink-0 text-xs font-bold text-[#2B1B10]">{pct}%</span>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* 메인 컴포넌트                                                         */
/* ------------------------------------------------------------------ */

export default function OnggiDashboard() {
  const [typeFilter, setTypeFilter] = useState<"전체" | VesselType>("전체");
  const [selectedId, setSelectedId] = useState<string>("V09");
  const [metric, setMetric] = useState<TrendMetric>("brix");
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const reducedMotion = usePrefersReducedMotion();
  const detailHeadingId = useId();
  const liveRegionId = useId();

  const filteredVessels = useMemo(
    () => (typeFilter === "전체" ? VESSELS : VESSELS.filter((v) => v.type === typeFilter)),
    [typeFilter],
  );
  const selectedVessel = useMemo(
    () => VESSELS.find((v) => v.id === selectedId) ?? VESSELS[0],
    [selectedId],
  );
  const openTaskCount = tasks.filter((t) => !t.done).length;
  const sortedByProgress = useMemo(
    () => [...VESSELS].sort((a, b) => progressPct(b) - progressPct(a)).slice(0, 8),
    [],
  );

  function selectVessel(id: string) {
    setSelectedId(id);
    const panel = document.getElementById("vessel-detail-panel");
    if (panel && window.matchMedia("(max-width: 1023px)").matches) {
      panel.scrollIntoView({ block: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
    }
  }

  function toggleTask(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  return (
    <div className={`min-h-dvh text-[#2B1B10] ${styles.paper}`}>
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 rounded-full bg-[#2B1B10] px-5 py-3 text-sm font-bold text-[#F6EEDD] ${FOCUS_RING}`}
      >
        본문으로 건너뛰기
      </a>

      {/* 앱 셸 상단바 */}
      <header className="sticky top-0 z-20 border-b-4 border-double border-[#2B1B10]/70 bg-[#F4E9D8]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#2B1B10] bg-[#2B1B10] text-[#F6EEDD]"
            >
              <Amphora className="h-5 w-5" strokeWidth={2} />
            </span>
            <p className="leading-tight">
              <span className={`${VINTAGE} block text-xl font-bold text-[#2B1B10]`}>옹기</span>
              <span className="block text-[10px] font-bold tracking-[0.22em] text-[#6B4226] uppercase">
                Fermentation Ops
              </span>
            </p>
          </div>

          <nav aria-label="주요 메뉴" className="order-3 w-full sm:order-none sm:w-auto">
            <ul className="flex flex-wrap items-center gap-1.5 text-sm font-bold">
              {[
                { href: "#home", label: "홈" },
                { href: "#vessels", label: "장독대" },
                { href: "#report", label: "품질 리포트" },
                { href: "#shipping", label: "출고 관리" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`inline-flex min-h-11 items-center rounded-full border-2 border-transparent px-4 text-[#2B1B10] transition-colors hover:border-[#2B1B10]/25 ${FOCUS_RING}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#tasks"
              aria-label={`오늘 처리할 작업 ${openTaskCount}건, 작업 목록으로 이동`}
              className={`relative grid h-11 w-11 place-items-center rounded-full border-2 border-[#2B1B10]/20 text-[#2B1B10] transition-colors hover:bg-[#2B1B10]/5 ${FOCUS_RING}`}
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {openTaskCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-[#B14A2A] text-[10px] font-bold text-[#F6EEDD]"
                >
                  {openTaskCount}
                </span>
              )}
            </a>
            <div className="hidden items-center gap-2 rounded-full border-2 border-[#2B1B10]/20 py-1 pr-3 pl-1.5 sm:flex">
              <span
                aria-hidden="true"
                className="grid h-8 w-8 place-items-center rounded-full bg-[#C48A1E] text-xs font-bold text-[#2B1B10]"
              >
                봉
              </span>
              <span className="text-xs font-bold text-[#4A3423]">해담장 3공장 · 봉만수</span>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* ============================================================ */}
        {/* 홈 — 히어로 + KPI + 오늘의 작업                                    */}
        {/* ============================================================ */}
        <section aria-labelledby="hero-heading" id="home" className={`scroll-mt-24 ${styles.enter}`}>
          <p className="mb-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#B14A2A]">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            2026년 7월 11일 토요일 · 해담장 3공장
          </p>
          <h1 id="hero-heading" className={`${VINTAGE} max-w-3xl text-4xl leading-[1.12] font-bold sm:text-5xl`}>
            오늘, 12개의 독이 조용히 익어가고 있어요
          </h1>
          <p className="mt-4 max-w-2xl text-base text-[#4A3423]">
            A~C구역 장독대 {SUMMARY.total}독을 관제합니다. 평균 숙성 진행률{" "}
            <strong className="text-[#2B1B10]">{SUMMARY.avgProgress}%</strong>, 특급 비율{" "}
            <strong className="text-[#2B1B10]">{SUMMARY.eliteRatio}%</strong>이고, 오늘 처리할 작업은{" "}
            <strong className="text-[#2B1B10]">{openTaskCount}건</strong> 남았어요.
          </p>

          <h2 className="sr-only">핵심 지표</h2>
          <ul className={`mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 ${styles.enterDelay1}`}>
            {[
              { icon: Amphora, value: `${SUMMARY.total}개`, label: "가동 중인 독", rotate: "-rotate-3" },
              { icon: Gauge, value: `${SUMMARY.avgProgress}%`, label: "평균 숙성 진행률", rotate: "rotate-2" },
              { icon: Stamp, value: `${SUMMARY.eliteRatio}%`, label: "특급 비율", rotate: "-rotate-6" },
              { icon: ClipboardList, value: `${openTaskCount}건`, label: "오늘 처리할 작업", rotate: "rotate-1" },
            ].map((kpi) => (
              <li key={kpi.label}>
                <div
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-[#2B1B10]/40 bg-[#FBF3E4] px-3 py-5 text-center shadow-[3px_3px_0_0_#2B1B10] ${kpi.rotate}`}
                >
                  <kpi.icon className="h-6 w-6 text-[#B14A2A]" aria-hidden="true" strokeWidth={2} />
                  <span className={`${VINTAGE} text-2xl font-bold text-[#2B1B10]`}>{kpi.value}</span>
                  <span className="text-[11px] font-bold text-[#6B4226]">{kpi.label}</span>
                </div>
              </li>
            ))}
          </ul>

          {/* 오늘의 작업 체크리스트 */}
          <div
            id="tasks"
            className={`mt-10 scroll-mt-24 rounded-lg border-2 border-[#2B1B10]/25 bg-[#FBF3E4] p-5 sm:p-6 ${styles.enterDelay2}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className={`${VINTAGE} text-xl font-bold text-[#2B1B10]`}>오늘의 작업</h2>
              <p aria-live="polite" className="text-sm font-bold text-[#6B4226]">
                {tasks.length - openTaskCount} / {tasks.length} 완료
              </p>
            </div>
            <ul className="mt-4 divide-y divide-dashed divide-[#2B1B10]/25">
              {tasks.map((t) => (
                <li key={t.id} className="py-2.5 first:pt-0 last:pb-0">
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleTask(t.id)}
                      className={`h-5 w-5 shrink-0 rounded-sm border-2 border-[#2B1B10]/50 accent-[#B14A2A] ${FOCUS_RING}`}
                    />
                    <span className={t.done ? "text-[#6B4226] line-through" : "font-semibold text-[#2B1B10]"}>
                      {t.label}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 장독대 현황                                                     */}
        {/* ============================================================ */}
        <section aria-labelledby="vessels-heading" id="vessels" className="mt-16 scroll-mt-24">
          <SectionLabel>장독대 현황</SectionLabel>
          <h2 id="vessels-heading" className={`${VINTAGE} mt-3 text-3xl font-bold text-[#2B1B10]`}>
            우리 장독대, {VESSELS.length}독
          </h2>

          <div role="group" aria-label="독 유형 필터" className="mt-5 flex flex-wrap gap-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                aria-pressed={typeFilter === f.key}
                onClick={() => setTypeFilter(f.key)}
                className={`inline-flex min-h-11 items-center rounded-full border-2 px-4 text-sm font-bold transition-colors ${FOCUS_RING} ${
                  typeFilter === f.key
                    ? "border-[#2B1B10] bg-[#2B1B10] text-[#F6EEDD]"
                    : "border-[#2B1B10]/25 bg-[#FBF3E4] text-[#4A3423] hover:border-[#2B1B10]/50"
                }`}
              >
                {f.key} <span className="ml-1 opacity-70">{typeCount(f.key)}</span>
              </button>
            ))}
          </div>

          <p aria-live="polite" id={liveRegionId} className="sr-only">
            {selectedVessel.name} 상세 정보 표시 중
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
            {filteredVessels.length === 0 ? (
              <p className="rounded-lg border-2 border-dashed border-[#2B1B10]/30 bg-[#FBF3E4] p-8 text-center text-sm font-semibold text-[#6B4226]">
                해당 유형의 독이 없습니다. 다른 필터를 선택해 보세요.
              </p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {filteredVessels.map((v) => {
                  const isSelected = v.id === selectedVessel.id;
                  return (
                    <li key={v.id}>
                      <button
                        type="button"
                        id={`vessel-${v.id}`}
                        onClick={() => selectVessel(v.id)}
                        aria-pressed={isSelected}
                        aria-describedby={liveRegionId}
                        className={`flex w-full flex-col gap-2.5 rounded-lg border-2 p-3 text-left transition-colors ${FOCUS_RING} ${
                          isSelected
                            ? "border-[#B14A2A] bg-[#FBF3E4] shadow-[4px_4px_0_0_#2B1B10]"
                            : "border-[#2B1B10]/15 bg-[#FBF3E4]/70 hover:border-[#2B1B10]/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            aria-hidden="true"
                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${TYPE_META[v.type].chipBg}`}
                          >
                            <Amphora className="h-5 w-5" color={TYPE_META[v.type].accent} strokeWidth={1.8} />
                          </span>
                          <StatusBadge status={v.status} />
                        </div>
                        <div>
                          <p className={`${VINTAGE} text-[15px] font-bold text-[#2B1B10]`}>{v.name}</p>
                          <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#6B4226]">
                            <MapPin className="h-3 w-3" aria-hidden="true" />
                            {v.zone}구역 · {v.daysAged}일째
                          </p>
                        </div>
                        <svg viewBox="0 0 100 6" width="100%" height="6" aria-hidden="true">
                          <rect x="0" y="0" width="100" height="6" rx="3" fill="#E4D5B7" />
                          <rect x="0" y="0" width={progressPct(v)} height="6" rx="3" fill="#B14A2A" />
                        </svg>
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#4A3423]">
                          <span>숙성 {progressPct(v)}%</span>
                          <span>{v.temp}°C</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* 상세 패널 */}
            <aside
              id="vessel-detail-panel"
              aria-labelledby={detailHeadingId}
              className="scroll-mt-24 rounded-lg border-2 border-[#2B1B10]/25 bg-[#FBF3E4] p-5 lg:sticky lg:top-24"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6B4226]">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {selectedVessel.zone}구역 · {selectedVessel.type}
                  </p>
                  <h3 id={detailHeadingId} className={`${VINTAGE} text-2xl font-bold text-[#2B1B10]`}>
                    {selectedVessel.name}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#6B4226]">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    최근 점검 {selectedVessel.lastChecked}
                  </p>
                </div>
                <GradeStamp grade={selectedVessel.grade} />
              </div>

              <div className="mt-3">
                <StatusBadge status={selectedVessel.status} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <DialGauge value={selectedVessel.temp} min={0} max={30} label="온도" unit="°C" color="#B14A2A" />
                <DialGauge value={selectedVessel.humidity} min={0} max={100} label="습도" unit="%" color="#4A3423" />
                <DialGauge value={selectedVessel.ph} min={3} max={7} label="산도" unit="pH" color="#6B4226" />
                <DialGauge value={selectedVessel.brix} min={0} max={30} label="당도" unit="°Bx" color="#C48A1E" />
              </div>

              <div className="mt-6">
                <div role="group" aria-label="추이 지표 선택" className="flex gap-1.5">
                  {(Object.keys(TREND_METRIC_META) as TrendMetric[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={metric === m}
                      onClick={() => setMetric(m)}
                      className={`min-h-9 flex-1 rounded-sm border-2 px-2 text-xs font-bold transition-colors ${FOCUS_RING} ${
                        metric === m
                          ? "border-[#2B1B10] bg-[#2B1B10] text-[#F6EEDD]"
                          : "border-[#2B1B10]/25 bg-[#F4E9D8] text-[#4A3423] hover:border-[#2B1B10]/50"
                      }`}
                    >
                      {TREND_METRIC_META[m].label}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <TrendChart vessel={selectedVessel} metric={metric} />
                </div>
              </div>

              <div className="mt-5 border-t-2 border-dashed border-[#2B1B10]/25 pt-4">
                <h4 className="text-xs font-bold tracking-wide text-[#6B4226] uppercase">최근 기록</h4>
                <ul className="mt-2 space-y-2 text-sm text-[#4A3423]">
                  <li className="flex items-start gap-2">
                    <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-[#B14A2A]" aria-hidden="true" />
                    {selectedVessel.lastChecked} 정기 점검 완료, {selectedVessel.grade}급 유지
                  </li>
                  <li className="flex items-start gap-2">
                    <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-[#B14A2A]" aria-hidden="true" />
                    목표 숙성 {selectedVessel.targetDays}일 중 {selectedVessel.daysAged}일 경과
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 품질 리포트                                                     */}
        {/* ============================================================ */}
        <section aria-labelledby="report-heading" id="report" className="mt-16 scroll-mt-24">
          <SectionLabel>품질 리포트</SectionLabel>
          <h2 id="report-heading" className={`${VINTAGE} mt-3 text-3xl font-bold text-[#2B1B10]`}>
            등급과 진행률, 한눈에
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border-2 border-[#2B1B10]/25 bg-[#FBF3E4] p-5">
              <h3 className="text-sm font-bold tracking-wide text-[#6B4226] uppercase">등급 분포</h3>
              <div className="mt-4">
                <GradeDonut />
              </div>
            </div>

            <div className="rounded-lg border-2 border-[#2B1B10]/25 bg-[#FBF3E4] p-5">
              <h3 className="text-sm font-bold tracking-wide text-[#6B4226] uppercase">숙성 진행률 랭킹</h3>
              <ul className="mt-4 space-y-3">
                {sortedByProgress.map((v) => (
                  <RulerBar key={v.id} vessel={v} />
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-lg border-2 border-[#2B1B10]/25 bg-[#FBF3E4]">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="px-5 pt-4 text-left text-sm font-bold tracking-wide text-[#6B4226] uppercase">
                최근 품질 검사 기록
              </caption>
              <thead>
                <tr className="border-b-2 border-dashed border-[#2B1B10]/25 text-[11px] font-bold tracking-wide text-[#6B4226] uppercase">
                  <th scope="col" className="px-5 py-3">
                    날짜
                  </th>
                  <th scope="col" className="px-3 py-3">
                    독
                  </th>
                  <th scope="col" className="px-3 py-3">
                    담당자
                  </th>
                  <th scope="col" className="px-3 py-3">
                    등급
                  </th>
                  <th scope="col" className="px-3 py-3">
                    비고
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-[#2B1B10]/15">
                {QUALITY_LOG.map((q) => (
                  <tr key={q.id}>
                    <td className="px-5 py-3 font-semibold whitespace-nowrap text-[#4A3423]">{q.date}</td>
                    <td className="px-3 py-3 font-bold whitespace-nowrap text-[#2B1B10]">{q.vesselName}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-[#4A3423]">{q.inspector}</td>
                    <td className="px-3 py-3">
                      <span className="inline-grid h-7 w-7 place-items-center rounded-full border-2 border-double border-[#8C2F1B] text-xs font-bold text-[#8C2F1B]">
                        {q.grade}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#4A3423]">{q.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 출고 관리                                                       */}
        {/* ============================================================ */}
        <section aria-labelledby="shipping-heading" id="shipping" className="mt-16 mb-4 scroll-mt-24">
          <SectionLabel>출고 관리</SectionLabel>
          <h2 id="shipping-heading" className={`${VINTAGE} mt-3 text-3xl font-bold text-[#2B1B10]`}>
            출고 대기 중인 배치
          </h2>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {SHIPPING_QUEUE.map((s) => (
              <li key={s.id}>
                <a
                  href={`#vessel-${s.vesselId}`}
                  className={`block rounded-lg border-2 border-[#2B1B10]/20 bg-[#FBF3E4] p-4 transition-colors hover:border-[#2B1B10]/45 ${FOCUS_RING}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`${VINTAGE} text-lg font-bold text-[#2B1B10]`}>{s.batchCode}</p>
                      <p className="text-xs font-semibold text-[#6B4226]">{s.vesselName}</p>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                  <svg viewBox="0 0 100 8" width="100%" height="8" className="mt-3" aria-hidden="true">
                    <rect x="0" y="0" width="100" height="8" rx="4" fill="#E4D5B7" />
                    <rect x="0" y="0" width={s.progress} height="8" rx="4" fill={STATUS_HEX[s.status]} />
                  </svg>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#4A3423]">
                    <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                    {s.etaLabel} · 독 상세 보기
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t-4 border-double border-[#2B1B10]/70 bg-[#EADFC7]">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs font-semibold text-[#6B4226] sm:px-6">
          옹기 OS · 발효는 데이터가 아니라 정성입니다 — 해담장 3공장 관제 화면
        </div>
      </footer>
    </div>
  );
}
