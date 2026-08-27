/**
 * Vantage — route-scoped design tokens (r21 / candidate b).
 *
 * THEME: light (Mercury/Asana-grade "true light" — zinc-50 canvas, white cards, zinc-200 hairlines).
 *
 * ACCENT: single rose, split by what sits on it —
 *   rose-700 #BE123C on white ≈ 6.29:1. Carries text: active nav, links, focus rings, solid buttons.
 *   rose-50/100 = tint surfaces, paired with rose-700 text.
 * Severity badges never rely on hue alone — every badge carries an icon and its label as text.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#BE123C";

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 focus-visible:shadow-[0_0_0_3px_rgba(190,18,60,0.18)]";

export const APP_BG = "bg-zinc-50";
export const PANEL_BG = "bg-white";
export const BORDER = "border-zinc-200";
export const SURFACE_INSET = "bg-zinc-50";
export const CARD = "rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/[0.03]";

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-700";
export const TEXT_AUX = "text-zinc-500";
export const TEXT_MUTED = "text-zinc-600";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-rose-700";
export const ACCENT_SOLID = "bg-rose-700 text-white hover:bg-rose-800 active:bg-rose-900";
export const ACCENT_SUBTLE = "border border-rose-200 bg-rose-50 text-rose-700";

export const HOVER_BG = "hover:bg-zinc-100 active:bg-zinc-200";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export type Severity = "critical" | "high" | "medium" | "low";
export const SEVERITY_BADGE: Record<Severity, string> = {
  critical: "border-rose-200 bg-rose-50 text-rose-700",
  high: "border-amber-200 bg-amber-50 text-amber-800",
  medium: "border-sky-200 bg-sky-50 text-sky-700",
  low: "border-zinc-200 bg-zinc-50 text-zinc-600",
};
export const SEVERITY_LABEL: Record<Severity, string> = { critical: "Critical", high: "High", medium: "Medium", low: "Low" };
export const SEVERITY_DOT: Record<Severity, string> = { critical: "bg-rose-500", high: "bg-amber-500", medium: "bg-sky-500", low: "bg-zinc-400" };

export type CaseStatus = "open" | "review" | "escalated" | "closed";
export const STATUS_LABEL: Record<CaseStatus, string> = { open: "Open", review: "Under review", escalated: "Escalated", closed: "Closed" };
export const STATUS_BADGE: Record<CaseStatus, string> = {
  open: "border-sky-200 bg-sky-50 text-sky-700",
  review: "border-amber-200 bg-amber-50 text-amber-800",
  escalated: "border-rose-200 bg-rose-50 text-rose-700",
  closed: "border-zinc-200 bg-zinc-50 text-zinc-600",
};

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
