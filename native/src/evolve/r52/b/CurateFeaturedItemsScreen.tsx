// native/src/evolve/r52/b/CurateFeaturedItemsScreen.tsx
//
// Curate Featured Items — a seller picks up to FEATURE_CAP of their active
// listings to feature at the top of their public storefront, and can
// reorder the picks with explicit per-row move controls (plus a rank
// chip). Distinguished from its domain neighbors (confirmed by reading
// both before writing this):
//   - storefront/SellerStorefrontScreen.tsx is the public, read-mostly
//     BUYER view of one seller; nothing here is selected or edited there.
//   - evolve/r48/a/StorefrontProfileScreen.tsx has a "featured listings"
//     block too, but it only ever REORDERS an already-fixed 3-item set
//     nested inside a larger identity/bio/availability settings form, with
//     no cap, no pool to add from, and a dirty-diff-derived save band. This
//     screen is the dedicated, standalone picker over the seller's FULL
//     active-listing pool, with a real cap that blocks new adds (but never
//     removes or reorders) once hit, and its bar is derived from the
//     feature SELECTION count, not a form dirty-diff.
//
// Architecture note vs. evolve/r51/b/CombineShipmentsScreen.tsx: that
// screen's selection is a `Set<string>` because order never mattered — any
// 2+ checked items merge the same way regardless of check order. Here
// order *is* the product (it's the storefront's display order), so the
// one piece of selection state is `draftFeaturedOrder: string[]`, an
// ordered array doing double duty as both "which listings are featured"
// and "in what order" — there is no separate Set-of-ids plus a separate
// ranking map to keep in sync. Adding a cap also means the toggle reducer
// can no longer treat "turn on" and "turn off" symmetrically: turning a
// listing OFF is always allowed, but turning one ON is refused once
// draftFeaturedOrder.length reaches FEATURE_CAP — a distinction
// CombineShipments' uncapped toggle never had to make. On top of that,
// "commits with a Save action" means edits land in a draft that must
// explicitly diverge from (and be reconciled back into) a last-saved
// snapshot — closer to StorefrontProfileScreen's draft/snapshot split than
// to CombineShipments' immediate-commit-on-confirm, but paired here with
// the selection-count-derived bar instead of a dirty-diff-derived one: the
// bar's mount condition is draftFeaturedOrder.length > 0, read fresh every
// render, same as CombineShipments' selectedCount > 0 — it is Save/Reset
// being gated on hasUnsavedChanges that borrows the other screen's idea,
// not the bar's own visibility.

import React, { useCallback, useMemo, useReducer } from "react";
import { View, Text, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import {
  SELLER_ACTIVE_LISTINGS,
  LAST_SAVED_FEATURED_ORDER,
  FEATURE_CAP,
  rankWithin,
  type ActiveListing,
} from "./data";
import { FeaturableListingRow } from "./FeaturableListingRow";
import { FeaturedSelectionBar, type BarPhase } from "./FeaturedSelectionBar";

type State = {
  draftFeaturedOrder: string[];
  lastSavedFeaturedOrder: string[];
  phase: BarPhase;
  justSaved: boolean;
};

type Action =
  | { type: "TOGGLE_FEATURED"; id: string }
  | { type: "MOVE_FEATURED"; id: string; direction: -1 | 1 }
  | { type: "REQUEST_DISCARD" }
  | { type: "CANCEL_DISCARD" }
  | { type: "CONFIRM_DISCARD" }
  | { type: "SAVE" };

const initialState: State = {
  draftFeaturedOrder: [...LAST_SAVED_FEATURED_ORDER],
  lastSavedFeaturedOrder: [...LAST_SAVED_FEATURED_ORDER],
  phase: "editing",
  justSaved: false,
};

function ordersMatch(a: ReadonlyArray<string>, b: ReadonlyArray<string>): boolean {
  if (a.length !== b.length) return false;
  return a.every((id, index) => id === b[index]);
}

function curationReducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_FEATURED": {
      const isFeatured = state.draftFeaturedOrder.includes(action.id);
      let nextOrder: string[];
      if (isFeatured) {
        // Un-featuring is always allowed, cap or no cap.
        nextOrder = state.draftFeaturedOrder.filter((id) => id !== action.id);
      } else {
        // Adding a NEW pick is the only thing the cap ever blocks.
        if (state.draftFeaturedOrder.length >= FEATURE_CAP) return state;
        nextOrder = [...state.draftFeaturedOrder, action.id];
      }
      return { ...state, draftFeaturedOrder: nextOrder, phase: "editing", justSaved: false };
    }
    case "MOVE_FEATURED": {
      const index = state.draftFeaturedOrder.indexOf(action.id);
      const targetIndex = index + action.direction;
      if (index === -1 || targetIndex < 0 || targetIndex >= state.draftFeaturedOrder.length) {
        return state;
      }
      const nextOrder = [...state.draftFeaturedOrder];
      const swapTemp = nextOrder[index];
      nextOrder[index] = nextOrder[targetIndex];
      nextOrder[targetIndex] = swapTemp;
      return { ...state, draftFeaturedOrder: nextOrder, phase: "editing", justSaved: false };
    }
    case "REQUEST_DISCARD": {
      if (ordersMatch(state.draftFeaturedOrder, state.lastSavedFeaturedOrder)) return state;
      return { ...state, phase: "confirmingDiscard" };
    }
    case "CANCEL_DISCARD": {
      return { ...state, phase: "editing" };
    }
    case "CONFIRM_DISCARD": {
      return {
        ...state,
        draftFeaturedOrder: [...state.lastSavedFeaturedOrder],
        phase: "editing",
        justSaved: false,
      };
    }
    case "SAVE": {
      if (ordersMatch(state.draftFeaturedOrder, state.lastSavedFeaturedOrder)) return state;
      return {
        ...state,
        lastSavedFeaturedOrder: [...state.draftFeaturedOrder],
        phase: "editing",
        justSaved: true,
      };
    }
    default:
      return state;
  }
}

export function CurateFeaturedItemsScreen() {
  const [state, dispatch] = useReducer(curationReducer, initialState);

  const featuredCount = state.draftFeaturedOrder.length;
  const atCap = featuredCount >= FEATURE_CAP;
  const hasUnsavedChanges = !ordersMatch(state.draftFeaturedOrder, state.lastSavedFeaturedOrder);
  const canSave = hasUnsavedChanges && state.phase === "editing";

  // Derived, not stored: recomputed every render so it always reflects the
  // current count/cap/phase rather than a value that could drift stale.
  const announcement = useMemo(() => {
    if (state.phase === "confirmingDiscard") {
      const savedCount = state.lastSavedFeaturedOrder.length;
      return `Discard your unsaved featured changes? This restores the ${savedCount} item${
        savedCount === 1 ? "" : "s"
      } you last saved, in their last saved order.`;
    }
    if (featuredCount === 0) return "";
    const countPhrase = `${featuredCount} of ${FEATURE_CAP} featured`;
    if (atCap) {
      return `${countPhrase} — that's the limit for new picks. Remove one to feature a different listing; you can still reorder or remove any of these ${featuredCount}.`;
    }
    if (state.justSaved) {
      return `Saved. ${countPhrase}, in this order.`;
    }
    if (hasUnsavedChanges) {
      return `${countPhrase}. Not yet saved.`;
    }
    return `${countPhrase}.`;
  }, [state.phase, state.lastSavedFeaturedOrder, featuredCount, atCap, state.justSaved, hasUnsavedChanges]);

  const handleToggleFeatured = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_FEATURED", id }),
    []
  );
  const handleMoveFeatured = useCallback(
    (id: string, direction: -1 | 1) => dispatch({ type: "MOVE_FEATURED", id, direction }),
    []
  );
  const handleRequestDiscard = useCallback(() => dispatch({ type: "REQUEST_DISCARD" }), []);
  const handleCancelDiscard = useCallback(() => dispatch({ type: "CANCEL_DISCARD" }), []);
  const handleConfirmDiscard = useCallback(() => dispatch({ type: "CONFIRM_DISCARD" }), []);
  const handleSave = useCallback(() => dispatch({ type: "SAVE" }), []);

  const renderItem = useCallback(
    ({ item }: { item: ActiveListing }) => {
      const rank = rankWithin(state.draftFeaturedOrder, item.id);
      return (
        <FeaturableListingRow
          listing={item}
          rank={rank}
          blockedByCap={rank === null && atCap}
          isFirstFeatured={rank === 1}
          isLastFeatured={rank === featuredCount}
          onToggleFeatured={handleToggleFeatured}
          onMoveFeatured={handleMoveFeatured}
        />
      );
    },
    [state.draftFeaturedOrder, atCap, featuredCount, handleToggleFeatured, handleMoveFeatured]
  );

  const header = (
    <View style={styles.headerBlock}>
      <Text style={styles.headerTitle} accessibilityRole="header">
        Curate Featured Items
      </Text>
      <Text style={styles.headerSubtitle}>
        Pick up to {FEATURE_CAP} active listings to feature at the top of your storefront, and use
        the arrows to set the order buyers see them in.
      </Text>
    </View>
  );

  const showBar = featuredCount > 0;

  return (
    <SafeAreaView style={styles.screenRoot}>
      <FlatList
        data={SELLER_ACTIVE_LISTINGS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
      />

      {showBar ? (
        <FeaturedSelectionBar
          announcement={announcement}
          phase={state.phase}
          hasUnsavedChanges={hasUnsavedChanges}
          canSave={canSave}
          onRequestDiscard={handleRequestDiscard}
          onCancelDiscard={handleCancelDiscard}
          onConfirmDiscard={handleConfirmDiscard}
          onSave={handleSave}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(6),
  },
  headerBlock: {
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(3),
  },
  headerTitle: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(2),
  },
  headerSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: tokens.color.muted,
  },
});

export default CurateFeaturedItemsScreen;
