// Pure derive functions only -- no randomness, no refs, no effects. Every value here is computed
// fresh from the current `assignments` map each render, so the composition chart and the verdict
// sentence can never drift from where the cards actually are.

import { BUNDLE_RATE, type Assignments, type BucketId, type Item } from "./data";

export function formatUsd(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

function isAre(count: number): string {
  return count === 1 ? "is" : "are";
}

export type BucketStat = {
  id: BucketId;
  count: number;
  items: Item[];
  pct: number; // share of total, 0-100, rounded to 2 decimals for stable layout math
};

export type Stats = {
  total: number;
  byBucket: Record<BucketId, BucketStat>;
  listPayout: number;
  bundleValue: number;
  donateCount: number;
  verdict: string;
};

export function deriveStats(items: Item[], assignments: Assignments, bucketOrder: BucketId[]): Stats {
  const total = items.length;
  const byBucket = {} as Record<BucketId, BucketStat>;

  for (const bucketId of bucketOrder) {
    const bucketItems = items.filter((item) => assignments[item.id] === bucketId);
    const pct = total === 0 ? 0 : Math.round((bucketItems.length / total) * 10000) / 100;
    byBucket[bucketId] = { id: bucketId, count: bucketItems.length, items: bucketItems, pct };
  }

  const listPayout = byBucket.list.items.reduce((sum, item) => sum + item.listPrice, 0);
  const bundleValue = Math.round(byBucket.bundle.items.reduce((sum, item) => sum + item.listPrice, 0) * BUNDLE_RATE);
  const donateCount = byBucket.donate.count;

  const verdict =
    `${byBucket.list.count} of ${total} items are set to list for cash -- a projected payout of ` +
    `${formatUsd(listPayout)}. ${byBucket.bundle.count} more ${isAre(byBucket.bundle.count)} bundled for ` +
    `${formatUsd(bundleValue)}, and ${donateCount} ${isAre(donateCount)} donated for a receipt.`;

  return { total, byBucket, listPayout, bundleValue, donateCount, verdict };
}
