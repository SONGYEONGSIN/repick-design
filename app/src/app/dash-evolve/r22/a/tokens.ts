/**
 * Redoubt — route-scoped design tokens (r22 / candidate a).
 *
 * ARCHETYPE: security / audit-log console. The dominant surface is a vertical chronological event
 * stream (timeline list), not a chart — see EventStream.tsx. That distinguishes this from every
 * calendar/gantt/waterfall/matrix/treemap/funnel/sankey/radial-dial/permission-matrix/board form
 * already in the catalogue (d29–d48, r17–r21).
 *
 * THEME: real product DARK (n8n/Coinbase-grade), not the theatrical kind — zinc-950 canvas, zinc-900
 * cards, hairline borders at white/10, no glow/scanline/grain.
 *
 * DISPLAY FACE: --font-display-mono ("JetBrains Mono Display") for the brand lockup, section
 * eyebrows and every numeric readout — a monospace display face reads as "console/log" without
 * resorting to scanline theatrics. Exactly 3 rendered weights: 400 (body/mono), 500 (medium — labels,
 * table headers, nav), 600 (semibold — headings, active states). No 700+, no serif.
 *
 * ACCENT: single rose, split by what sits on it (every ratio computed against the literal hex, not
 * an assumed Tailwind step — WCAG relative-luminance formula):
 *   rose-400 #fb7185 on zinc-950 #09090b  → 7.39:1  — carries text: active nav, links, focus rings,
 *     "critical" severity text/icon.
 *   rose-400 #fb7185 on white  #ffffff    → 2.69:1  — FAILS AA for text; rose-400 is never placed on
 *     a light surface anywhere in this build.
 *   rose-600 #e11d48 on zinc-950          → 4.24:1  — passes for large/bold text and UI components
 *     (≥3:1), used decorative-only here (connector dots, thin bars), never asked to carry small text.
 *   white #ffffff on rose-600 #e11d48     → 4.70:1  — passes AA normal text; this is the pairing used
 *     for solid accent buttons (white label on rose-600 fill).
 * Severity and outcome badges intentionally use their own ramp (rose/amber/sky/emerald/zinc) rather
 * than reusing the brand accent for every "danger" state — every badge pairs its color with an icon
 * and a text label, never color alone.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#fb7185";
export const DISPLAY_MONO = { fontFamily: "var(--font-display-mono)" } as const;

/** House focus token — never preceded by a bare `outline-none`, never `ring`+`ring-offset` (fully
 *  transparent in Tailwind v4). */
export const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 focus-visible:shadow-[0_0_0_3px_rgba(251,113,133,0.22)]";

export const APP_BG = "bg-zinc-950";
export const PANEL_BG = "bg-zinc-900";
export const BORDER = "border-white/10";
export const BORDER_SOFT = "border-white/[0.06]";
export const SURFACE_INSET = "bg-white/[0.04]";
export const CARD = "rounded-2xl border border-white/10 bg-zinc-900 shadow-sm shadow-black/20";

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
/** Dark-surface auxiliary floor — never step below zinc-400 on this theme (zinc-500/600 fail the
 *  contrast gate here even though they read fine on light surfaces). */
export const TEXT_AUX = "text-zinc-400";
export const TEXT_MUTED = "text-zinc-300";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-rose-400";
export const ACCENT_MARK = "text-rose-500";
export const ACCENT_SOLID = "bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700";
export const ACCENT_SUBTLE = "border border-rose-800/60 bg-rose-950/40 text-rose-300";

export const HOVER_BG = "hover:bg-white/[0.06] active:bg-white/[0.1]";
export const HOVER_ROW = "hover:bg-white/[0.035]";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";

export type Severity = "critical" | "high" | "medium" | "low" | "info";
export const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low", "info"];
export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  info: "Info",
};
export const SEVERITY_BADGE: Record<Severity, string> = {
  critical: "border-rose-800/60 bg-rose-950/40 text-rose-300",
  high: "border-amber-800/60 bg-amber-950/40 text-amber-300",
  medium: "border-sky-800/60 bg-sky-950/40 text-sky-300",
  low: "border-emerald-800/60 bg-emerald-950/40 text-emerald-300",
  info: "border-white/10 bg-white/[0.04] text-zinc-300",
};
export const SEVERITY_DOT: Record<Severity, string> = {
  critical: "bg-rose-500",
  high: "bg-amber-500",
  medium: "bg-sky-500",
  low: "bg-emerald-500",
  info: "bg-zinc-500",
};

export type Outcome = "success" | "failed" | "blocked";
export const OUTCOME_LABEL: Record<Outcome, string> = { success: "Success", failed: "Failed", blocked: "Blocked" };
export const OUTCOME_BADGE: Record<Outcome, string> = {
  success: "border-emerald-800/60 bg-emerald-950/40 text-emerald-300",
  failed: "border-rose-800/60 bg-rose-950/40 text-rose-300",
  blocked: "border-amber-800/60 bg-amber-950/40 text-amber-300",
};

export type EventCategory = "auth" | "access" | "data" | "config" | "network" | "admin";
export const CATEGORY_LABEL: Record<EventCategory, string> = {
  auth: "Authentication",
  access: "Authorization",
  data: "Data access",
  config: "Configuration",
  network: "Network",
  admin: "Admin",
};

export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}
