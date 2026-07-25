/**
 * Wavelength — route-scoped design tokens. Class constants used only within this route,
 * without touching the global theme.
 * This round's assigned theme = dark-only (production dark, n8n/Coinbase style): fixed zinc-950/900
 * surfaces, white/10 borders, text zinc-50 (body) / zinc-300 (secondary) / zinc-400 (caption, all
 * states included — nothing below zinc-500). No theatrical glow, scanlines, or grain.
 * Single accent color = teal (brand UI chrome: buttons/focus rings/active nav). The on-call ring,
 * severity, and status tones each use a separate categorical palette — color is always paired with text.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const APP_BG = "bg-zinc-950";
export const CARD_BG = "bg-zinc-900";
export const SURFACE_INSET = "bg-zinc-950";
export const SURFACE_RAISED = "bg-zinc-800";
export const BORDER = "border-white/10";
export const BORDER_STRONG = "border-white/15";
export const DIVIDE = "divide-white/10";

export const CARD = cx("rounded-2xl border", BORDER, CARD_BG, "shadow-sm shadow-black/20");

export const TEXT_PRIMARY = "text-zinc-50";
export const TEXT_SECONDARY = "text-zinc-300";
export const TEXT_CAPTION = "text-zinc-400";

/** For aligning numbers and IDs — fixed tabular width on top of the global font-sans (Pretendard). */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/* Brand accent — teal (UI chrome only: buttons, focus rings, active nav, workspace icon) */
export const ACCENT_TEXT = "text-teal-300";
export const ACCENT_SOLID = "bg-teal-500 text-zinc-950 hover:bg-teal-400 active:bg-teal-600";
export const ACCENT_SUBTLE = "bg-teal-500/10 text-teal-300";

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";
export const FOCUS_RING_INSET = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-400";

export const HOVER_ACTIVE_BG = "hover:bg-white/5 active:bg-white/10";
export const HOVER_ROW = "hover:bg-white/[0.04]";
export const TRANSITION = "transition-colors motion-reduce:transition-none";

/* Status/zone tones — used for severity badges, incident status pills, trends, etc. Always paired with an icon/text, never color alone. */
export type Tone = "good" | "warn" | "bad" | "info" | "neutral";

export const TONE: Record<Tone, { text: string; bg: string; border: string; dot: string; hex: string }> = {
  good: {
    text: "text-emerald-300",
    bg: "bg-emerald-500/12",
    border: "border-emerald-500/25",
    dot: "bg-emerald-500",
    hex: "#10b981",
  },
  warn: {
    text: "text-amber-300",
    bg: "bg-amber-500/12",
    border: "border-amber-500/25",
    dot: "bg-amber-500",
    hex: "#f59e0b",
  },
  bad: {
    text: "text-rose-300",
    bg: "bg-rose-500/12",
    border: "border-rose-500/25",
    dot: "bg-rose-500",
    hex: "#f43f5e",
  },
  info: {
    text: "text-sky-300",
    bg: "bg-sky-500/12",
    border: "border-sky-500/25",
    dot: "bg-sky-500",
    hex: "#38bdf8",
  },
  neutral: {
    text: "text-zinc-300",
    bg: "bg-zinc-500/12",
    border: "border-zinc-500/20",
    dot: "bg-zinc-400",
    hex: "#a1a1aa",
  },
};

/**
 * On-call ring categorical palette — per-engineer segment colors (data encoding, unrelated to
 * UI chrome, so multiple hues are allowed).
 * 6 desaturated colors, using only bright tones that meet AA contrast on the dark surface
 * (label text is always shown alongside).
 */
export type EngineerToneId = "teal" | "violet" | "amber" | "rose" | "indigo" | "emerald";

export const ENGINEER_TONE: Record<EngineerToneId, { text: string; fill: string; hex: string; ring: string }> = {
  teal: { text: "text-teal-300", fill: "fill-teal-400", hex: "#2dd4bf", ring: "stroke-teal-300" },
  violet: { text: "text-violet-300", fill: "fill-violet-400", hex: "#a78bfa", ring: "stroke-violet-300" },
  amber: { text: "text-amber-300", fill: "fill-amber-400", hex: "#fbbf24", ring: "stroke-amber-300" },
  rose: { text: "text-rose-300", fill: "fill-rose-400", hex: "#fb7185", ring: "stroke-rose-300" },
  indigo: { text: "text-indigo-300", fill: "fill-indigo-400", hex: "#818cf8", ring: "stroke-indigo-300" },
  emerald: { text: "text-emerald-300", fill: "fill-emerald-400", hex: "#34d399", ring: "stroke-emerald-300" },
};
