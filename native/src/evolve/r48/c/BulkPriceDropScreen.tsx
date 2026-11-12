// native/src/evolve/r48/c/BulkPriceDropScreen.tsx
// Bulk Price Drop — a seller multi-selects several active listings from a
// 2-column grid and applies one percentage discount to all of them at once.
//
// State model:
//   - selectedListingIds: ids the seller has toggled on, awaiting a discount.
//     `hasSelection` is derived from this array's length directly in render,
//     never tracked as a separate boolean flag.
//   - listingDiscounts: a map of listingId -> the discount that was applied
//     to it. An entry here is this screen's third, persistent cell state —
//     applying a discount removes the id from `selectedListingIds` and adds
//     it here, it never just vanishes from the grid.
//   - revertTargetId: the SINGLE shared id (or null) of the one cell, if
//     any, currently showing its inline "Confirm revert? / Cancel" pair.
//     Because only one id can live in this slot, only one cell can ever be
//     mid-revert-confirmation at a time.

import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  ACTIVE_LISTINGS,
  ActiveListing,
  DISCOUNT_PRESETS,
  applyDiscountToCents,
} from "./data";
import { PriceDropGridCell, AppliedDiscount } from "./PriceDropGridCell";

type DiscountMap = Record<string, AppliedDiscount>;

export default function BulkPriceDropScreen() {
  const [selectedListingIds, setSelectedListingIds] = useState<string[]>([]);
  const [listingDiscounts, setListingDiscounts] = useState<DiscountMap>({});
  const [revertTargetId, setRevertTargetId] = useState<string | null>(null);

  // Derived directly in render — not a separately tracked imperative flag.
  const hasSelection = selectedListingIds.length > 0;

  const toggleListingSelected = useCallback((id: string) => {
    setSelectedListingIds((current) =>
      current.includes(id)
        ? current.filter((existingId) => existingId !== id)
        : [...current, id]
    );
  }, []);

  const applyPresetToSelection = useCallback(
    (percentOff: number) => {
      setListingDiscounts((current) => {
        const next: DiscountMap = { ...current };
        for (const id of selectedListingIds) {
          const listing = ACTIVE_LISTINGS.find((entry) => entry.id === id);
          if (!listing) continue;
          next[id] = {
            percentOff,
            newPriceCents: applyDiscountToCents(
              listing.originalPriceCents,
              percentOff
            ),
          };
        }
        return next;
      });
      // Applied items leave the "selected" pool and move into their own
      // persistent discounted state, which also naturally hides the bar
      // once nothing is left selected.
      setSelectedListingIds([]);
    },
    [selectedListingIds]
  );

  const requestCellRevert = useCallback((id: string) => {
    setRevertTargetId(id);
  }, []);

  const cancelCellRevert = useCallback(() => {
    setRevertTargetId(null);
  }, []);

  const confirmCellRevert = useCallback((id: string) => {
    setListingDiscounts((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setRevertTargetId((current) => (current === id ? null : current));
  }, []);

  const renderListingCell = useCallback(
    ({ item }: ListRenderItemInfo<ActiveListing>) => (
      <PriceDropGridCell
        listing={item}
        isSelected={selectedListingIds.includes(item.id)}
        appliedDiscount={listingDiscounts[item.id] ?? null}
        isRevertPending={revertTargetId === item.id}
        onToggleSelected={() => toggleListingSelected(item.id)}
        onRequestRevert={() => requestCellRevert(item.id)}
        onCancelRevert={cancelCellRevert}
        onConfirmRevert={() => confirmCellRevert(item.id)}
      />
    ),
    [
      selectedListingIds,
      listingDiscounts,
      revertTargetId,
      toggleListingSelected,
      requestCellRevert,
      cancelCellRevert,
      confirmCellRevert,
    ]
  );

  const selectionCountLabel = useMemo(
    () =>
      `${selectedListingIds.length} ${
        selectedListingIds.length === 1 ? "item" : "items"
      } selected`,
    [selectedListingIds.length]
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerBlock}>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Bulk Price Drop
        </Text>
        <Text style={styles.headerSubtitle}>
          Select listings below, then apply one discount to all of them at
          once.
        </Text>
      </View>

      <FlatList
        style={styles.gridList}
        data={ACTIVE_LISTINGS}
        keyExtractor={(item) => item.id}
        renderItem={renderListingCell}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={[
          styles.gridContent,
          hasSelection ? styles.gridContentWithBar : null,
        ]}
      />

      {hasSelection ? (
        <View
          style={styles.contextBar}
          accessibilityLiveRegion="polite"
          importantForAccessibility="yes"
        >
          <Text style={styles.contextCountText} accessibilityRole="alert">
            {selectionCountLabel}
          </Text>
          <Text style={styles.contextHelperText}>
            Apply a discount to all selected listings
          </Text>
          <View style={styles.presetRow}>
            {DISCOUNT_PRESETS.map((percentOff) => (
              <Pressable
                key={percentOff}
                style={styles.presetChip}
                accessibilityRole="button"
                accessibilityLabel={`Apply a ${percentOff} percent discount to ${selectedListingIds.length} selected listings`}
                onPress={() => applyPresetToSelection(percentOff)}
              >
                <Text style={styles.presetChipText}>{`-${percentOff}%`}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  headerBlock: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(3),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  headerSubtitle: {
    marginTop: tokens.space(1),
    fontSize: 13,
    color: tokens.color.muted,
  },
  gridList: {
    flex: 1,
  },
  gridRow: {
    gap: tokens.space(3),
    paddingHorizontal: tokens.space(4),
  },
  gridContent: {
    gap: tokens.space(3),
    paddingBottom: tokens.space(6),
  },
  gridContentWithBar: {
    paddingBottom: tokens.space(32),
  },
  contextBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.color.ink,
    borderTopLeftRadius: tokens.radius.md,
    borderTopRightRadius: tokens.radius.md,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(5),
  },
  contextCountText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onInk,
  },
  contextHelperText: {
    marginTop: tokens.space(1) / 2,
    fontSize: 12,
    color: tokens.color.onInkMuted,
  },
  presetRow: {
    flexDirection: "row",
    gap: tokens.space(2),
    marginTop: tokens.space(3),
  },
  presetChip: {
    flex: 1,
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.sm,
    paddingVertical: tokens.space(2),
    alignItems: "center",
  },
  presetChipText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
