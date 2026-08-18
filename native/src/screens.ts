import type { ComponentType } from "react";
import { WatchList } from "./watchlist/WatchList";
import { MatchList } from "./MatchList";
import { PriceDetail } from "./detail/PriceDetail";
import { OfferThread } from "./offer-thread/OfferThread";
import { Preferences } from "./account/Preferences";
import { HandoffCheckScreen } from "./handoff/HandoffCheckScreen";
import { NotificationsScreen } from "./notifications/NotificationsScreen";
import { SellerVerificationScreen } from "./verification/SellerVerificationScreen";
import { DisputeCenterScreen } from "./disputes/DisputeCenterScreen";
import { OrderTrackingScreen } from "./order-status/OrderTrackingScreen";
import { ListingCreateScreen } from "./listing/ListingCreateScreen";
import { CheckoutScreen } from "./evolve/r8/c/CheckoutScreen";
import { SellerStorefrontScreen } from "./evolve/r8/a/SellerStorefrontScreen";
import { WriteReviewScreen } from "./evolve/r8/b/WriteReviewScreen";
import { MeetupSpotScreen } from "./evolve/r9/a/MeetupSpotScreen";
import { SellerTrustProfileScreen } from "./evolve/r9/b/SellerTrustProfileScreen";
import { MeetupSlotGridScreen } from "./evolve/r9/c/MeetupSlotGridScreen";

const COMPONENTS = {
  watchlist: WatchList,
  match: MatchList,
  detail: PriceDetail,
  "offer-thread": OfferThread,
  account: Preferences,
  handoff: HandoffCheckScreen,
  notifications: NotificationsScreen,
  verification: SellerVerificationScreen,
  disputes: DisputeCenterScreen,
  "order-status": OrderTrackingScreen,
  listing: ListingCreateScreen,
  "evolve-r8-c": CheckoutScreen,
  "evolve-r8-a": SellerStorefrontScreen,
  "evolve-r8-b": WriteReviewScreen,
  "evolve-r9-a": MeetupSpotScreen,
  "evolve-r9-b": SellerTrustProfileScreen,
  "evolve-r9-c": MeetupSlotGridScreen,
} as const satisfies Record<string, ComponentType>;

export type ScreenSlug = keyof typeof COMPONENTS;
export const DEFAULT_SCREEN: ScreenSlug = "watchlist";

export function resolveScreen(slug?: string): ComponentType {
  const key = slug && slug in COMPONENTS ? (slug as ScreenSlug) : DEFAULT_SCREEN;
  return COMPONENTS[key];
}
