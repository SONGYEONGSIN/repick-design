/**
 * Millrace — 디자인 토큰. 전역 테마를 건드리지 않고 이 라우트 안에서만 쓰는 클래스 상수.
 * 라이트 = 순백 캔버스(zinc-50/white) 기반, 다크 = 정제된 zinc-950/900 표면.
 * 대비 규칙: 라이트 표면의 보조 텍스트는 zinc-500 이상, 다크 표면은 zinc-400 이상만 사용한다.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-zinc-50 dark:bg-zinc-950";
export const CARD_BG = "bg-white dark:bg-zinc-900";
export const BORDER = "border-zinc-200 dark:border-zinc-800";
export const BORDER_STRONG = "border-zinc-300 dark:border-zinc-700";
export const DIVIDE = "divide-zinc-200 dark:divide-zinc-800";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm");

export const TEXT_PRIMARY = "text-zinc-900 dark:text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-600 dark:text-zinc-400";
export const TEXT_CAPTION = "text-zinc-500 dark:text-zinc-400";

/** 숫자·ID 정렬용. 전역 font-sans(Pretendard)와 동일 폭 정렬. */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";
/** 로그·해시 등 진짜 코드성 데이터에만 사용하는 모노스페이스(레이아웃 전역 font-mono, 별도 next/font 추가 없음). */
export const CODE = "font-mono tabular-nums";

export const ACCENT_TEXT = "text-violet-600 dark:text-violet-400";
export const ACCENT_BG_SOLID = "bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white";
export const ACCENT_BG_SUBTLE = "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300";
export const ACCENT_BORDER = "border-violet-200 dark:border-violet-500/30";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-600 dark:focus-visible:ring-violet-400";

/** 태스크/런 상태 어휘 — 도메인 그대로 사용(파이프라인 오케스트레이터 표준 상태값). */
export type StatusTone = "success" | "running" | "failed" | "pending" | "skipped" | "neutral";

export const STATUS: Record<StatusTone, { text: string; bg: string; border: string; dot: string }> = {
  success: {
    text: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/25",
    dot: "bg-emerald-500",
  },
  running: {
    text: "text-sky-700 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-500/10",
    border: "border-sky-200 dark:border-sky-500/25",
    dot: "bg-sky-500",
  },
  failed: {
    text: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
    border: "border-red-200 dark:border-red-500/25",
    dot: "bg-red-500",
  },
  pending: {
    text: "text-zinc-600 dark:text-zinc-400",
    bg: "bg-zinc-100 dark:bg-zinc-500/10",
    border: "border-zinc-300 dark:border-zinc-600",
    dot: "bg-zinc-400 dark:bg-zinc-500",
  },
  skipped: {
    text: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/25",
    dot: "bg-amber-500",
  },
  neutral: {
    text: "text-zinc-600 dark:text-zinc-400",
    bg: "bg-zinc-100 dark:bg-zinc-500/10",
    border: "border-zinc-200 dark:border-zinc-500/20",
    dot: "bg-zinc-400",
  },
};

export const HOVER_ACTIVE_BG = "hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700";
export const HOVER_ROW = "hover:bg-zinc-50 dark:hover:bg-white/[0.03]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
