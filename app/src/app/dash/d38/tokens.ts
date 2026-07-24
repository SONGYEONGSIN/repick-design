/**
 * Wavelength — 라우트 스코프 디자인 토큰. 전역 테마를 건드리지 않고 이 라우트 안에서만 쓰는 클래스 상수.
 * 이번 라운드 배정 테마 = 다크 전용(프로덕션 다크, n8n/Coinbase류): zinc-950/900 표면 고정, 보더 white/10,
 * 텍스트 zinc-50(본문)/zinc-300(보조)/zinc-400(캡션, 모든 상태 포함 — zinc-500 이하 금지). 연극적 발광·스캔라인·그레인 없음.
 * 강조 1색 = teal(브랜드 UI 크롬: 버튼/포커스링/활성 네비). 온콜 링/심각도/상태 톤은 별도 카테고리 팔레트가 담당 — 색+텍스트 항상 병행.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-zinc-950";
export const CARD_BG = "bg-zinc-900";
export const SURFACE_INSET = "bg-zinc-950";
export const SURFACE_RAISED = "bg-zinc-800";
export const BORDER = "border-white/10";
export const BORDER_STRONG = "border-white/15";
export const DIVIDE = "divide-white/10";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm shadow-black/20");

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
export const TEXT_CAPTION = "text-zinc-400";

/** 숫자·ID 정렬용 — 전역 font-sans(Pretendard) 위에 tabular 고정폭. */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/* 브랜드 액센트 — teal (UI 크롬 전용: 버튼·포커스링·활성 네비·워크스페이스 아이콘) */
export const ACCENT_TEXT = "text-teal-300";
export const ACCENT_SOLID = "bg-teal-500 text-zinc-950 hover:bg-teal-400 active:bg-teal-600";
export const ACCENT_SUBTLE = "bg-teal-500/10 text-teal-300";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400";

export const HOVER_ACTIVE_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";

/* 상태/존 톤 — 심각도 배지, 인시던트 상태 필, 트렌드 등에 사용. 색만으로 구분하지 않고 항상 아이콘/텍스트 병행. */
export type Tone = "good" | "warn" | "bad" | "info" | "neutral";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string; hex: string }> = {
  good: {
    text: "text-emerald-300",
    bg: "bg-emerald-500/12",
    border: "border-emerald-500/25",
    dot: "bg-emerald-500",
    hex: "#10b981",
  },
  warn: {
    text: "text-amber-300",
    bg: "bg-amber-500/12",
    border: "border-amber-500/25",
    dot: "bg-amber-500",
    hex: "#f59e0b",
  },
  bad: {
    text: "text-rose-300",
    bg: "bg-rose-500/12",
    border: "border-rose-500/25",
    dot: "bg-rose-500",
    hex: "#f43f5e",
  },
  info: {
    text: "text-sky-300",
    bg: "bg-sky-500/12",
    border: "border-sky-500/25",
    dot: "bg-sky-500",
    hex: "#38bdf8",
  },
  neutral: {
    text: "text-zinc-300",
    bg: "bg-zinc-500/12",
    border: "border-zinc-500/20",
    dot: "bg-zinc-400",
    hex: "#a1a1aa",
  },
};

/**
 * 온콜 링 카테고리 팔레트 — 엔지니어별 구간 색(데이터 인코딩, UI 크롬과 무관하므로 다색 허용).
 * 채도 절제된 6색, 다크 표면 위 AA 대비를 만족하는 밝은 톤만 사용(라벨 텍스트는 항상 병행 표기).
 */
export type EngineerToneId = "teal" | "violet" | "amber" | "rose" | "indigo" | "emerald";

export const ENGINEER_TONE: Record<EngineerToneId, { text: string; fill: string; hex: string; ring: string }> = {
  teal: { text: "text-teal-300", fill: "fill-teal-400", hex: "#2dd4bf", ring: "stroke-teal-300" },
  violet: { text: "text-violet-300", fill: "fill-violet-400", hex: "#a78bfa", ring: "stroke-violet-300" },
  amber: { text: "text-amber-300", fill: "fill-amber-400", hex: "#fbbf24", ring: "stroke-amber-300" },
  rose: { text: "text-rose-300", fill: "fill-rose-400", hex: "#fb7185", ring: "stroke-rose-300" },
  indigo: { text: "text-indigo-300", fill: "fill-indigo-400", hex: "#818cf8", ring: "stroke-indigo-300" },
  emerald: { text: "text-emerald-300", fill: "fill-emerald-400", hex: "#34d399", ring: "stroke-emerald-300" },
};
