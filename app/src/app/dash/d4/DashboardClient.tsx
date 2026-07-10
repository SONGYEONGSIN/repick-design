"use client";

import { useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Footprints,
  HeartPulse,
  Home,
  Leaf,
  LineChart,
  Menu,
  Minus,
  Moon,
  Sparkles,
  SunMedium,
  Thermometer,
  Wind,
  X,
  type LucideIcon,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* 디자인 토큰 (이 페이지 전용 — 전역 테마를 건드리지 않기 위해 로컬 상수로 관리) */
/* ---------------------------------------------------------------------- */

const TEXT_SECONDARY = "text-[#5A5244] dark:text-[#B8AF9C]";
const CARD =
  "rounded-3xl border border-[#E8DFCF] dark:border-[#2E3226] bg-white/70 dark:bg-white/5";
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F5744] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6EF] dark:focus-visible:ring-[#8FBB9C] dark:focus-visible:ring-offset-[#14150F]";
const SAGE_TEXT = "text-[#3F5744] dark:text-[#8FBB9C]";

const DIRECTION_CLASS: Record<"up" | "down" | "flat", string> = {
  up: "text-[#3F5744] dark:text-[#8FBB9C]",
  down: "text-[#C1613F] dark:text-[#E2967A]",
  flat: TEXT_SECONDARY,
};

const DIRECTION_ICON: Record<"up" | "down" | "flat", LucideIcon> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
};

/* ---------------------------------------------------------------------- */
/* 더미 데이터 (정적 스냅샷 — 실시간 조작 없음)                              */
/* ---------------------------------------------------------------------- */

type Period = "day" | "week" | "month";
const PERIODS: Period[] = ["day", "week", "month"];
const PERIOD_LABEL: Record<Period, string> = {
  day: "오늘",
  week: "이번 주",
  month: "이번 달",
};

type StatChip = {
  id: string;
  label: string;
  value: string;
  unit: string;
  delta: string;
  direction: "up" | "down" | "flat";
  Icon: LucideIcon;
};

const PERIOD_STATS: Record<Period, StatChip[]> = {
  day: [
    { id: "sleep", label: "수면 점수", value: "88", unit: "점", delta: "+4 어제 대비", direction: "up", Icon: Moon },
    { id: "hrv", label: "심박변이도", value: "62", unit: "ms", delta: "+3ms 어제 대비", direction: "up", Icon: HeartPulse },
    { id: "energy", label: "에너지", value: "76", unit: "점", delta: "평소보다 활기참", direction: "flat", Icon: Sparkles },
    { id: "steps", label: "걸음 수", value: "6,180", unit: "보", delta: "목표의 62%", direction: "flat", Icon: Footprints },
  ],
  week: [
    { id: "sleep", label: "수면 점수", value: "84", unit: "점", delta: "-1 지난주 대비", direction: "down", Icon: Moon },
    { id: "hrv", label: "심박변이도", value: "59", unit: "ms", delta: "-2ms 지난주 대비", direction: "down", Icon: HeartPulse },
    { id: "energy", label: "에너지", value: "71", unit: "점", delta: "약간 낮음", direction: "down", Icon: Sparkles },
    { id: "steps", label: "걸음 수", value: "42,300", unit: "보", delta: "주간 목표 84%", direction: "flat", Icon: Footprints },
  ],
  month: [
    { id: "sleep", label: "수면 점수", value: "81", unit: "점", delta: "+6 지난달 대비", direction: "up", Icon: Moon },
    { id: "hrv", label: "심박변이도", value: "57", unit: "ms", delta: "+1ms 지난달 대비", direction: "up", Icon: HeartPulse },
    { id: "energy", label: "에너지", value: "69", unit: "점", delta: "전월과 비슷", direction: "flat", Icon: Sparkles },
    { id: "steps", label: "걸음 수", value: "168,400", unit: "보", delta: "월간 평균 +5%", direction: "up", Icon: Footprints },
  ],
};

const WEEKLY_TREND = [
  { label: "월", value: 76 },
  { label: "화", value: 82 },
  { label: "수", value: 79 },
  { label: "목", value: 85 },
  { label: "금", value: 88 },
  { label: "토", value: 90 },
  { label: "일", value: 84 },
];

// 최근 28일 수면 일관성 (0=기록 없음 ~ 3=높음), 결정론적 더미 값
const CONSISTENCY = [
  2, 3, 1, 2, 3, 3, 2, 1, 2, 3, 2, 1, 3, 3, 2, 2, 1, 3, 2, 3, 2, 3, 1, 2, 3, 2, 2, 3,
];
const LEVEL_TEXT: Record<number, string> = { 0: "기록 없음", 1: "낮음", 2: "보통", 3: "높음" };
const LEVEL_CLASS: Record<number, string> = {
  0: "bg-[#EFE9DB] dark:bg-[#262A1F]",
  1: "bg-[#C9D8CB] dark:bg-[#3C5344]",
  2: "bg-[#8FB49B] dark:bg-[#5C7A62]",
  3: "bg-[#3F5744] dark:bg-[#8FBB9C]",
};

type BioMetric = { id: string; label: string; value: string; unit: string; note: string; Icon: LucideIcon };
const BIO_METRICS: BioMetric[] = [
  { id: "hr", label: "안정시 심박수", value: "58", unit: "bpm", note: "-2bpm 지난주 대비", Icon: HeartPulse },
  { id: "spo2", label: "산소포화도", value: "98", unit: "%", note: "정상 범위", Icon: Droplets },
  { id: "temp", label: "피부 온도 편차", value: "+0.2", unit: "°C", note: "평소와 비슷", Icon: Thermometer },
  { id: "resp", label: "호흡수", value: "14", unit: "회/분", note: "안정적", Icon: Wind },
];

type MoodId = "great" | "good" | "okay" | "tired" | "rough";
const MOOD_OPTIONS: { id: MoodId; label: string; Icon: LucideIcon }[] = [
  { id: "great", label: "아주 좋음", Icon: SunMedium },
  { id: "good", label: "좋음", Icon: CloudSun },
  { id: "okay", label: "보통", Icon: Cloud },
  { id: "tired", label: "피곤함", Icon: CloudRain },
  { id: "rough", label: "힘듦", Icon: CloudLightning },
];

const INSIGHT_TEXT =
  "지난 7일간 평균 수면 효율은 92%로 안정적이에요. 다만 화요일 저녁 카페인 섭취 시간이 늦어지며 입면까지 걸린 시간이 평소보다 12분 늘었어요. 오늘은 오후 3시 이후 카페인을 피해보면 어떨까요.";

type Ritual = { id: string; label: string; done: boolean };
const RITUALS_DEFAULT: Ritual[] = [
  { id: "sunlight", label: "아침 햇빛 10분 쐬기", done: true },
  { id: "water", label: "물 8잔 마시기", done: false },
  { id: "stretch", label: "저녁 스트레칭", done: false },
  { id: "screen", label: "취침 1시간 전 화면 끄기", done: false },
  { id: "gratitude", label: "감사한 일 한 줄 쓰기", done: true },
];

const NAV_ITEMS = [
  { id: "overview", href: "#top", label: "개요", Icon: Home },
  { id: "rhythm", href: "#rhythm", label: "리듬", Icon: Moon },
  { id: "flow", href: "#flow", label: "흐름", Icon: LineChart },
  { id: "mind", href: "#mind", label: "마음", Icon: Sparkles },
  { id: "rituals", href: "#rituals", label: "리추얼", Icon: Leaf },
];

/* ---------------------------------------------------------------------- */
/* 리듬 링 지오메트리 헬퍼                                                    */
/* ---------------------------------------------------------------------- */

const RING_CENTER = 120;
const RING_TRACK_R = 92;
const MARKER_R = 108;
const TICK_INNER_R = 70;
const TICK_OUTER_R = 82;
const LABEL_R = 58;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, sweepAngle: number) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, startAngle + sweepAngle);
  const largeArc = sweepAngle > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

const SLEEP_START_HOUR = 23.5; // 23:30
const SLEEP_END_HOUR = 7.25; // 07:15
const SLEEP_SWEEP = (SLEEP_END_HOUR + 24 - SLEEP_START_HOUR) * 15;
const SLEEP_ARC_PATH = describeArc(RING_CENTER, RING_CENTER, RING_TRACK_R, SLEEP_START_HOUR * 15, SLEEP_SWEEP);

const ACTIVITY_PEAK_HOURS = [7.5, 12.5, 18.25];
const MEAL_HOURS = [8, 13, 19.5];
const NOW_HOUR = 14.5; // 오후 2:30 스냅샷
const NOW_POS = polarToCartesian(RING_CENTER, RING_CENTER, RING_TRACK_R, NOW_HOUR * 15);
const MAJOR_HOURS = [0, 6, 12, 18];

/* ---------------------------------------------------------------------- */
/* 주간 추이 차트 지오메트리                                                  */
/* ---------------------------------------------------------------------- */

const CHART_W = 320;
const CHART_TOP = 16;
const CHART_BASELINE = 104;
const CHART_LEFT = 14;
const CHART_RIGHT = 306;
const TREND_MIN = 60;
const TREND_MAX = 100;

function valueToY(v: number) {
  const ratio = (v - TREND_MIN) / (TREND_MAX - TREND_MIN);
  return CHART_BASELINE - ratio * (CHART_BASELINE - CHART_TOP);
}

const TREND_POINTS = WEEKLY_TREND.map((d, i) => ({
  x: CHART_LEFT + (i * (CHART_RIGHT - CHART_LEFT)) / (WEEKLY_TREND.length - 1),
  y: valueToY(d.value),
}));

const TREND_LINE_PATH = TREND_POINTS.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
const TREND_AREA_PATH = `${TREND_LINE_PATH} L ${TREND_POINTS[TREND_POINTS.length - 1].x.toFixed(1)} ${CHART_BASELINE} L ${TREND_POINTS[0].x.toFixed(1)} ${CHART_BASELINE} Z`;

/* ---------------------------------------------------------------------- */
/* 컴포넌트                                                                 */
/* ---------------------------------------------------------------------- */

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            onClick={onNavigate}
            className={`flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium ${TEXT_SECONDARY} transition-colors hover:bg-[#3F5744]/10 hover:text-[#2B2620] motion-reduce:transition-none dark:hover:text-[#EDE7D8] ${FOCUS_RING}`}
          >
            <item.Icon size={18} aria-hidden="true" />
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function DashboardClient() {
  const [period, setPeriod] = useState<Period>("day");
  const [rituals, setRituals] = useState<Ritual[]>(RITUALS_DEFAULT);
  const [mood, setMood] = useState<MoodId>("good");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const trendGradientId = useId();

  const stats = PERIOD_STATS[period];
  const completedRituals = rituals.filter((r) => r.done).length;

  function openDrawer() {
    dialogRef.current?.showModal();
  }
  function closeDrawer() {
    dialogRef.current?.close();
  }
  function handleBackdropClick(e: MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) closeDrawer();
  }

  function handleTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const nextIdx = (idx + dir + PERIODS.length) % PERIODS.length;
    setPeriod(PERIODS[nextIdx]);
    tabRefs.current[nextIdx]?.focus();
  }

  function toggleRitual(id: string) {
    setRituals((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
  }

  return (
    <div
      style={{ colorScheme: "light dark" }}
      className="min-h-screen bg-[#FAF6EF] text-[#2B2620] dark:bg-[#14150F] dark:text-[#EDE7D8]"
    >
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-[#3F5744] focus:px-4 focus:py-2 focus:text-white dark:focus:bg-[#8FBB9C] dark:focus:text-[#14150F] ${FOCUS_RING}`}
      >
        본문으로 건너뛰기
      </a>

      <div className="mx-auto flex w-full max-w-[1400px]">
        {/* 데스크톱 사이드 내비게이션 */}
        <nav
          aria-label="대시보드 섹션"
          className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col gap-1 overflow-y-auto border-r border-[#E8DFCF] p-4 dark:border-[#2E3226] md:flex"
        >
          <a
            href="#top"
            className={`mb-6 flex items-center gap-2 px-2 font-[family-name:var(--font-display)] text-xl italic ${SAGE_TEXT} ${FOCUS_RING} rounded-lg`}
          >
            <Leaf size={20} aria-hidden="true" />
            solace
          </a>
          <NavLinks />
        </nav>

        <div className="min-w-0 flex-1">
          {/* 상단 바 */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E8DFCF] bg-[#FAF6EF]/90 px-4 py-3 backdrop-blur dark:border-[#2E3226] dark:bg-[#14150F]/90 md:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={openDrawer}
                aria-haspopup="dialog"
                className={`grid h-11 w-11 place-items-center rounded-full border border-[#E8DFCF] dark:border-[#2E3226] md:hidden ${FOCUS_RING}`}
              >
                <Menu size={20} aria-hidden="true" />
                <span className="sr-only">메뉴 열기</span>
              </button>
              <a
                href="#top"
                className={`flex items-center gap-2 font-[family-name:var(--font-display)] text-lg italic ${SAGE_TEXT} md:hidden`}
              >
                <Leaf size={18} aria-hidden="true" />
                solace
              </a>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-[#E8DFCF] px-2 py-1.5 dark:border-[#2E3226]">
              <span
                className="grid h-8 w-8 place-items-center rounded-full bg-[#3F5744] font-mono text-sm text-white dark:bg-[#8FBB9C] dark:text-[#14150F]"
                aria-hidden="true"
              >
                은
              </span>
              <span className="hidden flex-col leading-tight sm:flex">
                <span className="text-sm font-medium">은채</span>
                <span className={`text-xs ${TEXT_SECONDARY}`}>개인 워크스페이스</span>
              </span>
            </div>
          </header>

          {/* 모바일 드로어 */}
          <dialog
            ref={dialogRef}
            aria-label="대시보드 메뉴"
            onClick={handleBackdropClick}
            className="fixed inset-y-0 left-0 m-0 h-full max-h-none w-72 max-w-[80vw] border-none bg-[#FAF6EF] p-0 text-[#2B2620] backdrop:bg-black/40 dark:bg-[#14150F] dark:text-[#EDE7D8] md:hidden"
          >
            <div className="flex h-full flex-col gap-1 p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className={`font-[family-name:var(--font-display)] text-lg italic ${SAGE_TEXT}`}>solace</span>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className={`grid h-11 w-11 place-items-center rounded-full border border-[#E8DFCF] dark:border-[#2E3226] ${FOCUS_RING}`}
                >
                  <X size={20} aria-hidden="true" />
                  <span className="sr-only">메뉴 닫기</span>
                </button>
              </div>
              <NavLinks onNavigate={closeDrawer} />
            </div>
          </dialog>

          <main id="main-content" tabIndex={-1} className="focus:outline-none">
            {/* 인사 섹션 */}
            <section id="top" className="px-4 pt-8 pb-2 md:px-8">
              <p className={`text-sm ${TEXT_SECONDARY}`}>2026년 7월 10일 금요일 · 오후 2:30 기준</p>
              <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl italic md:text-4xl">
                안녕하세요, 은채님
              </h1>
              <p className={`mt-2 max-w-prose ${TEXT_SECONDARY}`}>
                지난밤 수면은 평소보다{" "}
                <strong className={`font-mono font-semibold not-italic ${SAGE_TEXT}`}>12분</strong> 길었어요. 오늘의
                리듬을 확인해보세요.
              </p>
            </section>

            {/* 리듬 링 + 기간별 통계 */}
            <section id="rhythm" aria-labelledby="rhythm-heading" className="px-4 py-6 md:px-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="rhythm-heading" className="text-xl font-semibold">
                  오늘의 리듬
                </h2>
                <div
                  role="tablist"
                  aria-label="기간 선택"
                  className="inline-flex rounded-full border border-[#E8DFCF] bg-white/60 p-1 dark:border-[#2E3226] dark:bg-white/5"
                >
                  {PERIODS.map((p, idx) => (
                    <button
                      key={p}
                      ref={(el) => {
                        tabRefs.current[idx] = el;
                      }}
                      role="tab"
                      id={`tab-${p}`}
                      aria-selected={period === p}
                      aria-controls={`panel-${p}`}
                      tabIndex={period === p ? 0 : -1}
                      onClick={() => setPeriod(p)}
                      onKeyDown={(e) => handleTabKeyDown(e, idx)}
                      className={`min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                        period === p
                          ? "bg-[#3F5744] text-white dark:bg-[#8FBB9C] dark:text-[#14150F]"
                          : `${TEXT_SECONDARY} hover:bg-[#3F5744]/10`
                      }`}
                    >
                      {PERIOD_LABEL[p]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
                {/* 리듬 링 */}
                <figure className={`mx-auto flex w-full max-w-[340px] flex-col items-center ${CARD} p-6`}>
                  <div className="relative w-full max-w-[280px]">
                    <svg viewBox="0 0 240 240" role="img" aria-labelledby="ring-title ring-desc" className="w-full">
                      <title id="ring-title">오늘의 24시간 리듬</title>
                      <desc id="ring-desc">
                        밤 11시 30분부터 오전 7시 15분까지 수면, 오전 7시 30분·낮 12시 30분·오후 6시 15분 활동 피크,
                        오전 8시·오후 1시·오후 7시 30분 식사 시간을 보여줍니다. 지금은 오후 2시 30분입니다.
                      </desc>
                      <circle
                        cx={RING_CENTER}
                        cy={RING_CENTER}
                        r={RING_TRACK_R}
                        strokeWidth="14"
                        className="fill-none stroke-[#E8DFCF] dark:stroke-[#2E3226]"
                      />
                      {MAJOR_HOURS.map((h) => {
                        const p1 = polarToCartesian(RING_CENTER, RING_CENTER, TICK_INNER_R, h * 15);
                        const p2 = polarToCartesian(RING_CENTER, RING_CENTER, TICK_OUTER_R, h * 15);
                        const lp = polarToCartesian(RING_CENTER, RING_CENTER, LABEL_R, h * 15);
                        return (
                          <g key={h}>
                            <line
                              x1={p1.x}
                              y1={p1.y}
                              x2={p2.x}
                              y2={p2.y}
                              strokeWidth="1.5"
                              className="stroke-[#C9BFA8] dark:stroke-[#3C4230]"
                            />
                            <text
                              x={lp.x}
                              y={lp.y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className={`fill-[#8A806C] font-mono text-[9px] dark:fill-[#948B72]`}
                            >
                              {String(h).padStart(2, "0")}
                            </text>
                          </g>
                        );
                      })}
                      <path
                        d={SLEEP_ARC_PATH}
                        strokeWidth="14"
                        strokeLinecap="round"
                        className="fill-none stroke-[#6E5B94] dark:stroke-[#B6A4D9]"
                      />
                      {ACTIVITY_PEAK_HOURS.map((h) => {
                        const pos = polarToCartesian(RING_CENTER, RING_CENTER, MARKER_R, h * 15);
                        return <circle key={h} cx={pos.x} cy={pos.y} r="5" className="fill-[#C1613F] dark:fill-[#E2967A]" />;
                      })}
                      {MEAL_HOURS.map((h) => {
                        const pos = polarToCartesian(RING_CENTER, RING_CENTER, MARKER_R, h * 15);
                        return (
                          <rect
                            key={h}
                            x={pos.x - 3.5}
                            y={pos.y - 3.5}
                            width="7"
                            height="7"
                            rx="1.5"
                            transform={`rotate(45 ${pos.x} ${pos.y})`}
                            className="fill-[#B98A2E] dark:fill-[#D9AE5E]"
                          />
                        );
                      })}
                      <circle
                        cx={NOW_POS.x}
                        cy={NOW_POS.y}
                        r="9"
                        className="fill-[#FAF6EF] dark:fill-[#14150F]"
                      />
                      <circle
                        cx={NOW_POS.x}
                        cy={NOW_POS.y}
                        r="6"
                        className="fill-[#3F5744] motion-safe:animate-pulse dark:fill-[#8FBB9C]"
                      />
                    </svg>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-mono text-5xl font-semibold">88</span>
                      <span className={`text-xs ${TEXT_SECONDARY}`}>수면 점수</span>
                    </div>
                  </div>
                  <ul className={`mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs ${TEXT_SECONDARY}`}>
                    <li className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#6E5B94] dark:bg-[#B6A4D9]" aria-hidden="true" />
                      수면 23:30–07:15
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#C1613F] dark:bg-[#E2967A]" aria-hidden="true" />
                      활동 피크
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-[#B98A2E] dark:bg-[#D9AE5E]" aria-hidden="true" />
                      식사 시간
                    </li>
                  </ul>
                </figure>

                {/* 기간별 통계 칩 */}
                <div
                  role="tabpanel"
                  id={`panel-${period}`}
                  aria-labelledby={`tab-${period}`}
                  className="grid grid-cols-1 gap-4 content-start sm:grid-cols-2"
                >
                  {stats.map((chip) => {
                    const DirIcon = DIRECTION_ICON[chip.direction];
                    return (
                      <div key={chip.id} className={`${CARD} p-4`}>
                        <div className={`flex items-center gap-2 ${TEXT_SECONDARY}`}>
                          <chip.Icon size={16} aria-hidden="true" />
                          <span className="text-xs">{chip.label}</span>
                        </div>
                        <p className="mt-2 flex items-baseline gap-1 font-mono">
                          <span className="text-2xl font-semibold">{chip.value}</span>
                          <span className={`text-xs ${TEXT_SECONDARY}`}>{chip.unit}</span>
                        </p>
                        <p className={`mt-1 inline-flex items-center gap-1 text-xs ${DIRECTION_CLASS[chip.direction]}`}>
                          <DirIcon size={12} aria-hidden="true" />
                          {chip.delta}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 주간 흐름 */}
            <section id="flow" aria-labelledby="flow-heading" className="px-4 py-6 md:px-8">
              <h2 id="flow-heading" className="text-xl font-semibold">
                이번 주 흐름
              </h2>
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div className={`${CARD} p-6`}>
                  <h3 className={`text-sm font-medium ${TEXT_SECONDARY}`}>7일간 수면 점수 추이</h3>
                  <svg viewBox={`0 0 ${CHART_W} 140`} role="img" aria-labelledby="trend-title" className="mt-4 w-full">
                    <title id="trend-title">
                      최근 7일 수면 점수: {WEEKLY_TREND.map((d) => `${d.label} ${d.value}`).join(", ")}
                    </title>
                    <defs>
                      <linearGradient id={trendGradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3F5744" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#3F5744" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={TREND_AREA_PATH} fill={`url(#${trendGradientId})`} stroke="none" />
                    <path
                      d={TREND_LINE_PATH}
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="fill-none stroke-[#3F5744] dark:stroke-[#8FBB9C]"
                    />
                    {TREND_POINTS.map((pt, i) => (
                      <circle key={i} cx={pt.x} cy={pt.y} r="3.5" className="fill-[#3F5744] dark:fill-[#8FBB9C]" />
                    ))}
                    {WEEKLY_TREND.map((d, i) => (
                      <text
                        key={d.label}
                        x={TREND_POINTS[i].x}
                        y="130"
                        textAnchor="middle"
                        className="fill-[#8A806C] font-mono text-[10px] dark:fill-[#948B72]"
                      >
                        {d.label}
                      </text>
                    ))}
                  </svg>
                </div>

                <div className={`${CARD} p-6`}>
                  <h3 className={`text-sm font-medium ${TEXT_SECONDARY}`}>최근 28일 일관성</h3>
                  <ul className="mt-4 grid grid-cols-7 gap-2" aria-label="최근 28일 수면 일관성 기록">
                    {CONSISTENCY.map((level, i) => (
                      <li key={i} title={`${28 - i}일 전: ${LEVEL_TEXT[level]}`}>
                        <span className={`block h-4 w-4 rounded-md ${LEVEL_CLASS[level]}`} />
                        <span className="sr-only">
                          {28 - i}일 전: {LEVEL_TEXT[level]}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className={`mt-4 flex items-center gap-3 text-xs ${TEXT_SECONDARY}`}>
                    <span className="flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-sm bg-[#EFE9DB] dark:bg-[#262A1F]" aria-hidden="true" />
                      낮음
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-sm bg-[#3F5744] dark:bg-[#8FBB9C]" aria-hidden="true" />
                      높음
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 생체 지표 */}
            <section id="vitals" aria-labelledby="vitals-heading" className="px-4 py-6 md:px-8">
              <h2 id="vitals-heading" className="text-xl font-semibold">
                생체 지표{" "}
                <span className={`ml-1 align-middle text-xs font-normal ${TEXT_SECONDARY}`}>오전 7:20 측정</span>
              </h2>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {BIO_METRICS.map((m) => (
                  <div key={m.id} className={`${CARD} p-4`}>
                    <dt className={`flex items-center gap-2 text-xs ${TEXT_SECONDARY}`}>
                      <m.Icon size={16} aria-hidden="true" />
                      {m.label}
                    </dt>
                    <dd className="mt-2 font-mono text-2xl font-semibold">
                      {m.value}
                      <span className={`ml-1 text-xs font-normal ${TEXT_SECONDARY}`}>{m.unit}</span>
                    </dd>
                    <dd className={`mt-1 text-xs ${TEXT_SECONDARY}`}>{m.note}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* 마음 기록 */}
            <section id="mind" aria-labelledby="mind-heading" className="px-4 py-6 md:px-8">
              <h2 id="mind-heading" className="text-xl font-semibold">
                마음 기록
              </h2>
              <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
                <fieldset className={`${CARD} p-6`}>
                  <legend className={`px-1 text-sm font-medium ${TEXT_SECONDARY}`}>오늘 기분이 어때요?</legend>
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {MOOD_OPTIONS.map((opt) => {
                      const checked = mood === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`flex min-h-11 cursor-pointer flex-col items-center gap-1.5 rounded-2xl border p-2 text-center text-[11px] transition-colors motion-reduce:transition-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-[#FAF6EF] dark:focus-within:ring-offset-[#14150F] focus-within:ring-[#3F5744] dark:focus-within:ring-[#8FBB9C] ${
                            checked
                              ? "border-[#6E5B94] bg-[#6E5B94]/10 dark:border-[#B6A4D9] dark:bg-[#B6A4D9]/10"
                              : "border-[#E8DFCF] hover:bg-black/5 dark:border-[#2E3226] dark:hover:bg-white/5"
                          }`}
                        >
                          <input
                            type="radio"
                            name="mood"
                            value={opt.id}
                            checked={checked}
                            onChange={() => setMood(opt.id)}
                            className="sr-only"
                          />
                          <opt.Icon
                            size={20}
                            aria-hidden="true"
                            className={checked ? "text-[#6E5B94] dark:text-[#B6A4D9]" : TEXT_SECONDARY}
                          />
                          <span>{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <aside aria-labelledby="insight-heading" className={`${CARD} p-6`}>
                  <h3 id="insight-heading" className={`flex items-center gap-2 text-sm font-medium ${TEXT_SECONDARY}`}>
                    <Sparkles size={16} aria-hidden="true" />
                    오늘의 통찰
                  </h3>
                  <p className="mt-3 text-base leading-relaxed">{INSIGHT_TEXT}</p>
                </aside>
              </div>
            </section>

            {/* 오늘의 리추얼 */}
            <section id="rituals" aria-labelledby="rituals-heading" className="px-4 py-6 pb-16 md:px-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 id="rituals-heading" className="text-xl font-semibold">
                  오늘의 리추얼
                </h2>
                <p className={`text-sm ${TEXT_SECONDARY}`}>
                  {completedRituals}/{rituals.length} 완료
                </p>
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {rituals.map((r) => (
                  <li key={r.id}>
                    <label
                      className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl border border-[#E8DFCF] p-3 transition-colors motion-reduce:transition-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[#FAF6EF] dark:has-[:focus-visible]:ring-offset-[#14150F] has-[:focus-visible]:ring-[#3F5744] dark:border-[#2E3226] dark:has-[:focus-visible]:ring-[#8FBB9C] hover:bg-black/5 dark:hover:bg-white/5`}
                    >
                      <input
                        type="checkbox"
                        checked={r.done}
                        onChange={() => toggleRitual(r.id)}
                        className="sr-only"
                      />
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-[#3F5744] dark:border-[#8FBB9C] ${
                          r.done ? "bg-[#3F5744] dark:bg-[#8FBB9C]" : ""
                        }`}
                      >
                        {r.done && <Check size={14} className="text-white dark:text-[#14150F]" aria-hidden="true" />}
                      </span>
                      <span className={r.done ? `${TEXT_SECONDARY} line-through` : ""}>{r.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          </main>

          <footer className={`border-t border-[#E8DFCF] px-4 py-6 text-xs dark:border-[#2E3226] md:px-8 ${TEXT_SECONDARY}`}>
            <p>마지막 동기화 오후 2:12 · 화면의 모든 수치는 예시 데이터입니다.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
