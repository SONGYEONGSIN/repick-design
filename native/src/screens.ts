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
import { AuthenticationCertificateScreen } from "./certificate/AuthenticationCertificateScreen";
import { MembershipTiersScreen } from "./membership/MembershipTiersScreen";
import { PayoutScreen } from "./payout/PayoutScreen";
import { WalletLedgerScreen } from "./wallet/WalletLedgerScreen";
import { SellerStorefrontScreen } from "./storefront/SellerStorefrontScreen";
import { BulkRelistScreen } from "./relist/BulkRelistScreen";
import { SellerScorecardScreen } from "./evolve/r17/a/SellerScorecardScreen";
import { ItemAuthenticationScreen } from "./evolve/r17/b/ItemAuthenticationScreen";
import { PriceSuggestionScreen } from "./evolve/r17/c/PriceSuggestionScreen";

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
  certificate: AuthenticationCertificateScreen,
  membership: MembershipTiersScreen,
  payout: PayoutScreen,
  wallet: WalletLedgerScreen,
  storefront: SellerStorefrontScreen,
  relist: BulkRelistScreen,
  "evolve-r17-a": SellerScorecardScreen,
  "evolve-r17-b": ItemAuthenticationScreen,
  "evolve-r17-c": PriceSuggestionScreen,
} as const satisfies Record<string, ComponentType>;

export type ScreenSlug = keyof typeof COMPONENTS;
export const DEFAULT_SCREEN: ScreenSlug = "watchlist";

export function resolveScreen(slug?: string): ComponentType {
  const key = slug && slug in COMPONENTS ? (slug as ScreenSlug) : DEFAULT_SCREEN;
  return COMPONENTS[key];
}
