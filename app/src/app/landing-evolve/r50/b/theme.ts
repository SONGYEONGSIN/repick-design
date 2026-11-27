// Shared color tokens for this candidate (light theme, orange accent family).
// Contrast ratios below are computed against WCAG relative-luminance math by hand
// (see candidates/b.md "Not specified by the brief" for the full working).
//
//   accent        #C2410C  -> white text on fill: 5.18:1   -> vs ink (border use): 3.56:1
//   accentInk     #B8410A  -> vs bg #FAF9F7: 5.25:1         -> vs white: 5.53:1   (small text/icons/links/focus ring)
//   muted         #6B6560  -> vs bg #FAF9F7: 5.46:1          (body text floor on near-white bg)
//   mutedTrack    #534E49  -> vs surface #F1EDE8: 7.06:1     (body text floor on tinted surface, e.g. segmented track)
//   ghost         #BE7249  -> vs bg #FAF9F7: 3.51:1          (large-text-only decorative ghost numbers)
//   ink           #171311  -> vs bg #FAF9F7: 17.54:1
export const COLOR = {
  bg: "#FAF9F7",
  surface: "#F1EDE8",
  ink: "#171311",
  muted: "#6B6560",
  mutedTrack: "#534E49",
  accent: "#C2410C",
  accentInk: "#B8410A",
  ghost: "#BE7249",
  white: "#FFFFFF",
} as const;
