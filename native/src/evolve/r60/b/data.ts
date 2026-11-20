// native/src/evolve/r60/b/data.ts — auto-native-r60 candidate b.
//
// Deterministic dummy data for the age/ID verification gate. No Math.random,
// Date.now, or bare `new Date()` anywhere — the buyer's age is a hardcoded
// value already derived from the date of birth on file, not computed live.

export const RESTRICTED_ITEM = {
  id: "itm-fb-212",
  title: "Marlowe Fixed-Blade Hunting Knife",
  subtitle: "6.3in drop-point, carbon steel",
  categoryLabel: "Outdoor & Field Gear",
  priceLabel: "$184.00",
  minAge: 18,
} as const;

export const IDENTITY_ON_FILE = {
  buyerName: "Alex R. Donovan",
  dobLabel: "June 14, 2001",
  ageOnFile: 25,
  idPhoto: {
    statusLabel: "On file",
    capturedLabel: "Captured Mar 3, 2024",
    swatchIndex: 1, // cycles swatch1/2/3 — deterministic placeholder, not a real photo
  },
} as const;

// Fixed, non-random delay so the pending state is visibly distinct from an
// instant flip — not tied to Date.now or any clock read.
export const VERIFY_PENDING_MS = 900;
