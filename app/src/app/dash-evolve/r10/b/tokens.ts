/**
 * Stackyard — 라우트 스코프 디자인 토큰. 전역 테마를 건드리지 않고 이 라우트 안에서만 쓰는 클래스 상수.
 * 라이트(배정 테마) = 순백 캔버스(white/zinc-50) + zinc-200 헤어라인 + shadow-sm. 다크는 보조 대응.
 * 대비 규칙: 라이트 표면 보조 텍스트는 zinc-500 이상, 다크 표면은 zinc-400 이상만 사용(모든 상태 포함).
 * 강조 1색 = indigo(브랜드/포커스링/활성 nav). 히트맵 지표 색은 data.ts의 UTIL_TIER_META / VELOCITY_TIER_META가 담당.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-zinc-50 dark:bg-zinc-950";
export const CARD_BG = "bg-white dark:bg-zinc-900";
export const SURFACE_INSET = "bg-zinc-50 dark:bg-zinc-950";
export const BORDER = "border-zinc-200 dark:border-zinc-800";
export const BORDER_STRONG = "border-zinc-300 dark:border-zinc-700";
export const DIVIDE = "divide-zinc-200 dark:divide-zinc-800";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm");

export const TEXT_PRIMARY = "text-zinc-900 dark:text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-600 dark:text-zinc-300";
export const TEXT_CAPTION = "text-zinc-500 dark:text-zinc-400";

/** 숫자·ID 정렬용 — 전역 font-sans(Pretendard) 위에 tabular 고정폭. */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/* 브랜드 액센트 — indigo */
export const ACCENT_TEXT = "text-indigo-700 dark:text-indigo-300";
export const ACCENT_SOLID = "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700";
export const ACCENT_SUBTLE = "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400";

export const HOVER_ACTIVE_BG = "hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700";
export const HOVER_ROW = "hover:bg-zinc-50 dark:hover:bg-white/[0.03]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";

/* 방향/추세 톤 — 배지·상태 등에 사용하는 범용 톤 팔레트. */
export type Tone = "up" | "down" | "warn" | "info" | "neutral";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string; bar: string }> = {
  up: {
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-500/12",
    border: "border-emerald-200 dark:border-emerald-500/25",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  down: {
    text: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-50 dark:bg-rose-500/12",
    border: "border-rose-200 dark:border-rose-500/25",
    dot: "bg-rose-500",
    bar: "bg-rose-500",
  },
  warn: {
    text: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-500/12",
    border: "border-amber-200 dark:border-amber-500/25",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
  },
  info: {
    text: "text-indigo-700 dark:text-indigo-300",
    bg: "bg-indigo-50 dark:bg-indigo-500/12",
    border: "border-indigo-200 dark:border-indigo-500/25",
    dot: "bg-indigo-500",
    bar: "bg-indigo-500",
  },
  neutral: {
    text: "text-zinc-600 dark:text-zinc-300",
    bg: "bg-zinc-100 dark:bg-zinc-500/12",
    border: "border-zinc-200 dark:border-zinc-500/20",
    dot: "bg-zinc-400",
    bar: "bg-zinc-400",
  },
};

/** 상태류 메타(피킹 작업 상태 등 공용 셰이프) — StatusBadge가 공유. */
export type StateMeta = {
  label: string;
  text: string;
  bg: string;
  border: string;
  dot: string;
  bar: string;
};

/** 히트맵 셀 등급 메타 — 색+텍스트+패턴(대각 스트라이프/해치) 병행. */
export type CellTierMeta = {
  label: string;
  text: string;
  bg: string;
  border: string;
  pattern?: "stripe" | "hatch";
};
