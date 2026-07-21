/**
 * Currents — 라우트 스코프 디자인 토큰. 전역 테마를 건드리지 않고 이 라우트 안에서만 쓰는 클래스 상수.
 * 라이트 = 순백 캔버스(white/zinc-50) + zinc-200 헤어라인 + shadow-sm.
 * 다크 = zinc-950/900 표면 + white/10 보더. 연극적 발광·스캔라인 없음.
 * 대비 규칙: 라이트 표면 보조 텍스트는 zinc-500 이상, 다크 표면은 zinc-400 이상만 사용(모든 상태 포함, 필터/토글 뒤에도).
 * 강조 1색 = sky(브랜드, 물줄기 컨셉). 흐름 방향/성과 톤은 TONE(아래)이 담당 — 색+텍스트 항상 병행.
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

/* 브랜드 액센트 — sky (흐름/수로 컨셉) */
export const ACCENT_TEXT = "text-sky-600 dark:text-sky-400";
export const ACCENT_SOLID = "bg-sky-600 text-white hover:bg-sky-500 active:bg-sky-700";
export const ACCENT_SUBTLE = "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300";
export const ACCENT_RING = "ring-sky-600 dark:ring-sky-400";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-600 dark:focus-visible:ring-sky-400";
/** SVG 도형(rect/path)용 — outline 기반, ring 유틸 대신 outline이 SVG에서 더 안정적으로 렌더. */
export const SVG_FOCUS =
  "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:focus-visible:outline-sky-400";

export const HOVER_ACTIVE_BG = "hover:bg-zinc-50 active:bg-zinc-100 dark:hover:bg-zinc-800 dark:active:bg-zinc-700";
export const HOVER_ROW = "hover:bg-zinc-50 dark:hover:bg-white/[0.03]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";

/* 방향/성과 톤 — 흐름 결과(유지/확장/축소/이탈) 배지 등에 사용. 색만으로 구분하지 않고 항상 아이콘/텍스트 병행. */
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
    text: "text-sky-700 dark:text-sky-300",
    bg: "bg-sky-50 dark:bg-sky-500/12",
    border: "border-sky-200 dark:border-sky-500/25",
    dot: "bg-sky-500",
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

/** 흐름 노드(채널/티어/결과) 컬럼별 고정 팔레트 — 색+라벨 항상 병행이므로 장식이 아닌 구획 표시 용도. */
export const COLUMN_FILL: Record<0 | 1 | 2, { fill: string; stroke: string; ribbon: string }> = {
  0: { fill: "fill-sky-500", stroke: "stroke-sky-600", ribbon: "fill-sky-400/40 dark:fill-sky-500/25" },
  1: { fill: "fill-indigo-500", stroke: "stroke-indigo-600", ribbon: "fill-indigo-400/40 dark:fill-indigo-500/25" },
  2: { fill: "fill-zinc-400", stroke: "stroke-zinc-500", ribbon: "fill-zinc-400/30 dark:fill-zinc-500/20" },
};

export const OUTCOME_TONE: Record<string, Tone> = {
  retained: "up",
  expanded: "info",
  downgraded: "warn",
  churned: "down",
};

/** 결과(90일 후) 노드 색 — 채도 절제된 시맨틱 팔레트. 색은 항상 라벨·배지 텍스트와 병행. */
export const OUTCOME_FILL: Record<string, string> = {
  retained: "fill-emerald-500",
  expanded: "fill-sky-500",
  downgraded: "fill-amber-500",
  churned: "fill-rose-500",
};

/** 티어→결과 리본 색 — 도착 노드(결과)의 시맨틱 톤을 반투명하게 얹어 이탈/유지 흐름을 즉시 가독시킨다. */
export const OUTCOME_RIBBON_FILL: Record<string, string> = {
  retained: "fill-emerald-400/45 dark:fill-emerald-500/30",
  expanded: "fill-sky-400/45 dark:fill-sky-500/30",
  downgraded: "fill-amber-400/45 dark:fill-amber-500/30",
  churned: "fill-rose-400/45 dark:fill-rose-500/30",
};
