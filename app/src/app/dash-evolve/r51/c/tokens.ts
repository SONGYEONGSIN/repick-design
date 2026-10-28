/**
 * Siftline — route-scoped design tokens (auto-dash-r51 / candidate c).
 *
 * THEME: true light. Canvas white (`bg-white`), raised/alternate surfaces `zinc-50`, hairlines
 * `zinc-200`. No cream/paper/sepia tint anywhere — every surface token below is a pure neutral.
 *
 * CONTRAST FLOOR: a single aux-text token (`TEXT_AUX` = `zinc-600`) is used for every caption/
 * label/metadata string on the page, whether it sits directly on white or on a tinted surface
 * (a chip, a segmented track, a hover/selected row). zinc-600 clears the documented floor on BOTH
 * surface kinds (zinc-500-or-darker on plain white, zinc-600-or-darker on zinc-100+), so there is
 * no surface-dependent branching to get wrong — one token, always safe, slightly more contrast
 * than the plain-white floor strictly requires, traded for zero risk of misclassifying a surface.
 *
 * ACCENT: a single green —
 *   green-700 (#15803d) as a solid fill with white text → ~5.9:1. The one primary button, the one
 *     active-nav-pill scheme (paired with a green-50 tint), the one focus-ring hue.
 *   green-700 as TEXT on white/zinc-50 → ~5.9:1 / ~5.6:1. Links, the "Resolved" status (reusing the
 *     brand hue for the single positive end-state rather than inventing a second green, same move
 *     this catalogue has made before for an accent's "healthy" status).
 * Everything else — severity, status (besides Resolved), category — is a separate semantic palette
 * (red/orange/amber/zinc for severity; sky/violet/rose for the other statuses). A single accent
 * cannot carry four independent severity levels AND four independent statuses without erasing the
 * distinction the page needs reviewers to see at a glance — same reasoning this catalogue has used
 * for tier/grade palettes sitting alongside a one-hue brand accent.
 */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const ACCENT_HEX = "#15803d";

/** The house focus token — never preceded by a bare `outline-none`, never `ring`+`ring-offset`
 *  (fully transparent in this Tailwind v4 setup). Outline + a soft colour-matched halo so it paints
 *  visibly on every surface, including inside the command palette and popovers. */
export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 focus-visible:shadow-[0_0_0_3px_rgba(21,128,61,0.22)]";

export const APP_BG = "bg-white";
export const PANEL_BG = "bg-white";
export const BORDER = "border-zinc-200";
export const SURFACE_INSET = "bg-zinc-100";
export const SURFACE_SOFT = "bg-zinc-50";
export const CARD = "rounded-xl border border-zinc-200 bg-white shadow-sm";

export const TEXT_PRIMARY = "text-zinc-900";
export const TEXT_SECONDARY = "text-zinc-700";
/** One floor, every surface — see file header. */
export const TEXT_AUX = "text-zinc-600";

/** Numbers, counts, minutes, dates, ids — fixed-width figures on top of Pretendard. */
export const NUM = "tabular-nums [font-feature-settings:'tnum']";

/** Headline/wordmark Latin display face — assigned `--font-display-mono`. Never mixed with the
 *  other two whitelisted display vars; body and Korean text never use this. */
export const displayMonoStyle = { fontFamily: "var(--font-display-mono)" } as const;

export const ACCENT_TEXT = "text-green-700";
export const ACCENT_SOLID = "bg-green-700 text-white hover:bg-green-800 active:bg-green-900";
export const ACCENT_SUBTLE = "border border-green-200 bg-green-50 text-green-800";

export const HOVER_BG = "hover:bg-zinc-100 active:bg-zinc-200";
export const HOVER_ROW = "hover:bg-zinc-50";
export const TRANSITION = "transition-colors duration-150 motion-reduce:transition-none";
export const TRANSITION_ALL = "transition-all duration-200 ease-out motion-reduce:transition-none";

/* --------------------------------------------------------------------- semantic palettes */

export type Severity = "Critical" | "High" | "Medium" | "Low";
export type Status = "New" | "In Review" | "Escalated" | "Resolved";

export const SEVERITY_RANK: Record<Severity, number> = { Critical: 3, High: 2, Medium: 1, Low: 0 };

export const SEVERITY_STYLE: Record<Severity, { text: string; bg: string; border: string }> = {
  Critical: { text: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  High: { text: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  Medium: { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  Low: { text: "text-zinc-600", bg: "bg-zinc-100", border: "border-zinc-200" },
};

export const STATUS_STYLE: Record<Status, { text: string; bg: string; border: string }> = {
  New: { text: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
  "In Review": { text: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  Escalated: { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  Resolved: { text: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
};

/** Deterministic initials-avatar colour — a hash of the name's char codes, never `Math.random()`. */
const AVATAR_PALETTE = [
  "bg-blue-50 text-blue-700",
  "bg-purple-50 text-purple-700",
  "bg-rose-50 text-rose-700",
  "bg-amber-50 text-amber-700",
  "bg-teal-50 text-teal-700",
  "bg-indigo-50 text-indigo-700",
  "bg-cyan-50 text-cyan-700",
  "bg-fuchsia-50 text-fuchsia-700",
];

export function avatarTone(name: string): string {
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return AVATAR_PALETTE[sum % AVATAR_PALETTE.length];
}

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
