// native/src/evolve/r34/b/SavedAddressesScreen.tsx
//
// "Saved Shipping Addresses" — round auto-native-r34, candidate b.
// Row-level 3-state form: each row is independently normal / verifying / locked,
// with no fixed global bottom band. Destructive delete is confirmed in place
// (Cancel/Confirm swapped into the row itself) rather than a native Alert, and
// the same per-row live region used for state announcements also carries the
// delete-confirmation copy.

import React, { useCallback, useState } from "react";
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
  initialAddresses,
  newAddressTemplate,
  type AddressRecord,
  type AddressStatus,
} from "./data";

type RowMode = "idle" | "confirmingRemoval";

interface Row extends AddressRecord {
  mode: RowMode;
  announcement: string;
}

function baseAnnouncement(status: AddressStatus): string {
  if (status === "locked") {
    return "Primary address. New orders ship here unless a different address is chosen at checkout.";
  }
  if (status === "verifying") {
    return "This address was recently changed and is pending verification. Delivery confirmations are on hold until it clears.";
  }
  return "Saved address. No pending changes.";
}

function toRow(record: AddressRecord): Row {
  return { ...record, mode: "idle", announcement: baseAnnouncement(record.status) };
}

export function SavedAddressesScreen() {
  const [rows, setRows] = useState<Row[]>(() => initialAddresses.map(toRow));
  const [addedCount, setAddedCount] = useState(0);

  const handleAddAddress = useCallback(() => {
    setAddedCount((count) => {
      const nextCount = count + 1;
      const newRecord: AddressRecord = {
        id: `addr-new-${nextCount}`,
        label: nextCount === 1 ? "New Address" : `New Address ${nextCount}`,
        ...newAddressTemplate,
      };
      setRows((prev) => [...prev, toRow(newRecord)]);
      return nextCount;
    });
  }, []);

  const handleRemovePress = useCallback((id: string) => {
    setRows((prev) =>
      prev.map((row): Row => {
        if (row.id !== id) return row;
        if (row.status === "locked") {
          return {
            ...row,
            announcement:
              "This is your primary address, so it can't be removed from here. Set a different saved address as primary first, then return to remove this one.",
          };
        }
        return {
          ...row,
          mode: "confirmingRemoval",
          announcement: `Remove ${row.label}? This can't be undone.`,
        };
      })
    );
  }, []);

  const handleKeepAddress = useCallback((id: string) => {
    setRows((prev) =>
      prev.map((row): Row =>
        row.id === id
          ? { ...row, mode: "idle", announcement: "Removal canceled. This address was kept." }
          : row
      )
    );
  }, []);

  const handleConfirmRemoval = useCallback((id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Row }) => (
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <Text style={styles.label}>{item.label}</Text>
          {item.status === "locked" ? (
            <View style={styles.badgePrimary}>
              <Text style={styles.badgePrimaryText}>Primary</Text>
            </View>
          ) : null}
          {item.status === "verifying" ? (
            <View style={styles.badgePending}>
              <Text style={styles.badgePendingText}>Verifying</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.recipient}>{item.recipient}</Text>
        <Text style={styles.addressLine}>{item.line1}</Text>
        <Text style={styles.addressLine}>{item.line2}</Text>
        <Text style={styles.phone}>{item.phone}</Text>

        <View accessibilityLiveRegion="polite" style={styles.liveRegion}>
          <Text accessibilityRole="alert" style={styles.liveText}>
            {item.announcement}
          </Text>
        </View>

        {item.mode === "idle" ? (
          <View style={styles.actionRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Edit ${item.label} address`}
              onPress={() => {}}
              style={styles.actionButton}
              hitSlop={8}
            >
              <Text style={styles.actionButtonText}>Edit</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.label} address`}
              onPress={() => handleRemovePress(item.id)}
              style={styles.actionButtonDanger}
              hitSlop={8}
            >
              <Text style={styles.actionButtonDangerText}>Remove</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Keep ${item.label} address`}
              onPress={() => handleKeepAddress(item.id)}
              style={styles.actionButton}
              hitSlop={8}
            >
              <Text style={styles.actionButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Confirm removing ${item.label} address`}
              onPress={() => handleConfirmRemoval(item.id)}
              style={styles.actionButtonDanger}
              hitSlop={8}
            >
              <Text style={styles.actionButtonDangerText}>Confirm</Text>
            </Pressable>
          </View>
        )}
      </View>
    ),
    [handleRemovePress, handleKeepAddress, handleConfirmRemoval]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text accessibilityRole="header" style={styles.title}>
              Saved Shipping Addresses
            </Text>
            <Text style={styles.subtitle}>
              Manage the addresses your shipments and returns can use.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add a new shipping address"
              onPress={handleAddAddress}
              style={styles.addButton}
              hitSlop={8}
            >
              <Text style={styles.addButtonText}>Add address</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

export default SavedAddressesScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  listContent: {
    paddingHorizontal: tokens.space(4),
    paddingBottom: tokens.space(8),
  },
  header: {
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(4),
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
  addButton: {
    marginTop: tokens.space(4),
    alignSelf: "flex-start",
    minHeight: 44,
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
    backgroundColor: tokens.color.accent,
    borderRadius: tokens.radius.md,
  },
  addButtonText: {
    color: tokens.color.onAccent,
    fontSize: 15,
    fontWeight: "600",
  },
  card: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
    marginBottom: tokens.space(3),
    backgroundColor: tokens.color.bg,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space(2),
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  badgePrimary: {
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    backgroundColor: tokens.color.accentBg,
  },
  badgePrimaryText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  badgePending: {
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
    backgroundColor: tokens.color.warningBg,
    borderWidth: 1,
    borderColor: tokens.color.warningBorder,
  },
  badgePendingText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.warning,
  },
  recipient: {
    marginTop: tokens.space(2),
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  addressLine: {
    marginTop: tokens.space(1) / 2,
    fontSize: 14,
    color: tokens.color.muted,
  },
  phone: {
    marginTop: tokens.space(1) / 2,
    fontSize: 13,
    color: tokens.color.faint,
    fontVariant: ["tabular-nums"],
  },
  liveRegion: {
    marginTop: tokens.space(3),
  },
  liveText: {
    fontSize: 13,
    color: tokens.color.ink2,
  },
  actionRow: {
    flexDirection: "row",
    gap: tokens.space(3),
    marginTop: tokens.space(3),
  },
  actionButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  actionButtonDanger: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: tokens.space(4),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
  },
  actionButtonDangerText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.danger,
  },
});
