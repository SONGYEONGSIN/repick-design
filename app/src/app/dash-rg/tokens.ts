/**
 * Ridge 대시보드 — 디자인 토큰
 * 전역 테마(globals.css)를 건드리지 않고 이 라우트 내부에서만 쓰는 일관된 클래스 상수 모음.
 * 그레이 스케일(zinc) + accent(indigo) + 상태색(emerald/red/amber) — 전부 Tailwind 기본 팔레트.
 */

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* 표면 & 테두리 */
export const APP_BG = "bg-zinc-50 dark:bg-zinc-950";
export const SURFACE = "bg-white dark:bg-zinc-950";
export const CARD_BG = "bg-white dark:bg-zinc-900";
export const CARD_BG_MUTED = "bg-zinc-50 dark:bg-zinc-900/60";
export const BORDER = "border-zinc-200 dark:border-zinc-800";
export const BORDER_STRONG = "border-zinc-300 dark:border-zinc-700";
export const DIVIDE = "divide-zinc-200 dark:divide-zinc-800";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-[0_1px_2px_rgba(24,24,27,0.04)]");
export const CARD_PAD = "p-5 sm:p-6";

/* 타이포 */
export const TEXT_PRIMARY = "text-zinc-900 dark:text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-600 dark:text-zinc-400";
export const TEXT_MUTED = "text-zinc-500 dark:text-zinc-500";
/* 숫자: 원화 기호(₩)와 숫자를 동일 폰트(Pretendard, 전역 font-sans)로 통일 —
   Geist Mono엔 ₩ 글리프가 없어 폴백되며 기호만 크게 보이던 문제 해결.
   tabular-nums로 자릿수 정렬은 유지. */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/* accent */
export const ACCENT_TEXT = "text-indigo-600 dark:text-indigo-400";
export const ACCENT_BG_SOLID = "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white";
export const ACCENT_BG_SUBTLE = "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300";
export const ACCENT_BORDER = "border-indigo-200 dark:border-indigo-500/30";

/* 포커스 */
export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-indigo-400 dark:focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400";

/* 상태색 */
export const STATUS = {
  positive: {
    text: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/20",
  },
  negative: {
    text: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
    border: "border-red-200 dark:border-red-500/20",
  },
  warning: {
    text: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/20",
  },
  neutral: {
    text: "text-zinc-600 dark:text-zinc-400",
    bg: "bg-zinc-100 dark:bg-zinc-500/10",
    border: "border-zinc-200 dark:border-zinc-500/20",
  },
} as const;

export type StatusTone = keyof typeof STATUS;

/* 인터랙션 */
export const HOVER_ROW = "hover:bg-zinc-50 dark:hover:bg-white/[0.03]";
/** 테두리가 있는 흰색/존크 표면 버튼(팝오버 트리거, 메뉴 아이템, 아이콘 버튼) 공용 hover+active. */
export const HOVER_ACTIVE_BG = "hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700";
export const TRANSITION = "transition-colors motion-reduce:transition-none";
export const TRANSITION_ALL = "transition-[color,background-color,border-color,transform] motion-reduce:transition-none";
