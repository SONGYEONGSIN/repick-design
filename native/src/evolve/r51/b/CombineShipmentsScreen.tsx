// native/src/evolve/r51/b/CombineShipmentsScreen.tsx
//
// Combine Shipments — a buyer's purchased-but-not-yet-shipped items, across
// possibly different orders and sellers, with a multi-select flow to merge
// 2+ of them into a single outbound shipment and save on shipping.
//
// Architecture note: everything the UI needs — which rows are checked, the
// confirm-step substage, and the last completed merge (for the undo
// banner) — lives in one useReducer, not a scatter of independent
// useState/useRef pairs. The bar's own visibility is still never a field of
// that state; it is read off selectedCount > 0 at render time, same as the
// banner is read off selectedCount === 0 && lastMerge !== null.

import React, { useCallback, useMemo, useReducer } from "react";
import { View, Text, FlatList, SafeAreaView, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import {
  PENDING_SHIPMENT_ITEMS,
  MIN_MERGE_COUNT,
  estimateCombinedShipment,
  formatWeight,
  type ShipmentItem,
} from "./data";
import { ShipmentItemRow } from "./ShipmentItemRow";
import { MergeStatusBar, type MergeStage } from "./MergeStatusBar";
import { MergedShipmentBanner } from "./MergedShipmentBanner";

type MergeRecord = {
  mergedItemCount: number;
  itemsSnapshot: ShipmentItem[];
};

type State = {
  items: ShipmentItem[];
  selectedIds: ReadonlySet<string>;
  stage: MergeStage;
  lastMerge: MergeRecord | null;
};

type Action =
  | { type: "TOGGLE_ITEM"; id: string }
  | { type: "REQUEST_CONFIRM" }
  | { type: "CANCEL_CONFIRM" }
  | { type: "COMMIT_MERGE" }
  | { type: "UNDO_MERGE" }
  | { type: "DISMISS_MERGE_NOTICE" };

const initialState: State = {
  items: PENDING_SHIPMENT_ITEMS,
  selectedIds: new Set(),
  stage: "selecting",
  lastMerge: null,
};

function shipmentReducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_ITEM": {
      const next = new Set(state.selectedIds);
      if (next.has(action.id)) {
        next.delete(action.id);
      } else {
        next.add(action.id);
      }
      // Changing the selection always restarts any confirm-in-progress and
      // clears a stale merge notice rather than leaving them stranded.
      return { ...state, selectedIds: next, stage: "selecting", lastMerge: null };
    }
    case "REQUEST_CONFIRM": {
      if (state.selectedIds.size < MIN_MERGE_COUNT) return state;
      return { ...state, stage: "confirming" };
    }
    case "CANCEL_CONFIRM": {
      return { ...state, stage: "selecting" };
    }
    case "COMMIT_MERGE": {
      const merged = state.items.filter((item) => state.selectedIds.has(item.id));
      if (merged.length < MIN_MERGE_COUNT) return state;
      const remaining = state.items.filter((item) => !state.selectedIds.has(item.id));
      return {
        items: remaining,
        selectedIds: new Set(),
        stage: "selecting",
        lastMerge: { mergedItemCount: merged.length, itemsSnapshot: merged },
      };
    }
    case "UNDO_MERGE": {
      if (!state.lastMerge) return state;
      // Restore in the catalog's original order rather than just appending,
      // so the list looks the same as it did before the merge.
      const restoredIds = new Set(state.lastMerge.itemsSnapshot.map((item) => item.id));
      const restored = PENDING_SHIPMENT_ITEMS.filter(
        (item) => restoredIds.has(item.id) || state.items.some((kept) => kept.id === item.id)
      );
      return { ...state, items: restored, lastMerge: null };
    }
    case "DISMISS_MERGE_NOTICE": {
      return { ...state, lastMerge: null };
    }
    default:
      return state;
  }
}

export function CombineShipmentsScreen() {
  const [state, dispatch] = useReducer(shipmentReducer, initialState);

  const selectedItems = useMemo(
    () => state.items.filter((item) => state.selectedIds.has(item.id)),
    [state.items, state.selectedIds]
  );
  const selectedCount = selectedItems.length;
  const canMerge = selectedCount >= MIN_MERGE_COUNT;
  const estimate = useMemo(() => estimateCombinedShipment(selectedItems), [selectedItems]);

  // Derived, not stored: the exact sentence the live region carries.
  // Recomputed every render so it always reflects the current count —
  // "a live region announces the current count as it changes" applies
  // literally here, not just at a pass/fail threshold.
  const announcement = useMemo(() => {
    if (state.stage === "confirming") {
      const savingsPhrase =
        estimate.savingsWon > 0 ? ` and save ${formatWonInline(estimate.savingsWon)}` : "";
      return `Combine ${selectedCount} items into one shipment for ${formatWonInline(
        estimate.combinedCostWon
      )}${savingsPhrase}?`;
    }
    if (selectedCount === 0) return "";
    if (!canMerge) {
      const more = MIN_MERGE_COUNT - selectedCount;
      return `${selectedCount} item selected · ${formatWeight(estimate.totalWeightGrams)} · select ${more} more item${
        more === 1 ? "" : "s"
      } to combine shipments.`;
    }
    return `${selectedCount} items selected · ${formatWeight(
      estimate.totalWeightGrams
    )} combined weight · estimated shipping ${formatWonInline(estimate.combinedCostWon)}${
      estimate.savingsWon > 0 ? `, saving ${formatWonInline(estimate.savingsWon)}` : ""
    }.`;
  }, [state.stage, selectedCount, canMerge, estimate]);

  const handleToggle = useCallback((id: string) => dispatch({ type: "TOGGLE_ITEM", id }), []);
  const handleRequestConfirm = useCallback(() => dispatch({ type: "REQUEST_CONFIRM" }), []);
  const handleCancelConfirm = useCallback(() => dispatch({ type: "CANCEL_CONFIRM" }), []);
  const handleCommitMerge = useCallback(() => dispatch({ type: "COMMIT_MERGE" }), []);
  const handleUndo = useCallback(() => dispatch({ type: "UNDO_MERGE" }), []);
  const handleDismissNotice = useCallback(() => dispatch({ type: "DISMISS_MERGE_NOTICE" }), []);

  const renderItem = useCallback(
    ({ item }: { item: ShipmentItem }) => (
      <ShipmentItemRow
        item={item}
        isSelected={state.selectedIds.has(item.id)}
        onToggle={handleToggle}
      />
    ),
    [state.selectedIds, handleToggle]
  );

  const header = (
    <View style={styles.headerBlock}>
      <Text style={styles.headerTitle} accessibilityRole="header">
        Combine Shipments
      </Text>
      <Text style={styles.headerSubtitle}>
        Select {MIN_MERGE_COUNT} or more purchased items below to merge them into one outbound
        shipment and save on shipping.
      </Text>
    </View>
  );

  const showBar = selectedCount > 0;
  const showMergedBanner = selectedCount === 0 && state.lastMerge !== null;

  return (
    <SafeAreaView style={styles.screenRoot}>
      <FlatList
        data={state.items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nothing waiting to ship right now — every purchased item has already gone out.
          </Text>
        }
      />

      {showBar ? (
        <MergeStatusBar
          selectedCount={selectedCount}
          canMerge={canMerge}
          stage={state.stage}
          estimate={estimate}
          announcement={announcement}
          onRequestConfirm={handleRequestConfirm}
          onCancelConfirm={handleCancelConfirm}
          onCommitMerge={handleCommitMerge}
        />
      ) : null}

      {showMergedBanner && state.lastMerge ? (
        <MergedShipmentBanner
          mergedItemCount={state.lastMerge.mergedItemCount}
          estimate={estimateCombinedShipment(state.lastMerge.itemsSnapshot)}
          onUndo={handleUndo}
          onDismiss={handleDismissNotice}
        />
      ) : null}
    </SafeAreaView>
  );
}

// Local inline formatter kept separate from data.ts's display-oriented
// formatWon so the live-region sentence builder here doesn't have to
// re-import/alias it under two names; same digit-grouping rule, no space
// quirk to manage since this always sits mid-sentence between words.
function formatWonInline(amountWon: number): string {
  const digits = Math.round(amountWon).toString();
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `₩ ${withCommas}`;
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
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
    textAlign: "center",
    paddingTop: tokens.space(8),
  },
});

export default CombineShipmentsScreen;
