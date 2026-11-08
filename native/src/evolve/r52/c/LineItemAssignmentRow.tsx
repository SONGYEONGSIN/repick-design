// native/src/evolve/r52/c/LineItemAssignmentRow.tsx
//
// One order line item. Deliberately NOT a single opaque Pressable wrapping
// everything — this row needs its inline address picker to stay reachable
// to a screen reader even while collapsed/expanded, so nothing here ever
// sets `accessible` on a wrapper View. The only two kinds of accessible
// elements in this file are leaf Text nodes and individual Pressables
// (the expand/collapse toggle, and — once expanded — each address option
// plus the clear-assignment control), each labeled on itself.

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { tokens } from "../../../tokens";
import {
  assignedAddressSummary,
  formatWon,
  quantityLabel,
  type DeliveryAddressOption,
  type OrderLineItem,
} from "./data";

function AddressAssignedMark() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" fill={tokens.color.success} />
      <Path
        d="M7 12.5l3.2 3.2L17.5 8.3"
        stroke={tokens.color.onAccent}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function AddressMissingMark() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24">
      <Circle cx="12" cy="12" r="10" stroke={tokens.color.warning} strokeWidth={2} fill="none" />
      <Path d="M12 7v6" stroke={tokens.color.warning} strokeWidth={2.2} strokeLinecap="round" />
      <Circle cx="12" cy="16.6" r="1.1" fill={tokens.color.warning} />
    </Svg>
  );
}

function swatchFill(index: 1 | 2 | 3) {
  if (index === 1) return { backgroundColor: tokens.color.swatch1 };
  if (index === 2) return { backgroundColor: tokens.color.swatch2 };
  return { backgroundColor: tokens.color.swatch3 };
}

type Props = {
  item: OrderLineItem;
  addresses: DeliveryAddressOption[];
  assignedAddress: DeliveryAddressOption | null;
  isPickerOpen: boolean;
  isOrderConfirmed: boolean;
  onTogglePicker: (itemId: string) => void;
  onSelectAddress: (itemId: string, addressId: string) => void;
  onClearAssignment: (itemId: string) => void;
};

export function LineItemAssignmentRow({
  item,
  addresses,
  assignedAddress,
  isPickerOpen,
  isOrderConfirmed,
  onTogglePicker,
  onSelectAddress,
  onClearAssignment,
}: Props) {
  const toggleLabel = assignedAddress ? "Change address" : "Choose address";
  // Once the order is confirmed, every row's address is final — the picker
  // can never open again. The toggle must say so (both visually and via
  // accessibilityState.disabled) instead of staying tappable with a hint
  // that promises an expand/collapse that can no longer happen.
  const toggleAccessibilityLabel = isOrderConfirmed
    ? `Delivery address locked for ${item.title} — order already confirmed`
    : isPickerOpen
    ? `Hide address choices for ${item.title}`
    : assignedAddress
    ? `Change delivery address for ${item.title}`
    : `Choose a delivery address for ${item.title}`;
  const toggleAccessibilityHint = isOrderConfirmed
    ? undefined
    : isPickerOpen
    ? "Collapses the list of saved addresses for this item."
    : "Expands a list of your saved addresses to choose from.";

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View
          style={[styles.swatch, swatchFill(item.swatchIndex)]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.itemMeta}>
            {quantityLabel(item.quantity)} · {formatWon(item.priceWon)}
          </Text>
        </View>
      </View>

      <View style={styles.statusLine}>
        {assignedAddress ? <AddressAssignedMark /> : <AddressMissingMark />}
        <Text
          style={[
            styles.statusText,
            assignedAddress ? styles.statusTextAssigned : styles.statusTextMissing,
          ]}
        >
          {assignedAddress
            ? `Ships to ${assignedAddressSummary(assignedAddress)}`
            : "No delivery address assigned yet"}
        </Text>
      </View>

      <Pressable
        onPress={() => onTogglePicker(item.id)}
        disabled={isOrderConfirmed}
        accessibilityRole="button"
        accessibilityLabel={toggleAccessibilityLabel}
        accessibilityHint={toggleAccessibilityHint}
        accessibilityState={{ expanded: isPickerOpen, disabled: isOrderConfirmed }}
        hitSlop={8}
        style={({ pressed }) => [
          styles.toggleButton,
          assignedAddress ? styles.toggleButtonSecondary : styles.toggleButtonPrimary,
          pressed && styles.toggleButtonPressed,
          isOrderConfirmed && styles.toggleButtonLocked,
        ]}
      >
        <Text
          style={[
            assignedAddress ? styles.toggleButtonTextSecondary : styles.toggleButtonTextPrimary,
            isOrderConfirmed && styles.toggleButtonTextLocked,
          ]}
        >
          {isOrderConfirmed ? "Locked" : toggleLabel}
        </Text>
      </Pressable>

      {isPickerOpen ? (
        <View style={styles.pickerBlock}>
          <Text style={styles.pickerLabel}>Select a delivery address</Text>
          {addresses.map((address) => {
            const isChecked = assignedAddress?.id === address.id;
            return (
              <Pressable
                key={address.id}
                onPress={() => onSelectAddress(item.id, address.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: isChecked }}
                accessibilityLabel={`${address.label}, ${address.recipientName}, ${address.line1}${
                  address.line2 ? `, ${address.line2}` : ""
                }, ${address.cityStateZip}`}
                accessibilityHint="Assigns this item to ship to this address."
                hitSlop={4}
                style={({ pressed }) => [
                  styles.addressOption,
                  isChecked && styles.addressOptionChecked,
                  pressed && styles.addressOptionPressed,
                ]}
              >
                <View style={styles.addressOptionText}>
                  <Text style={styles.addressOptionLabel}>{address.label}</Text>
                  <Text style={styles.addressOptionLine}>{address.recipientName}</Text>
                  <Text style={styles.addressOptionLine}>{address.line1}</Text>
                  {address.line2 ? (
                    <Text style={styles.addressOptionLine}>{address.line2}</Text>
                  ) : null}
                  <Text style={styles.addressOptionLine}>{address.cityStateZip}</Text>
                </View>
                {isChecked ? <AddressAssignedMark /> : null}
              </Pressable>
            );
          })}

          {assignedAddress ? (
            <Pressable
              onPress={() => onClearAssignment(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Remove address assignment for ${item.title}`}
              accessibilityHint="Leaves this item without a delivery address assigned."
              hitSlop={8}
              style={({ pressed }) => [
                styles.clearButton,
                pressed && styles.clearButtonPressed,
              ]}
            >
              <Text style={styles.clearButtonText}>Clear assignment</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export default LineItemAssignmentRow;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.sm,
    marginRight: tokens.space(3),
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  itemMeta: {
    marginTop: tokens.space(1) / 2,
    fontSize: 13,
    color: tokens.color.muted,
    fontVariant: ["tabular-nums"],
  },
  statusLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: tokens.space(2),
    marginTop: tokens.space(3),
  },
  statusText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  statusTextAssigned: {
    color: tokens.color.ink2,
  },
  statusTextMissing: {
    color: tokens.color.warning,
  },
  toggleButton: {
    marginTop: tokens.space(3),
    minHeight: 44,
    alignSelf: "flex-start",
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
    borderRadius: tokens.radius.sm,
  },
  toggleButtonPrimary: {
    backgroundColor: tokens.color.accent,
  },
  toggleButtonSecondary: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  toggleButtonPressed: {
    opacity: 0.85,
  },
  toggleButtonLocked: {
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    opacity: 0.6,
  },
  toggleButtonTextPrimary: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  toggleButtonTextSecondary: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink2,
  },
  toggleButtonTextLocked: {
    color: tokens.color.faint,
  },
  pickerBlock: {
    marginTop: tokens.space(4),
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    paddingTop: tokens.space(3),
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    color: tokens.color.faint,
    marginBottom: tokens.space(2),
  },
  addressOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.sm,
    padding: tokens.space(3),
    marginBottom: tokens.space(2),
    minHeight: 44,
  },
  addressOptionChecked: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  addressOptionPressed: {
    backgroundColor: tokens.color.accentBg,
  },
  addressOptionText: {
    flex: 1,
    marginRight: tokens.space(2),
  },
  addressOptionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.ink,
    marginBottom: tokens.space(1) / 2,
  },
  addressOptionLine: {
    fontSize: 12,
    lineHeight: 17,
    color: tokens.color.muted,
  },
  clearButton: {
    marginTop: tokens.space(1),
    minHeight: 44,
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingHorizontal: tokens.space(2),
  },
  clearButtonPressed: {
    opacity: 0.7,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.danger,
  },
});
