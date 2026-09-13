/**
 * Coldline — route-scoped design tokens (r26 / candidate a).
 *
 * THEME: light (Mercury/Monarch-grade "true light" — zinc-50 canvas, white cards, zinc-200 hairlines).
 * No cream/paper/sepia surfaces anywhere; no registration marks, bezels or title-block dressing.
 *
 * DISPLAY TYPE: none assigned this round. Body, headings and the wordmark all stay on the global
 * Pretendard font-sans stack — no `--font-display-*` variable is referenced anywhere in this folder.
 *
 * ACCENT: single violet, chosen fresh against the last three rounds' blue/teal/amber —
 *   violet-600 #7C3AED on white = 6.45:1 (AA for normal text, comfortably clears 4.5). Carries text:
 *   active nav, links, focus rings, solid buttons, the top two heatmap fill stops.
 *   violet-50/100 = tint surfaces, always paired with violet-600/700 text, never accent-on-accent body text.
 * Heatmap fill ramp is contrast-checked stop by stop (see ExcursionHeatmap.tsx) rather than assuming
 * one text color works across the whole ramp — violet-500 sits in a "muddy middle" where neither
 * zinc-900 (4.19:1) nor white (4.23:1) clears 4.5:1, so it is skipped entirely; every stop that is
 * used is either safely light (dark text) or safely dark (white text).
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#7C3AED";

export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 focus-visible:shadow-[0_0_0_3px_rgba(124,58,237,0.18)]";

export const APP_BG = "bg-zinc-50";
export const PANEL_BG = "bg-white";
export const BORDER = "border-zinc-200";
export const SURFACE_INSET = "bg-zinc-50";
export const CARD = "rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/[0.03]";

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-700";
// zinc-500 floor: only ever used on white/zinc-50 (near-white) surfaces.
export const TEXT_AUX = "text-zinc-500";
// zinc-600 floor: used on tinted/muted surfaces (segmented tracks, tab tracks, pills, zinc-100+).
export const TEXT_MUTED = "text-zinc-600";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-violet-600";
export const ACCENT_SOLID = "bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800";
export const ACCENT_SUBTLE = "border border-violet-200 bg-violet-50 text-violet-700";

export const HOVER_BG = "hover:bg-zinc-100 active:bg-zinc-200";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export type Severity = "critical" | "warning" | "info";
export const SEVERITY_TEXT: Record<Severity, string> = { critical: "text-rose-700", warning: "text-amber-800", info: "text-zinc-600" };
export const SEVERITY_BADGE: Record<Severity, string> = {
  critical: "border-rose-200 bg-rose-50 text-rose-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  info: "border-zinc-200 bg-zinc-50 text-zinc-600",
};
export const SEVERITY_LABEL: Record<Severity, string> = { critical: "Critical", warning: "Warning", info: "Info" };

export type AlertStatus = "open" | "ack" | "resolved";
export const STATUS_BADGE: Record<AlertStatus, string> = {
  open: "border-rose-200 bg-rose-50 text-rose-700",
  ack: "border-amber-200 bg-amber-50 text-amber-800",
  resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
};
export const STATUS_LABEL: Record<AlertStatus, string> = { open: "Open", ack: "Ack", resolved: "Resolved" };

export function r1(n: number): number {
  return Math.round(n * 10) / 10;
}
