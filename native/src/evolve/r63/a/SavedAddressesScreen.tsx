// native/src/evolve/r63/a/SavedAddressesScreen.tsx — auto-native-r63 candidate a.
//
// Saved Shipping Addresses: a buyer's address book. Each row can be deleted or
// promoted to default. Deletion never opens a native Alert or a modal — the row
// itself flips, in place, into a Cancel/Confirm surface (GENERATION.md §3-4:
// destructive-confirm row flip, generalized from band to per-row). There is no
// screen-level band at all; every confirmation is local to its own row.
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from "react-native";
import { tokens } from "../../../tokens";
import { INITIAL_ADDRESSES, INITIAL_DEFAULT_ADDRESS_ID, type SavedAddress } from "./data";

export default function SavedAddressesScreen() {
  const [addresses, setAddresses] = useState<readonly SavedAddress[]>(INITIAL_ADDRESSES);
  const [defaultAddressId, setDefaultAddressId] = useState<string>(INITIAL_DEFAULT_ADDRESS_ID);
  // The single row currently showing the Cancel/Confirm flip, or null when no
  // row is mid-confirmation. Only one row can be in this state at a time.
  const [rowPendingRemoval, setRowPendingRemoval] = useState<string | null>(null);

  const requestRemoval = useCallback((id: string) => {
    setRowPendingRemoval(id);
  }, []);

  const cancelRemoval = useCallback(() => {
    setRowPendingRemoval(null);
  }, []);

  const confirmRemoval = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((address) => address.id !== id));
    setRowPendingRemoval((current) => (current === id ? null : current));
    // If the removed address happened to be the default, nothing else is
    // promoted automatically — the buyer picks the next default explicitly
    // via "Set as default" on a remaining row.
  }, []);

  const makeDefault = useCallback((id: string) => {
    setDefaultAddressId(id);
  }, []);

  const keyExtractor = useCallback((item: SavedAddress) => item.id, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SavedAddress>) => (
      <AddressRow
        address={item}
        isDefault={item.id === defaultAddressId}
        isConfirmingRemoval={item.id === rowPendingRemoval}
        onRequestRemoval={requestRemoval}
        onCancelRemoval={cancelRemoval}
        onConfirmRemoval={confirmRemoval}
        onMakeDefault={makeDefault}
      />
    ),
    [defaultAddressId, rowPendingRemoval, requestRemoval, cancelRemoval, confirmRemoval, makeDefault]
  );

  const subheading = useMemo(() => {
    if (addresses.length === 0) return "No addresses saved";
    const plural = addresses.length === 1 ? "address" : "addresses";
    return `${addresses.length} saved ${plural}`;
  }, [addresses.length]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.headerBlock}>
        <Text accessibilityRole="header" style={styles.headerTitle}>
          Saved Shipping Addresses
        </Text>
        <Text style={styles.headerSubtitle}>{subheading}</Text>
      </View>
      <FlatList
        data={addresses}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No saved addresses</Text>
            <Text style={styles.emptyStateBody}>
              Addresses you remove from this list will show up here. Add a new shipping address
              from checkout to get started again.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

type AddressRowProps = {
  address: SavedAddress;
  isDefault: boolean;
  isConfirmingRemoval: boolean;
  onRequestRemoval: (id: string) => void;
  onCancelRemoval: () => void;
  onConfirmRemoval: (id: string) => void;
  onMakeDefault: (id: string) => void;
};

function AddressRow({
  address,
  isDefault,
  isConfirmingRemoval,
  onRequestRemoval,
  onCancelRemoval,
  onConfirmRemoval,
  onMakeDefault,
}: AddressRowProps) {
  if (isConfirmingRemoval) {
    // The row's own surface becomes the confirmation — no separate Alert, no
    // modal. The container carries the single live region for this row, and
    // only the confirmation sentence itself is announced as an alert.
    return (
      <View style={styles.confirmSurface} accessibilityLiveRegion="polite">
        <Text accessibilityRole="alert" style={styles.confirmPromptText}>
          Remove the {address.label} address for {address.recipientName}? This can't be undone.
        </Text>
        <View style={styles.confirmButtonRow}>
          <Pressable
            onPress={onCancelRemoval}
            accessibilityRole="button"
            accessibilityLabel={`Keep the ${address.label} address`}
            style={({ pressed }) => [styles.confirmKeepButton, pressed && styles.pressedDim]}
          >
            <Text style={styles.confirmKeepText}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={() => onConfirmRemoval(address.id)}
            accessibilityRole="button"
            accessibilityLabel={`Permanently remove the ${address.label} address`}
            style={({ pressed }) => [styles.confirmRemoveButton, pressed && styles.pressedDim]}
          >
            <Text style={styles.confirmRemoveText}>Confirm</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.addressCard}>
      <View style={styles.cardTopLine}>
        <Text style={styles.addressLabel}>{address.label}</Text>
        {isDefault ? (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Default</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.recipientLine}>{address.recipientName}</Text>
      <Text style={styles.streetLine}>{address.street}</Text>
      <Text style={styles.cityLine}>
        {address.city}, {address.region} {address.postalCode}
      </Text>
      <View style={styles.cardActionsRow}>
        {!isDefault ? (
          <Pressable
            onPress={() => onMakeDefault(address.id)}
            accessibilityRole="button"
            accessibilityLabel={`Set ${address.label} as the default shipping address`}
            style={({ pressed }) => [styles.setDefaultButton, pressed && styles.pressedDim]}
          >
            <Text style={styles.setDefaultText}>Set as default</Text>
          </Pressable>
        ) : (
          <View style={styles.setDefaultSpacer} />
        )}
        <Pressable
          onPress={() => onRequestRemoval(address.id)}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${address.label} address`}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.pressedDim]}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: tokens.color.bg,
  },
  headerBlock: {
    paddingHorizontal: tokens.space(5),
    paddingTop: tokens.space(4),
    paddingBottom: tokens.space(3),
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  headerSubtitle: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
  },
  listContent: {
    paddingHorizontal: tokens.space(5),
    paddingBottom: tokens.space(8),
    flexGrow: 1,
  },
  separator: {
    height: tokens.space(3),
  },
  addressCard: {
    borderWidth: 1,
    borderColor: tokens.color.border,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.color.bg,
    padding: tokens.space(4),
  },
  cardTopLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  defaultBadge: {
    backgroundColor: tokens.color.accentBg,
    borderRadius: tokens.radius.sm,
    paddingHorizontal: tokens.space(2),
    paddingVertical: tokens.space(1),
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: tokens.color.accent,
  },
  recipientLine: {
    marginTop: tokens.space(2),
    fontSize: 15,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  streetLine: {
    marginTop: tokens.space(1),
    fontSize: 14,
    color: tokens.color.muted,
  },
  cityLine: {
    fontSize: 14,
    color: tokens.color.muted,
  },
  cardActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: tokens.space(4),
    gap: tokens.space(3),
  },
  setDefaultButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(3),
  },
  setDefaultSpacer: {
    flex: 1,
  },
  setDefaultText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  deleteButton: {
    minHeight: 48,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.dangerBg,
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: tokens.space(3),
    paddingHorizontal: tokens.space(4),
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.danger,
  },
  confirmSurface: {
    borderWidth: 1,
    borderColor: tokens.color.dangerBorder,
    backgroundColor: tokens.color.dangerBg,
    borderRadius: tokens.radius.md,
    padding: tokens.space(4),
  },
  confirmPromptText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink,
    lineHeight: 20,
  },
  confirmButtonRow: {
    flexDirection: "row",
    marginTop: tokens.space(4),
    gap: tokens.space(3),
  },
  confirmKeepButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.border,
    backgroundColor: tokens.color.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: tokens.space(3),
  },
  confirmKeepText: {
    fontSize: 14,
    fontWeight: "600",
    color: tokens.color.ink2,
  },
  confirmRemoveButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: tokens.radius.sm,
    backgroundColor: tokens.color.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: tokens.space(3),
  },
  confirmRemoveText: {
    fontSize: 14,
    fontWeight: "700",
    color: tokens.color.onAccent,
  },
  pressedDim: {
    opacity: 0.7,
  },
  emptyState: {
    marginTop: tokens.space(8),
    paddingHorizontal: tokens.space(4),
    alignItems: "center",
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: tokens.color.ink,
  },
  emptyStateBody: {
    marginTop: tokens.space(2),
    fontSize: 14,
    color: tokens.color.muted,
    textAlign: "center",
  },
});
