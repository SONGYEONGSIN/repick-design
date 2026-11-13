import { LISTINGS, type Listing } from "./data";

export type SortId = "match" | "price";

/** Pure sort -- same input, same order, every time. Never mutates LISTINGS. */
export function sortListings(sort: SortId): Listing[] {
  const copy = [...LISTINGS];
  if (sort === "match") {
    return copy.sort((a, b) => b.matchPct - a.matchPct);
  }
  return copy.sort((a, b) => a.price - b.price);
}

export function bestByMatch(ids: string[]): Listing | null {
  const chosen = LISTINGS.filter((l) => ids.includes(l.id));
  if (chosen.length === 0) return null;
  return chosen.reduce((best, cur) => (cur.matchPct > best.matchPct ? cur : best));
}

export function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}
