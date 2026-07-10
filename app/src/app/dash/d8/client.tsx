"use client";

import { useId, useMemo, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Bell,
  Bug,
  CheckCircle2,
  Compass,
  Droplets,
  Flame,
  Hexagon,
  Leaf,
  MapPin,
  ThermometerSun,
  TriangleAlert,
  Unplug,
} from "lucide-react";
import styles from "./motion.module.css";
import {
  ALERTS,
  DISTRICT_LEADERBOARD,
  HIVES,
  NETWORK_BUZZ_SCORE,
  STATUS_META,
  TIME_RANGES,
  type Hive,
  type HiveStatus,
  type TimeRangeKey,
  computeNetworkStats,
  getWeightSeries,
} from "./data";

/* ------------------------------------------------------------------ */
/* 공통 상수 & 헬퍼                                                     */
/* ------------------------------------------------------------------ */

const HEX_CLIP =
  "[clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4B2069] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF7E8]";

const STATUS_FILTERS: { key: "all" | HiveStatus; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "healthy", label: "정상" },
  { key: "warning", label: "주의" },
  { key: "danger", label: "위험" },
  { key: "offline", label: "오프라인" },
];

const STATUS_ICON: Record<HiveStatus, typeof CheckCircle2> = {
  healthy: CheckCircle2,
  warning: TriangleAlert,
  danger: Flame,
  offline: Unplug,
};

const DIRECTIONS = ["북", "북동", "동", "남동", "남", "남서", "서", "북서"];

function bearingToLabel(deg: number): string {
  const idx = Math.round(deg / 45) % 8;
  return DIRECTIONS[idx];
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function SectionTag({
  as: Tag = "h2",
  children,
  tone = "plum",
}: {
  as?: "h2" | "h3";
  children: React.ReactNode;
  tone?: "plum" | "amber";
}) {
  const toneClass =
    tone === "plum" ? "bg-[#4B2069] text-[#FFF7E8]" : "bg-[#FFB627] text-[#241233]";
  const size = Tag === "h2" ? "text-xs" : "text-[11px]";
  return (
    <Tag
      className={`inline-block ${size} font-bold tracking-[0.14em] uppercase rounded-full px-3 py-1 ${toneClass}`}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* 링 게이지 (온도 · 습도 · 버즈 스코어)                                 */
/* ------------------------------------------------------------------ */

function RingGauge({
  pct,
  strokeHex,
  trackHex = "#EDE6D3",
  size = 116,
  strokeWidth = 12,
  children,
}: {
  pct: number;
  strokeHex: string;
  trackHex?: string;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const r = 50;
  const circ = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, pct));
  const dash = `${circ * clamped} ${circ * (1 - clamped)}`;
  return (
    <div className="relative inline-block shrink-0 leading-[0]">
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" stroke={trackHex} strokeWidth={strokeWidth} />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={strokeHex}
          strokeWidth={strokeWidth}
          strokeDasharray={dash}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 꿀 저장량 추이 — 라인 + 영역 차트                                     */
/* ------------------------------------------------------------------ */

function WeightChart({ points, unit }: { points: { label: string; value: number }[]; unit: string }) {
  const titleId = useId();
  const width = 300;
  const height = 108;
  const padTop = 10;
  const padBottom = 22;
  const values = points.map((p) => p.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const spread = max - min || 1;
  const stepX = width / (points.length - 1 || 1);

  const coords = points.map((p, i) => {
    const x = i * stepX;
    const y = height - padBottom - ((p.value - min) / spread) * (height - padTop - padBottom);
    return { x, y, ...p };
  });
  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height - padBottom} L0,${height - padBottom} Z`;

  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={titleId} className="w-full">
        <title id={titleId}>꿀 저장량 추이 차트, 최저 {min.toFixed(1)}{unit}, 최고 {max.toFixed(1)}{unit}</title>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2={width}
            y1={padTop + (height - padTop - padBottom) * f}
            y2={padTop + (height - padTop - padBottom) * f}
            stroke="#241233"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        ))}
        <defs>
          <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4B2069" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4B2069" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#weightFill)" />
        <path d={line} fill="none" stroke="#4B2069" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {coords
          .filter((c) => c.label)
          .map((c) => (
            <text key={c.label + c.x} x={c.x} y={height - 4} fontSize="9" textAnchor="middle" fill="#6b5a80">
              {c.label}
            </text>
          ))}
        <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="4" fill="#FF5D8F" stroke="#FFF7E8" strokeWidth="1.5" />
      </svg>
      <figcaption className="sr-only">
        <table>
          <caption>꿀 저장량 추이 상세 수치</caption>
          <thead>
            <tr>
              <th scope="col">시점</th>
              <th scope="col">저장량({unit})</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p, i) => (
              <tr key={i}>
                <td>{p.label || `지점 ${i + 1}`}</td>
                <td>{p.value.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* 입/출 활동 — 다이버징 막대 차트                                       */
/* ------------------------------------------------------------------ */

function TrafficChart({ buckets }: { buckets: { label: string; in: number; out: number }[] }) {
  const titleId = useId();
  const width = 300;
  const baseline = 66;
  const maxBar = 52;
  const maxVal = Math.max(1, ...buckets.map((b) => Math.max(b.in, b.out)));
  const barW = width / buckets.length;

  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${width} 128`} role="img" aria-labelledby={titleId} className="w-full">
        <title id={titleId}>시간대별 벌 입장 및 퇴장 수 다이버징 막대 차트</title>
        <line x1="0" x2={width} y1={baseline} y2={baseline} stroke="#241233" strokeOpacity="0.25" strokeWidth="1" />
        {buckets.map((b, i) => {
          const inH = (b.in / maxVal) * maxBar;
          const outH = (b.out / maxVal) * maxBar;
          const x = i * barW + barW * 0.18;
          const w = barW * 0.64;
          return (
            <g key={b.label}>
              <rect x={x} y={baseline - inH} width={w} height={inH} rx="2" fill="#FFB627" />
              <rect x={x} y={baseline} width={w} height={outH} rx="2" fill="#4B2069" />
              {i % 2 === 0 && (
                <text x={x + w / 2} y="122" fontSize="9" textAnchor="middle" fill="#6b5a80">
                  {b.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#4A4458]">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-[#FFB627]" />
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          벌통 입장
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-[#4B2069]" />
          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          벌통 퇴장
        </span>
      </div>
      <p className="sr-only">
        시간대별 수치: {buckets.map((b) => `${b.label} 입장 ${b.in}마리, 퇴장 ${b.out}마리`).join(", ")}
      </p>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* 채집 방향 나침반                                                     */
/* ------------------------------------------------------------------ */

function ForageCompass({ bearing, confidence, distanceKm }: { bearing: number; confidence: number; distanceKm: number }) {
  const titleId = useId();
  const ringR = 18 + confidence * 24;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-labelledby={titleId}>
        <title id={titleId}>
          평균 채집 방향 {bearingToLabel(bearing)}쪽, 반경 {distanceKm}킬로미터, 신뢰도 {Math.round(confidence * 100)}퍼센트
        </title>
        <circle cx="60" cy="60" r="48" fill="none" stroke="#241233" strokeOpacity="0.12" strokeWidth="1.5" />
        <circle cx="60" cy="60" r={ringR} fill="#FF5D8F" fillOpacity="0.16" stroke="#FF5D8F" strokeOpacity="0.5" strokeDasharray="3 4" />
        <text x="60" y="16" fontSize="10" fontWeight="700" textAnchor="middle" fill="#241233">N</text>
        <text x="60" y="110" fontSize="10" fontWeight="700" textAnchor="middle" fill="#241233">S</text>
        <text x="10" y="64" fontSize="10" fontWeight="700" textAnchor="middle" fill="#241233">W</text>
        <text x="110" y="64" fontSize="10" fontWeight="700" textAnchor="middle" fill="#241233">E</text>
        <g transform={`rotate(${bearing} 60 60)`}>
          <line x1="60" y1="60" x2="60" y2="20" stroke="#4B2069" strokeWidth="3" strokeLinecap="round" />
          <circle cx="60" cy="20" r="5" fill="#4B2069" />
        </g>
        <circle cx="60" cy="60" r="4" fill="#241233" />
      </svg>
      <p className="text-center text-sm text-[#4A4458]">
        <span className="font-bold text-[#241233]">{bearingToLabel(bearing)}쪽</span> 방향 · 반경 {distanceKm}km · 신뢰도{" "}
        {Math.round(confidence * 100)}%
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 지구 리더보드 (SVG 막대)                                             */
/* ------------------------------------------------------------------ */

function DistrictBar({ district, pollinationIndex, rank }: { district: string; pollinationIndex: number; rank: number }) {
  const titleId = useId();
  const width = 220;
  const h = pollinationIndex;
  return (
    <li className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#241233] text-xs font-bold text-[#FFF7E8]"
      >
        {rank}
      </span>
      <span className="w-14 shrink-0 text-sm font-semibold text-[#241233]">{district}</span>
      <svg viewBox={`0 0 ${width} 22`} className="h-5 flex-1" role="img" aria-labelledby={titleId} preserveAspectRatio="none">
        <title id={titleId}>{district} 화분매개 지수 {pollinationIndex}점</title>
        <rect x="0" y="0" width={width} height="22" rx="11" fill="#EDE6D3" />
        <rect x="0" y="0" width={(width * h) / 100} height="22" rx="11" fill="#3FA65A" />
      </svg>
      <span className="w-10 shrink-0 text-right text-sm font-bold text-[#241233]">{pollinationIndex}</span>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* 메인 컴포넌트                                                        */
/* ------------------------------------------------------------------ */

export default function BeeaconDashboard() {
  const [statusFilter, setStatusFilter] = useState<"all" | HiveStatus>("all");
  const [selectedId, setSelectedId] = useState<string>("H07");
  const [range, setRange] = useState<TimeRangeKey>("7d");

  const stats = useMemo(() => computeNetworkStats(HIVES), []);
  const selectedHive = useMemo<Hive>(() => HIVES.find((h) => h.id === selectedId) ?? HIVES[0], [selectedId]);
  const filteredHives = useMemo(
    () => (statusFilter === "all" ? HIVES : HIVES.filter((h) => h.status === statusFilter)),
    [statusFilter],
  );
  const hiveRows = useMemo(() => chunk(filteredHives, 6), [filteredHives]);
  const weightSeries = useMemo(() => getWeightSeries(selectedHive, range), [selectedHive, range]);

  const detailHeadingId = useId();
  const mapHeadingId = useId();

  function selectHive(id: string) {
    setSelectedId(id);
    const el = document.getElementById("hive-detail-panel");
    if (el) el.scrollIntoView({ block: "nearest" });
  }

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-[#FFF7E8] text-[#241233]">
      {/* 장식용 블롭 — 스크린리더/포커스에서 완전히 배제 */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#FFB627]/30 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute top-40 -right-32 h-96 w-96 rounded-full bg-[#FF5D8F]/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#4B2069]/15 blur-3xl" />

      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 rounded-full bg-[#241233] px-5 py-3 text-sm font-semibold text-[#FFF7E8] ${FOCUS_RING}`}
      >
        본문으로 건너뛰기
      </a>

      {/* 앱 셸 상단바 */}
      <header className="relative z-10 border-b-2 border-[#241233]/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-2xl bg-[#241233] text-[#FFB627]">
              <Hexagon className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <p className="text-lg font-black tracking-tight">
              BEE<span className="text-[#B0223A]">ACON</span>
            </p>
          </div>

          <nav aria-label="주요 메뉴" className="order-3 w-full sm:order-none sm:w-auto">
            <ul className="flex flex-wrap items-center gap-2">
              <li>
                <span aria-current="page" className="inline-flex min-h-11 items-center rounded-full bg-[#241233] px-4 text-sm font-bold text-[#FFF7E8]">
                  개요
                </span>
              </li>
              {["벌통맵", "알림", "리포트"].map((label) => (
                <li key={label}>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="inline-flex min-h-11 cursor-not-allowed items-center rounded-full border-2 border-[#241233]/15 px-4 text-sm font-bold text-[#241233]/40"
                  >
                    {label}
                    <span className="sr-only">(준비 중)</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`relative grid h-11 w-11 place-items-center rounded-full border-2 border-[#241233]/15 text-[#241233] transition-colors hover:bg-[#241233]/5 ${FOCUS_RING}`}
              aria-label={`알림 ${stats.dangerCount + stats.warningCount}건`}
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-[#B0223A] text-[10px] font-bold text-white"
              >
                {stats.dangerCount + stats.warningCount}
              </span>
            </button>
            <div className="flex items-center gap-2 rounded-full border-2 border-[#241233]/15 py-1 pr-3 pl-1.5">
              <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-[#FF5D8F] text-xs font-bold text-[#241233]">
                도윤
              </span>
              <span className="hidden text-xs font-semibold text-[#4A4458] sm:inline">성수동 네트워크 · 운영자</span>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* 히어로 */}
        <section aria-labelledby="hero-heading" className={`grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center ${styles.enter}`}>
          <div>
            <p className="mb-3 text-sm font-bold text-[#B0223A]">2026년 7월 11일 토요일 · 맑음 28°C</p>
            <h1 id="hero-heading" className="font-[var(--font-display)] text-4xl leading-[1.08] font-normal italic sm:text-5xl">
              26개의 벌통이, 지금 이 순간에도 웅웅거리고 있어요
            </h1>
            <p className="mt-4 max-w-xl text-base text-[#4A4458]">
              성수 · 한남 · 합정 · 연남 · 을지로 5개 지구, 루프탑 벌통 {stats.total}개를 실시간으로 관제합니다. 오늘은{" "}
              <strong className="text-[#241233]">{stats.dangerCount}개 위험, {stats.warningCount}개 주의</strong> 상태예요.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 rounded-[2rem] border-2 border-[#241233]/10 bg-white/70 p-6 shadow-[6px_6px_0_0_#241233]">
            <RingGauge pct={NETWORK_BUZZ_SCORE / 100} strokeHex="#3FA65A" size={120} strokeWidth={13}>
              <span className="text-3xl font-black">{NETWORK_BUZZ_SCORE}</span>
              <span className="text-[11px] font-bold text-[#4A4458]">버즈 스코어</span>
            </RingGauge>
            <div className="text-sm text-[#4A4458]">
              <p className="font-bold text-[#176A34]">양호 · 어제보다 +2점</p>
              <p className="mt-1">네트워크 전반의 건강도·생산성·활동성을 종합한 지수예요.</p>
            </div>
          </div>
        </section>

        {/* KPI 헥스 */}
        <section aria-labelledby="kpi-heading" className={`mt-14 ${styles.enterDelay1}`}>
          <SectionTag as="h2">오늘의 핵심 지표</SectionTag>
          <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4">
            {[
              {
                icon: Activity,
                value: `${stats.active}/${stats.total}`,
                label: "활동 중인 벌통",
                bg: "bg-[#FFB627]",
                delta: "가동률 92%",
                deltaUp: true,
              },
              {
                icon: Leaf,
                value: `+${stats.honeyDeltaTotal}kg`,
                label: "오늘 꿀 생산량",
                bg: "bg-[#3FA65A]",
                delta: "어제 대비 +8%",
                deltaUp: true,
              },
              {
                icon: ThermometerSun,
                value: `${stats.avgTemp}°C`,
                label: "평균 벌통 온도",
                bg: "bg-[#FF5D8F]",
                delta: "정상 범위",
                deltaUp: true,
              },
              {
                icon: TriangleAlert,
                value: `${stats.dangerCount + stats.warningCount}건`,
                label: "확인 필요 알림",
                bg: "bg-[#4B2069]",
                delta: `위험 ${stats.dangerCount} · 주의 ${stats.warningCount}`,
                deltaUp: false,
                dark: true,
              },
            ].map((k) => (
              <li key={k.label} className="flex flex-col items-center text-center">
                <div className={`flex h-24 w-24 flex-col items-center justify-center gap-1 sm:h-28 sm:w-28 ${k.bg} ${HEX_CLIP}`}>
                  <k.icon className={`h-5 w-5 ${k.dark ? "text-[#FFF7E8]" : "text-[#241233]"}`} aria-hidden="true" />
                  <span className={`text-lg font-black sm:text-xl ${k.dark ? "text-[#FFF7E8]" : "text-[#241233]"}`}>{k.value}</span>
                </div>
                <p className="mt-2 text-xs font-bold text-[#241233]">{k.label}</p>
                <p className={`mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold ${k.deltaUp ? "text-[#176A34]" : "text-[#B0223A]"}`}>
                  {k.deltaUp ? <ArrowUp className="h-3 w-3" aria-hidden="true" /> : <ArrowDown className="h-3 w-3" aria-hidden="true" />}
                  {k.delta}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* 벌통 지도 + 상세 */}
        <section aria-labelledby={mapHeadingId} className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div className={styles.enterDelay2}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionTag as="h2">
                <span id={mapHeadingId}>벌통 지도</span>
              </SectionTag>
              <p className="text-xs font-semibold text-[#4A4458]">{filteredHives.length}개 표시 중</p>
            </div>

            <fieldset className="mt-4">
              <legend className="sr-only">상태로 벌통 필터링</legend>
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((f) => {
                  const active = statusFilter === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setStatusFilter(f.key)}
                      className={`min-h-11 rounded-full border-2 px-4 text-sm font-bold transition-colors ${FOCUS_RING} ${
                        active
                          ? "border-[#241233] bg-[#241233] text-[#FFF7E8]"
                          : "border-[#241233]/15 bg-white/60 text-[#241233] hover:bg-[#241233]/5"
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div role="group" aria-label="벌통 목록, 클릭하여 상세 보기" className="mt-6 flex flex-col gap-3 rounded-[2rem] border-2 border-[#241233]/10 bg-white/50 p-5">
              {hiveRows.length === 0 && <p className="py-6 text-center text-sm text-[#4A4458]">해당 상태의 벌통이 없어요.</p>}
              {hiveRows.map((row, ri) => (
                <div key={ri} className={`flex gap-2.5 ${ri % 2 === 1 ? "ml-6" : ""}`}>
                  {row.map((hive) => {
                    const meta = STATUS_META[hive.status];
                    const Icon = STATUS_ICON[hive.status];
                    const selected = hive.id === selectedHive.id;
                    return (
                      <button
                        key={hive.id}
                        type="button"
                        aria-pressed={selected}
                        aria-label={`${hive.name}, ${hive.district} 지구, 상태 ${meta.label}${hive.issue ? `, ${hive.issue}` : ""}`}
                        onClick={() => selectHive(hive.id)}
                        className={`flex h-14 w-12 shrink-0 flex-col items-center justify-center gap-0.5 transition-transform motion-safe:duration-150 ${meta.hexBg} ${HEX_CLIP} ${FOCUS_RING} ${
                          selected ? "scale-110 ring-4 ring-[#241233] ring-offset-2 ring-offset-[#FFF7E8]" : "hover:scale-105"
                        }`}
                      >
                        <span className={`text-[11px] font-black ${meta.hexText}`}>{hive.no}</span>
                        <Icon className={`h-3 w-3 ${meta.hexText}`} aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#4A4458]">
              {(Object.keys(STATUS_META) as HiveStatus[]).map((s) => (
                <li key={s} className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true" className={`h-3 w-3 rounded-sm ${STATUS_META[s].hexBg}`} />
                  {STATUS_META[s].label}
                </li>
              ))}
            </ul>
          </div>

          {/* 상세 패널 */}
          <div id="hive-detail-panel" className="scroll-mt-24 rounded-[2rem] border-2 border-[#241233]/10 bg-white/70 p-6 shadow-[6px_6px_0_0_#241233]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <SectionTag as="h2">
                  <span id={detailHeadingId}>벌통 상세</span>
                </SectionTag>
                <p className="mt-3 text-2xl font-black">{selectedHive.name}</p>
                <p className="inline-flex items-center gap-1 text-sm text-[#4A4458]">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {selectedHive.district} 지구 · 마지막 신호 {selectedHive.lastSeen}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${STATUS_META[selectedHive.status].badgeBg} ${STATUS_META[selectedHive.status].badgeText}`}
              >
                {(() => {
                  const Icon = STATUS_ICON[selectedHive.status];
                  return <Icon className="h-3.5 w-3.5" aria-hidden="true" />;
                })()}
                {STATUS_META[selectedHive.status].label}
              </span>
            </div>

            {selectedHive.issue && (
              <p className="mt-3 rounded-2xl bg-[#FFE1E8] px-4 py-2.5 text-sm font-semibold text-[#B0223A]">
                <TriangleAlert className="mr-1.5 inline h-4 w-4" aria-hidden="true" />
                {selectedHive.issue}
              </p>
            )}

            {/* 온도 / 습도 */}
            <h3 className="mt-6 mb-3 text-sm font-bold text-[#241233]">온도 · 습도</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-[#FFF7E8] p-4">
                <RingGauge
                  pct={selectedHive.temp === null ? 0 : Math.max(0, Math.min(1, (selectedHive.temp - 28) / (42 - 28)))}
                  strokeHex={selectedHive.status === "danger" ? "#B0223A" : selectedHive.status === "warning" ? "#FFB627" : "#3FA65A"}
                  size={88}
                  strokeWidth={9}
                >
                  <ThermometerSun className="h-4 w-4 text-[#4A4458]" aria-hidden="true" />
                  <span className="text-sm font-black">{selectedHive.temp === null ? "—" : `${selectedHive.temp}°C`}</span>
                </RingGauge>
                <p className="text-center text-[11px] text-[#4A4458]">정상 범위 33–36°C</p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-[#FFF7E8] p-4">
                <RingGauge
                  pct={selectedHive.humidity === null ? 0 : Math.max(0, Math.min(1, (selectedHive.humidity - 30) / (75 - 30)))}
                  strokeHex="#4B2069"
                  size={88}
                  strokeWidth={9}
                >
                  <Droplets className="h-4 w-4 text-[#4A4458]" aria-hidden="true" />
                  <span className="text-sm font-black">{selectedHive.humidity === null ? "—" : `${selectedHive.humidity}%`}</span>
                </RingGauge>
                <p className="text-center text-[11px] text-[#4A4458]">정상 범위 50–65%</p>
              </div>
            </div>

            {/* 꿀 저장량 추이 */}
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-[#241233]">꿀 저장량 추이 · {selectedHive.weightKg}kg</h3>
              <fieldset>
                <legend className="sr-only">기간 선택</legend>
                <div className="flex gap-1.5">
                  {TIME_RANGES.map((r) => {
                    const active = range === r.key;
                    return (
                      <button
                        key={r.key}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setRange(r.key)}
                        className={`min-h-9 rounded-full px-3 text-xs font-bold transition-colors ${FOCUS_RING} ${
                          active ? "bg-[#241233] text-[#FFF7E8]" : "bg-[#241233]/5 text-[#241233] hover:bg-[#241233]/10"
                        }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </div>
            <div className="mt-3">
              <WeightChart points={weightSeries} unit="kg" />
            </div>

            {/* 입출 활동 */}
            <h3 className="mt-7 mb-3 text-sm font-bold text-[#241233]">시간대별 입/출 활동</h3>
            <TrafficChart buckets={selectedHive.traffic} />

            {/* 채집 방향 */}
            <h3 className="mt-7 mb-3 text-sm font-bold text-[#241233]">
              <Compass className="mr-1.5 inline h-4 w-4" aria-hidden="true" />
              오늘의 채집 방향
            </h3>
            {selectedHive.status === "offline" ? (
              <p className="text-sm text-[#4A4458]">센서 신호가 없어 채집 방향을 계산할 수 없어요.</p>
            ) : (
              <ForageCompass bearing={selectedHive.forageBearingDeg} confidence={selectedHive.forageConfidence} distanceKm={selectedHive.forageDistanceKm} />
            )}
          </div>
        </section>

        {/* 하단: 알림 + 리더보드 */}
        <section className="mt-14 grid gap-8 lg:grid-cols-2">
          <section aria-labelledby="alerts-heading">
            <SectionTag as="h2" tone="amber">
              <span id="alerts-heading">최근 알림</span>
            </SectionTag>
            <ul className="mt-5 flex flex-col gap-3">
              {ALERTS.map((a) => {
                const isDanger = a.severity === "danger";
                return (
                  <li key={a.id}>
                    <button
                      type="button"
                      onClick={() => selectHive(a.hiveId)}
                      className={`flex w-full min-h-11 items-start gap-3 rounded-2xl border-2 border-[#241233]/10 bg-white/70 p-4 text-left transition-colors hover:bg-white ${FOCUS_RING}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${isDanger ? "bg-[#FFE1E8]" : "bg-[#FFEFC7]"}`}
                      >
                        {isDanger ? (
                          <Flame className="h-4 w-4 text-[#B0223A]" aria-hidden="true" />
                        ) : (
                          <Bug className="h-4 w-4 text-[#7A4E00]" aria-hidden="true" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-[#241233]">{a.hiveName}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isDanger ? "bg-[#FFE1E8] text-[#B0223A]" : "bg-[#FFEFC7] text-[#7A4E00]"
                            }`}
                          >
                            {isDanger ? "위험" : "주의"}
                          </span>
                          <span className="text-[11px] text-[#4A4458]">{a.time}</span>
                        </span>
                        <span className="mt-1 block text-sm text-[#4A4458]">{a.message}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="leaderboard-heading">
            <SectionTag as="h2" tone="amber">
              <span id="leaderboard-heading">지역별 화분매개 지수</span>
            </SectionTag>
            <p className="mt-3 text-sm text-[#4A4458]">이번 주 벌 활동을 기반으로 산출한 지구별 화분매개 활동 점수예요.</p>
            <ol className="mt-5 flex flex-col gap-3 rounded-[2rem] border-2 border-[#241233]/10 bg-white/70 p-5">
              {DISTRICT_LEADERBOARD.map((d, i) => (
                <DistrictBar key={d.district} district={d.district} pollinationIndex={d.pollinationIndex} rank={i + 1} />
              ))}
            </ol>
          </section>
        </section>

        <footer className="mt-16 border-t-2 border-[#241233]/10 pt-6 pb-4 text-center text-xs text-[#4A4458]">
          BEEACON — 도시 양봉 네트워크 관제 · 표시된 수치는 데모용 스냅샷입니다.
        </footer>
      </main>
    </div>
  );
}
