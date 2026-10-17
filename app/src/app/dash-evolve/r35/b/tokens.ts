/**
 * Fluxgate — route-scoped design tokens (r35 / candidate b).
 *
 * THEME: light, true-white. `bg-zinc-50` app ground, `bg-white` cards, `border-zinc-200`
 * hairlines, `shadow-sm` — no cream/paper tint anywhere.
 *
 * ACCENT: single lime, split by what sits on it (this is the part lime needs care with —
 * it reads bright but a mid lime on white text fails AA fast):
 *   lime-700 #4d7c0f → the only lime used as TEXT on white (active nav label, focus
 *     outline, chart stroke, small accent copy). Contrast on #ffffff ≈ 5.0:1 — clears
 *     body-text AA (4.5:1) with real margin, not a razor's-edge pass.
 *   lime-500 #84cc16 → solid fill only, paired with dark zinc-900 text/icons on top
 *     (primary button, the live-stream dot, the chart's crosshair marker ring). The
 *     background does the contrast work, per the brief's filled-chip escape hatch.
 *   lime-50/100 → tint fields behind lime-800 text (active nav pill, badges) — background
 *     is near-white so the dark-on-light pairing clears AA by a wide margin.
 * Severity colors (rose/amber/sky/emerald) are semantic status, not the page accent —
 * kept visually distinct from lime on purpose so "urgent" never gets confused with "brand".
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#4d7c0f"; // lime-700, the text-safe accent
export const ACCENT_FILL_HEX = "#84cc16"; // lime-500, fill-only

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-700";

export const APP_BG = "bg-zinc-50";
export const PANEL_BG = "bg-white";
export const BORDER = "border-zinc-200";
export const SURFACE_INSET = "bg-zinc-100";
export const CARD = "rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-900/[0.03]";

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-700";
export const TEXT_AUX = "text-zinc-500"; // floor for white/zinc-50 surfaces only
export const TEXT_MUTED = "text-zinc-600"; // floor for muted-tone surfaces (tracks, pills)

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-lime-700";
export const ACCENT_SOLID = "bg-lime-500 text-zinc-900 hover:bg-lime-400 active:bg-lime-600";
export const ACCENT_SUBTLE = "border border-lime-200 bg-lime-50 text-lime-800";

export const HOVER_BG = "hover:bg-zinc-100 active:bg-zinc-200";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export type Severity = "critical" | "warning" | "info" | "resolved";
export const SEVERITY_BADGE: Record<Severity, string> = {
  critical: "border-rose-200 bg-rose-50 text-rose-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  info: "border-sky-200 bg-sky-50 text-sky-700",
  resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
