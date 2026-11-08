// native/src/evolve/r52/c/SplitDeliveryAddressesScreen.tsx — auto-native-r52
// candidate c.
//
// Split Delivery Addresses — a buyer who just checked out with several line
// items (some of them gifts) must point EACH item at one of their saved
// delivery addresses before the order can be confirmed.
//
// Before writing this, two neighboring catalog screens were read for
// precedent:
//   - r49/c SellerOnboardingChecklistScreen: a LINEAR checklist where every
//     row's status (done/current/locked) is derived from one array
//     (completedStepIds) plus the steps' fixed order — rows unlock strictly
//     in sequence, and only the single "current" row is ever actionable.
//   - r29/c & r34/b SavedAddressesScreen: how this app models a saved
//     address (label/recipientName/line1-2/cityStateZip) and the
//     in-row Cancel/Confirm swap used for a destructive action instead of
//     a native Alert.
//
// This screen keeps the first screen's PRINCIPLE — one piece of state
// drives every derived status, computed in one place — but the mechanic
// itself is a different shape, because the problem is different:
//   - There is no order among the five items. Any item can be assigned in
//     any sequence; assigning item #4 before item #2 is not an error, it's
//     normal. So there is no "current row" concept and nothing is ever
//     rendered as locked/disabled the way an un-reached onboarding step is.
//   - The one state field here (`assignments`, itemId -> addressId | null)
//     is not an append-only completion log like completedStepIds — it's a
//     map that can be set, changed, or cleared in any order and in either
//     direction, because re-pointing an already-assigned item at a
//     different address is a normal edit, not a step being "undone".
//   - The gate is a SET condition ("is every key's value non-null"), not a
//     sequence position. So the band below doesn't name a single next step
//     — it names how many items (out of the whole set) still lack a value,
//     and its one action jumps to whichever unassigned item the fixed item
//     order happens to reach first (a presentation tie-break, not a rule
//     the gate depends on).
//
// Everything else — which items are unassigned, which address (if any)
// backs an item, and the band's sentence — is derived from `assignments`
// in the one useMemo below; nothing duplicates that into a second,
// independently-settable boolean anywhere in this file.

import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  type ListRenderItemInfo,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  ORDER_ID,
  ORDER_ITEMS,
  DELIVERY_ADDRESSES,
  INITIAL_ASSIGNMENTS,
  findAddressById,
  formatWon,
  orderTotalWon,
  unassignedGateSentence,
  readyToConfirmSentence,
  orderConfirmedSentence,
  type OrderLineItem,
} from "./data";
import { LineItemAssignmentRow } from "./LineItemAssignmentRow";
import { DeliveryAssignmentBand } from "./DeliveryAssignmentBand";

type AssignmentMap = Record<string, string | null>;

export function SplitDeliveryAddressesScreen() {
  const [assignments, setAssignments] = useState<AssignmentMap>(() => ({
    ...INITIAL_ASSIGNMENTS,
  }));
  const [openPickerItemId, setOpenPickerItemId] = useState<string | null>(null);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

  const listRef = useRef<FlatList<OrderLineItem>>(null);

  const totalCount = ORDER_ITEMS.length;

  // The one derivation point: every row's "which address, if any" and the
  // band's "how many left" both read off this same pass over `assignments`.
  const { unassignedItemIds, unassignedCount, allItemsAssigned } = useMemo(() => {
    const unassigned = ORDER_ITEMS.filter((item) => !assignments[item.id]).map(
      (item) => item.id
    );
    return {
      unassignedItemIds: unassigned,
      unassignedCount: unassigned.length,
      allItemsAssigned: unassigned.length === 0,
    };
  }, [assignments]);

  const bandAnnouncement = useMemo(() => {
    if (isOrderConfirmed) return orderConfirmedSentence(totalCount);
    if (allItemsAssigned) return readyToConfirmSentence(totalCount);
    return unassignedGateSentence(unassignedCount, totalCount);
  }, [isOrderConfirmed, allItemsAssigned, unassignedCount, totalCount]);

  const handleTogglePicker = useCallback((itemId: string) => {
    setOpenPickerItemId((current) => (current === itemId ? null : itemId));
  }, []);

  const handleSelectAddress = useCallback((itemId: string, addressId: string) => {
    setAssignments((current) => ({ ...current, [itemId]: addressId }));
    setOpenPickerItemId(null);
  }, []);

  const handleClearAssignment = useCallback((itemId: string) => {
    setAssignments((current) => ({ ...current, [itemId]: null }));
  }, []);

  const handleJumpToNextUnassigned = useCallback(() => {
    const nextItemId = unassignedItemIds[0];
    if (!nextItemId) return;
    const index = ORDER_ITEMS.findIndex((item) => item.id === nextItemId);
    if (index === -1) return;
    setOpenPickerItemId(nextItemId);
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.15 });
    });
  }, [unassignedItemIds]);

  const handleScrollToIndexFailed = useCallback(
    (info: { index: number; averageItemLength: number }) => {
      // Rows change height when their picker opens/closes, so an estimated
      // scroll can miss on the first try — fall back to an offset estimate
      // instead of leaving the buyer stranded off-screen.
      listRef.current?.scrollToOffset({
        offset: info.averageItemLength * info.index,
        animated: true,
      });
    },
    []
  );

  const handleConfirmOrder = useCallback(() => {
    if (!allItemsAssigned) return;
    setIsOrderConfirmed(true);
    setOpenPickerItemId(null);
  }, [allItemsAssigned]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<OrderLineItem>) => (
      <LineItemAssignmentRow
        item={item}
        addresses={DELIVERY_ADDRESSES}
        assignedAddress={findAddressById(assignments[item.id] ?? null)}
        isPickerOpen={!isOrderConfirmed && openPickerItemId === item.id}
        onTogglePicker={handleTogglePicker}
        onSelectAddress={handleSelectAddress}
        onClearAssignment={handleClearAssignment}
      />
    ),
    [assignments, openPickerItemId, isOrderConfirmed, handleTogglePicker, handleSelectAddress, handleClearAssignment]
  );

  const header = (
    <View style={styles.headerBlock}>
      <Text accessibilityRole="header" style={styles.heading}>
        Split Delivery Addresses
      </Text>
      <Text style={styles.subheading}>
        Order {ORDER_ID} · {totalCount} items · {formatWon(orderTotalWon(ORDER_ITEMS))} total
      </Text>
      <Text style={styles.instructions}>
        Some of these items are gifts. Assign each item below to one of your
        saved addresses before you confirm the order.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        ref={listRef}
        data={ORDER_ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        extraData={[assignments, openPickerItemId, isOrderConfirmed]}
        ListHeaderComponent={header}
        contentContainerStyle={styles.listContent}
        onScrollToIndexFailed={handleScrollToIndexFailed}
      />

      <DeliveryAssignmentBand
        announcementText={bandAnnouncement}
        unassignedCount={unassignedCount}
        allItemsAssigned={allItemsAssigned}
        isOrderConfirmed={isOrderConfirmed}
        onJumpToNextUnassigned={handleJumpToNextUnassigned}
        onConfirmOrder={handleConfirmOrder}
      />
    </SafeAreaView>
  );
}

export default SplitDeliveryAddressesScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(4),
  },
  headerBlock: {
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(4),
  },
  heading: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subheading: {
    marginTop: tokens.space(2),
    fontSize: 13,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  instructions: {
    marginTop: tokens.space(2),
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.muted,
  },
});
