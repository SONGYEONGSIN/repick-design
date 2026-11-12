/**
 * Design tokens — Ridgehaul Support Console (repick internal ops tool).
 *
 * Theme: dark, near-monochrome zinc scale. Accent: a single green family used sparingly for
 * positive/healthy signal + the chart's one signature mark (the median line). Breach severity
 * gets its own amber family, never a literal green/red pair, and is always paired with an icon
 * + text label (see Badge usage in TicketFeed/DetailPanel) — never color-only.
 *
 * Contrast math (WCAG relative luminance, sRGB):
 * - Background `zinc-950` #09090b → L = 0.00278
 * - Accent text `emerald-400` #34d399 → L = 0.49673 → contrast vs zinc-950 ≈ 10.36:1 (body-safe)
 * - Primary button fill `emerald-500` #10b981 → L = 0.36407, text `zinc-950` on it ≈ 7.85:1
 *   (white text on emerald-600 only reaches ≈3.77:1, which fails AA for normal-weight button
 *   labels — dark text on the bright fill is used instead everywhere a button is filled solid)
 * - Breach text `amber-400` #fbbf24 → L = 0.57904 → contrast vs zinc-950 ≈ 11.92:1
 * - Muted text floor `zinc-400` #a1a1aa → contrast vs zinc-950 ≈ 7.6:1 (no -500/-600 used)
 */

export const SLA_THRESHOLD_HOURS = 24;
export const BOX_SCALE_MAX_HOURS = 48;

export const SURFACE = {
  page: "bg-zinc-950",
  card: "bg-zinc-900",
  cardMuted: "bg-zinc-900/60",
  border: "border-white/10",
  borderStrong: "border-white/15",
};

export const TEXT = {
  primary: "text-zinc-50",
  secondary: "text-zinc-300",
  muted: "text-zinc-400", // floor — never -500/-600 in dark mode
};

export const ACCENT = {
  text: "text-emerald-400",
  textStrong: "text-emerald-300",
  bgSoft: "bg-emerald-400/10",
  borderSoft: "border-emerald-400/25",
  fill: "bg-emerald-500",
  fillHover: "hover:bg-emerald-400",
  onFill: "text-zinc-950",
};

export const WARN = {
  text: "text-amber-400",
  bgSoft: "bg-amber-400/10",
  borderSoft: "border-amber-400/30",
};

export const INFO = {
  text: "text-sky-400",
  bgSoft: "bg-sky-400/10",
  borderSoft: "border-sky-400/25",
};

/** Explicit outline (not `outline-none` + override, which silently cancels in some combos). */
export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400";

export const CARD =
  `rounded-xl border ${SURFACE.border} ${SURFACE.card} shadow-[0_1px_0_0_rgba(255,255,255,0.04)]`;

export const CONTROL_HEIGHT = "h-11"; // 44px
