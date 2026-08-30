// Color tokens for this candidate.
//
// Contrast is computed by hand in candidates/b.md — this file just centralizes
// the hex values so every component references the same source.
export const COLOR = {
  bg: "#0B0B0F",
  bgElevated: "#131318",
  bgCard: "#16161C",
  border: "rgba(255,255,255,0.09)",
  borderStrong: "rgba(255,255,255,0.16)",
  fg: "#FFFFFF",
  muted: "#A1A1AA",
  // Brightened from a first pass at #71717A (3.7:1 on the card surface,
  // failing the 4.5:1 small-text floor once actually computed) — see
  // candidates/b.md for the luminance math.
  mutedDim: "#8E8E96",
  // Full accent hue (amber): fills, borders, bar fills, large/bold text.
  accent: "#F59E0B",
  // Brighter tint of the same hue: small text, icons, focus rings on dark bg.
  accentBright: "#FFC369",
  // Dark ink used ON TOP of accent-filled surfaces (buttons/chips).
  inkOnAccent: "#0B0B0F",
  // Low-alpha accent, used for "this is matched" borders/backgrounds.
  accentBorder: "rgba(245,158,11,0.35)",
  accentSoftBg: "rgba(245,158,11,0.10)",
} as const;
