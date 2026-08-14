// native/src/evolve/r5/c/data.ts — auto-native-r5 candidate c (Saved searches & alerts)
// Deterministic dummy data only — no Math.random / Date.now / argument-less new Date().
// Runtime state (alert on/off, frequency, removal) is mutated via useState in
// SavedSearchesScreen.tsx starting from this fixed list — determinism governs the seed data,
// not the user's later interactions with it.

export type FrequencyKey = "instant" | "daily" | "weekly";

export const FREQUENCY_ORDER: readonly FrequencyKey[] = ["instant", "daily", "weekly"];

export const FREQUENCY_LABEL: Record<FrequencyKey, string> = {
  instant: "Instant",
  daily: "Daily digest",
  weekly: "Weekly digest",
};

export type SavedSearch = {
  id: string;
  query: string;
  category: string;
  savedLabel: string;
  newMatches: number;
  alertEnabled: boolean;
  frequency: FrequencyKey;
};

// Five saved searches spanning two categories, a mix of alert-on/alert-off starting states, and
// a mix of zero/non-zero match counts — enough variety to exercise every row state without
// relying on interaction to reveal them.
export const SAVED_SEARCHES: readonly SavedSearch[] = [
  {
    id: "ss-iphone-13-pro",
    query: "iPhone 13 Pro, under $500",
    category: "Electronics",
    savedLabel: "Saved Jun 3",
    newMatches: 3,
    alertEnabled: true,
    frequency: "instant",
  },
  {
    id: "ss-aeron-chair",
    query: "Herman Miller Aeron chair, size B",
    category: "Furniture",
    savedLabel: "Saved May 22",
    newMatches: 0,
    alertEnabled: true,
    frequency: "daily",
  },
  {
    id: "ss-switch-oled",
    query: "Nintendo Switch OLED, bundle",
    category: "Electronics",
    savedLabel: "Saved May 14",
    newMatches: 1,
    alertEnabled: false,
    frequency: "weekly",
  },
  {
    id: "ss-walnut-dresser",
    query: "Mid-century walnut dresser",
    category: "Furniture",
    savedLabel: "Saved Apr 30",
    newMatches: 0,
    alertEnabled: true,
    frequency: "instant",
  },
  {
    id: "ss-canon-r6",
    query: "Canon EOS R6, body only, under $1200",
    category: "Electronics",
    savedLabel: "Saved Apr 18",
    newMatches: 5,
    alertEnabled: true,
    frequency: "daily",
  },
];

// Shared copy rule so the screen never hand-writes the singular/plural/zero cases inline.
export function matchSummary(count: number): string {
  if (count === 0) return "No new matches";
  if (count === 1) return "1 new match";
  return `${count} new matches`;
}
