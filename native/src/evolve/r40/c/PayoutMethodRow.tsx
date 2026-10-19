// native/src/evolve/r40/c/PayoutMethodRow.tsx
//
// Presentational row for a single linked payout method inside the
// Payout Method Order screen's FlatList. Pure props in, no local state —
// the "Primary" badge is driven entirely by `positionIndex === 0`, passed
// down from the parent's working order, never a separately hand-set flag.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import type { PayoutMethodProfile } from "./data";

export interface PayoutMethodRowProps {
  profile: PayoutMethodProfile;
  positionIndex: number;
  totalMethodCount: number;
  onRequestMoveUp: () => void;
  onRequestMoveDown: () => void;
  moveUpIsDisabled: boolean;
  moveDownIsDisabled: boolean;
}

export function PayoutMethodRow({
  profile,
  positionIndex,
  totalMethodCount,
  onRequestMoveUp,
  onRequestMoveDown,
  moveUpIsDisabled,
  moveDownIsDisabled,
}: PayoutMethodRowProps) {
  const isCurrentlyPrimary = positionIndex === 0;
  const positionLabel = `Position ${positionIndex + 1} of ${totalMethodCount}`;

  return (
    <View style={styles.rowCard}>
      <View style={styles.rowTopLine}>
        <View style={styles.rowIdentityBlock}>
          <View style={styles.rowNameLine}>
            <Text style={styles.rowDisplayName}>{profile.displayName}</Text>
            {isCurrentlyPrimary ? (
              <View style={styles.primaryBadge}>
                <Text style={styles.primaryBadgeText}>Primary</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.rowMaskedIdentifier}>
            {profile.maskedIdentifier}
          </Text>
        </View>
        <View style={styles.kindTagChip}>
          <Text style={styles.kindTagChipText}>{profile.kindTag}</Text>
        </View>
      </View>

      <View style={styles.rowBottomLine}>
        <Text style={styles.positionCaption}>{positionLabel}</Text>
        <View style={styles.reorderControls}>
          <Pressable
            onPress={onRequestMoveUp}
            disabled={moveUpIsDisabled}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={`Move ${profile.displayName} up`}
            accessibilityState={{ disabled: moveUpIsDisabled }}
            accessibilityHint={
              moveUpIsDisabled
                ? undefined
                : `Moves ${profile.displayName} one position earlier in the payout order.`
            }
            style={({ pressed }) => [
              styles.reorderButton,
              styles.reorderButtonSpacing,
              moveUpIsDisabled && styles.reorderButtonDisabled,
              pressed && !moveUpIsDisabled && styles.reorderButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.reorderButtonText,
                moveUpIsDisabled && styles.reorderButtonTextDisabled,
              ]}
            >
              Move Up
            </Text>
          </Pressable>
          <Pressable
            onPress={onRequestMoveDown}
            disabled={moveDownIsDisabled}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={`Move ${profile.displayName} down`}
            accessibilityState={{ disabled: moveDownIsDisabled }}
            accessibilityHint={
              moveDownIsDisabled
                ? undefined
                : `Moves ${profile.displayName} one position later in the payout order.`
            }
            style={({ pressed }) => [
              styles.reorderButton,
              moveDownIsDisabled && styles.reorderButtonDisabled,
              pressed && !moveDownIsDisabled && styles.reorderButtonPressed,
            ]}
          >
            <Text
              style={[
                styles.reorderButtonText,
                moveDownIsDisabled && styles.reorderButtonTextDisabled,
              ]}
            >
              Move Down
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
  },
  rowTopLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: tokens.space(2),
  },
  rowIdentityBlock: {
    flex: 1,
  },
  rowNameLine: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: tokens.space(2),
    marginBottom: tokens.space(1),
  },
  rowDisplayName: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  primaryBadge: {
    borderWidth: 1,
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.sm,
    paddingVertical: 2,
    paddingHorizontal: tokens.space(2),
  },
  primaryBadgeText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
    color: tokens.color.accent,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  rowMaskedIdentifier: {
    fontSize: 14,
    lineHeight: 20,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  kindTagChip: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    paddingVertical: 2,
    paddingHorizontal: tokens.space(2),
  },
  kindTagChipText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  rowBottomLine: {
    marginTop: tokens.space(3),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: tokens.space(2),
  },
  positionCaption: {
    fontSize: 12,
    lineHeight: 16,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  reorderControls: {
    flexDirection: "row",
  },
  reorderButton: {
    minHeight: 44,
    minWidth: 96,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space(3),
  },
  reorderButtonSpacing: {
    marginRight: tokens.space(2),
  },
  reorderButtonDisabled: {
    backgroundColor: tokens.color.accentBg,
    borderColor: tokens.color.border,
    opacity: 0.5,
  },
  reorderButtonPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  reorderButtonText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  reorderButtonTextDisabled: {
    color: tokens.color.faint,
  },
});

export default PayoutMethodRow;
