// Aperture — color tokens.
//
// Brand accent: blue (`#3987e5` dark-surface step), the same hue as categorical
// slot 1 — a coherent choice for a query console, not a collision: slot 1 is
// always "the first/primary series" so a metric viewed with no group-by (its
// single trend line) reads as the brand color on purpose.
//
// Categorical order below is a fixed, never-cycled sequence (dataviz skill,
// "Categorical palette", dark column) — up to 5 slots are used here (the
// largest dimension, Channel, has 5 categories), all within the "adjacent
// pairlist" gate the skill validates for stacked bars / grouped lines.

export const BRAND = {
  text: "#5b9bec", // ~blue-400-equivalent, for text/links on zinc-950/900
  solid: "#3987e5", // slot-1 series blue, dark-surface step
  solidHover: "#2a78d6",
  ring: "#5b9bec",
  soft: "rgba(57,135,229,0.14)",
  softBorder: "rgba(57,135,229,0.32)",
};

export const CATEGORICAL: string[] = [
  "#3987e5", // 1 blue
  "#d95926", // 2 orange
  "#199e70", // 3 aqua
  "#c98500", // 4 yellow
  "#d55181", // 5 magenta
];

export const STATUS = {
  good: "#0ca30c",
  goodText: "#3ecf3e",
  critical: "#e66767",
  criticalText: "#f08a8a",
};

export const CHART_SURFACE = "#151519"; // close to zinc-900, used only inside SVG fills
