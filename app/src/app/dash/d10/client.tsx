"use client";

import { useId, useMemo, useState, useSyncExternalStore } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CircleCheckBig,
  Compass,
  LayoutDashboard,
  MoonStar,
  OctagonAlert,
  Pin,
  RadioTower,
  Satellite,
  Signal,
  Telescope,
  TriangleAlert,
  User,
  Wifi,
  WifiOff,
  Wind,
  Wrench,
} from "lucide-react";
import "./d10.css";
import {
  ANTENNAS,
  CONTACT_WINDOWS,
  KP_INDEX_NOW,
  KP_SERIES_24H,
  OBSERVATION_TARGETS,
  RADIATION_RISK,
  SNAPSHOT_LABEL,
  SOLAR_WIND_MAX,
  SOLAR_WIND_MIN,
  SOLAR_WIND_SPEED_KMS,
  SPACECRAFT,
  STORM_WATCH,
  TIME_RANGES,
  WIND_FORECAST,
  computeAntennaUptime,
  computeFleetSummary,
  formatAgo,
  formatHours,
  type AntennaStatus,
  type ObservationTarget,
  type Spacecraft,
  type SpacecraftStatus,
  type TimeRangeKey,
} from "./data";

/* -------------------------------------------------------------------------
 * Reduced-motion detection — matchMedia + useSyncExternalStore directly
 * (framer-motion식 훅은 일부 환경에서 OS 설정을 놓칠 수 있다). 서버 스냅샷은
 * false로 고정하고, CSS `prefers-reduced-motion` 미디어쿼리도 d10.css에
 * 이중으로 걸어 두어 이 훅이 잘못되더라도 모션이 항상 꺼지고 opacity:0에
 * 영구히 갇히지 않도록 한다.
 * ---------------------------------------------------------------------- */
function subscribe(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getServerSnapshot() {
  return false;
}
function useReducedMotionSafe() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* -------------------------------------------------------------------------
 * 공통 상수 & 스타일 토큰
 * ---------------------------------------------------------------------- */

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070f]";

type ViewKey = "overview" | "fleet" | "antennas" | "weather" | "targets";

const NAV_ITEMS: { key: ViewKey; label: string; icon: LucideIcon }[] = [
  { key: "overview", label: "개요", icon: LayoutDashboard },
  { key: "fleet", label: "함대", icon: Satellite },
  { key: "antennas", label: "안테나", icon: RadioTower },
  { key: "weather", label: "우주 기상", icon: Wind },
  { key: "targets", label: "관측 대기열", icon: Telescope },
];

const VIEW_META: Record<ViewKey, { title: string; desc: string }> = {
  overview: { title: "임무 개요", desc: "전체 함대·안테나·우주 기상을 한눈에 요약한 관제 스냅샷입니다." },
  fleet: { title: "함대 상태", desc: "8기 우주선의 상태, 신호세기, 접촉 일정을 확인하고 레이더에 표시할 대상을 선택하세요." },
  antennas: { title: "안테나 스케줄", desc: "전 지구 심우주 안테나망의 접촉 창(contact window)을 사이트·기간별로 확인합니다." },
  weather: { title: "우주 기상", desc: "태양풍 속도와 Kp 지수로 링크 여유도에 영향을 주는 지자기 활동을 예보합니다." },
  targets: { title: "관측 대기열", desc: "심우주 관측 타겟의 우선순위 대기열을 정렬하고 우선 관측을 지정합니다." },
};

const STATUS_META: Record<
  SpacecraftStatus,
  { label: string; icon: LucideIcon; color: string; bg: string; border: string }
> = {
  nominal: { label: "정상", icon: CircleCheckBig, color: "var(--v-emerald)", bg: "var(--v-emerald-soft)", border: "rgba(110,231,183,0.4)" },
  degraded: { label: "저하", icon: TriangleAlert, color: "var(--v-amber)", bg: "var(--v-amber-soft)", border: "rgba(251,191,36,0.4)" },
  critical: { label: "위험", icon: OctagonAlert, color: "var(--v-rose)", bg: "var(--v-rose-soft)", border: "rgba(251,113,133,0.4)" },
  dormant: { label: "휴면", icon: MoonStar, color: "var(--v-text-muted)", bg: "rgba(185,194,230,0.1)", border: "rgba(185,194,230,0.3)" },
};

const ANTENNA_STATUS_META: Record<AntennaStatus, { label: string; icon: LucideIcon; color: string }> = {
  online: { label: "온라인", icon: Wifi, color: "var(--v-emerald)" },
  maintenance: { label: "점검중", icon: Wrench, color: "var(--v-amber)" },
  offline: { label: "오프라인", icon: WifiOff, color: "var(--v-rose)" },
};

const PRIORITY_META: Record<string, { label: string; color: string }> = {
  critical: { label: "긴급", color: "var(--v-rose)" },
  standard: { label: "표준", color: "var(--v-cyan)" },
  low: { label: "저우선", color: "var(--v-violet)" },
};

const STATUS_FILTERS: { key: "all" | SpacecraftStatus; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "nominal", label: "정상" },
  { key: "degraded", label: "저하" },
  { key: "critical", label: "위험" },
  { key: "dormant", label: "휴면" },
];

const TARGET_SORTS: { key: "priority" | "distance" | "queued"; label: string }[] = [
  { key: "priority", label: "우선순위 순" },
  { key: "distance", label: "거리 순" },
  { key: "queued", label: "대기시간 순" },
];

const RING_RADIUS: Record<number, number> = { 1: 44, 2: 68, 3: 92, 4: 116 };
const RING_LABELS: Record<number, string> = {
  1: "저궤도 군집",
  2: "달 궤도권",
  3: "화성 전이",
  4: "심우주",
};
const RADAR_CENTER = 132;

function polarPoint(radius: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: RADAR_CENTER + radius * Math.cos(rad), y: RADAR_CENTER + radius * Math.sin(rad) };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/* -------------------------------------------------------------------------
 * 작은 재사용 프리미티브
 * ---------------------------------------------------------------------- */

function GlassPanel({
  className = "",
  children,
  as: Tag = "div",
  ariaLabel,
  ariaLabelledBy,
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "article";
  ariaLabel?: string;
  ariaLabelledBy?: string;
}) {
  return (
    <Tag className={`d10-glass rounded-2xl ${className}`} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}>
      {children}
    </Tag>
  );
}

function StatusBadge({ status }: { status: SpacecraftStatus }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ color: meta.color, backgroundColor: meta.bg, border: `1px solid ${meta.border}` }}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {meta.label}
    </span>
  );
}

function Sparkline({ data, ariaLabel, stroke = "var(--v-cyan)" }: { data: number[]; ariaLabel: string; stroke?: string }) {
  const width = 88;
  const height = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / span) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={ariaLabel}>
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------
 * 궤도 레이더 — Earth 허브 + 동심원 링 + 우주선 위치 + 교신 아크
 * 순수 시각 보조물(role="img" 요약 라벨) — 모든 데이터는 함대 표/목록에도
 * 텍스트로 동일하게 제공되므로 내부 도형에는 개별 접근성 라벨을 달지 않는다.
 * ---------------------------------------------------------------------- */
function OrbitRadar({
  fleet,
  selectedId,
  reducedMotion,
}: {
  fleet: Spacecraft[];
  selectedId: string;
  reducedMotion: boolean;
}) {
  const gradientId = useId();
  const inContactCount = fleet.filter((s) => s.inContact).length;
  const summary = `궤도 레이더: 우주선 ${fleet.length}기 중 ${inContactCount}기 현재 교신 중. 선택됨: ${
    fleet.find((s) => s.id === selectedId)?.name ?? "없음"
  }.`;

  return (
    <svg viewBox="0 0 264 264" role="img" aria-label={summary} className="w-full h-auto max-w-[420px]">
      <defs>
        <radialGradient id={`${gradientId}-earth`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8ff4ff" />
          <stop offset="55%" stopColor="#3f8fd6" />
          <stop offset="100%" stopColor="#1b3a7a" />
        </radialGradient>
      </defs>

      {/* 동심 궤도 링 */}
      {([1, 2, 3, 4] as const).map((ring) => (
        <circle
          key={ring}
          cx={RADAR_CENTER}
          cy={RADAR_CENTER}
          r={RING_RADIUS[ring]}
          fill="none"
          stroke="var(--v-border-strong)"
          strokeDasharray="2 5"
          strokeWidth={1}
        />
      ))}
      {([1, 2, 3, 4] as const).map((ring) => {
        const p = polarPoint(RING_RADIUS[ring], 235);
        return (
          <text key={ring} x={p.x} y={p.y} fontSize={6.5} fill="var(--v-text-faint)" textAnchor="middle">
            {RING_LABELS[ring]}
          </text>
        );
      })}

      {/* 레이더 스윕 — 순수 장식, transform만 사용, reduced-motion에서 정지 */}
      <g className="d10-radar-sweep" aria-hidden="true">
        <path
          d={`M${RADAR_CENTER},${RADAR_CENTER} L${RADAR_CENTER},${RADAR_CENTER - 116} A116,116 0 0 1 ${
            polarPoint(116, 40).x
          },${polarPoint(116, 40).y} Z`}
          fill={`url(#${gradientId}-sweep)`}
          opacity={reducedMotion ? 0 : 0.16}
        />
      </g>
      <defs>
        <linearGradient id={`${gradientId}-sweep`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--v-cyan)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--v-cyan)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 교신 중 아크 */}
      {fleet
        .filter((s) => s.inContact)
        .map((s) => {
          const p = polarPoint(RING_RADIUS[s.ring], s.angleDeg);
          return (
            <line
              key={`arc-${s.id}`}
              x1={RADAR_CENTER}
              y1={RADAR_CENTER}
              x2={p.x}
              y2={p.y}
              stroke="var(--v-cyan)"
              strokeWidth={1.4}
              strokeOpacity={0.65}
            />
          );
        })}

      {/* 선택된 우주선 강조선 */}
      {(() => {
        const sel = fleet.find((s) => s.id === selectedId);
        if (!sel) return null;
        const p = polarPoint(RING_RADIUS[sel.ring], sel.angleDeg);
        return (
          <line x1={RADAR_CENTER} y1={RADAR_CENTER} x2={p.x} y2={p.y} stroke="var(--v-violet)" strokeWidth={2} strokeOpacity={0.9} />
        );
      })()}

      {/* Earth 허브 */}
      <circle cx={RADAR_CENTER} cy={RADAR_CENTER} r={11} fill={`url(#${gradientId}-earth)`} />
      <circle cx={RADAR_CENTER} cy={RADAR_CENTER} r={11} fill="none" stroke="rgba(143,244,255,0.5)" strokeWidth={1} />

      {/* 우주선 위치 */}
      {fleet.map((s) => {
        const p = polarPoint(RING_RADIUS[s.ring], s.angleDeg);
        const isSelected = s.id === selectedId;
        const color = STATUS_META[s.status].color;
        return (
          <g key={s.id}>
            {isSelected && (
              <circle cx={p.x} cy={p.y} r={8} fill="none" stroke="var(--v-violet)" strokeWidth={1.5} className="d10-pulse-dot" />
            )}
            <circle cx={p.x} cy={p.y} r={isSelected ? 4.5 : 3.5} fill={color} stroke="#05070f" strokeWidth={1} />
          </g>
        );
      })}
    </svg>
  );
}

/* -------------------------------------------------------------------------
 * 태양풍 반원 게이지
 * ---------------------------------------------------------------------- */
function WindGauge({ speed }: { speed: number }) {
  const gradientId = useId();
  const pct = clamp(((speed - SOLAR_WIND_MIN) / (SOLAR_WIND_MAX - SOLAR_WIND_MIN)) * 100, 0, 100);
  return (
    <div className="relative w-full max-w-[220px]">
      <svg viewBox="0 0 200 110" role="img" aria-label={`태양풍 속도 초당 ${speed}킬로미터, 관측 범위 ${SOLAR_WIND_MIN}~${SOLAR_WIND_MAX} km/s 중 ${Math.round(pct)}%`}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--v-emerald)" />
            <stop offset="55%" stopColor="var(--v-amber)" />
            <stop offset="100%" stopColor="var(--v-rose)" />
          </linearGradient>
        </defs>
        <path d="M10,100 A90,90 0 0 1 190,100" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={12} strokeLinecap="round" />
        <path
          d="M10,100 A90,90 0 0 1 190,100"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={12}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${pct} 100`}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
        <span className="font-mono text-3xl font-semibold text-[var(--v-text)]">{speed}</span>
        <span className="text-xs text-[var(--v-text-muted)]">km/s</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Kp 지수 막대 + 태양풍 예보선 (요약 라벨 + 시각 보조 막대)
 * ---------------------------------------------------------------------- */
function KpBars({ series }: { series: number[] }) {
  const summary = `최근 24시간 Kp 지수 3시간 간격 추이: ${series.join(", ")}`;
  return (
    <div role="img" aria-label={summary} className="flex items-end gap-1.5 h-24">
      {series.map((v, i) => {
        const color = v >= 6 ? "var(--v-rose)" : v >= 4 ? "var(--v-amber)" : "var(--v-emerald)";
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full rounded-t-sm" style={{ height: `${(v / 9) * 100}%`, backgroundColor: color, minHeight: 4 }} />
            <span className="text-[10px] font-mono text-[var(--v-text-faint)]">{v}</span>
          </div>
        );
      })}
    </div>
  );
}

function ForecastChart({ data, rangeLabel }: { data: number[]; rangeLabel: string }) {
  const gradientId = useId();
  const width = 100;
  const height = 100;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / span) * (height - 10) - 5,
  }));
  const line = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `0,${height} ${line} ${width},${height}`;
  const summary = `태양풍 속도 예보(${rangeLabel}): 최저 ${min}km/s, 최고 ${max}km/s, 현재 구간 ${data[0]}에서 ${data[data.length - 1]}km/s로 변화`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40" role="img" aria-label={summary} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--v-cyan)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--v-cyan)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradientId})`} />
      <polyline points={line} fill="none" stroke="var(--v-cyan)" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* -------------------------------------------------------------------------
 * 메인 대시보드
 * ---------------------------------------------------------------------- */
export default function DashboardClient() {
  const reducedMotion = useReducedMotionSafe();
  const [activeView, setActiveView] = useState<ViewKey>("overview");
  const [selectedSpacecraftId, setSelectedSpacecraftId] = useState<string>("auriga-3");
  const [statusFilter, setStatusFilter] = useState<"all" | SpacecraftStatus>("all");
  const [antennaFilter, setAntennaFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<TimeRangeKey>("24h");
  const [weatherRange, setWeatherRange] = useState<TimeRangeKey>("24h");
  const [targetSort, setTargetSort] = useState<"priority" | "distance" | "queued">("priority");
  const [pinnedTargets, setPinnedTargets] = useState<Set<string>>(new Set(["proxima-b"]));

  const fleetSummary = useMemo(() => computeFleetSummary(SPACECRAFT), []);
  const antennaUptime = useMemo(() => computeAntennaUptime(ANTENNAS), []);

  const filteredFleet = useMemo(
    () => (statusFilter === "all" ? SPACECRAFT : SPACECRAFT.filter((s) => s.status === statusFilter)),
    [statusFilter],
  );

  const rangeHours = TIME_RANGES.find((r) => r.key === timeRange)?.hours ?? 24;
  const visibleAntennas = antennaFilter === "all" ? ANTENNAS : ANTENNAS.filter((a) => a.id === antennaFilter);
  const visibleWindows = CONTACT_WINDOWS.filter((w) => w.startHour < rangeHours);

  const upcomingWindows = useMemo(
    () => [...CONTACT_WINDOWS].sort((a, b) => a.startHour - b.startHour).slice(0, 3),
    [],
  );

  const sortedTargets = useMemo(() => {
    const list = [...OBSERVATION_TARGETS];
    list.sort((a, b) => {
      const aPinned = pinnedTargets.has(a.id);
      const bPinned = pinnedTargets.has(b.id);
      if (aPinned !== bPinned) return aPinned ? -1 : 1;
      if (targetSort === "priority") return a.priorityRank - b.priorityRank;
      if (targetSort === "distance") return a.distanceLy - b.distanceLy;
      return a.queuedHrs - b.queuedHrs;
    });
    return list;
  }, [targetSort, pinnedTargets]);

  function togglePin(id: string) {
    setPinnedTargets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedSpacecraft = SPACECRAFT.find((s) => s.id === selectedSpacecraftId) ?? SPACECRAFT[0];
  const meta = VIEW_META[activeView];

  return (
    <div className="d10-root min-h-screen flex flex-col text-[var(--v-text)]">
      <div className="d10-stars" aria-hidden="true" />

      <a
        href="#d10-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-[var(--v-cyan)] focus:px-4 focus:py-2 focus:font-semibold focus:text-[#05070f]"
      >
        메인 콘텐츠로 건너뛰기
      </a>

      {/* 톱바 */}
      <header className="d10-glass sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--v-border)] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--v-cyan-soft)] text-[var(--v-cyan)]"
            aria-hidden="true"
          >
            <Compass className="size-5" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold tracking-wide text-[var(--v-text)]">VELA</p>
            <p className="truncate text-xs text-[var(--v-text-faint)]">딥스페이스 운영 콘솔</p>
          </div>
        </div>

        <p className="hidden font-mono text-xs text-[var(--v-text-faint)] md:block">{SNAPSHOT_LABEL}</p>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className={`relative flex size-11 items-center justify-center rounded-xl text-[var(--v-text-muted)] transition-colors hover:bg-white/10 hover:text-[var(--v-text)] ${FOCUS_RING}`}
            aria-label="알림 3건 확인"
          >
            <Bell className="size-5" aria-hidden="true" />
            <span
              className="absolute right-2 top-2 flex size-2.5 items-center justify-center rounded-full bg-[var(--v-rose)]"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/10 ${FOCUS_RING}`}
            aria-label="운영자 계정: 이지호, 심우주 운영팀"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-[var(--v-violet-soft)] text-[var(--v-violet)]">
              <User className="size-4" aria-hidden="true" />
            </span>
            <span className="hidden text-sm text-[var(--v-text-muted)] sm:block">이지호</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* 데스크톱 아이콘 레일 */}
        <nav aria-label="대시보드 뷰" className="sticky top-[65px] hidden h-[calc(100vh-65px)] w-20 shrink-0 flex-col items-center gap-1 border-r border-[var(--v-border)] py-4 lg:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.key === activeView;
            return (
              <button
                key={item.key}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => setActiveView(item.key)}
                className={`flex min-h-[44px] w-16 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] transition-colors ${FOCUS_RING} ${
                  active
                    ? "bg-[var(--v-cyan-soft)] text-[var(--v-cyan)]"
                    : "text-[var(--v-text-muted)] hover:bg-white/10 hover:text-[var(--v-text)]"
                }`}
              >
                <Icon className="size-5" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <main id="d10-main" className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--v-text)]">{meta.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-[var(--v-text-muted)]">{meta.desc}</p>

          {activeView === "overview" && (
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <GlassPanel as="section" className={`d10-enter col-span-1 flex flex-col items-center gap-4 p-5 lg:col-span-2`}>
                <h2 className="self-start text-sm font-semibold uppercase tracking-widest text-[var(--v-text-faint)]">궤도 레이더</h2>
                <OrbitRadar fleet={SPACECRAFT} selectedId={selectedSpacecraftId} reducedMotion={reducedMotion} />
                <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-[var(--v-text-muted)]">
                  {(Object.keys(STATUS_META) as SpacecraftStatus[]).map((key) => (
                    <li key={key} className="flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full" style={{ backgroundColor: STATUS_META[key].color }} aria-hidden="true" />
                      {STATUS_META[key].label}
                    </li>
                  ))}
                </ul>
              </GlassPanel>

              <dl className="d10-enter-delay-1 grid grid-cols-2 gap-4">
                <GlassPanel className="p-4">
                  <dt className="text-xs uppercase tracking-widest text-[var(--v-text-faint)]">활성 우주선</dt>
                  <dd className="mt-2 font-mono text-3xl font-semibold text-[var(--v-cyan)]">
                    {fleetSummary.active}
                    <span className="text-base text-[var(--v-text-faint)]">/{fleetSummary.total}</span>
                  </dd>
                </GlassPanel>
                <GlassPanel className="p-4">
                  <dt className="text-xs uppercase tracking-widest text-[var(--v-text-faint)]">안테나 가동률</dt>
                  <dd className="mt-2 font-mono text-3xl font-semibold text-[var(--v-emerald)]">{antennaUptime}%</dd>
                </GlassPanel>
                <GlassPanel className="p-4">
                  <dt className="text-xs uppercase tracking-widest text-[var(--v-text-faint)]">평균 신호세기</dt>
                  <dd className="mt-2 font-mono text-3xl font-semibold text-[var(--v-text)]">
                    {fleetSummary.avgSignal}
                    <span className="text-base text-[var(--v-text-faint)]"> dBm</span>
                  </dd>
                </GlassPanel>
                <GlassPanel className="p-4">
                  <dt className="text-xs uppercase tracking-widest text-[var(--v-text-faint)]">다음 접촉</dt>
                  <dd className="mt-2 text-lg font-semibold text-[var(--v-violet)]">{formatHours(fleetSummary.nextWindow)}</dd>
                </GlassPanel>
              </dl>

              <GlassPanel as="section" className="d10-enter-delay-2 p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--v-text-faint)]">선택된 우주선</h2>
                  <button
                    type="button"
                    onClick={() => setActiveView("fleet")}
                    className={`rounded-lg px-2 py-1 text-xs text-[var(--v-cyan)] transition-colors hover:bg-white/10 ${FOCUS_RING}`}
                  >
                    함대 전체 보기
                  </button>
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-lg font-semibold">{selectedSpacecraft.name}</p>
                    <p className="text-sm text-[var(--v-text-muted)]">{selectedSpacecraft.mission}</p>
                  </div>
                  <StatusBadge status={selectedSpacecraft.status} />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-[var(--v-text-faint)]">거리</dt>
                    <dd className="font-mono">{selectedSpacecraft.distanceAu} AU</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--v-text-faint)]">대역</dt>
                    <dd className="font-mono">{selectedSpacecraft.band}-대역</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--v-text-faint)]">최근 교신</dt>
                    <dd>{formatAgo(selectedSpacecraft.lastContactHrsAgo)}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--v-text-faint)]">다음 접촉</dt>
                    <dd>{formatHours(selectedSpacecraft.nextWindowHrsIn)}</dd>
                  </div>
                </dl>
              </GlassPanel>

              <GlassPanel as="section" className="d10-enter-delay-2 p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--v-text-faint)]">우주 기상 요약</h2>
                  <button
                    type="button"
                    onClick={() => setActiveView("weather")}
                    className={`rounded-lg px-2 py-1 text-xs text-[var(--v-cyan)] transition-colors hover:bg-white/10 ${FOCUS_RING}`}
                  >
                    전체 보기
                  </button>
                </div>
                <p className="mt-3 font-mono text-2xl font-semibold">
                  {SOLAR_WIND_SPEED_KMS} <span className="text-sm font-normal text-[var(--v-text-faint)]">km/s 태양풍</span>
                </p>
                <p className="mt-1 text-sm text-[var(--v-text-muted)]">
                  Kp 지수 {KP_INDEX_NOW} · 방사선 위험도 {RADIATION_RISK}
                </p>
                {STORM_WATCH.active && (
                  <p className="mt-3 flex items-start gap-2 rounded-xl border border-[rgba(251,191,36,0.35)] bg-[var(--v-amber-soft)] p-3 text-xs text-[var(--v-amber)]">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    {STORM_WATCH.message}
                  </p>
                )}
              </GlassPanel>

              <GlassPanel as="section" className="d10-enter-delay-3 p-5 lg:col-span-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--v-text-faint)]">다가오는 접촉</h2>
                  <button
                    type="button"
                    onClick={() => setActiveView("antennas")}
                    className={`rounded-lg px-2 py-1 text-xs text-[var(--v-cyan)] transition-colors hover:bg-white/10 ${FOCUS_RING}`}
                  >
                    스케줄 전체 보기
                  </button>
                </div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                  {upcomingWindows.map((w) => {
                    const sc = SPACECRAFT.find((s) => s.id === w.spacecraftId);
                    const antenna = ANTENNAS.find((a) => a.id === w.antennaId);
                    if (!sc || !antenna) return null;
                    return (
                      <li key={w.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedSpacecraftId(sc.id)}
                          className={`flex w-full min-h-[44px] flex-col items-start gap-0.5 rounded-xl border border-[var(--v-border)] px-3 py-2 text-left transition-colors hover:bg-white/10 ${FOCUS_RING}`}
                        >
                          <span className="font-mono text-sm font-semibold">{sc.name}</span>
                          <span className="text-xs text-[var(--v-text-muted)]">
                            {antenna.name} · {formatHours(w.startHour)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </GlassPanel>
            </div>
          )}

          {activeView === "fleet" && (
            <div className="mt-6 d10-enter">
              <div role="group" aria-label="상태 필터" className="mb-4 flex flex-wrap gap-2">
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    aria-pressed={statusFilter === f.key}
                    onClick={() => setStatusFilter(f.key)}
                    className={`min-h-[44px] rounded-full px-4 text-sm font-medium transition-colors ${FOCUS_RING} ${
                      statusFilter === f.key
                        ? "bg-[var(--v-cyan)] text-[#05070f]"
                        : "d10-glass text-[var(--v-text-muted)] hover:text-[var(--v-text)]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <GlassPanel className="overflow-hidden">
                <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="함대 목록 테이블">
                  <table className="w-full min-w-[860px] border-collapse text-sm">
                    <caption className="sr-only">함대 8기의 상태·거리·신호 추이·교신 시각 데이터 표</caption>
                    <thead>
                      <tr className="border-b border-[var(--v-border)] text-left text-xs uppercase tracking-widest text-[var(--v-text-faint)]">
                        <th scope="col" className="px-4 py-3 font-medium">우주선</th>
                        <th scope="col" className="px-4 py-3 font-medium">상태</th>
                        <th scope="col" className="px-4 py-3 font-medium">거리</th>
                        <th scope="col" className="px-4 py-3 font-medium">신호 추이</th>
                        <th scope="col" className="px-4 py-3 font-medium">최근 교신</th>
                        <th scope="col" className="px-4 py-3 font-medium">다음 접촉</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFleet.map((s) => {
                        const selected = s.id === selectedSpacecraftId;
                        return (
                          <tr key={s.id} className="border-b border-[var(--v-border)] last:border-0">
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                aria-pressed={selected}
                                onClick={() => setSelectedSpacecraftId(s.id)}
                                className={`flex min-h-[44px] items-center gap-2 rounded-lg px-2 py-1 text-left transition-colors ${FOCUS_RING} ${
                                  selected ? "bg-[var(--v-violet-soft)] text-[var(--v-violet)]" : "hover:bg-white/10"
                                }`}
                              >
                                <span className="font-mono font-semibold">{s.name}</span>
                                <span className="hidden text-xs text-[var(--v-text-faint)] md:inline">{s.mission}</span>
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <StatusBadge status={s.status} />
                            </td>
                            <td className="px-4 py-3 font-mono text-[var(--v-text-muted)]">{s.distanceAu} AU</td>
                            <td className="px-4 py-3">
                              <Sparkline
                                data={s.signalTrend}
                                ariaLabel={`${s.name} 최근 신호세기 ${s.signalTrend[0]}에서 ${s.signalTrend[s.signalTrend.length - 1]} dBm로 변화`}
                              />
                            </td>
                            <td className="px-4 py-3 text-[var(--v-text-muted)]">{formatAgo(s.lastContactHrsAgo)}</td>
                            <td className="px-4 py-3 text-[var(--v-text-muted)]">{formatHours(s.nextWindowHrsIn)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </GlassPanel>
            </div>
          )}

          {activeView === "antennas" && (
            <div className="mt-6 d10-enter space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div role="group" aria-label="안테나 사이트 필터" className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    aria-pressed={antennaFilter === "all"}
                    onClick={() => setAntennaFilter("all")}
                    className={`min-h-[44px] rounded-full px-4 text-sm font-medium transition-colors ${FOCUS_RING} ${
                      antennaFilter === "all" ? "bg-[var(--v-cyan)] text-[#05070f]" : "d10-glass text-[var(--v-text-muted)] hover:text-[var(--v-text)]"
                    }`}
                  >
                    전체 사이트
                  </button>
                  {ANTENNAS.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      aria-pressed={antennaFilter === a.id}
                      onClick={() => setAntennaFilter(a.id)}
                      className={`min-h-[44px] rounded-full px-4 text-sm font-medium transition-colors ${FOCUS_RING} ${
                        antennaFilter === a.id ? "bg-[var(--v-cyan)] text-[#05070f]" : "d10-glass text-[var(--v-text-muted)] hover:text-[var(--v-text)]"
                      }`}
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
                <div role="group" aria-label="표시 기간" className="d10-glass flex gap-1 rounded-full p-1">
                  {TIME_RANGES.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      aria-pressed={timeRange === r.key}
                      onClick={() => setTimeRange(r.key)}
                      className={`min-h-[36px] rounded-full px-3 text-xs font-medium transition-colors ${FOCUS_RING} ${
                        timeRange === r.key ? "bg-[var(--v-cyan)] text-[#05070f]" : "text-[var(--v-text-muted)] hover:text-[var(--v-text)]"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {visibleAntennas.map((antenna) => {
                  const meta = ANTENNA_STATUS_META[antenna.status];
                  const AIcon = meta.icon;
                  const blocks = visibleWindows.filter((w) => w.antennaId === antenna.id);
                  return (
                    <GlassPanel key={antenna.id} as="section" className="p-4" ariaLabelledBy={`antenna-heading-${antenna.id}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h2 id={`antenna-heading-${antenna.id}`} className="font-mono text-sm font-semibold">
                            {antenna.name}
                          </h2>
                          <p className="text-xs text-[var(--v-text-faint)]">
                            {antenna.location} · 지름 {antenna.diameterM}m · 가동률 {antenna.utilizationPct}%
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: meta.color }}>
                          <AIcon className="size-3.5" aria-hidden="true" />
                          {meta.label}
                        </span>
                      </div>

                      <div className="relative mt-3 h-11 rounded-lg bg-white/[0.04]">
                        <span
                          className="absolute inset-y-0 left-0 w-px bg-[var(--v-cyan)]"
                          style={{ boxShadow: "0 0 6px var(--v-cyan)" }}
                          aria-hidden="true"
                        />
                        {blocks.length === 0 && (
                          <p className="flex h-full items-center px-3 text-xs text-[var(--v-text-faint)]">
                            선택한 기간 내 예정된 접촉 창이 없습니다.
                          </p>
                        )}
                        {blocks.map((w) => {
                          const sc = SPACECRAFT.find((s) => s.id === w.spacecraftId);
                          if (!sc) return null;
                          const left = clamp((w.startHour / rangeHours) * 100, 0, 100);
                          const width = clamp((w.durationHr / rangeHours) * 100, 1, 100 - left);
                          const pMeta = PRIORITY_META[w.priority];
                          return (
                            <button
                              key={w.id}
                              type="button"
                              onClick={() => setSelectedSpacecraftId(sc.id)}
                              aria-label={`${sc.name}, ${w.band}-대역, ${formatHours(w.startHour)}부터 ${w.durationHr}시간, 우선순위 ${pMeta.label}`}
                              className={`absolute top-1 bottom-1 min-w-[44px] rounded-md px-2 text-left text-[11px] font-mono transition-[filter] hover:brightness-125 ${FOCUS_RING}`}
                              style={{
                                left: `${left}%`,
                                width: `${width}%`,
                                backgroundColor: `color-mix(in srgb, ${pMeta.color} 22%, transparent)`,
                                border: `1px solid ${pMeta.color}`,
                                color: pMeta.color,
                              }}
                            >
                              <span className="truncate block">{sc.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </GlassPanel>
                  );
                })}
              </div>
            </div>
          )}

          {activeView === "weather" && (
            <div className="mt-6 grid gap-4 lg:grid-cols-2 d10-enter">
              <GlassPanel as="section" className="flex flex-col items-center gap-3 p-5">
                <h2 className="self-start text-sm font-semibold uppercase tracking-widest text-[var(--v-text-faint)]">태양풍 속도</h2>
                <WindGauge speed={SOLAR_WIND_SPEED_KMS} />
                <p className="text-xs text-[var(--v-text-faint)]">
                  관측 범위 {SOLAR_WIND_MIN}–{SOLAR_WIND_MAX} km/s
                </p>
              </GlassPanel>

              <GlassPanel as="section" className="p-5">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--v-text-faint)]">Kp 지수 (24시간)</h2>
                <div className="mt-4">
                  <KpBars series={KP_SERIES_24H} />
                </div>
                <p className="mt-3 text-xs text-[var(--v-text-muted)]">현재 Kp {KP_INDEX_NOW} · 방사선 위험도 {RADIATION_RISK}</p>
              </GlassPanel>

              <GlassPanel as="section" className="p-5 lg:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--v-text-faint)]">태양풍 예보</h2>
                  <div role="group" aria-label="예보 기간" className="d10-glass flex gap-1 rounded-full p-1">
                    {TIME_RANGES.map((r) => (
                      <button
                        key={r.key}
                        type="button"
                        aria-pressed={weatherRange === r.key}
                        onClick={() => setWeatherRange(r.key)}
                        className={`min-h-[36px] rounded-full px-3 text-xs font-medium transition-colors ${FOCUS_RING} ${
                          weatherRange === r.key ? "bg-[var(--v-cyan)] text-[#05070f]" : "text-[var(--v-text-muted)] hover:text-[var(--v-text)]"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <ForecastChart data={WIND_FORECAST[weatherRange]} rangeLabel={TIME_RANGES.find((r) => r.key === weatherRange)?.label ?? ""} />
                </div>
              </GlassPanel>

              {STORM_WATCH.active && (
                <div className="d10-glass flex items-start gap-3 rounded-2xl border-[rgba(251,191,36,0.35)] p-4 lg:col-span-2">
                  <TriangleAlert className="mt-0.5 size-5 shrink-0 text-[var(--v-amber)]" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--v-amber)]">지자기 폭풍 감시</p>
                    <p className="mt-1 text-sm text-[var(--v-text-muted)]">{STORM_WATCH.message}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeView === "targets" && (
            <div className="mt-6 d10-enter space-y-4">
              <div role="group" aria-label="정렬 기준" className="d10-glass inline-flex flex-wrap gap-1 rounded-full p-1">
                {TARGET_SORTS.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    aria-pressed={targetSort === s.key}
                    onClick={() => setTargetSort(s.key)}
                    className={`min-h-[40px] rounded-full px-3 text-xs font-medium transition-colors ${FOCUS_RING} ${
                      targetSort === s.key ? "bg-[var(--v-cyan)] text-[#05070f]" : "text-[var(--v-text-muted)] hover:text-[var(--v-text)]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {sortedTargets.map((t: ObservationTarget) => {
                  const pinned = pinnedTargets.has(t.id);
                  return (
                    <li key={t.id}>
                      <GlassPanel className="flex h-full flex-col gap-3 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-mono text-sm font-semibold">{t.name}</p>
                            <p className="text-xs text-[var(--v-text-faint)]">우선순위 #{t.priorityRank} · {t.instrument}</p>
                          </div>
                          <button
                            type="button"
                            aria-pressed={pinned}
                            aria-label={pinned ? `${t.name} 우선 관측 지정 해제` : `${t.name} 우선 관측으로 지정`}
                            onClick={() => togglePin(t.id)}
                            className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg transition-colors ${FOCUS_RING} ${
                              pinned ? "text-[var(--v-amber)]" : "text-[var(--v-text-faint)] hover:text-[var(--v-text)]"
                            }`}
                          >
                            <Pin className="size-4" aria-hidden="true" fill={pinned ? "currentColor" : "none"} />
                          </button>
                        </div>
                        <dl className="grid grid-cols-2 gap-2 text-xs text-[var(--v-text-muted)]">
                          <div>
                            <dt className="text-[var(--v-text-faint)]">거리</dt>
                            <dd className="font-mono">{t.distanceLy} 광년</dd>
                          </div>
                          <div>
                            <dt className="text-[var(--v-text-faint)]">대기 시간</dt>
                            <dd className="font-mono">{t.queuedHrs}시간</dd>
                          </div>
                        </dl>
                        <span
                          className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{
                            color: t.status === "완료" ? "var(--v-emerald)" : t.status === "관측중" ? "var(--v-cyan)" : "var(--v-text-muted)",
                            backgroundColor: t.status === "완료" ? "var(--v-emerald-soft)" : t.status === "관측중" ? "var(--v-cyan-soft)" : "rgba(185,194,230,0.1)",
                          }}
                        >
                          <Signal className="size-3.5" aria-hidden="true" />
                          {t.status}
                        </span>
                      </GlassPanel>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </main>
      </div>

      {/* 모바일 하단 내비게이션 */}
      <nav aria-label="대시보드 뷰 (모바일)" className="d10-glass fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-[var(--v-border)] px-1 py-1.5 lg:hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.key === activeView;
          return (
            <button
              key={item.key}
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => setActiveView(item.key)}
              className={`flex min-h-[44px] flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] transition-colors ${FOCUS_RING} ${
                active ? "text-[var(--v-cyan)]" : "text-[var(--v-text-faint)]"
              }`}
            >
              <Icon className="size-5" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
