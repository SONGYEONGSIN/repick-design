// Aperture — color tokens.
//
// Tailwind's compiler only picks up arbitrary-value classes it can see as
// literal source text, so every other component below writes its hex
// directly in the className template (`text-[#5b9bec]`, `bg-[#1f5fc4]`) —
// a JS constant interpolated into that string would never be found by the
// scanner. The one value worth centralizing is CATEGORICAL, because it is
// indexed by loop position rather than typed by hand at each call site.
//
// Palette reference (see design log in candidates/c.md for contrast math):
//   #5b9bec  accent text/links/rings/series-1  — 6.20:1 on zinc-900
//   #1f5fc4  solid CTA fill (white text)       — 6.01:1 white-on-fill
//   rgba(57,135,229,.14 / .32)  soft brand fill / border (active pills, nav)
//
// Categorical order below is a fixed, never-cycled sequence (dataviz skill,
// "Categorical palette", dark column) — up to 5 slots are used here (the
// largest dimension, Channel, has 5 categories), all within the "adjacent
// pairlist" gate the skill validates for stacked bars / grouped lines.
export const CATEGORICAL: string[] = [
  "#3987e5", // 1 blue
  "#d95926", // 2 orange
  "#199e70", // 3 aqua
  "#c98500", // 4 yellow
  "#d55181", // 5 magenta
];
