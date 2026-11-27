// native/src/evolve/r51/b/MergeStatusBar.tsx
//
// The selection-count-derived contextual bar. It is mounted by the caller
// only while selectedCount > 0 (derived from selection state, never its own
// open/closed flag) and unmounts itself the instant the caller's count
// drops back to 0 — there is no local "visible" state to get out of sync.
//
// Also hosts the destructive-style confirm flip: instead of a native
// Alert, `stage` swaps this same already-live-tagged surface between its
// normal one-button form and a two-button Cancel/Confirm form.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { formatWon, MIN_MERGE_COUNT, type CombineEstimate } from "./data";

export type MergeStage = "selecting" | "confirming";

type Props = {
  selectedCount: number;
  canMerge: boolean;
  stage: MergeStage;
  estimate: CombineEstimate;
  announcement: string;
  onRequestConfirm: () => void;
  onCancelConfirm: () => void;
  onCommitMerge: () => void;
};

export function MergeStatusBar({
  selectedCount,
  canMerge,
  stage,
  estimate,
  announcement,
  onRequestConfirm,
  onCancelConfirm,
  onCommitMerge,
}: Props) {
  return (
    <View style={styles.bar} accessibilityLiveRegion="polite">
      <Text accessibilityRole="alert" style={styles.announceLine}>
        {announcement}
      </Text>

      {stage === "confirming" ? (
        <View style={styles.confirmRow}>
          <Pressable
            onPress={onCancelConfirm}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            accessibilityHint="Keeps the items selected without combining them."
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
          >
            <Text style={styles.secondaryButtonLabel}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={onCommitMerge}
            accessibilityRole="button"
            accessibilityLabel="Confirm combine"
            accessibilityHint="Combines the selected items into one shipment."
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          >
            <Text style={styles.primaryButtonLabel}>Confirm</Text>
          </Pressable>
        </View>
      ) : canMerge ? (
        <Pressable
          onPress={onRequestConfirm}
          accessibilityRole="button"
          accessibilityLabel="Combine shipments"
          accessibilityHint="Opens a confirmation step to merge the selected items into one shipment."
          style={({ pressed }) => [styles.primaryButton, styles.fullWidthButton, pressed && styles.primaryButtonPressed]}
        >
          <Text style={styles.primaryButtonLabel}>
            Combine {selectedCount} Items · {formatWon(estimate.combinedCostWon)}
          </Text>
        </Pressable>
      ) : (
        <Text style={styles.promptLine}>
          Select {MIN_MERGE_COUNT - selectedCount} more item
          {MIN_MERGE_COUNT - selectedCount === 1 ? "" : "s"} to combine shipments.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
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
  promptLine: {
    fontSize: 14,
    lineHeight: 21,
    color: tokens.color.muted,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    flex: 1,
  },
  fullWidthButton: {
    flex: undefined,
  },
  primaryButtonPressed: {
    backgroundColor: tokens.color.ink2,
  },
  primaryButtonLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: tokens.color.onAccent,
    fontVariant: ["tabular-nums"],
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(4),
    flex: 1,
    marginRight: tokens.space(3),
  },
  secondaryButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  secondaryButtonLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  confirmRow: {
    flexDirection: "row",
  },
});

export default MergeStatusBar;
