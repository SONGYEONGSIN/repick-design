/**
 * landing-evolve r1/b — "여정 타임라인" 로컬 토큰.
 * 전역 테마를 건드리지 않고 이 라우트 안에서만 쓰는 클래스 상수.
 * 정본 색 토큰(design-principles.md): bg #0B0B0F / fg #FFFFFF / muted #A1A1AA / accent #6E56CF.
 * near-monochrome: 무채색으로 위계를 만들고 accent(#6E56CF)는 극소량으로만.
 * 폰트 웨이트 정확히 3종만 사용: font-normal(400) / font-semibold(600) / font-extrabold(800).
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** 표면 */
export const BG = "bg-[#0B0B0F]";
export const TEXT = "text-white";
export const MUTED = "text-[#A1A1AA]";
export const SURFACE = "bg-white/[0.02]";
export const SURFACE_2 = "bg-white/[0.04]";
export const HAIRLINE = "border-white/10";
export const HAIRLINE_STRONG = "border-white/20";

/** accent — 정지 상태에서도 존재감을 유지한다(hover로 숨기지 않는다). */
export const ACCENT_HEX = "#6E56CF";
export const ACCENT_TEXT = "text-[#6E56CF]";
export const ACCENT_BG = "bg-[#6E56CF]";
export const ACCENT_BORDER = "border-[#6E56CF]";
export const ACCENT_SOFT = "bg-[#6E56CF]/12";

/** 트래킹 3단 스케일 — eyebrow 0.28em / 캡션 0.16em / 스탯 0.12em */
export const EYEBROW =
  "text-[0.6875rem] font-semibold uppercase tracking-[0.28em]";
export const CAPTION =
  "text-[0.6875rem] uppercase tracking-[0.16em]";
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/** 다크 배경 기본 아웃라인이 약하므로 accent focus-visible 링을 전 인터랙티브에 부여 */
export const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]";

export const TRANSITION = "transition-colors duration-200 motion-reduce:transition-none";

/** 진입 애니메이션 공용 easing */
export const EASE = [0.16, 1, 0.3, 1] as const;
