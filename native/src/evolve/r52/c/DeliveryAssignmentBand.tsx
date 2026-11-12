// native/src/evolve/r52/c/DeliveryAssignmentBand.tsx
//
// The bottom band for a non-linear, set-based gate: completion here is
// "every item in an unordered set has a property set", not "the next step
// in a locked sequence is done". So unlike a step-chain band, this band
// never names a *single* next step — it names a *count* of items still
// missing an address, and its one non-Confirm action jumps the buyer to
// whichever of those items the fixed item order reaches first. That
// "first in fixed order" choice is just a tie-break for presenting one
// useful jump target, not a sequencing rule the gate itself depends on —
// any remaining item can still be filled in any order.
//
// Exactly one accessibilityLiveRegion lives on this whole screen, and it's
// here: the sentence inside it is always rendered (never conditionally
// unmounted) so a screen reader hears the new wording the moment the set of
// unassigned items changes, confirmed or not.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";

type Props = {
  announcementText: string;
  unassignedCount: number;
  allItemsAssigned: boolean;
  isOrderConfirmed: boolean;
  onJumpToNextUnassigned: () => void;
  onConfirmOrder: () => void;
};

export function DeliveryAssignmentBand({
  announcementText,
  unassignedCount,
  allItemsAssigned,
  isOrderConfirmed,
  onJumpToNextUnassigned,
  onConfirmOrder,
}: Props) {
  return (
    <View style={styles.band}>
      <View accessibilityLiveRegion="polite" style={styles.liveRegion}>
        <Text accessibilityRole="alert" style={styles.announcementText}>
          {announcementText}
        </Text>
      </View>

      {isOrderConfirmed ? null : (
        <View style={styles.actionRow}>
          {allItemsAssigned ? null : (
            <Pressable
              onPress={onJumpToNextUnassigned}
              accessibilityRole="button"
              accessibilityLabel="Go to next item needing an address"
              accessibilityHint="Scrolls to the next item without a delivery address and opens its address picker."
              hitSlop={8}
              style={({ pressed }) => [
                styles.jumpButton,
                pressed && styles.jumpButtonPressed,
              ]}
            >
              <Text style={styles.jumpButtonText}>
                Next item ({unassignedCount} left)
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={allItemsAssigned ? onConfirmOrder : undefined}
            disabled={!allItemsAssigned}
            accessibilityRole="button"
            accessibilityLabel={
              allItemsAssigned
                ? "Confirm order"
                : `Confirm order, disabled, ${unassignedCount} item${
                    unassignedCount === 1 ? "" : "s"
                  } still need an address`
            }
            accessibilityHint={allItemsAssigned ? "Confirms this order for shipping." : undefined}
            accessibilityState={{ disabled: !allItemsAssigned }}
            hitSlop={8}
            style={({ pressed }) => [
              styles.confirmButton,
              allItemsAssigned ? styles.confirmButtonEnabled : styles.confirmButtonDisabled,
              allItemsAssigned && pressed && styles.confirmButtonPressed,
            ]}
          >
            <Text
              style={
                allItemsAssigned ? styles.confirmButtonTextEnabled : styles.confirmButtonTextDisabled
              }
            >
              Confirm Order
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default DeliveryAssignmentBand;

const styles = StyleSheet.create({
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(5),
  },
  liveRegion: {
    minHeight: 18,
  },
  announcementText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  actionRow: {
    flexDirection: "row",
    gap: tokens.space(3),
    marginTop: tokens.space(3),
  },
  jumpButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  jumpButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  jumpButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
    fontVariant: ["tabular-nums"],
  },
  confirmButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
  },
  confirmButtonEnabled: {
    backgroundColor: tokens.color.accent,
  },
  confirmButtonDisabled: {
    backgroundColor: tokens.color.border,
  },
  confirmButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  confirmButtonTextEnabled: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  confirmButtonTextDisabled: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.faint,
  },
});
