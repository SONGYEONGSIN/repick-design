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
import { ItemAuthenticationScreen } from "./authentication/ItemAuthenticationScreen";
import { ConditionAssessmentScreen } from "./condition/ConditionAssessmentScreen";
import { ShipmentPickupScreen } from "./pickup/ShipmentPickupScreen";
import LiveAuctionScreen from "./auction/LiveAuctionScreen";
import ActiveSessionsScreen from "./sessions/ActiveSessionsScreen";
import EvolveR23A from "./evolve/r23/a/ProtectionCoverageScreen";
import EvolveR23B from "./evolve/r23/b/PaymentMethodsScreen";
import EvolveR23C from "./evolve/r23/c/PhotoManagerScreen";
import { ReportListingScreen as EvolveR24A } from "./evolve/r24/a/ReportListingScreen";
import { SellerAnalyticsScreen as EvolveR24B } from "./evolve/r24/b/SellerAnalyticsScreen";
import { FollowingFeedScreen as EvolveR24C } from "./evolve/r24/c/FollowingFeedScreen";
import { TradeInAppraisalScreen as EvolveR25A } from "./evolve/r25/a/TradeInAppraisalScreen";
import { DeliveryReceiptScreen as EvolveR25B } from "./evolve/r25/b/DeliveryReceiptScreen";
import { SavedSearchManagerScreen as EvolveR25C } from "./evolve/r25/c/SavedSearchManagerScreen";
import { WarrantyClaimScreen as EvolveR26A } from "./evolve/r26/a/WarrantyClaimScreen";
import { SellerRatingSummaryScreen as EvolveR26B } from "./evolve/r26/b/SellerRatingSummaryScreen";
import LinkedBankAccountsScreen from "./evolve/r26/c/LinkedBankAccountsScreen";
import EvolveR27A from "./evolve/r27/a/PurchaseArchiveScreen";
import EvolveR27B from "./evolve/r27/b/BlockedUsersScreen";
import EvolveR27C from "./evolve/r27/c/BlockedAccountsScreen";

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
  authentication: ItemAuthenticationScreen,
  condition: ConditionAssessmentScreen,
  pickup: ShipmentPickupScreen,
  auction: LiveAuctionScreen,
  sessions: ActiveSessionsScreen,
  "evolve-r23-a": EvolveR23A,
  "evolve-r23-b": EvolveR23B,
  "evolve-r23-c": EvolveR23C,
  "evolve-r24-a": EvolveR24A,
  "evolve-r24-b": EvolveR24B,
  "evolve-r24-c": EvolveR24C,
  "evolve-r25-a": EvolveR25A,
  "evolve-r25-b": EvolveR25B,
  "evolve-r25-c": EvolveR25C,
  "evolve-r26-a": EvolveR26A,
  "evolve-r26-b": EvolveR26B,
  "evolve-r26-c": LinkedBankAccountsScreen,
  "evolve-r27-a": EvolveR27A,
  "evolve-r27-b": EvolveR27B,
  "evolve-r27-c": EvolveR27C,
} as const satisfies Record<string, ComponentType>;

export type ScreenSlug = keyof typeof COMPONENTS;
export const DEFAULT_SCREEN: ScreenSlug = "watchlist";

export function resolveScreen(slug?: string): ComponentType {
  const key = slug && slug in COMPONENTS ? (slug as ScreenSlug) : DEFAULT_SCREEN;
  return COMPONENTS[key];
}
