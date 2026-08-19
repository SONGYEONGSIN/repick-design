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
import { WriteReviewScreen } from "./review/WriteReviewScreen";
import { MeetupSlotGridScreen } from "./meetup-time/MeetupSlotGridScreen";
import { SearchBrowseScreen } from "./evolve/r10/a/SearchBrowseScreen";
import { ChatInboxScreen } from "./evolve/r10/b/ChatInbox";
import { ReportListingScreen } from "./evolve/r10/c/ReportListingScreen";

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
  review: WriteReviewScreen,
  "meetup-time": MeetupSlotGridScreen,
  "evolve-r10-a": SearchBrowseScreen,
  "evolve-r10-b": ChatInboxScreen,
  "evolve-r10-c": ReportListingScreen,
} as const satisfies Record<string, ComponentType>;

export type ScreenSlug = keyof typeof COMPONENTS;
export const DEFAULT_SCREEN: ScreenSlug = "watchlist";

export function resolveScreen(slug?: string): ComponentType {
  const key = slug && slug in COMPONENTS ? (slug as ScreenSlug) : DEFAULT_SCREEN;
  return COMPONENTS[key];
}
