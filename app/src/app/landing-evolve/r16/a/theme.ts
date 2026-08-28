// Shared design tokens for r16/a — the Q2 2026 self-audit report landing.
//
// Accent is orange. Two calculated shades are used depending on context (see
// candidates/a.md for the full WCAG math):
//   ACCENT       #EA580C (Tailwind orange-600) — 3.83:1 on white. Safe for fills/bars/
//                borders/large text (>=24px, or >=19px bold) only — NOT for small text.
//   ACCENT_TEXT  #C2410C (Tailwind orange-700) — 5.18:1 on white, 4.88:1 on ACCENT_TINT.
//                Safe for small text, icons, links, focus rings, and as a filled-button
//                background paired with white foreground text.
//   ACCENT_TINT  #FFF7ED (Tailwind orange-50) — subtle active-state surface behind
//                ACCENT_TEXT content.
export const ACCENT = "#EA580C";
export const ACCENT_TEXT = "#C2410C";
export const ACCENT_TINT = "#FFF7ED";

// The one display face this round is allowed: large Latin headline text only.
export const DISPLAY = { fontFamily: "var(--font-display-grotesk)" } as const;
