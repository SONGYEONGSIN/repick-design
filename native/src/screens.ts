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
import { ChatInboxScreen } from "./chat/ChatInbox";
import { ReturnRequestScreen } from "./evolve/r12/a/ReturnRequestScreen";
import { SavedSearchAlertsScreen } from "./evolve/r12/b/SavedSearchAlertsScreen";
import { AuthenticationCertificateScreen } from "./evolve/r12/c/AuthenticationCertificateScreen";
import { MembershipTiersScreen } from "./membership/MembershipTiersScreen";
import { PayoutScreen } from "./evolve/r13/a/PayoutScreen";
import { SellerOnboardingSetupScreen } from "./evolve/r13/b/SellerOnboardingSetupScreen";
import { SupportCenterScreen } from "./evolve/r13/c/SupportCenterScreen";

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
  chat: ChatInboxScreen,
  "evolve-r12-a": ReturnRequestScreen,
  "evolve-r12-b": SavedSearchAlertsScreen,
  "evolve-r12-c": AuthenticationCertificateScreen,
  membership: MembershipTiersScreen,
  "evolve-r13-a": PayoutScreen,
  "evolve-r13-b": SellerOnboardingSetupScreen,
  "evolve-r13-c": SupportCenterScreen,
} as const satisfies Record<string, ComponentType>;

export type ScreenSlug = keyof typeof COMPONENTS;
export const DEFAULT_SCREEN: ScreenSlug = "watchlist";

export function resolveScreen(slug?: string): ComponentType {
  const key = slug && slug in COMPONENTS ? (slug as ScreenSlug) : DEFAULT_SCREEN;
  return COMPONENTS[key];
}
