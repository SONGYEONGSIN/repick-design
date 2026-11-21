// Shared visual tokens. Near-monochrome light theme, rose accent used
// sparingly (buttons, the radar polygon, focus rings, small highlight marks)
// — never as a large background fill.

export const BG = "#FFFFFF";
export const INK = "text-zinc-950";
export const MUTED = "text-zinc-600"; // floor for secondary text on white, per spec

export const ROSE_700 = "#be123c"; // white-on-rose-700 = 6.29:1 — filled buttons, small text/icons on white
export const ROSE_600 = "#e11d48"; // 4.70:1 on white — large text (>=24px) / borders / graphic fills only
export const ROSE_500 = "#f43f5e"; // 3.67:1 on white — graphic-only (bars/strokes), never text

export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#be123c]";

export const DISPLAY_FONT = "font-[family-name:var(--font-display-grotesk)]";

// Body paragraph width budget:
// Pretendard's measured average glyph advance is 0.44em, not 1ch.
// At 16px body text: 0.44 * 16 = 7.04px per character.
// Target band 68-70 chars -> 68 * 7.04 ≈ 479px, 70 * 7.04 ≈ 493px.
// 480px sits inside that band with headroom under the 75-char ceiling
// (75 * 7.04 = 528px), so it's used as the single paragraph max-width
// everywhere on this page instead of any `ch`-based width.
export const PROSE_WIDTH = "max-w-[480px]";
