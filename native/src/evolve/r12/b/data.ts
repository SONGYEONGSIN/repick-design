// native/src/evolve/r12/b/data.ts — auto-native-r12 candidate b: Saved Search Alerts.
// Dummy data is fully static (no Math.random / Date.now / argument-less new Date) so the screen
// renders identically on every run.

export type AlertFrequency = "instant" | "daily" | "off";

export interface SavedSearch {
  id: string;
  query: string; // the core search phrase the buyer saved, e.g. "iPhone 13 Pro"
  category: string; // small eyebrow line, e.g. "Electronics"
  filters: string[]; // extra filter chips beyond price, e.g. "Like new or better"
  priceCeiling: number; // KRW, the "under ₩ X" part of the saved query
  frequency: AlertFrequency;
  matchesThisWeek: number;
  savedOn: string; // fixed literal date string, e.g. "Jul 2, 2026"
}

export const FREQUENCY_OPTIONS: { key: AlertFrequency; label: string }[] = [
  { key: "instant", label: "Instant" },
  { key: "daily", label: "Daily" },
  { key: "off", label: "Off" },
];

export const PRICE_STEP = 50_000;
export const PRICE_MIN = 50_000;
export const PRICE_MAX = 3_000_000;

// Currency glyph rule (settled 2026-08-23): ₩ visually runs into a following digit at body text
// size, so a visible gap always separates the sign from the number — never fontVariant tricks.
export function formatKRW(amount: number): string {
  return `₩ ${amount.toLocaleString("en-US")}`;
}

export function clampPrice(value: number): number {
  return Math.min(PRICE_MAX, Math.max(PRICE_MIN, value));
}

export function frequencyLabel(freq: AlertFrequency): string {
  return FREQUENCY_OPTIONS.find((f) => f.key === freq)?.label ?? freq;
}

export const INITIAL_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: "ss-1",
    query: "iPhone 13 Pro",
    category: "Electronics",
    filters: ["Like new or better", "Seoul area"],
    priceCeiling: 600_000,
    frequency: "instant",
    matchesThisWeek: 12,
    savedOn: "Jul 2, 2026",
  },
  {
    id: "ss-2",
    query: "Vintage denim jacket",
    category: "Clothing",
    filters: ["Size M", "Vintage wash"],
    priceCeiling: 80_000,
    frequency: "daily",
    matchesThisWeek: 4,
    savedOn: "Jun 18, 2026",
  },
  {
    id: "ss-3",
    query: "Nintendo Switch OLED",
    category: "Electronics",
    filters: ["Includes dock"],
    priceCeiling: 250_000,
    frequency: "off",
    matchesThisWeek: 0,
    savedOn: "May 30, 2026",
  },
  {
    id: "ss-4",
    query: "Herman Miller Aeron chair",
    category: "Furniture",
    filters: ["Size B", "Local pickup only"],
    priceCeiling: 450_000,
    frequency: "daily",
    matchesThisWeek: 2,
    savedOn: "Aug 10, 2026",
  },
];
