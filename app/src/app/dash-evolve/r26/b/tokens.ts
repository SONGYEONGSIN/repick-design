/**
 * Auditlane — route-scoped design tokens (r26 / candidate b).
 *
 * THEME: light (true light — white canvas, zinc-200 hairlines, no cream/paper fake-light).
 *
 * ACCENT: single violet, split by what sits on it —
 *   violet-700 #6D28D9 on white ≈ 7.10:1 (AAA for normal text). Carries text: active nav,
 *   links, focus rings, solid buttons, the box-plot's box/median/crosshair strokes.
 *   violet-50/100 = tint surfaces, always paired with violet-700 text.
 * Recent rounds used blue/teal/amber — violet is a fresh family for this catalogue.
 * Risk tiers and inspection status badges use a *separate* emerald/amber/rose set so the
 * two badge systems never collide when they appear on the same card, and neither ever
 * relies on hue alone — every badge carries an icon and its label as text.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#6D28D9";

export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 focus-visible:shadow-[0_0_0_3px_rgba(109,40,217,0.18)]";

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

export const ACCENT_TEXT = "text-violet-700";
export const ACCENT_SOLID = "bg-violet-700 text-white hover:bg-violet-800 active:bg-violet-900";
export const ACCENT_SUBTLE = "border border-violet-200 bg-violet-50 text-violet-700";

export const HOVER_BG = "hover:bg-zinc-100 active:bg-zinc-200";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
