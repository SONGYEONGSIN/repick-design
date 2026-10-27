// native/src/evolve/r43/c/data.ts — auto-native-r43 candidate c.
//
// Deterministic dummy data for the Collaborative Watchlist Share screen: the
// buyer's saved collections, who each is already shared with, the (fixed,
// fake) share-link slug for each, and the permission that link currently
// grants ("live" / last-actually-shared — see PERMISSIONS_SHARED_LAST below).
//
// No Math.random, no Date.now()/new Date(): every value here is a literal.

export type Permission = "view" | "edit";

export type CollectionDef = {
  id: string;
  name: string;
  itemCount: number;
  friendName: string;
  /** Two-letter initials, used as the leaf-level avatar label (no photo asset). */
  friendInitials: string;
  /** Fixed fake share-link slug — deterministic, never regenerated at runtime. */
  linkUrl: string;
};

export const COLLECTIONS: readonly CollectionDef[] = [
  {
    id: "vintage-denim",
    name: "Vintage Denim",
    itemCount: 14,
    friendName: "Priya Nandan",
    friendInitials: "PN",
    linkUrl: "repick.app/s/vintage-denim-7f2",
  },
  {
    id: "mechanical-keyboards",
    name: "Mechanical Keyboards",
    itemCount: 9,
    friendName: "Sam Okafor",
    friendInitials: "SO",
    linkUrl: "repick.app/s/mech-keys-c91",
  },
  {
    id: "mid-century-lamps",
    name: "Mid-Century Lamps",
    itemCount: 5,
    friendName: "Priya Nandan",
    friendInitials: "PN",
    linkUrl: "repick.app/s/mcm-lamps-a04",
  },
  {
    id: "film-cameras",
    name: "Film Cameras",
    itemCount: 11,
    friendName: "Dana Wu",
    friendInitials: "DW",
    linkUrl: "repick.app/s/film-cameras-3e8",
  },
  {
    id: "rare-sneakers",
    name: "Running Shoes (Rare)",
    itemCount: 7,
    friendName: "Dana Wu",
    friendInitials: "DW",
    linkUrl: "repick.app/s/rare-sneakers-b12",
  },
  {
    id: "studio-monitors",
    name: "Studio Monitors",
    itemCount: 4,
    friendName: "Sam Okafor",
    friendInitials: "SO",
    linkUrl: "repick.app/s/studio-monitors-5d9",
  },
] as const;

export const ALL_COLLECTION_IDS: readonly string[] = COLLECTIONS.map((c) => c.id);

export type PermissionMap = Record<string, Permission>;

/**
 * What each collection's live share link actually grants right now — i.e. the
 * last-saved snapshot. The screen's working state (the segmented toggles) is
 * compared against this map; a toggle that disagrees with it is "pending".
 */
export const PERMISSIONS_SHARED_LAST: PermissionMap = {
  "vintage-denim": "edit",
  "mechanical-keyboards": "view",
  "mid-century-lamps": "view",
  "film-cameras": "edit",
  "rare-sneakers": "view",
  "studio-monitors": "edit",
};
