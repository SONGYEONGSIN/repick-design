import type { ComponentType } from "react";
import { WatchList } from "./watchlist/WatchList";
import { MatchList } from "./MatchList";
import { PriceDetail } from "./detail/PriceDetail";
import { OfferThread } from "./offer-thread/OfferThread";
import { Preferences } from "./account/Preferences";
import { SellPriceGuide } from "./evolve/r3/a/SellPriceGuide";
import { HandoffCheckScreen } from "./evolve/r3/b/HandoffCheckScreen";
import { OwnedGridScreen } from "./evolve/r3/c/OwnedGridScreen";
import { NotificationsScreen } from "./evolve/r4/b/NotificationsScreen";
import { BrowseScreen } from "./evolve/r4/a/BrowseScreen";
import { OrderHistoryScreen } from "./evolve/r4/c/OrderHistoryScreen";

const COMPONENTS = {
  watchlist: WatchList,
  match: MatchList,
  detail: PriceDetail,
  "offer-thread": OfferThread,
  account: Preferences,
  "evolve-r3-a": SellPriceGuide,
  "evolve-r3-b": HandoffCheckScreen,
  "evolve-r3-c": OwnedGridScreen,
  "evolve-r4-b": NotificationsScreen,
  "evolve-r4-a": BrowseScreen,
  "evolve-r4-c": OrderHistoryScreen,
} as const satisfies Record<string, ComponentType>;

export type ScreenSlug = keyof typeof COMPONENTS;
export const DEFAULT_SCREEN: ScreenSlug = "watchlist";

export function resolveScreen(slug?: string): ComponentType {
  const key = slug && slug in COMPONENTS ? (slug as ScreenSlug) : DEFAULT_SCREEN;
  return COMPONENTS[key];
}
