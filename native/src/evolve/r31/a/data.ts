// native/src/evolve/r31/a/data.ts
// Deterministic dummy data + pure helper math for the Account Data Export
// screen. No Math.random, no Date.now(), no bare `new Date()` — every value
// below is a fixed literal or a function of fixed literals.

export type ExportCategoryId = "listings" | "orders" | "messages" | "photos";

export type ExportCategory = {
  id: ExportCategoryId;
  label: string;
  description: string;
  itemCount: number;
  sizeMB: number;
};

export const EXPORT_CATEGORIES: ExportCategory[] = [
  {
    id: "listings",
    label: "Listings",
    description: "Active, sold, and archived listings you've posted",
    itemCount: 86,
    sizeMB: 42,
  },
  {
    id: "orders",
    label: "Orders & Transactions",
    description: "Purchase history, payment receipts, and shipping labels",
    itemCount: 214,
    sizeMB: 18,
  },
  {
    id: "messages",
    label: "Messages & Offers",
    description: "Buyer and seller conversations, offers, and counteroffers",
    itemCount: 1340,
    sizeMB: 9,
  },
  {
    id: "photos",
    label: "Photos & Media",
    description: "Listing photos and uploaded condition-proof images",
    itemCount: 512,
    sizeMB: 764,
  },
];

export const ACCOUNT_EMAIL = "mina.park@gmail.com";

// Fixed processing throughput used to turn a payload size into an ETA.
// Changing the inputs changes the output deterministically — this is
// arithmetic, never a randomized guess.
const PROCESSING_RATE_MB_PER_MIN = 60;
const MIN_ETA_MINUTES = 2;

export function computeEtaMinutes(totalSizeMB: number): number {
  if (totalSizeMB <= 0) return 0;
  return Math.max(MIN_ETA_MINUTES, Math.ceil(totalSizeMB / PROCESSING_RATE_MB_PER_MIN));
}

export function formatSize(sizeMB: number): string {
  if (sizeMB >= 1024) {
    return `${(sizeMB / 1024).toFixed(1)} GB`;
  }
  return `${sizeMB} MB`;
}

export function formatItemCount(n: number): string {
  return n.toLocaleString("en-US");
}

// Fixed simulated backend-job duration for this demo build. A constant, not
// a random delay — stands in for a real compile job finishing.
export const PROCESSING_SIMULATION_MS = 3200;

// Fixed, written-out dates (no Date.now()/new Date() anywhere in this build).
export const REQUEST_SUBMITTED_LABEL = "Oct 6, 2026";
export const EXPORT_EXPIRES_LABEL = "Oct 13, 2026";
export const ARCHIVE_FILENAME = "repick-account-export-2026-10-06.zip";
