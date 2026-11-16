// native/src/evolve/r58/c/SelectPickupLockerScreen.tsx
//
// "Select a Pickup Locker" — buyer chooses exactly one secure locker to pick
// up a purchased item from a short list of nearby options. Single-select
// (radio), not multi-select. See candidates/c.md for the full concept and
// the "Brief gaps" this screen had to resolve on its own.

import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { tokens } from "../../../tokens";
import {
  LOCKER_OPTIONS,
  LockerOption,
  LockerAvailability,
  ORDER_ITEM_LABEL,
  ORDER_ID,
} from "./data";

function availabilityLabel(availability: LockerAvailability, freeSlots: number): string {
  if (availability === "full") return "Currently full";
  if (availability === "limited") return `Limited · ${freeSlots} slot left`;
  return "Available";
}

function availabilityColors(availability: LockerAvailability) {
  if (availability === "full") {
    return {
      fg: tokens.color.danger,
      bg: tokens.color.dangerBg,
      border: tokens.color.dangerBorder,
    };
  }
  if (availability === "limited") {
    return {
      fg: tokens.color.warning,
      bg: tokens.color.warningBg,
      border: tokens.color.warningBorder,
    };
  }
  return {
    fg: tokens.color.success,
    bg: tokens.color.successBg,
    border: tokens.color.successBorder,
  };
}

export default function SelectPickupLockerScreen() {
  // Single id, not a Set — this is a true single-select (radio) choice.
  const [selectedLockerId, setSelectedLockerId] = useState<string | null>(null);
  // Set only by the terminal "Confirm pickup" action. Once non-null the whole
  // screen is finalized: the list becomes read-only and the band becomes a
  // read-only confirmation. We never keep a second "confirmed" boolean next
  // to this — every derived value below is computed fresh from these two ids.
  const [reservedLockerId, setReservedLockerId] = useState<string | null>(null);

  const isFinalized = reservedLockerId !== null;

  const selectedLocker = useMemo(
    () => LOCKER_OPTIONS.find((locker) => locker.id === selectedLockerId) ?? null,
    [selectedLockerId],
  );
  const reservedLocker = useMemo(
    () => LOCKER_OPTIONS.find((locker) => locker.id === reservedLockerId) ?? null,
    [reservedLockerId],
  );

  const handleSelectLocker = useCallback(
    (locker: LockerOption) => {
      if (isFinalized) return; // list is read-only after a reservation is made
      if (locker.availability === "full") return; // selectable-disabled: no-op
      setSelectedLockerId((current) => (current === locker.id ? current : locker.id));
    },
    [isFinalized],
  );

  const handleConfirm = useCallback(() => {
    if (isFinalized || !selectedLocker) return;
    setReservedLockerId(selectedLocker.id);
  }, [isFinalized, selectedLocker]);

  // Band headline/detail/action are derived fresh every render straight from
  // selectedLockerId / reservedLockerId above — never cached separately — so
  // the sentence can never drift out of sync with the actual selection.
  let bandHeadline: string;
  let bandDetail: string;
  if (reservedLocker) {
    bandHeadline = "Pickup locker reserved";
    bandDetail = `${reservedLocker.name} · ${reservedLocker.hours}`;
  } else if (selectedLocker) {
    bandHeadline = `Confirm pickup at ${selectedLocker.name}`;
    bandDetail = `${selectedLocker.address} · ${selectedLocker.hours}`;
  } else {
    bandHeadline = "Choose a locker below to continue";
    bandDetail = "Exactly one pickup locker must be selected to reserve this order.";
  }

  const renderItem = useCallback(
    ({ item }: { item: LockerOption }) => {
      const isFull = item.availability === "full";
      const isChecked = selectedLockerId === item.id;
      const isReservedRow = reservedLockerId === item.id;
      const rowDisabled = isFull || isFinalized;
      const colors = availabilityColors(item.availability);

      let label = `${item.name}. ${item.distanceMiles} miles away. ${item.hours}. ${availabilityLabel(item.availability, item.freeSlots)}.`;
      let hint: string | undefined;

      if (isFull) {
        label += " This locker is currently full.";
        hint = "This locker is full and can't be selected.";
      } else if (isFinalized) {
        label += isReservedRow
          ? " Reserved for this pickup."
          : " Unavailable — a locker has already been reserved for this order.";
        // No hint: nothing happens on press in the finalized phase, so we
        // say nothing about an action rather than leave a stale promise.
      } else {
        hint = "Double tap to select this locker for pickup.";
      }

      return (
        <Pressable
          onPress={() => handleSelectLocker(item)}
          disabled={rowDisabled}
          accessibilityRole="radio"
          accessibilityState={{ checked: isChecked || isReservedRow, disabled: rowDisabled }}
          accessibilityLabel={label}
          accessibilityHint={hint}
          style={({ pressed }) => [
            styles.row,
            isChecked && !isFinalized && styles.rowSelected,
            isReservedRow && styles.rowReserved,
            rowDisabled && !isReservedRow && styles.rowDisabled,
            pressed && !rowDisabled && styles.rowPressed,
          ]}
        >
          <View style={styles.rowRadioCol}>
            <View
              style={[
                styles.radioOuter,
                (isChecked || isReservedRow) && styles.radioOuterChecked,
              ]}
            >
              {(isChecked || isReservedRow) && <View style={styles.radioInner} />}
            </View>
          </View>

          <View style={styles.rowBody}>
            <Text style={styles.rowName}>{item.name}</Text>
            <Text style={styles.rowAddress}>{item.address}</Text>
            <View style={styles.rowMetaLine}>
              <Text style={[styles.rowMeta, styles.tabularNums]}>
                {item.distanceMiles} mi away
              </Text>
              <Text style={styles.rowMetaDot}>·</Text>
              <Text style={styles.rowMeta}>{item.hours}</Text>
            </View>
          </View>

          <View style={styles.rowBadgeCol}>
            {isReservedRow ? (
              <View style={[styles.badge, { backgroundColor: tokens.color.accentBg, borderColor: tokens.color.accent }]}>
                <Text style={[styles.badgeText, { color: tokens.color.accent }]}>Reserved</Text>
              </View>
            ) : (
              <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
                <Text style={[styles.badgeText, { color: colors.fg }]}>
                  {availabilityLabel(item.availability, item.freeSlots)}
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      );
    },
    [selectedLockerId, reservedLockerId, isFinalized, handleSelectLocker],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>
          Select a Pickup Locker
        </Text>
        <Text style={styles.subtitle}>
          {ORDER_ITEM_LABEL} · Order {ORDER_ID}
        </Text>
      </View>

      <Text style={styles.sectionLabel}>Nearby lockers</Text>

      <FlatList
        data={LOCKER_OPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={styles.list}
      />

      <View style={styles.band} accessibilityLiveRegion="polite">
        <Text accessibilityRole="alert" style={styles.bandHeadline}>
          {bandHeadline}
        </Text>
        <Text style={styles.bandDetail}>{bandDetail}</Text>

        {!reservedLocker && selectedLocker ? (
          <Pressable
            onPress={handleConfirm}
            accessibilityRole="button"
            accessibilityLabel={`Confirm pickup at ${selectedLocker.name}`}
            style={({ pressed }) => [styles.bandButton, pressed && styles.bandButtonPressed]}
          >
            <Text style={styles.bandButtonText}>Confirm pickup</Text>
          </Pressable>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  header: {
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(2),
    paddingBottom: tokens.space(1),
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  subtitle: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
  },
  sectionLabel: {
    marginTop: tokens.space(3),
    marginBottom: tokens.space(1),
    paddingHorizontal: tokens.space(4),
    fontSize: 13,
    fontWeight: "600",
    color: tokens.color.faint,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(4),
  },
  separator: {
    height: tokens.space(2),
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: tokens.color.bg,
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(3),
    minHeight: 44,
  },
  rowSelected: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  rowReserved: {
    borderColor: tokens.color.accent,
    backgroundColor: tokens.color.accentBg,
  },
  rowDisabled: {
    opacity: 0.5,
  },
  rowPressed: {
    opacity: 0.85,
  },
  rowRadioCol: {
    width: tokens.space(6),
    alignItems: "center",
    justifyContent: "center",
    paddingTop: tokens.space(1),
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterChecked: {
    borderColor: tokens.color.accent,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: tokens.color.accent,
  },
  rowBody: {
    flex: 1,
    paddingHorizontal: tokens.space(2),
  },
  rowName: {
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink,
  },
  rowAddress: {
    marginTop: 2,
    fontSize: 13,
    color: tokens.color.muted,
  },
  rowMetaLine: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.space(1),
  },
  rowMeta: {
    fontSize: 12,
    color: tokens.color.faint,
  },
  rowMetaDot: {
    fontSize: 12,
    color: tokens.color.faint,
    marginHorizontal: tokens.space(1),
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
  rowBadgeCol: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
  },
  badge: {
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1) / 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  band: {
    borderTopWidth: 1,
    borderTopColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    paddingHorizontal: tokens.space(4),
    paddingTop: tokens.space(3),
    paddingBottom: tokens.space(4),
  },
  bandHeadline: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  bandDetail: {
    marginTop: tokens.space(1) / 2,
    fontSize: 13,
    color: tokens.color.muted,
  },
  bandButton: {
    marginTop: tokens.space(3),
    minHeight: 44,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  bandButtonPressed: {
    opacity: 0.85,
  },
  bandButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
});
