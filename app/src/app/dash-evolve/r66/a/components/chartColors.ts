// Fixed categorical hues for the generation-mix stack, shared by every widget that shows a mix
// breakdown (the center chart, the pinned-region snapshot). Dark-surface validated slots from the
// dataviz palette, assigned in a fixed stack order (never reassigned, never cycled) — see
// GridChart.tsx for the adjacent-pair validation note.
export const STORAGE_COLOR = "#338ced"; // slot 1 — blue
export const GAS_COLOR = "#e76624"; // slot 2 — orange
export const WIND_COLOR = "#00a888"; // slot 3 — aqua
export const SOLAR_COLOR = "#d28e05"; // slot 4 — yellow
export const DEMAND_COLOR = "#f4f4f5"; // zinc-100 — neutral reference line, not a categorical series
