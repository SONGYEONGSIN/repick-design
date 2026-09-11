/**
 * Portage — route-scoped design tokens (r25 / candidate c).
 *
 * THEME: dark (n8n/Coinbase-tier "refined product dark" — zinc-950 canvas, zinc-900 panels,
 * white/10 hairlines). No glow/scanline/grain.
 *
 * ACCENT: single blue —
 *   blue-400 #60A5FA on zinc-950 (#09090b) = 7.83:1. On zinc-900 (#18181b) panels = 6.98:1.
 *   blue-300 #93C5FD on zinc-900 = 9.83:1 — used for small badge text where extra headroom helps.
 *   blue-600 solid w/ white text = 5.17:1 on the button fill itself. Every ratio computed by hand
 *   with the WCAG relative-luminance formula; see candidates/c.md for the arithmetic.
 * Route/stop STATUS is a separate functional (traffic-light-ish) channel layered on top of the
 * single accent — on-time reuses the accent (blue) since "on schedule" is the page's default good
 * state; at-risk/delayed use orange/red, chosen specifically because they sit outside the banned
 * emerald/cyan/rose/amber/teal/violet set. Every status is always paired with an icon + text label,
 * never color alone (WCAG 1.4.1).
 */

import { AlertTriangle, CheckCircle2, OctagonAlert, type LucideIcon } from "lucide-react";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const ACCENT_HEX = "#60A5FA";

export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 focus-visible:shadow-[0_0_0_3px_rgba(96,165,250,0.22)]";

export const APP_BG = "bg-zinc-950";
export const PANEL_BG = "bg-zinc-900";
export const BORDER = "border-white/10";
export const SURFACE_INSET = "bg-white/[0.03]";
export const CARD = "rounded-2xl border border-white/10 bg-zinc-900 shadow-sm shadow-black/30";

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
export const TEXT_MUTED = "text-zinc-400";
export const TEXT_AUX = "text-zinc-400";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-blue-400";
export const ACCENT_SOLID = "bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700";
export const ACCENT_SUBTLE = "border border-blue-400/30 bg-blue-400/10 text-blue-300";

export const HOVER_BG = "hover:bg-white/[0.06] active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";
export const TRANSITION_T = "transition-transform duration-150 motion-reduce:transition-none";

export type RouteStatus = "on-time" | "at-risk" | "delayed" | "completed";

export const STATUS_LABEL: Record<RouteStatus, string> = {
  "on-time": "On-time",
  "at-risk": "At risk",
  delayed: "Delayed",
  completed: "Completed",
};

export const STATUS_ICON: Record<RouteStatus, LucideIcon> = {
  "on-time": CheckCircle2,
  "at-risk": AlertTriangle,
  delayed: OctagonAlert,
  completed: CheckCircle2,
};

export const STATUS_BADGE: Record<RouteStatus, string> = {
  "on-time": "border-blue-400/30 bg-blue-400/10 text-blue-300",
  "at-risk": "border-orange-400/30 bg-orange-400/10 text-orange-300",
  delayed: "border-red-400/30 bg-red-400/10 text-red-300",
  completed: "border-white/15 bg-white/5 text-zinc-300",
};

export const STATUS_TEXT: Record<RouteStatus, string> = {
  "on-time": "text-blue-300",
  "at-risk": "text-orange-300",
  delayed: "text-red-300",
  completed: "text-zinc-300",
};

/** SVG paint utilities (Tailwind arbitrary color classes, no raw hex in markup). */
export const STATUS_STROKE: Record<RouteStatus, string> = {
  "on-time": "stroke-blue-400",
  "at-risk": "stroke-orange-400",
  delayed: "stroke-red-400",
  completed: "stroke-zinc-500",
};

export const STATUS_FILL: Record<RouteStatus, string> = {
  "on-time": "fill-blue-400",
  "at-risk": "fill-orange-400",
  delayed: "fill-red-400",
  completed: "fill-zinc-400",
};

/** Same hues as STATUS_FILL but as `bg-*` utilities, for legend swatches drawn with <span> not <svg>. */
export const STATUS_DOT: Record<RouteStatus, string> = {
  "on-time": "bg-blue-400",
  "at-risk": "bg-orange-400",
  delayed: "bg-red-400",
  completed: "bg-zinc-400",
};

export const STATUS_RING: Record<RouteStatus, string> = {
  "on-time": "ring-blue-400/70",
  "at-risk": "ring-orange-400/70",
  delayed: "ring-red-400/70",
  completed: "ring-zinc-400/70",
};
