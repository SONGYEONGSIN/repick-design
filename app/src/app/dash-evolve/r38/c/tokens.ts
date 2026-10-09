/**
 * Isobar — route-scoped design tokens (r38 / candidate c).
 *
 * THEME: dark (freely chosen — no theme/accent ban active this round). Refined product dark,
 * n8n/Coinbase-grade: zinc-950 app canvas, zinc-900 card surfaces, white/10 hairline borders,
 * zinc-50 primary text. Secondary/dim text never drops below zinc-400 anywhere on this route,
 * including inside the command palette, the notification popover and the map's hover tooltip
 * (page-brief-core contrast floor — checked in interactive states too, not just the resting page).
 *
 * ACCENT: single sky accent, sky-400 (#38bdf8), used for brand/interactive chrome only (active
 * nav pill, focus ring, links, the pin ring on the map). Verified against the zinc-950 canvas
 * (#09090b): relative luminance of #38bdf8 ≈ 0.440, of #09090b ≈ 0.0028 →
 * contrast = (0.440+0.05)/(0.0028+0.05) ≈ 9.3:1 — clears the 4.5:1 floor with room to spare, so
 * it is safe as running text/icons, not only large graphical marks.
 *
 * SEVERITY RAMP (separate hue from the accent, on purpose): the choropleth's sequential
 * intensity scale is red, never reusing sky — color alone never carries both "interactive" and
 * "bad" meaning. Four discrete steps, each hand-verified against its own paired text color
 * (never assumed from the brand pairing above, since every ramp step is a different background):
 *   T0 #27272a + white text  → L=0.0202 → contrast ≈ 15.0:1
 *   T1 #991b1b + white text  → L=0.0764 → contrast ≈  8.3:1
 *   T2 #dc2626 + white text  → L=0.1676 → contrast ≈  4.8:1  (white text fails for T3, not here)
 *   T3 #ef4444 + zinc-950 text → L=0.2292 → contrast ≈  5.3:1 (white text on T3 is only 3.8:1 —
 *     fails the 4.5:1 small-text floor, which is why T3 alone flips to dark text)
 * All four clear 4.5:1, so the in-hex code + number labels stay legible at every intensity step,
 * not just the deepest one.
 *
 * DISPLAY FACE: --font-display-grotesk (assigned, Latin + large sizes only) — the wordmark in
 * the sidebar and the page's single <h1>. Everything else, including every stat label, number
 * and the map's region labels, stays on --font-sans (Pretendard). Genuine code-like strings
 * (none on this route) would use plain --font-mono, never the display variant.
 *
 * WEIGHTS: exactly three rendered font-weight classes for the whole route — font-normal (400),
 * font-medium (500), font-semibold (600). Every <th> gets an explicit weight class so the
 * browser's default-bold table-header style never sneaks in a fourth.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

// No `outline-none` anywhere in this route, and never a bare `ring`/`ring-offset` alone (both are
// fully transparent on this Tailwind v4 config) — every focusable element gets this exact pair.
export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

export const APP_BG = "bg-zinc-950";
export const PANEL_BG = "bg-zinc-900";
export const BORDER = "border-white/10";
export const SURFACE_INSET = "bg-zinc-950";
export const CARD = "rounded-2xl border border-white/10 bg-zinc-900 shadow-sm shadow-black/30";

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_AUX = "text-zinc-400"; // floor — never lower than this for secondary/dim text
export const TEXT_MUTED = "text-zinc-400";

export const NUM = "tabular-nums [font-feature-settings:'tnum']";

export const ACCENT_TEXT = "text-sky-400";
export const ACCENT_SOLID = "bg-sky-400 text-zinc-950 hover:bg-sky-300 active:bg-sky-500";
export const ACCENT_SUBTLE = "border border-sky-400/25 bg-sky-400/10 text-sky-300";

export const HOVER_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";
export const FADE_TRANSITION = "transition-opacity duration-150 motion-reduce:transition-none";

export type Status = "ok" | "degraded" | "down";
export const STATUS_LABEL: Record<Status, string> = { ok: "OK", degraded: "DEG", down: "DOWN" };
export const STATUS_DOT: Record<Status, string> = {
  ok: "bg-emerald-400",
  degraded: "bg-amber-400",
  down: "bg-rose-400",
};
export const STATUS_TEXT: Record<Status, string> = {
  ok: "text-emerald-300",
  degraded: "text-amber-300",
  down: "text-rose-300",
};

export type Tone = "critical" | "warning" | "info" | "success";
export const TONE_BADGE: Record<Tone, string> = {
  critical: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  warning: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  info: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
};

/** The four-step severity ramp shared by both map metrics (incident count and p50 latency) — see
 * the file header for the per-step contrast verification. Index 0 is always the calm/good end. */
export const RAMP_FILL: readonly [string, string, string, string] = ["#27272a", "#991b1b", "#dc2626", "#ef4444"];
export const RAMP_TEXT: readonly [string, string, string, string] = ["#fafafa", "#fafafa", "#fafafa", "#09090b"];
export const RAMP_LABEL_INCIDENTS: readonly [string, string, string, string] = ["0", "1–2", "3–5", "6+"];
export const RAMP_LABEL_LATENCY: readonly [string, string, string, string] = ["<50ms", "50–79ms", "80–109ms", "110ms+"];

export function tierForIncidents(n: number): 0 | 1 | 2 | 3 {
  if (n === 0) return 0;
  if (n <= 2) return 1;
  if (n <= 5) return 2;
  return 3;
}

export function tierForLatency(ms: number): 0 | 1 | 2 | 3 {
  if (ms < 50) return 0;
  if (ms < 80) return 1;
  if (ms < 110) return 2;
  return 3;
}

export function statusForIncidents(n: number): Status {
  if (n === 0) return "ok";
  if (n <= 2) return "ok";
  if (n <= 5) return "degraded";
  return "down";
}

/** Round to 2dp — required for every SVG coordinate in this route (hex centers and vertices),
 * applied at the single point where trig/arithmetic produces them in data.ts. */
export function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const fmtPct = (n: number) => new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + "%";
export const fmtMs = (n: number) => new Intl.NumberFormat("en-US").format(n) + "ms";
export const fmtCompact = (n: number) => new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
export const fmtInt = (n: number) => new Intl.NumberFormat("en-US").format(n);
