// native/src/evolve/r30/b/data.ts
// Deterministic dummy data for the Linked Marketplaces Sync screen.
// No Math.random / Date.now / bare new Date() — every timestamp below is a
// fixed literal label, not a computed value.

export type SyncHealth = "active" | "attention";

export type MarketplaceRow = {
  id: string;
  /** Display name of the connected external (or internal) marketplace account. */
  name: string;
  /** The handle/account string shown under the name, e.g. a shop slug. */
  handle: string;
  /**
   * True only for the single administratively-locked primary sync source.
   * A primary row never renders a Disconnect control, by design.
   */
  isPrimary: boolean;
  syncHealth: SyncHealth;
  lastSyncedLabel: string;
  itemsSynced: number;
  /** Shown only on the primary row, explaining why it can't be removed here. */
  lockedNote?: string;
  /** Shown on a row with syncHealth "attention", explaining what's wrong. */
  attentionNote?: string;
};

export const marketplaceRows: MarketplaceRow[] = [
  {
    id: "mkt-primary-repick",
    name: "Repick Storefront",
    handle: "@yourstore.repick",
    isPrimary: true,
    syncHealth: "active",
    lastSyncedLabel: "Today, 9:12 AM",
    itemsSynced: 341,
    lockedNote:
      "This is your primary sync source — every other row syncs against it. It can't be disconnected from this screen.",
  },
  {
    id: "mkt-threadloop",
    name: "ThreadLoop",
    handle: "@yourstore_official",
    isPrimary: false,
    syncHealth: "active",
    lastSyncedLabel: "Today, 8:47 AM",
    itemsSynced: 212,
  },
  {
    id: "mkt-found-co",
    name: "Found & Co. Marketplace",
    handle: "@yourstore-fc",
    isPrimary: false,
    syncHealth: "attention",
    lastSyncedLabel: "Oct 2, 11:05 AM",
    itemsSynced: 64,
    attentionNote: "Sign-in expired — last sync did not complete.",
  },
  {
    id: "mkt-swaphaus",
    name: "SwapHaus",
    handle: "@yourstore.sh",
    isPrimary: false,
    syncHealth: "active",
    lastSyncedLabel: "Yesterday, 4:30 PM",
    itemsSynced: 128,
  },
  {
    id: "mkt-resellcircle",
    name: "ReSellCircle",
    handle: "@yourstore_rc",
    isPrimary: false,
    syncHealth: "active",
    lastSyncedLabel: "Oct 1, 8:00 AM",
    itemsSynced: 37,
  },
  {
    id: "mkt-closet-exchange",
    name: "Closet Exchange",
    handle: "@yourstore.ce",
    isPrimary: false,
    syncHealth: "active",
    lastSyncedLabel: "Sep 28, 2:15 PM",
    itemsSynced: 0,
  },
];
