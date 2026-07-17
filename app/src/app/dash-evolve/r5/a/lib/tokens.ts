/**
 * Ballast — 디자인 토큰. 전역 테마를 건드리지 않고 이 라우트 안에서만 쓰는 클래스 상수.
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

/** 통화기호(₩ 등)와 숫자를 동일 폰트(Pretendard, 전역 font-sans)로 통일 — 모노 폰트엔 ₩ 글리프가 없음. */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-blue-600 dark:text-blue-400";
export const ACCENT_BG_SOLID = "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white";
export const ACCENT_BG_SUBTLE = "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300";
export const ACCENT_BORDER = "border-blue-200 dark:border-blue-500/30";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400";

export type StatusTone = "positive" | "negative" | "warning" | "neutral";

export const STATUS: Record<StatusTone, { text: string; bg: string; border: string }> = {
  positive: { text: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20" },
  negative: { text: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-200 dark:border-red-500/20" },
  warning: { text: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20" },
  neutral: { text: "text-zinc-600 dark:text-zinc-400", bg: "bg-zinc-100 dark:bg-zinc-500/10", border: "border-zinc-200 dark:border-zinc-500/20" },
};

export const HOVER_ACTIVE_BG = "hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700";
export const HOVER_ROW = "hover:bg-zinc-50 dark:hover:bg-white/[0.03]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
