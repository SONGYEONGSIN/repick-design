// native/src/evolve/r41/c/data.ts — Notification Preferences: the fixed category catalog
// (grouped by domain) plus the deterministic "last saved" snapshot that the working state
// gets compared against. No randomness, no clock reads — every value here is a literal.

export type PreferenceGroupKey = "buying" | "selling";

export type PreferenceKey =
  | "priceDropAlerts"
  | "offerUpdates"
  | "orderStatus"
  | "newMessages"
  | "newOffersReceived"
  | "payoutConfirmations";

/** One boolean per category key — the shape of both the working state and the saved snapshot. */
export type PreferenceSnapshot = Record<PreferenceKey, boolean>;

export interface PreferenceCategoryDef {
  key: PreferenceKey;
  label: string;
  description: string;
}

export interface PreferenceGroupDef {
  key: PreferenceGroupKey;
  title: string;
  categories: PreferenceCategoryDef[];
}

export const PREFERENCE_GROUPS: PreferenceGroupDef[] = [
  {
    key: "buying",
    title: "Buying",
    categories: [
      {
        key: "priceDropAlerts",
        label: "Price Drop Alerts",
        description: "Get notified when a listing on your watchlist drops in price.",
      },
      {
        key: "offerUpdates",
        label: "Offer Updates",
        description: "Know when a seller accepts, counters, or declines an offer you sent.",
      },
      {
        key: "orderStatus",
        label: "Order Status",
        description: "Track shipping, delivery, and pickup updates for items you bought.",
      },
    ],
  },
  {
    key: "selling",
    title: "Selling",
    categories: [
      {
        key: "newMessages",
        label: "New Messages",
        description: "Get notified when a buyer sends you a message about a listing.",
      },
      {
        key: "newOffersReceived",
        label: "New Offers Received",
        description: "Know as soon as a buyer makes an offer on one of your listings.",
      },
      {
        key: "payoutConfirmations",
        label: "Payout Confirmations",
        description: "Confirm when a completed sale's payout has been sent to your account.",
      },
    ],
  },
];

/** Flat list of every category key, in catalog order — used to walk both snapshots in lockstep. */
export const ALL_PREFERENCE_KEYS: PreferenceKey[] = PREFERENCE_GROUPS.flatMap((group) =>
  group.categories.map((category) => category.key)
);

// The last-saved preference state as of this screen's mount. Fixed/deterministic — this is
// dummy data standing in for "what the account currently has on file".
export const INITIAL_SAVED_PREFERENCES: PreferenceSnapshot = {
  priceDropAlerts: true,
  offerUpdates: true,
  orderStatus: true,
  newMessages: true,
  newOffersReceived: true,
  payoutConfirmations: false,
};
