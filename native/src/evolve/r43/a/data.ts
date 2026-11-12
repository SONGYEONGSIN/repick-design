// native/src/evolve/r43/a/data.ts
//
// Deterministic dummy data for the Group Buy Roster screen (auto-native-r43,
// candidate a). All names, amounts and "pledged ... ago" labels are fixed
// literals — no Math.random, no Date.now(), no bare new Date().

export type FixedContributor = {
  id: string;
  name: string;
  initial: string;
  amount: number; // KRW (won)
  statusLabel: string;
};

export const ITEM = {
  title: "Leica M6 Camera Body, Black",
  subtitle: "35mm rangefinder · near-mint condition · ships with original strap",
  targetPrice: 1_850_000, // KRW — the group's purchase target
};

// "You" is the only live/editable contributor on this screen. Everyone else
// below is a fixed, already-pledged amount.
export const YOU_ID = "you";
export const YOU_NAME = "You";
export const YOU_MIN = 0;
export const YOU_MAX = 1_000_000;
export const YOU_STEP = 50_000;
export const YOU_INITIAL = 400_000;

export const OTHER_CONTRIBUTORS: FixedContributor[] = [
  {
    id: "mina",
    name: "Mina Chen",
    initial: "M",
    amount: 450_000,
    statusLabel: "Pledged 3 days ago",
  },
  {
    id: "carlos",
    name: "Carlos Reyes",
    initial: "C",
    amount: 350_000,
    statusLabel: "Pledged 2 days ago",
  },
  {
    id: "priya",
    name: "Priya Nair",
    initial: "P",
    amount: 200_000,
    statusLabel: "Pledged 2 days ago",
  },
  {
    id: "dev",
    name: "Dev Osei",
    initial: "D",
    amount: 150_000,
    statusLabel: "Pledged yesterday",
  },
  {
    id: "jordan",
    name: "Jordan Blake",
    initial: "J",
    amount: 0,
    statusLabel: "Invited — hasn't pledged yet",
  },
];

// Sum of every FIXED contributor's pledge (excludes "You", who is held as
// live state in the screen component). 450,000 + 350,000 + 200,000 + 150,000
// + 0 = 1,150,000.
export const FIXED_OTHERS_TOTAL = OTHER_CONTRIBUTORS.reduce(
  (sum, c) => sum + c.amount,
  0,
);

// Deliberate gap between the ₩ glyph and the digits — on the -apple-system
// stack at body size the glyph's crossbar visually runs into an adjacent
// digit without it (see native/GENERATION.md §1).
export function formatKRW(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  return `₩ ${safe.toLocaleString("en-US")}`;
}
