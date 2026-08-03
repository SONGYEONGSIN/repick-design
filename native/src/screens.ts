import type { ComponentType } from "react";
import { WatchList } from "./watchlist/WatchList";
import { MatchList } from "./MatchList";
import { PriceDetail } from "./detail/PriceDetail";
import { ListingComposer } from "./evolve/r1/a/ListingComposer";
import { OfferThread } from "./evolve/r1/b/OfferThread";
import { TasteCalibration } from "./evolve/r1/c/TasteCalibration";

const COMPONENTS = {
  watchlist: WatchList,
  match: MatchList,
  detail: PriceDetail,
  "evolve-r1-a": ListingComposer,
  "evolve-r1-b": OfferThread,
  "evolve-r1-c": TasteCalibration,
} as const satisfies Record<string, ComponentType>;

export type ScreenSlug = keyof typeof COMPONENTS;
export const DEFAULT_SCREEN: ScreenSlug = "watchlist";

export function resolveScreen(slug?: string): ComponentType {
  const key = slug && slug in COMPONENTS ? (slug as ScreenSlug) : DEFAULT_SCREEN;
  return COMPONENTS[key];
}
