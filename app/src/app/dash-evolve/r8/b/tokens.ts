/**
 * Farsight — 라우트 스코프 디자인 토큰. 전역 테마를 건드리지 않고 이 라우트 안에서만 쓰는 클래스 상수.
 * 라이트 = 순백 캔버스(white/zinc-50) + zinc-200 헤어라인 + shadow-sm.
 * 다크 = zinc-950/900 표면 + white/10 보더. 연극적 발광·스캔라인 없음.
 * 대비 규칙: 라이트 표면 보조 텍스트는 zinc-500 이상, 다크 표면은 zinc-400 이상만 사용한다.
 * (zinc-400 on white, zinc-500 on zinc-950/900 은 전 상태에서 금지 — 필터/토글로만 도달하는 상태 포함)
 * 강조 1색 = blue (브랜드). 리전 시리즈는 dataviz 카테고리 순서(blue/green/violet)를 따른다.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-zinc-50 dark:bg-zinc-950";
export const CARD_BG = "bg-white dark:bg-zinc-900";
export const SURFACE_INSET = "bg-zinc-50 dark:bg-zinc-950";
export const BORDER = "border-zinc-200 dark:border-white/10";
export const BORDER_STRONG = "border-zinc-300 dark:border-white/15";
export const DIVIDE = "divide-zinc-200 dark:divide-white/10";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm");

export const TEXT_PRIMARY = "text-zinc-900 dark:text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-600 dark:text-zinc-300";
export const TEXT_CAPTION = "text-zinc-500 dark:text-zinc-400";

/** 숫자·ID 정렬용 — 전역 font-sans(Pretendard) 위에 tabular 고정폭. */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";
/** 로그·해시 등 진짜 코드성 데이터 전용 모노(레이아웃 전역 font-mono, next/font 추가 없음). */
export const CODE = "font-mono tabular-nums";

/* 브랜드 액센트 — blue */
export const ACCENT_TEXT = "text-blue-600 dark:text-blue-400";
export const ACCENT_SOLID = "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700";
export const ACCENT_SUBTLE = "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400";

export const HOVER_ACTIVE_BG = "hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-white/5 dark:active:bg-white/10";
export const HOVER_ROW = "hover:bg-zinc-50 dark:hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_ALL = "transition-all motion-reduce:transition-none";

/* 상태 톤 — 계정 상태 배지, 델타 표기 등. */
export type Tone = "up" | "down" | "flat" | "info" | "warn" | "neutral";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string }> = {
  up: {
    text: "text-emerald-700 dark:text-emerald-300",
    bg: "bg-emerald-50 dark:bg-emerald-500/12",
    border: "border-emerald-200 dark:border-emerald-500/25",
    dot: "bg-emerald-500",
  },
  down: {
    text: "text-rose-700 dark:text-rose-300",
    bg: "bg-rose-50 dark:bg-rose-500/12",
    border: "border-rose-200 dark:border-rose-500/25",
    dot: "bg-rose-500",
  },
  flat: {
    text: "text-zinc-600 dark:text-zinc-300",
    bg: "bg-zinc-100 dark:bg-zinc-500/12",
    border: "border-zinc-200 dark:border-zinc-500/20",
    dot: "bg-zinc-400",
  },
  info: {
    text: "text-blue-700 dark:text-blue-300",
    bg: "bg-blue-50 dark:bg-blue-500/12",
    border: "border-blue-200 dark:border-blue-500/25",
    dot: "bg-blue-500",
  },
  warn: {
    text: "text-amber-700 dark:text-amber-300",
    bg: "bg-amber-50 dark:bg-amber-500/12",
    border: "border-amber-200 dark:border-amber-500/25",
    dot: "bg-amber-500",
  },
  neutral: {
    text: "text-zinc-600 dark:text-zinc-300",
    bg: "bg-zinc-100 dark:bg-zinc-500/12",
    border: "border-zinc-200 dark:border-zinc-500/20",
    dot: "bg-zinc-400",
  },
};
