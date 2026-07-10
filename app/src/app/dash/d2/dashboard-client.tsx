"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Clapperboard,
  Flame,
  Hash,
  Home,
  MapPin,
  Music2,
  Play,
  Radio,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import "./comet.css";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type RangeKey = "7d" | "30d" | "90d";
type MetricKey = "views" | "engagement" | "shares";
type PlatformId = "instagram" | "tiktok" | "youtube" | "x";
type ContentType = "reels" | "video" | "post";
type SectionId = "overview" | "platforms" | "content" | "audience" | "schedule";

/* ------------------------------------------------------------------ */
/* Static data — a single honest snapshot, no fake live updates.       */
/* ------------------------------------------------------------------ */

const SNAPSHOT_LABEL = "2026년 7월 10일 오전 9:00 기준 스냅샷";

const RANGE_LABEL: Record<RangeKey, string> = {
  "7d": "최근 7일",
  "30d": "최근 30일",
  "90d": "최근 90일",
};

const RANGE_OPTIONS: { id: RangeKey; label: string }[] = [
  { id: "7d", label: "7일" },
  { id: "30d", label: "30일" },
  { id: "90d", label: "90일" },
];

const RANGE_DATA: Record<
  RangeKey,
  {
    total: number;
    delta: number;
    axisStart: string;
    axisEnd: string;
    metrics: Record<MetricKey, number[]>;
  }
> = {
  "7d": {
    total: 1284300,
    delta: 8.4,
    axisStart: "월",
    axisEnd: "일",
    metrics: {
      views: [82000, 95000, 88000, 121000, 109000, 148000, 172000],
      engagement: [3.2, 3.6, 3.1, 4.4, 4.0, 5.1, 5.8],
      shares: [1200, 1450, 1300, 2100, 1850, 2600, 3100],
    },
  },
  "30d": {
    total: 4912700,
    delta: 21.6,
    axisStart: "1주 전",
    axisEnd: "오늘",
    metrics: {
      views: [210000, 265000, 240000, 320000, 298000, 410000, 385000, 512000],
      engagement: [2.8, 3.1, 2.9, 3.6, 3.4, 4.2, 4.0, 4.9],
      shares: [3400, 4100, 3800, 5200, 4900, 6800, 6300, 8400],
    },
  },
  "90d": {
    total: 12038900,
    delta: 46.2,
    axisStart: "13주 전",
    axisEnd: "오늘",
    metrics: {
      views: [520000, 610000, 580000, 720000, 690000, 850000, 810000, 980000, 1120000, 1340000],
      engagement: [2.1, 2.3, 2.2, 2.9, 2.7, 3.4, 3.2, 3.9, 4.3, 5.0],
      shares: [8200, 9600, 9100, 11400, 10800, 13500, 12900, 15800, 17600, 21200],
    },
  },
};

const METRIC_LABEL: Record<MetricKey, string> = {
  views: "조회수",
  engagement: "참여율",
  shares: "공유수",
};

const METRIC_OPTIONS: { id: MetricKey; label: string }[] = [
  { id: "views", label: "조회수" },
  { id: "engagement", label: "참여율" },
  { id: "shares", label: "공유수" },
];

const MILESTONE = { current: 438200, goal: 500000, etaDays: 47 };

const PLATFORM_NAME: Record<PlatformId, string> = {
  instagram: "인스타그램",
  tiktok: "틱톡",
  youtube: "유튜브",
  x: "X",
};

const PLATFORMS: {
  id: PlatformId;
  name: string;
  icon: typeof Camera;
  followers: number;
  growth: number;
  trend: number[];
  iconBg: string;
  trendColor: string;
  selectedRing: string;
  selectedTint: string;
}[] = [
  {
    id: "instagram",
    name: "인스타그램",
    icon: Camera,
    followers: 218400,
    growth: 5.2,
    trend: [40, 55, 48, 62, 58, 74, 80],
    iconBg: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300",
    trendColor: "text-fuchsia-500 dark:text-fuchsia-400",
    selectedRing: "border-fuchsia-400 dark:border-fuchsia-400/60",
    selectedTint: "bg-fuchsia-50 dark:bg-fuchsia-500/10",
  },
  {
    id: "tiktok",
    name: "틱톡",
    icon: Music2,
    followers: 156900,
    growth: 12.8,
    trend: [30, 42, 38, 52, 60, 55, 74],
    iconBg: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
    trendColor: "text-cyan-500 dark:text-cyan-400",
    selectedRing: "border-cyan-400 dark:border-cyan-400/60",
    selectedTint: "bg-cyan-50 dark:bg-cyan-500/10",
  },
  {
    id: "youtube",
    name: "유튜브",
    icon: Play,
    followers: 52300,
    growth: 2.1,
    trend: [50, 48, 52, 49, 53, 51, 55],
    iconBg: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    trendColor: "text-rose-500 dark:text-rose-400",
    selectedRing: "border-rose-400 dark:border-rose-400/60",
    selectedTint: "bg-rose-50 dark:bg-rose-500/10",
  },
  {
    id: "x",
    name: "X",
    icon: Hash,
    followers: 10600,
    growth: -1.4,
    trend: [60, 58, 55, 52, 50, 48, 45],
    iconBg: "bg-zinc-200 text-zinc-700 dark:bg-white/10 dark:text-zinc-200",
    trendColor: "text-zinc-500 dark:text-zinc-400",
    selectedRing: "border-zinc-400 dark:border-zinc-400/60",
    selectedTint: "bg-zinc-100 dark:bg-white/5",
  },
];

const AUDIENCE_AGE: { label: string; value: number; strokeClass: string; dotClass: string }[] = [
  { label: "18–24세", value: 38, strokeClass: "text-fuchsia-500", dotClass: "bg-fuchsia-500" },
  { label: "25–34세", value: 34, strokeClass: "text-orange-500", dotClass: "bg-orange-500" },
  { label: "35–44세", value: 16, strokeClass: "text-amber-400", dotClass: "bg-amber-400" },
  { label: "45세 이상", value: 12, strokeClass: "text-zinc-400", dotClass: "bg-zinc-400" },
];

const AUDIENCE_LOCATIONS: { name: string; value: number }[] = [
  { name: "서울", value: 42 },
  { name: "해외", value: 35 },
  { name: "부산", value: 14 },
  { name: "인천", value: 9 },
];

const CONTENT_TYPE_STYLE: Record<ContentType, string> = {
  reels: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300",
  video: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
  post: "bg-zinc-200 text-zinc-700 dark:bg-white/10 dark:text-zinc-200",
};

const TOP_CONTENT: {
  id: string;
  title: string;
  platform: PlatformId;
  type: ContentType;
  views: number;
  engagement: number;
}[] = [
  { id: "c1", title: "여름 브이로그: 제주 3박4일", platform: "instagram", type: "reels", views: 482000, engagement: 6.8 },
  { id: "c2", title: "책상 정리 타임랩스", platform: "tiktok", type: "video", views: 1200000, engagement: 9.4 },
  { id: "c3", title: "1일 1식 다이어트 브이로그", platform: "youtube", type: "video", views: 356000, engagement: 4.1 },
  { id: "c4", title: "새벽 루틴 15분 요약", platform: "x", type: "post", views: 88000, engagement: 3.2 },
  { id: "c5", title: "카페 투어: 성수동 편", platform: "instagram", type: "reels", views: 214000, engagement: 5.5 },
  { id: "c6", title: "겨울 코디 5가지", platform: "tiktok", type: "video", views: 640000, engagement: 7.9 },
  { id: "c7", title: "구독자 10만 기념 Q&A", platform: "youtube", type: "video", views: 198000, engagement: 8.2 },
  { id: "c8", title: "스레드 챌린지 참여 후기", platform: "x", type: "post", views: 42000, engagement: 2.6 },
];

const MAX_VIEWS = Math.max(...TOP_CONTENT.map((c) => c.views));

const SCHEDULE: { id: string; day: string; title: string; platform: PlatformId; time: string }[] = [
  { id: "s1", day: "월", title: "브랜드 협업 언박싱", platform: "youtube", time: "오후 6:00" },
  { id: "s2", day: "수", title: "데일리 루틴 숏폼", platform: "tiktok", time: "오전 8:00" },
  { id: "s3", day: "금", title: "주간 Q&A 라이브 예고", platform: "instagram", time: "오후 9:00" },
  { id: "s4", day: "토", title: "위클리 브이로그", platform: "youtube", time: "오전 11:00" },
];

const NAV_ITEMS: { id: SectionId; label: string; icon: typeof Home }[] = [
  { id: "overview", label: "개요", icon: Home },
  { id: "platforms", label: "채널", icon: Radio },
  { id: "content", label: "콘텐츠", icon: Clapperboard },
  { id: "audience", label: "오디언스", icon: Users },
  { id: "schedule", label: "일정", icon: CalendarDays },
];

/* ------------------------------------------------------------------ */
/* Formatting helpers — deterministic, safe for SSR/CSR parity.        */
/* ------------------------------------------------------------------ */

const numberFormatter = new Intl.NumberFormat("ko-KR");
const compactFormatter = new Intl.NumberFormat("ko-KR", { notation: "compact", maximumFractionDigits: 1 });

function formatNumber(n: number) {
  return numberFormatter.format(n);
}

function formatCompact(n: number) {
  return compactFormatter.format(n);
}

/* ------------------------------------------------------------------ */
/* Chart geometry helpers — pure functions, no randomness/time.        */
/* ------------------------------------------------------------------ */

function buildLinePaths(values: number[], width: number, height: number) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const spread = max - min || 1;
  const stepX = width / (values.length - 1 || 1);
  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / spread) * (height - 6) - 3;
    return [x, y] as const;
  });
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width.toFixed(1)},${height} L0,${height} Z`;
  return { line, area };
}

const DONUT_R = 50;
const DONUT_CIRC = 2 * Math.PI * DONUT_R;

function buildDonutSegments(data: { value: number }[]) {
  let cumulative = 0;
  return data.map((d) => {
    const dashLength = (d.value / 100) * DONUT_CIRC;
    const seg = {
      dashArray: `${dashLength} ${DONUT_CIRC - dashLength}`,
      dashOffset: -((cumulative / 100) * DONUT_CIRC),
    };
    cumulative += d.value;
    return seg;
  });
}

const RING_R = 50;
const RING_CIRC = 2 * Math.PI * RING_R;

/* ------------------------------------------------------------------ */
/* Reduced-motion: subscribe to the OS setting directly (matchMedia),  */
/* since framer-motion's hook can miss live OS changes.                */
/* ------------------------------------------------------------------ */

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function useReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

function CometMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="16" cy="8" r="4" fill="currentColor" />
      <path d="M13 10.5C9 12 4 14.5 2 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M14.5 9.5C10.8 11.3 6.5 14 4.5 18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
    </svg>
  );
}

function MiniBar({ pct, className }: { pct: number; className: string }) {
  const width = Math.max(2, Math.min(100, pct));
  return (
    <svg
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-900/5 dark:bg-white/10"
      aria-hidden="true"
    >
      <rect x="0" y="0" width={width} height="6" rx="3" className={className} fill="currentColor" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function DashboardClient({ displayFontVariable }: { displayFontVariable: string }) {
  const [range, setRange] = useState<RangeKey>("30d");
  const [metric, setMetric] = useState<MetricKey>("views");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | "all">("all");
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState<SectionId>("overview");

  const reducedMotion = useReducedMotion();

  const hero = RANGE_DATA[range];
  const chartValues = hero.metrics[metric];

  const heroChart = useMemo(() => buildLinePaths(hero.metrics.views, 320, 100), [hero]);
  const mainChart = useMemo(() => buildLinePaths(chartValues, 560, 200), [chartValues]);
  const donutSegments = useMemo(() => buildDonutSegments(AUDIENCE_AGE), []);

  const milestoneProgress = MILESTONE.current / MILESTONE.goal;
  const milestoneOffset = RING_CIRC * (1 - milestoneProgress);

  const filteredContent = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOP_CONTENT.filter((item) => {
      const matchesPlatform = selectedPlatform === "all" || item.platform === selectedPlatform;
      const matchesQuery = q.length === 0 || item.title.toLowerCase().includes(q);
      return matchesPlatform && matchesQuery;
    });
  }, [selectedPlatform, query]);

  function handleNavClick(event: React.MouseEvent<HTMLAnchorElement>, sectionId: SectionId) {
    setActiveSection(sectionId);
    if (reducedMotion) return;
    const target = document.getElementById(sectionId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className={`${displayFontVariable} [--font-display:var(--font-display-d2)] relative min-h-screen bg-orange-50 text-zinc-900 antialiased [color-scheme:light_dark] dark:bg-[#120E1B] dark:text-zinc-50`}
    >
      <a
        href="#main-content"
        className="sr-only rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 dark:bg-white dark:text-zinc-900"
      >
        본문으로 건너뛰기
      </a>

      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="d2-blob-a absolute -top-32 -left-24 h-96 w-96 rounded-full bg-fuchsia-400/25 blur-3xl dark:bg-fuchsia-500/15" />
        <div className="d2-blob-b absolute top-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-amber-300/25 blur-3xl dark:bg-amber-400/10" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Desktop icon rail */}
        <nav
          aria-label="주요 메뉴"
          className="sticky top-0 hidden h-screen w-20 shrink-0 flex-col items-center gap-2 border-r border-zinc-900/10 bg-white/70 py-6 backdrop-blur-md md:flex dark:border-white/10 dark:bg-zinc-900/60"
        >
          <a
            href="#overview"
            onClick={(e) => handleNavClick(e, "overview")}
            aria-label="Comet 홈으로 이동"
            className="mb-6 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-orange-500 to-amber-400 text-white shadow-md shadow-orange-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2"
          >
            <CometMark className="h-5 w-5" />
          </a>
          <ul className="flex flex-1 flex-col items-center gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 ${
                      isActive
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                        : "text-zinc-500 hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex min-h-screen flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-zinc-900/10 bg-orange-50/80 px-4 py-3 backdrop-blur-md sm:px-6 dark:border-white/10 dark:bg-[#120E1B]/80">
            <a
              href="#overview"
              onClick={(e) => handleNavClick(e, "overview")}
              aria-label="Comet 홈으로 이동"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-orange-500 to-amber-400 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 md:hidden"
            >
              <CometMark className="h-4 w-4" />
            </a>
            <div className="hidden flex-col leading-none md:flex">
              <span className="font-display text-lg font-semibold tracking-tight">Comet</span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">크리에이터 성장 OS</span>
            </div>

            <div className="ml-auto flex flex-1 items-center sm:flex-none">
              <label htmlFor="content-search" className="sr-only">
                인기 콘텐츠 제목 검색
              </label>
              <div className="relative w-full sm:w-64">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400"
                />
                <input
                  id="content-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="콘텐츠 제목 검색"
                  className="min-h-11 w-full rounded-full border border-zinc-900/10 bg-white py-2 pr-4 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-50"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white py-1 pr-3 pl-1 dark:border-white/10 dark:bg-zinc-900">
              <span
                aria-hidden="true"
                className="grid h-8 w-8 place-items-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900"
              >
                YP
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-sm font-medium">유나 박</span>
                <span className="block text-[11px] text-zinc-500 dark:text-zinc-400">스튜디오 오너</span>
              </span>
            </div>
          </header>

          <main id="main-content" className="flex-1 px-4 pt-6 pb-28 sm:px-6 md:pb-10">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">안녕하세요, 유나 님</h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              {RANGE_LABEL[range]} 동안 채널이 가파르게 성장했어요. 아래에서 흐름을 확인해 보세요.
            </p>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{SNAPSHOT_LABEL}</p>

            <div className="mt-8 grid grid-cols-1 gap-4">
              {/* Overview */}
              <section id="overview" aria-label="개요" className="grid scroll-mt-24 grid-cols-1 gap-4 md:grid-cols-12">
                <div className="relative overflow-hidden rounded-3xl border border-zinc-900/10 bg-white p-6 shadow-sm md:col-span-7 dark:border-white/10 dark:bg-zinc-900">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">총 도달 수</h2>
                      <p className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                        {formatNumber(hero.total)}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            hero.delta >= 0 ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                          }`}
                        >
                          {hero.delta >= 0 ? (
                            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          {hero.delta >= 0 ? "+" : ""}
                          {hero.delta.toFixed(1)}%
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">4개 채널 합산 · 직전 기간 대비</span>
                      </div>
                    </div>

                    <div
                      role="group"
                      aria-label="기간 선택"
                      className="inline-flex rounded-full border border-zinc-900/10 bg-orange-50 p-1 dark:border-white/10 dark:bg-zinc-950"
                    >
                      {RANGE_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          aria-pressed={range === opt.id}
                          onClick={() => setRange(opt.id)}
                          className={`min-h-11 rounded-full px-3.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 ${
                            range === opt.id
                              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <svg
                    viewBox="0 0 320 100"
                    preserveAspectRatio="none"
                    className="mt-6 h-28 w-full text-fuchsia-500"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={heroChart.area} fill="url(#heroFill)" />
                    <path
                      key={range}
                      d={heroChart.line}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="d2-trail-line"
                    />
                  </svg>
                  <p className="sr-only">{RANGE_LABEL[range]} 조회수 추이: {hero.metrics.views.join(", ")}</p>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-zinc-900/10 bg-white p-6 shadow-sm md:col-span-5 dark:border-white/10 dark:bg-zinc-900">
                  <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">팔로워 마일스톤</h2>
                  <div className="mt-4 flex items-center gap-5">
                    <svg
                      viewBox="0 0 120 120"
                      className="h-28 w-28 shrink-0 -rotate-90"
                      role="img"
                      aria-label={`50만 팔로워 목표 대비 ${Math.round(milestoneProgress * 100)}퍼센트 달성`}
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r={RING_R}
                        fill="none"
                        strokeWidth="10"
                        className="stroke-zinc-900/10 dark:stroke-white/10"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r={RING_R}
                        fill="none"
                        stroke="url(#ringGrad)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={RING_CIRC}
                        strokeDashoffset={milestoneOffset}
                      />
                      <defs>
                        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div>
                      <p className="font-display text-2xl font-semibold">{Math.round(milestoneProgress * 100)}%</p>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {formatNumber(MILESTONE.current)} / {formatNumber(MILESTONE.goal)}명
                      </p>
                      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-400/10 dark:text-amber-300">
                        <Flame className="h-3.5 w-3.5" aria-hidden="true" /> 이 속도면 약 {MILESTONE.etaDays}일 후 달성
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Platforms */}
              <section id="platforms" aria-label="플랫폼 현황" className="scroll-mt-24">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold">채널별 현황</h2>
                  {selectedPlatform !== "all" && (
                    <button
                      type="button"
                      onClick={() => setSelectedPlatform("all")}
                      className="min-h-9 rounded-full border border-zinc-900/10 px-3 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10"
                    >
                      전체 보기
                    </button>
                  )}
                </div>
                <ul className="mt-4 flex gap-4 overflow-x-auto pb-2" role="list">
                  {PLATFORMS.map((p) => {
                    const isSelected = selectedPlatform === p.id;
                    const sparkline = buildLinePaths(p.trend, 100, 32);
                    return (
                      <li key={p.id} className="w-56 shrink-0">
                        <button
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => setSelectedPlatform((prev) => (prev === p.id ? "all" : p.id))}
                          className={`w-full rounded-3xl border p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 ${
                            isSelected
                              ? `${p.selectedRing} ${p.selectedTint}`
                              : "border-zinc-900/10 bg-white hover:bg-zinc-900/[0.03] dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`grid h-9 w-9 place-items-center rounded-xl ${p.iconBg}`}>
                              <p.icon className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <span
                              className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                                p.growth >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              {p.growth >= 0 ? (
                                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                              ) : (
                                <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
                              )}
                              {Math.abs(p.growth).toFixed(1)}%
                            </span>
                          </div>
                          <p className="mt-3 text-sm font-medium">{p.name}</p>
                          <p className="font-display mt-0.5 text-xl font-semibold">{formatNumber(p.followers)}</p>
                          <svg
                            viewBox="0 0 100 32"
                            preserveAspectRatio="none"
                            className={`mt-3 h-6 w-full ${p.trendColor}`}
                            aria-hidden="true"
                          >
                            <path d={sparkline.line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <p aria-live="polite" className="sr-only">
                  {selectedPlatform === "all"
                    ? "모든 채널을 표시합니다"
                    : `${PLATFORM_NAME[selectedPlatform]} 채널 필터가 적용되었습니다`}
                </p>
              </section>

              {/* Content */}
              <section id="content" aria-label="콘텐츠" className="grid scroll-mt-24 grid-cols-1 gap-4 md:grid-cols-12">
                <div className="rounded-3xl border border-zinc-900/10 bg-white p-6 shadow-sm md:col-span-7 dark:border-white/10 dark:bg-zinc-900">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-base font-semibold">콘텐츠 퍼포먼스</h2>
                    <div
                      role="group"
                      aria-label="지표 선택"
                      className="inline-flex rounded-full border border-zinc-900/10 bg-orange-50 p-1 dark:border-white/10 dark:bg-zinc-950"
                    >
                      {METRIC_OPTIONS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          aria-pressed={metric === m.id}
                          onClick={() => setMetric(m.id)}
                          className={`min-h-11 rounded-full px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 ${
                            metric === m.id
                              ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <svg
                    viewBox="0 0 560 200"
                    preserveAspectRatio="none"
                    className="mt-6 h-56 w-full text-orange-500"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[0.25, 0.5, 0.75].map((f) => (
                      <line key={f} x1="0" x2="560" y1={200 * f} y2={200 * f} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
                    ))}
                    <path d={mainChart.area} fill="url(#chartFill)" />
                    <path
                      key={`${range}-${metric}`}
                      d={mainChart.line}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="d2-trail-line"
                    />
                  </svg>
                  <div className="mt-2 flex justify-between text-xs text-zinc-400 dark:text-zinc-500">
                    <span>{hero.axisStart}</span>
                    <span>{hero.axisEnd}</span>
                  </div>
                  <p className="sr-only">
                    {RANGE_LABEL[range]} 동안 {METRIC_LABEL[metric]} 추이: {chartValues.join(", ")}
                  </p>
                </div>

                <div className="rounded-3xl border border-zinc-900/10 bg-white p-6 shadow-sm md:col-span-5 dark:border-white/10 dark:bg-zinc-900">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold">인기 콘텐츠</h2>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{filteredContent.length}개</span>
                  </div>
                  <p aria-live="polite" className="sr-only">
                    {filteredContent.length}개의 콘텐츠를 찾았어요
                  </p>

                  {filteredContent.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-zinc-900/15 p-6 text-center dark:border-white/15">
                      <p className="text-sm font-medium">조건에 맞는 콘텐츠가 없어요</p>
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">검색어나 채널 필터를 다시 확인해 보세요.</p>
                    </div>
                  ) : (
                    <ol className="mt-4 space-y-3">
                      {filteredContent.map((item, idx) => (
                        <li key={item.id} className="flex items-center gap-3 rounded-2xl border border-zinc-900/5 p-3 dark:border-white/5">
                          <span
                            aria-hidden="true"
                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-semibold ${CONTENT_TYPE_STYLE[item.type]}`}
                          >
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium" title={item.title}>
                              {item.title}
                            </p>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                              {PLATFORM_NAME[item.platform]} · 조회수 {formatCompact(item.views)} · 참여율 {item.engagement.toFixed(1)}%
                            </p>
                            <div className="mt-1.5">
                              <MiniBar pct={(item.views / MAX_VIEWS) * 100} className="text-fuchsia-500 dark:text-fuchsia-400" />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </section>

              {/* Audience */}
              <section
                id="audience"
                aria-label="오디언스"
                className="scroll-mt-24 rounded-3xl border border-zinc-900/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900"
              >
                <h2 className="text-base font-semibold">오디언스 펄스</h2>
                <div className="mt-5 grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="flex items-center gap-6">
                    <svg
                      viewBox="0 0 120 120"
                      className="h-32 w-32 shrink-0 -rotate-90"
                      role="img"
                      aria-label={`연령대 구성: ${AUDIENCE_AGE.map((a) => `${a.label} ${a.value}퍼센트`).join(", ")}`}
                    >
                      {donutSegments.map((seg, i) => (
                        <circle
                          key={AUDIENCE_AGE[i].label}
                          cx="60"
                          cy="60"
                          r={DONUT_R}
                          fill="none"
                          strokeWidth="16"
                          strokeDasharray={seg.dashArray}
                          strokeDashoffset={seg.dashOffset}
                          className={AUDIENCE_AGE[i].strokeClass}
                          stroke="currentColor"
                        />
                      ))}
                    </svg>
                    <ul className="space-y-2 text-sm">
                      {AUDIENCE_AGE.map((a) => (
                        <li key={a.label} className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${a.dotClass}`} aria-hidden="true" />
                          <span className="text-zinc-600 dark:text-zinc-400">{a.label}</span>
                          <span className="font-semibold">{a.value}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="sr-only">주요 접속 지역</h3>
                    <ul className="space-y-3">
                      {AUDIENCE_LOCATIONS.map((loc) => (
                        <li key={loc.name}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="inline-flex items-center gap-1.5 font-medium">
                              <MapPin className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                              {loc.name}
                            </span>
                            <span className="text-zinc-500 dark:text-zinc-400">{loc.value}%</span>
                          </div>
                          <MiniBar pct={loc.value} className="text-indigo-500 dark:text-indigo-400" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Schedule */}
              <section id="schedule" aria-label="일정" className="grid scroll-mt-24 grid-cols-1 gap-4 md:grid-cols-12">
                <div className="rounded-3xl border border-zinc-900/10 bg-white p-6 shadow-sm md:col-span-7 dark:border-white/10 dark:bg-zinc-900">
                  <h2 className="text-base font-semibold">이번 주 예정 콘텐츠</h2>
                  <ul className="mt-4 divide-y divide-zinc-900/5 dark:divide-white/5">
                    {SCHEDULE.map((s) => (
                      <li key={s.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-orange-100 text-xs font-semibold text-orange-700 dark:bg-orange-400/10 dark:text-orange-300">
                          {s.day}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{s.title}</p>
                          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                            {PLATFORM_NAME[s.platform]} · {s.time}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <aside
                  aria-label="AI 인사이트"
                  className="relative overflow-hidden rounded-3xl border border-fuchsia-300/40 bg-gradient-to-br from-fuchsia-50 via-orange-50 to-amber-50 p-6 shadow-sm md:col-span-5 dark:border-fuchsia-400/20 dark:from-fuchsia-500/10 dark:via-orange-500/10 dark:to-amber-500/10"
                >
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-fuchsia-700 dark:bg-zinc-900/60 dark:text-fuchsia-300">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> AI 인사이트
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-zinc-800 dark:text-zinc-100">
                    지난주 대비 릴스 저장 수가 <strong className="font-semibold">34%</strong> 증가했어요. 이 흐름이 이어지면 이번
                    달 안에 팔로워 45만 명을 넘길 가능성이 높아요.
                  </p>
                  <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">최근 12주 데이터 기반 추정치예요.</p>
                </aside>
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="모바일 메뉴"
        className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-zinc-900/10 bg-white/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden dark:border-white/10 dark:bg-zinc-900/95"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl py-1.5 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:ring-offset-2 ${
                isActive ? "text-fuchsia-600 dark:text-fuchsia-400" : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
