import type { ComponentType } from "react";
import { WatchList } from "./watchlist/WatchList";
import { MatchList } from "./MatchList";
import { PriceDetail } from "./detail/PriceDetail";
import { OfferThread } from "./offer-thread/OfferThread";
import { Preferences } from "./account/Preferences";
import { HandoffCheckScreen } from "./handoff/HandoffCheckScreen";
import { NotificationsScreen } from "./notifications/NotificationsScreen";
import { OrderTrackingScreen } from "./order-status/OrderTrackingScreen";
import { ListingCreateScreen } from "./listing/ListingCreateScreen";
import { DiscoverScreen } from "./evolve/r6/b/DiscoverScreen";
import { SellerVerificationScreen } from "./evolve/r6/c/SellerVerificationScreen";
import { PayoutsScreen } from "./evolve/r6/a/PayoutsScreen";
import { SearchResultsScreen } from "./evolve/r7/b/SearchResultsScreen";
import { PriceAlertsScreen } from "./evolve/r7/c/PriceAlertsScreen";
import { DisputeCenterScreen } from "./evolve/r7/a/DisputeCenterScreen";

const COMPONENTS = {
  watchlist: WatchList,
  match: MatchList,
  detail: PriceDetail,
  "offer-thread": OfferThread,
  account: Preferences,
  handoff: HandoffCheckScreen,
  notifications: NotificationsScreen,
  "order-status": OrderTrackingScreen,
  listing: ListingCreateScreen,
  "evolve-r6-a": PayoutsScreen,
  "evolve-r6-b": DiscoverScreen,
  "evolve-r6-c": SellerVerificationScreen,
  "evolve-r7-b": SearchResultsScreen,
  "evolve-r7-c": PriceAlertsScreen,
  "evolve-r7-a": DisputeCenterScreen,
} as const satisfies Record<string, ComponentType>;

export type ScreenSlug = keyof typeof COMPONENTS;
export const DEFAULT_SCREEN: ScreenSlug = "watchlist";

export function resolveScreen(slug?: string): ComponentType {
  const key = slug && slug in COMPONENTS ? (slug as ScreenSlug) : DEFAULT_SCREEN;
  return COMPONENTS[key];
}
