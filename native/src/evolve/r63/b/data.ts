// native/src/evolve/r63/b/data.ts — auto-native-r63 candidate b (blind).
//
// Deterministic dummy data for "Request My Data Export". Every number that
// appears on screen in more than one place (the per-category count in the
// list row AND the rolled-up summary sentence above it) is read from this one
// array — nothing is typed twice. No Math.random / Date.now / bare new Date().

export type ExportCategory = {
  id: string;
  label: string;
  count: number;
  unit: string; // singular unit noun, pluralized by formatCategoryLine()
};

export const EXPORT_CATEGORIES: ExportCategory[] = [
  { id: "orders", label: "Order history", count: 47, unit: "order" },
  { id: "messages", label: "Messages", count: 212, unit: "message" },
  { id: "listings", label: "Listings", count: 18, unit: "listing" },
];

// "47 orders", "212 messages" — shared by the list row and the summary
// sentence so the two spots can never drift apart.
export function formatCategoryLine(category: ExportCategory): string {
  const plural = category.count === 1 ? category.unit : `${category.unit}s`;
  return `${category.count} ${plural}`;
}

// "47 orders, 212 messages, and 18 listings" — the rolled-up summary used in
// the intro paragraph and again in the confirmation screen, derived from the
// same array as the row counts above.
export function formatCategoriesSummary(categories: ExportCategory[]): string {
  const parts = categories.map(formatCategoryLine);
  if (parts.length <= 1) return parts.join("");
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

// What the export package actually contains — shown behind a genuinely
// functional expand/collapse disclosure, not a decorative one.
export const INCLUDED_DETAILS: string[] = [
  "Delivered as a single .zip containing CSV and JSON files, one per category.",
  "Includes item titles, prices, timestamps, and counterpart usernames — no payment card numbers.",
  "The download link is single-use and expires 7 days after it's sent.",
];

// Fixed, deterministic confirmation receipt — never regenerated client-side,
// so the reference number and timestamp never change between renders.
export const EXPORT_REQUEST_REFERENCE = "DX-20261124-7741";
export const EXPORT_REQUESTED_AT_LABEL = "Nov 24, 2026, 9:14 AM KST";
export const EXPORT_ETA_LABEL = "within 24 hours";
export const EXPORT_DELIVERY_EMAIL = "j***@example.com";
