// native/src/evolve/r51/b/ShipmentItemRow.tsx
//
// One pending-shipment row. The whole row is a single Pressable acting as
// a checkbox — there is no nested Pressable inside it, so there is nothing
// for a stray `accessible` prop to swallow; the check-glyph View is purely
// decorative and hidden from the accessibility tree instead.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { tokens } from "../../../tokens";
import { formatWon, formatWeight, type ShipmentItem } from "./data";

type Props = {
  item: ShipmentItem;
  isSelected: boolean;
  onToggle: (id: string) => void;
};

export function ShipmentItemRow({ item, isSelected, onToggle }: Props) {
  const disabled = !item.combineEligible;

  const label = disabled
    ? `${item.title}, from ${item.sellerName}. Not eligible to combine — this seller does not support combined shipments.`
    : `${item.title}, from ${item.sellerName}, ${formatWeight(item.weightGrams)}.`;

  return (
    <Pressable
      onPress={disabled ? undefined : () => onToggle(item.id)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isSelected, disabled }}
      accessibilityLabel={label}
      // Only promise the toggle behavior where it actually fires.
      accessibilityHint={disabled ? undefined : "Double tap to include this item in a combined shipment."}
      style={({ pressed }) => [
        styles.row,
        isSelected && styles.rowSelected,
        disabled && styles.rowDisabled,
        pressed && !disabled && styles.rowPressed,
      ]}
    >
      <View
        style={[styles.swatch, swatchFill(item.swatchIndex)]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />

      <View style={styles.body}>
        <Text style={[styles.title, disabled && styles.textMuted]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.meta}>
          {item.sellerName} · Order {item.orderId}
        </Text>
        <Text style={styles.meta}>
          {formatWeight(item.weightGrams)} · ships alone for {formatWon(item.standaloneShippingCostWon)}
        </Text>
        {disabled ? (
          <Text style={styles.ineligibleNote}>Not eligible to combine</Text>
        ) : null}
      </View>

      <View
        style={[styles.checkMark, isSelected && styles.checkMarkOn, disabled && styles.checkMarkDisabled]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {isSelected ? <Text style={styles.checkGlyph}>{"✓"}</Text> : null}
      </View>
    </Pressable>
  );
}

function swatchFill(index: 1 | 2 | 3) {
  if (index === 1) return { backgroundColor: tokens.color.swatch1 };
  if (index === 2) return { backgroundColor: tokens.color.swatch2 };
  return { backgroundColor: tokens.color.swatch3 };
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  rowSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  rowPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  rowDisabled: {
    backgroundColor: tokens.color.bg,
    borderColor: tokens.color.border,
    opacity: 0.6,
  },
  swatch: {
    width: 52,
    height: 52,
    borderRadius: tokens.radius.sm,
    marginRight: tokens.space(3),
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: tokens.color.ink,
    marginBottom: tokens.space(1),
  },
  meta: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  textMuted: {
    color: tokens.color.muted,
  },
  ineligibleNote: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.warning,
    marginTop: tokens.space(1),
  },
  checkMark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: tokens.space(2),
  },
  checkMarkOn: {
    backgroundColor: tokens.color.accent,
    borderColor: tokens.color.accent,
  },
  checkMarkDisabled: {
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  checkGlyph: {
    fontSize: 13,
    lineHeight: 13,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});

export default ShipmentItemRow;
