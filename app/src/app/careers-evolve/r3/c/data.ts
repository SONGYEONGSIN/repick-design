/**
 * Deterministic copy + fixture data for the Fenmark "Careers" page. No Math.random/Date.now/new
 * Date anywhere in this route — every literal below is hardcoded so the route hydrates identically
 * on server and client, and every "computed" figure below is arithmetic over those literals, never
 * a random or clock-based value.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

export type Track = "engineering" | "design" | "sales" | "cs";
export type LocationKey = "remote" | "hybrid-denver" | "onsite-toronto";
export type LevelKey = "L1" | "L2" | "L3" | "L4" | "L5";

export const TRACK_LABELS: Record<Track, string> = {
  engineering: "Engineering",
  design: "Design",
  sales: "Sales",
  cs: "Customer Success",
};

export const LOCATION_LABELS: Record<LocationKey, string> = {
  remote: "Remote — US",
  "hybrid-denver": "Hybrid — Denver, CO",
  "onsite-toronto": "Onsite — Toronto, ON",
};

export const LEVEL_LABELS: Record<LevelKey, string> = {
  L1: "L1 — Associate",
  L2: "L2 — Mid",
  L3: "L3 — Senior",
  L4: "L4 — Staff",
  L5: "L5 — Principal",
};

export const LEVEL_ORDER: LevelKey[] = ["L1", "L2", "L3", "L4", "L5"];

/**
 * Published base-salary bands in USD, one range per track per level. These are the only salary
 * literals in the route — the calculator multiplies them by a location factor, it never invents a
 * number, so the displayed estimate always traces back to a published band.
 */
export const BASE_BANDS: Record<Track, Record<LevelKey, [number, number]>> = {
  engineering: {
    L1: [72000, 85000],
    L2: [92000, 110000],
    L3: [120000, 145000],
    L4: [150000, 180000],
    L5: [185000, 220000],
  },
  design: {
    L1: [68000, 80000],
    L2: [88000, 105000],
    L3: [112000, 135000],
    L4: [140000, 165000],
    L5: [170000, 200000],
  },
  sales: {
    L1: [55000, 65000],
    L2: [70000, 85000],
    L3: [90000, 110000],
    L4: [115000, 140000],
    L5: [145000, 175000],
  },
  cs: {
    L1: [58000, 68000],
    L2: [75000, 90000],
    L3: [95000, 115000],
    L4: [120000, 145000],
    L5: [150000, 180000],
  },
};

/** Equity bands are level-only — the same range applies regardless of track or location. */
export const EQUITY_BANDS: Record<LevelKey, string> = {
  L1: "0.01%–0.02%",
  L2: "0.02%–0.04%",
  L3: "0.04%–0.08%",
  L4: "0.08%–0.14%",
  L5: "0.14%–0.22%",
};

/**
 * Location multiplier applied to the base band. Fixed to two decimal places and published here —
 * the calculator's only arithmetic step besides rounding to the nearest thousand.
 */
export const LOCATION_MULTIPLIER: Record<LocationKey, number> = {
  remote: 1.0,
  "hybrid-denver": 1.05,
  "onsite-toronto": 1.1,
};

export type Role = {
  id: string;
  title: string;
  track: Track;
  level: LevelKey;
  location: LocationKey;
};

/**
 * Rendered as an always-visible card grid — every title, track, level, and location shows before
 * the calculator below is touched at all. The calculator only ever highlights a subset of this
 * list; it never determines which roles are present. This satisfies the careers content contract
 * (real job titles visible without a click) at the default, zero-interaction state.
 */
export const ROLES: Role[] = [
  { id: "r1", title: "Senior Backend Engineer", track: "engineering", level: "L3", location: "remote" },
  { id: "r2", title: "Staff Engineer, Routing Platform", track: "engineering", level: "L4", location: "remote" },
  { id: "r3", title: "Engineering Manager, Platform", track: "engineering", level: "L5", location: "hybrid-denver" },
  { id: "r4", title: "Backend Engineer, New Grad", track: "engineering", level: "L1", location: "remote" },
  { id: "r5", title: "Product Designer", track: "design", level: "L3", location: "remote" },
  { id: "r6", title: "UX Researcher", track: "design", level: "L2", location: "remote" },
  { id: "r7", title: "Account Executive, Mid-Market", track: "sales", level: "L3", location: "onsite-toronto" },
  { id: "r8", title: "Sales Development Representative", track: "sales", level: "L1", location: "remote" },
  { id: "r9", title: "Enterprise Account Executive", track: "sales", level: "L4", location: "hybrid-denver" },
  { id: "r10", title: "Customer Success Manager", track: "cs", level: "L3", location: "remote" },
  { id: "r11", title: "Onboarding Specialist", track: "cs", level: "L2", location: "onsite-toronto" },
];

/** Years-of-experience → level is a fixed step function, not a lookup by index. */
export function levelFromYears(years: number): LevelKey {
  if (years <= 1) return "L1";
  if (years <= 4) return "L2";
  if (years <= 7) return "L3";
  if (years <= 11) return "L4";
  return "L5";
}

export function salaryRange(track: Track, level: LevelKey, location: LocationKey): [number, number] {
  const [min, max] = BASE_BANDS[track][level];
  const mult = LOCATION_MULTIPLIER[location];
  return [Math.round((min * mult) / 1000) * 1000, Math.round((max * mult) / 1000) * 1000];
}

/** Manual thousands formatting — avoids relying on Intl/toLocaleString output being identical
 * between the Node server render and the browser's ICU data. */
export function formatUSD(n: number): string {
  return `$${Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export const YEARS_QUICK_PICKS: { years: number; label: string }[] = [
  { years: 0, label: "New grad" },
  { years: 2, label: "2 yrs" },
  { years: 5, label: "5 yrs" },
  { years: 8, label: "8 yrs" },
  { years: 12, label: "12 yrs" },
  { years: 16, label: "16+ yrs" },
];

export const PRINCIPLES: { index: string; title: string; body: string }[] = [
  {
    index: "01",
    title: "Bands are published, not negotiated",
    body: "Every level on this page maps to a real band we pay against. Recruiters quote the band on the first call, not the last.",
  },
  {
    index: "02",
    title: "Level is set by scope, not tenure",
    body: "Years of experience is a starting estimate, not a ceiling. Panel interviews calibrate the level against the actual role you'd own.",
  },
  {
    index: "03",
    title: "Location adjusts pay, not opportunity",
    body: "Our three location tiers change the number, never the level you can reach or the roles you're eligible for.",
  },
  {
    index: "04",
    title: "Equity is granted at every level",
    body: "Even L1 offers include a meaningful equity grant on a standard four-year schedule with a one-year cliff.",
  },
];
