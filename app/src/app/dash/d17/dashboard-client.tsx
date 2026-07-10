"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Fredoka } from "next/font/google";
import {
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  Disc3,
  Droplets,
  Gauge,
  Info,
  ListMusic,
  Music2,
  PauseCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Tv2,
  Users,
  Wallet,
  Waves,
  type LucideIcon,
} from "lucide-react";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

/* ----------------------------------------------------------------------- */
/* 타입 & 상수                                                              */
/* ----------------------------------------------------------------------- */

type PlatformId = "spotify" | "apple" | "youtube" | "tiktok";
type PeriodKey = "7D" | "30D" | "90D" | "YTD";

interface Platform {
  id: PlatformId;
  name: string;
  icon: LucideIcon;
  /** 차트용 밝은 컬러 (반투명 그라디언트) */
  color: string;
  /** 칩·바용 진한 컬러 (흰 글자 대비 AA 확보) */
  chip: string;
}

const PLATFORMS: Platform[] = [
  { id: "spotify", name: "Spotify", icon: Music2, color: "#4ade80", chip: "#15803d" },
  { id: "apple", name: "Apple Music", icon: Disc3, color: "#fb7185", chip: "#be123c" },
  { id: "youtube", name: "YouTube Music", icon: Tv2, color: "#fbbf24", chip: "#92400e" },
  { id: "tiktok", name: "TikTok", icon: Sparkles, color: "#38bdf8", chip: "#0369a1" },
];

const PLATFORM_MAP: Record<PlatformId, Platform> = Object.fromEntries(
  PLATFORMS.map((p) => [p.id, p]),
) as Record<PlatformId, Platform>;

const WAVE_PARAMS: Record<PlatformId, { base: number; amp: number; phase: number }> = {
  spotify: { base: 46, amp: 11, phase: 0 },
  apple: { base: 32, amp: 8, phase: 1.6 },
  youtube: { base: 26, amp: 9, phase: 2.8 },
  tiktok: { base: 20, amp: 15, phase: 4.1 },
};

const PERIODS: PeriodKey[] = ["7D", "30D", "90D", "YTD"];

const PERIOD_META: Record<PeriodKey, { label: string; points: string[]; scale: number }> = {
  "7D": { label: "최근 7일", points: ["월", "화", "수", "목", "금", "토", "일"], scale: 1 },
  "30D": { label: "최근 30일", points: ["1주", "2주", "3주", "4주"], scale: 4.4 },
  "90D": { label: "최근 90일", points: ["1개월", "2개월", "3개월"], scale: 13.2 },
  YTD: { label: "연초 누계", points: ["1분기", "2분기", "3분기", "4분기"], scale: 27.6 },
};

const KPI_DELTA: Record<PeriodKey, { streams: number; revenue: number; artists: number; tracks: number }> = {
  "7D": { streams: 6.2, revenue: 5.8, artists: -1, tracks: 3 },
  "30D": { streams: 11.4, revenue: 12.6, artists: 2, tracks: 6 },
  "90D": { streams: 18.9, revenue: 21.3, artists: 3, tracks: 11 },
  YTD: { streams: 34.2, revenue: 38.9, artists: 5, tracks: 24 },
};

const PENDING_ARTISTS: Record<PeriodKey, number> = { "7D": 4, "30D": 6, "90D": 8, YTD: 11 };
const ACTIVE_TRACKS: Record<PeriodKey, number> = { "7D": 128, "30D": 134, "90D": 146, YTD: 158 };

const RATE_WON = 4.6;

interface TrackSeed {
  title: string;
  artist: string;
  platform: PlatformId;
  base: number;
}

const TRACKS: TrackSeed[] = [
  { title: "버블 오브 미", artist: "아루아", platform: "spotify", base: 186 },
  { title: "Chrome Heart", artist: "프리즘랩", platform: "apple", base: 152 },
  { title: "밤의 파도", artist: "코발트나잇", platform: "youtube", base: 134 },
  { title: "Neon Rain", artist: "모노레일", platform: "tiktok", base: 198 },
  { title: "물방울처럼", artist: "글리터베이", platform: "spotify", base: 121 },
];

interface SplitSeg {
  label: string;
  pct: number;
  color: string;
}

const SPLIT: SplitSeg[] = [
  { label: "아티스트 정산", pct: 50, color: "#84cc16" },
  { label: "레이블 유보", pct: 30, color: "#0ea5e9" },
  { label: "퍼블리싱 관리", pct: 12, color: "#a78bfa" },
  { label: "유통 수수료", pct: 8, color: "#fbbf24" },
];

type ArtistStatus = "정산 완료" | "정산 대기" | "검토중" | "보류";

interface Artist {
  name: string;
  role: string;
  streams: number;
  growth: number;
  pending: number;
  status: ArtistStatus;
}

const ROSTER: Artist[] = [
  { name: "모노레일", role: "일렉트로닉", streams: 512000, growth: 22.7, pending: 12680000, status: "검토중" },
  { name: "아루아", role: "싱어송라이터", streams: 482000, growth: 14.2, pending: 8240000, status: "정산 대기" },
  { name: "프리즘랩", role: "신스팝 밴드", streams: 356000, growth: 8.6, pending: 5120000, status: "정산 완료" },
  { name: "코발트나잇", role: "드림팝 듀오", streams: 298000, growth: -3.1, pending: 0, status: "정산 완료" },
  { name: "글리터베이", role: "인디팝", streams: 214000, growth: 5.4, pending: 3040000, status: "정산 대기" },
  { name: "하이드로진", role: "앰비언트", streams: 167000, growth: -1.8, pending: 0, status: "보류" },
];

interface Release {
  title: string;
  artist: string;
  date: string;
  stage: string;
  progress: number;
}

const RELEASES: Release[] = [
  { title: "Chrome Heart (Remix)", artist: "프리즘랩", date: "8월 15일", stage: "마스터링", progress: 35 },
  { title: "물방울 EP", artist: "글리터베이", date: "8월 29일", stage: "아트웍 컨펌", progress: 58 },
  { title: "Neon Rain (Deluxe)", artist: "모노레일", date: "9월 12일", stage: "유통 심사", progress: 76 },
  { title: "밤의 파도 (Live)", artist: "코발트나잇", date: "9월 26일", stage: "마케팅 준비", progress: 92 },
];

type PayoutStatus = "승인 대기" | "서류 검토" | "입금 완료" | "정산 없음";

interface Payout {
  artist: string;
  amount: number;
  due: string;
  status: PayoutStatus;
}

const PAYOUTS: Payout[] = [
  { artist: "모노레일", amount: 12680000, due: "7월 18일", status: "승인 대기" },
  { artist: "아루아", amount: 8240000, due: "7월 18일", status: "승인 대기" },
  { artist: "글리터베이", amount: 3040000, due: "7월 25일", status: "서류 검토" },
  { artist: "프리즘랩", amount: 5120000, due: "7월 11일", status: "입금 완료" },
  { artist: "코발트나잇", amount: 0, due: "-", status: "정산 없음" },
];

const NOTIFICATIONS = [
  { title: "모노레일 정산 승인 대기", body: "12,680,000원 정산이 승인을 기다리고 있어요." },
  { title: "Neon Rain 발매 D-7", body: "유통 심사가 76% 완료되었습니다." },
  { title: "이번 주 스트리밍 +11.4%", body: "지난 기간 대비 성장했어요." },
];

const SECTIONS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "개요", icon: Gauge },
  { id: "waveform", label: "파형", icon: Waves },
  { id: "tracks", label: "트랙", icon: Music2 },
  { id: "roster", label: "로스터", icon: Users },
  { id: "releases", label: "발매", icon: CalendarDays },
  { id: "payouts", label: "정산", icon: Wallet },
];

const GLASS =
  "relative overflow-hidden rounded-[28px] border border-white/70 bg-white/55 shadow-[0_25px_60px_-25px_rgba(14,116,144,0.45)] backdrop-blur-xl";

const STATUS_STYLE: Record<
  ArtistStatus | PayoutStatus,
  { bg: string; text: string; icon: LucideIcon }
> = {
  "정산 완료": { bg: "bg-lime-100", text: "text-lime-800", icon: CheckCircle2 },
  "정산 대기": { bg: "bg-sky-100", text: "text-sky-800", icon: Clock },
  검토중: { bg: "bg-amber-100", text: "text-amber-800", icon: SlidersHorizontal },
  보류: { bg: "bg-rose-100", text: "text-rose-800", icon: PauseCircle },
  "승인 대기": { bg: "bg-sky-100", text: "text-sky-800", icon: Clock },
  "서류 검토": { bg: "bg-amber-100", text: "text-amber-800", icon: SlidersHorizontal },
  "입금 완료": { bg: "bg-lime-100", text: "text-lime-800", icon: CheckCircle2 },
  "정산 없음": { bg: "bg-slate-100", text: "text-slate-700", icon: Info },
};

/* ----------------------------------------------------------------------- */
/* 포맷터 & 순수 함수 (결정적 — Math.random / Date.now 사용 안 함)          */
/* ----------------------------------------------------------------------- */

function compactEn(n: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

function won(n: number): string {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(n);
}

function wonCompact(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "KRW",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

function pct(n: number): string {
  return `${new Intl.NumberFormat("en-US", { signDisplay: "exceptZero", maximumFractionDigits: 1 }).format(n)}%`;
}

function signedCount(n: number, unit: string): string {
  const sign = n > 0 ? "+" : n < 0 ? "-" : "";
  return `${sign}${Math.abs(n)}${unit}`;
}

/** 결정적 사인파 생성기 — 같은 입력이면 항상 같은 출력 (SSR/CSR 불일치 없음) */
function waveSeries(platform: PlatformId, period: PeriodKey): number[] {
  const { base, amp, phase } = WAVE_PARAMS[platform];
  const { points, scale } = PERIOD_META[period];
  return points.map((_, i) => {
    const raw = base + amp * Math.sin((i + phase) * 0.85) + i * amp * 0.16;
    return Math.max(4, Math.round(raw * scale));
  });
}

/* ----------------------------------------------------------------------- */
/* 프레젠테이션 서브 컴포넌트                                               */
/* ----------------------------------------------------------------------- */

function GlossCap() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-4 top-2 h-8 rounded-full bg-white/45 blur-md"
    />
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 100;
  const h = 32;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const denom = Math.max(values.length - 1, 1);
  const points = values
    .map((v, i) => `${(i / denom) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full" aria-hidden="true">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StackedWave({
  series,
  labels,
}: {
  series: { id: string; color: string; values: number[] }[];
  labels: string[];
}) {
  const width = 640;
  const height = 240;
  const padding = { top: 16, right: 16, bottom: 28, left: 16 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const n = labels.length;

  if (series.length === 0 || n === 0) {
    return null;
  }

  const stacks: number[][] = labels.map((_, i) => {
    let running = 0;
    return series.map((s) => {
      running += s.values[i] ?? 0;
      return running;
    });
  });
  const max = Math.max(...stacks.flat(), 1);
  const x = (i: number) => padding.left + (innerW * i) / Math.max(n - 1, 1);
  const y = (v: number) => padding.top + innerH - (innerH * v) / max;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" aria-hidden="true">
      <defs>
        {series.map((s) => (
          <linearGradient id={`grad-${s.id}`} key={s.id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0.3" />
          </linearGradient>
        ))}
      </defs>
      {series.map((s, si) => {
        const top = labels.map((_, i) => `${x(i)},${y(stacks[i][si])}`).join(" L ");
        const bottom = labels
          .map((_, i) => n - 1 - i)
          .map((i) => `${x(i)},${y(si === 0 ? 0 : stacks[i][si - 1])}`)
          .join(" L ");
        return (
          <path
            key={s.id}
            d={`M ${top} L ${bottom} Z`}
            fill={`url(#grad-${s.id})`}
            stroke="white"
            strokeOpacity="0.55"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        );
      })}
      <line
        x1={padding.left}
        y1={padding.top + innerH}
        x2={width - padding.right}
        y2={padding.top + innerH}
        stroke="white"
        strokeOpacity="0.5"
      />
      {labels.map((l, i) => (
        <text key={`${l}-${i}`} x={x(i)} y={height - 6} textAnchor="middle" fontSize="11" fill="#0f172a" opacity="0.6">
          {l}
        </text>
      ))}
    </svg>
  );
}

function Donut({ segments }: { segments: SplitSeg[] }) {
  const size = 160;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const arcs = segments.reduce<{ label: string; color: string; dash: number; offset: number }[]>((acc, seg) => {
    const prevEnd = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
    const dash = (seg.pct / 100) * circumference;
    acc.push({ label: seg.label, color: seg.color, dash, offset: prevEnd });
    return acc;
  }, []);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-40 w-40 shrink-0" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="white" strokeOpacity="0.55" strokeWidth={strokeWidth} />
      {arcs.map((arc) => (
        <circle
          key={arc.label}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={arc.color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
          strokeDashoffset={-arc.offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      ))}
    </svg>
  );
}

function StatusChip({ status }: { status: ArtistStatus | PayoutStatus }) {
  const cfg = STATUS_STYLE[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${cfg.bg} ${cfg.text}`}>
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

interface StatDisplay {
  key: string;
  label: string;
  icon: LucideIcon;
  color: string;
  valueText: string;
  suffix: string;
  deltaText: string;
  positive: boolean;
  spark: number[];
}

function StatCard({ stat }: { stat: StatDisplay }) {
  const DeltaIcon = stat.positive ? TrendingUp : TrendingDown;
  const Icon = stat.icon;
  return (
    <div className={`${GLASS} p-5`}>
      <GlossCap />
      <div className="flex items-center justify-between gap-2">
        <span
          className={`${fredoka.className} inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-slate-600`}
        >
          <Icon aria-hidden="true" className="h-4 w-4" style={{ color: stat.color }} />
          {stat.label}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
            stat.positive ? "bg-lime-100 text-lime-800" : "bg-rose-100 text-rose-800"
          }`}
        >
          <DeltaIcon aria-hidden="true" className="h-3.5 w-3.5" />
          {stat.deltaText}
        </span>
      </div>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className={`${fredoka.className} text-3xl font-bold text-slate-900`}>{stat.valueText}</span>
        {stat.suffix && <span className="text-sm font-semibold text-slate-600">{stat.suffix}</span>}
      </p>
      <div className="mt-3">
        <Sparkline values={stat.spark} color={stat.color} />
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* 메인 컴포넌트                                                            */
/* ----------------------------------------------------------------------- */

export default function DashboardClient() {
  const [period, setPeriod] = useState<PeriodKey>("30D");
  const [activePlatforms, setActivePlatforms] = useState<Set<PlatformId>>(
    () => new Set(PLATFORMS.map((p) => p.id)),
  );
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notifOpen) return;
    function handlePointerDown(e: PointerEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setNotifOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [notifOpen]);

  function togglePlatform(id: PlatformId) {
    setActivePlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const meta = PERIOD_META[period];

  const seriesByPlatform = useMemo(
    () => PLATFORMS.map((p) => ({ ...p, values: waveSeries(p.id, period) })),
    [period],
  );

  const activeSeries = useMemo(
    () => seriesByPlatform.filter((s) => activePlatforms.has(s.id)),
    [seriesByPlatform, activePlatforms],
  );

  const totalStreamsThousand = useMemo(
    () => seriesByPlatform.reduce((sum, p) => sum + p.values.reduce((a, b) => a + b, 0), 0),
    [seriesByPlatform],
  );
  const activeTotalThousand = useMemo(
    () => activeSeries.reduce((sum, p) => sum + p.values.reduce((a, b) => a + b, 0), 0),
    [activeSeries],
  );

  const totalStreams = totalStreamsThousand * 1000;
  const revenue = totalStreams * RATE_WON;

  const aggPoints = useMemo(
    () => meta.points.map((_, i) => seriesByPlatform.reduce((sum, p) => sum + p.values[i], 0)),
    [meta.points, seriesByPlatform],
  );

  const stats: StatDisplay[] = useMemo(
    () => [
      {
        key: "streams",
        label: "TOTAL STREAMS",
        icon: Waves,
        color: "#0284c7",
        valueText: compactEn(totalStreams),
        suffix: "회",
        deltaText: pct(KPI_DELTA[period].streams),
        positive: KPI_DELTA[period].streams >= 0,
        spark: aggPoints,
      },
      {
        key: "revenue",
        label: "EST. ROYALTY",
        icon: CircleDollarSign,
        color: "#65a30d",
        valueText: wonCompact(revenue),
        suffix: "",
        deltaText: pct(KPI_DELTA[period].revenue),
        positive: KPI_DELTA[period].revenue >= 0,
        spark: aggPoints.map((v) => Math.round(v * RATE_WON)),
      },
      {
        key: "artists",
        label: "PENDING ARTISTS",
        icon: Users,
        color: "#f59e0b",
        valueText: String(PENDING_ARTISTS[period]),
        suffix: "명",
        deltaText: signedCount(KPI_DELTA[period].artists, "명"),
        positive: KPI_DELTA[period].artists >= 0,
        spark: meta.points.map((_, i) => Math.max(1, PENDING_ARTISTS[period] - (meta.points.length - 1 - i) * 0.7)),
      },
      {
        key: "tracks",
        label: "ACTIVE TRACKS",
        icon: ListMusic,
        color: "#a78bfa",
        valueText: String(ACTIVE_TRACKS[period]),
        suffix: "곡",
        deltaText: signedCount(KPI_DELTA[period].tracks, "곡"),
        positive: KPI_DELTA[period].tracks >= 0,
        spark: meta.points.map((_, i) => Math.max(1, ACTIVE_TRACKS[period] - (meta.points.length - 1 - i) * 3)),
      },
    ],
    [period, totalStreams, revenue, aggPoints, meta.points],
  );

  const trackRows = useMemo(() => {
    const scale = PERIOD_META[period].scale;
    const rows = TRACKS.map((t) => ({ ...t, streams: Math.round(t.base * scale) * 1000 }));
    rows.sort((a, b) => b.streams - a.streams);
    return rows;
  }, [period]);
  const maxTrackStreams = trackRows[0]?.streams ?? 1;

  const waveSummary = `${meta.label} 스트리밍 합계 ${compactEn(activeTotalThousand * 1000)}회 · 전기 대비 ${pct(
    KPI_DELTA[period].streams,
  )} · 표시 중인 플랫폼 ${activeSeries.length}개`;

  const eyebrowClass = `${fredoka.className} text-xs font-bold uppercase tracking-[0.2em] text-sky-700`;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-sky-200 via-cyan-100 to-lime-50 text-slate-900 [color-scheme:light]">
      {/* 장식용 배경 버블 — 스크린리더/포커스 흐름에서 완전히 제외 */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sky-300/50 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-lime-300/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />
      </div>

      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-slate-900 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-bold focus-visible:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
      >
        본문 바로가기
      </a>

      {/* ---------------------------------------------------------------- */}
      {/* 상단 바                                                          */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-white/50 bg-white/40 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:pr-8 lg:pl-28">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-b from-sky-300 via-cyan-400 to-sky-600 shadow-[0_6px_14px_-4px_rgba(2,132,199,0.7)]"
            >
              <Droplets className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
            <span className={`${fredoka.className} text-lg font-bold tracking-tight text-slate-900`}>AquaChart</span>
          </div>

          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="hidden flex-1 items-center justify-center px-6 md:flex"
          >
            <label htmlFor="global-search" className="sr-only">
              아티스트, 트랙 검색
            </label>
            <div className="relative w-full max-w-sm">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              />
              <input
                id="global-search"
                type="search"
                autoComplete="off"
                placeholder="아티스트, 트랙 검색"
                className="h-11 w-full rounded-full border border-white/70 bg-white/60 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <div className="hidden min-h-11 items-center gap-2 rounded-full border border-white/70 bg-white/50 py-1.5 pr-3 pl-1.5 text-sm font-semibold text-slate-800 sm:flex">
              <span
                aria-hidden="true"
                className={`${fredoka.className} flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-lime-300 to-lime-500 text-xs font-bold text-lime-950`}
              >
                루
              </span>
              루메나 레코즈
            </div>

            <div className="relative" ref={notifRef}>
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={notifOpen}
                aria-controls="notif-panel"
                onClick={() => setNotifOpen((v) => !v)}
                aria-label={`알림 ${NOTIFICATIONS.length}개 ${notifOpen ? "닫기" : "열기"}`}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/50 text-slate-700 transition-colors duration-200 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white"
                />
              </button>
              <div
                id="notif-panel"
                hidden={!notifOpen}
                className={`${GLASS} absolute top-14 right-0 z-50 w-72 p-3`}
              >
                <GlossCap />
                <p className="px-1 text-xs font-bold tracking-wide text-slate-500 uppercase">최근 알림</p>
                <ul className="mt-2 space-y-2">
                  {NOTIFICATIONS.map((n) => (
                    <li key={n.title} className="rounded-2xl bg-white/70 p-3 text-xs">
                      <p className="font-bold text-slate-900">{n.title}</p>
                      <p className="mt-0.5 text-slate-600">{n.body}</p>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setNotifOpen(false)}
                  className="mt-3 min-h-9 w-full rounded-full bg-slate-900/5 text-xs font-bold text-slate-700 transition-colors duration-200 hover:bg-slate-900/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 motion-reduce:transition-none"
                >
                  닫기
                </button>
              </div>
            </div>

            <span
              aria-hidden="true"
              className={`${fredoka.className} flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-sky-300 to-sky-600 text-sm font-bold text-white`}
            >
              세
            </span>
            <span className="sr-only">로그인 사용자: 김세아 (프로듀서)</span>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* 좌측 독 내비게이션 (모바일: 하단 바)                              */}
      {/* ---------------------------------------------------------------- */}
      <nav
        aria-label="대시보드 섹션 바로가기"
        className="fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 lg:top-1/2 lg:inset-x-auto lg:bottom-auto lg:left-4 lg:-translate-y-1/2 lg:justify-start"
      >
        <ul className="flex items-center gap-1 rounded-full border border-white/70 bg-white/55 p-1.5 shadow-[0_15px_40px_-15px_rgba(2,132,199,0.55)] backdrop-blur-2xl lg:flex-col lg:gap-2 lg:rounded-[28px] lg:p-2">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="group flex h-11 w-11 flex-col items-center justify-center rounded-full text-slate-700 transition-colors duration-200 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 focus-visible:ring-offset-2 motion-reduce:transition-none lg:h-14 lg:w-14 lg:gap-0.5 lg:rounded-3xl"
              >
                <s.icon aria-hidden="true" className="h-5 w-5" />
                <span className="hidden text-[9px] font-bold lg:block">{s.label}</span>
                <span className="sr-only lg:hidden">{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ---------------------------------------------------------------- */}
      {/* 메인 콘텐츠                                                      */}
      {/* ---------------------------------------------------------------- */}
      <main id="main-content" className="mx-auto max-w-[1400px] px-4 pt-8 pb-28 sm:px-6 lg:pr-8 lg:pl-28 lg:pb-16">
        {/* Overview */}
        <section id="overview" aria-labelledby="hero-heading" className="scroll-mt-28">
          <div className={`${GLASS} p-6 sm:p-10`}>
            <GlossCap />
            <p className={eyebrowClass}>Royalty Control Room</p>
            <h1 id="hero-heading" className="mt-2 text-3xl leading-tight font-bold text-slate-900 sm:text-4xl">
              루메나 레코즈 로열티 관제 콘솔
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-700 sm:text-base">
              스트리밍 데이터를 물 흐르듯 투명하게 — 정산 파형부터 아티스트 성장, 발매 파이프라인까지 한 화면에서
              확인하세요.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <fieldset className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/50 p-1">
                <legend className="sr-only">조회 기간 선택</legend>
                {PERIODS.map((p) => (
                  <div key={p}>
                    <input
                      type="radio"
                      id={`period-${p}`}
                      name="period"
                      value={p}
                      checked={period === p}
                      onChange={() => setPeriod(p)}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={`period-${p}`}
                      className={`${fredoka.className} flex min-h-11 min-w-16 cursor-pointer items-center justify-center rounded-full px-4 text-center text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-white/70 peer-checked:bg-gradient-to-b peer-checked:from-sky-700 peer-checked:to-sky-900 peer-checked:text-white peer-checked:shadow-[0_6px_16px_-4px_rgba(3,105,161,0.6)] peer-focus-visible:outline peer-focus-visible:outline-4 peer-focus-visible:outline-sky-400 peer-focus-visible:outline-offset-2 motion-reduce:transition-none`}
                    >
                      {p}
                    </label>
                  </div>
                ))}
              </fieldset>

              <fieldset className="flex flex-wrap items-center gap-2">
                <legend className="sr-only">스트리밍 플랫폼 필터</legend>
                {PLATFORMS.map((pf) => {
                  const checked = activePlatforms.has(pf.id);
                  return (
                    <div key={pf.id}>
                      <input
                        type="checkbox"
                        id={`pf-${pf.id}`}
                        checked={checked}
                        onChange={() => togglePlatform(pf.id)}
                        className="peer sr-only"
                      />
                      <label
                        htmlFor={`pf-${pf.id}`}
                        style={checked ? { backgroundColor: pf.chip } : undefined}
                        className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border border-white/70 bg-white/40 px-3 text-xs font-bold text-slate-700 transition-colors duration-200 hover:bg-white/70 peer-checked:border-transparent peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-4 peer-focus-visible:outline-sky-400 peer-focus-visible:outline-offset-2 motion-reduce:transition-none"
                      >
                        <pf.icon aria-hidden="true" className="h-4 w-4" />
                        {pf.name}
                        {checked && <Check aria-hidden="true" className="h-3.5 w-3.5" />}
                      </label>
                    </div>
                  );
                })}
              </fieldset>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <StatCard key={s.key} stat={s} />
            ))}
          </div>
        </section>

        {/* Waveform */}
        <section id="waveform" aria-labelledby="waveform-heading" className="mt-8 scroll-mt-28">
          <div className={`${GLASS} p-6 sm:p-8`}>
            <GlossCap />
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={eyebrowClass}>Streaming Waveform</p>
                <h2 id="waveform-heading" className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                  플랫폼별 스트리밍 파형
                </h2>
              </div>
              <p className="text-sm text-slate-600">
                표시 합계{" "}
                <span className={`${fredoka.className} font-bold text-slate-900`}>
                  {compactEn(activeTotalThousand * 1000)}
                </span>{" "}
                회 · {meta.label}
              </p>
            </div>

            <figure className="mt-6">
              <div className="h-56 sm:h-72">
                <StackedWave
                  series={activeSeries.map((s) => ({ id: s.id, color: s.color, values: s.values }))}
                  labels={meta.points}
                />
              </div>
              <figcaption className="mt-2 text-xs text-slate-600">{waveSummary}</figcaption>
            </figure>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {seriesByPlatform.map((s) => {
                const on = activePlatforms.has(s.id);
                return (
                  <li
                    key={s.id}
                    className={`flex items-center gap-2 text-xs font-semibold ${on ? "text-slate-700" : "text-slate-400"}`}
                  >
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: s.chip, opacity: on ? 1 : 0.35 }}
                    />
                    {s.name}
                    <span>{compactEn(s.values.reduce((a, b) => a + b, 0) * 1000)}회</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Tracks & Split */}
        <section id="tracks" aria-labelledby="tracks-heading" className="mt-8 scroll-mt-28">
          <p className={eyebrowClass}>Tracks &amp; Split</p>
          <h2 id="tracks-heading" className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            최다 재생곡 &amp; 정산 비율
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-5">
            <div className={`${GLASS} p-6 sm:p-8 lg:col-span-3`}>
              <GlossCap />
              <h3 className="text-base font-bold text-slate-900">이번 기간 최다 재생곡</h3>
              <ol className="mt-5 space-y-4">
                {trackRows.map((t, i) => {
                  const pf = PLATFORM_MAP[t.platform];
                  return (
                    <li key={t.title}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate font-bold text-slate-900">
                          <span className={`${fredoka.className} text-slate-500`}>#{i + 1}</span> {t.title}
                          <span className="ml-1 font-normal text-slate-600">· {t.artist}</span>
                        </span>
                        <span className={`${fredoka.className} shrink-0 font-bold text-slate-800`}>
                          {compactEn(t.streams)}
                        </span>
                      </div>
                      <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-white/60 ring-1 ring-white/70">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(t.streams / maxTrackStreams) * 100}%`, backgroundColor: pf.chip }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className={`${GLASS} p-6 sm:p-8 lg:col-span-2`}>
              <GlossCap />
              <h3 className="text-base font-bold text-slate-900">정산 비율 구조</h3>
              <div className="mt-5 flex items-center gap-6">
                <Donut segments={SPLIT} />
                <ul className="flex-1 space-y-2.5">
                  {SPLIT.map((seg) => (
                    <li key={seg.label} className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex items-center gap-2 text-slate-700">
                        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                        {seg.label}
                      </span>
                      <span className={`${fredoka.className} font-bold text-slate-900`}>{seg.pct}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Roster */}
        <section id="roster" aria-labelledby="roster-heading" className="mt-8 scroll-mt-28">
          <p className={eyebrowClass}>Artist Roster</p>
          <h2 id="roster-heading" className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            아티스트 로스터
          </h2>

          <div className={`${GLASS} mt-6 overflow-x-auto p-4 sm:p-6`}>
            <GlossCap />
            <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-left text-sm">
              <caption className="sr-only">아티스트별 스트리밍, 성장률, 정산 대기액, 상태 현황</caption>
              <thead>
                <tr className="text-xs tracking-wide text-slate-500 uppercase">
                  <th scope="col" className="px-4 py-2 font-bold">
                    아티스트
                  </th>
                  <th scope="col" className="px-4 py-2 font-bold">
                    이번 기간 스트림
                  </th>
                  <th scope="col" className="px-4 py-2 font-bold">
                    성장률
                  </th>
                  <th scope="col" className="px-4 py-2 font-bold">
                    정산 대기액
                  </th>
                  <th scope="col" className="px-4 py-2 font-bold">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROSTER.map((a) => (
                  <tr key={a.name}>
                    <td className="rounded-l-2xl bg-white/60 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={`${fredoka.className} flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-sky-300 to-lime-300 text-xs font-bold text-slate-900`}
                        >
                          {a.name.slice(0, 1)}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{a.name}</p>
                          <p className="text-xs text-slate-600">{a.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`${fredoka.className} bg-white/60 px-4 py-3 font-semibold text-slate-900`}>
                      {compactEn(a.streams)}
                    </td>
                    <td className="bg-white/60 px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                          a.growth >= 0 ? "bg-lime-100 text-lime-800" : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {a.growth >= 0 ? (
                          <TrendingUp aria-hidden="true" className="h-3.5 w-3.5" />
                        ) : (
                          <TrendingDown aria-hidden="true" className="h-3.5 w-3.5" />
                        )}
                        {pct(a.growth)}
                      </span>
                    </td>
                    <td className="bg-white/60 px-4 py-3 text-slate-700">{a.pending > 0 ? won(a.pending) : "—"}</td>
                    <td className="rounded-r-2xl bg-white/60 px-4 py-3">
                      <StatusChip status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Releases */}
        <section id="releases" aria-labelledby="releases-heading" className="mt-8 scroll-mt-28">
          <p className={eyebrowClass}>Release Pipeline</p>
          <h2 id="releases-heading" className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            다가오는 발매 일정
          </h2>

          <ul className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
            {RELEASES.map((r) => (
              <li key={r.title} className={`${GLASS} min-w-[260px] max-w-[280px] shrink-0 snap-start p-5`}>
                <GlossCap />
                <p className={eyebrowClass}>{r.date}</p>
                <p className="mt-1 font-bold text-slate-900">{r.title}</p>
                <p className="text-sm text-slate-600">{r.artist}</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>{r.stage}</span>
                    <span className={fredoka.className}>{r.progress}%</span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/60 ring-1 ring-white/70">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 to-lime-400"
                      style={{ width: `${r.progress}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Payouts */}
        <section id="payouts" aria-labelledby="payouts-heading" className="mt-8 mb-4 scroll-mt-28">
          <p className={eyebrowClass}>Payout Queue</p>
          <h2 id="payouts-heading" className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            정산 대기열
          </h2>

          <div className={`${GLASS} mt-6 p-2 sm:p-4`}>
            <GlossCap />
            <ul className="divide-y divide-white/60">
              {PAYOUTS.map((p) => (
                <li key={`${p.artist}-${p.due}`} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-sky-300 to-cyan-500 text-white"
                    >
                      <Wallet className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{p.artist}</p>
                      <p className="text-xs text-slate-600">지급 예정일 {p.due}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`${fredoka.className} font-bold text-slate-900`}>
                      {p.amount > 0 ? won(p.amount) : "—"}
                    </span>
                    <StatusChip status={p.status} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="mt-10 pb-16 text-center text-xs text-slate-500 lg:pb-0 lg:text-left">
          © 2026 AquaChart Labs · 루메나 레코즈 워크스페이스
        </footer>
      </main>
    </div>
  );
}
