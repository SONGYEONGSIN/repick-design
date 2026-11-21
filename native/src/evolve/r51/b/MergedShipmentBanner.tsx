// native/src/evolve/r51/b/MergedShipmentBanner.tsx
//
// Post-action notice shown after a merge commits. It is rendered by the
// caller only when selectedCount === 0 AND a merge record exists, and
// MergeStatusBar is rendered only when selectedCount > 0 — those two
// conditions can never both be true at once, so this banner and the
// selection bar are structurally mutually exclusive, not just styled to
// look that way.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { formatWon, type CombineEstimate } from "./data";

type Props = {
  mergedItemCount: number;
  estimate: CombineEstimate;
  onUndo: () => void;
  onDismiss: () => void;
};

export function MergedShipmentBanner({ mergedItemCount, estimate, onUndo, onDismiss }: Props) {
  return (
    <View style={styles.banner} accessibilityLiveRegion="polite">
      <Text accessibilityRole="alert" style={styles.announceLine}>
        Combined {mergedItemCount} items into one shipment. Estimated shipping{" "}
        {formatWon(estimate.combinedCostWon)}
        {estimate.savingsWon > 0 ? ` — saved ${formatWon(estimate.savingsWon)}.` : "."}
      </Text>
      <View style={styles.actionRow}>
        <Pressable
          onPress={onUndo}
          accessibilityRole="button"
          accessibilityLabel="Undo combine"
          accessibilityHint="Splits the shipment back into separate pending items."
          style={({ pressed }) => [styles.undoButton, pressed && styles.undoButtonPressed]}
        >
          <Text style={styles.undoButtonLabel}>Undo</Text>
        </Pressable>
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          accessibilityHint="Hides this notice. The shipment stays combined."
          style={({ pressed }) => [styles.dismissButton, pressed && styles.dismissButtonPressed]}
        >
          <Text style={styles.dismissButtonLabel}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.successBorder,
    backgroundColor: tokens.color.successBg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  announceLine: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.ink,
    marginBottom: tokens.space(3),
    fontVariant: ["tabular-nums"],
  },
  actionRow: {
    flexDirection: "row",
  },
  undoButton: {
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.success,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    flex: 1,
    marginRight: tokens.space(3),
  },
  undoButtonPressed: {
    backgroundColor: tokens.color.successBorder,
  },
  undoButtonLabel: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
    color: tokens.color.success,
  },
  dismissButton: {
    minHeight: 44,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    flex: 1,
  },
  dismissButtonPressed: {
    backgroundColor: tokens.color.successBorder,
  },
  dismissButtonLabel: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
});

export default MergedShipmentBanner;
