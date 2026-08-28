/**
 * Meridian — route-scoped design tokens (r21 / candidate a).
 *
 * THEME: light (Mercury/Asana-grade "true light" — zinc-50 canvas, white cards, zinc-200 hairlines).
 *
 * ACCENT: single cyan, split by what sits on it —
 *   cyan-700 #0E7490 on white = 5.35:1. Carries text: active nav, links, focus rings, solid buttons.
 *   cyan-50/100 = tint surfaces, paired with cyan-700 text (never accent-on-accent for body text).
 * Priority badges and the SLA heat grid intentionally never rely on hue alone for dark text: every
 * heat cell keeps zinc-900 text regardless of tint depth (the d30 lesson — a diverging fill ramp with
 * white text fails AA at the light end; dark text on a light tint ramp never does).
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#0E7490";

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700 focus-visible:shadow-[0_0_0_3px_rgba(14,116,144,0.18)]";

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

export const ACCENT_TEXT = "text-cyan-700";
export const ACCENT_SOLID = "bg-cyan-700 text-white hover:bg-cyan-800 active:bg-cyan-900";
export const ACCENT_SUBTLE = "border border-cyan-200 bg-cyan-50 text-cyan-700";

export const HOVER_BG = "hover:bg-zinc-100 active:bg-zinc-200";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export type Priority = "P1" | "P2" | "P3" | "P4";
export const PRIORITY_TEXT: Record<Priority, string> = { P1: "text-rose-700", P2: "text-amber-800", P3: "text-sky-700", P4: "text-zinc-600" };
export const PRIORITY_BADGE: Record<Priority, string> = {
  P1: "border-rose-200 bg-rose-50 text-rose-700",
  P2: "border-amber-200 bg-amber-50 text-amber-800",
  P3: "border-sky-200 bg-sky-50 text-sky-700",
  P4: "border-zinc-200 bg-zinc-50 text-zinc-600",
};
export const PRIORITY_LABEL: Record<Priority, string> = { P1: "Critical", P2: "High", P3: "Normal", P4: "Low" };
export const PRIORITY_BAR: Record<Priority, string> = { P1: "bg-rose-500", P2: "bg-amber-500", P3: "bg-sky-500", P4: "bg-zinc-400" };

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
